import { StaticPageView, staticPageMetadata } from "@/components/static-page"

export const metadata = staticPageMetadata("kontakt")

export default function ContactPage() {
  return <StaticPageView slug="kontakt" />
}
