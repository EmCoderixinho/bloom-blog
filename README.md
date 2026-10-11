# Bloom

Lifestyle / beauty magazine built with Next.js 16, shadcn/ui and Firebase.
Design tokens come from the Pinterest DESIGN.md; posts are presented like Instagram posts.

## Run

```bash
npm install
npm run dev    # http://localhost:3000
```

Without Firebase credentials the site runs on the sample content in `src/lib/data/sample-data.ts`.
To use Firestore, copy `.env.example` to `.env.local` and fill in the service-account values
(or run `npm run env:from-key -- <path-to-service-account.json>`).

## Checks

```bash
npm run typecheck
npm run lint
npm test           # Vitest unit tests (src/**/*.test.ts)
npm run test:e2e   # Playwright smoke test at 390px and 1440px
```

`test:e2e` runs `next build` and `next start` on port 3100 with the Firebase variables blanked, so it always uses the sample content, even with `.env.local` present. It leaves a sample-data build in `.next`, so run `npm run build` again before using `npm start` locally. Install the browser once with `npx playwright install chromium`.

CI (`.github/workflows/ci.yml`) runs all of these on pushes and PRs to `master`, without Firebase secrets.

## Deploy (Netlify, free)

The site is hosted on Netlify's free plan, which allows commercial use, at https://cute-alfajores-327dc1.netlify.app. Netlify detects Next.js and runs it on Node.js through its OpenNext adapter: Cache Components, `revalidateTag` and `next/image` (through Netlify Image CDN) all work without extra config. The free plan has 300 credits a month. If they run out, the site pauses until the next month; nothing is ever charged without a card.

Cloudflare Workers was tried first and ruled out: `firebase-admin` can't load there (Workers forbid runtime code generation), and partial prerendering hits an open OpenNext bug.

**Normal deploys go through Git.** The Netlify project is connected to this GitHub repo: every push to `master` builds and deploys to production, and other branches and PRs get deploy previews. The build runs on Netlify's servers, where `.env.local` doesn't exist.

One-time setup, in Netlify → Project configuration → Environment variables (or with `npx netlify env:set`):

| Variable | Value | Scopes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://cute-alfajores-327dc1.netlify.app` (later the custom domain) | Builds, Functions |
| `FIREBASE_PROJECT_ID` | from `.env.local` | Builds, Functions |
| `FIREBASE_CLIENT_EMAIL` | from `.env.local` | Builds, Functions |
| `FIREBASE_PRIVATE_KEY` | from `.env.local`, without the surrounding quotes (keep the `\n` sequences) | Builds, Functions, marked as secret |

Local commands (log in once with `npx netlify login` and link with `npx netlify link`):

```bash
npm run preview   # production build served locally with Netlify's runtime
npm run deploy    # rebuild and redeploy the connected branch on Netlify (uploads nothing local)
```

**Never upload a local build** (`netlify deploy` with or without `--build`, `--no-build`, `--dir`) from a machine that has `.env.local`. `next build` copies `.env*` files, including `.env.local` with the private key, into the server function bundle, so a local upload would ship the key. `npm run preview` builds into `.netlify` locally, which is fine as long as that output is never uploaded.

## Structure

- `src/lib/data/`: data layer. `index.ts` is the cached read API (`"use cache"` + `cacheTag("posts" | "taxonomy")`); `repository.ts` picks Firestore or sample data.
- `src/components/post/`: profile grid (`post-grid`), media carousel (`post-media`), action row (`post-actions`).
- `src/components/home/`: featured hero, category stories, most-read list.
- `src/app/`: routes: `/`, `/objava/[slug]`, `/kategorija/[slug]`, `/autor/[slug]`, `/pretraga`, the footer pages (`/o-nama`, `/kontakt`, `/marketing`, `/uslovi-koristenja`, `/privatnost`), plus `sitemap.xml`, `robots.txt`, `feed.xml` and generated Open Graph images.
- `src/lib/static-pages.ts`: copy for the footer pages (draft placeholders marked `draft: true`).
- `e2e/`: Playwright smoke test. Unit tests sit next to the code they test.
- `netlify.toml`: Netlify build settings.
- `docs/TICKETS.md`: the backlog.
