import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryStories } from "@/components/home/category-stories"
import { FeaturedHero } from "@/components/home/featured-hero"
import { MostRead } from "@/components/home/most-read"
import { InstagramPostCard } from "@/components/post/instagram-post-card"
import { Masonry, PinCard } from "@/components/post/pin-card"
import { SectionHeading } from "@/components/section-heading"
import { getCategories, getMostRead, getPosts } from "@/lib/data"
import { routes } from "@/lib/site"

const HOME_SECTIONS = ["ljepota", "moda", "lifestyle"]

export default async function HomePage() {
  const [categories, featured, latest, mostRead] = await Promise.all([
    getCategories(),
    getPosts({ featured: true, limit: 3 }),
    getPosts({ limit: 9 }),
    getMostRead(5),
  ])
  const featuredSlugs = new Set(featured.items.map((p) => p.slug))
  const feed = latest.items.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 6)
  const top = categories.filter((c) => !c.parent)
  const sections = await Promise.all(
    top
      .filter((c) => HOME_SECTIONS.includes(c.slug))
      .map(async (category) => ({ category, posts: (await getPosts({ category: category.slug, limit: 8 })).items })),
  )

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-6 sm:px-6">
      <div className="flex flex-col gap-8">
        <CategoryStories categories={categories.filter((c) => c.parent)} />
        <FeaturedHero posts={featured.items} />
      </div>

      <section aria-labelledby="latest" className="grid justify-center gap-12 lg:grid-cols-[minmax(0,470px)_320px] lg:gap-16">
        <div className="flex flex-col gap-6">
          <SectionHeading id="latest" title="Najnovije" />
          {feed.map((post) => (
            <InstagramPostCard key={post.slug} post={post} />
          ))}
        </div>
        <aside className="flex flex-col gap-10 lg:sticky lg:top-24 lg:self-start">
          <MostRead posts={mostRead} />
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Istraži</h2>
            <div className="flex flex-wrap gap-2">
              {top.map((category) => (
                <Button
                  key={category.slug}
                  variant="secondary"
                  className="rounded-full"
                  nativeButton={false}
                  render={<Link href={routes.category(category.slug)} />}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {sections.map(({ category, posts }) => (
        <section key={category.slug} aria-labelledby={`section-${category.slug}`} className="flex flex-col gap-6">
          <SectionHeading id={`section-${category.slug}`} title={category.name} href={routes.category(category.slug)} />
          <Masonry>
            {posts.map((post) => (
              <PinCard key={post.slug} post={post} />
            ))}
          </Masonry>
        </section>
      ))}
    </div>
  )
}
