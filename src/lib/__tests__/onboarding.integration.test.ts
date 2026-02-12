import { describe, expect, it } from "vitest";
import { buildPortfolioPayloadFromResume } from "@/lib/onboarding";

describe("onboarding integration", () => {
  it("maps parsed resume to portfolio payload", () => {
    const payload = buildPortfolioPayloadFromResume({
      name: "Sam",
      headline: "Full Stack Engineer",
      summary: "Builds web apps",
      skills: ["React", "Node"],
      experience: [
        { company: "Acme", role: "Engineer", start: "2021", end: "2024", highlights: ["Shipped features"] },
      ],
      education: [{ school: "State U", degree: "BS CS", start: "2017", end: "2021" }],
      projects: [{ name: "Maker", description: "Portfolio app", highlights: ["Fast"] }],
      links: [{ label: "GitHub", url: "https://github.com/sam" }],
    });

    expect(payload.displayName).toBe("Sam");
    expect(payload.skills?.length).toBe(2);
    expect(payload.projects?.[0].name).toBe("Maker");
  });
});
