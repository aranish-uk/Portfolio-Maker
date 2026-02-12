import type { Portfolio } from "@prisma/client";
import { prisma } from "./prisma";
import { generateUniqueSlug } from "./slug";

export async function getOrCreatePortfolio(userId: string): Promise<Portfolio> {
  const existing = await prisma.portfolio.findUnique({ where: { userId } });
  if (existing) {
    return existing;
  }

  const slug = await generateUniqueSlug("my-portfolio", async (candidate) => {
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
