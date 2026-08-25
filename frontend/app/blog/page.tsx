"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import OptimizedImage from "@/components/optimized-image"
import BlogListClient from "@/components/blog-list-client"
import { BLOG_POSTS } from "@/lib/blog-data"

export default function BlogPage() {
  const posts = BLOG_POSTS
  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const otherPosts = posts.filter((p) => p.id !== featuredPost.id)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <OptimizedImage
              src="/images/siid-flash-logo.png"
              alt="SIID Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 text-primary bg-primary/5 uppercase tracking-widest text-[10px] font-black">
               The SIID Intelligence Journal
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Future of Living</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Where construction meets intelligence. Exploring the boundary between architectural art and smart engineering.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-20">
             <Link href={`/blog/${featuredPost.slug}`}>
               <Card className="overflow-hidden border-none shadow-2xl group cursor-pointer bg-slate-900 text-white rounded-[2.5rem] hover:scale-[1.01] transition-transform duration-500">
                  <div className="grid lg:grid-cols-2">
                     <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                        <img 
                          src={featuredPost.image} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                     </div>
                     <div className="p-10 lg:p-16 flex flex-col justify-center space-y-6">
                        <Badge className="w-fit bg-primary text-primary-foreground font-black px-4 py-1 rounded-full uppercase tracking-wider text-[10px]">
                           {featuredPost.category}
                        </Badge>
                        <h2 className="text-4xl lg:text-5xl font-black leading-tight group-hover:text-primary transition-colors">
                           {featuredPost.title}
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                           {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase border border-white/20 flex-shrink-0">
                                  {featuredPost.author.split(' ').map(n => n[0]).join('')}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-bold">{featuredPost.author}</span>
                                  <span className="text-xs text-slate-400">{featuredPost.authorRole}</span>
                               </div>
                           </div>
                           <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Calendar className="w-4 h-4" />
                              {featuredPost.date}
                           </div>
                        </div>
                     </div>
                  </div>
               </Card>
             </Link>
          </div>

          <BlogListClient posts={otherPosts} />

          {/* Newsletter Section */}
          <div className="mt-32 p-16 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden shadow-3xl text-center">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
             <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-black tracking-tight">Stay Ahead of the Curve</h3>
                <p className="text-lg opacity-80 leading-relaxed">
                   Join 5,000+ architects and builders receiving our weekly construction intelligence digest.
                </p>
                <form 
                   onSubmit={(e) => e.preventDefault()}
                   className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                >
                   <input 
                      type="email" 
                      name="EMAIL"
                      placeholder="Enter your email" 
                      required
                      className="flex-1 h-14 rounded-2xl px-6 bg-white/10 border border-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-white" 
                   />
                   <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl bg-white text-primary hover:bg-slate-100 font-black">
                      Subscribe Now
                   </Button>
                </form>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
