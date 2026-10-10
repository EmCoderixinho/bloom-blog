import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Author } from "@/lib/types"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

/** Avatar with an Instagram-style "story" ring in the brand red. */
export function AuthorAvatar({
  author,
  size = "default",
  ring = true,
  className,
}: {
  author: Pick<Author, "name" | "avatar">
  size?: "sm" | "default" | "lg"
  ring?: boolean
  className?: string
}) {
  return (
    <span className={cn("inline-flex shrink-0 rounded-full", ring && "bg-primary p-0.5", className)}>
      <Avatar size={size} className={cn(ring && "ring-2 ring-background")}>
        <AvatarImage src={author.avatar} alt="" />
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>
    </span>
  )
}
