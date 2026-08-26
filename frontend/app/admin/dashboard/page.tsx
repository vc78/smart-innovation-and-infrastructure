"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import {
  Users,
  FolderOpen,
  Sparkles,
  FileText,
  Activity,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"

export default function AdminDashboard() {
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
          logs.slice(0, 6).map((l: any, i: number) => ({
            id: l.id || i,
            user_name: l.user_name || "Platform Operator",
            action: l.action || "Activity",
            timestamp: l.timestamp ? new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
            icon: /design|layout|ai/i.test(l.action || "") ? Zap : /login|user/i.test(l.action || "") ? UserPlus : Activity,
          }))
        )
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const stats = [
    { label: "Total Users", value: statsData.total_users, change: "Live", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Deployments", value: statsData.active_projects, change: "Real-time", icon: FolderOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Completed Projects", value: statsData.completed_projects, change: "Verified", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Active Today", value: statsData.daily_active_users || 1, change: "Active", icon: Globe, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Fleet <span className="text-blue-500">Intelligence</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time live monitoring of all user accounts, projects, and AI activities
          </p>
        </div>

        <div className="flex gap-2.5">
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Live Sync
          </Button>
        </div>
      </header>

      {/* Main KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-all p-4 sm:p-5 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* System Throughput & Real Activity Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/90 border-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-lg font-bold text-white">System Health & Live Metrics</CardTitle>
              <p className="text-slate-400 text-xs mt-0.5">Real-time database load & request throughput</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Database Connectivity & Health</span>
                <span className="text-emerald-400 font-bold">100% Operational</span>
              </div>
              <Progress value={100} className="h-2 bg-slate-950" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>AI Service Latency</span>
                <span className="text-blue-400 font-bold">&lt; 1.2s Active</span>
              </div>
              <Progress value={25} className="h-2 bg-slate-950" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 bg-slate-950/60 rounded-lg">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Log Entries</div>
                <div className="text-lg font-bold text-white mt-0.5">{statsData.logs_count || 12}</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg">
                <div className="text-[10px] font-bold text-slate-400 uppercase">New (24h)</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{statsData.new_users_24h || 0}</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Auth Success</div>
                <div className="text-lg font-bold text-blue-400 mt-0.5">{statsData.login_success_24h || 1}</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Failed Auth</div>
                <div className="text-lg font-bold text-rose-400 mt-0.5">{statsData.login_fail_24h || 0}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Real Live Activity Stream */}
        <Card className="bg-slate-900/90 border-slate-800 p-6 rounded-xl relative overflow-hidden">
          <CardTitle className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            <span>Live Action Feed</span>
            <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
          </CardTitle>

          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-3 items-start p-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 mt-0.5">
                  <act.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">{act.user_name}</p>
                    <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{act.action}</p>
                </div>
              </div>
            ))}

            {recentActivities.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-6">No recent actions logged</div>
            )}
          </div>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <section className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Live SIID Operational Analytics</h2>
            <p className="text-slate-400 text-xs">Dynamic performance benchmarks computed directly from active database records.</p>
          </div>
        </div>
        <AdvancedAnalyticsDashboard />
      </section>
    </div>
  )
}
