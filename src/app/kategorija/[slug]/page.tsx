import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { FileTextIcon } from "lucide-react"
import { Pager, parsePage } from "@/components/pager"
import { PostGrid } from "@/components/post/post-grid"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories, getCategory, getPosts } from "@/lib/data"
import { routes } from "@/lib/site"

// 15 fills whole rows at both 3 and 5 columns.
const PAGE_SIZE = 15

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: PageProps<"/kategorija/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const found = await getCategory(slug)
  if (!found) return {}
  return {
    title: found.category.name,
    description: found.category.description,
    alternates: { canonical: routes.category(slug) },
  }
}

export default function CategoryPage(props: PageProps<"/kategorija/[slug]">) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-8 sm:px-6">
      <Suspense fallback={<CategoryHeaderSkeleton />}>
        <CategoryHeader params={props.params} />
      </Suspense>
      <Suspense fallback={<GridSkeleton />}>
        <CategoryPosts params={props.params} searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}

async function CategoryHeader({ params }: Pick<PageProps<"/kategorija/[slug]">, "params">) {
  const { slug } = await params
  const found = await getCategory(slug)
  if (!found) notFound()
  const { category, parent, children } = found
  // A subcategory shows its siblings so readers can hop between them.
  const root = parent ?? category
  const chips = parent ? (await getCategory(parent.slug))?.children ?? [] : children

  return (
    <header className="flex flex-col items-center gap-5 text-center">
      {parent && (
        <Link href={routes.category(parent.slug)} className="text-sm font-semibold text-muted-foreground hover:underline">
          {parent.name}
        </Link>
      )}
      <h1 className="text-display">{category.name}</h1>
      <p className="max-w-xl text-body">{category.description}</p>
      {chips.length > 0 && (
        <nav aria-label="Podkategorije" className="flex flex-wrap justify-center gap-2">
          <Chip href={routes.category(root.slug)} active={category.slug === root.slug}>
            Sve
          </Chip>
          {chips.map((chip) => (
            <Chip key={chip.slug} href={routes.category(chip.slug)} active={chip.slug === category.slug}>
              {chip.name}
            </Chip>
          ))}
        </nav>
      )}
    </header>
  )
}

/** Pinterest filter chip: cream by default, inverted to ink when active. */
function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Button
      variant={active ? "inverse" : "secondary"}
      className="rounded-full"
      nativeButton={false}
      render={<Link href={href} aria-current={active ? "page" : undefined} />}
    >
      {children}
    </Button>
  )
}

async function CategoryPosts({ params, searchParams }: Pick<PageProps<"/kategorija/[slug]">, "params" | "searchParams">) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = parsePage(query.strana)
  const { items, total } = await getPosts({ category: slug, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })

  if (items.length === 0 && page > 1) notFound()
  if (items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>Još nema objava</EmptyTitle>
          <EmptyDescription>Uskoro stižu nove priče iz ove kategorije.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <PostGrid posts={items} />
      <Pager
        current={page}
        total={Math.ceil(total / PAGE_SIZE)}
        hrefFor={(p) => (p === 1 ? routes.category(slug) : `${routes.category(slug)}?strana=${p}`)}
      />
    </div>
  )
}

function CategoryHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Skeleton className="h-16 w-64" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-0.5 max-sm:-mx-4 sm:gap-1 lg:grid-cols-5">
      {Array.from({ length: 15 }, (_, i) => (
        <Skeleton key={i} className="aspect-3/4 rounded-none" />
      ))}
    </div>
  )
}
