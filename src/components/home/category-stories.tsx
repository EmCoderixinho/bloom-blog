import Image from "next/image"
import Link from "next/link"
import { routes } from "@/lib/site"
import type { Category } from "@/lib/types"

/** Categories as an Instagram "stories" strip. */
export function CategoryStories({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="Teme" className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:-mx-6 sm:px-6">
      <ul className="flex w-max gap-4 py-1">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={routes.category(category.slug)} className="group flex w-20 flex-col items-center gap-1.5 outline-none">
              <span className="rounded-full bg-primary p-[3px] transition-transform group-hover:scale-105 group-focus-visible:ring-3 group-focus-visible:ring-ring">
                <span className="relative block size-[70px] overflow-hidden rounded-full border-[3px] border-background bg-muted">
                  <Image src={category.cover.src} alt="" fill sizes="70px" className="object-cover" />
                </span>
              </span>
              <span className="w-full truncate text-center text-xs font-medium">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
