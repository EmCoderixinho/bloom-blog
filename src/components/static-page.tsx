import type { Metadata } from "next"
import { Eyebrow } from "@/components/bezel"
import { Markdown } from "@/components/markdown"
import { formatDate } from "@/lib/format"
import { pageAlternates } from "@/lib/site"
import { getStaticPage, type StaticPageSlug } from "@/lib/static-pages"

export function staticPageMetadata(slug: StaticPageSlug): Metadata {
  const page = getStaticPage(slug)
  return {
    title: page.title,
    description: page.description,
    // No `openGraph` here: it would replace the root one and drop the default image.
    alternates: pageAlternates(`/${page.slug}`),
  }
}

/** Shared layout for the footer pages: eyebrow, title and a prose column like the post body. */
export function StaticPageView({ slug }: { slug: StaticPageSlug }) {
  const page = getStaticPage(slug)
  return (
    <article className="mx-auto flex w-full max-w-[680px] flex-col gap-8 px-4 pt-12 sm:px-6 sm:pt-16">
      <header className="flex flex-col items-start gap-5">
        <Eyebrow>{page.eyebrow}</Eyebrow>
        <h1 className="text-display">{page.title}</h1>
        <p className="text-sm text-muted-foreground">Posljednja izmjena: {formatDate(page.updatedAt)}</p>
      </header>
      {page.draft && (
        <p role="note" className="rounded-xl bg-muted px-5 py-4 text-sm text-body">
          <strong className="font-semibold text-foreground">Nacrt.</strong> Ovaj tekst je privremen i bit će zamijenjen konačnom verzijom.
        </p>
      )}
      <Markdown>{page.body}</Markdown>
    </article>
  )
}
