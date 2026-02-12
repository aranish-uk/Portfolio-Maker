import { portfolioUpdateSchema, type ParsedResumeSchema } from "./schemas";

export function buildPortfolioPayloadFromResume(parsed: ParsedResumeSchema) {
  return portfolioUpdateSchema.parse({
    displayName: parsed.name,
    headline: parsed.headline,
    bio: parsed.summary,
    skills: parsed.skills,
    links: parsed.links,
    experiences: parsed.experience,
    educations: parsed.education,
    projects: parsed.projects,
  });
}
