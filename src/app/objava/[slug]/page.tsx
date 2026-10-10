import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { AuthorAvatar } from "@/components/author-avatar"
import { Markdown } from "@/components/markdown"
import { PostActions } from "@/components/post/post-actions"
import { PostGrid } from "@/components/post/post-grid"
import { PostMedia } from "@/components/post/post-media"
import { SectionHeading } from "@/components/section-heading"
import { TimeAgo } from "@/components/time-ago"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getPost, getPosts, getRelatedPosts } from "@/lib/data"
import { formatDate } from "@/lib/format"
import { routes, siteConfig } from "@/lib/site"
import type { PostView } from "@/lib/types"

export async function generateStaticParams() {
  const { items } = await getPosts({ limit: 50 })
  return items.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps<"/objava/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: routes.post(post.slug) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.authorRef.name],
      section: post.categoryRef.name,
      tags: post.tags,
      images: [{ url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }],
    },
    twitter: { card: "summary_large_image" },
  }
}

export default function PostPage(props: PageProps<"/objava/[slug]">) {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostContent params={props.params} />
    </Suspense>
  )
}

async function PostContent({ params }: Pick<PageProps<"/objava/[slug]">, "params">) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-6 sm:px-6">
      <JsonLd post={post} />

      <div className="grid overflow-hidden rounded-2xl border bg-card lg:grid-cols-[minmax(0,1fr)_400px]">
        <PostMedia images={[post.cover, ...post.gallery]} priority sizes="(min-width: 1024px) 700px, 100vw" />

        <div className="flex flex-col lg:border-l">
          <header className="flex items-center gap-3 border-b px-4 py-3">
            <Link href={routes.author(post.author)}>
              <AuthorAvatar author={post.authorRef} />
            </Link>
            <div className="flex min-w-0 flex-col text-sm leading-tight">
              <Link href={routes.author(post.author)} className="truncate font-semibold hover:underline">
                {post.authorRef.name}
              </Link>
              <span className="truncate text-xs text-muted-foreground">{post.authorRef.role}</span>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
            <Badge variant="secondary" className="h-6 px-3 font-bold" render={<Link href={routes.category(post.category)} />}>
              {post.categoryRef.name}
            </Badge>
            <h1 className="text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] leading-[1.15] font-bold tracking-[-0.8px]">
              {post.title}
            </h1>
            <p className="text-body">{post.excerpt}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min čitanja
            </p>
          </div>

          <div className="flex flex-col gap-1 border-t px-4 pt-1 pb-4">
            <PostActions slug={post.slug} title={post.title} likes={post.likes} showReadLink={false} />
            <TimeAgo iso={post.publishedAt} className="text-xs tracking-wide text-muted-foreground uppercase" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-8">
        <Markdown>{post.body}</Markdown>

        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Tagovi">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary" className="h-8 px-4 text-sm font-bold" render={<Link href={routes.search(tag)} />}>
                  #{tag}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        <Separator />

        <Link href={routes.author(post.author)} className="group flex items-center gap-4 rounded-xl bg-muted p-5">
          <AuthorAvatar author={post.authorRef} size="lg" />
          <div className="flex flex-col gap-1">
            <span className="font-bold group-hover:underline">{post.authorRef.name}</span>
            <span className="text-sm text-body">{post.authorRef.bio}</span>
          </div>
        </Link>
      </div>

      <Suspense>
        <RelatedPosts post={post} />
      </Suspense>
    </article>
  )
}

async function RelatedPosts({ post }: { post: PostView }) {
  const related = await getRelatedPosts(post, 6)
  if (related.length === 0) return null
  return (
    <section aria-labelledby="related" className="flex flex-col gap-6">
      <SectionHeading id="related" title={`Više iz kategorije ${post.categoryRef.name}`} href={routes.category(post.category)} />
      <PostGrid posts={related} />
    </section>
  )
}

function JsonLd({ post }: { post: PostView }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.cover.src, ...post.gallery.map((g) => g.src)],
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.authorRef.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: new URL(routes.post(post.slug), siteConfig.url).toString(),
  }
  return (
    <script
      type="application/ld+json"
      // Escape "<" so post content can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

function PostSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <Skeleton className="aspect-4/5 rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-24" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  )
}
