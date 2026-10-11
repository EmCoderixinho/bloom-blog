"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Horizontal strip that swipes on touch and gets arrow buttons on pointer
 * devices, where a mouse wheel can't scroll sideways.
 */
export function StoriesScroller({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: true })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () =>
      setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 })
    update()
    el.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [])

  const scroll = (direction: 1 | -1) => {
    const el = ref.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <nav aria-label={label} className="group/stories relative">
      <div
        ref={ref}
        className={cn(
          "-mx-4 overflow-x-auto px-4 scrollbar-none sm:-mx-6 sm:px-6",
          // Fade only the edges that have more stories hidden behind them.
          !edges.start && "mask-l-from-[calc(100%-1.5rem)]",
          !edges.end && "mask-r-from-[calc(100%-1.5rem)]",
        )}
      >
        {children}
      </div>
      <ArrowButton side="left" hidden={edges.start} onClick={() => scroll(-1)} />
      <ArrowButton side="right" hidden={edges.end} onClick={() => scroll(1)} />
    </nav>
  )
}

function ArrowButton({ side, hidden, onClick }: { side: "left" | "right"; hidden: boolean; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeftIcon : ChevronRightIcon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Prethodne teme" : "Sljedeće teme"}
      disabled={hidden}
      className={cn(
        "absolute top-[42px] grid size-9 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_8px_20px_-8px_rgb(0_0_0/0.25)] backdrop-blur transition-[opacity,transform] duration-300 ease-spring hover:scale-105 active:scale-95 pointer-coarse:hidden",
        side === "left" ? "-left-2" : "-right-2",
        hidden && "pointer-events-none scale-90 opacity-0",
      )}
    >
      <Icon className="size-5" strokeWidth={1.5} aria-hidden />
    </button>
  )
}
