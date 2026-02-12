import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { portfolioInclude } from "@/lib/portfolio-data";
import { portfolioUpdateSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await getOrCreatePortfolio(session.user.id);
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
    include: portfolioInclude,
  });

  return NextResponse.json({ portfolio });
}

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = portfolioUpdateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const portfolio = await getOrCreatePortfolio(session.user.id);
  const data = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.portfolio.update({
      where: { id: portfolio.id },
      data: {
        displayName: data.displayName,
        headline: data.headline,
        bio: data.bio,
        contactEmail: data.contactEmail,
        location: data.location,
      },
    });

    if (data.skills) {
      await tx.skill.deleteMany({ where: { portfolioId: portfolio.id } });
      if (data.skills.length) {
        await tx.skill.createMany({
          data: data.skills.map((value, index) => ({ portfolioId: portfolio.id, value, order: index })),
        });
      }
    }

    if (data.links) {
      await tx.link.deleteMany({ where: { portfolioId: portfolio.id } });
      if (data.links.length) {
        await tx.link.createMany({
          data: data.links.map((item, index) => ({
            portfolioId: portfolio.id,
            label: item.label,
            url: item.url ?? "",
            order: index,
          })),
        });
      }
    }

    if (data.experiences) {
      await tx.experience.deleteMany({ where: { portfolioId: portfolio.id } });
      if (data.experiences.length) {
        await tx.experience.createMany({
          data: data.experiences.map((item, index) => ({
            portfolioId: portfolio.id,
            company: item.company ?? "",
            role: item.role ?? "",
            start: item.start ?? "",
            end: item.end ?? "",
            highlights: item.highlights,
            order: index,
          })),
        });
      }
    }

    if (data.educations) {
      await tx.education.deleteMany({ where: { portfolioId: portfolio.id } });
      if (data.educations.length) {
        await tx.education.createMany({
          data: data.educations.map((item, index) => ({
            portfolioId: portfolio.id,
            school: item.school ?? "",
            degree: item.degree ?? "",
            start: item.start ?? "",
            end: item.end ?? "",
            order: index,
          })),
        });
      }
    }

    if (data.projects) {
      await tx.project.deleteMany({ where: { portfolioId: portfolio.id } });
      if (data.projects.length) {
        await tx.project.createMany({
          data: data.projects.map((item, index) => ({
            portfolioId: portfolio.id,
            name: item.name ?? "",
            description: item.description ?? "",
            url: item.url ?? "",
            highlights: item.highlights,
            order: index,
          })),
        });
      }
    }
  });

  const updated = await prisma.portfolio.findUnique({
    where: { id: portfolio.id },
    include: portfolioInclude,
  });

  return NextResponse.json({ portfolio: updated });
}
