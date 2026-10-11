import { describe, expect, it } from "vitest"
import { formatDate, formatNumber, formatRelative } from "./format"

describe("formatNumber", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1843, "1.843 BROKEN ON PURPOSE"],
    [25300, "25.300"],
    [1234567, "1.234.567"],
    [1843.6, "1.844"],
  ])("%d → %s", (value, expected) => {
    expect(formatNumber(value)).toBe(expected)
  })
})

describe("formatDate", () => {
  it("formats in Bosnian with a trailing dot", () => {
    expect(formatDate("2026-10-06T12:00:00.000Z")).toBe("6. oktobar 2026.")
  })

  it("uses Sarajevo time, not UTC", () => {
    // 23:30 UTC on 31 Dec is already 1 Jan in Sarajevo (UTC+1 in winter).
    expect(formatDate("2026-12-31T23:30:00.000Z")).toBe("1. januar 2027.")
    // Summer time is UTC+2.
    expect(formatDate("2026-07-31T22:30:00.000Z")).toBe("1. august 2026.")
  })
})

describe("formatRelative", () => {
  const now = Date.parse("2026-10-11T12:00:00.000Z")
  const ago = (seconds: number) => new Date(now - seconds * 1000).toISOString()
  const MIN = 60
  const HOUR = 60 * MIN
  const DAY = 24 * HOUR

  it.each([
    [0, "upravo sada"],
    [59, "upravo sada"],
    [1 * MIN, "prije 1 minutu"],
    [2 * MIN, "prije 2 minute"],
    [5 * MIN, "prije 5 minuta"],
    [11 * MIN, "prije 11 minuta"],
    [21 * MIN, "prije 21 minutu"],
    [22 * MIN, "prije 22 minute"],
    [1 * HOUR, "prije 1 sat"],
    [3 * HOUR, "prije 3 sata"],
    [12 * HOUR, "prije 12 sati"],
    [21 * HOUR, "prije 21 sat"],
    [1 * DAY, "jučer"],
    [2 * DAY, "prije 2 dana"],
    [6 * DAY, "prije 6 dana"],
    [7 * DAY, "prije 1 sedmicu"],
    [14 * DAY, "prije 2 sedmice"],
    [27 * DAY, "prije 3 sedmice"],
  ])("%d seconds ago → %s", (seconds, expected) => {
    expect(formatRelative(ago(seconds), now)).toBe(expected)
  })

  it("falls back to the full date after four weeks", () => {
    expect(formatRelative(ago(28 * DAY), now)).toBe("13. septembar 2026.")
  })

  it("falls back to the full date for future dates", () => {
    expect(formatRelative("2026-10-12T12:00:00.000Z", now)).toBe("12. oktobar 2026.")
  })
})
