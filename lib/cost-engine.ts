/**
 * SIID Centralized Cost & BOQ Calculation Engine
 * Single source of truth for deterministic construction cost, material, and labor estimations.
 */

export type ConstructionTier = "Economy" | "Standard" | "Premium" | "Luxury"
export type BrickType = "Standard Red" | "AAC Block" | "Fly Ash"

export interface CostTierDetail {
  baseRatePerSqft: number
  description: string
  features: string[]
}

export const TIER_RATES: Record<ConstructionTier, CostTierDetail> = {
  Economy: {
    baseRatePerSqft: 1750,
    description: "Budget-friendly construction focusing on functional utility.",
    features: ["OPC 43 Cement & Fe415 Steel", "Local ceramic tiles", "Essential modular switches"],
  },
  Standard: {
    baseRatePerSqft: 2400,
    description: "High quality standard residential construction.",
    features: ["Branded cement & TMT Fe500 Steel", "2x2 Vitrified tiles", "Modular electrical fittings"],
  },
  Premium: {
    baseRatePerSqft: 3200,
    description: "Elite quality materials with custom interior finishes.",
    features: ["UltraTech/ACC Cement & Tata Tiscon Steel", "Italian marble & Granite", "Smart home fixtures"],
  },
  Luxury: {
    baseRatePerSqft: 4500,
    description: "Ultra-luxury bespoke architectural design & automation.",
    features: ["Imported architectural materials", "Full BMS smart automation", "Custom designer joinery"],
  },
}

export const BRICK_MULTIPLIERS: Record<BrickType, number> = {
  "Standard Red": 1.0,
  "AAC Block": 0.94,
  "Fly Ash": 0.98,
}

export interface EstimationParams {
  builtUpAreaSqft: number
  floors?: number
  tier?: ConstructionTier
  brickType?: BrickType
  numRooms?: number
  location?: string
}

export interface EstimationResult {
  builtUpAreaSqft: number
  floors: number
  tier: ConstructionTier
  finalRatePerSqft: number
  totalEstimateINR: number
  breakdown: {
    civilMaterialsINR: number
    civilMaterialsPercentage: number
    laborINR: number
    laborPercentage: number
    mepAndFinishingINR: number
    mepAndFinishingPercentage: number
    contingencyINR: number
    contingencyPercentage: number
  }
  boqItems: Array<{
    item: string
    category: string
    quantity: number
    unit: string
    rateINR: number
    amountINR: number
  }>
  calculationInputs: {
    baseRate: number
    brickMultiplier: number
    roomFactor: number
    pricingDate: string
  }
}

export function calculateProjectEstimate(params: EstimationParams): EstimationResult {
  const area = Math.max(100, params.builtUpAreaSqft || 1500)
  const floors = Math.max(1, params.floors || 1)
  const totalSqft = area * floors
  const tier = params.tier || "Standard"
  const brick = params.brickType || "Standard Red"
  const rooms = params.numRooms || 3

  const baseRate = TIER_RATES[tier].baseRatePerSqft
  const brickM = BRICK_MULTIPLIERS[brick]
  
  // Extra internal partition walls factor
  const baselineRooms = Math.ceil(area / 350)
  const roomFactor = 1 + Math.max(0, rooms - baselineRooms) * 0.02

  const finalRate = Math.round(baseRate * brickM * roomFactor)
  const totalEstimate = Math.round(totalSqft * finalRate)

  // Cost Distribution Engine: Civil Materials (50%), Labor (25%), MEP & Finishing (17%), Contingency (8%)
  const civilMaterials = Math.round(totalEstimate * 0.50)
  const labor = Math.round(totalEstimate * 0.25)
  const mepAndFinishing = Math.round(totalEstimate * 0.17)
  const contingency = Math.round(totalEstimate * 0.08)

  // BOQ Engine Items
  const cementBags = Math.round(totalSqft * 0.42) // 0.42 bags per sqft
  const steelTons = Number((totalSqft * 0.0035).toFixed(2)) // ~3.5 kg per sqft
  const sandCuFt = Math.round(totalSqft * 1.8)
  const aggregateCuFt = Math.round(totalSqft * 1.35)
  const bricksCount = Math.round(totalSqft * 9.5)

  const boqItems = [
    { item: "Cement (OPC/PPC Grade 53)", category: "Structural", quantity: cementBags, unit: "bags", rateINR: 410, amountINR: cementBags * 410 },
    { item: "TMT Rebar Steel (Fe500D)", category: "Structural", quantity: steelTons, unit: "tons", rateINR: 65000, amountINR: Math.round(steelTons * 65000) },
    { item: "River Sand / M-Sand", category: "Aggregates", quantity: sandCuFt, unit: "cu.ft", rateINR: 55, amountINR: sandCuFt * 55 },
    { item: "Coarse Aggregate (20mm)", category: "Aggregates", quantity: aggregateCuFt, unit: "cu.ft", rateINR: 45, amountINR: aggregateCuFt * 45 },
    { item: brick, category: "Masonry", quantity: bricksCount, unit: "pcs", rateINR: 9, amountINR: bricksCount * 9 },
  ]

  return {
    builtUpAreaSqft: totalSqft,
    floors,
    tier,
    finalRatePerSqft: finalRate,
    totalEstimateINR: totalEstimate,
    breakdown: {
      civilMaterialsINR: civilMaterials,
      civilMaterialsPercentage: 50,
      laborINR: labor,
      laborPercentage: 25,
      mepAndFinishingINR: mepAndFinishing,
      mepAndFinishingPercentage: 17,
      contingencyINR: contingency,
      contingencyPercentage: 8,
    },
    boqItems,
    calculationInputs: {
      baseRate,
      brickMultiplier: brickM,
      roomFactor,
      pricingDate: new Date().toISOString().split("T")[0],
    },
  }
}
