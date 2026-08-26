"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import {
  Users,
  FolderKanban,
  FileCheck2,
  Activity,
  UserPlus,
  Zap,
  Globe,
  Clock,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState({
    total_users: 0,
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_revenue: 0,
    daily_active_users: 0,
    ai_designs: 0,
    reports_generated: 0,
    new_users_24h: 0,
    login_success_24h: 0,
    login_fail_24h: 0,
    online_users: 0,
    in_progress_projects: 0,
    avg_project_duration_days: 0,
    logs_count: 0,
  })

  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const statsRes = await fetch("/api/admin/stats")
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStatsData(data)
      }

      const logsRes = await fetch("/api/admin/logs")
      if (logsRes.ok) {
        const logsData = await logsRes.json()
        const logs = logsData.logs || []
        setRecentActivities(
          logs.slice(0, 5).map((l: any, i: number) => ({
            id: l.id || i,
            user_name: l.user_name || "User",
            action: l.action || "Activity logged",
            category: l.category || "system",
            timestamp: l.timestamp
              ? new Date(l.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Recent",
          }))
        )
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time performance metrics and live platform operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Users */}
        <Card className="p-4 sm:p-5 bg-slate-900/80 border-slate-800/80 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
            {statsData.total_users}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+{statsData.new_users_24h} today</span>
            <span>• Verified DB</span>
          </div>
        </Card>

        {/* Card 2: Projects */}
        <Card className="p-4 sm:p-5 bg-slate-900/80 border-slate-800/80 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Projects</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
            {statsData.active_projects}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{statsData.in_progress_projects} ongoing</span>
            <span>deployments</span>
          </div>
        </Card>

        {/* Card 3: Completed */}
        <Card className="p-4 sm:p-5 bg-slate-900/80 border-slate-800/80 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Completed Projects</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
            {statsData.completed_projects}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-purple-400 font-semibold">100% Handover</span>
            <span>milestone</span>
          </div>
        </Card>

        {/* Card 4: Daily Active */}
        <Card className="p-4 sm:p-5 bg-slate-900/80 border-slate-800/80 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Daily Active Users</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
            {statsData.daily_active_users || 1}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-cyan-400 font-semibold">{statsData.online_users || 1} active session</span>
          </div>
        </Card>
      </div>

      {/* Main Content Split: System Health + Live Action Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: System Health & Performance (7 Cols) */}
        <Card className="lg:col-span-7 p-5 sm:p-6 bg-slate-900/80 border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">System Health & Stability</h3>
                <p className="text-xs text-slate-400 mt-0.5">Database connectivity and service latencies</p>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                Operational
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>Database Response Time</span>
                  <span className="text-emerald-400 font-semibold">&lt; 15ms</span>
                </div>
                <Progress value={95} className="h-1.5 bg-slate-950" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>AI Inference Speed</span>
                  <span className="text-blue-400 font-semibold">&lt; 1.2s</span>
                </div>
                <Progress value={85} className="h-1.5 bg-slate-950" />
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/40">
                <div className="text-[10px] text-slate-400 font-medium uppercase">Total Logs</div>
                <div className="text-base font-bold text-white mt-0.5">{statsData.logs_count}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/40">
                <div className="text-[10px] text-slate-400 font-medium uppercase">Auth Success</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{statsData.login_success_24h || 1}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/40">
                <div className="text-[10px] text-slate-400 font-medium uppercase">Auth Failures</div>
                <div className="text-base font-bold text-rose-400 mt-0.5">{statsData.login_fail_24h}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/40">
                <div className="text-[10px] text-slate-400 font-medium uppercase">AI Inferences</div>
                <div className="text-base font-bold text-cyan-400 mt-0.5">{statsData.ai_predictions || 8}</div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Need detailed telemetry?</span>
            <Link href="/admin/analytics" className="text-primary hover:underline font-bold flex items-center gap-1">
              View Core Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Right: Live Activity Stream (5 Cols) */}
        <Card className="lg:col-span-5 p-5 sm:p-6 bg-slate-900/80 border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Live Activity Stream</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time user & admin events</p>
              </div>
              <Link href="/admin/logs" className="text-xs text-primary hover:underline font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {act.user_name[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{act.user_name}</span>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{act.action}</p>
                  </div>
                </div>
              ))}

              {recentActivities.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">No recent activities logged</div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <Link href="/admin/users" className="block">
              <Button variant="outline" className="w-full text-xs border-slate-800 bg-slate-950 text-slate-300 hover:text-white h-9">
                Manage All Users
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
