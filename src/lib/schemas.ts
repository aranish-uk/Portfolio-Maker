import { z } from "zod";

export const linkSchema = z.object({
  label: z.string().min(1).max(50),
  url: z.string().url(),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  highlights: z.array(z.string().min(1)).default([]),
});

export const educationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url().optional(),
  highlights: z.array(z.string().min(1)).default([]),
});

export const parsedResumeSchema = z.object({
  name: z.string().default(""),
  headline: z.string().default(""),
  summary: z.string().default(""),
  skills: z.array(z.string().min(1)).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  links: z.array(linkSchema).default([]),
});
export type ParsedResumeSchema = z.infer<typeof parsedResumeSchema>;

export const portfolioUpdateSchema = z.object({
  displayName: z.string().max(100).optional(),
  headline: z.string().max(160).optional(),
  bio: z.string().max(3000).optional(),
  contactEmail: z.string().email().optional(),
  location: z.string().max(120).optional(),
  skills: z.array(z.string().min(1)).max(50).optional(),
  links: z.array(linkSchema).max(20).optional(),
  experiences: z.array(experienceSchema).max(20).optional(),
  educations: z.array(educationSchema).max(20).optional(),
  projects: z.array(projectSchema).max(20).optional(),
});

export const slugSchema = z.object({
  slug: z.string().min(2).max(60),
});

export const themeSchema = z.object({
  theme: z.enum(["CLASSIC", "MINIMAL", "BOLD", "SUNSET", "OCEAN"]),
});
