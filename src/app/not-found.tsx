import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center">
      <p className="text-sm font-bold text-primary">404</p>
      <h1 className="text-display">Stranica nije pronađena</h1>
      <p className="text-body">Možda je članak premješten ili link nije ispravan.</p>
      <Button size="lg" nativeButton={false} render={<Link href="/" />}>
        Nazad na naslovnu
      </Button>
    </div>
  )
}
