import { ImageResponse } from "next/og"
import { getPost, getPosts } from "@/lib/data"
import { OgEyebrow, OgWordmark, ogColors, ogContentType, ogFonts, ogSize } from "@/lib/og"
import { siteConfig } from "@/lib/site"

export const alt = siteConfig.name
export const size = ogSize
export const contentType = ogContentType

// Prerender the latest posts' images at build time: rendering a PNG on request is slow and
// uses function time on the free plan. Older posts still render on demand and are then cached.
export async function generateStaticParams() {
  const { items } = await getPosts({ limit: 50 })
  return items.map((post) => ({ slug: post.slug }))
}

/** The post cover with the title over it, framed like the home page hero card. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  const title = post?.title ?? siteConfig.name
  const eyebrow = post?.categoryRef.name ?? siteConfig.tagline
  const titleSize = title.length > 70 ? 54 : 64
  const byline = post ? `${post.authorRef.name} · ${post.readingMinutes} min čitanja` : siteConfig.domain

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", padding: 20, background: ogColors.ground, fontFamily: "Plus Jakarta Sans" }}>
        <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: ogColors.foreground }}>
          {post && (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- Satori renders plain <img>
            <img src={post.cover.src} width={ogSize.width - 40} height={ogSize.height - 40} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              padding: "48px 56px",
              background: "linear-gradient(180deg, rgba(18,18,17,0.25) 0%, rgba(18,18,17,0.1) 35%, rgba(18,18,17,0.85) 100%)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <OgEyebrow dark>{eyebrow}</OgEyebrow>
              <OgWordmark color="#ffffff" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", fontSize: titleSize, fontWeight: 800, lineHeight: 1.06, letterSpacing: -0.025 * titleSize, color: "#ffffff", maxWidth: 1000 }}>
                {title}
              </div>
              <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{byline}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts(`${siteConfig.name.toLowerCase()}.${title}${eyebrow}${byline}`) },
  )
}
