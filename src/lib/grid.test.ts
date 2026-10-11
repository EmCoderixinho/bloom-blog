import { describe, expect, it } from "vitest"
import { overflowClass } from "./grid"

const classes = (count: number) => Array.from({ length: count }, (_, index) => overflowClass(index, count))

describe("overflowClass", () => {
  it("hides nothing when both layouts have full rows", () => {
    expect(classes(15).every((c) => c === undefined)).toBe(true)
  })

  it("trims the short mobile row (3 columns) but keeps full desktop rows (5 columns)", () => {
    // 10 tiles: mobile shows 9, desktop shows all 10.
    expect(classes(10)).toEqual([...Array(9).fill(undefined), "max-lg:hidden"])
  })

  it("trims the short desktop row but keeps full mobile rows", () => {
    // 6 tiles: mobile shows 6, desktop shows 5.
    expect(classes(6)).toEqual([...Array(5).fill(undefined), "lg:hidden"])
  })

  it("hides tiles that overflow on both layouts", () => {
    // 8 tiles: mobile shows 6, desktop shows 5.
    expect(classes(8)).toEqual([...Array(5).fill(undefined), "lg:hidden", "hidden", "hidden"])
  })

  it("keeps everything when there are fewer tiles than one row", () => {
    expect(classes(2)).toEqual([undefined, undefined])
  })

  it("trims mobile overflow while desktop has no full row yet", () => {
    // 4 tiles: one full mobile row plus one extra; desktop has no full row, so it keeps all.
    expect(classes(4)).toEqual([undefined, undefined, undefined, "max-lg:hidden"])
  })
})
