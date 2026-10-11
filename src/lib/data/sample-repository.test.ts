import { afterEach, describe, expect, it, vi } from "vitest"
import { samplePosts } from "./sample-data"
import { sampleRepository } from "./sample-repository"
import { getMostRead, getPost, getPosts, getRelatedPosts } from "./index"

// `"use cache"` is a no-op outside Next.js, but the cache helpers must still be importable.
vi.mock("next/cache", () => ({ cacheLife: () => {}, cacheTag: () => {} }))
// Force the sample repository even if a developer's shell has Firebase credentials set.
vi.mock("@/lib/firebase/admin", () => ({ isFirebaseConfigured: () => false }))

const slugs = (posts: { slug: string }[]) => posts.map((post) => post.slug)

describe("sampleRepository.listPosts", () => {
  it("returns published posts newest first with the total count", async () => {
    const { items, total } = await sampleRepository.listPosts({ limit: 100 })
    expect(total).toBe(samplePosts.length)
    const dates = items.map((post) => post.publishedAt)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it("defaults to 12 items", async () => {
    const { items, total } = await sampleRepository.listPosts({})
    expect(items).toHaveLength(12)
    expect(total).toBe(samplePosts.length)
  })

  it("paginates with offset and limit", async () => {
    const all = slugs((await sampleRepository.listPosts({ limit: 100 })).items)
    const page2 = await sampleRepository.listPosts({ limit: 5, offset: 5 })
    expect(slugs(page2.items)).toEqual(all.slice(5, 10))
    expect(page2.total).toBe(all.length)

    const past = await sampleRepository.listPosts({ limit: 5, offset: 100 })
    expect(past.items).toEqual([])
    expect(past.total).toBe(all.length)
  })

  it("filters by leaf categories", async () => {
    const { items, total } = await sampleRepository.listPosts({ categories: ["njega-koze"] })
    expect(slugs(items)).toEqual(["jesenja-skincare-rutina-u-5-koraka", "retinol-vodic-za-pocetnike"])
    expect(total).toBe(2)
  })

  it("filters by author", async () => {
    const { items } = await sampleRepository.listPosts({ author: "lejla-begic", limit: 100 })
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((post) => post.author === "lejla-begic")).toBe(true)
  })

  it("filters by featured, including featured: false", async () => {
    const featured = await sampleRepository.listPosts({ featured: true, limit: 100 })
    const regular = await sampleRepository.listPosts({ featured: false, limit: 100 })
    expect(slugs(featured.items)).toEqual(["jesenja-skincare-rutina-u-5-koraka", "trendovi-jesen-zima-2026", "vikend-u-mostaru-vodic"])
    expect(featured.total + regular.total).toBe(samplePosts.length)
    expect(regular.items.every((post) => !post.featured)).toBe(true)
  })

  it("excludes a slug", async () => {
    const { items } = await sampleRepository.listPosts({ exclude: "vikend-u-mostaru-vodic", limit: 100 })
    expect(slugs(items)).not.toContain("vikend-u-mostaru-vodic")
    expect(items).toHaveLength(samplePosts.length - 1)
  })

  describe("with a draft post", () => {
    afterEach(() => {
      const index = samplePosts.findIndex((post) => post.slug === "draft-post")
      if (index >= 0) samplePosts.splice(index, 1)
    })

    it("hides drafts from lists, most read and single-post lookups", async () => {
      samplePosts.push({ ...samplePosts[0], slug: "draft-post", status: "draft", views: 1e9 })
      expect(slugs((await sampleRepository.listPosts({ limit: 100 })).items)).not.toContain("draft-post")
      expect(slugs(await sampleRepository.listMostRead(1))).not.toContain("draft-post")
      expect(await sampleRepository.getPost("draft-post")).toBeNull()
    })
  })
})

describe("sampleRepository.listMostRead", () => {
  it("sorts by views, highest first", async () => {
    const posts = await sampleRepository.listMostRead(4)
    expect(slugs(posts)).toEqual([
      "vikend-u-mostaru-vodic",
      "bosanski-lonac-moderni-recept",
      "retinol-vodic-za-pocetnike",
      "trendovi-jesen-zima-2026",
    ])
  })
})

describe("getPosts", () => {
  it("expands a parent category to its subcategories", async () => {
    const { items, total } = await getPosts({ category: "ljepota", limit: 100 })
    expect(total).toBe(5)
    expect(new Set(items.map((post) => post.category))).toEqual(new Set(["makeup", "njega-koze", "kosa", "nokti"]))
  })

  it("hydrates category and author references", async () => {
    const { items } = await getPosts({ category: "trendovi" })
    expect(slugs(items)).toEqual(["trendovi-jesen-zima-2026", "kako-nositi-smedu"])
    expect(items[0].categoryRef).toMatchObject({ slug: "trendovi", parent: "moda" })
    expect(items[0].authorRef).toMatchObject({ slug: "lejla-begic" })
  })

  it("returns nothing for an unknown category", async () => {
    expect(await getPosts({ category: "ne-postoji" })).toEqual({ items: [], total: 0 })
  })
})

describe("getMostRead", () => {
  it("defaults to five hydrated posts", async () => {
    const posts = await getMostRead()
    expect(posts).toHaveLength(5)
    expect(posts[0].authorRef.slug).toBe("tarik-kovac")
  })
})

describe("getRelatedPosts", () => {
  it("lists the same category first, then fills from the parent without duplicates", async () => {
    const post = await getPost("retinol-vodic-za-pocetnike")
    expect(post).not.toBeNull()
    const related = await getRelatedPosts(post!)
    expect(slugs(related)).toEqual([
      "jesenja-skincare-rutina-u-5-koraka", // njega-koze
      "glazirane-usne-kako-do-efekta", // rest of ljepota, newest first
      "boje-kose-za-jesen",
      "jesenji-nail-art",
    ])
  })

  it("respects the limit", async () => {
    const post = await getPost("retinol-vodic-za-pocetnike")
    expect(slugs(await getRelatedPosts(post!, 2))).toEqual(["jesenja-skincare-rutina-u-5-koraka", "glazirane-usne-kako-do-efekta"])
  })

  it("stops at the same category when it already fills the limit", async () => {
    const post = await getPost("trendovi-jesen-zima-2026")
    expect(slugs(await getRelatedPosts(post!, 1))).toEqual(["kako-nositi-smedu"])
  })
})

describe("getPost", () => {
  it("returns null for an unknown slug", async () => {
    expect(await getPost("ne-postoji")).toBeNull()
  })
})
