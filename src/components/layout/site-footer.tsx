import Link from "next/link"
import { cacheLife } from "next/cache"
import { NewsletterForm } from "@/components/newsletter-form"
import { Separator } from "@/components/ui/separator"
import { getTopCategories } from "@/lib/data"
import { routes, siteConfig } from "@/lib/site"
import { Wordmark } from "./wordmark"

export async function SiteFooter() {
  "use cache"
  cacheLife("days")
  const categories = await getTopCategories()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t bg-surface-soft">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6">
        <section id="newsletter" className="flex scroll-mt-24 flex-col gap-6 rounded-2xl bg-muted p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-md flex-col gap-2">
            <h2 className="text-heading-xl">Bloom u vašem inboxu</h2>
            <p className="text-body">Najbolje priče sedmice, beauty otkrića i trendovi, svakog petka ujutro.</p>
          </div>
          <div className="w-full md:max-w-md">
            <NewsletterForm />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <Wordmark />
            <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>
          <FooterColumn title="Kategorije">
            {categories.map((c) => (
              <FooterLink key={c.slug} href={routes.category(c.slug)}>
                {c.name}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title="Magazin">
            {siteConfig.footerLinks.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title="Pratite nas">
            <FooterLink href={siteConfig.social.instagram}>Instagram</FooterLink>
            <FooterLink href={siteConfig.social.facebook}>Facebook</FooterLink>
            <FooterLink href={siteConfig.social.tiktok}>TikTok</FooterLink>
          </FooterColumn>
        </div>

        <Separator />
        <p className="text-xs text-muted-foreground">
          © {year} {siteConfig.name}. Sva prava zadržana.
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http")
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </Link>
    </li>
  )
}
