"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { ImageAsset } from "@/lib/types"

function Frame({ href, aspectRatio, children }: { href?: string; aspectRatio: string; children: React.ReactNode }) {
  return href ? (
    <Link href={href} tabIndex={-1} className="relative block" style={{ aspectRatio }}>
      {children}
    </Link>
  ) : (
    <div className="relative" style={{ aspectRatio }}>
      {children}
    </div>
  )
}

/**
 * Instagram-style media: a single image, or a swipeable carousel with a
 * "1/3" counter and dot indicators when the post has a gallery.
 */
export function PostMedia({
  images,
  sizes,
  priority = false,
  href,
  className,
}: {
  images: ImageAsset[]
  sizes: string
  priority?: boolean
  /** Makes each slide a link (kept off the carousel controls to avoid nesting buttons in links). */
  href?: string
  className?: string
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  const [first] = images
  const aspectRatio = `${first.width} / ${first.height}`

  if (images.length === 1) {
    return (
      <div className={cn("overflow-hidden bg-muted", className)}>
        <Frame href={href} aspectRatio={aspectRatio}>
          <Image src={first.src} alt={first.alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </Frame>
      </div>
    )
  }

  return (
    <Carousel setApi={setApi} className={cn("group/media overflow-hidden bg-muted", className)} opts={{ loop: false }}>
      <CarouselContent className="ml-0">
        {images.map((image, index) => (
          <CarouselItem key={image.src} className="pl-0">
            <Frame href={href} aspectRatio={aspectRatio}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={sizes}
                priority={priority && index === 0}
                className="object-cover"
              />
            </Frame>
          </CarouselItem>
        ))}
      </CarouselContent>

      <span className="absolute top-3 right-3 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-semibold text-background tabular-nums">
        {current + 1}/{images.length}
      </span>

      <CarouselPrevious
        variant="secondary"
        className="left-3 opacity-0 transition-opacity group-hover/media:opacity-100 disabled:invisible"
      />
      <CarouselNext
        variant="secondary"
        className="right-3 opacity-0 transition-opacity group-hover/media:opacity-100 disabled:invisible"
      />

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1" aria-hidden>
        {images.map((image, index) => (
          <span
            key={image.src}
            className={cn("size-1.5 rounded-full bg-background/60 transition-colors", index === current && "bg-background")}
          />
        ))}
      </div>
    </Carousel>
  )
}
