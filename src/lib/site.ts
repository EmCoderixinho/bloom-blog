export const siteConfig = {
  name: "Bloom",
  domain: "bloom.ba",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Ljepota, zdravlje, moda i lifestyle",
  description:
    "Bloom je online magazin o ljepoti, zdravlju, modi i lifestyleu: savjeti, trendovi i inspiracija za svaki dan.",
  locale: "bs_BA",
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

export const routes = {
  home: () => "/",
  post: (slug: string) => `/objava/${slug}`,
  category: (slug: string) => `/kategorija/${slug}`,
  author: (slug: string) => `/autor/${slug}`,
  search: (q?: string) => (q ? `/pretraga?q=${encodeURIComponent(q)}` : "/pretraga"),
}
