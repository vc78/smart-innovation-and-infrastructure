"use client"

import React from "react"
import { ShieldCheck, CheckCircle2, Lock, Leaf, Award } from "lucide-react"

export interface CompanyLogo {
  name: string
  category: string
  logo: string
}

const REAL_COMPANY_LOGOS: CompanyLogo[] = [
  { name: "UltraTech Cement", category: "Building Material", logo: "/images/Ut.jpeg" },
  { name: "ACC Cement", category: "Building Material", logo: "/images/ACC.jpeg" },
  { name: "Ambuja Cement", category: "Building Material", logo: "/images/Ambuja.jpeg" },
  { name: "JSW Steel & Cement", category: "Structural Steel", logo: "/images/Jsw.jpeg" },
  { name: "Dalmia Cement", category: "Building Material", logo: "/images/Dalmia.jpeg" },
  { name: "KCP Cement", category: "Building Material", logo: "/images/Kcp.jpeg" },
  { name: "Shree Cement", category: "Building Material", logo: "/images/Shree.jpeg" },
  { name: "Aditya Birla Group", category: "Industrial Conglomerate", logo: "/images/Aditya.jpeg" },
  { name: "Modern Architects", category: "Design Partner", logo: "/images/contractor-modern-architects-logo.jpg" },
  { name: "BuildPro Contractors", category: "Structural Engineering", logo: "/images/contractor-buildpro-logo.jpg" },
  { name: "Elite Interiors", category: "Interior Architecture", logo: "/images/contractor-elite-interiors-logo.jpg" },
  { name: "FlowMaster MEP", category: "MEP Systems", logo: "/images/contractor-flowmaster-logo.jpg" },
  { name: "GreenScape Design", category: "Landscape Engineering", logo: "/images/contractor-greenscape-logo.jpg" },
  { name: "PowerLine Systems", category: "Electrical Engineering", logo: "/images/contractor-powerline-logo.jpg" },
]

export function CompanyLogoScroller() {
  // Duplicate for seamless infinite marquee loop
  const marqueeLogos = [...REAL_COMPANY_LOGOS, ...REAL_COMPANY_LOGOS]

  return (
    <section className="relative overflow-hidden py-12 md:py-16 border-y border-border/60 bg-muted/40 select-none w-full">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />

      <div className="container mx-auto px-4 mb-8 text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-3 shadow-sm">
          <Award className="w-3.5 h-3.5 text-primary" />
          Industry Partners & Material Standards
        </div>
        <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
          Trusted By Industry Leaders & Verified Brand Partners
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xl mx-auto">
          Integrations with India&apos;s leading building material manufacturers and verified engineering contractors.
        </p>
      </div>

      {/* Infinite Scrolling Logo Marquee Container */}
      <div className="flex overflow-hidden relative z-0 group">
        <div className="flex items-center gap-8 md:gap-14 animate-marquee whitespace-nowrap py-2 group-hover:[animation-play-state:paused]">
          {marqueeLogos.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-md hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex-shrink-0 group/card cursor-pointer"
            >
              {/* Logo Frame */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center border border-slate-200 shadow-sm flex-shrink-0 group-hover/card:scale-105 transition-transform">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="w-full h-full object-contain filter group-hover/card:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Brand Label */}
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm md:text-base text-foreground group-hover/card:text-primary transition-colors">
                  {item.name}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-border/40">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-muted-foreground font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>ISO 9001 Compliant Process</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-muted-foreground font-semibold">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Verified Contractor Network</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-muted-foreground font-semibold">
            <Lock className="w-4 h-4 text-accent" />
            <span>Secure BOQ Escrow Protocols</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-muted-foreground font-semibold">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>IGBC Green Building Certified</span>
          </div>
        </div>
      </div>
    </section>
  )
}
