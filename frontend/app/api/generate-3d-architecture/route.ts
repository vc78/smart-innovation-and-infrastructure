import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      prompt = "",
      dimensions = { length: 20, width: 15 },
      floors = 2,
      style = "modern",
      orientation = "N",
      roofType = "flat",
    } = body || {}

    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""

    const google = createGoogleGenerativeAI({
      apiKey: googleApiKey,
    })

    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      baseURL: "https://openrouter.ai/api/v1",
    })

    const systemPrompt = `You are the SIID Senior Computational Architect and 3D Spatial Synthesis Engine.
Analyze the user's architectural concept and generate an optimized 3D building configuration matching exact parametric constraints.

Output strictly valid JSON with no markdown fences, matching this structure:
{
  "buildingInputs": {
    "plotDimensions": { "length": 20, "width": 15 },
    "plotOrientation": "N",
    "roadPosition": "single",
    "numberOfFloors": 2,
    "floorHeight": 3.2,
    "hasBasement": false,
    "parkingType": "open",
    "staircaseType": "dogleg",
    "hasLift": false,
    "terraceType": "garden",
    "roomsPerFloor": 4,
    "balconyCount": 2,
    "balconySize": { "width": 2.5, "length": 1.5 },
    "corridorWidth": 1.2,
    "doorSize": { "width": 1.2, "height": 2.2 },
    "windowSize": { "width": 1.8, "height": 1.5 },
    "ceilingHeight": 3.2,
    "roofType": "flat",
    "facadeStyle": "modern",
    "exteriorSymmetry": true,
    "overhangDepth": 0.6,
    "wallMaterial": "concrete",
    "flooringMaterial": ["granite", "wood"],
    "exteriorCladding": "textured paint with timber louvers",
    "glassType": "reflective",
    "colorPalette": ["#1e293b", "#e2e8f0", "#38bdf8"],
    "designStyle": "modern",
    "materials": {
      "wallColor": "#f8fafc",
      "floorColor": "#cbd5e1",
      "roofColor": "#0f172a",
      "doorColor": "#78350f",
      "windowColor": "#38bdf8",
      "wallRoughness": 0.7,
      "wallMetalness": 0.1,
      "glassOpacity": 0.45,
      "glassReflectivity": 0.85
    },
    "cameraMode": "orbit",
    "cameraSpeed": "normal",
    "cameraHeight": 1.8,
    "enableDepthOfField": false,
    "lightingMode": "day",
    "weatherPreset": "sunny",
    "enablePBR": true,
    "textureQuality": "high",
    "enableShadows": true,
    "shadowQuality": "high",
    "enableAO": true,
    "enableReflections": true,
    "enableAdaptiveQuality": true,
    "targetFPS": 60,
    "enableLOD": true,
    "enableTextureStreaming": true,
    "renderQuality": "high"
  },
  "architecturalAppraisal": {
    "title": "Architectural Synthesis Title",
    "conceptSummary": "2 sentence design philosophy and spatial circulation summary.",
    "vastuScore": 92,
    "daylightVentilationScore": 95,
    "structuralFeatures": [
      "Feature 1 (e.g., Deep cantilevered balconies for solar shading)",
      "Feature 2 (e.g., Open terrace garden with waterproofing screed)",
      "Feature 3 (e.g., Cross-ventilation window placement on North-East axis)"
    ],
    "recommendedPalette": "Slate Obsidian, Pure White Lime, Warm Teak Accents"
  }
}`

    const userPrompt = prompt
      ? `Generate 3D architecture for prompt: "${prompt}". Dimensions: ${dimensions.length}m x ${dimensions.width}m, Floors: ${floors}, Orientation: ${orientation}, Style: ${style}`
      : `Generate an optimized 3D architecture with Plot: ${dimensions.length}m x ${dimensions.width}m, Floors: ${floors}, Orientation: ${orientation}, Design Style: ${style}, Roof: ${roofType}`

    let responseText = ""
    try {
      let model;
      if (googleApiKey) {
        model = google("gemini-2.5-flash")
      } else if (process.env.OPENROUTER_API_KEY) {
        model = openrouter("google/gemini-2.0-flash-exp:free")
      } else {
        model = google("gemini-2.5-flash")
      }

      const result = await generateText({
        model: model as any,
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.3,
      })

      responseText = result.text.trim()
    } catch (aiErr: any) {
      console.error("Gemini 3D Architecture Generation Error:", aiErr)
    }

    let parsedData = null
    try {
      const cleaned = responseText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "").trim()
      if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
        parsedData = JSON.parse(cleaned)
      }
    } catch (parseError) {
      console.error("JSON parsing error on 3D AI response, using fallback:", parseError)
    }

    if (!parsedData || !parsedData.buildingInputs) {
      parsedData = {
        buildingInputs: {
          plotDimensions: dimensions,
          plotOrientation: orientation as any,
          roadPosition: "single",
          numberOfFloors: floors,
          floorHeight: 3.2,
          hasBasement: false,
          parkingType: "open",
          staircaseType: "dogleg",
          hasLift: floors > 2,
          terraceType: "garden",
          roomsPerFloor: 4,
          balconyCount: floors > 1 ? 2 : 1,
          balconySize: { width: 2.5, length: 1.5 },
          corridorWidth: 1.2,
          doorSize: { width: 1.2, height: 2.2 },
          windowSize: { width: 1.8, height: 1.5 },
          ceilingHeight: 3.2,
          roofType: roofType as any,
          facadeStyle: style === "classic" ? "classic" : "modern",
          exteriorSymmetry: true,
          overhangDepth: 0.6,
          wallMaterial: "concrete",
          flooringMaterial: ["granite", "wood"],
          exteriorCladding: "textured paint",
          glassType: "reflective",
          colorPalette: ["#1e293b", "#e2e8f0", "#38bdf8"],
          designStyle: style as any,
          materials: {
            wallColor: style === "traditional" ? "#fde047" : "#f8fafc",
            floorColor: "#cbd5e1",
            roofColor: style === "traditional" ? "#7f1d1d" : "#0f172a",
            doorColor: "#78350f",
            windowColor: "#38bdf8",
            wallRoughness: 0.7,
            wallMetalness: 0.1,
            glassOpacity: 0.45,
            glassReflectivity: 0.85,
          },
          cameraMode: "orbit",
          cameraSpeed: "normal",
          cameraHeight: 1.8,
          enableDepthOfField: false,
          lightingMode: "day",
          weatherPreset: "sunny",
          enablePBR: true,
          textureQuality: "high",
          enableShadows: true,
          shadowQuality: "high",
          enableAO: true,
          enableReflections: true,
          enableAdaptiveQuality: true,
          targetFPS: 60,
          enableLOD: true,
          enableTextureStreaming: true,
          renderQuality: "high",
        },
        architecturalAppraisal: {
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} ${floors}-Storey Structural Model`,
          conceptSummary: `Precision 3D building envelope engineered for a ${dimensions.length}m × ${dimensions.width}m plot. Optimizes floor plate circulation, daylight penetration, and structural wind resistance.`,
          vastuScore: orientation === "N" || orientation === "E" ? 96 : 88,
          daylightVentilationScore: 92,
          structuralFeatures: [
            "Cantilevered balconies providing passive solar shading",
            "Continuous RCC column grid aligned for seismic resistance",
            "Optimal cross-ventilation corridor and window configuration",
          ],
          recommendedPalette: "Charcoal Slate, Titanium White, Natural Timber",
        },
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
    })
  } catch (error: any) {
    console.error("Fatal error in generate-3d-architecture API:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate 3D architecture" },
      { status: 500 }
    )
  }
}
