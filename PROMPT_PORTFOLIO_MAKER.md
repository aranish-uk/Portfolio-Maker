# Prompt: Build Portfolio Maker (Auth + Resume AI + Themes + Slugs + Vercel)

You are a senior full-stack engineer. Build a production-ready MVP called **Portfolio Maker**.

## Goal
Create a web app where users:
1. Sign in (Google or GitHub, choose the easiest free path).
2. Upload their resume.
3. Fill/edit profile form fields.
4. Have resume data parsed by AI into strict JSON.
5. Choose one of at least 5 prebuilt portfolio themes.
6. Upload a hero image.
7. Add external links (GitHub, LinkedIn, website, etc.).
8. Publish to a unique personal slug URL.
9. Deploy to Vercel after tests pass.

## Tech Constraints
- Keep the stack free-tier friendly.
- Use **Next.js (App Router) + TypeScript**.
- Use **Prisma + SQLite (dev)** and support Vercel-compatible DB switch (Postgres) via env.
- Use **NextAuth/Auth.js** with Google or GitHub OAuth.
- Use **Zod** for all runtime validation.
- Use **Tailwind CSS** for fast theming.
- File uploads should work in local dev and Vercel (prefer Vercel Blob or a free equivalent).
- AI provider: **Groq or OpenRouter** (whichever is simpler with good free tier).

## Functional Requirements

### Authentication
- Implement OAuth login using one provider minimum (Google or GitHub).
- Store user account and portfolio ownership.
- Protect dashboard routes.

### Resume Upload + AI Parsing
- Accept `.pdf` and `.docx`.
- Extract text from uploaded resume.
- Send extracted text to selected LLM provider with a strict prompt requesting JSON only.
- Validate LLM output against a Zod schema. Retry once with repair prompt on invalid JSON.
- Save parsed result to DB and prefill form.

### Profile Form
- Editable fields:
  - name
  - headline
  - bio/about
  - skills (list)
  - experience (array)
  - education (array)
  - projects (array)
  - contact email
  - location
  - external links (label + url)
- Manual edits should override AI parsed values.

### Hero Image Upload
- User can upload/replace hero image.
- Validate file type and size.
- Persist URL and render in selected theme.

### Themes
- Provide at least **5 distinct prebuilt themes**.
- Theme selection stored per user.
- Live preview in dashboard.
- Public page renders chosen theme with same data.

### Slug + Public Portfolio
- Generate default slug from name, allow user edits.
- Enforce global uniqueness.
- Public route: `/u/{slug}`.
- Add simple SEO metadata and social preview tags.

## Non-Functional Requirements
- Clean architecture and reusable components.
- Strong input validation and clear error states.
- Responsive design (mobile + desktop).
- No secrets in client bundle.
- Basic rate limiting for AI parse endpoint.

## Suggested Data Model
- `User`
- `Portfolio`
- `Theme`
- `Link`
- `Experience`
- `Education`
- `Project`
- `ResumeUpload`
- `ParsedResume`

Include relations so each user owns one portfolio (or one active portfolio for MVP).

## AI Parsing Contract
Create a strict JSON schema and force model output to match:
- `name: string`
- `headline: string`
- `summary: string`
- `skills: string[]`
- `experience: { company: string; role: string; start: string; end: string; highlights: string[] }[]`
- `education: { school: string; degree: string; start: string; end: string }[]`
- `projects: { name: string; description: string; url?: string; highlights: string[] }[]`
- `links: { label: string; url: string }[]`

If model returns invalid JSON:
1. attempt structured repair once,
2. if still invalid, return actionable error and keep raw output for debugging.

## UX Flow
1. User logs in.
2. Lands on onboarding wizard.
3. Uploads resume.
4. Sees AI-prefilled form.
5. Edits data + uploads hero image + adds links.
6. Selects a theme from 5+ options.
7. Sets slug and publishes.
8. Gets public URL and copy/share actions.

## Required Pages
- `/` marketing/landing
- `/login`
- `/dashboard` (overview)
- `/dashboard/onboarding`
- `/dashboard/theme`
- `/dashboard/publish`
- `/u/[slug]` public portfolio

## API Endpoints
- `POST /api/resume/upload`
- `POST /api/resume/parse`
- `PUT /api/portfolio`
- `PUT /api/portfolio/theme`
- `PUT /api/portfolio/slug`
- `POST /api/hero/upload`

## Testing + Verification
- Add unit tests for:
  - schema validation
  - slug normalization + uniqueness helper
  - resume parser JSON validation flow
- Add integration test for onboarding happy path.
- Provide a manual QA checklist for full publish flow.

## Deployment
- Deploy to Vercel.
- Configure env vars for OAuth, DB, storage, AI provider.
- Run migration on deploy.
- Verify production URL:
  - login works
  - resume parse works
  - theme selection persists
  - slug page is publicly accessible

## Deliverables
1. Complete source code.
2. `README.md` with setup, env vars, and deploy steps.
3. `.env.example`.
4. Prisma schema and migrations.
5. Test suite + how to run.
6. Production deployment URL.

## Execution Rules
- Build incrementally with small commits by feature.
- After each major feature, run tests/lint and fix failures.
- Do not skip validation, auth guard, or error handling.
- If tradeoffs are required, choose simplest free reliable option and document rationale in README.

