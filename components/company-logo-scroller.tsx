import React from "react"
import { ShieldCheck, CheckCircle2, Lock, Leaf } from "lucide-react"

const TRUST_SIGNALS = [
  { text: "ISO 9001 Compliant Process", icon: CheckCircle2 },
  { text: "Verified Contractor Network", icon: ShieldCheck },
  { text: "Secure Payment Handling", icon: Lock },
  { text: "IGBC-Aware Design Tools", icon: Leaf },
];

export function CompanyLogoScroller() {
  return (
    <section className="logo-scroller-section relative overflow-hidden py-8 md:py-12 border-t border-b border-border/50 select-none w-full bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {TRUST_SIGNALS.map((signal, idx) => (
            <div key={idx} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
              <signal.icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm md:text-base">{signal.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

