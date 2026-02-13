import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const testimonialSchema = z.object({
    content: z.string().min(10).max(500),
    rating: z.number().min(1).max(5),
    isAnonymous: z.boolean(),
    showWebsite: z.boolean(),
});

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const json = await req.json();
        const body = testimonialSchema.parse(json);

        // Limit one review per user
        const existing = await prisma.testimonial.findFirst({
            where: { userId: session.user.id },
        });

        if (existing) {
            const updated = await prisma.testimonial.update({
                where: { id: existing.id },
                data: {
                    content: body.content,
                    rating: body.rating,
                    isAnonymous: body.isAnonymous,
                    showWebsite: body.showWebsite,
                },
            });
            return NextResponse.json(updated);
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                userId: session.user.id,
                ...body,
            },
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
        take: 6, // Show latest 6
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                    portfolio: {
                        select: {
                            slug: true,
                            headline: true,
                        },
                    },
                },
            },
        },
    });

    // Filter sensitive data
    const safeTestimonials = testimonials.map((t) => ({
        id: t.id,
        content: t.content,
        rating: t.rating,
        createdAt: t.createdAt,
        author: t.isAnonymous
            ? { name: "Anonymous User", image: null, headline: "Portfolio Maker User", website: null }
            : {
                name: t.user.name || "User",
                image: t.user.image,
                headline: t.user.portfolio?.headline || "Portfolio Creator",
                website: t.showWebsite && t.user.portfolio ? `/u/${t.user.portfolio.slug}` : null,
            },
    }));

    return NextResponse.json(safeTestimonials);
}
