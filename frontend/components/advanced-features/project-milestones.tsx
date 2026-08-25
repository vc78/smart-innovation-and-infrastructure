"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ShieldCheck,
  Zap,
  Eye,
  Link as LinkIcon,
  Database,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  Search,
  Filter,
  PieChart,
  Layers,
  ArrowUpRight,
  Sparkles,
  Lock,
  Unlock,
  Receipt,
  FileCheck2,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { generateProfessionalDocument } from "@/lib/document-template"

export interface Milestone {
  id: string
  name: string
  dueDate: string
  payment: number
  category: "Civil & RCC" | "Masonry & Finishing" | "MEP & Electrical" | "Planning & Approvals"
  status: "completed" | "in-progress" | "upcoming" | "overdue"
  progress: number
  deliverables: string[]
  blockchainHash?: string
  aiVerified?: boolean
  smartContractId?: string
  vendorName: string
  releasedDate?: string
}

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "1",
    name: "Substructure & Raft Foundation",
    dueDate: "Jan 15, 2024",
    payment: 500000,
    category: "Civil & RCC",
    status: "completed",
    progress: 100,
    deliverables: ["Soil test & excavation", "PCC bed & waterproofing", "Rebar cage binding (Fe550D)", "Ready-mix M25 concrete pour"],
    blockchainHash: "0x742d...f62e89",
    aiVerified: true,
    smartContractId: "SC-SIID-2024-001",
    vendorName: "Apex Foundation Engineering",
    releasedDate: "Jan 18, 2024",
  },
  {
    id: "2",
    name: "Ground Floor RCC Frame & Slabs",
    dueDate: "Feb 28, 2024",
    payment: 800000,
    category: "Civil & RCC",
    status: "in-progress",
    progress: 70,
    deliverables: ["Vertical column casting (12 nos)", "Beam shuttering & reinforcement", "First floor slab deck preparation", "Cube strength test results (28 days)"],
    aiVerified: true,
    smartContractId: "SC-SIID-2024-002",
    vendorName: "Skyline Infra Structures",
  },
  {
    id: "3",
    name: "First Floor & Brick Masonry",
    dueDate: "Apr 15, 2024",
    payment: 700000,
    category: "Masonry & Finishing",
    status: "upcoming",
    progress: 0,
    deliverables: ["AAC block work for external walls", "Internal 4.5\" partition walls", "Door & window frame installation", "Lintel beam casting"],
    smartContractId: "SC-SIID-2024-003",
    vendorName: "VastuVeda Construction Ltd",
  },
  {
    id: "4",
    name: "MEP Rough-in & Plumbing Conduits",
    dueDate: "May 20, 2024",
    payment: 350000,
    category: "MEP & Electrical",
    status: "upcoming",
    progress: 0,
    deliverables: ["Concealed PVC electrical conduits", "CPVC/UPVC water supply piping", "Sewer drainage stack testing", "Earthing pit setup"],
    smartContractId: "SC-SIID-2024-004",
    vendorName: "VoltMax MEP Contractors",
  },
  {
    id: "5",
    name: "Roofing, Plastering & Waterproofing",
    dueDate: "Jun 30, 2024",
    payment: 450000,
    category: "Masonry & Finishing",
    status: "upcoming",
    progress: 0,
    deliverables: ["Terrace slope leveling", "Polymer elastomeric waterproofing", "Double coat internal plastering", "Parapet wall construction"],
    smartContractId: "SC-SIID-2024-005",
    vendorName: "AquaShield Waterproofing",
  },
]

export function ProjectMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES)
  const [activeView, setActiveView] = useState<"milestones" | "expenses" | "audit">("milestones")
  const [expandedId, setExpandedId] = useState<string | null>("2")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAdvisoryLoading, setIsAdvisoryLoading] = useState(false)
  const [aiAdvisory, setAiAdvisory] = useState<string | null>(null)

  // New Milestone Form State
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    payment: 300000,
    dueDate: "",
    category: "Civil & RCC" as Milestone["category"],
    vendorName: "",
    deliverablesText: "",
  })

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  const totalBudget = useMemo(() => milestones.reduce((acc, m) => acc + m.payment, 0), [milestones])
  const paidAmount = useMemo(
    () => milestones.filter((m) => m.status === "completed").reduce((acc, m) => acc + m.payment, 0),
    [milestones]
  )
  const inReviewAmount = useMemo(
    () => milestones.filter((m) => m.status === "in-progress").reduce((acc, m) => acc + m.payment, 0),
    [milestones]
  )
  const lockedEscrow = totalBudget - paidAmount

  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      const matchesStatus = filterStatus === "all" || m.status === filterStatus
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.smartContractId && m.smartContractId.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesStatus && matchesSearch
    })
  }, [milestones, filterStatus, searchQuery])

  // Category expense breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { total: number; disbursed: number }> = {}
    milestones.forEach((m) => {
      if (!map[m.category]) map[m.category] = { total: 0, disbursed: 0 }
      map[m.category].total += m.payment
      if (m.status === "completed") map[m.category].disbursed += m.payment
    })
    return Object.entries(map).map(([cat, data]) => ({
      category: cat,
      total: data.total,
      disbursed: data.disbursed,
      pct: totalBudget > 0 ? Math.round((data.total / totalBudget) * 100) : 0,
    }))
  }, [milestones, totalBudget])

  const handleSmartPayout = (id: string) => {
    setProcessingId(id)
    toast.info("Verifying site sensor feeds & smart contract preconditions...")

    setTimeout(() => {
      const generatedHash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 8)}`
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

      setMilestones((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: "completed",
                progress: 100,
                blockchainHash: generatedHash,
                releasedDate: today,
              }
            : m
        )
      )
      setProcessingId(null)
      toast.success("✨ Escrow Payout Released On-Chain & Transferred to Vendor Account!")
    }, 1800)
  }

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestone.name || !newMilestone.dueDate) {
      toast.error("Please fill in the milestone name and due date.")
      return
    }

    const deliverables = newMilestone.deliverablesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    const created: Milestone = {
      id: `${Date.now()}`,
      name: newMilestone.name,
      dueDate: newMilestone.dueDate,
      payment: Number(newMilestone.payment),
      category: newMilestone.category,
      status: "upcoming",
      progress: 0,
      deliverables: deliverables.length > 0 ? deliverables : ["Inspection Checklist Verification", "Final Site Sign-off"],
      vendorName: newMilestone.vendorName || "Certified Trade Partner",
      smartContractId: `SC-SIID-${new Date().getFullYear()}-00${milestones.length + 1}`,
    }

    setMilestones((prev) => [...prev, created])
    setIsAddModalOpen(false)
    setNewMilestone({
      name: "",
      payment: 300000,
      dueDate: "",
      category: "Civil & RCC",
      vendorName: "",
      deliverablesText: "",
    })
    toast.success("New payment milestone committed to ledger.")
  }

  const handleGenerateAdvisory = () => {
    setIsAdvisoryLoading(true)
    setTimeout(() => {
      setIsAdvisoryLoading(false)
      setAiAdvisory(
        `• Capital Allocation: ₹${(paidAmount / 100000).toFixed(2)}L disbursed of ₹${(totalBudget / 100000).toFixed(
          2
        )}L total committed (Capital absorption: ${Math.round(
          (paidAmount / totalBudget) * 100
        )}%).\n• Risk Alert: Milestone #2 (Ground Floor RCC) is 70% complete. Ensure cube compressive test reports are stamped before triggering the ₹8,00,000 disbursement.\n• Projected Savings: Material rate locking has preserved ~₹1,42,000 against current steel and M25 cement price inflation.`
      )
      toast.success("AI Cash Flow Analysis updated.")
    }, 1200)
  }

  const handleExportStatement = async () => {
    try {
      const date = new Date().toLocaleDateString()
      const rows = milestones.map(
        (m) =>
          `[${m.status.toUpperCase()}] ${m.name} | ${formatCurrency(m.payment)} | Vendor: ${m.vendorName} | Due: ${
            m.dueDate
          } | Contract: ${m.smartContractId || "N/A"}`
      )

      const pdf = await generateProfessionalDocument({
        title: "Enterprise Project Financial Ledger & Escrow Statement",
        subtitle: `Total Commitment: ${formatCurrency(totalBudget)} | Disbursed: ${formatCurrency(
          paidAmount
        )} | Escrow Retained: ${formatCurrency(lockedEscrow)}`,
        sections: [
          {
            heading: "Financial Overview",
            content: [
              `Total Committed Budget: ${formatCurrency(totalBudget)}`,
              `Capital Disbursed: ${formatCurrency(paidAmount)} (${Math.round((paidAmount / totalBudget) * 100)}%)`,
              `Under Active Review / In-Progress: ${formatCurrency(inReviewAmount)}`,
              `Locked in Smart-Contract Escrow: ${formatCurrency(lockedEscrow)}`,
              `Generated Date: ${date}`,
            ],
          },
          {
            heading: "Itemized Milestones & On-Chain Audit Records",
            content: rows,
          },
        ],
        footerText: `SIID Industri-Eye™ Ledger Verification | Hash Certified`,
      })

      pdf.save(`SIID-Financial-Ledger-${date.replace(/\//g, "-")}.pdf`)
      toast.success("Financial Ledger statement downloaded.")
    } catch (e) {
      toast.error("Failed to generate PDF statement.")
    }
  }

  return (
    <Card className="p-4 sm:p-6 md:p-8 border-border shadow-2xl rounded-2xl sm:rounded-[2rem] bg-card relative overflow-hidden space-y-6">
      
      {/* Glow Backdrop Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-border relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                Project Financial Ledger & Escrow Vault
              </h3>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Smart-Contract Escrow Verification Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateAdvisory}
            disabled={isAdvisoryLoading}
            className="text-xs font-bold gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          >
            {isAdvisoryLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            AI Cash Flow Advisory
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Milestone
          </Button>

          <Button
            size="sm"
            onClick={handleExportStatement}
            className="text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </Button>
        </div>
      </div>

      {/* 4-CARD FINANCIAL METRIC BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
        
        {/* Metric 1: Total Committed */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Total Committed</span>
            <Database className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-lg sm:text-xl font-black text-foreground">{formatCurrency(totalBudget)}</div>
          <span className="text-[10px] font-semibold text-muted-foreground block">5 Active Tranches</span>
        </div>

        {/* Metric 2: Disbursed */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <span>Capital Disbursed</span>
            <Unlock className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(paidAmount)}
          </div>
          <span className="text-[10px] font-semibold text-emerald-600/80 block">
            {Math.round((paidAmount / totalBudget) * 100)}% of commitment
          </span>
        </div>

        {/* Metric 3: Escrow Locked */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <span>Escrow Vault Locked</span>
            <Lock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
            {formatCurrency(lockedEscrow)}
          </div>
          <span className="text-[10px] font-semibold text-amber-600/80 block">Safe until milestone sign-off</span>
        </div>

        {/* Metric 4: AI Projected Savings */}
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            <span>Preserved Savings</span>
            <TrendingDown className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">₹1,42,000</div>
          <span className="text-[10px] font-semibold text-blue-600/80 block">Via rate-lock negotiation</span>
        </div>
      </div>

      {/* CAPITAL ABSORPTION PROGRESS BAR */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Escrow Disbursement Progress</span>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(paidAmount)} / {formatCurrency(totalBudget)} ({Math.round((paidAmount / totalBudget) * 100)}%)
          </span>
        </div>
        <Progress value={(paidAmount / totalBudget) * 100} className="h-2 bg-muted" />
      </div>

      {/* AI CASH FLOW ADVISORY ACCORDION */}
      {aiAdvisory && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI Cash Flow Intelligence & Risk Forecast
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiAdvisory(null)}
              className="h-6 text-[10px] text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
            {aiAdvisory}
          </pre>
        </motion.div>
      )}

      {/* INTERACTIVE NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        
        {/* View Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border">
          <button
            onClick={() => setActiveView("milestones")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === "milestones"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Escrow Milestones ({milestones.length})
          </button>

          <button
            onClick={() => setActiveView("expenses")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === "expenses"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cost Analytics
          </button>

          <button
            onClick={() => setActiveView("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === "audit"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audit Trail
          </button>
        </div>

        {/* Filter Pills & Search */}
        {activeView === "milestones" && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search milestone or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>

            <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border">
              {["all", "completed", "in-progress", "upcoming"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                    filterStatus === st
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st === "all" ? "All" : st === "completed" ? "Paid" : st === "in-progress" ? "Review" : "Locked"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: MILESTONES & ESCROW TRANCHES */}
      {activeView === "milestones" && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {filteredMilestones.map((milestone, index) => {
            const isExpanded = expandedId === milestone.id
            const isCompleted = milestone.status === "completed"
            const isInProgress = milestone.status === "in-progress"

            return (
              <div
                key={milestone.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                    : isInProgress
                    ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                    : "border-border bg-muted/10 hover:border-border/80"
                }`}
                onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Left: Step Badge & Info */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                          : isInProgress
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-foreground">{milestone.name}</h4>
                        {milestone.aiVerified && (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-bold">
                            <Eye className="w-3 h-3 mr-1" /> AI Verified
                          </Badge>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                          {milestone.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Due: {milestone.dueDate}
                        </span>
                        <span className="font-semibold text-foreground">Vendor: {milestone.vendorName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Payment & Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                    <div className="text-base sm:text-lg font-black text-foreground">
                      {formatCurrency(milestone.payment)}
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-emerald-500 text-white text-[10px] font-bold">DISBURSED</Badge>
                    ) : isInProgress ? (
                      <Badge className="bg-amber-500 text-white text-[10px] font-bold">IN REVIEW ({milestone.progress}%)</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-bold">ESCROW LOCKED</Badge>
                    )}
                  </div>
                </div>

                {/* Progress bar for in-progress */}
                {isInProgress && (
                  <div className="mt-3.5 sm:pl-14">
                    <div className="flex justify-between text-[10px] font-bold text-amber-600 mb-1">
                      <span>Inspection Verification Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-1.5 bg-amber-500/10" />
                  </div>
                )}

                {/* EXPANDED ACCORDION CONTENT */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border/60 sm:pl-14 space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Deliverables Checklist */}
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                          Verified Deliverables & Sign-offs
                        </span>
                        <ul className="space-y-1.5">
                          {milestone.deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-foreground font-medium">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-500" : "text-slate-400"}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Smart Contract Meta */}
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                          Escrow Smart Contract Metadata
                        </span>
                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contract ID:</span>
                            <span className="font-bold text-foreground">{milestone.smartContractId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Blockchain Record:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {milestone.blockchainHash || "Locked on Vault"}
                            </span>
                          </div>
                          {milestone.releasedDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payout Date:</span>
                              <span className="text-foreground">{milestone.releasedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Trigger Escrow Payout Action */}
                    {isInProgress && (
                      <Button
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSmartPayout(milestone.id)
                        }}
                        disabled={processingId === milestone.id}
                      >
                        {processingId === milestone.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying Quality Sign-Off & Executing Transfer...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-amber-300" />
                            <span>Release Escrow Payout ({formatCurrency(milestone.payment)})</span>
                          </>
                        )}
                      </Button>
                    )}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* TAB 2: COST ANALYTICS & EXPENSE BREAKDOWN */}
      {activeView === "expenses" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-foreground">{item.category}</h5>
                    <span className="text-xs text-muted-foreground">{item.pct}% of total budget</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-foreground">{formatCurrency(item.total)}</span>
                    <span className="text-[10px] text-emerald-600 block">
                      {formatCurrency(item.disbursed)} paid
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Progress value={(item.disbursed / item.total) * 100} className="h-2 bg-muted" />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>Disbursed: {Math.round((item.disbursed / item.total) * 100)}%</span>
                    <span>Remaining: {formatCurrency(item.total - item.disbursed)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeView === "audit" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs font-mono text-muted-foreground flex items-center justify-between">
            <span>Audit Trail Protocol: SIID-ESCROW-V2.1</span>
            <span className="text-emerald-500 font-bold">100% Cryptographically Verified</span>
          </div>

          <div className="space-y-2">
            {milestones.map((m) => (
              <div key={m.id} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="font-bold text-foreground block">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground">Contract: {m.smartContractId} • {m.vendorName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-foreground">{formatCurrency(m.payment)}</span>
                  <span className={`text-[10px] block font-semibold ${m.status === "completed" ? "text-emerald-500" : "text-amber-500"}`}>
                    {m.blockchainHash || "Vault Escrow Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD MILESTONE MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              Add Payment Milestone
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMilestoneSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Milestone Title *</Label>
              <Input
                placeholder="e.g., Internal Flooring & Tile Layout"
                value={newMilestone.name}
                onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Tranche Amount (₹) *</Label>
                <Input
                  type="number"
                  value={newMilestone.payment}
                  onChange={(e) => setNewMilestone({ ...newMilestone, payment: Number(e.target.value) })}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Target Due Date *</Label>
                <Input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <select
                value={newMilestone.category}
                onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value as any })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="Civil & RCC">Civil & RCC</option>
                <option value="Masonry & Finishing">Masonry & Finishing</option>
                <option value="MEP & Electrical">MEP & Electrical</option>
                <option value="Planning & Approvals">Planning & Approvals</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Assigned Vendor / Trade Partner</Label>
              <Input
                placeholder="e.g., Apex Buildtech Solutions"
                value={newMilestone.vendorName}
                onChange={(e) => setNewMilestone({ ...newMilestone, vendorName: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Key Deliverables (one per line)</Label>
              <textarea
                rows={3}
                placeholder="Vitrified tile laying&#10;Grouting & skirting&#10;Final floor polishing"
                value={newMilestone.deliverablesText}
                onChange={(e) => setNewMilestone({ ...newMilestone, deliverablesText: e.target.value })}
                className="w-full rounded-md border border-input bg-background p-2 text-xs outline-none focus:ring-1 ring-emerald-500"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Save & Lock in Escrow
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
