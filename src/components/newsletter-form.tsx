"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { subscribe, type NewsletterState } from "@/lib/actions/newsletter"

const initialState: NewsletterState = { status: "idle" }

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, initialState)

  if (state.status === "success") {
    return <p className="text-sm font-semibold" role="status">{state.message}</p>
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <Field data-invalid={state.status === "error" || undefined}>
        <FieldLabel htmlFor="newsletter-email" className="sr-only">
          Email adresa
        </FieldLabel>
        <div className="flex gap-2">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vas@email.com"
            aria-invalid={state.status === "error" || undefined}
            className="h-10 bg-background"
          />
          <Button type="submit" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            Prijavi se
          </Button>
        </div>
        {state.status === "error" && <FieldDescription>{state.message}</FieldDescription>}
      </Field>
    </form>
  )
}
