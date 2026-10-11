import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { AuthorAvatar } from "@/components/author-avatar"
import { PostGrid } from "@/components/post/post-grid"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getAuthor, getAuthors, getPosts } from "@/lib/data"
import { formatNumber } from "@/lib/format"
import { pageAlternates, routes } from "@/lib/site"

export async function generateStaticParams() {
  return (await getAuthors()).map((author) => ({ slug: author.slug }))
}

export async function generateMetadata({ params }: PageProps<"/autor/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) return {}
  return { title: author.name, description: author.bio, alternates: pageAlternates(routes.author(slug)) }
}

export default function AuthorPage(props: PageProps<"/autor/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
        <AuthorProfile params={props.params} />
      </Suspense>
    </div>
  )
}

/** Instagram profile layout: avatar, stats, bio, square post grid. */
async function AuthorProfile({ params }: Pick<PageProps<"/autor/[slug]">, "params">) {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) notFound()
  const { items, total } = await getPosts({ author: slug, limit: 60 })
  const likes = items.reduce((sum, post) => sum + post.likes, 0)

  return (
    <div className="flex flex-col gap-10">
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-12 sm:px-8">
        <AuthorAvatar author={author} size="lg" className="[&_[data-slot=avatar]]:size-28 sm:[&_[data-slot=avatar]]:size-36" />
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-xl font-semibold">{author.instagram ?? author.name}</h1>
            {author.instagram && (
              <Button
                variant="secondary"
                size="sm"
                nativeButton={false}
                render={<a href={`https://instagram.com/${author.instagram}`} target="_blank" rel="noopener noreferrer" />}
              >
                Instagram
              </Button>
            )}
          </div>
          <dl className="flex gap-8 text-sm">
            <Stat label="objava" value={total} />
            <Stat label="sviđanja" value={likes} />
          </dl>
          <div className="flex flex-col gap-1 text-center text-sm sm:text-left">
            <p className="font-semibold">{author.name}</p>
            <p className="text-muted-foreground">{author.role}</p>
            <p className="max-w-md text-body">{author.bio}</p>
          </div>
        </div>
      </header>
      <PostGrid posts={items} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex gap-1">
      <dd className="font-semibold">{formatNumber(value)}</dd>
      <dt className="text-body">{label}</dt>
    </div>
  )
}
