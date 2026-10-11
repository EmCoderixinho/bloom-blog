import { describe, expect, it } from "vitest"
import { matches, normalize, searchTerms } from "./search"

describe("normalize", () => {
  it("lowercases and strips diacritics", () => {
    expect(normalize("Koža")).toBe("koza")
    expect(normalize("ČAŠA ćevapi šljiva žir")).toBe("casa cevapi sljiva zir")
  })

  it("maps đ, which has no combining diacritic, to d", () => {
    expect(normalize("Đurđevak")).toBe("durdevak")
  })
})

describe("searchTerms", () => {
  it("splits on whitespace and drops empty terms", () => {
    expect(searchTerms("  Njega   KOŽE ")).toEqual(["njega", "koze"])
    expect(searchTerms("   ")).toEqual([])
  })
})

describe("matches", () => {
  const post = {
    title: "Jesenja skincare rutina",
    excerpt: "Kada temperature padnu, koža gubi vlagu.",
    categoryRef: { name: "Njega kože" },
    tags: ["retinol", "vodič"],
  } as Parameters<typeof matches>[0]

  it("matches across title, excerpt, category and tags without diacritics", () => {
    expect(matches(post, searchTerms("koza"))).toBe(true)
    expect(matches(post, searchTerms("SKINCARE"))).toBe(true)
    expect(matches(post, searchTerms("njega koze"))).toBe(true)
    expect(matches(post, searchTerms("vodic"))).toBe(true)
  })

  it("requires every term to match", () => {
    expect(matches(post, searchTerms("koza recepti"))).toBe(false)
  })

  it("matches partial words", () => {
    expect(matches(post, searchTerms("reti"))).toBe(true)
  })
})
