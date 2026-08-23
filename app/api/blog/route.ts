import { NextResponse } from "next/server"
import { BLOG_POSTS } from "@/lib/blog-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const query = searchParams.get("q")

    let posts = [...BLOG_POSTS]

    if (category && category !== "All") {
      posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    if (query) {
      const q = query.toLowerCase()
      posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    }

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
