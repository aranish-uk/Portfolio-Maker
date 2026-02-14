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

  try {
    return await prisma.portfolio.create({
      data: {
        userId,
        slug,
      },
    });
  } catch (error: any) {
    // If we hit a unique constraint on userId, it means a portfolio was created concurrently.
    // In that case, return the existing one.
    if (error.code === "P2002" && error.meta?.target?.includes("userId")) {
      const retry = await prisma.portfolio.findUnique({ where: { userId } });
      if (retry) return retry;
    }
    throw error;
  }
}
