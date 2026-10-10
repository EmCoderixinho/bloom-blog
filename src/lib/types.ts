export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type Category = {
  slug: string
  name: string
  description: string
  /** Slug of the parent category; undefined for top-level categories. */
  parent?: string
  cover: ImageAsset
  order: number
}

export type Author = {
  slug: string
  name: string
  role: string
  bio: string
  avatar: string
  instagram?: string
}

export type PostStatus = "draft" | "published"

export type Post = {
  slug: string
  title: string
  excerpt: string
  /** Markdown. */
  body: string
  cover: ImageAsset
  /** Extra images shown in the Instagram-style carousel after the cover. */
  gallery: ImageAsset[]
  /** Slug of the (sub)category the post belongs to. */
  category: string
  tags: string[]
  author: string
  status: PostStatus
  /** ISO 8601 timestamp. */
  publishedAt: string
  featured: boolean
  likes: number
  views: number
  readingMinutes: number
}

/** A post joined with the records it references, ready for rendering. */
export type PostView = Post & {
  categoryRef: Category
  authorRef: Author
}

export type PostQuery = {
  /** Includes posts from the category's subcategories. */
  category?: string
  author?: string
  featured?: boolean
  exclude?: string
  limit?: number
  offset?: number
}

export type Page<T> = {
  items: T[]
  total: number
}
