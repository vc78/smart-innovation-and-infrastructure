import { NextResponse } from "next/server"

/**
 * Advanced Monte Carlo Simulation for Schedule Risk Prediction
 * 
 * Runs 5000 iterations of the project timeline by sampling probability 
 * distributions for each phase's duration. Calculates Criticality Index
 * and P90 expected delays.
 */

const NUM_ITERATIONS = 5000;

// Parses duration string (e.g. "6-8 weeks") to Most Likely (days)
const parseDurationDays = (duration: string): number => {
  const match = duration?.match(/(\d+)(?:-(\d+))?\s*weeks?/i)
  if (!match) return 7 // Default 1 week
  const val = match[2] ? parseInt(match[2], 10) : parseInt(match[1], 10)
  return val * 7
}

// Samples a random value from a Triangular Distribution
const randomTriangular = (min: number, peak: number, max: number): number => {
  const u = Math.random();
  const f = (peak - min) / (max - min);
  if (u <= f) {
    return min + Math.sqrt(u * (max - min) * (peak - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - peak));
  }
}

export async function POST(req: Request) {
  try {
    const { phases } = await req.json()

    if (!phases || !Array.isArray(phases) || phases.length === 0) {
      return NextResponse.json({ error: "Missing or empty phase data" }, { status: 400 })
    }

    const phaseMap = new Map<string, any>()
    phases.forEach((p) => phaseMap.set(p.id, p))

    // Step 1: Pre-process distributions
    const distributions = new Map<string, { min: number, peak: number, max: number }>()
    
    phases.forEach((phase) => {
      const peak = parseDurationDays(phase.duration)
      
      // Determine variance based on complexity heuristics
      let varianceFactor = 0.2 // Base 20% variance
      if (phase.dependencies && phase.dependencies.length > 0) varianceFactor += 0.05 * phase.dependencies.length
      if (phase.assignedTo && phase.assignedTo.length > 4) varianceFactor += 0.1
      if (phase.weatherRisk === "High" || phase.weatherRisk === "Severe") varianceFactor += 0.15
      if (phase.changeRequests && phase.changeRequests > 2) varianceFactor += 0.1
      
      const min = Math.max(1, Math.round(peak * 0.9)) // Optimistic is usually just slightly better
      const max = Math.round(peak * (1 + varianceFactor)) // Pessimistic absorbs the risk

      distributions.set(phase.id, { min, peak, max })
    })

    // Prepare trackers
    const criticalityCounts = new Map<string, number>()
    const simulatedEndDates = new Map<string, number[]>()
    phases.forEach((p) => {
      criticalityCounts.set(p.id, 0)
      simulatedEndDates.set(p.id, [])
    })

    let totalProjectDelays = []

    // Step 2: Monte Carlo Loop
    for (let i = 0; i < NUM_ITERATIONS; i++) {
      // Sample durations for this iteration
      const sampledDurations = new Map<string, number>()
      phases.forEach((p) => {
        const dist = distributions.get(p.id)!
        sampledDurations.set(p.id, randomTriangular(dist.min, dist.peak, dist.max))
      })

      // Traverse DAG to compute end times
      const endTimes = new Map<string, number>()
      
      const getEndTime = (id: string): number => {
        if (endTimes.has(id)) return endTimes.get(id)!
        const p = phaseMap.get(id)
        if (!p) return 0
        const ownDuration = sampledDurations.get(id)!
        const deps = p.dependencies || []
        
        let upstreamMax = 0
        if (deps.length > 0) {
          upstreamMax = Math.max(...deps.map((depId: string) => getEndTime(depId)))
        }
        
        const endTime = upstreamMax + ownDuration
        endTimes.set(id, endTime)
        return endTime
      }

      phases.forEach((p) => getEndTime(p.id))

      // Identify terminal phase (longest path in this iteration)
      let projectEndTime = 0
      let terminalPhaseId = phases[0].id

      phases.forEach((p) => {
        const et = endTimes.get(p.id)!
        if (et > projectEndTime) {
          projectEndTime = et
          terminalPhaseId = p.id
        }
        simulatedEndDates.get(p.id)!.push(et)
      })

      totalProjectDelays.push(projectEndTime)

      // Backtrack Critical Path for this iteration
      const criticalIds = new Set<string>()
      let cursor: string | null = terminalPhaseId
      
      while (cursor) {
        criticalIds.add(cursor)
        const p = phaseMap.get(cursor)
        if (!p || !p.dependencies || p.dependencies.length === 0) break
        
        // Find the dependency that matches (endTime - ownDuration)
        const targetEndTime = endTimes.get(cursor)! - sampledDurations.get(cursor)!
        // Use a small epsilon for floating point comparison
        const eps = 0.001
        
        let nextCursor = null
        for (const depId of p.dependencies) {
          const depEnd = endTimes.get(depId) || 0
          if (Math.abs(depEnd - targetEndTime) < eps) {
            nextCursor = depId
            break
          }
        }
        cursor = nextCursor
      }

      // Update criticality counts
      criticalIds.forEach((id) => {
        criticalityCounts.set(id, criticalityCounts.get(id)! + 1)
      })
    }

    // Step 3: Statistical Aggregation
    
    // Sort array helper for P90
    const getPercentile = (arr: number[], p: number) => {
      arr.sort((a, b) => a - b)
      const index = Math.ceil((p / 100) * arr.length) - 1
      return arr[Math.max(0, index)]
    }

    // Baseline deterministic end dates (using peak)
    const baselineEndTimes = new Map<string, number>()
    const getBaselineEnd = (id: string): number => {
      if (baselineEndTimes.has(id)) return baselineEndTimes.get(id)!
      const p = phaseMap.get(id)
      if (!p) return 0
      const ownDuration = distributions.get(id)!.peak
      const deps = p.dependencies || []
      const upstream = deps.length ? Math.max(...deps.map((d: string) => getBaselineEnd(d))) : 0
      const et = upstream + ownDuration
      baselineEndTimes.set(id, et)
      return et
    }
    phases.forEach((p) => getBaselineEnd(p.id))

    const enhanced_phases = phases.map((phase: any) => {
      // 1. Criticality Index (0-100)
      const criticalityIndex = (criticalityCounts.get(phase.id)! / NUM_ITERATIONS) * 100
      
      // 2. Expected Delay (P90 Simulated End - Baseline End)
      const p90End = getPercentile(simulatedEndDates.get(phase.id)!, 90)
      const baselineEnd = baselineEndTimes.get(phase.id)!
      const expectedDelayDays = Math.max(0, Math.round(p90End - baselineEnd))

      // 3. Confidence Factor (Based on spread of distribution)
      const minEnd = getPercentile(simulatedEndDates.get(phase.id)!, 10)
      const spread = p90End - minEnd
      const confidence = Math.max(0.5, 1 - (spread / (baselineEnd || 1)))

      return {
        ...phase,
        ml_risk_score: Math.round(criticalityIndex),
        expected_delay_days: expectedDelayDays,
        prediction_confidence: confidence
      }
    })

    // Calculate System Health
    const avgRisk = enhanced_phases.reduce((a, b) => a + b.ml_risk_score, 0) / enhanced_phases.length
    let system_health = "Stable"
    if (avgRisk > 40) system_health = "Moderate Risk"
    if (avgRisk > 70) system_health = "Critical Risk"

    return NextResponse.json({
      enhanced_phases,
      system_health,
      analysis_timestamp: new Date().toISOString(),
      recommendations: [
        "Monte Carlo simulation completed 5000 path iterations.",
        "Focus on phases with > 80% Criticality Index (ml_risk_score).",
        "P90 Schedule slip factored into Expected Delays."
      ]
    })

  } catch (error: any) {
    console.error("Monte Carlo Simulation Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
