import { CategoryStories } from "@/components/home/category-stories"
import { FeaturedHero } from "@/components/home/featured-hero"
import { MostRead } from "@/components/home/most-read"
import { PostGrid } from "@/components/post/post-grid"
import { SectionHeading } from "@/components/section-heading"
import { getCategories, getMostRead, getPosts } from "@/lib/data"
import { routes } from "@/lib/site"

const HOME_SECTIONS = ["ljepota", "moda", "lifestyle"]

export default async function HomePage() {
  const [categories, featured, latest, mostRead] = await Promise.all([
    getCategories(),
    getPosts({ featured: true, limit: 3 }),
    getPosts({ limit: 18 }),
    getMostRead(5),
  ])
  const featuredSlugs = new Set(featured.items.map((p) => p.slug))
  // 15 fills whole rows at both 3 and 5 columns.
  const feed = latest.items.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 15)
  const top = categories.filter((c) => !c.parent)
  const sections = await Promise.all(
    top
      .filter((c) => HOME_SECTIONS.includes(c.slug))
      .map(async (category) => ({ category, posts: (await getPosts({ category: category.slug, limit: 10 })).items })),
  )
  // A teaser needs at least one full desktop row; thinner categories are reachable from the nav.
  const fullSections = sections.filter(({ posts }) => posts.length >= 5)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 pt-8 sm:px-6 lg:gap-28">
      <div className="flex flex-col gap-8">
        <CategoryStories categories={categories.filter((c) => c.parent)} />
        <FeaturedHero posts={featured.items} />
      </div>

      <section aria-labelledby="latest" className="flex flex-col gap-6">
        <SectionHeading id="latest" eyebrow="Svježe objave" title="Najnovije" />
        <PostGrid posts={feed} balanced />
      </section>

      <MostRead posts={mostRead} />

      {fullSections.map(({ category, posts }) => (
        <section key={category.slug} aria-labelledby={`section-${category.slug}`} className="flex flex-col gap-6">
          <SectionHeading
            id={`section-${category.slug}`}
            eyebrow="Kategorija"
            title={category.name}
            href={routes.category(category.slug)}
          />
          <PostGrid posts={posts} balanced />
        </section>
      ))}
    </div>
  )
}
