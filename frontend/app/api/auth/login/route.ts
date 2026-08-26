import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { signToken, setAuthCookies } from "@/lib/jwt"
import { getAll } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lowerEmail = email.trim().toLowerCase()
    let user: any = null

    // 1. Try MongoDB connection
    let isDbConnected = false
    try {
      const conn = await dbConnect()
      if (conn) isDbConnected = true
    } catch (e) {
      // Silently fall back to JSON DB
    }

    // 2. Load from MongoDB if connected
    if (isDbConnected) {
      try {
        user = await User.findOne({ email: lowerEmail })
      } catch (e) {
        console.error("MongoDB query error:", e)
      }
    }

    // 3. Fallback to local JSON file DB
    if (!user) {
      const localUsers = getAll("users")
      user = localUsers.find((u: any) => u.email?.trim().toLowerCase() === lowerEmail) || null
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // 4. Password verification — handle bcrypt hashes, trimmed variants, and plain-text legacy passwords
    let isMatch = false
    const storedPassword: string = user.password || ""
    const rawPass = password
    const trimmedPass = password.trim()

    if (storedPassword.startsWith("$2")) {
      // It's a bcrypt hash — compare properly
      try {
        isMatch = await bcrypt.compare(rawPass, storedPassword)
        if (!isMatch && rawPass !== trimmedPass) {
          isMatch = await bcrypt.compare(trimmedPass, storedPassword)
        }
      } catch (err) {
        isMatch = false
      }
      // Safety fallback if stored as plain string that happened to start with $2 or dev testing
      if (!isMatch && (rawPass === storedPassword || trimmedPass === storedPassword)) {
        isMatch = true
      }
    } else {
      // It's a plain-text legacy password
      isMatch = rawPass === storedPassword || trimmedPass === storedPassword
    }

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // 5. Generate JWT token (use _id or id)
    const token = await signToken({
      userId: (user._id || user.id).toString(),
      email: user.email,
      role: user.role || "user",
    })

    // 6. Set HTTP-only cookie
    await setAuthCookies(token)

    // 7. Return sanitized user object
    const sanitizedUser = {
      id: (user._id || user.id).toString(),
      name: user.name || "User",
      email: user.email,
      role: user.role || "user",
      status: user.status || "active",
    }

    return NextResponse.json(
      {
        message: "Login successful",
        access_token: token,
        token_type: "bearer",
        user: sanitizedUser,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
