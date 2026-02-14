import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Delete the user. specific cascade rules in schema should handle related data (Portfolio, Testimonials, etc.)
        await prisma.user.delete({
            where: { id: session.user.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
