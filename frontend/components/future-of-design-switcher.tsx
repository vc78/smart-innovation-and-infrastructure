"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Building2, Users, Sparkles, ArrowRight, CheckCircle2, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface VisionTab {
  id: string
  label: string
  title: string
  icon: any
  description: string
  points: string[]
  link: string
  cta: string
}

const VISION_TABS: VisionTab[] = [
  {
    id: "smart-cities",
    label: "Smart Cities & Scale",
    title: "Beyond Individual Homes to Urban Ecosystems",
    icon: Building2,
    description: "Extending parametric intelligence from standalone residences to multi-family apartments, commercial towers, and interconnected smart city developments.",
    points: [
      "Macro-level zoning and traffic density simulations",
      "Centralized district cooling and stormwater management",
      "Unified IoT municipal infrastructure compatibility",
    ],
    link: "/3d-generator",
    cta: "Explore Urban Intelligence",
  },
  {
    id: "collaboration",
    label: "Transparent Collaboration",
    title: "Zero-Friction Stakeholder Ecosystem",
    icon: Users,
    description: "Direct real-time integration between architects, structural consultants, local material vendors, and vetted general contractors for total transparency.",
    points: [
      "Milestone-linked escrow payments and automated approvals",
      "Live digital markups and revision tracking on BIM models",
      "Transparent contractor bidding on deterministic BOQs",
    ],
    link: "/dashboard/contractors",
    cta: "Connect With Partners",
  },
  {
    id: "information-flow",
    label: "Complete Information Flow",
    title: "Unified Digital Thread from Conception to Keys",
    icon: Sparkles,
    description: "Everything at your fingertips—from initial soil test and parametric floor plans to final municipal Occupancy Certificate and digital BIM twin transfer.",
    points: [
      "Single source of truth eliminating construction rework",
      "Automated compliance with IS codes and local byelaws",
      "Digital asset warranty and maintenance vault",
    ],
    link: "/assistant",
    cta: "Discover SIID Intelligence",
  },
]

export function FutureOfDesignSwitcher() {
  const [activeId, setActiveId] = useState<string>("smart-cities")
  const activeTab = VISION_TABS.find((t) => t.id === activeId) || VISION_TABS[0]
  const Icon = activeTab.icon

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
        {VISION_TABS.map((tab) => {
          const isActive = tab.id === activeId
          const TabIcon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap snap-start flex-shrink-0 touch-manipulation min-h-[40px] ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Active Card */}
      <div className="mt-4 relative min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Card className="p-6 sm:p-8 border border-border/60 bg-card/90 backdrop-blur-xl shadow-lg rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {activeTab.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                {activeTab.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
                {activeTab.points.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/60 border border-border/40 text-xs font-medium text-foreground/90"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border/40 flex justify-end">
                <Link href={activeTab.link} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm py-2 px-5 h-auto min-h-[40px] shadow-sm">
                    <span>{activeTab.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
