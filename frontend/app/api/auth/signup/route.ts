import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { signToken, setAuthCookies } from "@/lib/jwt"
import { getAll, insert } from "@/lib/db"
import { logActivity } from "@/lib/activity-logger"

export async function POST(req: Request) {
  try {
    const { name, email, password, role = "user" } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lowerEmail = email.trim().toLowerCase()
    const cleanName = name.trim()

    // 1. Try MongoDB connection
    let isDbConnected = false
    try {
      await dbConnect()
      isDbConnected = true
    } catch (e) {
      console.warn("MongoDB connection failed in signup, using fallback.")
    }

    // 2. Check if user already exists in MongoDB
    let existingUser = null
    if (isDbConnected) {
      try {
        existingUser = await User.findOne({ email: lowerEmail })
      } catch (e) {
        console.error("MongoDB check failed in signup:", e)
      }
    }

    // 3. Fallback check from local JSON DB
    if (!existingUser) {
      const localUsers = getAll("users")
      existingUser = localUsers.find((u: any) => u.email?.trim().toLowerCase() === lowerEmail) || null
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // 4. Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password.trim(), 12)

    // 5. Create user in MongoDB (if connected)
    let newUser: any = null
    if (isDbConnected) {
      try {
        newUser = await User.create({
          name: cleanName,
          email: lowerEmail,
          password: hashedPassword,
          role,
          status: "active",
        })
      } catch (e) {
        console.error("MongoDB creation failed in signup:", e)
      }
    }

    // 6. Always sync to local JSON DB as fallback
    const localId = `u_${Date.now()}`
    const localUser = {
      id: newUser?._id?.toString() || localId,
      name: cleanName,
      email: lowerEmail,
      password: hashedPassword,
      role,
      status: "active",
      created_at: new Date().toISOString(),
    }
    insert("users", localUser)

    const userForToken = newUser || localUser
    const finalUserId = (userForToken._id || userForToken.id).toString()

    // 7. Generate JWT token
    const token = await signToken({
      userId: finalUserId,
      email: userForToken.email,
      role: userForToken.role,
    })

    // 8. Set HTTP-only cookie
    await setAuthCookies(token)

    // 9. Log activity
    logActivity({
      user_id: finalUserId,
      user_name: cleanName,
      user_email: lowerEmail,
      action: `New User Registration: ${cleanName} (${lowerEmail})`,
      category: "auth",
      details: `New account created with role ${role}`,
    })

    return NextResponse.json(
      {
        message: "Signup successful",
        access_token: token,
        token_type: "bearer",
        user: {
          id: finalUserId,
          name: userForToken.name,
          email: userForToken.email,
          role: userForToken.role,
          status: userForToken.status,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
