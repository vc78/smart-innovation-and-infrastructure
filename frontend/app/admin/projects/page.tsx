"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  FolderOpen,
  Search,
  Filter,
  MapPin,
  Briefcase,
  CheckCircle2,
  Trash2,
  Clock,
  LayoutGrid,
  List,
  MoreVertical,
  ArrowUpRight,
  Zap,
  Building2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProjectMonitoring() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [projects, setProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const loadProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/projects")
      if (res.ok) {
        const data = await res.json()
        const projectList = Array.isArray(data) ? data : data.projects || []
        const mapped = projectList.map((p: any) => ({
          id: (p.id || p._id || "").toString(),
          name: p.project_name || p.name || "Untitled Project",
          user: p.user_name || "Platform User",
          user_email: p.user_email || "",
          location: p.location || "Hyderabad, TG",
          progress: p.progress || p.percentage || 45,
          complexity: p.complexity || "Standard",
          health: p.health || "Optimal",
          type: (p.building_type || p.type || "Residential Villa").toString(),
          status: p.status || "active",
          estimated_cost: Number(p.estimation?.budgetRange?.max || p.estimated_cost || 4500000),
          created_at: p.created_at ? new Date(p.created_at).toLocaleDateString() : "Recent",
          deadline: p.deadline || "In Progress",
        }))
        setProjects(mapped)
      }
    } catch (err) {
      console.error("Failed to load projects:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const deleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to permanently remove project "${projectName}"?`)) {
      return
    }
    try {
      const res = await fetch(`/api/admin/projects?id=${projectId}`, { method: "DELETE" })
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
      }
    } catch (err) {
      console.error("Failed to delete project:", err)
    }
  }

  const handleUpdateStatus = async (projectId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-status", projectId, status: newStatus }),
      })
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
        )
      }
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalResidential = projects.filter((p) => p.type.toLowerCase().includes("residential")).length
  const totalCommercial = projects.filter((p) => p.type.toLowerCase().includes("commercial")).length
  const totalActive = projects.filter((p) => p.status === "active").length
  const totalCompleted = projects.filter((p) => p.status === "completed").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Live Project <span className="text-blue-500">Fleet</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time monitoring and lifecycle management of active architectural deployments
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            onClick={loadProjects}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-500"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-500"}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Total Projects
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{projects.length}</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
            Active Deployments
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{totalActive}</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
            Residential
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400">{totalResidential}</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1">
            Commercial
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400">{totalCommercial}</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 sm:p-6 bg-slate-900/90 border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project name, owner, or city..."
              className="pl-10 bg-slate-950 border-slate-800 text-white h-11 rounded-lg text-xs sm:text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-lg px-3 py-2 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Projects View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((proj) => (
              <Card
                key={proj.id}
                className="bg-slate-950/80 border-slate-800 p-5 rounded-xl hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white hover:text-blue-400 transition-colors line-clamp-1">
                        {proj.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-blue-400" />
                        {proj.type}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] uppercase font-bold ${
                        proj.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {proj.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>Progress</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <Progress value={proj.progress} className="h-1.5 bg-slate-900" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-800/60 mb-3">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-bold">Owner</div>
                      <div className="text-white font-medium truncate">{proj.user}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-bold">Location</div>
                      <div className="text-white font-medium truncate">{proj.location}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <select
                    value={proj.status}
                    onChange={(e) => handleUpdateStatus(proj.id, e.target.value)}
                    className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="draft">Draft</option>
                  </select>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteProject(proj.id, proj.name)}
                    className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Project</th>
                  <th className="pb-3 px-3">Owner</th>
                  <th className="pb-3 px-3">Location</th>
                  <th className="pb-3 px-3">Progress</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{proj.name}</td>
                    <td className="py-3 px-3 text-slate-300">{proj.user}</td>
                    <td className="py-3 px-3 text-slate-400">{proj.location}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{proj.progress}%</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-xs uppercase">
                        {proj.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteProject(proj.id, proj.name)}
                        className="h-8 w-8 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="py-8 text-center text-slate-500 text-xs sm:text-sm">
            No matching projects found.
          </div>
        )}
      </Card>
    </div>
  )
}
