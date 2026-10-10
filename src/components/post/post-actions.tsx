"use client"

import Link from "next/link"
import { useState } from "react"
import { BookmarkIcon, CheckIcon, HeartIcon, MessageCircleIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStoredSet } from "@/hooks/use-client-store"
import { formatNumber } from "@/lib/format"
import { routes } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * The Instagram action row: like, read, share, save, plus the like count.
 * Likes and saves are remembered per browser; syncing counts to Firestore is
 * ticket B-9.
 */
export function PostActions({
  slug,
  title,
  likes,
  showReadLink = true,
}: {
  slug: string
  title: string
  likes: number
  showReadLink?: boolean
}) {
  const [liked, toggleLike] = useStoredSet("bloom:liked", slug)
  const [saved, toggleSave] = useStoredSet("bloom:saved", slug)
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = new URL(routes.post(slug), window.location.origin).toString()
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User dismissed the share sheet.
      }
      return
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="-ml-2 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-pressed={liked}
          aria-label={liked ? "Ukloni sviđanje" : "Sviđa mi se"}
          onClick={toggleLike}
        >
          <HeartIcon className={cn("size-6 transition-transform active:scale-125", liked && "fill-primary text-primary")} />
        </Button>
        {showReadLink && (
          <Button variant="ghost" size="icon" aria-label="Pročitaj članak" render={<Link href={routes.post(slug)} />} nativeButton={false}>
            <MessageCircleIcon className="size-6 -scale-x-100" />
          </Button>
        )}
        <Button variant="ghost" size="icon" aria-label="Podijeli" onClick={share}>
          {copied ? <CheckIcon className="size-6" /> : <SendIcon className="size-6" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          aria-pressed={saved}
          aria-label={saved ? "Ukloni iz sačuvanih" : "Sačuvaj"}
          onClick={toggleSave}
        >
          <BookmarkIcon className={cn("size-6", saved && "fill-foreground")} />
        </Button>
      </div>
      <p className="text-sm font-semibold">
        {formatNumber(likes + (liked ? 1 : 0))} sviđanja
        <span className="sr-only" aria-live="polite">
          {copied ? "Link kopiran" : ""}
        </span>
      </p>
    </div>
  )
}
