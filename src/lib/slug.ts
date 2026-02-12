import slugify from "slugify";

export function normalizeSlug(input: string): string {
  const value = slugify(input, { lower: true, strict: true, trim: true });
  return value || "portfolio";
}

export async function generateUniqueSlug(
  desired: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = normalizeSlug(desired);
  let candidate = base;
  let count = 1;

  while (await exists(candidate)) {
    count += 1;
    candidate = `${base}-${count}`;
  }

  return candidate;
}
