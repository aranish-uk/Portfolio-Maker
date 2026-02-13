import { getAuthSession } from "@/lib/auth";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";
import { extractResumeText } from "@/lib/resume-extract";
import { saveUpload, deleteUpload } from "@/lib/storage";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Resume must be 1MB or less." }, { status: 400 });
  }

  const lower = file.name.toLowerCase();
  const allowed =
    file.type.includes("pdf") ||
    file.type.includes("word") ||
    file.type.includes("officedocument") ||
    lower.endsWith(".pdf") ||
    lower.endsWith(".docx");

  if (!allowed) {
    return NextResponse.json({ error: "Only PDF and DOCX are supported." }, { status: 400 });
  }

  const portfolio = await getOrCreatePortfolio(session.user.id);

  // Cleanup old resume if exists
  const existing = await prisma.resumeUpload.findFirst({
    where: { portfolioId: portfolio.id },
  });

  if (existing) {
    await Promise.all([
      existing.fileUrl ? deleteUpload(existing.fileUrl) : Promise.resolve(),
      prisma.resumeUpload.delete({ where: { id: existing.id } }),
    ]);
  }

  const [{ url }, content] = await Promise.all([saveUpload(file, "resumes"), extractResumeText(file)]);

  const upload = await prisma.resumeUpload.create({
    data: {
      portfolioId: portfolio.id,
      fileName: file.name,
      fileType: file.type,
      fileUrl: url,
      content,
    },
    select: { id: true, fileName: true, createdAt: true },
  });

  return NextResponse.json({ upload });
}
