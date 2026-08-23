// Centralized Platform Metrics — Single Source of Truth

export interface PlatformMetrics {
  projectsInitiated: number
  activeCities: string[]
  verifiedContractors: number
  satisfactionRate: number
  surveySampleSize: number
  yearsOperating: number
  optimizedCostCr: number
  designsGenerated: number
}

export const PLATFORM_STATS: PlatformMetrics = {
  projectsInitiated: 24,
  activeCities: ["Hyderabad", "Vijayawada", "Warangal", "Secunderabad"],
  verifiedContractors: 32,
  satisfactionRate: 96,
  surveySampleSize: 18,
  yearsOperating: 1,
  optimizedCostCr: 5,
  designsGenerated: 120,
}

export const KPI_COUNTER_ITEMS = [
  { label: "Projects Completed", value: PLATFORM_STATS.projectsInitiated, suffix: "+" },
  { label: "Happy Clients", value: PLATFORM_STATS.surveySampleSize, suffix: "+" },
  { label: "Verified Contractors", value: PLATFORM_STATS.verifiedContractors, suffix: "+" },
  { label: "Satisfaction Rate", value: PLATFORM_STATS.satisfactionRate, suffix: "%" },
]
