import { getPosts } from "@/lib/data"
import { routes, siteConfig } from "@/lib/site"

const FEED_SIZE = 20

const XML_ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }

/** Escapes text for XML and drops control characters that XML 1.0 forbids. */
function escapeXml(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
    .replace(/[&<>"']/g, (char) => XML_ENTITIES[char])
}

export async function GET() {
  const { items } = await getPosts({ limit: FEED_SIZE })
  const feedUrl = new URL("/feed.xml", siteConfig.url).toString()

  const entries = items.map((post) => {
    const link = escapeXml(new URL(routes.post(post.slug), siteConfig.url).toString())
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(post.categoryRef.name)}</category>
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>bs</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />${
      items[0] ? `\n    <lastBuildDate>${new Date(items[0].publishedAt).toUTCString()}</lastBuildDate>` : ""
    }
${entries.join("\n")}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
