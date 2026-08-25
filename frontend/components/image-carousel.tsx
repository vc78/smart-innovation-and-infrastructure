"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles, Maximize2, X, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface CarouselImageItem {
  id: number
  title: string
  subtitle: string
  category: string
  imageSrc: string
  description: string
  specs: string[]
}

const CAROUSEL_IMAGES: CarouselImageItem[] = [
  {
    id: 1,
    title: "Ultra-Modern Architectural Exterior",
    subtitle: "AI-Generated Glass & Parametric Facade Design",
    category: "3D Architectural Exterior",
    imageSrc: "/images/hero_architectural_render.png",
    description: "High-performance cantilevered villa rendering featuring automated daylight analysis, solar gain optimization, and luxury ambient landscape integration.",
    specs: ["Parametric Glass Facade", "Solar Heat Gain Optimized", "Integrated Ambient Lighting"]
  },
  {
    id: 2,
    title: "Smart Interior & Spatial Layout",
    subtitle: "Double-Height Loft with Ambient Lighting",
    category: "Smart Interior Architecture",
    imageSrc: "/images/hero_smart_interior_plan.png",
    description: "Architectural interior spatial organization with automated MEP conduit routing, ambient recessed LED strips, and natural ventilation clearance.",
    specs: ["Double-Height Ceiling", "Integrated MEP Routing", "Acoustic Insulation Rating: A+"]
  },
  {
    id: 3,
    title: "3D Structural Engineering Blueprint",
    subtitle: "Precision CAD Wireframe & Load Analysis",
    category: "Structural Engineering Blueprint",
    imageSrc: "/images/hero_structural_blueprint.png",
    description: "Real-time 3D structural framing model showing load distribution vectors, column placement, and foundation depth calculations.",
    specs: ["Seismic Zone IV Compliant", "Reinforced Concrete Frame", "Auto-Calculated BOQ Ratios"]
  }
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedImage, setSelectedImage] = useState<CarouselImageItem | null>(null)

  useEffect(() => {
    if (isPaused || selectedImage) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused, selectedImage])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
  }

  const current = CAROUSEL_IMAGES[currentIndex]

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Glassmorphic Display Frame */}
      <div 
        className="relative rounded-3xl overflow-hidden border border-white/20 dark:border-border/60 bg-card/40 backdrop-blur-xl shadow-2xl group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Image Aspect Container */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
            >
              <img
                src={current.imageSrc}
                alt={current.title}
                className="w-full h-full object-cover"
              />
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/30" />
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id + "-text"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-full text-xs shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
                      {current.category}
                    </Badge>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {current.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-200/90 max-w-xl font-medium leading-relaxed">
                    {current.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {current.specs.map((spec, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-white/90 border border-white/15">
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Expand / View Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setSelectedImage(current)}
                className="bg-white/20 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/30 rounded-xl transition-all shadow-xl font-bold"
                size="lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Fullscreen
              </Button>
            </div>
          </div>

          {/* Nav Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-slate-950/60 hover:bg-primary text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 z-30"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-slate-950/60 hover:bg-primary text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 z-30"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnail Selector Bar */}
        <div className="bg-slate-950/80 backdrop-blur-md p-4 border-t border-white/10 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-3">
            {CAROUSEL_IMAGES.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative rounded-xl overflow-hidden h-14 w-24 flex-shrink-0 transition-all duration-300 border-2 ${
                  index === currentIndex
                    ? "border-primary scale-105 shadow-lg shadow-primary/20"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={img.imageSrc} alt={img.title} className="w-full h-full object-cover" />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {CAROUSEL_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-primary" : "w-2 bg-slate-600 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/9] w-full">
                <img
                  src={selectedImage.imageSrc}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 space-y-3 bg-slate-900">
                <Badge className="bg-primary text-white font-semibold">{selectedImage.category}</Badge>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedImage.title}</h3>
                <p className="text-slate-300 text-sm md:text-base">{selectedImage.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
