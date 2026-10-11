export const siteConfig = {
  name: "Bloom",
  domain: "bloom.ba",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Ljepota, zdravlje, moda i lifestyle",
  description:
    "Bloom je online magazin o ljepoti, zdravlju, modi i lifestyleu: savjeti, trendovi i inspiracija za svaki dan.",
  locale: "bs_BA",
  // Placeholder contact details (draft): the owner replaces these before launch.
  contact: {
    email: "redakcija@bloom.ba",
    marketingEmail: "marketing@bloom.ba",
    phone: "+387 33 000 000",
    address: "Sarajevo, Bosna i Hercegovina",
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
  footerLinks: [
    { label: "O nama", href: "/o-nama" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Marketing", href: "/marketing" },
    { label: "Uslovi korištenja", href: "/uslovi-koristenja" },
    { label: "Privatnost", href: "/privatnost" },
  ],
} as const

/**
 * `alternates` for page metadata. A page's `alternates` replaces the root layout's
 * entirely, so every page sets the RSS link along with its canonical URL.
 */
export function pageAlternates(canonical?: string) {
  return {
    canonical,
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${siteConfig.name} RSS` }] },
  }
}

export const routes = {
  home: () => "/",
  post: (slug: string) => `/objava/${slug}`,
  category: (slug: string) => `/kategorija/${slug}`,
  author: (slug: string) => `/autor/${slug}`,
  search: (q?: string) => (q ? `/pretraga?q=${encodeURIComponent(q)}` : "/pretraga"),
}
