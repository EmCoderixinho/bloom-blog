import Form from "next/form"
import { SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

export function SearchForm({ defaultValue, className }: { defaultValue?: string; className?: string }) {
  return (
    <Form action="/pretraga" role="search" className={cn("w-full", className)}>
      <InputGroup className="h-12 rounded-full border-transparent bg-muted has-[input:focus-visible]:bg-background">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Pretraži ljepotu, modu, recepte…"
          aria-label="Pretraga"
        />
      </InputGroup>
    </Form>
  )
}
