# Portfolio Maker

Portfolio Maker is a Next.js app that generates a personal portfolio website from resume uploads plus manual profile edits.

## Features

- OAuth auth with GitHub and/or Google (Auth.js)
- Resume upload (`.pdf`/`.docx`) + text extraction
- AI parsing via Groq or OpenRouter into strict JSON schema
- Editable onboarding form with manual override
- Hero image upload
- 5 built-in themes
- Public personal slug route: `/u/[slug]`
- Publish flow with slug uniqueness enforcement

## Stack

- Next.js (App Router) + TypeScript
- Prisma + PostgreSQL
- Auth.js + Prisma Adapter
- Tailwind CSS
- Zod validation
- Vitest tests

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy envs and fill values:

```bash
cp .env.example .env
```

3. Run migration:

```bash
npm run prisma:migrate -- --name init
```

4. Start dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required Environment Variables

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- At least one OAuth provider pair:
  - `GITHUB_ID` + `GITHUB_SECRET`
  - `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- AI settings:
  - `AI_PROVIDER` and corresponding API key (`GROQ_API_KEY` or `OPENROUTER_API_KEY`)

## Deployment (Vercel)

1. Import repo into Vercel.
2. Add all env vars from `.env.example`.
3. For persistent uploads, set `BLOB_READ_WRITE_TOKEN`.
4. Set production database (`DATABASE_URL`) to hosted Postgres (Neon/Supabase/etc.).
5. Run migrations during deploy:

```bash
npx prisma migrate deploy
```

## Testing

```bash
npm run test
npm run lint
npm run build
```

## Manual QA Checklist

- Sign in with OAuth provider
- Upload PDF/DOCX resume
- Parse succeeds and pre-fills form
- Manual edits save correctly
- Hero image upload updates preview
- Theme selection persists
- Publish sets slug and enables public page
- Public `/u/{slug}` renders content and links
