import { getAuthSession } from "@/lib/auth";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";
import { slugSchema } from "@/lib/schemas";
import { generateUniqueSlug, normalizeSlug } from "@/lib/slug";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = slugSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const portfolio = await getOrCreatePortfolio(session.user.id);
  const requested = normalizeSlug(parsed.data.slug);

  const unique = await generateUniqueSlug(requested, async (candidate) => {
    const found = await prisma.portfolio.findFirst({
      where: {
        slug: candidate,
        id: { not: portfolio.id },
      },
      select: { id: true },
    });
    return Boolean(found);
  });

  const updated = await prisma.portfolio.update({
    where: { id: portfolio.id },
    data: {
      slug: unique,
      published: true,
    },
    select: { slug: true, published: true },
  });

  return NextResponse.json(updated);
}
