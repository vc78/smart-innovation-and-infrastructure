"use client"

import { Card } from "@/components/ui/card"
import {
  FileSpreadsheet,
  Download,
  Eye,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AdminReportsPage() {
  const reports = [
    { id: "R-1024", title: "Quarterly Platform Growth Summary", type: "PDF", date: "2026-03-01", size: "3.8 MB", status: "Ready" },
    { id: "R-1025", title: "User Retention & Active Sessions", type: "XLSX", date: "2026-02-28", size: "1.4 MB", status: "Ready" },
    { id: "R-1026", title: "Construction Compliance & Vastu Audits", type: "PDF", date: "2026-02-25", size: "8.2 MB", status: "Ready" },
    { id: "R-1027", title: "Material Estimation & Pricing Logs", type: "CSV", date: "2026-02-20", size: "0.6 MB", status: "Ready" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            System Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Archived compliance reports, growth evaluations, and data exports
          </p>
        </div>

        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 px-3.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
          Generate Report
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="p-4 sm:p-6 bg-slate-900/80 border-slate-800/80 rounded-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-3 px-3">Report Document</th>
                <th className="pb-3 px-3">Format</th>
                <th className="pb-3 px-3">Generated Date</th>
                <th className="pb-3 px-3">File Size</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{r.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{r.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant="outline" className="text-[11px] font-semibold font-mono">
                      {r.type}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{r.date}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{r.size}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{r.status}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs h-7 px-2.5"
                    >
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
