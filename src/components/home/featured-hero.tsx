import Image from "next/image"
import Link from "next/link"
import { AuthorAvatar } from "@/components/author-avatar"
import { Bezel, Eyebrow, PillLabel } from "@/components/bezel"
import { routes } from "@/lib/site"
import type { PostView } from "@/lib/types"

/** Editorial split for the lead story, with two compact features beneath it. */
export function FeaturedHero({ posts }: { posts: PostView[] }) {
  const [main, ...side] = posts
  if (!main) return null

  return (
    <section aria-label="Izdvojeno" className="flex flex-col gap-4">
      <Link href={routes.post(main.slug)} className="group block rounded-[2rem] outline-none focus-visible:ring-3 focus-visible:ring-ring">
        <Bezel coreClassName="grid md:min-h-[440px] md:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-4/5 overflow-hidden bg-muted sm:aspect-16/10 md:aspect-auto">
            <Image
              src={main.cover.src}
              alt={main.cover.alt}
              fill
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-spring group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-col items-start justify-center gap-5 px-5 py-7 sm:px-8 md:px-10 md:py-12">
            <Eyebrow>Izdvojeno · {main.categoryRef.name}</Eyebrow>
            <h2 className="text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-[1.04] font-extrabold tracking-[-0.045em]">
              {main.title}
            </h2>
            <p className="line-clamp-3 max-w-[40ch] text-body">{main.excerpt}</p>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <AuthorAvatar author={main.authorRef} size="sm" ring={false} />
              <span>
                {main.authorRef.name} · {main.readingMinutes} min čitanja
              </span>
            </div>
            <PillLabel className="mt-1">Pročitaj članak</PillLabel>
          </div>
        </Bezel>
      </Link>

      {side.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {side.map((post) => (
            <Link
              key={post.slug}
              href={routes.post(post.slug)}
              className="group block rounded-[2rem] outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              <Bezel coreClassName="flex items-stretch">
                <div className="relative aspect-square w-32 shrink-0 overflow-hidden bg-muted sm:w-40">
                  <Image
                    src={post.cover.src}
                    alt={post.cover.alt}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-1000 ease-spring group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-3 p-4 sm:p-6">
                  <Eyebrow>{post.categoryRef.name}</Eyebrow>
                  <h3 className="line-clamp-3 text-base leading-snug font-bold tracking-[-0.02em] sm:text-lg">{post.title}</h3>
                </div>
              </Bezel>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
