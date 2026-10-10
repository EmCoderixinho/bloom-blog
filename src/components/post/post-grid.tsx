import Image from "next/image"
import Link from "next/link"
import { HeartIcon, LayersIcon } from "lucide-react"
import { formatNumber } from "@/lib/format"
import { routes } from "@/lib/site"
import type { PostView } from "@/lib/types"

/** Instagram profile grid: square tiles with a likes overlay on hover. */
export function PostGrid({ posts }: { posts: PostView[] }) {
  return (
    <ul className="grid grid-cols-3 gap-1 sm:gap-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={routes.post(post.slug)}
            className="group relative block aspect-square overflow-hidden rounded-md bg-muted sm:rounded-xl"
          >
            <Image src={post.cover.src} alt={post.title} fill sizes="(min-width: 1024px) 300px, 33vw" className="object-cover" />
            {post.gallery.length > 0 && (
              <LayersIcon className="absolute top-2 right-2 size-5 text-background drop-shadow" aria-hidden />
            )}
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-foreground/50 p-3 text-center text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="flex items-center gap-1.5 font-bold">
                <HeartIcon className="size-5 fill-background" aria-hidden />
                {formatNumber(post.likes)}
              </span>
              <span className="line-clamp-3 text-sm font-semibold max-sm:hidden">{post.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
