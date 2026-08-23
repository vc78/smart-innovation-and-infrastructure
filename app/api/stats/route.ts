import { NextResponse } from "next/server"
import { PLATFORM_STATS, KPI_COUNTER_ITEMS } from "@/lib/stats-config"

export async function GET() {
  return NextResponse.json({
    success: true,
    stats: PLATFORM_STATS,
    kpiCounters: KPI_COUNTER_ITEMS,
  })
}
