import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { signToken, setAuthCookies } from "@/lib/jwt"
import { getAll, insert } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()

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
      existingUser = localUsers.find((u: any) => u.email?.toLowerCase() === lowerEmail) || null
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // 4. Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 12)

    // 5. Create user in MongoDB (if connected)
    let newUser: any = null
    if (isDbConnected) {
      try {
        newUser = await User.create({
          name,
          email: lowerEmail,
          password: hashedPassword,
          role: "user",
          status: "active",
        })
      } catch (e) {
        console.error("MongoDB creation failed in signup:", e)
      }
    }

    // 6. Always sync to local JSON DB as fallback
    const localId = `u${Date.now()}`
    const localUser = {
      id: newUser?._id?.toString() || localId,
      name,
      email: lowerEmail,
      password: hashedPassword,
      role: "user",
      status: "active",
    }
    insert("users", localUser)

    // 7. Ensure a consistent user object for token generation
    const userForToken = newUser || localUser

    // 8. Generate JWT token
    const token = await signToken({
      userId: (userForToken._id || userForToken.id).toString(),
      email: userForToken.email,
      role: userForToken.role,
    })

    // 9. Set HTTP-only cookie
    await setAuthCookies(token)

    return NextResponse.json(
      {
        message: "Signup successful",
        access_token: token,
        token_type: "bearer",
        user: {
          id: (userForToken._id || userForToken.id).toString(),
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
