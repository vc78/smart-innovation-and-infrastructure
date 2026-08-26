"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Cog,
  TrendingUp,
  Building2,
  Compass,
  Wrench,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  SlidersHorizontal,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DesignFeature {
  id: string
  shortLabel: string
  title: string
  badge: string
  icon: any
  colorClass: {
    bg: string
    text: string
    border: string
    glow: string
    gradient: string
  }
  description: string
  highlights: string[]
  specs: { label: string; value: string }[]
  link: string
  actionLabel: string
}

const FEATURES: DesignFeature[] = [
  {
    id: "mep",
    shortLabel: "MEP Systems",
    title: "Smart MEP Systems & Conduit Routing",
    badge: "Automated Routing",
    icon: Cog,
    colorClass: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      glow: "rgba(59,130,246,0.15)",
      gradient: "from-blue-500/10 via-card to-card",
    },
    description: "Automated mechanical, electrical, and plumbing layout generation with intelligent 3D collision routing and standard regulatory compliance checks.",
    highlights: [
      "Zero clash with structural beams and load-bearing columns",
      "Calculated 3-phase load balancing & FR-LSH wire sizing",
      "1:40 gravity slope verification for sanitary gray/black water lines",
    ],
    specs: [
      { label: "Clash Avoidance", value: "100% Automated" },
      { label: "Wire Sizing", value: "IS 732 Compliant" },
      { label: "Plumbing Standard", value: "Uniform Plumbing Code (UPC)" },
    ],
    link: "/3d-generator",
    actionLabel: "Launch MEP Engine",
  },
  {
    id: "cost",
    shortLabel: "Cost Estimation",
    title: "Real-Time Cost & Deterministic BOQ",
    badge: "Market-Driven",
    icon: TrendingUp,
    colorClass: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      glow: "rgba(16,185,129,0.15)",
      gradient: "from-emerald-500/10 via-card to-card",
    },
    description: "Dynamic material pricing linked to city-level indices. Generates itemized bill of quantities with contractor labor rates and budget optimization recommendations.",
    highlights: [
      "Exact counts for cement bags, steel tonnage, and sand CFT",
      "Live price feeds from regional manufacturers & distributors",
      "Stage-wise cash flow forecasting linked to civil progress",
    ],
    specs: [
      { label: "Price Accuracy", value: "±2.5% of Local Market" },
      { label: "Line Items", value: "140+ Material Categories" },
      { label: "Export Format", value: "PDF & Excel Sheets" },
    ],
    link: "/dashboard/new-project",
    actionLabel: "Calculate Estimates",
  },
  {
    id: "3d",
    shortLabel: "3D Engine",
    title: "Immersive 3D Engine & Spatial Models",
    badge: "WebGL Ray-Traced",
    icon: Building2,
    colorClass: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/30",
      glow: "rgba(6,182,212,0.15)",
      gradient: "from-cyan-500/10 via-card to-card",
    },
    description: "Interactive real-time 3D walkthroughs with parametric structural adjustments, material swapping, solar azimuth lighting, and spatial clearance inspection.",
    highlights: [
      "Instant 2D blueprint to 3D volumetric extrusion",
      "Real-time daylight & solar heat gain simulation",
      "Realistic material textures for granite, wood, glass & steel",
    ],
    specs: [
      { label: "Render Engine", value: "WebGL 60 FPS" },
      { label: "BIM Level", value: "LOD 200 / 300" },
      { label: "Device Support", value: "Mobile, Tablet, Desktop" },
    ],
    link: "/3d-generator",
    actionLabel: "Launch 3D Generator",
  },
  {
    id: "vastu",
    shortLabel: "Vastu Audit",
    title: "Vastu Layout Audit & Scoring Matrix",
    badge: "Spatial Compliance",
    icon: Compass,
    colorClass: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
      glow: "rgba(245,158,11,0.15)",
      gradient: "from-amber-500/10 via-card to-card",
    },
    description: "Automated analysis of room orientations, main entrance positioning, and elemental alignments against ancient 16-zone Vastu engineering rules.",
    highlights: [
      "Cardinal orientation mapping via GPS site coordinates",
      "Automated suggestions to resolve directional conflicts",
      "Instant Vastu compliance score with zone breakdown",
    ],
    specs: [
      { label: "Zone Analysis", value: "16 Cardinal Zones" },
      { label: "Score Benchmark", value: "90+ Guaranteed" },
      { label: "Report Type", value: "Full Audit Scorecard" },
    ],
    link: "/dashboard/projects/1/designs",
    actionLabel: "Check Vastu Score",
  },
  {
    id: "contractors",
    shortLabel: "Contractors",
    title: "Verified Contractor Marketplace",
    badge: "Certified Pros",
    icon: Wrench,
    colorClass: {
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/30",
      glow: "rgba(244,63,94,0.15)",
      gradient: "from-rose-500/10 via-card to-card",
    },
    description: "Connect directly with verified structural contractors, MEP specialists, and civil engineers with ratings, hourly rates, and past project portfolios.",
    highlights: [
      "Background-checked civil and MEP contractors",
      "Direct quote comparison on standardized BOQs",
      "Milestone-linked escrow payment security",
    ],
    specs: [
      { label: "Active Pros", value: "32+ Verified" },
      { label: "Coverage", value: "Hyderabad, Vijayawada, Warangal" },
      { label: "Rating Avg", value: "4.9 / 5.0 Stars" },
    ],
    link: "/dashboard/contractors",
    actionLabel: "Find Contractors",
  },
  {
    id: "ai",
    shortLabel: "AI Assistant",
    title: "24/7 AI Construction Assistant",
    badge: "Smart Intelligence",
    icon: MessageSquare,
    colorClass: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/30",
      glow: "rgba(99,102,241,0.15)",
      gradient: "from-indigo-500/10 via-card to-card",
    },
    description: "Instant answers on municipal building codes, concrete mix ratios, timeline risk mitigation, and structural engineering calculations.",
    highlights: [
      "Trained on Indian Standards (IS Codes) and municipal byelaws",
      "Image inspection for site progress and defect detection",
      "Instant material conversion (CFT, Sq.m, Tonnage)",
    ],
    specs: [
      { label: "Response Time", value: "< 1.5 Seconds" },
      { label: "Knowledge Base", value: "IS Codes & Byelaws" },
      { label: "Availability", value: "24/7 Real-Time" },
    ],
    link: "/assistant",
    actionLabel: "Ask AI Assistant",
  },
]

export function SmartDesignSwitcher() {
  const [activeId, setActiveId] = useState<string>("mep")
  const activeFeature = FEATURES.find((f) => f.id === activeId) || FEATURES[0]
  const Icon = activeFeature.icon

  return (
    <div className="w-full">
      {/* Interactive Chip Selector Tabs - Horizontal Scroll on Mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory">
        {FEATURES.map((feature) => {
          const isActive = feature.id === activeId
          const FeatIcon = feature.icon

          return (
            <button
              key={feature.id}
              onClick={() => setActiveId(feature.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap snap-start flex-shrink-0 touch-manipulation min-h-[40px] ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              }`}
              aria-pressed={isActive}
              aria-label={`Select ${feature.shortLabel}`}
            >
              <FeatIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-white" : feature.colorClass.text}`} />
              <span>{feature.shortLabel}</span>
            </button>
          )
        })}
      </div>

      {/* Active Feature Display Card with Smooth Motion Transition */}
      <div className="mt-3 relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Card
              className={`p-5 sm:p-7 md:p-8 border ${activeFeature.colorClass.border} bg-gradient-to-b ${activeFeature.colorClass.gradient} backdrop-blur-xl relative overflow-hidden shadow-lg`}
              style={{
                boxShadow: `0 8px 32px ${activeFeature.colorClass.glow}`,
              }}
            >
              {/* Subtle background decorative orb */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${activeFeature.colorClass.bg} ${activeFeature.colorClass.text} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-bold ${activeFeature.colorClass.bg} ${activeFeature.colorClass.text} ${activeFeature.colorClass.border} mb-1`}
                      >
                        {activeFeature.badge}
                      </Badge>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                        {activeFeature.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 max-w-3xl">
                  {activeFeature.description}
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-6">
                  {activeFeature.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-background/60 border border-border/40 text-xs sm:text-sm text-foreground/90 font-medium"
                    >
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activeFeature.colorClass.text}`} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Technical Specs & Action Row */}
                <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Compact Technical Specs */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-6 text-left">
                    {activeFeature.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="min-w-0">
                        <div className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">
                          {spec.label}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-foreground truncate">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Explore Action Button */}
                  <Link href={activeFeature.link} className="w-full sm:w-auto">
                    <Button
                      size="default"
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-5 py-2.5 h-auto min-h-[42px] shadow-md hover:shadow-lg transition-all group"
                    >
                      {activeFeature.actionLabel}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
