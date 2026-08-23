"use client"

import { useEffect, useRef, useState } from "react"
import { ThreeDModelGenerator, type BuildingInputs } from "@/lib/3d-model-generator"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Play, Pause, RotateCw, Gauge } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ThreeDModelViewerProps {
  inputs: BuildingInputs
  autoPlay?: boolean
  showControls?: boolean
}

export function ThreeDModelViewer({ inputs, autoPlay = true, showControls = true }: ThreeDModelViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const generatorRef = useRef<ThreeDModelGenerator | null>(null)
  const stopAnimationRef = useRef<(() => void) | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoading, setIsLoading] = useState(true)
  const [fps, setFps] = useState(60)

  useEffect(() => {
    if (!canvasRef.current) return

    setIsLoading(true)

    // Initialize generator
    const generator = new ThreeDModelGenerator(inputs, canvasRef.current)
    generatorRef.current = generator

    // Generate building
    generator.generateBuilding()
    generator.render()

    setIsLoading(false)

    // Start animation if autoPlay
    if (autoPlay) {
      stopAnimationRef.current = generator.animateCamera(() => {
        // Update FPS counter
        if (inputs.enableAdaptiveQuality) {
          setFps(generator.getCurrentFPS())
        }
      })
    }

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current) {
        const width = canvasRef.current.clientWidth
        const height = canvasRef.current.clientHeight
        generator.handleResize(width, height)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      stopAnimationRef.current?.()
      generator.dispose()
    }
  }, [inputs, autoPlay])

  const toggleAnimation = () => {
    if (!generatorRef.current) return

    if (isPlaying) {
      stopAnimationRef.current?.()
      stopAnimationRef.current = null
    } else {
      stopAnimationRef.current = generatorRef.current.animateCamera(() => {
        if (inputs.enableAdaptiveQuality) {
          setFps(generatorRef.current!.getCurrentFPS())
        }
      })
    }

    setIsPlaying(!isPlaying)
  }

  const resetCamera = () => {
    if (!generatorRef.current) return
    stopAnimationRef.current?.()
    generatorRef.current.generateBuilding()
    generatorRef.current.render()
    setIsPlaying(false)
  }

  // F. EXPORT & OUTPUT SYSTEM - Download model as GLTF
  const downloadGLTF = async () => {
    if (!generatorRef.current) return

    try {
      const blob = await generatorRef.current.exportGLTF()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `building-model-${Date.now()}.gltf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Failed to export GLTF:", error)
    }
  }

  // F. Feature: Download model as OBJ
  const downloadOBJ = () => {
    if (!generatorRef.current) return

    try {
      const objContent = generatorRef.current.exportOBJ()
      const blob = new Blob([objContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `building-model-${Date.now()}.obj`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Failed to export OBJ:", error)
    }
  }

  // F. Feature: Download building data as JSON
  const downloadJSON = () => {
    if (!generatorRef.current) return

    try {
      const data = generatorRef.current.exportBuildingData()
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `building-data-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Failed to export JSON:", error)
    }
  }

  const [exportFormat, setExportFormat] = useState("gltf")

  const handleExport = () => {
    if (exportFormat === "gltf") {
      downloadGLTF()
    } else if (exportFormat === "obj") {
      downloadOBJ()
    } else if (exportFormat === "json") {
      downloadJSON()
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[360px] sm:h-[480px] md:h-[600px] bg-gradient-to-b from-sky-200 to-sky-50" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Generating 3D model with 120+ features...</p>
          </div>
        </div>
      )}

      {showControls && !isLoading && (
        <>
          {/* FPS Counter */}
          {inputs.enableAdaptiveQuality && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="font-medium">{fps} FPS</span>
            </div>
          )}

          {/* Control Panel */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 shadow-lg max-w-[95%]">
            <Button size="sm" variant="outline" onClick={toggleAnimation} className="gap-1.5 bg-transparent h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
              {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            <Button size="sm" variant="outline" onClick={resetCamera} className="gap-1.5 bg-transparent h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <div className="w-px h-5 sm:h-6 bg-border mx-0.5" />
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="h-8 sm:h-9 w-[90px] sm:w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gltf">GLTF</SelectItem>
                <SelectItem value="obj">OBJ</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5 bg-transparent h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>

          {/* Info Panel */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 shadow-lg space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs">
            <p className="font-semibold">Building Stats:</p>
            <p>Floors: {inputs.numberOfFloors}</p>
            <p>Height: {(inputs.numberOfFloors * inputs.floorHeight).toFixed(1)}m</p>
            <p>
              Plot: {inputs.plotDimensions.length}m × {inputs.plotDimensions.width}m
            </p>
          </div>
        </>
      )}
    </Card>
  )
}
