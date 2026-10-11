import { cacheLife } from "next/cache"
import { siteConfig } from "@/lib/site"

/**
 * Shared setup for the generated Open Graph images (`opengraph-image.tsx`).
 * Letter spacing is in px: Satori ignores `em`, and it doesn't apply negative tracking
 * across a word/punctuation boundary, so headings use lighter tracking than the site
 * to keep commas from floating.
 */
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

export const ogColors = {
  ground: "#f2f2f0",
  foreground: "#211922",
  body: "#33332e",
  muted: "#62625b",
  primary: "#e60023",
}

type FontWeight = 600 | 800

/**
 * Plus Jakarta Sans from Google Fonts as TTF (the format ImageResponse accepts),
 * subset to `text` so diacritics like č, ć, đ are always included and the file stays small.
 * Fetched rather than read from disk so the font file doesn't have to be traced into the server bundle.
 */
async function loadFont(weight: FontWeight, text: string): Promise<ArrayBuffer> {
  "use cache"
  cacheLife("max")
  // Throws instead of returning null so a failed fetch isn't cached.
  const query = new URLSearchParams({ family: `Plus Jakarta Sans:wght@${weight}`, text })
  const cssResponse = await fetch(`https://fonts.googleapis.com/css2?${query}`)
  if (!cssResponse.ok) throw new Error(`Google Fonts CSS: HTTP ${cssResponse.status}`)
  const url = (await cssResponse.text()).match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
  if (!url) throw new Error("Google Fonts CSS has no TTF/OTF source")
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Google Fonts file: HTTP ${response.status}`)
  return response.arrayBuffer()
}

/** Fonts for ImageResponse. Falls back to the built-in font if Google Fonts is unreachable. */
export async function ogFonts(text: string) {
  // Eyebrows are uppercased, so include both cases; sort the glyphs so equal sets share a cache entry.
  const glyphs = [...new Set(text + text.toUpperCase())].sort().join("")
  const weights: FontWeight[] = [600, 800]
  const fonts = await Promise.all(
    weights.map(async (weight) => ({
      weight,
      data: await loadFont(weight, glyphs).catch((error: unknown) => {
        console.warn(`OG font ${weight} unavailable, using the fallback font:`, error)
        return null
      }),
    })),
  )
  return fonts.flatMap(({ weight, data }) =>
    data ? [{ name: "Plus Jakarta Sans", data, weight, style: "normal" as const }] : [],
  )
}

/** "bloom." with the accent dot, as in the site header. */
export function OgWordmark({ color = ogColors.foreground, size = 40 }: { color?: string; size?: number }) {
  return (
    <div style={{ display: "flex", fontSize: size, fontWeight: 800, letterSpacing: -0.04 * size, color }}>
      {siteConfig.name.toLowerCase()}
      <span style={{ color: ogColors.primary }}>.</span>
    </div>
  )
}

/** Pill label like the site's `Eyebrow`. */
export function OgEyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        padding: "8px 18px",
        borderRadius: 999,
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: 3.6,
        textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,0.92)" : "rgba(33,25,34,0.8)",
        background: dark ? "rgba(255,255,255,0.16)" : "rgba(33,25,34,0.05)",
        border: dark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(33,25,34,0.06)",
      }}
    >
      {children}
    </div>
  )
}
