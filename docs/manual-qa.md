# Manual QA - Portfolio Maker

1. Login flow
- Open `/login`
- Sign in with configured provider
- Confirm redirect to `/dashboard`

2. Resume ingestion
- Open `/dashboard/onboarding`
- Upload valid PDF/DOCX
- Confirm upload success and AI parse success
- Confirm data appears in form fields

3. Manual edits
- Edit name/headline/bio/skills and JSON sections
- Save profile
- Confirm no validation errors

4. Hero image
- Upload image under 5MB
- Confirm preview appears

5. Theme selection
- Open `/dashboard/theme`
- Choose each of 5 themes
- Confirm success status

6. Publish
- Open `/dashboard/publish`
- Set slug and publish
- Confirm URL shown

7. Public page
- Visit `/u/{slug}`
- Confirm hero, sections, and links render
- Confirm metadata appears in page source
