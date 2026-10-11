/**
 * Writes the built-in sample content to Firestore.
 *
 *   npm run seed            # skips documents that already exist
 *   npm run seed -- --force --project=<id> # overwrites them
 */
import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore, type WriteBatch } from "firebase-admin/firestore"
import { sampleAuthors, sampleCategories, samplePosts } from "../src/lib/data/sample-data"

const { FIREBASE_PROJECT_ID: projectId, FIREBASE_CLIENT_EMAIL: clientEmail } = process.env
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_* variables. Run `npm run env:from-key -- <service-account.json>` first.")
  process.exit(1)
}

const force = process.argv.includes("--force")
// Overwriting is destructive, so require naming the target project explicitly.
if (force && !process.argv.includes(`--project=${projectId}`)) {
  console.error(`--force overwrites live documents. Re-run with --project=${projectId} to confirm the target.`)
  process.exit(1)
}
const db = getFirestore(initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }))

async function seed<T extends { slug: string }>(collection: string, docs: T[]) {
  const refs = docs.map((doc) => db.collection(collection).doc(doc.slug))
  const existing = force ? [] : (await db.getAll(...refs)).filter((snap) => snap.exists).map((snap) => snap.id)

  let batch: WriteBatch = db.batch()
  let written = 0
  for (const [i, { slug, ...data }] of docs.entries()) {
    if (existing.includes(slug)) continue
    batch.set(refs[i], data)
    // Firestore batches are capped at 500 writes.
    if (++written % 500 === 0) {
      await batch.commit()
      batch = db.batch()
    }
  }
  await batch.commit()
  console.log(`${collection}: ${written} written, ${existing.length} skipped (already exist)`)
}

async function main() {
  await seed("categories", sampleCategories)
  await seed("authors", sampleAuthors)
  await seed("posts", samplePosts)
  console.log(`Done. Seeded project ${projectId}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
