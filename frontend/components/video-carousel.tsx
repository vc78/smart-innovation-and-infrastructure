"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface VideoItem {
  id: number
  title: string
  category: string
  description: string
  duration: string
  src: string
  poster: string
  tags: string[]
}

const VIDEO_HIGHLIGHTS: VideoItem[] = [
  {
    id: 1,
    title: "AI Architectural Design & Floor Plan Generation",
    category: "AI Design Automation",
    description: "Watch SIID's intelligent parametric generator automatically transform site dimensions into 2D floor plans & 3D BIM models.",
    duration: "1:45",
    src: "/images/stu.mp4",
    poster: "/images/ai-floor-plan-generation-architectural.jpg",
    tags: ["Parametric Layout", "Auto BIM", "Vastu Compliant"],
  },
  {
    id: 2,
    title: "Structural Steel & Load Engineering Simulation",
    category: "Structural Engineering",
    description: "Real-time stress analysis and 3D wireframe column placement calculating precise concrete & rebar BOQ quantities.",
    duration: "2:10",
    src: "/images/iron.mp4",
    poster: "/images/structural-engineering-simulation-3d.jpg",
    tags: ["Seismic Zone IV", "Load Vectors", "Deterministic BOQ"],
  },
  {
    id: 3,
    title: "Smart Interior Walkthrough & Spatial Lighting",
    category: "3D Interior Architecture",
    description: "Immersive interior spatial rendering with integrated MEP conduit routing and ambient recessed lighting customization.",
    duration: "2:30",
    src: "/images/int1.mp4",
    poster: "/images/interior-design-3d-walkthrough.jpg",
    tags: ["MEP Routing", "Ambient Lighting", "Spatial Ergonomics"],
  },
  {
    id: 4,
    title: "Luxury Villa Exterior Architecture Render",
    category: "Exterior Facade Renders",
    description: "High-performance cantilevered modern villa facade with daylight orientation and solar gain thermal analysis.",
    duration: "3:05",
    src: "/images/ext1.mp4",
    poster: "/images/modern-villa-project.jpg",
    tags: ["Glass Facade", "Solar Heat Gain", "3D Landscape"],
  },
  {
    id: 5,
    title: "Virtual Spatial Walkthrough & Layout Audit",
    category: "Virtual Tour Engine",
    description: "First-person interactive spatial audit allowing architects and clients to validate clearance heights and room proportions.",
    duration: "1:55",
    src: "/images/ve1.mp4",
    poster: "/images/hero_architectural_render.png",
    tags: ["First-Person Tour", "Clearance Check", "Client Review"],
  },
  {
    id: 6,
    title: "High-Performance Parametric Building Showcase",
    category: "Smart Cities & Commercial",
    description: "Multi-story commercial framing, HVAC duct routing, and mechanical system layout generated with intelligent automation.",
    duration: "2:40",
    src: "/images/p1.mp4",
    poster: "/images/hero_architectural_background.png",
    tags: ["Commercial BIM", "HVAC Routing", "Smart City Ready"],
  },
]

export default function VideoCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null)

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  React.useEffect(() => {
    if (!api) return

    setCurrentSlide(api.selectedScrollSnap())

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap()
      setCurrentSlide(newIndex)
      // Pause playing video when sliding to a new item
      if (playingVideoId !== null) {
        const vid = videoRefs.current[playingVideoId]
        if (vid) vid.pause()
        setPlayingVideoId(null)
      }
    })
  }, [api, playingVideoId])

  const handleTogglePlay = (video: VideoItem) => {
    const vid = videoRefs.current[video.id]

    if (playingVideoId === video.id) {
      if (vid) vid.pause()
      setPlayingVideoId(null)
    } else {
      // Pause any other playing video
      if (playingVideoId !== null) {
        const prevVid = videoRefs.current[playingVideoId]
        if (prevVid) prevVid.pause()
      }

      setPlayingVideoId(video.id)
      requestAnimationFrame(() => {
        if (vid) {
          vid.muted = isMuted
          vid.play().catch((err) => {
            console.warn("Video play failed:", err)
            setPlayingVideoId(null)
          })
        }
      })
    }
  }

  const handleToggleMute = (e: React.MouseEvent, videoId: number) => {
    e.stopPropagation()
    const nextMuteState = !isMuted
    setIsMuted(nextMuteState)

    const vid = videoRefs.current[videoId]
    if (vid) {
      vid.muted = nextMuteState
    }
  }

  return (
    <section className="w-full py-6 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-3">
              <Film className="w-3.5 h-3.5" />
              Interactive Video Showcase
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Experience SIID In Action
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-xl">
              Watch real architectural walkthroughs, AI floor plan generation, and structural engineering simulations.
            </p>
          </div>

          {/* Quick Stats / Navigation indicators */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground">
              <span>{currentSlide + 1}</span>
              <span>/</span>
              <span>{VIDEO_HIGHLIGHTS.length}</span>
            </div>
          </div>
        </div>

        {/* Main Carousel Wrapper */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-3 md:-ml-5 items-stretch">
            {VIDEO_HIGHLIGHTS.map((video) => {
              const isPlaying = playingVideoId === video.id

              return (
                <CarouselItem
                  key={video.id}
                  className="pl-3 md:pl-5 basis-full sm:basis-1/2 lg:basis-1/3 max-w-full"
                >
                  <Card className="p-0 overflow-hidden h-full border border-border/60 bg-card/80 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col group">
                    {/* Video Player Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      {/* Video Element */}
                      <video
                        ref={(el) => {
                          videoRefs.current[video.id] = el
                        }}
                        src={video.src}
                        poster={video.poster}
                        playsInline
                        loop
                        preload="metadata"
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          isPlaying ? "opacity-100" : "opacity-90 group-hover:scale-105"
                        }`}
                        onEnded={() => setPlayingVideoId(null)}
                      />

                      {/* Dark Ambient Overlay when not playing */}
                      {!isPlaying && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/40 group-hover:bg-slate-950/40 transition-colors" />
                      )}

                      {/* Top Bar Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <Badge className="bg-slate-950/75 text-white backdrop-blur-md border border-white/20 text-[11px] font-semibold">
                          <Sparkles className="w-3 h-3 mr-1 text-accent inline" />
                          {video.category}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-950/75 text-white/90 border-white/20 text-[11px]">
                          {video.duration}
                        </Badge>
                      </div>

                      {/* Center Play / Pause Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                          onClick={() => handleTogglePlay(video)}
                          className={`inline-flex items-center justify-center rounded-full transition-all duration-300 shadow-2xl ${
                            isPlaying
                              ? "bg-slate-950/70 hover:bg-slate-950 text-white w-12 h-12 opacity-0 group-hover:opacity-100"
                              : "bg-primary/90 hover:bg-primary text-white w-14 h-14 sm:w-16 sm:h-16 hover:scale-110 active:scale-95 shadow-primary/30"
                          }`}
                          aria-label={isPlaying ? "Pause video" : "Play video"}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-7 h-7 fill-current ml-1" />
                          )}
                        </button>
                      </div>

                      {/* Bottom Control Bar on Video (Sound Toggle & Fullscreen) */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                        {isPlaying && (
                          <button
                            onClick={(e) => handleToggleMute(e, video.id)}
                            className="p-2 rounded-full bg-slate-950/80 text-white hover:bg-primary backdrop-blur-md border border-white/20 transition-colors"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? (
                              <VolumeX className="w-4 h-4 text-rose-400" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => setModalVideo(video)}
                          className="p-2 rounded-full bg-slate-950/80 text-white hover:bg-primary backdrop-blur-md border border-white/20 transition-colors"
                          aria-label="Fullscreen video preview"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Content Footer */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                          {video.description}
                        </p>
                      </div>

                      {/* Tag List */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {video.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50 font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          {/* Controls Bar Below Carousel */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots navigation */}
            <div className="flex items-center gap-2">
              {VIDEO_HIGHLIGHTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Previous / Next Arrow Buttons */}
            <div className="flex items-center gap-2">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 border-border bg-card hover:bg-primary hover:text-white transition-all shadow-md" />
              <CarouselNext className="static translate-y-0 h-10 w-10 border-border bg-card hover:bg-primary hover:text-white transition-all shadow-md" />
            </div>
          </div>
        </Carousel>
      </div>

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
                    Duration: {modalVideo.duration}
                  </Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{modalVideo.title}</h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {modalVideo.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {modalVideo.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 text-white border border-white/15"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
