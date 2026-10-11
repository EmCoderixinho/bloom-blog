import Image from "next/image"
import Link from "next/link"
import { Bezel } from "@/components/bezel"
import { SectionHeading } from "@/components/section-heading"
import { routes } from "@/lib/site"
import type { PostView } from "@/lib/types"

export function MostRead({ posts }: { posts: PostView[] }) {
  return (
    <section aria-labelledby="most-read" className="flex flex-col gap-6">
      <SectionHeading id="most-read" eyebrow="Ove sedmice" title="Najčitanije" />
      <Bezel>
        <ol className="grid divide-foreground/5 max-lg:divide-y lg:grid-cols-5 lg:divide-x">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <Link
                href={routes.post(post.slug)}
                className="group flex h-full items-center gap-4 p-4 outline-none focus-visible:bg-foreground/5 lg:flex-col lg:items-start lg:p-5"
              >
                <span className="w-5 shrink-0 text-xl font-extrabold text-muted-foreground tabular-nums lg:hidden">{index + 1}</span>
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-muted lg:aspect-3/4 lg:size-auto lg:w-full">
                  <Image
                    src={post.cover.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 220px, 64px"
                    className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.05]"
                  />
                  <span className="absolute top-2 left-2 grid size-7 place-items-center rounded-full bg-card/85 text-xs font-bold tabular-nums backdrop-blur max-lg:hidden">
                    {index + 1}
                  </span>
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {post.categoryRef.name}
                  </span>
                  <span className="line-clamp-2 text-sm leading-snug font-bold tracking-[-0.01em] group-hover:underline">
                    {post.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Bezel>
    </section>
  )
}
