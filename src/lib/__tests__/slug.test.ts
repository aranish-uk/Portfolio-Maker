import { describe, expect, it } from "vitest";
import { generateUniqueSlug, normalizeSlug } from "@/lib/slug";

describe("slug helpers", () => {
  it("normalizes slug", () => {
    expect(normalizeSlug("John Doe Portfolio!")).toBe("john-doe-portfolio");
  });

  it("generates unique slug", async () => {
    const existing = new Set(["john-doe", "john-doe-2"]);
    const slug = await generateUniqueSlug("john doe", async (candidate) => existing.has(candidate));
    expect(slug).toBe("john-doe-3");
  });
});
