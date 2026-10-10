import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

/** Pages to show: first, last, and a window around the current page. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? ["gap" as const, page] : [page]))
}

export function Pager({ current, total, hrefFor }: { current: number; total: number; hrefFor: (page: number) => string }) {
  if (total <= 1) return null
  return (
    <Pagination>
      <PaginationContent>
        {current > 1 && (
          <PaginationItem>
            <PaginationPrevious href={hrefFor(current - 1)} text="Nazad" aria-label="Prethodna stranica" />
          </PaginationItem>
        )}
        {pageWindow(current, total).map((page, i) =>
          page === "gap" ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href={hrefFor(page)} isActive={page === current}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {current < total && (
          <PaginationItem>
            <PaginationNext href={hrefFor(current + 1)} text="Dalje" aria-label="Sljedeća stranica" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(page) && page > 0 ? page : 1
}
