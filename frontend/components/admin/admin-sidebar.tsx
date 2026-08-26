"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart2,
  Clock,
  FileSpreadsheet,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/brand-logo"

export function AdminSidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  const navigation = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/admin/logs", label: "Activity Logs", icon: Clock },
    { href: "/admin/reports", label: "Reports", icon: FileSpreadsheet },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-slate-950 text-slate-100 border-r border-slate-800/80 flex flex-col z-40 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="px-4 py-4 border-b border-slate-800/80">
        <Link href="/admin" onClick={handleLinkClick} className="flex items-center gap-2 group">
          <BrandLogo size="sm" className="transition-transform duration-200 group-hover:scale-105" />
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 flex-shrink-0">
            Admin
          </span>
        </Link>
        <p className="text-[10px] text-slate-500 mt-1.5 pl-0.5 tracking-wide">Management Console</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Platform Overview
        </div>

        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href} onClick={handleLinkClick}>
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none",
                  isActive
                    ? "bg-primary text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </div>
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/60">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Quick Actions
          </div>
          <Link href="/" target="_blank" className="block">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 transition-colors">
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Live Website
              </span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Administrator</div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await logout()
            router.push("/login")
          }}
          className="w-full justify-start text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
