import { getAuthSession } from "@/lib/auth";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";
import { deleteUpload } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { image: true },
    });

    if (!user?.image) {
        return NextResponse.json({ error: "No profile picture found on your account." }, { status: 400 });
    }

    const portfolio = await getOrCreatePortfolio(session.user.id);

    // Cleanup old hero image if it was a custom upload
    if (portfolio.heroImageUrl && portfolio.heroImageUrl.includes("vercel-storage")) {
        try {
            await deleteUpload(portfolio.heroImageUrl);
        } catch (e) {
            console.error("Failed to delete old hero image", e);
        }
    }

    const updated = await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: { heroImageUrl: user.image },
        select: { heroImageUrl: true },
    });

    return NextResponse.json(updated);
}
