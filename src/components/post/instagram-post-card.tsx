import Link from "next/link"
import { MoreHorizontalIcon } from "lucide-react"
import { AuthorAvatar } from "@/components/author-avatar"
import { TimeAgo } from "@/components/time-ago"
import { routes } from "@/lib/site"
import type { PostView } from "@/lib/types"
import { PostActions } from "./post-actions"
import { PostMedia } from "./post-media"

/** A blog post presented as an Instagram feed post. */
export function InstagramPostCard({ post, priority = false }: { post: PostView; priority?: boolean }) {
  const href = routes.post(post.slug)

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <header className="flex items-center gap-3 px-3 py-2.5">
        <Link href={routes.author(post.author)} aria-label={post.authorRef.name}>
          <AuthorAvatar author={post.authorRef} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col text-sm leading-tight">
          <Link href={routes.author(post.author)} className="truncate font-semibold hover:underline">
            {post.authorRef.name}
          </Link>
          <Link href={routes.category(post.category)} className="truncate text-xs text-muted-foreground hover:underline">
            {post.categoryRef.name}
          </Link>
        </div>
        <MoreHorizontalIcon className="size-5 text-muted-foreground" aria-hidden />
      </header>

      <PostMedia
        images={[post.cover, ...post.gallery]}
        href={href}
        sizes="(min-width: 640px) 470px, 100vw"
        priority={priority}
      />

      <div className="flex flex-col gap-1.5 px-3 pt-1 pb-4">
        <PostActions slug={post.slug} title={post.title} likes={post.likes} />
        <h3 className="text-base leading-snug font-semibold">
          <Link href={href} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-body">
          <span className="font-semibold text-foreground">{post.authorRef.instagram ?? post.authorRef.name}</span>{" "}
          {post.excerpt}
        </p>
        <Link href={href} className="text-sm text-muted-foreground hover:underline">
          Pročitaj članak · {post.readingMinutes} min
        </Link>
        <TimeAgo iso={post.publishedAt} className="text-xs tracking-wide text-muted-foreground uppercase" />
      </div>
    </article>
  )
}
