import { StaticPageView, staticPageMetadata } from "@/components/static-page"

export const metadata = staticPageMetadata("o-nama")

export default function AboutPage() {
  return <StaticPageView slug="o-nama" />
}
