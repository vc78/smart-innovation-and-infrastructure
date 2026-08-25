"use client"

import { useState, useEffect } from "react"
import type { BuildingInputs } from "@/lib/3d-model-generator"
import { ThreeDModelInputForm } from "@/components/3d-model-input-form"
import { ThreeDModelViewer } from "@/components/3d-model-viewer"
import { VastuLayoutGenerator } from "@/components/advanced-features/vastu-layout-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Cable as Cube,
  Grid3x3,
  Sparkles,
  Layers,
  Compass,
  Sun,
  ShieldCheck,
  Zap,
  RotateCcw,
  Loader2,
  Building,
  Home,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

const QUICK_PRESETS = [
  {
    label: "Modern 2-Floor Villa",
    icon: Home,
    prompt: "Modern 2-floor luxury villa with cantilevered glass balcony, open terrace garden, and north entrance",
    dimensions: { length: 20, width: 15 },
    floors: 2,
    style: "modern",
  },
  {
    label: "3-Storey Urban Duplex",
    icon: Building,
    prompt: "3-storey contemporary duplex with timber louvers, floor-to-ceiling tinted glass, and shaded porch",
    dimensions: { length: 25, width: 18 },
    floors: 3,
    style: "contemporary",
  },
  {
    label: "Minimalist Courtyard House",
    icon: Compass,
    prompt: "Minimalist single-floor courtyard residence with deep overhangs, white lime finish, and flat roof",
    dimensions: { length: 22, width: 16 },
    floors: 1,
    style: "minimalist",
  },
  {
    label: "Glass Commercial Facade",
    icon: Layers,
    prompt: "4-floor commercial corporate building with curtain glass facade, dark slate columns, and rooftop terrace",
    dimensions: { length: 30, width: 20 },
    floors: 4,
    style: "modern",
  },
]

export default function ThreeDGeneratorPage() {
  const [buildingInputs, setBuildingInputs] = useState<BuildingInputs | null>(null)
  const [aiAppraisal, setAiAppraisal] = useState<any>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login?redirect=/3d-generator")
      } else {
        setIsAuthorized(true)
        // Load default model on first visit
        handleQuickPreset(QUICK_PRESETS[0])
      }
    }
  }, [router])

  const handleGenerate = (inputs: BuildingInputs) => {
    setBuildingInputs(inputs)
    setShowViewer(true)
  }

  const handleAiSynthesis = async (customPrompt?: string, presetParams?: any) => {
    const promptText = (customPrompt || aiPrompt).trim()
    setIsAiGenerating(true)
    const toastId = toast.loading("Generating 3D architectural model...")

    try {
      const res = await fetch("/api/generate-3d-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          dimensions: presetParams?.dimensions || buildingInputs?.plotDimensions || { length: 20, width: 15 },
          floors: presetParams?.floors || buildingInputs?.numberOfFloors || 2,
          style: presetParams?.style || buildingInputs?.designStyle || "modern",
          orientation: buildingInputs?.plotOrientation || "N",
          roofType: buildingInputs?.roofType || "flat",
        }),
      })

      if (!res.ok) throw new Error("AI Synthesis service failed")

      const json = await res.json()
      if (json.success && json.data) {
        setBuildingInputs(json.data.buildingInputs)
        setAiAppraisal(json.data.architecturalAppraisal)
        setShowViewer(true)
        toast.success("3D Architectural model rendered successfully!", { id: toastId })
      }
    } catch (err: any) {
      console.error("AI 3D Synthesis error:", err)
      toast.error(err.message || "Failed to generate 3D architecture", { id: toastId })
    } finally {
      setIsAiGenerating(false)
    }
  }

  const handleQuickPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setAiPrompt(preset.prompt)
    handleAiSynthesis(preset.prompt, preset)
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
              <Cube className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  3D Spatial Architecture Studio
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px] font-semibold">
                  Live AI Engine
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Generative real-time 3D building modeling and CAD spatial layout simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Viewport Ready</span>
            </div>
          </div>
        </div>

        {/* AI ARCHITECTURAL PROMPT BAR & PRESETS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Natural Language AI Synthesis
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Describe any building concept or choose a preset</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAiSynthesis()
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Modern 3-storey villa with glass facade, north-facing balcony, and wooden louvers..."
              className="flex-1 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
            />
            <Button
              type="submit"
              disabled={isAiGenerating}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 flex-shrink-0"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Model...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Synthesize 3D Model</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Presets Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex-shrink-0">Presets:</span>
            {QUICK_PRESETS.map((preset) => {
              const IconComp = preset.icon
              return (
                <button
                  key={preset.label}
                  onClick={() => handleQuickPreset(preset)}
                  disabled={isAiGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-xs text-slate-300 hover:text-emerald-300 transition-all flex-shrink-0"
                >
                  <IconComp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{preset.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* MAIN WORKSPACE: 2-COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: PARAMETRIC CONTROLS (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Parametric Design Controls
                </h3>
                <span className="text-[10px] text-slate-400">Fine-tune variables</span>
              </div>
              <ThreeDModelInputForm onGenerate={handleGenerate} />
            </div>
          </div>

          {/* RIGHT: INTERACTIVE 3D/2D VIEWPORT (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {showViewer && buildingInputs ? (
              <>
                {/* Viewport Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/90 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {viewMode === "3d" ? "3D Spatial Building Model" : "2D Vector CAD Blueprint"}
                    </h2>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live WebGL
                    </Badge>
                  </div>

                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <Button
                      variant={viewMode === "3d" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("3d")}
                      className={`text-xs font-bold gap-1.5 h-8 ${viewMode === "3d" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      <Cube className="w-3.5 h-3.5" />
                      3D Model
                    </Button>
                    <Button
                      variant={viewMode === "2d" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("2d")}
                      className={`text-xs font-bold gap-1.5 h-8 ${viewMode === "2d" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      <Grid3x3 className="w-3.5 h-3.5" />
                      2D Blueprint
                    </Button>
                  </div>
                </div>

                {/* 3D Model / 2D Viewer */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                  {viewMode === "3d" ? (
                    <ThreeDModelViewer inputs={buildingInputs} autoPlay showControls />
                  ) : (
                    <div className="p-4">
                      <VastuLayoutGenerator />
                    </div>
                  )}
                </div>

                {/* AI ARCHITECTURAL APPRAISAL CARD */}
                {aiAppraisal && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">{aiAppraisal.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                          Vastu: {aiAppraisal.vastuScore}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                          Daylight: {aiAppraisal.daylightVentilationScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiAppraisal.conceptSummary}
                    </p>

                    {aiAppraisal.structuralFeatures && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {aiAppraisal.structuralFeatures.map((feat: string, idx: number) => (
                          <div key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Model Specs Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Dimensions</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {buildingInputs.plotDimensions.length}m × {buildingInputs.plotDimensions.width}m
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Floors</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {buildingInputs.numberOfFloors} ({buildingInputs.numberOfFloors * buildingInputs.floorHeight}m Height)
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Design Style</span>
                    <p className="text-sm font-bold text-emerald-400 capitalize mt-0.5">
                      {buildingInputs.designStyle}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Orientation</span>
                    <p className="text-sm font-bold text-cyan-400 mt-0.5">
                      {buildingInputs.plotOrientation}-Facing
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[500px] rounded-2xl bg-slate-900/60 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Cube className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">No 3D Architecture Rendered Yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Enter an architectural prompt or adjust parametric sliders on the left to render your real-time 3D building model.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
