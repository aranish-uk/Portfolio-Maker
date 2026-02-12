import { getAuthSession } from "@/lib/auth";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/storage";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image must be 5MB or less." }, { status: 400 });
  }

  const portfolio = await getOrCreatePortfolio(session.user.id);
  const upload = await saveUpload(file, "hero");

  const updated = await prisma.portfolio.update({
    where: { id: portfolio.id },
    data: { heroImageUrl: upload.url },
    select: { heroImageUrl: true },
  });

  return NextResponse.json(updated);
}
