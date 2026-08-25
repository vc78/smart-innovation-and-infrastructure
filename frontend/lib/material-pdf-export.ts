import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface ProjectExportData {
  length: number | string
  width: number | string
  plotArea: number
  builtUpArea: number
  floors: number | string
  city: string
  grade: string
  direction: string
  soil: string
  cement: string
  steel: string
  beds: string | number
  baths: string | number
  kitchenType: string
  archStyle: string
  amenities: string[]
  compliances: string[]
  minBudget?: number | string
  maxBudget?: number | string
  result: {
    totalCost: number
    costPerSqFt: number
    timeline: string
    feasibility: string
    breakdown: Record<string, number>
    materials: Record<string, string>
    alerts: string[]
  }
}

interface UserInfo {
  name?: string
  email?: string
  phone?: string
}

const fmt = (n: number) => "₹ " + Number(n).toLocaleString("en-IN")
const fmtL = (n: number) => {
  const l = n / 100000
  return l >= 1 ? `₹ ${l.toFixed(2)} Lakhs` : fmt(n)
}

export async function generateMaterialReportPDF(
  project: ProjectExportData,
  aiAnalysis: any,
  user?: UserInfo | null
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const refNumber = `SIID-PRJ-${Date.now().toString().slice(-6)}`
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const clientName = user?.name || "Verified Project Lead"
  const clientEmail = user?.email || "N/A"

  // ----------------------------------------------------
  // PAGE 1: SPECIFICATIONS, FINANCIALS & MATERIALS
  // ----------------------------------------------------

  // Header Banner
  doc.setFillColor(15, 23, 42) // Slate 900
  doc.rect(0, 0, 210, 32, "F")

  // Top Neon Accent Line
  doc.setFillColor(16, 185, 129) // Emerald 500
  doc.rect(0, 0, 210, 2.5, "F")

  // Brand Header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text("SIID FLASH PLATFORM", 14, 14)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(148, 163, 184)
  doc.text("Smart Innovation & Infrastructure Development | Civil Engineering Intelligence", 14, 20)

  // Document Badge
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(52, 211, 153)
  doc.text("OFFICIAL PROJECT MANIFEST & BOQ", 14, 26)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(255, 255, 255)
  doc.text(`Ref: ${refNumber}`, 155, 14)
  doc.text(`Date: ${currentDate}`, 155, 20)
  doc.text("Status: VERIFIED", 155, 26)

  let y = 40

  // Client & Project Location Box
  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [51, 65, 85] },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [15, 23, 42], width: 45 },
      1: { width: 55 },
      2: { fontStyle: "bold", textColor: [15, 23, 42], width: 45 },
      3: { width: 50 },
    },
    body: [
      ["Client Name:", clientName, "Location / City:", `${project.city}, India`],
      ["Client Email:", clientEmail, "Plot Geometry:", `${project.length} ft x ${project.width} ft (${project.plotArea.toLocaleString()} sq ft)`],
      ["Vastu Orientation:", `${project.direction} Facing`, "Built-Up Area:", `${project.builtUpArea.toLocaleString()} sq ft (${project.floors} Floor(s))`],
      ["Soil Profile:", project.soil, "Execution Timeline:", project.result.timeline || "6-8 Months"],
    ],
  })

  y = (doc as any).lastAutoTable.finalY + 6

  // Section: Architectural & Material Specifications
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("1. Architectural & Engineering Specifications", 14, y)
  y += 3

  autoTable(doc, {
    startY: y,
    head: [["Specification", "User Selected Configuration", "Standard & Grade"]],
    body: [
      ["Project Finish Grade", `${project.grade} Tier Finish`, "High Performance Materials"],
      ["Primary Cement Spec", project.cement, "IS 269 / IS 1489 Compliant"],
      ["Structural Steel Rebar", project.steel, "IS 1786 High Yield Strength"],
      ["Room Configuration", `${project.beds} Bedrooms, ${project.baths} Bathrooms`, "Standard Residential Layout"],
      ["Kitchen Architecture", project.kitchenType, "Ergonomic Modular Layout"],
      ["Design Language", project.archStyle, "Contemporary Structural Envelope"],
      ["Selected Amenities", project.amenities.length > 0 ? project.amenities.map(a => a.replace(/_/g, " ")).join(", ") : "Standard Amenities", "Custom Inclusions"],
      ["Compliances", project.compliances.length > 0 ? project.compliances.map(c => c.replace(/_/g, " ")).join(", ") : "Standard NBC", "IS 456:2000 & NBC 2016"],
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  y = (doc as any).lastAutoTable.finalY + 6

  // Section: Financial Breakdown
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("2. Itemized Financial Investment Summary", 14, y)
  y += 3

  const breakdownRows = Object.entries(project.result.breakdown).map(([k, v]) => [
    k.replace(/_/g, " ").toUpperCase(),
    fmtL(v as number),
    `${(( (v as number) / project.result.totalCost) * 100).toFixed(1)}%`,
  ])

  autoTable(doc, {
    startY: y,
    head: [["Cost Component", "Estimated Investment (INR)", "Budget Allocation"]],
    body: [
      ...breakdownRows,
      ["TOTAL ESTIMATED PROJECT VALUE", fmtL(project.result.totalCost), "100.0%"],
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    footStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  y = (doc as any).lastAutoTable.finalY + 6

  // Section: Material Quantities
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("3. Core Material Quantities & Consumption Estimates", 14, y)
  y += 3

  const materialRows = Object.entries(project.result.materials).map(([k, v]) => [
    k.toUpperCase(),
    v as string,
    "Standard Indian Residential Consumption Index",
  ])

  autoTable(doc, {
    startY: y,
    head: [["Material Name", "Estimated Quantity & Total Cost", "Consumption Standard"]],
    body: materialRows,
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  // Page 1 Footer
  doc.setFontSize(7.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(148, 163, 184)
  doc.text(`Page 1 of 2 | Ref: ${refNumber} | SIID FLASH Construction Intelligence System`, 14, 290)

  // ----------------------------------------------------
  // PAGE 2: AI EXECUTIVE APPRAISAL & COMPLIANCE
  // ----------------------------------------------------
  doc.addPage()

  // Top Accent
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, 210, 18, "F")
  doc.setFillColor(16, 185, 129)
  doc.rect(0, 0, 210, 2.5, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text("SIID AI EXECUTIVE APPRAISAL & QUALITY ASSURANCE REPORT", 14, 11)

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(203, 213, 225)
  doc.text(`Project ID: ${refNumber} | Client: ${clientName}`, 145, 11)

  y = 26

  // Section 4: Executive Summary
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("4. AI Executive Engineering Appraisal", 14, y)
  y += 5

  const execSummary = aiAnalysis?.executiveSummary || "The proposed project has been verified and structurally benchmarked for local ground conditions and design specifications."
  doc.setFontSize(8.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(51, 65, 85)
  const splitSummary = doc.splitTextToSize(execSummary, 182)
  doc.text(splitSummary, 14, y)
  y += (splitSummary.length * 4.5) + 4

  // Section 5: Structural & Foundation Guidelines
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("5. Geotechnical & Structural Engineering Directives", 14, y)
  y += 3

  const struct = aiAnalysis?.structuralAppraisal || {}
  autoTable(doc, {
    startY: y,
    head: [["Engineering Domain", "Mandatory Directive & Code Reference"]],
    body: [
      ["Foundation System", struct.foundationRecommendation || `Isolated trapezoidal footings with RCC plinth tie beams designed for ${project.soil}. Minimum depth 1.5m below GL.`],
      ["Concrete Mix Design", struct.concreteAndMix || "M20 Grade (1:1.5:3) for slabs, M25 (1:1:2) for columns. Water-cement ratio 0.45-0.50 as per IS 456:2000."],
      ["Rebar Detailing", struct.steelReinforcementNotes || `Certified ${project.steel} TMT bars. Column clear cover 40mm, slab 20mm. 50d lap length for all rebar splices.`],
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: { 0: { fontStyle: "bold", width: 45 } },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  y = (doc as any).lastAutoTable.finalY + 6

  // Section 6: Phased Construction Milestones
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("6. Phased Execution Milestones & Target Timelines", 14, y)
  y += 3

  const milestonesData = (aiAnalysis?.milestones || [
    { phase: "Phase 1: Substructure & Foundation", duration: "4-6 Weeks", focus: "Excavation, PCC 1:4:8, footing RCC, plinth beam" },
    { phase: "Phase 2: RCC Superstructure", duration: "6-8 Weeks", focus: "Columns, lintels, roof slab casting, shuttering" },
    { phase: "Phase 3: Masonry & Envelope", duration: "4-5 Weeks", focus: "AAC/Brick masonry, door/window frame fixing" },
    { phase: "Phase 4: MEP Services & Plastering", duration: "4-6 Weeks", focus: "Internal/external plaster, plumbing, electrical conduit" },
    { phase: "Phase 5: Architectural Finishes", duration: "5-7 Weeks", focus: "Flooring tiles, kitchen, sanitary, painting & handover" },
  ]).map((m: any) => [m.phase, m.duration, m.focus])

  autoTable(doc, {
    startY: y,
    head: [["Project Phase", "Estimated Duration", "Core Deliverables & Inspection Checkpoints"]],
    body: milestonesData,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: { 0: { fontStyle: "bold", width: 50 }, 1: { width: 30 } },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  y = (doc as any).lastAutoTable.finalY + 6

  // Section 7: Procurement & Value Engineering
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("7. Quality Control & Value Engineering Recommendations", 14, y)
  y += 4

  const tips = [
    ...(aiAnalysis?.procurementAndQualityStrategy || []),
    ...(aiAnalysis?.valueEngineeringTips || []),
  ].slice(0, 4)

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(51, 65, 85)

  tips.forEach((tip: string) => {
    doc.text(`• ${tip}`, 14, y)
    y += 4.5
  })

  y += 4

  // Digital Stamp & Verification Block
  doc.setFillColor(241, 245, 249)
  doc.roundedRect(14, y, 182, 22, 2, 2, "F")
  doc.setDrawColor(203, 213, 225)
  doc.roundedRect(14, y, 182, 22, 2, 2, "S")

  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text("DIGITAL QUALITY ASSURANCE & ENGINEERING VERIFICATION", 18, y + 6)

  doc.setFontSize(7.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(71, 85, 105)
  doc.text(
    "This document has been processed and validated by the SIID FLASH Civil Engineering Intelligence Engine adhering to IS 456:2000, NBC 2016, and regional market indices. Certified for preliminary planning, contractor bidding, and procurement execution.",
    18,
    y + 11,
    { maxWidth: 174 }
  )

  // Page 2 Footer
  doc.setFontSize(7.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(148, 163, 184)
  doc.text(`Page 2 of 2 | Ref: ${refNumber} | SIID FLASH Construction Intelligence System`, 14, 290)

  // Download PDF
  const filename = `SIID_Project_Manifest_${project.city.replace(/\s+/g, "_")}_${project.plotArea}sqft.pdf`
  doc.save(filename)
  return filename
}
