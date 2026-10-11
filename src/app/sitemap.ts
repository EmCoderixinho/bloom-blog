import type { MetadataRoute } from "next"
import { getAuthors, getCategories, getPosts } from "@/lib/data"
import { routes, siteConfig } from "@/lib/site"
import { getStaticPages } from "@/lib/static-pages"

// A single sitemap holds up to 50,000 URLs; split with `generateSitemaps` long before that.
const MAX_POSTS = 5000

const url = (path: string) => new URL(path, siteConfig.url).toString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ items: posts }, categories, authors] = await Promise.all([
    getPosts({ limit: MAX_POSTS }),
    getCategories(),
    getAuthors(),
  ])

  // Posts are newest first, so the first match is each group's latest publish date.
  const latest = (match: (post: (typeof posts)[number]) => boolean) => posts.find(match)?.publishedAt
  const categoryOf = new Map(categories.map((c) => [c.slug, c]))

  return [
    { url: url(routes.home()), lastModified: posts[0]?.publishedAt, changeFrequency: "daily", priority: 1 },
    ...posts.map((post) => ({
      url: url(routes.post(post.slug)),
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: url(routes.category(category.slug)),
      // A parent category also lists its subcategories' posts.
      lastModified: latest((p) => p.category === category.slug || categoryOf.get(p.category)?.parent === category.slug),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...authors.map((author) => ({
      url: url(routes.author(author.slug)),
      lastModified: latest((p) => p.author === author.slug),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...getStaticPages().map((page) => ({
      url: url(`/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ]
}
