import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SectionHeading({ title, href, id }: { title: string; href?: string; id?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 id={id} className="text-heading-xl">
        {title}
      </h2>
      {href && (
        <Button variant="secondary" nativeButton={false} render={<Link href={href} />}>
          Više
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      )}
    </div>
  )
}
