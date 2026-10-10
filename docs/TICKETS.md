# Bloom — tickets

Lifestyle / beauty magazine blog for the BA market (references: ljepotaizdravlje.ba, bonjour.ba).

**Stack:** Next.js 16 (App Router, RSC) · TypeScript · Tailwind v4 · shadcn/ui (base-nova) · Firebase (Firestore, Storage, Auth, Admin SDK) · hosting on Firebase App Hosting (or Vercel).
**Design:** Pinterest DESIGN.md tokens (cream chrome, #e60023 single accent, 16/32px radii, Inter as the Pin Sans substitute). Posts are styled like Instagram posts.
**UI language:** Bosnian.

Status: `[x]` done · `[~]` in progress · `[ ]` todo

---

## Epic A: Foundation

- [x] **A-1 Scaffold**: Next.js 16 + TS + Tailwind v4 + ESLint, git repo.
  _AC:_ `npm run dev` and `npm run build` succeed.
- [x] **A-2 shadcn + design tokens**: init shadcn and map the Pinterest tokens onto shadcn CSS variables (primary = #e60023, secondary = #e5e5e0, muted = #f6f6f3, radius 16px), plus Inter.
  _AC:_ Button, Badge, Input, etc. render in Pinterest style without per-use overrides.
- [x] **A-3 Data model + types**: `Category` (with optional parent), `Author`, `Post` (slug, title, excerpt, markdown body, cover + gallery images with aspect ratio, category, tags, author, status, publishedAt, featured, counters for likes/views).
- [x] **A-4 Data layer**: `lib/data` repository that reads Firestore through the Admin SDK when credentials exist and otherwise falls back to built-in sample data, so the app runs with zero config.
  _AC:_ No page imports Firestore directly.
- [ ] **A-5 Firebase project wiring**: create the project, add `.env.local`, Firestore indexes, security rules (public read for published posts only, writes for admins only), Storage rules, and a `npm run seed` script that pushes the sample data to Firestore.

## Epic B: Public site

- [x] **B-1 App shell**: sticky 64px header (wordmark, category nav, search, red "Pretplati se" CTA), mobile Sheet drawer, 4-column footer that collapses on mobile.
- [x] **B-2 Instagram post card**: header (author avatar with story ring, name, category), 4:5 media with a gallery carousel and dot indicators, action row (like, comment, share, save), like count, caption with bold author and excerpt, "prije 2 sata" relative time.
- [x] **B-3 Pin card**: Pinterest masonry tile (full-bleed image at its natural ratio, overlay category pill, title below) for dense grids.
- [x] **B-4 Homepage**: category "stories" row, featured hero, "Najnovije" Instagram feed, per-category sections ("Više" link), "Najčitanije" masonry.
- [x] **B-5 Post page**: Instagram-style layout with the gallery carousel on the left and a sticky meta/actions column on the right on desktop; the full article in markdown below; tags; related posts; `generateMetadata` + OG tags + JSON-LD `Article`.
- [x] **B-6 Category page**: title, subcategory filter chips (ToggleGroup), masonry grid, pagination.
- [x] **B-7 Author page**: Instagram profile layout (avatar, post count, bio, 3-column square grid).
- [~] **B-8 Search**: `/pretraga?q=` is done (diacritic-insensitive match over the latest 200 posts). Todo: a real index (Algolia/Typesense) once content grows.
- [ ] **B-9 Likes, saves, views**: optimistic like/save stored in localStorage, increments through a server action → Firestore `FieldValue.increment`, rate-limited; view counter feeds "Najčitanije".
- [~] **B-10 Newsletter**: form + server action → Firestore `subscribers` are done. Todo: double opt-in email, rate limiting.
- [ ] **B-11 SEO & feeds**: `sitemap.ts`, `robots.ts`, RSS `/feed.xml`, dynamic OG images.
- [ ] **B-12 Static pages**: O nama, Kontakt, Marketing, Uslovi korištenja, Privatnost.

## Epic C: Admin / CMS

- [ ] **C-1 Auth**: Firebase Auth (Google + email), `admin`/`editor` custom claims, session cookie, `/admin` guarded in a layout and in every server action.
- [ ] **C-2 Post list**: table with status filter, search, edit/delete.
- [ ] **C-3 Post editor**: title → slug, category, tags, excerpt, markdown body with preview, cover + gallery upload to Storage (client-side resize, aspect detection), draft/published/scheduled, featured toggle. On save, `revalidateTag` for the affected pages.
- [ ] **C-4 Categories & authors management.**

## Epic D: Quality & ops

- [ ] **D-1 Tests**: Vitest for the data layer and utilities, Playwright smoke (home → category → post).
- [ ] **D-2 CI**: GitHub Actions running lint, typecheck, test, build.
- [ ] **D-3 Deploy**: Firebase App Hosting, env secrets, custom domain.
- [ ] **D-4 Analytics & consent**: GA4/Plausible plus a cookie banner.
- [ ] **D-5 Perf pass**: image sizes, LCP on the hero, bundle check.
