import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
  try {
    const logs = getAll("activity_logs") || []
    const users = getAll("users") || []
    
    const enrichedLogs = logs.map((l: any) => {
      const user = users.find((u: any) => (u.id || u._id || "").toString() === (l.user_id || "").toString())
      return {
        ...l,
        user_name: l.user_name || user?.name || "System / Guest",
        user_email: l.user_email || user?.email || "",
      }
    }).sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())

    return NextResponse.json({ logs: enrichedLogs }, { status: 200 })
  } catch (err) {
    console.error("Admin GET logs error:", err)
    return NextResponse.json({ error: "Failed to fetch logs", logs: [] }, { status: 500 })
  }
}
