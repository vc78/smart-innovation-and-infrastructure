"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react"

interface DesignVariant {
  id: string
  name: string
  provider: string
  image: string
  features: string[]
  estimatedCost: string
  style: string
}

const MOCK_VARIANTS: DesignVariant[] = [
  {
    id: "1",
    name: "Modern Minimalist",
    provider: "Contemporary Studio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    features: ["Open floor plan", "Large glass facade", "Flat RCC roof", "IS 456 M25 Mix"],
    estimatedCost: "₹48.5 Lakhs",
    style: "Contemporary",
  },
  {
    id: "2",
    name: "Traditional Vastu",
    provider: "Vastu Architecture",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    features: ["Sloped tiled roof", "100% Vastu aligned", "Central courtyard", "Brahmasthan open"],
    estimatedCost: "₹52.0 Lakhs",
    style: "Traditional",
  },
  {
    id: "3",
    name: "Eco-Passive Villa",
    provider: "Sustainable Studio",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    features: ["Solar panel ready", "Rainwater harvesting", "Cross ventilation", "Green rooftop"],
    estimatedCost: "₹55.4 Lakhs",
    style: "Sustainable",
  },
  {
    id: "4",
    name: "Luxury Duplex",
    provider: "Architectural Grandeur",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
    features: ["Double height living", "Italian marble floor", "Modular smart island", "Cantilever balcony"],
    estimatedCost: "₹68.0 Lakhs",
    style: "Luxury",
  },
]

export function ComparisonView() {
  const [variants] = useState<DesignVariant[]>(MOCK_VARIANTS)
  const [selected, setSelected] = useState<string[]>([])
  const [viewIndex, setViewIndex] = useState(0)

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const visibleVariants = variants.slice(viewIndex, viewIndex + 2)

  return (
    <Card className="p-4 sm:p-6 border-border overflow-hidden">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold truncate">Design Variant Comparison</h3>
            <p className="text-xs text-muted-foreground hidden sm:block">Compare architectural layouts and cost estimates side-by-side</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => setViewIndex(Math.max(0, viewIndex - 1))}
            disabled={viewIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground font-medium px-1">
            {viewIndex + 1}-{Math.min(viewIndex + 2, variants.length)} of {variants.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => setViewIndex(Math.min(variants.length - 2, viewIndex + 1))}
            disabled={viewIndex >= variants.length - 2}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Side-by-Side 2-Column Responsive Grid on Both Mobile & Desktop */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6">
        {visibleVariants.map((variant) => (
          <div
            key={variant.id}
            className={`relative rounded-xl border-2 overflow-hidden transition-all duration-200 flex flex-col bg-card shadow-sm ${
              selected.includes(variant.id) ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-border hover:border-border/80"
            }`}
          >
            {/* Image Box */}
            <div className="relative aspect-[4/3] sm:h-48 w-full overflow-hidden bg-muted flex-shrink-0">
              <img
                src={variant.image}
                alt={variant.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-2 left-2 max-w-[70%]">
                <Badge variant="secondary" className="text-[9px] sm:text-xs font-semibold px-1.5 py-0.5 backdrop-blur-md bg-background/80 truncate block">
                  {variant.provider}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant={selected.includes(variant.id) ? "default" : "outline"}
                  onClick={() => toggleSelect(variant.id)}
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0 rounded-full shadow-md bg-background/90 hover:bg-primary hover:text-white"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h4 className="font-bold text-xs sm:text-base leading-tight truncate">{variant.name}</h4>
                  <Badge variant="outline" className="text-[9px] sm:text-xs w-fit px-1.5 py-0">
                    {variant.style}
                  </Badge>
                </div>

                <div className="space-y-1 sm:space-y-1.5 mb-3">
                  {variant.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-[10px] sm:text-xs text-muted-foreground">Est. Cost</span>
                <span className="font-bold text-xs sm:text-sm text-primary">{variant.estimatedCost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-4 p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium">
              <span className="font-bold text-primary">{selected.length}</span> design(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelected([])} className="h-8 text-xs">
                Clear
              </Button>
              <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-white gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Synthesize</span> Hybrid
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

