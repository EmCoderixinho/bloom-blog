import Image from "next/image"
import Link from "next/link"
import { routes } from "@/lib/site"
import type { PostView } from "@/lib/types"

export function MostRead({ posts }: { posts: PostView[] }) {
  return (
    <section aria-labelledby="most-read" className="flex flex-col gap-4">
      <h2 id="most-read" className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
        Najčitanije
      </h2>
      <ol className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link href={routes.post(post.slug)} className="group flex items-center gap-3">
              <span className="w-5 shrink-0 text-xl font-bold text-muted-foreground tabular-nums">{index + 1}</span>
              <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={post.cover.src} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="line-clamp-2 text-sm leading-snug font-semibold group-hover:underline">{post.title}</span>
                <span className="text-xs text-muted-foreground">{post.categoryRef.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
