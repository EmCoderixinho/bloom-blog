import type { MetadataRoute } from "next"
import { routes, siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [routes.search(), "/admin"] },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  }
}
