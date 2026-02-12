# Requirements

## Validated
- User can authenticate with Google or GitHub.
- User can upload resume file.
- System sends resume content to Groq or OpenRouter.
- LLM response is parsed/validated as strict JSON schema.
- User can fill/edit profile form data.
- User can upload hero image.
- User can add external links (GitHub and others).
- User can choose from at least 5 prebuilt themes.
- User gets a personal slug-based portfolio URL.
- Project is tested and deployed to Vercel.

## Active Assumptions
- Free-tier friendly stack is required.
- Single-tenant app behavior per authenticated user account.
- Slug uniqueness enforced at write time.

## Out of Scope (initial)
- Custom drag-and-drop page builders.
- Multi-page CMS workflows beyond portfolio profile.
- Paid AI providers only.

