# Bloom

Lifestyle / beauty magazine built with Next.js 16, shadcn/ui and Firebase.
Design tokens come from the Pinterest DESIGN.md; posts are presented like Instagram posts.

## Run

```bash
npm install
npm run dev    # http://localhost:3000
```

Without Firebase credentials the site runs on the sample content in `src/lib/data/sample-data.ts`.
To use Firestore, copy `.env.example` to `.env.local` and fill in the service-account values.

## Structure

- `src/lib/data/`: data layer. `index.ts` is the cached read API (`"use cache"` + `cacheTag("posts" | "taxonomy")`); `repository.ts` picks Firestore or sample data.
- `src/components/post/`: Instagram post card, media carousel, action row, pin (masonry) card, profile grid.
- `src/app/`: routes: `/`, `/objava/[slug]`, `/kategorija/[slug]`, `/autor/[slug]`, `/pretraga`.
- `docs/TICKETS.md`: the backlog.
