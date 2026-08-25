"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Film,
  CheckCircle2,
  Layers,
  ArrowRight,
  Activity,
  SlidersHorizontal,
  LayoutGrid,
  Tv,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface VideoItem {
  id: number
  title: string
  subtitle: string
  category: string
  description: string
  duration: string
  fps: string
  resolution: string
  src: string
  poster: string
  tags: string[]
  link: string
  actionLabel: string
}

const SHOWCASE_VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "AI Architectural Design & Floor Plan Engine",
    subtitle: "Parametric BIM Layout Generation",
    category: "AI Design Automation",
    description: "SIID's neural design engine analyzes site geometry to generate 2D floor plans, 3D structural models, and room dimension specs in seconds.",
    duration: "1:45",
    fps: "60 FPS",
    resolution: "4K Render",
    src: "/images/stu.mp4",
    poster: "/images/ai-floor-plan-generation-architectural.jpg",
    tags: ["Parametric Layout", "Auto BIM", "Vastu Compliant", "Instant BOQ"],
    link: "/3d-generator",
    actionLabel: "Launch 3D Engine",
  },
  {
    id: 2,
    title: "Structural Steel & Load Vector Simulation",
    category: "Structural Engineering",
    subtitle: "Real-Time Seismic Stress Analysis",
    description: "Interactive load distribution modeling, reinforced column placement, and automated rebar/concrete quantity calculations.",
    duration: "2:10",
    fps: "60 FPS",
    resolution: "3D CAD Vector",
    src: "/images/iron.mp4",
    poster: "/images/structural-engineering-simulation-3d.jpg",
    tags: ["Seismic Zone IV", "Load Vectors", "Deterministic BOQ", "Steel Frame"],
    link: "/projects/create",
    actionLabel: "Create Blueprint",
  },
  {
    id: 3,
    title: "Smart Interior Walkthrough & Lighting Dynamics",
    category: "3D Interior Architecture",
    subtitle: "Double-Height Loft Spatial Ergonomics",
    description: "Immersive 3D interior spatial organization with automated MEP conduit routing, ambient recessed LED strips, and acoustic clearance.",
    duration: "2:30",
    fps: "60 FPS",
    resolution: "HDR Spatial",
    src: "/images/int1.mp4",
    poster: "/images/interior-design-3d-walkthrough.jpg",
    tags: ["MEP Routing", "Ambient Lighting", "Spatial Ergonomics", "Acoustic Rating A+"],
    link: "/3d-generator",
    actionLabel: "Explore Interior 3D",
  },
  {
    id: 4,
    title: "Modern Villa Exterior Architecture Render",
    category: "Exterior Facade Renders",
    subtitle: "Cantilevered Glass & Solar Heat Gain",
    description: "High-performance modern villa facade rendering with daylight orientation analysis, solar gain thermal optimization, and luxury landscaping.",
    duration: "3:05",
    fps: "60 FPS",
    resolution: "Ray-Traced",
    src: "/images/ext1.mp4",
    poster: "/images/modern-villa-project.jpg",
    tags: ["Glass Facade", "Solar Heat Gain", "3D Landscape", "Thermal Audit"],
    link: "/dashboard",
    actionLabel: "View Exterior Model",
  },
  {
    id: 5,
    title: "First-Person Virtual Spatial Walkthrough",
    category: "Virtual Tour Engine",
    subtitle: "Interactive Architectural Audit",
    description: "First-person interactive spatial audit allowing architects, structural engineers, and clients to validate clearance heights and room proportions.",
    duration: "1:55",
    fps: "60 FPS",
    resolution: "Interactive BIM",
    src: "/images/ve1.mp4",
    poster: "/images/hero_architectural_render.png",
    tags: ["First-Person Tour", "Clearance Check", "Client Review", "Real-Time Walk"],
    link: "/3d-generator",
    actionLabel: "Start Virtual Walk",
  },
  {
    id: 6,
    title: "High-Performance Parametric Building Showcase",
    category: "Smart Cities & Commercial",
    subtitle: "Commercial Structural & Mechanical BIM",
    description: "Multi-story commercial framing, HVAC duct routing, three-phase power distribution, and mechanical system layout generated automatically.",
    duration: "2:40",
    fps: "60 FPS",
    resolution: "Smart BIM",
    src: "/images/p1.mp4",
    poster: "/images/hero_architectural_background.png",
    tags: ["Commercial BIM", "HVAC Routing", "Smart City Ready", "MEP Integration"],
    link: "/projects/create",
    actionLabel: "Launch Commercial BIM",
  },
]

export default function VideoCarousel() {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(SHOWCASE_VIDEOS[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00")
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null)
  const [viewMode, setViewMode] = useState<"split" | "grid">("split")

  const mainVideoRef = useRef<HTMLVideoElement | null>(null)

  // Sync active video changes
  useEffect(() => {
    setIsPlaying(true)
    setProgress(0)
    setCurrentTimeStr("0:00")

    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = 0
      mainVideoRef.current.muted = isMuted
      mainVideoRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }, [activeVideo])

  const handleTogglePlay = () => {
    const vid = mainVideoRef.current
    if (!vid) return

    if (isPlaying) {
      vid.pause()
      setIsPlaying(false)
    } else {
      vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  const handleToggleMute = () => {
    const vid = mainVideoRef.current
    const nextState = !isMuted
    setIsMuted(nextState)
    if (vid) {
      vid.muted = nextState
    }
  }

  const handleTimeUpdate = () => {
    const vid = mainVideoRef.current
    if (!vid || !vid.duration) return

    const current = vid.currentTime
    const total = vid.duration
    setProgress((current / total) * 100)

    const mins = Math.floor(current / 60)
    const secs = Math.floor(current % 60)
    setCurrentTimeStr(`${mins}:${secs < 10 ? "0" : ""}${secs}`)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vid = mainVideoRef.current
    if (!vid || !vid.duration) return

    const newTime = (parseFloat(e.target.value) / 100) * vid.duration
    vid.currentTime = newTime
    setProgress(parseFloat(e.target.value))
  }

  return (
    <div className="w-full relative">
      {/* High-End Header Bar with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            Side-by-Side Cinema Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary">
            Immersive Video Showcase
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Experience 3D architectural renders, AI floor plan generation, and structural simulations side-by-side with real-time specs.
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-2xl border border-border/80 shadow-inner flex-shrink-0">
          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "split"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tv className="w-4 h-4" />
            Split Cinema Stage
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Multi-Card Grid
          </button>
        </div>
      </div>

      {/* ================================================================================== */}
      {/* MODE 1: SIDE-BY-SIDE DUAL CINEMA STAGE */}
      {/* ================================================================================== */}
      {viewMode === "split" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: Active Cinema Player (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 dark:border-border/80 bg-slate-950 shadow-2xl group">
              {/* Main Cinema Video Aspect Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <video
                  ref={mainVideoRef}
                  src={activeVideo.src}
                  poster={activeVideo.poster}
                  playsInline
                  loop
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                {/* Ambient Top Telemetry Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-950/80 text-white backdrop-blur-md border border-white/20 px-3 py-1 font-bold text-xs shadow-lg">
                      <Activity className="w-3.5 h-3.5 mr-1 text-emerald-400 inline animate-pulse" />
                      {activeVideo.fps}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-950/80 text-white/90 border-white/20 text-xs font-semibold">
                      {activeVideo.resolution}
                    </Badge>
                  </div>
                  <Badge className="bg-primary/90 text-white font-bold text-xs px-3 py-1 shadow-lg">
                    {activeVideo.category}
                  </Badge>
                </div>

                {/* Big Floating Center Play Overlay when Paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <button
                      onClick={handleTogglePlay}
                      className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all duration-300 group-hover:bg-emerald-500"
                    >
                      <Play className="w-9 h-9 fill-current ml-1" />
                    </button>
                  </div>
                )}

                {/* Bottom Glassmorphic Control Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col gap-2">
                  {/* Seek Bar Scrubber */}
                  <div className="w-full flex items-center gap-3">
                    <span className="text-[11px] font-mono text-white/80 w-8">{currentTimeStr}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="flex-1 h-1.5 bg-white/20 accent-primary rounded-lg cursor-pointer hover:h-2 transition-all"
                    />
                    <span className="text-[11px] font-mono text-white/60 w-8">{activeVideo.duration}</span>
                  </div>

                  {/* Action Control Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleTogglePlay}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={handleToggleMute}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-emerald-400" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => setModalVideo(activeVideo)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/20 font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Fullscreen Cinema
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Video Meta Details Panel */}
            <Card className="p-6 md:p-8 border-border/80 bg-card/90 backdrop-blur-xl shadow-xl space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-primary tracking-widest uppercase">{activeVideo.subtitle}</div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                  {activeVideo.title}
                </h3>
              </div>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {activeVideo.description}
              </p>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {activeVideo.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-semibold"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>

              {/* Quick Launch CTA */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Ready to explore this parametric feature?</span>
                <Link href={activeVideo.link}>
                  <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg group">
                    {activeVideo.actionLabel}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE: Side Video Queue Selector (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Film className="w-4 h-4 text-primary" />
                Architectural Video Queue ({SHOWCASE_VIDEOS.length})
              </span>
              <span className="text-xs text-primary font-semibold">Click to Switch Stage</span>
            </div>

            <div className="space-y-3.5 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
              {SHOWCASE_VIDEOS.map((video) => {
                const isActive = activeVideo.id === video.id

                return (
                  <motion.div
                    key={video.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveVideo(video)}
                    className={`cursor-pointer rounded-2xl overflow-hidden border p-3.5 transition-all duration-300 flex items-center gap-4 ${
                      isActive
                        ? "border-primary bg-primary/10 shadow-xl shadow-primary/10 ring-2 ring-primary/40"
                        : "border-border/60 bg-card/60 hover:bg-card hover:border-primary/40"
                    }`}
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative w-28 h-20 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10">
                      <img src={video.poster} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-transparent transition-colors" />

                      {/* Play State / Now Playing Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold tracking-wider shadow-md animate-pulse">
                            PLAYING
                          </span>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-950/75 text-white flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {video.duration}
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary font-semibold">
                        {video.category}
                      </Badge>
                      <h4 className={`text-sm font-bold line-clamp-1 transition-colors ${isActive ? "text-primary" : "text-foreground"}`}>
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{video.subtitle}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ================================================================================== */
        /* MODE 2: MULTI-CARD GRID SHOWCASE */
        /* ================================================================================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOWCASE_VIDEOS.map((video) => (
            <Card
              key={video.id}
              className="p-0 overflow-hidden border border-border/60 bg-card/80 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={video.poster}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <Badge className="bg-slate-950/80 text-white backdrop-blur-md border border-white/20 text-[11px] font-bold">
                    {video.category}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-950/80 text-white/90 border-white/20 text-[11px]">
                    {video.duration}
                  </Badge>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <button
                    onClick={() => {
                      setActiveVideo(video)
                      setViewMode("split")
                    }}
                    className="w-14 h-14 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                    {video.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {video.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40 font-medium"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox Video Modal Popup */}
      <AnimatePresence>
        {modalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setModalVideo(null)}
          >
            <div
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full bg-black">
                <video
                  src={modalVideo.src}
                  poster={modalVideo.poster}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 md:p-8 space-y-3 bg-slate-900">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-white font-semibold">{modalVideo.category}</Badge>
                  <Badge variant="outline" className="text-white border-white/20">
                    {modalVideo.resolution} • {modalVideo.fps}
                  </Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{modalVideo.title}</h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {modalVideo.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
