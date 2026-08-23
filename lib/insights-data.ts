import { BLOG_POSTS } from "./blog-data"

export const INSIGHTS = BLOG_POSTS.map((post) => ({
  title: post.title,
  snippet: post.excerpt,
  link: `/blog/${post.slug}`,
  category: post.category,
  tags: post.tags,
}))
