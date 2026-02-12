import { describe, expect, it } from "vitest";
import { parsedResumeSchema } from "@/lib/schemas";

describe("parsedResumeSchema", () => {
  it("accepts valid parsed resume payload", () => {
    const result = parsedResumeSchema.safeParse({
      name: "Jane",
      headline: "Engineer",
      summary: "Builds products",
      skills: ["TypeScript"],
      experience: [
        {
          company: "Acme",
          role: "Developer",
          start: "2020",
          end: "2022",
          highlights: ["Built API"],
        },
      ],
      education: [{ school: "Uni", degree: "BS", start: "2016", end: "2020" }],
      projects: [{ name: "Proj", description: "Desc", highlights: ["Impact"] }],
      links: [{ label: "GitHub", url: "https://github.com/jane" }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid links", () => {
    const result = parsedResumeSchema.safeParse({
      name: "Jane",
      headline: "Engineer",
      summary: "Builds products",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      links: [{ label: "Site", url: "not-a-url" }],
    });

    expect(result.success).toBe(false);
  });
});
