import { defineConfig, devices } from "@playwright/test"

const PORT = 3100
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // The grid's scroll-driven `reveal` animation moves tiles while scrolling, so clicks never see them as stable.
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // CI builds in an earlier step. Locally, build here so the run never reuses a Firebase-backed build.
    command: isCI ? `npm run start -- -p ${PORT}` : `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 5 * 60_000,
    // Blank values beat `.env.local` (Next.js never overrides a variable that is already set),
    // so the app runs on the built-in sample data.
    env: { FIREBASE_PROJECT_ID: "", FIREBASE_CLIENT_EMAIL: "", FIREBASE_PRIVATE_KEY: "" },
  },
})
