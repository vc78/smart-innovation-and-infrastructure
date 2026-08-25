"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calculator, 
  ArrowLeft, 
  Download, 
  History, 
  TrendingUp, 
  AlertCircle,
  Construction,
  Layers,
  Zap,
  Droplets,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth-guard"
import { generateMaterialReportPDF } from "@/lib/material-pdf-export"
import { getCurrentUser } from "@/lib/auth"
import { toast } from "sonner"

export default function MaterialCalculatorPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const materials = [
    { name: "Concrete", amount: "450 m³", cost: "₹2.2M", progress: 65, icon: Construction, color: "text-blue-500" },
    { name: "Steel Rebar", amount: "65 Tons", cost: "₹4.1M", progress: 40, icon: Layers, color: "text-slate-500" },
    { name: "Bricks", amount: "125,000", cost: "₹1.5M", progress: 85, icon: Grid3x3, color: "text-orange-500" },
    { name: "Electrical", amount: "2.4 km", cost: "₹0.8M", progress: 10, icon: Zap, color: "text-yellow-500" },
    { name: "Plumbing", amount: "1.8 km", cost: "₹0.6M", progress: 5, icon: Droplets, color: "text-cyan-500" }
  ]

  const handleExportPDF = async () => {
    setDownloadingPDF(true)
    const toastId = toast.loading("Processing project data with Gemini AI Engine...")

    try {
      const user = getCurrentUser()
      const projectPayload = {
        length: 50,
        width: 40,
        plotArea: 2000,
        builtUpArea: 3400,
        floors: 2,
        city: "Hyderabad",
        grade: "Premium",
        direction: "North-East",
        soil: "Red Loamy Soil",
        cement: "OPC 53 Grade (High Strength)",
        steel: "Fe 550D TMT Rebar",
        beds: 4,
        baths: 4,
        kitchenType: "Modular Island",
        archStyle: "Modern / Contemporary",
        amenities: ["Home Office", "Terrace Garden", "Smart Automation", "Solar Panels"],
        compliances: ["Vastu Compliance", "Green Building Certification", "Fire Safety NOC"],
        result: {
          totalCost: 9200000,
          costPerSqFt: 2705,
          timeline: "9-11 Months",
          feasibility: "Within Target Budget",
          breakdown: {
            base_structure: 5200000,
            finishes_and_interiors: 1800000,
            amenities: 950000,
            mep_services: 650000,
            site_development: 200000,
            statutory_and_gst: 400000,
          },
          materials: {
            "Cement (OPC 53)": "1,150 bags — ₹4,48,500",
            "Structural Steel (Fe 550D)": "11,200 kg — ₹7,28,000",
            "M-Sand (Zone II)": "5,400 cft — ₹2,59,200",
            "Red Bricks / AAC": "42,000 nos — ₹3,78,000",
            "Coarse Aggregate (20mm)": "3,900 cft — ₹1,63,800",
            "Ready Mix Concrete (M25)": "145 m³ — ₹6,23,500",
          },
          alerts: [
            "Soil bearing capacity is optimal for isolated footings with tie beams.",
            "Phased procurement of Fe 550D steel recommended to prevent on-site corrosion.",
          ],
        },
      }

      // Call Gemini document processing endpoint
      const aiRes = await fetch("/api/process-project-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDetails: {
            length: 50,
            width: 40,
            plotArea: 2000,
            builtUpArea: 3400,
            floors: 2,
            city: "Hyderabad",
            grade: "Premium",
            direction: "North-East",
            soil: "Red Loamy Soil",
            cement: "OPC 53 Grade",
            steel: "Fe 550D TMT",
            beds: 4,
            baths: 4,
            kitchenType: "Modular Island",
            archStyle: "Modern / Contemporary",
            amenities: ["Home Office", "Terrace Garden", "Smart Automation", "Solar Panels"],
            compliances: ["Vastu Compliance", "Green Building", "Fire Safety"],
          },
          materialQuantities: projectPayload.result.materials,
          financialBreakdown: {
            ...projectPayload.result.breakdown,
            totalCostFormatted: "₹ 92.00 Lakhs",
          },
          userInfo: user ? { name: user.name, email: user.email } : null,
        }),
      })

      let aiAnalysis = null
      if (aiRes.ok) {
        const aiJson = await aiRes.json()
        aiAnalysis = aiJson.data
      }

      toast.loading("Generating Project Manifest PDF...", { id: toastId })

      const fileName = await generateMaterialReportPDF(
        projectPayload,
        aiAnalysis,
        user ? { name: user.name, email: user.email } : null
      )

      toast.success(`Downloaded ${fileName} successfully!`, { id: toastId })
    } catch (e: any) {
      console.error("PDF export error:", e)
      toast.error(e.message || "Failed to export PDF", { id: toastId })
    } finally {
      setDownloadingPDF(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                  <Calculator className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
                  Material Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">AI-powered estimation and procurement tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                onClick={handleExportPDF}
                disabled={downloadingPDF}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Document...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export Manifest (PDF)</span>
                  </>
                )}
              </Button>
            </div>
          </header>

          {/* Top KPI Cards - Side by Side 2-Column Grid on Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
             <Card className="bg-slate-900 border-slate-800 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                   <p className="text-[11px] sm:text-sm text-slate-500 uppercase font-bold tracking-wider truncate">Total Estimate</p>
                   <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                </div>
                <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">₹9.2M<span className="text-xs sm:text-sm font-normal text-slate-500 ml-1 sm:ml-2">± 2%</span></p>
             </Card>
             <Card className="bg-slate-900 border-slate-800 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                   <p className="text-[11px] sm:text-sm text-slate-500 uppercase font-bold tracking-wider truncate">Market Drift</p>
                   <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                </div>
                <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">+4.2%<span className="text-xs sm:text-sm font-normal text-slate-500 ml-1 sm:ml-2">30d</span></p>
             </Card>
             <Card className="bg-slate-900 border-slate-800 p-4 sm:p-6 rounded-xl col-span-2 md:col-span-1">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                   <p className="text-[11px] sm:text-sm text-slate-500 uppercase font-bold tracking-wider truncate">Optimization</p>
                   <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                </div>
                <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">12.5%<span className="text-xs sm:text-sm font-normal text-slate-500 ml-1 sm:ml-2">savings</span></p>
             </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800 rounded-xl overflow-hidden">
             <CardHeader className="border-b border-slate-800 p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-white">Quantum Inventory Analysis</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                {materials.map((m, i) => (
                  <div key={i} className="flex items-center p-3.5 sm:p-6 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors gap-3 sm:gap-6">
                     <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0 ${m.color}`}>
                        <m.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                     </div>
                     <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between items-center gap-2">
                            <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-tight truncate">{m.name}</h3>
                            <span className="text-xs sm:text-sm font-mono text-slate-400 flex-shrink-0">{m.amount} | {m.cost}</span>
                        </div>
                        <Progress value={m.progress} className="h-1.5 sm:h-2 bg-slate-950" />
                     </div>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}

function Grid3x3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  )
}
