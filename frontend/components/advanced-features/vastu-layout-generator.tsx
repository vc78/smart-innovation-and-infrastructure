"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Compass,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Loader2,
  Layers,
  ShieldCheck,
  Palette,
  Sun,
  Wind,
  Flame,
  Droplets,
  Mountain,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateProfessionalDocument } from "@/lib/document-template"

interface VastuInput {
  constructionType: string
  floors: string
  builtUpArea: string
  plotLength: number
  plotWidth: number
  plotArea: number
  facing: string
  roadPosition: string
  openSpaces: string
  neighborHeight: string
  climaticZone: string
}

interface BlueprintRoom {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  zone: string
  color: string
  textColor: string
}

interface VastuApiResponse {
  overallScore: number
  vastuCategory: string
  executiveSummary: string
  elementalBalance: {
    waterNE: { status: string; score: number; element: string; recommendation: string }
    fireSE: { status: string; score: number; element: string; recommendation: string }
    earthSW: { status: string; score: number; element: string; recommendation: string }
    airNW: { status: string; score: number; element: string; recommendation: string }
    spaceCenter: { status: string; score: number; element: string; recommendation: string }
  }
  roomAudits: {
    room: string
    zone: string
    status: "compliant" | "warning" | "non-compliant"
    score: number
    impact: string
    scientificReason: string
    remedy: string | null
  }[]
  blueprintRooms: BlueprintRoom[]
  doshas: { name: string; severity: "high" | "medium" | "low"; remedy: string }[]
  remedies: { title: string; description: string }[]
  colorTherapy: { zone: string; colors: string[] }[]
}

export function VastuLayoutGenerator() {
  const [step, setStep] = useState(1)
  const [inputs, setInputs] = useState<VastuInput>({
    constructionType: "villa",
    floors: "G+1",
    builtUpArea: "2400 sq.ft",
    plotLength: 40,
    plotWidth: 30,
    plotArea: 1200,
    facing: "north",
    roadPosition: "one-side",
    openSpaces: "moderate",
    neighborHeight: "ground",
    climaticZone: "moderate",
  })
  const [aiData, setAiData] = useState<VastuApiResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const { toast } = useToast()

  const updateDimensions = (field: "plotLength" | "plotWidth", value: number) => {
    const newInputs = { ...inputs, [field]: value }
    newInputs.plotArea = newInputs.plotLength * newInputs.plotWidth
    setInputs(newInputs)
  }

  const generateGeminiLayout = async (isAutoOptimize = false) => {
    if (!inputs.plotLength || !inputs.plotWidth) {
      toast({
        title: "Incomplete Dimensions",
        description: "Please enter plot length and width.",
        variant: "destructive",
      })
      return
    }

    if (isAutoOptimize) {
      setIsOptimizing(true)
    } else {
      setIsGenerating(true)
    }

    const toastId = toast({
      title: isAutoOptimize ? "Auto-Optimizing Vastu..." : "Generating Vedic Vastu Blueprint...",
      description: "Consulting Gemini AI Vastu Engine with plot parameters.",
    })

    try {
      const res = await fetch("/api/analyze-vastu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constructionType: inputs.constructionType,
          floors: inputs.floors,
          plotDimensions: {
            length: inputs.plotLength,
            width: inputs.plotWidth,
            area: inputs.plotArea,
          },
          facing: inputs.facing.charAt(0).toUpperCase() + inputs.facing.slice(1),
          openSpaces: inputs.openSpaces,
          action: isAutoOptimize ? "optimize" : "analyze",
        }),
      })

      if (!res.ok) throw new Error("Vastu AI synthesis service returned an error")

      const json = await res.json()
      if (json.success && json.data) {
        setAiData(json.data)
        toast({
          title: isAutoOptimize ? "✨ Vastu Optimization Complete" : "✨ Vastu Blueprint Generated",
          description: `Vastu Compliance Score: ${json.data.overallScore}% (${json.data.vastuCategory})`,
        })
      }
    } catch (err: any) {
      console.error("Vastu generation error:", err)
      toast({
        title: "Generation Error",
        description: err.message || "Failed to generate Vastu blueprint",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setIsOptimizing(false)
    }
  }

  const downloadPDF = async () => {
    if (!aiData) return
    try {
      const date = new Date().toLocaleDateString()
      const roomContent = aiData.roomAudits.map(
        (r) => `${r.zone.toUpperCase()} — ${r.room} (Score: ${r.score}%): ${r.scientificReason} ${r.remedy ? `[Remedy: ${r.remedy}]` : ""}`
      )

      const pdf = await generateProfessionalDocument({
        title: "Vedic Vastu & Architectural Blueprint Audit",
        subtitle: `Vastu Compliance Score: ${aiData.overallScore}% — ${aiData.vastuCategory}`,
        sections: [
          {
            heading: "Plot Specifications",
            content: [
              `Structure: ${inputs.constructionType.toUpperCase()} (${inputs.floors})`,
              `Dimensions: ${inputs.plotLength}ft × ${inputs.plotWidth}ft (${inputs.plotArea} sq.ft)`,
              `Entrance Facing: ${inputs.facing.toUpperCase()}`,
              `Surrounding Open Spaces: ${inputs.openSpaces}`,
              `Generated Date: ${date}`,
            ],
          },
          {
            heading: "Executive Spatial Appraisal",
            content: [
              aiData.executiveSummary,
              `Panch Tattva Water (NE): ${aiData.elementalBalance.waterNE.score}% (${aiData.elementalBalance.waterNE.status})`,
              `Panch Tattva Fire (SE): ${aiData.elementalBalance.fireSE.score}% (${aiData.elementalBalance.fireSE.status})`,
              `Panch Tattva Earth (SW): ${aiData.elementalBalance.earthSW.score}% (${aiData.elementalBalance.earthSW.status})`,
              `Panch Tattva Air (NW): ${aiData.elementalBalance.airNW.score}% (${aiData.elementalBalance.airNW.status})`,
              `Panch Tattva Space (Center): ${aiData.elementalBalance.spaceCenter.score}% (${aiData.elementalBalance.spaceCenter.status})`,
            ],
          },
          {
            heading: "Room-by-Room Directional Audits",
            content: roomContent,
          },
        ],
        footerText: `SIID Certified Vastu Purusha Mandala Audit | Compliance Score: ${aiData.overallScore}%`,
      })

      pdf.save(`SIID-Vastu-Audit-${inputs.constructionType}-${date.replace(/\//g, "-")}.pdf`)
      toast({
        title: "Report Downloaded",
        description: "Official Vastu audit PDF has been saved.",
      })
    } catch (e) {
      toast({
        title: "Download Failed",
        description: "Could not compile PDF.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-4 sm:p-6 md:p-8 border-border shadow-2xl rounded-2xl bg-card space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Vedic Vastu AI Layout & Blueprint Synthesizer
            </h3>
            <p className="text-xs text-muted-foreground">
              Harmonizes plot dimensions with Vastu Purusha Mandala & solar trajectories
            </p>
          </div>
        </div>

        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs font-semibold">
          Gemini 2.5 Intelligence
        </Badge>
      </div>

      {/* 3-STEP CONFIGURATION INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
        
        {/* Col 1: Structure */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase text-muted-foreground">1. Building Structure</Label>
          <div className="space-y-2">
            <Select value={inputs.constructionType} onValueChange={(v) => setInputs({ ...inputs, constructionType: v })}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Structure Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="villa">Independent Villa</SelectItem>
                <SelectItem value="house">Individual House</SelectItem>
                <SelectItem value="duplex">Modern Duplex</SelectItem>
                <SelectItem value="apartment">Residential Apartment</SelectItem>
                <SelectItem value="office">Commercial Office</SelectItem>
              </SelectContent>
            </Select>

            <Select value={inputs.floors} onValueChange={(v) => setInputs({ ...inputs, floors: v })}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Floors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="G">Ground Floor (G)</SelectItem>
                <SelectItem value="G+1">G + 1 Floor</SelectItem>
                <SelectItem value="G+2">G + 2 Floors</SelectItem>
                <SelectItem value="G+3">G + 3 Floors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Col 2: Dimensions */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase text-muted-foreground">2. Plot Geometry</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">Length (ft)</span>
              <Input
                type="number"
                value={inputs.plotLength}
                onChange={(e) => updateDimensions("plotLength", Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">Width (ft)</span>
              <Input
                type="number"
                value={inputs.plotWidth}
                onChange={(e) => updateDimensions("plotWidth", Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <div className="text-[11px] font-semibold text-muted-foreground">
            Total Plot: <span className="text-foreground">{inputs.plotArea} sq.ft</span>
          </div>
        </div>

        {/* Col 3: Orientation */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase text-muted-foreground">3. Entrance Facing</Label>
          <Select value={inputs.facing} onValueChange={(v) => setInputs({ ...inputs, facing: v })}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Facing Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North (Prosperity / Kubera)</SelectItem>
              <SelectItem value="northeast">North-East (Ishanya / Spiritual)</SelectItem>
              <SelectItem value="east">East (Health / Surya)</SelectItem>
              <SelectItem value="southeast">South-East (Agni)</SelectItem>
              <SelectItem value="south">South (Yama)</SelectItem>
              <SelectItem value="southwest">South-West (Prithvi / Stability)</SelectItem>
              <SelectItem value="west">West (Varuna)</SelectItem>
              <SelectItem value="northwest">North-West (Vayu)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => generateGeminiLayout(false)}
            disabled={isGenerating || isOptimizing}
            className="w-full h-9 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Generate Vastu Blueprint</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SYNTHESIZED RESULTS & BLUEPRINT VIEWER */}
      {aiData && (
        <div className="space-y-6 pt-2 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Top Score Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300 tracking-wider">
                  Vastu Purusha Mandala Audit
                </span>
                <Badge className="bg-emerald-500 text-white text-[10px]">
                  {aiData.vastuCategory}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {aiData.executiveSummary}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Harmonic Score</span>
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {aiData.overallScore}%
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => generateGeminiLayout(true)}
                disabled={isOptimizing}
                className="gap-1.5 text-xs font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
              >
                {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Auto-Optimize
              </Button>

              <Button size="sm" onClick={downloadPDF} className="gap-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </Button>
            </div>
          </div>

          {/* 2-COLUMN DISPLAY: BLUEPRINT CANVAS (Left) + AUDITS & REMEDIES (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: 2D VECTOR CAD BLUEPRINT CANVAS (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Vector CAD Blueprint Layout ({inputs.plotLength}' × {inputs.plotWidth}')
                </h4>
                <span className="text-[10px] font-semibold text-muted-foreground">Scale 1:50 Vector Floorplan</span>
              </div>

              {/* Interactive Vector CAD Blueprint Grid */}
              <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-950 border-2 border-slate-800 p-4 shadow-2xl overflow-hidden flex items-center justify-center">
                
                {/* Blueprint Grid Lines Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

                {/* Compass Compass Rose in North-East */}
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center shadow-lg pointer-events-none">
                  <div className="w-8 h-8 rounded-full border border-amber-400 flex items-center justify-center mx-auto text-amber-400 font-black text-[11px]">
                    N
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 tracking-widest block mt-0.5">COMPASS</span>
                </div>

                {/* Direction Labels on Canvas Perimeter */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  NORTH (Kubera)
                </span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  SOUTH (Yama)
                </span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest [writing-mode:vertical-rl]">
                  EAST (Surya)
                </span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest [writing-mode:vertical-rl]">
                  WEST (Varuna)
                </span>

                {/* Central Brahmasthan Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-dashed border-amber-500/40 flex items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-bold text-amber-400/70 uppercase text-center leading-none">
                    Brahma<br />sthan
                  </span>
                </div>

                {/* Render Dynamic Blueprint Rooms */}
                <div className="relative w-[85%] h-[80%] border-2 border-slate-600 bg-slate-900/60 rounded-xl overflow-hidden shadow-inner">
                  {aiData.blueprintRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute rounded-lg border border-slate-700/80 p-2 flex flex-col justify-between shadow-md group hover:border-amber-400/80 hover:z-20 transition-all cursor-pointer"
                      style={{
                        top: `${room.y}%`,
                        left: `${room.x}%`,
                        width: `${room.w}%`,
                        height: `${room.h}%`,
                        backgroundColor: `${room.color}22`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold truncate" style={{ color: room.textColor }}>
                          {room.name}
                        </span>
                        <span className="text-[8px] px-1 py-0.2 rounded bg-slate-950/80 text-slate-400 font-mono">
                          {room.zone}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[8px] text-slate-400 font-medium">
                        <span>🚪 Door Swing</span>
                        <span className="text-emerald-400 font-semibold">Vastu OK</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: 5-ZONE PANCH TATTVA & ROOM AUDITS (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 5-Zone Elemental Balance Breakdown */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2.5">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                  Panch Tattva Elemental Zones
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Droplets className="w-3.5 h-3.5 text-cyan-500" /> North-East (Jal / Water)
                    </span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      {aiData.elementalBalance.waterNE.score}% • {aiData.elementalBalance.waterNE.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Flame className="w-3.5 h-3.5 text-red-500" /> South-East (Agni / Fire)
                    </span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {aiData.elementalBalance.fireSE.score}% • {aiData.elementalBalance.fireSE.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Mountain className="w-3.5 h-3.5 text-amber-600" /> South-West (Prithvi / Earth)
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {aiData.elementalBalance.earthSW.score}% • {aiData.elementalBalance.earthSW.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Wind className="w-3.5 h-3.5 text-indigo-500" /> North-West (Vayu / Air)
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {aiData.elementalBalance.airNW.score}% • {aiData.elementalBalance.airNW.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Sun className="w-3.5 h-3.5 text-yellow-500" /> Center (Akash / Space)
                    </span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">
                      {aiData.elementalBalance.spaceCenter.score}% • {aiData.elementalBalance.spaceCenter.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Audits List */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                  Directional Compliance Matrix
                </span>

                <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                  {aiData.roomAudits.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-border bg-card shadow-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {item.room} ({item.zone})
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {item.score}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {item.scientificReason}
                      </p>
                      {item.remedy && (
                        <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/20 p-1.5 rounded border border-amber-200 dark:border-amber-900/30">
                          Remedy: {item.remedy}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
