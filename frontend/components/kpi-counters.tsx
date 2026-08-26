"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { KPI_COUNTER_ITEMS } from "@/lib/stats-config"
import { Award, Users, ShieldCheck, ThumbsUp } from "lucide-react"

type Kpi = { label: string; value: number; suffix?: string; prefix?: string }

const ICONS = [Award, Users, ShieldCheck, ThumbsUp]

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    
    // Check if prefers-reduced-motion is active
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
    }
  }, [])

  return { ref, inView }
}

const easeOutExpo = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export default function KpiCounters({
  items = KPI_COUNTER_ITEMS,
}: { items?: Kpi[] }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!inView) return

    let animationFrame: number
    const duration = 1400 // 1400ms duration with easing
    const startTime = performance.now()

    const animateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const timeFraction = Math.min(elapsedTime / duration, 1)
      const easedProgress = easeOutExpo(timeFraction)
      setProgress(easedProgress)

      if (timeFraction < 1) {
        animationFrame = requestAnimationFrame(animateCount)
      } else {
        setProgress(1) // strictly fixed final state
      }
    }

    animationFrame = requestAnimationFrame(animateCount)
    return () => cancelAnimationFrame(animationFrame)
  }, [inView])

  return (
    <div className="relative py-4 md:py-8" ref={ref}>
      {/* Subtle background ambient lights */}
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-[70px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-[70px] -translate-y-1/2 pointer-events-none" />

      {/* 2x2 Compact Grid on Mobile, 4-Col on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto relative z-10">
        {items.map((k, i) => {
          const currentVal = inView ? Math.floor(k.value * progress) : 0
          const Icon = ICONS[i % ICONS.length]

          return (
            <div
              key={i}
              className={cn(
                "relative group flex flex-col items-center justify-center text-center p-3.5 sm:p-5 md:p-6 rounded-xl md:rounded-2xl",
                "bg-card/70 backdrop-blur-md border border-border/60 shadow-sm",
                "transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-accent tabular-nums tracking-tight mb-0.5 sm:mb-1">
                {k.prefix}
                {currentVal}
                {k.suffix}
              </div>

              <div className="text-xs sm:text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">
                {k.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
