"use client"

import React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Route, Layers } from "lucide-react"

export interface RouteStage {
  step: number
  title: string
  description: string
  image: string
  badgeText: string
}

const ROUTE_STAGES: RouteStage[] = [
  {
    step: 1,
    title: "1. Site Survey & Requirements",
    description: "On-site measurements, soil testing, site constraints, and stakeholder requirements captured.",
    image: "/images/construction-site-survey-equipment.jpg",
    badgeText: "Site Intelligence",
  },
  {
    step: 2,
    title: "2. Concepts & Floor Plans",
    description: "Iterative 2D floor plan layouts with early parametric 3D visualization for design clarity.",
    image: "/images/architectural-floor-plan-blueprint.jpg",
    badgeText: "AI 3D Modeling",
  },
  {
    step: 3,
    title: "3. Approvals & BOQ",
    description: "Municipal regulatory approvals, seismic compliance, and deterministic bill of quantities finalized.",
    image: "/images/building-permit-approval-documents.jpg",
    badgeText: "Cost & Approvals",
  },
  {
    step: 4,
    title: "4. Foundation & Structure",
    description: "Earthwork excavation, reinforced foundation, column framing, and load-bearing structure completion.",
    image: "/images/building-foundation-concrete-construction.jpg",
    badgeText: "Structural Engineering",
  },
  {
    step: 5,
    title: "5. Services Routing",
    description: "Electrical conduits, 3-phase power, plumbing supply lines, and HVAC installation pressure-tested.",
    image: "/images/electrical-plumbing-hvac-installation.jpg",
    badgeText: "MEP Routing",
  },
  {
    step: 6,
    title: "6. Interior Finishes",
    description: "Joinery, painting, acoustic insulation, tiling, sanitary fixtures, and final fit-outs completed.",
    image: "/images/interior-finishing-painting-flooring.jpg",
    badgeText: "Interior Fit-Out",
  },
  {
    step: 7,
    title: "7. QA & Handover",
    description: "Quality compliance checks, structural audit, documentation, and client walkthrough for final handover.",
    image: "/images/building-quality-inspection-handover.jpg",
    badgeText: "Certified Handover",
  },
]

export function ConstructionRouteMap() {
  return (
    <section className="py-16 md:py-24 bg-card/60 border-y border-border/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-3 shadow-sm">
            <Route className="w-3.5 h-3.5 text-primary" />
            End-to-End Workflow Map
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">
            Construction Route Map
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            From initial site survey to final handover—key milestone stages at a glance
          </p>
        </div>

        {/* 7-Stage Visual Route Grid (Image 4 Design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {ROUTE_STAGES.map((stage) => (
            <motion.div
              key={stage.step}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="p-0 overflow-hidden h-full border border-border/60 bg-background/80 backdrop-blur-xl hover:border-primary/50 hover:shadow-2xl transition-all duration-300 flex flex-col group relative">
                {/* Stage Image Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors" />

                  {/* Stage Step Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-primary/90 text-white backdrop-blur-md border border-white/20 font-extrabold text-xs px-3 py-1 shadow-lg">
                      Stage 0{stage.step}
                    </Badge>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-950/80 text-white/90 backdrop-blur-md border border-white/20">
                      {stage.badgeText}
                    </span>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-primary font-semibold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
                      Milestone Verified
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
