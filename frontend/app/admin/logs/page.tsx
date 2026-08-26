"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Clock, RefreshCw, Search, Shield, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  const loadLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/logs")
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
      }
    } catch (e) {
      console.error("Failed to load logs:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.user_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.action || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Activity & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Immutable log trail of authentications, project operations, and administrative actions
          </p>
        </div>

        <Button
          onClick={loadLogs}
          variant="outline"
          size="sm"
          className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Logs
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="p-4 sm:p-6 bg-slate-900/80 border-slate-800/80 rounded-xl space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, action, or details..."
              className="pl-9 bg-slate-950 border-slate-800 text-white h-9 rounded-lg text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 h-9 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="admin">Admin Actions</option>
              <option value="project">Projects</option>
              <option value="ai">AI / Calculations</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Operator</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Action Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                    {new Date(log.timestamp || log.created_at || Date.now()).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {log.user_name || "System"}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold ${
                        log.category === "auth"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : log.category === "admin"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : log.category === "project"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {log.category || "system"}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div className="font-medium">{log.action}</div>
                    {log.details && (
                      <div className="text-[11px] text-slate-400 mt-0.5">{log.details}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && !loading && (
            <div className="py-8 text-center text-slate-500 text-xs">No matching log entries found</div>
          )}
        </div>
      </Card>
    </div>
  )
}
