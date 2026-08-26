"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Wrench,
  FileText,
  Boxes,
  Building2,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Layers,
  Home,
  ChevronRight,
} from "lucide-react"
import Navbar from "@/components/navbar"
import ConstructionAssistant from "@/components/construction-assistant"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CONSTRUCTION_STAGES, ConstructionStage } from "@/data/construction-stages"

export default function ConstructionStageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const stageId = (params?.stageId as string) || "site-survey"

  const stage = CONSTRUCTION_STAGES.find((s) => s.id === stageId) || CONSTRUCTION_STAGES[0]

  const [activeTab, setActiveTab] = useState<"overview" | "process" | "inputs-outputs" | "example" | "quality">("overview")
  const [openAccordion, setOpenAccordion] = useState<string | null>("act-0")

  // Find previous and next stages
  const prevStage = CONSTRUCTION_STAGES.find((s) => s.id === stage.prevStageId)
  const nextStage = CONSTRUCTION_STAGES.find((s) => s.id === stage.nextStageId)

  // Scroll to top on stage change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setActiveTab("overview")
  }, [stageId])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      {/* Sticky Stage Navigation Sub-Bar */}
      <div className="sticky top-[64px] sm:top-[72px] z-40 bg-background/95 backdrop-blur-md border-b border-border/60 py-2.5 px-4 shadow-sm">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-2">
          {/* Back to Journey */}
          <Link
            href="/#how-it-works"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Construction</span> Journey
          </Link>

          {/* Current Stage Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm font-bold text-primary">
              Stage 0{stage.step} of 08
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-[220px]">
              {stage.title}
            </span>
          </div>

          {/* Prev / Next Quick Arrows */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {prevStage ? (
              <Link href={`/construction/${prevStage.id}`}>
                <Button size="sm" variant="outline" className="h-8 px-2 sm:px-3 text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden md:inline">Prev</span>
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" disabled className="h-8 px-2 sm:px-3 text-xs opacity-40">
                <ArrowLeft className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden md:inline">Prev</span>
              </Button>
            )}

            {nextStage ? (
              <Link href={`/construction/${nextStage.id}`}>
                <Button size="sm" className="h-8 px-2 sm:px-3 text-xs bg-primary hover:bg-primary/90 text-white font-bold">
                  <span className="hidden md:inline">Next</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:ml-1" />
                </Button>
              </Link>
            ) : (
              <Link href="/projects/create">
                <Button size="sm" className="h-8 px-2 sm:px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  <Sparkles className="w-3.5 h-3.5 sm:mr-1" />
                  <span>Start Project</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
            Construction Journey
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold">Stage 0{stage.step}: {stage.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-10 items-center">
          {/* Left Text (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-white font-black text-xs px-3 py-1 shadow-sm">
                STAGE 0{stage.step} OF 08
              </Badge>
              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 text-xs font-semibold">
                {stage.category}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground text-xs">
                <Clock className="w-3 h-3 mr-1 inline" /> {stage.estimatedTimeline}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              {stage.title}
            </h1>

            <p className="text-base sm:text-lg font-medium text-primary leading-snug">
              "{stage.tagline}"
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {stage.shortSummary}
            </p>

            {/* Why This Matters Callout Box */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs sm:text-sm text-foreground/90 leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-primary block mb-0.5">Why This Stage Matters:</strong>
                {stage.whyItMatters}
              </div>
            </div>
          </div>

          {/* Right Hero Image / Visualization (5 Cols) */}
          <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border/60 bg-slate-950">
            <img
              src={stage.heroImage}
              alt={stage.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
                SIID Technical Intelligence
              </div>
              <div className="text-xs sm:text-sm font-semibold drop-shadow-md">
                Verified Engineering Milestone • Stage 0{stage.step}
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs Navigator for Mobile & Desktop Scannability */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-8 border-b border-border/60 scrollbar-none snap-x snap-mandatory">
          {[
            { id: "overview", label: "Overview & Case Study" },
            { id: "process", label: "Step-by-Step Process" },
            { id: "inputs-outputs", label: "Inputs & Deliverables" },
            { id: "example", label: "Project Calculations" },
            { id: "quality", label: "Quality Checks & Risks" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap snap-start flex-shrink-0 touch-manipulation min-h-[40px] ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Case Study */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Real Project Example Case Study */}
            <Card className="p-6 sm:p-8 border border-border/60 bg-card rounded-2xl shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold text-xs mb-1">
                    Real-World Implementation Case Study
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {stage.example.projectName} ({stage.example.buildingType})
                  </h3>
                </div>
              </div>

              {/* Before vs After Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <div className="text-xs font-bold text-destructive uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Traditional / Unverified Baseline
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {stage.example.beforeState}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SIID Intelligent Outcome
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                    {stage.example.afterState}
                  </p>
                </div>
              </div>

              {/* Key Case Study Highlights */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Key Engineering Milestones Achieved:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stage.example.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-muted/60 border border-border/40 text-xs text-foreground/90 font-medium flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Specs / Calculations */}
              {stage.example.calculationsOrSpecs && (
                <div className="pt-4 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stage.example.calculationsOrSpecs.map((calc, cIdx) => (
                    <div key={cIdx} className="p-3 rounded-lg bg-background border border-border/40">
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase truncate">
                        {calc.label}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-primary truncate mt-0.5">
                        {calc.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Stakeholders & Typical Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 border border-border/60">
                <div className="flex items-center gap-2 mb-3 text-primary font-bold text-sm">
                  <Users className="w-4 h-4" />
                  <span>Key Stakeholders Involved</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stage.stakeholders.map((s, sIdx) => (
                    <Badge key={sIdx} variant="outline" className="text-xs font-medium bg-muted/60">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-5 border border-border/60">
                <div className="flex items-center gap-2 mb-3 text-primary font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Estimated Schedule</span>
                </div>
                <div className="text-sm font-bold text-foreground mb-1">
                  {stage.estimatedTimeline}
                </div>
                <p className="text-xs text-muted-foreground">
                  Standard execution timeline based on automated SIID workflow sequencing and verified contractors.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Step-by-Step Process */}
        {activeTab === "process" && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Detailed Workflow Activities ({stage.activities.length} Steps)
            </div>

            <div className="space-y-3">
              {stage.activities.map((act, index) => (
                <Card
                  key={index}
                  className="p-5 border border-border/60 hover:border-primary/40 transition-all rounded-xl cursor-pointer"
                  onClick={() => setOpenAccordion(openAccordion === `act-${index}` ? null : `act-${index}`)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center flex-shrink-0">
                        {act.stepNum}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">
                        {act.title}
                      </h4>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        openAccordion === `act-${index}` ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {openAccordion === `act-${index}` && (
                    <div className="mt-3 pt-3 border-t border-border/40 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-11">
                      {act.desc}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Tools & Technology Employed */}
            <div className="mt-8 pt-6 border-t border-border/60">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                Tools, Hardware & Engineering Software Employed
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stage.tools.map((tool, tIdx) => (
                  <div key={tIdx} className="p-3.5 rounded-xl bg-card border border-border/60">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-foreground truncate">{tool.name}</span>
                      <Badge variant="outline" className="text-[10px] font-semibold text-primary">
                        {tool.category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Inputs & Deliverables */}
        {activeTab === "inputs-outputs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Required Inputs */}
            <Card className="p-5 sm:p-6 border border-border/60">
              <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base mb-4">
                <Boxes className="w-4 h-4" />
                <span>Required Baseline Inputs</span>
              </div>
              <div className="space-y-3">
                {stage.inputs.map((inp, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/60 border border-border/30">
                    <div className="font-bold text-xs sm:text-sm text-foreground mb-0.5">
                      {inp.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {inp.desc}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Generated Outputs / Deliverables */}
            <Card className="p-5 sm:p-6 border border-border/60">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base mb-4">
                <FileText className="w-4 h-4" />
                <span>Outputs & Verified Deliverables</span>
              </div>
              <div className="space-y-3">
                {stage.outputs.map((out, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/60 border border-border/30">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="font-bold text-xs sm:text-sm text-foreground">
                        {out.title}
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-emerald-600 border-emerald-500/30">
                        {out.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {out.desc}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 4: Project Calculations */}
        {activeTab === "example" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 sm:p-8 border border-border/60">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Project Calculations & Numerical Specifications
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Deterministic mathematical specifications verified for {stage.example.projectName} ({stage.example.buildingType}).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stage.example.calculationsOrSpecs?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <div className="text-xs text-muted-foreground font-semibold mb-1">
                      {item.label}
                    </div>
                    <div className="text-base sm:text-lg font-black text-primary">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-muted/60 border border-border/40 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Engineering Note: </strong>
                All calculations adhere strictly to NBC 2016 (National Building Code of India), IS 456:2000 (Plain and Reinforced Concrete), and local municipal byelaws.
              </div>
            </Card>
          </div>
        )}

        {/* Tab 5: Quality Checks & Risks */}
        {activeTab === "quality" && (
          <div className="space-y-6 animate-fade-in">
            {/* Key Quality Checks */}
            <Card className="p-6 border border-border/60">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-4">
                <ShieldCheck className="w-5 h-5" />
                <span>Mandatory Quality Assurance Checks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stage.keyChecks.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/60 border border-border/40 text-xs sm:text-sm text-foreground/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Common Risks & Mitigations */}
            <Card className="p-6 border border-border/60">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-base mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span>Common Construction Risks & Mitigations</span>
              </div>
              <div className="space-y-3">
                {stage.commonRisks.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">Potential Risk:</div>
                      <div className="text-xs sm:text-sm font-semibold text-foreground">{item.risk}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">SIID Mitigation Strategy:</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{item.mitigation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Bottom Next Stage Hero Progression Card */}
        <div className="mt-12 pt-8 border-t border-border/60">
          {nextStage ? (
            <Card className="p-6 sm:p-8 border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-primary uppercase tracking-wider mb-1">
                    PROCEED TO NEXT STAGE
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground mb-1">
                    Stage 0{nextStage.step} — {nextStage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                    "{nextStage.tagline}"
                  </p>
                </div>

                <Link href={`/construction/${nextStage.id}`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 shadow-md hover:scale-105 transition-all">
                    <span>Explore Stage 0{nextStage.step}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card to-card rounded-2xl shadow-lg text-center">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-2xl font-black text-foreground mb-2">
                You've Completed the 8-Stage Construction Journey!
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
                Ready to turn your architectural vision into reality? Generate your first smart project blueprint in seconds.
              </p>
              <Link href="/projects/create">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-8 shadow-lg hover:scale-105 transition-all">
                  Start Your Smart Project Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      {/* Footer & Floating AI Assistant */}
      <footer className="border-t border-border/50 py-8 bg-card/40 text-center text-xs text-muted-foreground mt-12">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} SIID. AI-Powered Construction & Design Intelligence Platform.</p>
        </div>
      </footer>

      <ConstructionAssistant />
    </div>
  )
}
