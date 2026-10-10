import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import type { Author, Category, Page, Post, PostQuery, PostView } from "@/lib/types"
import { getRepository } from "./repository"

/**
 * Cached read API for pages. Every function is tagged so the admin can
 * invalidate with `revalidateTag("posts")` / `revalidateTag("taxonomy")`.
 */

export async function getCategories(): Promise<Category[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("taxonomy")
  return getRepository().listCategories()
}

export async function getTopCategories(): Promise<Category[]> {
  return (await getCategories()).filter((category) => !category.parent)
}

export async function getCategory(slug: string) {
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return null
  return {
    category,
    parent: categories.find((c) => c.slug === category.parent) ?? null,
    children: categories.filter((c) => c.parent === slug),
  }
}

export async function getAuthors(): Promise<Author[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("taxonomy")
  return getRepository().listAuthors()
}

export async function getAuthor(slug: string) {
  return (await getAuthors()).find((author) => author.slug === slug) ?? null
}

async function hydrate(posts: Post[]): Promise<PostView[]> {
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()])
  return posts.flatMap((post) => {
    const categoryRef = categories.find((c) => c.slug === post.category)
    const authorRef = authors.find((a) => a.slug === post.author)
    // Skip posts whose category or author was deleted instead of crashing the page.
    return categoryRef && authorRef ? [{ ...post, categoryRef, authorRef }] : []
  })
}

export async function getPosts(query: PostQuery = {}): Promise<Page<PostView>> {
  "use cache"
  cacheLife("hours")
  cacheTag("posts")
  const { category, ...rest } = query
  let categories: string[] | undefined
  if (category) {
    const found = await getCategory(category)
    categories = found ? [found.category.slug, ...found.children.map((c) => c.slug)] : []
  }
  const page = await getRepository().listPosts({ ...rest, categories })
  return { items: await hydrate(page.items), total: page.total }
}

export async function getMostRead(limit = 5): Promise<PostView[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("posts")
  return hydrate(await getRepository().listMostRead(limit))
}

export async function getPost(slug: string): Promise<PostView | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("posts", `post:${slug}`)
  const post = await getRepository().getPost(slug)
  if (!post) return null
  const [view] = await hydrate([post])
  return view ?? null
}

/** Same category first, then the parent category, newest first. */
export async function getRelatedPosts(post: PostView, limit = 6): Promise<PostView[]> {
  const sameCategory = await getPosts({ category: post.category, exclude: post.slug, limit })
  if (sameCategory.items.length >= limit || !post.categoryRef.parent) return sameCategory.items
  const parent = await getPosts({ category: post.categoryRef.parent, exclude: post.slug, limit })
  const seen = new Set(sameCategory.items.map((p) => p.slug))
  return [...sameCategory.items, ...parent.items.filter((p) => !seen.has(p.slug))].slice(0, limit)
}
