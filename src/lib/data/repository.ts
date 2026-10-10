import "server-only"

import type { Author, Category, Page, Post, PostQuery } from "@/lib/types"
import { isFirebaseConfigured } from "@/lib/firebase/admin"
import { firestoreRepository } from "./firestore-repository"
import { sampleRepository } from "./sample-repository"

/** Raw storage access. Pages go through the cached functions in `./index.ts`. */
export interface Repository {
  listCategories(): Promise<Category[]>
  listAuthors(): Promise<Author[]>
  /** Published posts, newest first. `query.category` must already be expanded to leaf slugs. */
  listPosts(query: Omit<PostQuery, "category"> & { categories?: string[] }): Promise<Page<Post>>
  listMostRead(limit: number): Promise<Post[]>
  getPost(slug: string): Promise<Post | null>
}

export function getRepository(): Repository {
  return isFirebaseConfigured() ? firestoreRepository : sampleRepository
}
