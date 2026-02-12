import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ThemeRenderer } from "@/components/portfolio/theme-renderer";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await params;
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: resolved.slug },
    select: {
      displayName: true,
      headline: true,
      bio: true,
      heroImageUrl: true,
      published: true,
    },
  });

  if (!portfolio || !portfolio.published) {
    return { title: "Portfolio not found" };
  }

  const title = `${portfolio.displayName || "Portfolio"} | Portfolio Maker`;

  return {
    title,
    description: portfolio.bio || portfolio.headline || "Portfolio profile",
    openGraph: {
      title,
      description: portfolio.bio || portfolio.headline || "Portfolio profile",
      images: portfolio.heroImageUrl ? [portfolio.heroImageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: portfolio.bio || portfolio.headline || "Portfolio profile",
      images: portfolio.heroImageUrl ? [portfolio.heroImageUrl] : [],
    },
  };
}

export default async function PublicPortfolioPage({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: resolved.slug },
    include: {
      skills: { orderBy: { order: "asc" } },
      links: { orderBy: { order: "asc" } },
      experiences: { orderBy: { order: "asc" } },
      educations: { orderBy: { order: "asc" } },
      projects: { orderBy: { order: "asc" } },
    },
  });

  if (!portfolio || !portfolio.published) {
    notFound();
  }

  return <ThemeRenderer portfolio={portfolio} />;
}
