import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { insert, getAll } from "@/lib/db"
import { calculateProjectEstimate } from "@/lib/cost-engine"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const plotArea = parseFloat(data.plot_area || "1200")
    const floors = parseInt(data.floors || "1")

    // Run authoritative server-side calculation engine
    const estimation = calculateProjectEstimate({
      builtUpAreaSqft: plotArea,
      floors,
      tier: data.construction_grade === "premium" ? "Premium" : data.construction_grade === "luxury" ? "Luxury" : "Standard",
      location: data.location || "Hyderabad",
    })

    const newProject = {
      id: randomUUID(),
      user_id: data.user_id || "demo-user",
      project_name: data.project_name || "New Smart Project",
      floors,
      location: data.location || "Hyderabad",
      plot_area: plotArea,
      construction_type: data.construction_type || "RCC Frame",
      materials: data.materials || "standard",
      amenities: data.amenities || [],
      construction_grade: data.construction_grade || "standard",
      building_type: data.building_type || "residential",
      interior_preference: data.interior_preference || "modern",
      exterior_type: data.exterior_type || "contemporary",
      status: "PLANNING",
      total_estimate_inr: estimation.totalEstimateINR,
      rate_per_sqft: estimation.finalRatePerSqft,
      breakdown: estimation.breakdown,
      boq_items: estimation.boqItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    insert("projects", newProject)

    return NextResponse.json({ success: true, project: newProject, estimation })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET() {
  const projects = getAll("projects")
  return NextResponse.json({ success: true, projects })
}
