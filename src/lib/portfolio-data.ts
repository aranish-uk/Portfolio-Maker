import { prisma } from "./prisma";

export const portfolioInclude = {
  skills: { orderBy: { order: "asc" as const } },
  links: { orderBy: { order: "asc" as const } },
  experiences: { orderBy: { order: "asc" as const } },
  educations: { orderBy: { order: "asc" as const } },
  projects: { orderBy: { order: "asc" as const } },
  resumeUploads: { orderBy: { createdAt: "desc" as const }, take: 5 },
  parsedResume: true,
};

export async function getPortfolioByUserId(userId: string) {
  return prisma.portfolio.findUnique({
    where: { userId },
    include: portfolioInclude,
  });
}
