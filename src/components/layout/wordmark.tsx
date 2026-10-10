import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("text-2xl font-bold tracking-tight text-primary", className)}>
      {siteConfig.name}
      <span className="sr-only">: naslovna</span>
    </Link>
  )
}
