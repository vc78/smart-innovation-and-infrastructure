import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Clock, Tag, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import OptimizedImage from "@/components/optimized-image"
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) return { title: "Post Not Found - SIID Blog" }
  return {
    title: `${post.title} | SIID Blog`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <OptimizedImage
              src="/images/siid-flash-logo.png"
              alt="SIID Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-primary-foreground uppercase tracking-wider text-[10px] font-black">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} read
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between py-4 border-y border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-primary/20">
                  {post.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-base md:text-lg space-y-6">
            {post.content.trim().split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-border flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground mr-1" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </article>

        {/* Related Articles */}
        <section className="mt-16 pt-12 border-t border-border space-y-6">
          <h3 className="text-2xl font-black tracking-tight">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((rel) => (
              <Link key={rel.id} href={`/blog/${rel.slug}`}>
                <Card className="p-6 hover:shadow-xl transition-all duration-300 rounded-2xl border-border hover:border-primary/50 group h-full flex flex-col justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-3 text-[9px] uppercase font-bold">
                      {rel.category}
                    </Badge>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>{rel.author}</span>
                    <span>{rel.readingTime} read</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
