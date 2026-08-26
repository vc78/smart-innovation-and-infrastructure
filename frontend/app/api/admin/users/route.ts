import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getAll, updateWhere, deleteWhere, insert } from "@/lib/db"
import { logActivity } from "@/lib/activity-logger"

export async function GET() {
  try {
    const users = getAll("users") || []
    const projects = getAll("projects") || []
    const logs = getAll("activity_logs") || []

    const enrichedUsers = users.map((user: any) => {
      const userIdStr = (user.id || user._id || "").toString()
      const userLogs = logs.filter((l: any) => (l.user_id || "").toString() === userIdStr)
      
      const lastActive = userLogs
        .map((l: any) => new Date(l.timestamp || 0))
        .filter((d: Date) => !Number.isNaN(d.getTime()))
        .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0]

      const userProjects = projects.filter((p: any) => (p.user_id || "").toString() === userIdStr)

      return {
        id: userIdStr,
        name: user.name || "Unknown User",
        email: user.email || "",
        role: user.role || "user",
        status: user.status || "active",
        created_at: user.created_at || new Date().toISOString(),
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

    if (action === "update-status" || action === "block" || action === "unblock") {
      const newStatus = action === "block" ? "suspended" : action === "unblock" ? "active" : status || "active"
      updateWhere("users", (u) => (u.id || u._id || "").toString() === userId?.toString(), (u) => ({
        ...u,
        status: newStatus,
        updated_at: new Date().toISOString(),
      }))

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Changed User Status: User ${userId} -> ${newStatus}`,
        category: "admin",
        details: `Status updated to ${newStatus}`,
      })

      return NextResponse.json({ success: true, message: `User status changed to ${newStatus}` })
    }

    if (action === "update-role") {
      if (!role) {
        return NextResponse.json({ error: "Role is required" }, { status: 400 })
      }
      updateWhere("users", (u) => (u.id || u._id || "").toString() === userId?.toString(), (u) => ({
        ...u,
        role: role.toLowerCase(),
        updated_at: new Date().toISOString(),
      }))

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Changed User Role: User ${userId} -> ${role}`,
        category: "admin",
        details: `Role updated to ${role}`,
      })

      return NextResponse.json({ success: true, message: `User role updated to ${role}` })
    }

    if (action === "delete") {
      deleteWhere("users", (u) => (u.id || u._id || "").toString() === userId?.toString())

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Deleted User: ID ${userId}`,
        category: "admin",
        details: `User permanently removed from system`,
      })

      return NextResponse.json({ success: true, message: "User deleted successfully" })
    }

    if (action === "create-user" || action === "create-admin") {
      if (!name || !email || !password) {
        return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
      }

      const normalizedEmail = email.trim().toLowerCase()
      const users = getAll("users") || []

      const exists = users.some((u: any) => u.email?.trim().toLowerCase() === normalizedEmail)
      if (exists) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
      }

      const hashedPassword = await bcrypt.hash(password.trim(), 10)
      const newUser = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: role || (action === "create-admin" ? "admin" : "user"),
        status: status || "active",
        created_at: new Date().toISOString(),
      }

      insert("users", newUser)

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Created New User: ${newUser.name} (${newUser.email}, ${newUser.role})`,
        category: "admin",
        details: `Account provisioned with ${newUser.role} role`,
      })

      return NextResponse.json({ success: true, user: { ...newUser, password: undefined } }, { status: 201 })
    }

    if (action === "edit-user") {
      updateWhere("users", (u) => (u.id || u._id || "").toString() === userId?.toString(), (u) => ({
        ...u,
        name: name ? name.trim() : u.name,
        email: email ? email.trim().toLowerCase() : u.email,
        role: role ? role.toLowerCase() : u.role,
        status: status || u.status,
        updated_at: new Date().toISOString(),
      }))

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Edited User Details: ID ${userId}`,
        category: "admin",
        details: `Updated name/email/role for user ${userId}`,
      })

      return NextResponse.json({ success: true, message: "User updated successfully" })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (err: any) {
    console.error("Admin POST users error:", err)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
