/**
 * Copies the Firebase Admin credentials from a downloaded service-account
 * JSON key into .env.local, without printing the secret.
 *
 *   npm run env:from-key -- C:\path\to\service-account.json
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"

const keyPath = process.argv[2]
if (!keyPath) {
  console.error("Usage: npm run env:from-key -- <path-to-service-account.json>")
  process.exit(1)
}

let key
try {
  key = JSON.parse(readFileSync(keyPath, "utf8"))
} catch {
  // Generic message: parser errors can quote part of the file.
  console.error("Could not read that file as JSON.")
  process.exit(1)
}
if (key.type !== "service_account" || !key.private_key || !key.client_email || !key.project_id) {
  console.error("That file is not a service-account key.")
  process.exit(1)
}

const values = {
  FIREBASE_PROJECT_ID: key.project_id,
  FIREBASE_CLIENT_EMAIL: key.client_email,
  FIREBASE_PRIVATE_KEY: `"${key.private_key.replace(/\n/g, "\\n")}"`,
}

const envPath = ".env.local"
const lines = existsSync(envPath) ? readFileSync(envPath, "utf8").split(/\r?\n/) : []
const kept = lines.filter((line) => !Object.keys(values).some((name) => line.startsWith(`${name}=`)))
while (kept.length && kept.at(-1) === "") kept.pop()
const updated = [...kept, ...Object.entries(values).map(([name, value]) => `${name}=${value}`), ""]
writeFileSync(envPath, updated.join("\n"))

console.log(`Wrote FIREBASE_* for project "${key.project_id}" (${key.client_email}) to ${envPath}.`)
console.log("You can now delete the downloaded JSON key; keep it out of the repo.")
