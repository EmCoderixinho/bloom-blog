"use server"

import { FieldValue } from "firebase-admin/firestore"
import { getAdminDb, isFirebaseConfigured } from "@/lib/firebase/admin"

// gRPC status code returned by Firestore when the document already exists.
const ALREADY_EXISTS = 6

export type NewsletterState = { status: "idle" | "success" | "error"; message?: string }

// No "/" so the address is always a valid single Firestore document id.
const EMAIL = /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/

export async function subscribe(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (!EMAIL.test(email) || email.length > 254) {
    return { status: "error", message: "Unesite ispravnu email adresu." }
  }

  if (!isFirebaseConfigured()) {
    // Local development without Firebase: accept the signup without storing it.
    console.info(`[newsletter] Firebase not configured, skipping store for ${email}`)
    return { status: "success", message: "Hvala! Uskoro vam stiže prvi newsletter." }
  }

  try {
    // The email is the document id. `create` fails if it exists, so a repeat
    // signup never resets an existing subscriber's `confirmed` flag.
    await getAdminDb()
      .collection("subscribers")
      .doc(email)
      .create({ email, createdAt: FieldValue.serverTimestamp(), confirmed: false })
    return { status: "success", message: "Hvala! Uskoro vam stiže prvi newsletter." }
  } catch (error) {
    if ((error as { code?: number }).code === ALREADY_EXISTS) {
      return { status: "success", message: "Hvala! Uskoro vam stiže prvi newsletter." }
    }
    console.error("[newsletter] subscribe failed", error)
    return { status: "error", message: "Nešto nije u redu. Pokušajte ponovo." }
  }
}
