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
  ArrowRight,
  Film,
  Layers,
  Activity,
  CheckCircle2,
  Tv,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface VideoShowcaseItem {
  id: number
  title: string
  subtitle: string
  category: "Architecture" | "Structural" | "Interior" | "Exterior" | "Virtual Tour"
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

const CINEMA_VIDEOS: VideoShowcaseItem[] = [
  {
    id: 1,
    title: "Parametric AI Architectural & BIM Generator",
    subtitle: "Automated Floor Plans & Dimension Calculation",
    category: "Architecture",
    description: "SIID neural engine synthesizes 2D floor plans, 3D structural models, and room dimension specs in real time with automated municipal setback compliance.",
    duration: "1:45",
    fps: "60 FPS",
    resolution: "4K BIM",
    src: "/images/stu.mp4",
    poster: "/images/ai-floor-plan-generation-architectural.jpg",
    tags: ["Parametric Layout", "Auto BIM", "Vastu Compliant", "Instant BOQ"],
    link: "/3d-generator",
    actionLabel: "Launch 3D Engine",
  },
  {
    id: 2,
    title: "Structural Steel & Load Vector Simulation",
    subtitle: "Real-Time Seismic Stress & FEA Analysis",
    category: "Structural",
    description: "Interactive load distribution modeling, reinforced column placement, and automated rebar and concrete volume calculations for Seismic Zone IV.",
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
    subtitle: "Double-Height Loft Spatial Ergonomics",
    category: "Interior",
    description: "Immersive 3D interior spatial organization with automated MEP conduit routing, ambient recessed LED strips, and acoustic clearance verification.",
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
    subtitle: "Cantilevered Glass & Solar Heat Gain Optimization",
    category: "Exterior",
    description: "High-performance modern villa facade rendering with daylight orientation analysis, solar gain thermal optimization, and luxury landscaping.",
    duration: "3:05",
    fps: "60 FPS",
    resolution: "Ray-Traced",
    src: "/images/ext1.mp4",
    poster: "/images/modern-villa-exterior-facade-rendering.jpg",
    tags: ["Thermal Modeling", "Solar Gain < 0.25", "Facade Lighting", "Granite Cladding"],
    link: "/3d-generator",
    actionLabel: "View Exterior Model",
  },
  {
    id: 5,
    title: "First-Person Interactive Virtual Walkthrough",
    subtitle: "Real-Time Spatial Navigation & Clearance Check",
    category: "Virtual Tour",
    description: "Experience your future residence from the inside out with photorealistic textures, customizable lighting temperatures, and furniture scale inspection.",
    duration: "1:55",
    fps: "60 FPS",
    resolution: "Immersive WebGL",
    src: "/images/p1.mp4",
    poster: "/images/interactive-3d-virtual-walkthrough-tour.jpg",
    tags: ["Real-Time Walkthrough", "Furniture Clearance", "60 FPS WebGL", "Zero Lag"],
    link: "/3d-generator",
    actionLabel: "Start Virtual Tour",
  },
]

const CATEGORIES = ["Architecture", "Structural", "Interior", "Exterior", "Virtual Tour"] as const

export default function VideoCarousel() {
  const [activeVideoId, setActiveVideoId] = useState<number>(1)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false)
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const thumbnailScrollRef = useRef<HTMLDivElement | null>(null)

  const activeVideo = CINEMA_VIDEOS.find((v) => v.id === activeVideoId) || CINEMA_VIDEOS[0]

  // Reset video state when switching active video
  useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    setHasStartedPlaying(false)

    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.pause()
    }
  }, [activeVideoId])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      setIsVideoLoading(true)
      setHasStartedPlaying(true)
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsVideoLoading(false)
        })
        .catch((err) => {
          console.warn("Video playback error:", err)
          setIsPlaying(false)
          setIsVideoLoading(false)
        })
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const newMuted = !isMuted
    videoRef.current.muted = newMuted
    setIsMuted(newMuted)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    const total = videoRef.current.duration || 1
    setCurrentTime(current)
    setDuration(total)
    setProgress((current / total) * 100)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = percent * (videoRef.current.duration || 0)
    videoRef.current.currentTime = seekTime
    setProgress(percent * 100)
  }

  const handleFullscreen = () => {
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  const selectNextVideo = () => {
    const currentIndex = CINEMA_VIDEOS.findIndex((v) => v.id === activeVideoId)
    const nextIndex = (currentIndex + 1) % CINEMA_VIDEOS.length
    setActiveVideoId(CINEMA_VIDEOS[nextIndex].id)
  }

  const selectPrevVideo = () => {
    const currentIndex = CINEMA_VIDEOS.findIndex((v) => v.id === activeVideoId)
    const prevIndex = (currentIndex - 1 + CINEMA_VIDEOS.length) % CINEMA_VIDEOS.length
    setActiveVideoId(CINEMA_VIDEOS[prevIndex].id)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Section Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-2">
            <Tv className="w-3.5 h-3.5" />
            SIID Cinema Engine
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Immersive Video Showcase
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Experience 3D architectural renders, structural FEA stress simulations, and MEP routing
          </p>
        </div>

        {/* Previous / Next Arrow Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            size="icon"
            variant="outline"
            onClick={selectPrevVideo}
            className="h-9 w-9 rounded-full border-border/60 hover:bg-muted"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={selectNextVideo}
            className="h-9 w-9 rounded-full border-border/60 hover:bg-muted"
            aria-label="Next video"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Category / Stage Selector Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const matchingVideo = CINEMA_VIDEOS.find((v) => v.category === cat)
          const isSelected = activeVideo.category === cat

          return (
            <button
              key={cat}
              onClick={() => matchingVideo && setActiveVideoId(matchingVideo.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap min-h-[36px] flex items-center gap-1.5 touch-manipulation ${
                isSelected
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              <span>{cat}</span>
            </button>
          )
        })}
      </div>

      {/* Main Cinema Player Card */}
      <Card className="p-0 overflow-hidden border border-border/60 bg-slate-950 text-white rounded-xl md:rounded-2xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Video Player Box (7 Cols on Desktop) */}
          <div className="lg:col-span-7 relative aspect-[16/9] sm:aspect-[16/9] bg-black flex items-center justify-center overflow-hidden group">
            {/* Lazy Loaded HTML5 Video Element */}
            <video
              ref={videoRef}
              key={activeVideo.src}
              src={hasStartedPlaying ? activeVideo.src : undefined}
              poster={activeVideo.poster}
              preload="none"
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Poster Play Overlay if not playing */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/20 backdrop-blur-[1px] transition-all flex items-center justify-center cursor-pointer z-20"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-white" />
                </div>
              </div>
            )}

            {/* Top Specs Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                  {activeVideo.fps}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-blue-400 border border-blue-500/30">
                  {activeVideo.resolution}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white/90 border border-white/20">
                {activeVideo.category}
              </span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 flex flex-col gap-2">
              {/* Seek Bar */}
              <div
                onClick={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden relative hover:h-2 transition-all"
              >
                <div
                  className="h-full bg-primary rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-xs text-white/90">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] font-mono text-white/70">
                    {formatTime(currentTime)} / {formatTime(duration || 0) || activeVideo.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFullscreen}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Metadata & CTA Box (5 Cols on Desktop) */}
          <div className="lg:col-span-5 p-5 sm:p-6 md:p-7 flex flex-col justify-between bg-card text-foreground border-t lg:border-t-0 lg:border-l border-border/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30 bg-primary/5">
                  {activeVideo.subtitle}
                </Badge>
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 leading-snug">
                {activeVideo.title}
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                {activeVideo.description}
              </p>

              {/* Tags Grid */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {activeVideo.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40"
                  >
                    <CheckCircle2 className="w-3 h-3 text-primary inline" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-3 border-t border-border/40">
              <Link href={activeVideo.link} className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm py-2.5 h-auto min-h-[42px] justify-between shadow-sm">
                  <span>{activeVideo.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Horizontal Thumbnail Carousel Below Player */}
      <div
        ref={thumbnailScrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory"
      >
        {CINEMA_VIDEOS.map((video) => {
          const isSelected = video.id === activeVideoId

          return (
            <div
              key={video.id}
              onClick={() => setActiveVideoId(video.id)}
              className={`flex-shrink-0 w-[180px] sm:w-[210px] cursor-pointer snap-start rounded-xl overflow-hidden border transition-all duration-200 touch-manipulation group ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30 shadow-md scale-[1.02]"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              {/* Thumbnail Image Container */}
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                <img
                  src={video.poster}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />

                {/* Duration Badge */}
                <div className="absolute bottom-1.5 right-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-white">
                    {video.duration}
                  </span>
                </div>

                {/* Active Indicator Pill */}
                {isSelected && (
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary text-white shadow-sm">
                      Playing
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Title */}
              <div className="p-2.5 bg-card">
                <div className="text-[10px] font-bold text-primary truncate mb-0.5">
                  {video.category}
                </div>
                <div className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {video.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
