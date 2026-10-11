import Image from "next/image"
import Link from "next/link"
import { HeartIcon, LayersIcon } from "lucide-react"
import { formatNumber } from "@/lib/format"
import { overflowClass } from "@/lib/grid"
import { routes } from "@/lib/site"
import { cn } from "@/lib/utils"
import type { PostView } from "@/lib/types"

/**
 * Instagram profile grid: 3 columns on mobile, 5 on desktop, portrait 3:4 tiles.
 * Edge to edge on phones; from `sm` it sits in a rounded bezel tray. Hovering a
 * tile reveals its category, title, likes and reading time.
 */
export function PostGrid({
  posts,
  balanced = false,
  priority = 0,
  className,
}: {
  posts: PostView[]
  /** Hide the trailing partial row at each breakpoint (for teaser sections, not paginated lists). */
  balanced?: boolean
  /** Number of leading tiles to load eagerly (above the fold). */
  priority?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-sm:-mx-4 sm:rounded-[2rem] sm:bg-foreground/[0.035] sm:p-1.5 sm:ring-1 sm:ring-foreground/5",
        className,
      )}
    >
      <ul className="grid grid-cols-3 gap-0.5 overflow-hidden sm:gap-1 sm:rounded-[1.625rem] lg:grid-cols-5">
        {posts.map((post, index) => (
          <li key={post.slug} className={cn("reveal", balanced && overflowClass(index, posts.length))}>
            <Link
              href={routes.post(post.slug)}
              className="group relative block aspect-3/4 overflow-hidden bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <Image
                src={post.cover.src}
                alt={post.title}
                fill
                priority={index < priority}
                sizes="(min-width: 1280px) 256px, (min-width: 1024px) 20vw, 33vw"
                className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.05]"
              />
              {post.gallery.length > 0 && (
                <LayersIcon
                  className="absolute top-2 right-2 size-4 text-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)] sm:size-5"
                  strokeWidth={1.75}
                  aria-label="Galerija"
                />
              )}
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-black/25 to-black/70 p-4 text-center text-white opacity-0 transition-opacity duration-500 ease-spring group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
              >
                <span className="flex translate-y-3.5 flex-col items-center gap-2.5 transition-transform duration-700 ease-spring group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.2em] uppercase ring-1 ring-white/20 ring-inset">
                    {post.categoryRef.name}
                  </span>
                  <span className="line-clamp-3 text-[15px] leading-tight font-bold tracking-[-0.02em] text-balance">
                    {post.title}
                  </span>
                  <span className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <HeartIcon className="size-3.5 fill-white" aria-hidden />
                      {formatNumber(post.likes)}
                    </span>
                    <span>{post.readingMinutes} min</span>
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
