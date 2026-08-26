"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  Users,
  Search,
  UserPlus,
  Lock,
  Unlock,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
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
  const [isCreating, setIsCreating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [modalFormData, setModalFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  })
  const [modalError, setModalError] = useState("")

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

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
        showNotification("success", `User status updated to ${newStatus}`)
      } else {
        showNotification("error", "Failed to update status")
      }
    } catch (err) {
      console.error("Failed to update status:", err)
      showNotification("error", "An error occurred while updating status")
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
        showNotification("success", `User role updated to ${newRole}`)
      } else {
        showNotification("error", "Failed to update role")
      }
    } catch (err) {
      console.error("Failed to update role:", err)
      showNotification("error", "An error occurred while updating role")
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
        showNotification("success", `User "${userName}" deleted`)
      } else {
        showNotification("error", "Failed to delete user")
      }
    } catch (err) {
      console.error("Failed to delete user:", err)
      showNotification("error", "An error occurred while deleting user")
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

    setIsCreating(true)
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
      if (res.ok && data.success) {
        setModalOpen(false)
        setModalFormData({
          name: "",
          email: "",
          password: "",
          role: "user",
          status: "active",
        })
        showNotification("success", `User "${modalFormData.name}" created successfully`)
        fetchUsers()
      } else {
        setModalError(data.error || "Failed to create user")
      }
    } catch (err: any) {
      setModalError(err.message || "Failed to create user")
    } finally {
      setIsCreating(false)
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 text-xs font-semibold border animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage authenticated platform accounts, roles, and security permissions
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={fetchUsers}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setModalError("")
              setModalOpen(true)
            }}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 px-3.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add User
          </Button>
        </div>
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
              placeholder="Search by name, email, or role..."
              className="pl-9 bg-slate-950 border-slate-800 text-white h-9 rounded-lg text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 h-9 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Users</option>
              <option value="contractor">Contractors</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 h-9 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Clean Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Projects</th>
                <th className="pb-3 px-3">Created</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredUsers.map((user) => {
                const isWorking = actionLoading === user.id

                return (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {user.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">{user.name}</div>
                          <div className="text-slate-400 text-[11px] truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Selector */}
                    <td className="py-3 px-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        disabled={isWorking}
                        className={`text-xs font-semibold px-2 py-0.5 rounded border bg-slate-950 cursor-pointer outline-none ${
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

                    {/* Status Pill */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleUpdateStatus(user.id, user.status)}
                        disabled={isWorking}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
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

                    <td className="py-3 px-3 font-mono font-medium text-slate-300">
                      {user.projects_count || 0}
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Active"}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(user.id, user.status)}
                          disabled={isWorking}
                          className="h-7 w-7 text-slate-400 hover:text-white"
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
                          className="h-7 w-7 text-slate-400 hover:text-rose-400"
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
            <div className="py-8 text-center text-slate-500 text-xs">No matching users found</div>
          )}
        </div>
      </Card>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-5 sm:p-6 rounded-xl relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Add Platform User</h3>
            <p className="text-xs text-slate-400 mb-4">Create a new authenticated account</p>

            {modalError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
                <Input
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="bg-slate-950 border-slate-800 text-white h-9 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
                <Input
                  type="email"
                  value={modalFormData.email}
                  onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="bg-slate-950 border-slate-800 text-white h-9 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
                <Input
                  type="password"
                  value={modalFormData.password}
                  onChange={(e) => setModalFormData({ ...modalFormData, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-slate-950 border-slate-800 text-white h-9 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Role</label>
                  <select
                    value={modalFormData.role}
                    onChange={(e) => setModalFormData({ ...modalFormData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-2.5 h-9 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                    <option value="contractor">Contractor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Status</label>
                  <select
                    value={modalFormData.status}
                    onChange={(e) => setModalFormData({ ...modalFormData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-2.5 h-9 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={isCreating}
                  className="flex-1 border-slate-800 bg-slate-950 text-slate-300 text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-9"
                >
                  {isCreating ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
