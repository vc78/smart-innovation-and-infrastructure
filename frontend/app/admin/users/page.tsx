"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  Users,
  Search,
  UserPlus,
  Shield,
  Mail,
  Calendar,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderGit2,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface UserRecord {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "contractor"
  status: "active" | "suspended" | "blocked"
  created_at?: string
  projects_count?: number
  last_active?: string | null
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalFormData, setModalFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  })
  const [modalError, setModalError] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (err) {
      console.error("Failed to load users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUpdateStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active"
    setActionLoading(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-status",
          userId,
          status: newStatus,
        }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus as any } : u))
        )
      }
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setActionLoading(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-role",
          userId,
          role: newRole,
        }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
        )
      }
    } catch (err) {
      console.error("Failed to update role:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      return
    }
    setActionLoading(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", userId }),
      })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      }
    } catch (err) {
      console.error("Failed to delete user:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError("")
    if (!modalFormData.name || !modalFormData.email || !modalFormData.password) {
      setModalError("All fields are required")
      return
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-user",
          ...modalFormData,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setModalOpen(false)
        setModalFormData({
          name: "",
          email: "",
          password: "",
          role: "user",
          status: "active",
        })
        fetchUsers()
      } else {
        setModalError(data.error || "Failed to create user")
      }
    } catch (err: any) {
      setModalError(err.message || "Failed to create user")
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const matchesStatus = statusFilter === "all" || u.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const totalAdmins = users.filter((u) => u.role === "admin").length
  const totalContractors = users.filter((u) => u.role === "contractor").length
  const totalActive = users.filter((u) => u.status === "active").length

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            User Identity & Access <span className="text-blue-500">Control</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time live monitoring and management of all verified platform operators
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            onClick={fetchUsers}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-4 shadow-lg shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Add User
          </Button>
        </div>
      </header>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Total Users
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{users.length}</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
            Active Accounts
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{totalActive}</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1">
            Administrators
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">{totalAdmins}</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1">
            Contractors
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400">{totalContractors}</div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 sm:p-6 bg-slate-900/90 border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="pl-10 bg-slate-950 border-slate-800 text-white h-11 rounded-lg text-xs sm:text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-lg px-3 py-2 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Standard Users</option>
              <option value="contractor">Contractors</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-lg px-3 py-2 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Real Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-3 px-3">User & Email</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Projects</th>
                <th className="pb-3 px-3">Joined Date</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {filteredUsers.map((user) => {
                const isWorking = actionLoading === user.id

                return (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {user.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{user.name}</div>
                          <div className="text-slate-400 text-xs truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge + Selector */}
                    <td className="py-3.5 px-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        disabled={isWorking}
                        className={`text-xs font-bold px-2 py-1 rounded border bg-slate-950 cursor-pointer outline-none ${
                          user.role === "admin"
                            ? "text-rose-400 border-rose-500/30"
                            : user.role === "contractor"
                            ? "text-purple-400 border-purple-500/30"
                            : "text-blue-400 border-blue-500/30"
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="contractor">Contractor</option>
                      </select>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleUpdateStatus(user.id, user.status)}
                        disabled={isWorking}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                          user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "active" ? "bg-emerald-400" : "bg-rose-400"
                          }`}
                        />
                        <span className="capitalize">{user.status}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-slate-300">
                      {user.projects_count || 0}
                    </td>

                    <td className="py-3.5 px-3 text-slate-400 text-xs">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Active"}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(user.id, user.status)}
                          disabled={isWorking}
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                          title={user.status === "active" ? "Suspend user" : "Activate user"}
                        >
                          {user.status === "active" ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={isWorking}
                          className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && !loading && (
            <div className="py-8 text-center text-slate-500 text-xs sm:text-sm">
              No matching user records found.
            </div>
          )}
        </div>
      </Card>

      {/* Modal: Add New Network User */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-6 rounded-2xl relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Add Network User</h3>
            <p className="text-xs text-slate-400 mb-4">
              Create a new authenticated identity with custom role assignments.
            </p>

            {modalError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mb-4">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <Input
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="bg-slate-950 border-slate-800 text-white h-10 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <Input
                  type="email"
                  value={modalFormData.email}
                  onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="bg-slate-950 border-slate-800 text-white h-10 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                <Input
                  type="password"
                  value={modalFormData.password}
                  onChange={(e) => setModalFormData({ ...modalFormData, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-slate-950 border-slate-800 text-white h-10 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
                  <select
                    value={modalFormData.role}
                    onChange={(e) => setModalFormData({ ...modalFormData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-2.5 h-10 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                    <option value="contractor">Contractor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Status</label>
                  <select
                    value={modalFormData.status}
                    onChange={(e) => setModalFormData({ ...modalFormData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-2.5 h-10 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border-slate-800 bg-slate-950 text-slate-300"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold">
                  Create User
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
