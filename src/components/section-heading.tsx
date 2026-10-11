import { Eyebrow, PillLink } from "@/components/bezel"

export function SectionHeading({
  title,
  href,
  id,
  eyebrow,
}: {
  title: string
  href?: string
  id?: string
  eyebrow?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-3">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={id} className="text-heading-xl">
          {title}
        </h2>
      </div>
      {href && (
        <PillLink href={href} tone="light" className="shrink-0">
          Više
        </PillLink>
      )}
    </div>
  )
}
