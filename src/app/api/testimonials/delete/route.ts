import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(req: Request) {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const testimonial = await prisma.testimonial.findFirst({
            where: { userId: session.user.id }
        });

        if (!testimonial) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        await prisma.testimonial.delete({
            where: { id: testimonial.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete review error:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}
