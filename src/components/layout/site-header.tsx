import Link from "next/link"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/data"
import { routes } from "@/lib/site"
import { MobileNav } from "./mobile-nav"
import { SearchForm } from "./search-form"
import { Wordmark } from "./wordmark"

export async function SiteHeader() {
  const categories = await getCategories()
  const top = categories.filter((c) => !c.parent)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <MobileNav categories={categories} />
        <Wordmark className="max-lg:mx-auto lg:mr-4" />

        <nav aria-label="Glavna navigacija" className="hidden items-center gap-1 lg:flex">
          {top.map((category) => (
            <Button key={category.slug} variant="ghost" nativeButton={false} render={<Link href={routes.category(category.slug)} />}>
              {category.name}
            </Button>
          ))}
        </nav>

        <SearchForm className="ml-auto hidden max-w-sm md:block" />

        <Button
          variant="ghost"
          size="icon"
          aria-label="Pretraga"
          className="md:hidden"
          nativeButton={false}
          render={<Link href={routes.search()} />}
        >
          <SearchIcon className="size-5" />
        </Button>
        <Button className="max-sm:hidden" nativeButton={false} render={<Link href="#newsletter" />}>
          Pretplati se
        </Button>
      </div>
    </header>
  )
}
