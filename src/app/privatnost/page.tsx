import { StaticPageView, staticPageMetadata } from "@/components/static-page"

export const metadata = staticPageMetadata("privatnost")

export default function PrivacyPage() {
  return <StaticPageView slug="privatnost" />
}
