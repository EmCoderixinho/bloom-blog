import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AuthorAvatar } from "@/components/author-avatar"
import { routes } from "@/lib/site"
import type { PostView } from "@/lib/types"

/** One large feature pin with an overlaid caption card, plus two side features. */
export function FeaturedHero({ posts }: { posts: PostView[] }) {
  const [main, ...side] = posts
  if (!main) return null

  return (
    <section aria-label="Izdvojeno" className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Link href={routes.post(main.slug)} className="group relative block aspect-4/5 overflow-hidden rounded-2xl bg-muted sm:aspect-16/10 lg:aspect-auto lg:min-h-[520px]">
        <Image
          src={main.cover.src}
          alt={main.cover.alt}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-3 bottom-3 flex flex-col gap-3 rounded-xl bg-background p-5 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:p-6">
          <Badge variant="secondary" className="h-6 px-3 font-bold">{main.categoryRef.name}</Badge>
          <h2 className="text-heading-xl group-hover:underline">{main.title}</h2>
          <p className="line-clamp-2 text-sm text-body max-sm:hidden">{main.excerpt}</p>
          <div className="flex items-center gap-2 text-sm">
            <AuthorAvatar author={main.authorRef} size="sm" ring={false} />
            <span className="font-semibold">{main.authorRef.name}</span>
          </div>
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {side.map((post) => (
          <Link key={post.slug} href={routes.post(post.slug)} className="group flex flex-col gap-3">
            <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-muted">
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <Badge variant="secondary" className="absolute top-3 left-3 h-6 bg-background px-3 font-bold">
                {post.categoryRef.name}
              </Badge>
            </div>
            <h3 className="text-lg leading-snug font-semibold group-hover:underline">{post.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
