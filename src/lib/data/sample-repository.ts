import "server-only"

import type { Repository } from "./repository"
import { sampleAuthors, sampleCategories, samplePosts } from "./sample-data"

const published = () =>
  samplePosts
    .filter((post) => post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const sampleRepository: Repository = {
  async listCategories() {
    return [...sampleCategories].sort((a, b) => a.order - b.order)
  },

  async listAuthors() {
    return sampleAuthors
  },

  async listPosts({ categories, author, featured, exclude, limit = 12, offset = 0 }) {
    const matches = published().filter(
      (post) =>
        (!categories || categories.includes(post.category)) &&
        (!author || post.author === author) &&
        (featured === undefined || post.featured === featured) &&
        post.slug !== exclude,
    )
    return { items: matches.slice(offset, offset + limit), total: matches.length }
  },

  async listMostRead(limit) {
    return published()
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  },

  async getPost(slug) {
    return published().find((post) => post.slug === slug) ?? null
  },
}
