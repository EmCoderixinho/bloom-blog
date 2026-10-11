import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("text-xl font-extrabold tracking-[-0.04em]", className)}>
      {siteConfig.name.toLowerCase()}
      <span className="text-primary" aria-hidden>
        .
      </span>
      <span className="sr-only">: naslovna</span>
    </Link>
  )
}
