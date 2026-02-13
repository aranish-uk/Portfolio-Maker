import slugify from "slugify";
import type { Portfolio } from "@prisma/client";
import { prisma } from "./prisma";
import { generateUniqueSlug } from "./slug";

export async function getOrCreatePortfolio(userId: string): Promise<Portfolio> {
  const existing = await prisma.portfolio.findUnique({ where: { userId } });
  if (existing) {
    return existing;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const baseName = user?.name || user?.email?.split("@")[0] || "portfolio";
  const baseSlug = slugify(baseName, { lower: true, strict: true });

  const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
    const found = await prisma.portfolio.findUnique({ where: { slug: candidate } });
    return Boolean(found);
  });

  return prisma.portfolio.create({
    data: {
      userId,
      slug,
    },
  });
}
