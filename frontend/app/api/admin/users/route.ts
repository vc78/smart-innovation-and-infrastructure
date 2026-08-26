import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { getAll, updateWhere, deleteWhere, insert } from "@/lib/db"
import { logActivity } from "@/lib/activity-logger"

export async function GET() {
  try {
    let mongoUsers: any[] = []
    let isDbConnected = false

    try {
      const conn = await dbConnect()
      if (conn) {
        isDbConnected = true
        mongoUsers = await User.find({}).lean()
      }
    } catch (e) {
      // Silently fall back to JSON DB
    }

    const localUsers = getAll("users") || []
    const projects = getAll("projects") || []
    const logs = getAll("activity_logs") || []

    // Merge users from MongoDB and local JSON store, deduplicating by email
    const mergedUserMap = new Map<string, any>()

    localUsers.forEach((u: any) => {
      const emailKey = (u.email || "").trim().toLowerCase()
      if (emailKey) {
        mergedUserMap.set(emailKey, {
          id: (u.id || u._id || `u_${Date.now()}`).toString(),
          name: u.name || "User",
          email: u.email,
          role: u.role || "user",
          status: u.status || "active",
          created_at: u.created_at || new Date().toISOString(),
        })
      }
    })

    if (isDbConnected && mongoUsers.length > 0) {
      mongoUsers.forEach((u: any) => {
        const emailKey = (u.email || "").trim().toLowerCase()
        if (emailKey) {
          const existing = mergedUserMap.get(emailKey)
          mergedUserMap.set(emailKey, {
            id: (u._id || u.id || existing?.id || `u_${Date.now()}`).toString(),
            name: u.name || existing?.name || "User",
            email: u.email,
            role: u.role || existing?.role || "user",
            status: u.status || existing?.status || "active",
            created_at: u.createdAt ? new Date(u.createdAt).toISOString() : existing?.created_at || new Date().toISOString(),
          })
        }
      })
    }

    const enrichedUsers = Array.from(mergedUserMap.values()).map((user: any) => {
      const userIdStr = (user.id || "").toString()
      const userLogs = logs.filter(
        (l: any) =>
          (l.user_id || "").toString() === userIdStr ||
          (l.user_email || "").toLowerCase() === (user.email || "").toLowerCase()
      )

      const lastActive = userLogs
        .map((l: any) => new Date(l.timestamp || 0))
        .filter((d: Date) => !Number.isNaN(d.getTime()))
        .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0]

      const userProjects = projects.filter(
        (p: any) =>
          (p.user_id || "").toString() === userIdStr ||
          (p.user_email || "").toLowerCase() === (user.email || "").toLowerCase()
      )

      return {
        ...user,
        projects_count: userProjects.length,
        last_active: lastActive ? lastActive.toISOString() : user.created_at || null,
        recent_actions: userLogs.slice(0, 5),
      }
    })

    return NextResponse.json({ users: enrichedUsers }, { status: 200 })
  } catch (err: any) {
    console.error("Admin GET users error:", err)
    return NextResponse.json({ error: "Failed to fetch users", users: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const { action, userId, role, status, name, email, password } = payload

    let isDbConnected = false
    try {
      const conn = await dbConnect()
      if (conn) isDbConnected = true
    } catch (e) {
      // MongoDB optional
    }

    // 1. Create New User
    if (action === "create-user" || action === "create-admin") {
      if (!name || !email || !password) {
        return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
      }

      const normalizedEmail = email.trim().toLowerCase()
      const cleanName = name.trim()
      const chosenRole = (role || (action === "create-admin" ? "admin" : "user")).toLowerCase()
      const chosenStatus = (status || "active").toLowerCase()

      // Check existence in local DB
      const localUsers = getAll("users") || []
      const existsLocal = localUsers.some((u: any) => (u.email || "").trim().toLowerCase() === normalizedEmail)

      // Check existence in MongoDB
      let existsMongo = false
      if (isDbConnected) {
        try {
          const mUser = await User.findOne({ email: normalizedEmail })
          if (mUser) existsMongo = true
        } catch (e) {
          console.error("MongoDB check error:", e)
        }
      }

      if (existsLocal || existsMongo) {
        return NextResponse.json({ error: "A user with this email address already exists" }, { status: 409 })
      }

      const hashedPassword = await bcrypt.hash(password.trim(), 12)

      // Save to MongoDB if connected
      let mongoUser: any = null
      if (isDbConnected) {
        try {
          mongoUser = await User.create({
            name: cleanName,
            email: normalizedEmail,
            password: hashedPassword,
            role: chosenRole,
            status: chosenStatus,
          })
        } catch (e) {
          console.error("MongoDB creation error:", e)
        }
      }

      // Always save to local JSON DB
      const localId = mongoUser?._id?.toString() || `u_${Date.now()}`
      const newLocalUser = {
        id: localId,
        name: cleanName,
        email: normalizedEmail,
        password: hashedPassword,
        role: chosenRole,
        status: chosenStatus,
        created_at: new Date().toISOString(),
      }

      insert("users", newLocalUser)

      logActivity({
        user_id: "admin",
        user_name: "Administrator",
        action: `Admin Created New User: ${cleanName} (${normalizedEmail})`,
        category: "admin",
        details: `Assigned role: ${chosenRole}, status: ${chosenStatus}`,
      })

      return NextResponse.json(
        {
          success: true,
          message: "User created successfully",
          user: {
            id: localId,
            name: cleanName,
            email: normalizedEmail,
            role: chosenRole,
            status: chosenStatus,
            created_at: newLocalUser.created_at,
          },
        },
        { status: 201 }
      )
    }

    // 2. Update Status (Active / Suspended)
    if (action === "update-status" || action === "block" || action === "unblock") {
      const newStatus = action === "block" ? "suspended" : action === "unblock" ? "active" : (status || "active").toLowerCase()

      updateWhere(
        "users",
        (u) => (u.id || u._id || "").toString() === userId?.toString() || (u.email || "").toLowerCase() === (email || "").toLowerCase(),
        (u) => ({
          ...u,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
      )

      if (isDbConnected) {
        try {
          await User.updateOne(
            { $or: [{ _id: userId }, { email: (email || "").toLowerCase() }] },
            { $set: { status: newStatus } }
          )
        } catch (e) {
          console.error("MongoDB update status error:", e)
        }
      }

      logActivity({
        user_id: "admin",
        user_name: "Administrator",
        action: `Admin Updated User Status: User ${userId || email} -> ${newStatus}`,
        category: "admin",
        details: `Status set to ${newStatus}`,
      })

      return NextResponse.json({ success: true, message: `Status updated to ${newStatus}` })
    }

    // 3. Update Role (User / Admin / Contractor)
    if (action === "update-role") {
      if (!role) {
        return NextResponse.json({ error: "Role is required" }, { status: 400 })
      }
      const newRole = role.toLowerCase()

      updateWhere(
        "users",
        (u) => (u.id || u._id || "").toString() === userId?.toString() || (u.email || "").toLowerCase() === (email || "").toLowerCase(),
        (u) => ({
          ...u,
          role: newRole,
          updated_at: new Date().toISOString(),
        })
      )

      if (isDbConnected) {
        try {
          await User.updateOne(
            { $or: [{ _id: userId }, { email: (email || "").toLowerCase() }] },
            { $set: { role: newRole } }
          )
        } catch (e) {
          console.error("MongoDB update role error:", e)
        }
      }

      logActivity({
        user_id: "admin",
        user_name: "Administrator",
        action: `Admin Updated User Role: User ${userId || email} -> ${newRole}`,
        category: "admin",
        details: `Role updated to ${newRole}`,
      })

      return NextResponse.json({ success: true, message: `Role updated to ${newRole}` })
    }

    // 4. Delete User
    if (action === "delete") {
      deleteWhere(
        "users",
        (u) => (u.id || u._id || "").toString() === userId?.toString() || (u.email || "").toLowerCase() === (email || "").toLowerCase()
      )

      if (isDbConnected) {
        try {
          await User.deleteOne({ $or: [{ _id: userId }, { email: (email || "").toLowerCase() }] })
        } catch (e) {
          console.error("MongoDB delete error:", e)
        }
      }

      logActivity({
        user_id: "admin",
        user_name: "Administrator",
        action: `Admin Deleted User: ID ${userId}`,
        category: "admin",
        details: "User deleted from system",
      })

      return NextResponse.json({ success: true, message: "User deleted successfully" })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (err: any) {
    console.error("Admin POST users error:", err)
    return NextResponse.json({ error: "Failed to process request: " + (err.message || "") }, { status: 500 })
  }
}
