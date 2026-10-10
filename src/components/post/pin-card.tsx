import Image from "next/image"
import Link from "next/link"
import { HeartIcon, LayersIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/format"
import { routes } from "@/lib/site"
import { cn } from "@/lib/utils"
import type { PostView } from "@/lib/types"

/** Pinterest masonry tile: full-bleed image at its natural ratio, title below. */
export function PinCard({
  post,
  size = "default",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: {
  post: PostView
  size?: "default" | "large"
  sizes?: string
}) {
  return (
    <Link href={routes.post(post.slug)} className="group flex flex-col gap-2 outline-none">
      <div
        className={cn(
          "relative overflow-hidden bg-muted group-focus-visible:ring-3 group-focus-visible:ring-ring",
          size === "large" ? "rounded-2xl" : "rounded-xl",
        )}
        style={{ aspectRatio: `${post.cover.width} / ${post.cover.height}` }}
      >
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-foreground/0 transition-colors group-hover:bg-foreground/20" />
        <Badge variant="secondary" className="absolute top-3 left-3 h-6 bg-background px-3 font-bold">
          {post.categoryRef.name}
        </Badge>
        {post.gallery.length > 0 && (
          <LayersIcon className="absolute top-3 right-3 size-5 text-background drop-shadow" aria-label="Galerija" />
        )}
        <span className="absolute right-3 bottom-3 flex items-center gap-1 text-sm font-semibold text-background opacity-0 drop-shadow transition-opacity group-hover:opacity-100">
          <HeartIcon className="size-4 fill-background" aria-hidden />
          {formatNumber(post.likes)}
        </span>
      </div>
      <h3 className="line-clamp-2 px-1 text-sm leading-snug font-semibold group-hover:underline">{post.title}</h3>
    </Link>
  )
}

/** Column-based masonry: preserves each image's aspect ratio. */
export function Masonry({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("columns-2 gap-2 sm:columns-3 lg:columns-4 *:mb-4 *:break-inside-avoid", className)}>
      {children}
    </div>
  )
}
