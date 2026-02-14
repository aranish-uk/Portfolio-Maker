import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export async function TestimonialsList() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
            user: {
                include: {
                    portfolio: true,
                },
            },
        },
    });

    if (testimonials.length === 0) return null;

    return (
        <section className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Loved by builders
                </h2>
                <p className="mt-4 text-lg text-slate-400">
                    See what others are creating with Portfolio Maker.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => {
                    let displayName = "Anonymous User";
                    if (!t.isAnonymous && t.user.name) {
                        const parts = t.user.name.split(" ");
                        if (parts.length > 1) {
                            displayName = `${parts[0]} ${parts[parts.length - 1][0]}.`;
                        } else {
                            displayName = parts[0];
                        }
                    }

                    const headline = t.isAnonymous ? "Portfolio Creator" : t.user.portfolio?.headline || "Portfolio Creator";
                    // Prioritize Portfolio Hero Image, fall back to OAuth image
                    const image = t.isAnonymous ? null : (t.user.portfolio?.heroImageUrl || t.user.image);
                    const showLink = !t.isAnonymous && t.showWebsite && t.user.portfolio;

                    return (
                        <div key={t.id} className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-slate-900">
                            <div>
                                <div className="flex gap-1 text-yellow-400">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-slate-300">"{t.content}"</p>
                            </div>

                            <div className="mt-6 flex items-center gap-4">
                                <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-indigo-400">
                                    {image ? (
                                        <img src={image} alt={displayName} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="font-semibold">{displayName[0]}</span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                                    <p className="truncate text-xs text-slate-500">{headline}</p>
                                </div>
                            </div>

                            {showLink && (
                                <Link
                                    href={`/u/${t.user.portfolio!.slug}`}
                                    target="_blank"
                                    className="absolute right-6 top-6 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-indigo-400 transition-colors hover:bg-slate-700"
                                >
                                    Visit Portfolio
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
