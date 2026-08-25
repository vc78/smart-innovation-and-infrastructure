import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

// Robust API for storing uploaded site photos & documents in /public/uploads
export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const files = form.getAll("files") as File[]
    if (!files || files.length === 0) {
      return NextResponse.json({ saved: [] })
    }

    const folder = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(folder)) {
      await fs.promises.mkdir(folder, { recursive: true })
    }

    const saved: { url: string; filename: string; originalName: string; size: number }[] = []

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Sanitize filename to avoid path traversal and malformed URL characters
      const originalName = file.name || "site_photo.jpg"
      const ext = path.extname(originalName) || ".jpg"
      const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_")
      const safeFilename = `${Date.now()}_${baseName}${ext}`

      const filePath = path.join(folder, safeFilename)
      await fs.promises.writeFile(filePath, buffer)

      saved.push({
        url: `/uploads/${safeFilename}`,
        filename: safeFilename,
        originalName: originalName,
        size: file.size,
      })
    }

    return NextResponse.json({
      success: true,
      saved,
    })
  } catch (err: any) {
    console.error("/api/uploads/photos error:", err)
    return NextResponse.json(
      {
        success: false,
        saved: [],
        error: err.message || "Failed to save uploaded photos",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const folder = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(folder)) {
      return NextResponse.json({ files: [] })
    }
    const rawFiles = await fs.promises.readdir(folder).catch(() => [])
    const files = rawFiles.map((f) => ({
      filename: f,
      url: `/uploads/${f}`,
    }))
    return NextResponse.json({ files })
  } catch (err: any) {
    console.error("/api/uploads/photos GET error:", err)
    return NextResponse.json({ files: [] }, { status: 500 })
  }
}
