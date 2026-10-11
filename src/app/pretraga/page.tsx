import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchIcon } from "lucide-react"
import { SearchForm } from "@/components/layout/search-form"
import { PostGrid } from "@/components/post/post-grid"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { getPosts } from "@/lib/data"
import type { PostView } from "@/lib/types"

export const metadata: Metadata = { title: "Pretraga", robots: { index: false } }

/** Lowercase and strip diacritics so "koza" matches "koža". */
function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d")
}

// Simple in-memory match over recent posts; replace with a search index (ticket B-8) as content grows.
function matches(post: PostView, terms: string[]) {
  const haystack = normalize([post.title, post.excerpt, post.categoryRef.name, ...post.tags].join(" "))
  return terms.every((term) => haystack.includes(term))
}

export default function SearchPage(props: PageProps<"/pretraga">) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-8 sm:px-6">
      <Suspense fallback={<Skeleton className="mx-auto h-12 w-full max-w-xl rounded-full" />}>
        <SearchResults searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}

async function SearchResults({ searchParams }: Pick<PageProps<"/pretraga">, "searchParams">) {
  const { q } = await searchParams
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? ""
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  const results = terms.length ? (await getPosts({ limit: 200 })).items.filter((post) => matches(post, terms)) : []

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 text-center">
        <h1 className="text-heading-xl">{query ? `Rezultati za „${query}”` : "Pretraga"}</h1>
        <SearchForm defaultValue={query} />
        {query && <p className="text-sm text-muted-foreground">{results.length} rezultata</p>}
      </div>
      {query && results.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>Ništa nismo pronašli</EmptyTitle>
            <EmptyDescription>Pokušajte s drugim pojmom, npr. „skincare” ili „recepti”.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <PostGrid posts={results} />
      )}
    </>
  )
}
