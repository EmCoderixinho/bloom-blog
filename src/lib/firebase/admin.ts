import "server-only"

import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
// Env files store the key with literal "\n" sequences.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

export function isFirebaseConfigured() {
  return Boolean(projectId && clientEmail && privateKey)
}

function getAdminApp(): App {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.")
  }
  return getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
