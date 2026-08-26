"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Cpu,
  Users,
  History,
  AlertCircle,
  Database,
  Target,
  Zap,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/analytics")
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (err) {
      console.error("Failed to load admin analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-xs">
        Loading analytics telemetry...
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-xs">
        Unable to load analytics data.
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operational usage trends, AI execution counts, and growth metrics
          </p>
        </div>

        <Button
          onClick={load}
          variant="outline"
          size="sm"
          className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-slate-900/80 border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">AI Predictions</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analytics.ai_predictions || 0}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Total model calls</p>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">New Users (24h)</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analytics.new_users_24h || 0}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">New signups</p>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Auth Success</span>
            <History className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analytics.login_success_24h || 0}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Active sessions</p>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Auth Failures</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analytics.login_fail_24h || 0}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Invalid attempts</p>
        </Card>
      </div>

      {/* Feature Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-slate-900/80 border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Material Estimations</div>
            <div className="text-lg font-bold text-white">
              {analytics.ai_feature_usage?.["Material Estimator"] || 0}
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Vastu Evaluations</div>
            <div className="text-lg font-bold text-white">
              {analytics.ai_feature_usage?.["Vastu Analyzer"] || 0}
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Layout Generations</div>
            <div className="text-lg font-bold text-white">
              {analytics.ai_feature_usage?.["Layout Generator"] || 0}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/80 border-slate-800/80 p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-4">Project Creations (12 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.projects_per_month || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800/80 p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-4">Project Types Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.project_types || []} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={80} label={{ fill: "#94a3b8", fontSize: 11 }}>
                  {(analytics.project_types || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
