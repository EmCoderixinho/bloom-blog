import { StaticPageView, staticPageMetadata } from "@/components/static-page"

export const metadata = staticPageMetadata("marketing")

export default function MarketingPage() {
  return <StaticPageView slug="marketing" />
}
