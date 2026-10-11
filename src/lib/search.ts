import type { PostView } from "@/lib/types"

/** Lowercase and strip diacritics so "koza" matches "koža". */
export function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d")
}

/** Split a raw query into normalized terms. */
export function searchTerms(query: string) {
  return normalize(query).split(/\s+/).filter(Boolean)
}

// Simple in-memory match over recent posts; replace with a search index (ticket B-8) as content grows.
export function matches(post: Pick<PostView, "title" | "excerpt" | "categoryRef" | "tags">, terms: string[]) {
  const haystack = normalize([post.title, post.excerpt, post.categoryRef.name, ...post.tags].join(" "))
  return terms.every((term) => haystack.includes(term))
}
