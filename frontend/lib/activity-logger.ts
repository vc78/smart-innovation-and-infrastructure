import { insert, getAll } from "@/lib/db"

export interface ActivityLogEntry {
  id?: string
  user_id: string
  user_name?: string
  user_email?: string
  action: string
  category: "auth" | "project" | "ai" | "admin" | "material" | "vastu" | "system"
  details?: string
  ip_address?: string
  timestamp?: string
}

export function logActivity(entry: Omit<ActivityLogEntry, "id" | "timestamp">) {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const newLog: ActivityLogEntry = {
      id: logId,
      user_id: entry.user_id || "guest",
      user_name: entry.user_name || "User",
      user_email: entry.user_email || "",
      action: entry.action,
      category: entry.category || "system",
      details: entry.details || "",
      ip_address: entry.ip_address || "127.0.0.1",
      timestamp: new Date().toISOString(),
    }

    insert("activity_logs", newLog)
    return newLog
  } catch (err) {
    console.error("Failed to log activity:", err)
    return null
  }
}

export function getRecentActivities(limit: number = 50): ActivityLogEntry[] {
  try {
    const logs = getAll("activity_logs") || []
    return logs
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (err) {
    console.error("Failed to fetch activity logs:", err)
    return []
  }
}
