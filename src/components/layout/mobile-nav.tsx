"use client"

import Link from "next/link"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { routes } from "@/lib/site"
import type { Category } from "@/lib/types"
import { SearchForm } from "./search-form"

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)
  const top = categories.filter((c) => !c.parent)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Otvori meni" className="lg:hidden" />}>
        <MenuIcon className="size-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Meni</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-8">
          <SearchForm />
          <nav aria-label="Kategorije" className="flex flex-col gap-5">
            {top.map((category, index) => (
              <div key={category.slug} className="flex flex-col gap-2">
                {index > 0 && <Separator className="mb-3" />}
                <Link href={routes.category(category.slug)} onClick={close} className="text-lg font-bold">
                  {category.name}
                </Link>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((c) => c.parent === category.slug)
                    .map((child) => (
                      <Button
                        key={child.slug}
                        variant="secondary"
                        size="sm"
                        className="rounded-full"
                        nativeButton={false}
                        render={<Link href={routes.category(child.slug)} onClick={close} />}
                      >
                        {child.name}
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
