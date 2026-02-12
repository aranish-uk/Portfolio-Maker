import { describe, expect, it } from "vitest";
import { parseModelJsonWithRepair } from "@/lib/ai";

describe("parseModelJsonWithRepair", () => {
  it("repairs invalid model output on retry", async () => {
    const value = await parseModelJsonWithRepair("invalid", async () => {
      return JSON.stringify({
        name: "Alex",
        headline: "Developer",
        summary: "Summary",
        skills: ["TS"],
        experience: [],
        education: [],
        projects: [],
        links: [],
      });
    });

    expect(value.name).toBe("Alex");
  });
});
