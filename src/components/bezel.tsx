import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * "Double bezel": a faint tray (outer shell) holding a raised white plate
 * (inner core) with a concentric, slightly smaller radius.
 */
export function Bezel({
  children,
  className,
  coreClassName,
}: {
  children: React.ReactNode
  className?: string
  coreClassName?: string
}) {
  return (
    <div className={cn("rounded-[2rem] bg-foreground/[0.035] p-1.5 ring-1 ring-foreground/5", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-[1.625rem] bg-card shadow-[inset_0_1px_1px_rgb(255_255_255/0.6),0_24px_48px_-32px_rgb(0_0_0/0.25)]",
          coreClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

/** Tiny pill label set above a heading. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-max items-center rounded-full bg-foreground/5 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-foreground/80 uppercase ring-1 ring-foreground/5 ring-inset",
        className,
      )}
    >
      {children}
    </span>
  )
}

type PillTone = "dark" | "light"

const pillTones: Record<PillTone, { pill: string; bubble: string }> = {
  dark: { pill: "bg-foreground text-background", bubble: "bg-background/15" },
  light: { pill: "bg-card text-foreground ring-1 ring-foreground/5", bubble: "bg-foreground/5" },
}

/** Pill CTA body: label plus an arrow nested in its own circle. Use inside an interactive `group`. */
export function PillLabel({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode
  tone?: PillTone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full py-1.5 pr-1.5 pl-5 text-sm font-semibold whitespace-nowrap transition-transform duration-300 ease-spring group-active:scale-[0.98]",
        pillTones[tone].pill,
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "grid size-8 place-items-center rounded-full transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
          pillTones[tone].bubble,
        )}
      >
        <ArrowUpRightIcon className="size-4" strokeWidth={1.5} aria-hidden />
      </span>
    </span>
  )
}

export function PillLink({
  href,
  children,
  tone,
  className,
}: {
  href: string
  children: React.ReactNode
  tone?: PillTone
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring", className)}
    >
      <PillLabel tone={tone}>{children}</PillLabel>
    </Link>
  )
}
