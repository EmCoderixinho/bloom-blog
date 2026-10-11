import { ImageResponse } from "next/og"
import { OgEyebrow, OgWordmark, ogColors, ogContentType, ogFonts, ogSize } from "@/lib/og"
import { siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`
export const size = ogSize
export const contentType = ogContentType

export default async function Image() {
  const headline = "Ljepota, zdravlje, moda i lifestyle"
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", padding: 28, background: ogColors.ground, fontFamily: "Plus Jakarta Sans" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            borderRadius: 40,
            background: "#ffffff",
            boxShadow: "0 24px 48px -32px rgba(0,0,0,0.25)",
          }}
        >
          <OgWordmark size={56} />
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <OgEyebrow>Online magazin</OgEyebrow>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.04, letterSpacing: -1.9, color: ogColors.foreground, maxWidth: 900 }}>
              {headline}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: ogColors.muted }}>{siteConfig.domain}</div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts(`${siteConfig.name.toLowerCase()}.${headline}Online magazin${siteConfig.domain}`) },
  )
}
