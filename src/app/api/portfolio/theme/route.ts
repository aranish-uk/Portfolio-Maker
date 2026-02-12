import { getAuthSession } from "@/lib/auth";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";
import { themeSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = themeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const portfolio = await getOrCreatePortfolio(session.user.id);
  const updated = await prisma.portfolio.update({
    where: { id: portfolio.id },
    data: { theme: parsed.data.theme },
  });

  return NextResponse.json({ theme: updated.theme });
}
