import "server-only"

import { Timestamp, type DocumentData, type Query } from "firebase-admin/firestore"
import type { Author, Category, Post } from "@/lib/types"
import { getAdminDb } from "@/lib/firebase/admin"
import type { Repository } from "./repository"

// Firestore limits `in` filters to 30 values.
const MAX_IN_VALUES = 30

/** Firestore may hold `Timestamp`s; cached data must be plain, serializable values. */
function toPost(id: string, data: DocumentData): Post {
  const publishedAt = data.publishedAt instanceof Timestamp ? data.publishedAt.toDate().toISOString() : data.publishedAt
  return { ...data, slug: id, publishedAt } as Post
}

function publishedPosts(): Query {
  return getAdminDb().collection("posts").where("status", "==", "published")
}

export const firestoreRepository: Repository = {
  async listCategories() {
    const snap = await getAdminDb().collection("categories").orderBy("order").get()
    return snap.docs.map((doc) => ({ ...doc.data(), slug: doc.id }) as Category)
  },

  async listAuthors() {
    const snap = await getAdminDb().collection("authors").get()
    return snap.docs.map((doc) => ({ ...doc.data(), slug: doc.id }) as Author)
  },

  async listPosts({ categories, author, featured, exclude, limit = 12, offset = 0 }) {
    // Unknown category: nothing to show (an empty `in` filter would throw).
    if (categories?.length === 0) return { items: [], total: 0 }
    if (categories && categories.length > MAX_IN_VALUES) {
      throw new Error(`A category with more than ${MAX_IN_VALUES - 1} subcategories needs chunked queries`)
    }
    let query = publishedPosts()
    if (categories) query = query.where("category", "in", categories)
    if (author) query = query.where("author", "==", author)
    if (featured !== undefined) query = query.where("featured", "==", featured)
    query = query.orderBy("publishedAt", "desc")

    // Fetch one extra so an excluded post doesn't shorten the page.
    const fetchLimit = exclude ? limit + 1 : limit
    const [page, count] = await Promise.all([
      query.offset(offset).limit(fetchLimit).get(),
      query.count().get(),
    ])
    const items = page.docs
      .map((doc) => toPost(doc.id, doc.data()))
      .filter((post) => post.slug !== exclude)
      .slice(0, limit)
    const total = count.data().count - (exclude && page.docs.some((d) => d.id === exclude) ? 1 : 0)
    return { items, total }
  },

  async listMostRead(limit) {
    const snap = await publishedPosts().orderBy("views", "desc").limit(limit).get()
    return snap.docs.map((doc) => toPost(doc.id, doc.data()))
  },

  async getPost(slug) {
    const doc = await getAdminDb().collection("posts").doc(slug).get()
    if (!doc.exists) return null
    const post = toPost(doc.id, doc.data()!)
    return post.status === "published" ? post : null
  },
}
