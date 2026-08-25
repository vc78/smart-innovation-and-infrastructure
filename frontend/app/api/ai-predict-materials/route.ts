import { NextResponse } from "next/server"
import { MATERIAL_DATASET } from "@/lib/material-dataset"
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      length = 40, width = 30, floors = 1, city = "Hyderabad", grade = "Standard", 
      direction = "North", soil = "Red Soil", cement = "OPC 43 (Standard)", steel = "TMT Fe415", 
      beds = "3", baths = "3", kitchenType = "Modular Island", archStyle = "Modern / Contemporary", 
      amenities = [], compliances = [], maxBudget = 8000000 
    } = body || {}

    const plotArea = length * width
    const builtupArea = plotArea * 0.85 * floors // Standard built-up ratio

    // 1. Base Cost Calculation
    const cityData = MATERIAL_DATASET.cities[city as keyof typeof MATERIAL_DATASET.cities]
    const tier = grade.toLowerCase() as "economy" | "standard" | "premium" | "luxury"
    
    // Fallback if city not found
    const baseRate = cityData ? cityData.cost_per_sqft_inr[tier] : 1850

    // 2. Adjustments based on extra parameters
    let multipliers = 1.0
    const archMultiplier = MATERIAL_DATASET.design_language_cost_multiplier[archStyle as keyof typeof MATERIAL_DATASET.design_language_cost_multiplier]
    if (typeof archMultiplier === 'number') multipliers *= archMultiplier

    // Impact of Rooms
    const roomImpact = 1 + ((parseInt(beds) - 2) * 0.03) + ((parseInt(baths) - 2) * 0.05)
    multipliers *= roomImpact
    
    const soilFactor = MATERIAL_DATASET.soil_profile_foundation_factor[soil as keyof typeof MATERIAL_DATASET.soil_profile_foundation_factor]
    const foundationMultiplier = typeof soilFactor === 'number' ? soilFactor : 1.0

    // 3. Amenity Costs
    let totalAmenityCost = 0
    amenities.forEach((id: string) => {
      const amenityData = MATERIAL_DATASET.amenities_inr[id as keyof typeof MATERIAL_DATASET.amenities_inr]
      if (amenityData && tier in amenityData) {
        const val = (amenityData as any)[tier]
        if (typeof val === 'number') {
          totalAmenityCost += val
        } else if (val === null && id === 'servant_quarters') {
          totalAmenityCost += (cityData ? cityData.cost_per_sqft_inr.economy : 1550) * 120
        } else if (val === null && id === 'guest_room') {
          totalAmenityCost += (cityData ? cityData.cost_per_sqft_inr.standard : 2000) * 180 * 1.3
        }
      } else if (id === 'terrace_garden' && typeof amenityData === 'object') {
        const val = (amenityData as any)[tier] || 250
        totalAmenityCost += (plotArea * 0.4) * val
      } else if (id === 'solar_panels') {
        totalAmenityCost += 70000 * 4 // avg 4kW
      }
    })

    // Kitchen style
    const kitchenData = MATERIAL_DATASET.kitchen_style_addon_inr[kitchenType as keyof typeof MATERIAL_DATASET.kitchen_style_addon_inr]
    if (kitchenData && typeof kitchenData === 'object' && 'avg' in kitchenData) {
      const min = (kitchenData as any).min
      const max = (kitchenData as any).max
      totalAmenityCost += (min + max) / 2
    } else if (kitchenData && 'min' in (kitchenData as any)) {
      totalAmenityCost += ((kitchenData as any).min + (kitchenData as any).max) / 2
    }

    // Compliances
    let totalComplianceCost = 0
    compliances.forEach((id: string) => {
      const complianceData = MATERIAL_DATASET.structural_compliances_inr[id as keyof typeof MATERIAL_DATASET.structural_compliances_inr]
      if (complianceData) {
        totalComplianceCost += ((complianceData as any).min + (complianceData as any).max) / 2
      }
    })

    // Calculation structure
    const baseStructureCost = builtupArea * baseRate * multipliers
    
    // Segregate base structure into foundation and rest to apply soil factor to foundation only
    const rawFoundationPart = baseStructureCost * 0.12
    const adjustedFoundationPart = rawFoundationPart * foundationMultiplier
    const nonFoundationPart = baseStructureCost - rawFoundationPart
    
    const totalBaseCost = adjustedFoundationPart + nonFoundationPart
    
    const siteDevCost = totalBaseCost * 0.05
    const gstCost = (totalBaseCost + totalAmenityCost + totalComplianceCost + siteDevCost) * 0.18
    const totalCost = totalBaseCost + totalAmenityCost + totalComplianceCost + siteDevCost + gstCost

    // 4. Material Breakdown
    const cementBags = builtupArea * MATERIAL_DATASET.materials.approx_consumption.cement_bags_per_sqft
    const steelKg = builtupArea * MATERIAL_DATASET.materials.approx_consumption.steel_kg_per_sqft
    const bricksCount = builtupArea * 15
    const sandCft = builtupArea * 1.8
    const aggregateCft = builtupArea * 1.35
    
    const cementPrice = MATERIAL_DATASET.materials.cement_per_50kg_bag_inr[cement as keyof typeof MATERIAL_DATASET.materials.cement_per_50kg_bag_inr]?.avg || 385
    const steelPrice = MATERIAL_DATASET.materials.tmt_steel_per_kg_inr[steel as keyof typeof MATERIAL_DATASET.materials.tmt_steel_per_kg_inr]?.avg || 64

    const alerts = []
    if (foundationMultiplier > 1.05) alerts.push(`${soil} requires specialized foundation detailing. Cost multiplied by ${foundationMultiplier}x for foundation stage.`)
    if (cityData?.notes) alerts.push(`${city} Market Note: ${cityData.notes}`)
    if (compliances.includes("vastu")) alerts.push("Vastu considerations applied. Plot facing: " + direction + ". " + MATERIAL_DATASET.vastu_direction_note.note)
    
    if (amenities.includes("smart_automation")) alerts.push("Smart automation selected: Ensure CAT6 cabling in slab rough-in.")

    const userMax = parseFloat(maxBudget) || 8000000
    const feasibility = totalCost <= userMax ? "Within Budget" : totalCost <= userMax * 1.15 ? "Slightly Over Budget" : "Over Budget (Optimization Recommended)"

    // 5. Dynamic Real-time AI Calibration & Engineering Notes
    let aiAdvisoryNotes: string[] = []
    let aiCostOptimizationTip = ""
    try {
      const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
      if (googleApiKey) {
        const google = createGoogleGenerativeAI({ apiKey: googleApiKey })
        const prompt = `You are the SIID Senior Structural Quantity Surveyor.
Analyze this construction bill of materials for ${city}, Built-up Area: ${Math.round(builtupArea)} sqft, Grade: ${grade}, Soil: ${soil}, Budget: ₹${Math.round(totalCost).toLocaleString()}:
- Cement: ${Math.round(cementBags)} bags (${cement})
- Steel: ${Math.round(steelKg)} kg (${steel})
- Sand: ${Math.round(sandCft)} cft
- Bricks: ${Math.round(bricksCount)} nos
- Aggregate: ${Math.round(aggregateCft)} cft

Provide 2 short, highly practical civil engineering and cost optimization notes citing Indian Standards (IS 456 / IS 1786).
Output strictly valid JSON with no markdown formatting:
{
  "notes": ["note 1", "note 2"],
  "costOptimizationTip": "concise tip"
}`

        const result = await generateText({
          model: google("gemini-2.5-flash") as any,
          prompt,
          temperature: 0.2,
        })
        const cleaned = result.text.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "").trim()
        const parsed = JSON.parse(cleaned)
        if (Array.isArray(parsed.notes)) aiAdvisoryNotes = parsed.notes
        if (parsed.costOptimizationTip) aiCostOptimizationTip = parsed.costOptimizationTip
      }
    } catch (aiErr) {
      console.warn("AI calibration note fallback used:", aiErr)
    }

    if (aiAdvisoryNotes.length > 0) {
      alerts.push(...aiAdvisoryNotes)
    }

    return NextResponse.json({
      totalCost: Math.round(totalCost),
      costPerSqFt: Math.round(totalCost / builtupArea),
      builtUpArea: Math.round(builtupArea),
      timeline: `${Math.max(12, Math.round(builtupArea / 100) + 6)} months`,
      breakdown: {
        foundation: Math.round(adjustedFoundationPart),
        structure: Math.round(totalBaseCost * 0.35),
        masonry: Math.round(totalBaseCost * 0.15),
        mep: Math.round(totalBaseCost * 0.12),
        flooring: Math.round(totalBaseCost * 0.08),
        finishing: Math.round(totalBaseCost * 0.13),
        amenities: totalAmenityCost,
        compliance: totalComplianceCost,
        site_development: Math.round(siteDevCost),
        gst: Math.round(gstCost)
      },
      materials: {
        cement: `${Math.round(cementBags).toLocaleString()} bags — ₹${Math.round(cementBags * cementPrice).toLocaleString()}`,
        steel: `${Math.round(steelKg).toLocaleString()} kg — ₹${Math.round(steelKg * steelPrice).toLocaleString()}`,
        sand: `${Math.round(sandCft).toLocaleString()} cft — ₹${Math.round(sandCft * 65).toLocaleString()}`,
        bricks: `${Math.round(bricksCount).toLocaleString()} nos — ₹${Math.round(bricksCount * 9).toLocaleString()}`,
        aggregate: `${Math.round(aggregateCft).toLocaleString()} cft — ₹${Math.round(aggregateCft * 45).toLocaleString()}`,
        concrete: `${Math.round(builtupArea * 0.046).toLocaleString()} m³ — ₹${Math.round(builtupArea * 0.046 * 6500).toLocaleString()}`
      },
      alerts,
      feasibility,
      costOptimizationTip: aiCostOptimizationTip || "Stagger steel and cement procurement in 3-week lookahead batches to reduce warehouse deterioration and cash lockup.",
      vastu_score: compliances.includes("vastu") ? 87 : null,
      grade_note: `The ${grade} grade focuses on durable Indian brands and standard structural safety.`,
      location_note: `Seismic Zone: ${cityData?.seismic_zone || 'Zone II'}`
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

