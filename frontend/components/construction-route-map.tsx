"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Route, ChevronRight, Layers, Sparkles } from "lucide-react"
import { CONSTRUCTION_STAGES } from "@/data/construction-stages"

export function ConstructionRouteMap() {
  const [activeStep, setActiveStep] = useState<number>(1)
  const activeStage = CONSTRUCTION_STAGES.find((s) => s.step === activeStep) || CONSTRUCTION_STAGES[0]

  return (
    <section className="py-12 md:py-20 bg-card/40 border-y border-border/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-3 shadow-sm">
            <Route className="w-3.5 h-3.5" />
            Interactive Construction Journey
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground tracking-tight mb-2 sm:mb-3">
            End-to-End Construction Workflow
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            Tap any milestone stage to explore dedicated technical inputs, engineering tools, calculations, and deliverables
          </p>
        </div>

        {/* Compact Horizontal Step Timeline Navigator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 mb-6 scrollbar-none snap-x snap-mandatory">
          {CONSTRUCTION_STAGES.map((stage) => {
            const isActive = stage.step === activeStep

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStep(stage.step)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap snap-start flex-shrink-0 touch-manipulation min-h-[42px] ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive ? "bg-white text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stage.step}
                </span>
                <span>{stage.title.split("&")[0].trim()}</span>
              </button>
            )
          })}
        </div>

        {/* Active Stage Interactive Showcase Card (Mobile & Desktop) */}
        <Card className="p-0 overflow-hidden border border-border/60 bg-background/90 backdrop-blur-xl shadow-xl rounded-xl md:rounded-2xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Stage Hero Image with Badges (5 Cols) */}
            <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto bg-slate-950 overflow-hidden">
              <img
                src={activeStage.heroImage}
                alt={activeStage.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Stage Step Pill */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <Badge className="bg-primary text-white font-extrabold text-xs px-2.5 py-1 shadow-md">
                  Stage 0{activeStage.step} of 08
                </Badge>
                <Badge variant="outline" className="bg-slate-950/80 text-white border-white/20 text-[11px] backdrop-blur-md">
                  {activeStage.category}
                </Badge>
              </div>

              {/* Timeline Indicator */}
              <div className="absolute bottom-3 left-3 z-10">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-white/90 border border-white/10">
                  Est. Duration: {activeStage.estimatedTimeline}
                </span>
              </div>
            </div>

            {/* Stage Info & Direct Detailed Page Link (7 Cols) */}
            <div className="lg:col-span-7 p-5 sm:p-7 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-2">
                  {activeStage.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-primary mb-3">
                  "{activeStage.tagline}"
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                  {activeStage.shortSummary}
                </p>

                {/* Key Activities Preview Chips */}
                <div className="space-y-2 mb-6">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                    Core Milestone Activities
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeStage.activities.slice(0, 4).map((act, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/60 text-xs font-medium text-foreground/90 border border-border/30"
                      >
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {act.stepNum}
                        </span>
                        <span className="truncate">{act.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 inline" />
                  <span>Verified Engineering Standards</span>
                </div>

                <Link href={`/construction/${activeStage.id}`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-5 py-2.5 h-auto min-h-[42px] justify-between shadow-md">
                    <span>Explore Stage {activeStage.step} Details</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Compact 8-Stage Quick Grid for Fast Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {CONSTRUCTION_STAGES.map((st) => (
            <Link
              key={st.id}
              href={`/construction/${st.id}`}
              className="p-2.5 sm:p-3 rounded-xl bg-background/60 hover:bg-background border border-border/50 hover:border-primary/50 transition-all text-center group flex flex-col items-center justify-between min-h-[85px]"
            >
              <div className="text-[10px] font-black text-primary uppercase tracking-wider mb-1">
                Stage 0{st.step}
              </div>
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {st.title.split("&")[0].trim()}
              </div>
              <div className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors mt-1 font-semibold flex items-center gap-0.5">
                <span>View</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
