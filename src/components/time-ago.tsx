"use client"

import { useNow } from "@/hooks/use-client-store"
import { formatDate, formatRelative } from "@/lib/format"

/**
 * Renders the absolute date on the server (prerender-safe), then switches to
 * relative time ("prije 2 sata") after hydration.
 */
export function TimeAgo({ iso, className }: { iso: string; className?: string }) {
  const now = useNow()
  return (
    <time dateTime={iso} title={formatDate(iso)} className={className}>
      {now ? formatRelative(iso, now) : formatDate(iso)}
    </time>
  )
}
