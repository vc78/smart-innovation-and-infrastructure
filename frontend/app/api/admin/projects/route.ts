import { NextResponse } from "next/server"
import { getAll, deleteWhere, updateWhere } from "@/lib/db"
import { logActivity } from "@/lib/activity-logger"

export async function GET() {
  try {
    const projects = getAll("projects") || []
    const users = getAll("users") || []

    const enrichedProjects = projects.map((p: any) => {
      const user = users.find((u: any) => (u.id || u._id || "").toString() === (p.user_id || "").toString())
      return {
        ...p,
        user_name: user?.name || "Unknown User",
        user_email: user?.email || "",
      }
    }).sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

    return NextResponse.json({ projects: enrichedProjects }, { status: 200 })
  } catch (err) {
    console.error("Admin GET projects error:", err)
    return NextResponse.json({ error: "Failed to load projects", projects: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const { action, projectId, status, contractorId } = payload

    if (action === "update-status") {
      updateWhere("projects", (p) => (p.id || p._id || "").toString() === projectId?.toString(), (p) => ({
        ...p,
        status,
        updated_at: new Date().toISOString(),
      }))

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Updated Project Status: Project ${projectId} -> ${status}`,
        category: "project",
        details: `Status set to ${status}`,
      })

      return NextResponse.json({ success: true, message: `Project status set to ${status}` })
    }

    if (action === "assign-contractor") {
      updateWhere("projects", (p) => (p.id || p._id || "").toString() === projectId?.toString(), (p) => ({
        ...p,
        assigned_contractor_id: contractorId,
        updated_at: new Date().toISOString(),
      }))

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Assigned Contractor ${contractorId} to Project ${projectId}`,
        category: "project",
        details: `Contractor assigned`,
      })

      return NextResponse.json({ success: true, message: "Contractor assigned" })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (err) {
    console.error("Admin POST projects error:", err)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (id) {
      deleteWhere("projects", (p) => (p.id || p._id || "").toString() === id.toString())

      logActivity({
        user_id: "admin",
        user_name: "Admin",
        action: `Admin Deleted Project: ID ${id}`,
        category: "project",
        details: "Project permanently removed",
      })
    }
    return NextResponse.json({ success: true, message: "Project deleted" })
  } catch (err) {
    console.error("Admin DELETE project error:", err)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
