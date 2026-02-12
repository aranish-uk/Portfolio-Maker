import { getAuthSession } from "@/lib/auth";
import { parseResumeWithAI } from "@/lib/ai";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { portfolioInclude } from "@/lib/portfolio-data";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  uploadId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = checkRateLimit(`parse:${session.user.id}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a few minutes." }, { status: 429 });
  }

  const parsedBody = bodySchema.safeParse(await req.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error.flatten() }, { status: 400 });
  }

  const portfolio = await getOrCreatePortfolio(session.user.id);
  const upload = await prisma.resumeUpload.findFirst({
    where: {
      id: parsedBody.data.uploadId,
      portfolioId: portfolio.id,
    },
  });

  if (!upload) {
    return NextResponse.json({ error: "Resume upload not found." }, { status: 404 });
  }

  try {
    const parsed = await parseResumeWithAI(upload.content);

    await prisma.$transaction(async (tx) => {
      await tx.parsedResume.upsert({
        where: { portfolioId: portfolio.id },
        create: { portfolioId: portfolio.id, rawJson: parsed },
        update: { rawJson: parsed },
      });

      await tx.portfolio.update({
        where: { id: portfolio.id },
        data: {
          displayName: parsed.name,
          headline: parsed.headline,
          bio: parsed.summary,
        },
      });

      await tx.skill.deleteMany({ where: { portfolioId: portfolio.id } });
      if (parsed.skills.length) {
        await tx.skill.createMany({
          data: parsed.skills.map((value, order) => ({ portfolioId: portfolio.id, value, order })),
        });
      }

      await tx.link.deleteMany({ where: { portfolioId: portfolio.id } });
      if (parsed.links.length) {
        await tx.link.createMany({
          data: parsed.links.map((item, order) => ({
            portfolioId: portfolio.id,
            label: item.label,
            url: item.url,
            order,
          })),
        });
      }

      await tx.experience.deleteMany({ where: { portfolioId: portfolio.id } });
      if (parsed.experience.length) {
        await tx.experience.createMany({
          data: parsed.experience.map((item, order) => ({
            portfolioId: portfolio.id,
            company: item.company,
            role: item.role,
            start: item.start,
            end: item.end,
            highlights: item.highlights,
            order,
          })),
        });
      }

      await tx.education.deleteMany({ where: { portfolioId: portfolio.id } });
      if (parsed.education.length) {
        await tx.education.createMany({
          data: parsed.education.map((item, order) => ({
            portfolioId: portfolio.id,
            school: item.school,
            degree: item.degree,
            start: item.start,
            end: item.end,
            order,
          })),
        });
      }

      await tx.project.deleteMany({ where: { portfolioId: portfolio.id } });
      if (parsed.projects.length) {
        await tx.project.createMany({
          data: parsed.projects.map((item, order) => ({
            portfolioId: portfolio.id,
            name: item.name,
            description: item.description,
            url: item.url,
            highlights: item.highlights,
            order,
          })),
        });
      }
    });

    const updated = await prisma.portfolio.findUnique({
      where: { id: portfolio.id },
      include: portfolioInclude,
    });

    return NextResponse.json({ portfolio: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse resume.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
