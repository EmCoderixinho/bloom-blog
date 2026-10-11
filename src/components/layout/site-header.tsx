import Link from "next/link"
import { SearchIcon } from "lucide-react"
import { PillLabel } from "@/components/bezel"
import { getCategories } from "@/lib/data"
import { routes } from "@/lib/site"
import { MobileNav } from "./mobile-nav"
import { Wordmark } from "./wordmark"

/** Floating glass pill, detached from the top edge. */
export async function SiteHeader() {
  const categories = await getCategories()
  const top = categories.filter((c) => !c.parent)

  return (
    <header className="sticky top-3 z-40 mx-auto mt-3 w-full max-w-7xl px-4 sm:px-6 lg:w-max">
      <div className="flex h-14 items-center gap-1 rounded-full bg-card/75 py-1.5 pr-1.5 pl-2 shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_12px_32px_-16px_rgb(0_0_0/0.18)] backdrop-blur-xl lg:pl-6">
        <MobileNav categories={categories} />
        <Wordmark className="max-lg:mx-auto lg:mr-5" />

        <nav aria-label="Glavna navigacija" className="hidden items-center lg:flex">
          {top.map((category) => (
            <Link
              key={category.slug}
              href={routes.category(category.slug)}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/70 transition-colors duration-300 ease-spring hover:bg-foreground/5 hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <Link
          href={routes.search()}
          aria-label="Pretraga"
          className="grid size-10 shrink-0 place-items-center rounded-full text-foreground/70 transition-colors duration-300 ease-spring hover:bg-foreground/5 hover:text-foreground lg:ml-2"
        >
          <SearchIcon className="size-5" strokeWidth={1.5} />
        </Link>
        <Link href="#newsletter" className="group ml-1 rounded-full max-sm:hidden">
          <PillLabel>Pretplati se</PillLabel>
        </Link>
      </div>
    </header>
  )
}
