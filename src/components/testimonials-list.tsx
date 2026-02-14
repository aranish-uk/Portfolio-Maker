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

    // Split into Featured and Slider
    const featured = testimonials[0];
    const slider = testimonials.slice(1);

    // Helper to process testimonial data
    const processTestimonial = (t: typeof featured) => {
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
        const image = t.isAnonymous ? null : (t.user.portfolio?.heroImageUrl || t.user.image);

        return { ...t, displayName, headline, image };
    };

    const featuredData = processTestimonial(featured);

    return (
        <section className="relative overflow-hidden py-24">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-300">
                        TESTIMONIALS
                    </div>
                    <h2 className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                        What builders say about <span className="text-white">Portfolio Maker</span>
                    </h2>
                </div>

                <div className="space-y-8">
                    {/* Featured Testimonial (Hero Style) */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-md md:p-12">
                        <div className="absolute right-0 top-0 -z-10 h-64 w-64 translate-x-1/3 rounded-full bg-indigo-500/10 blur-3xl" />

                        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                            {/* Image Side */}
                            <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800 shadow-2xl md:aspect-[4/3]">
                                {featuredData.image ? (
                                    <Image
                                        src={featuredData.image}
                                        alt={featuredData.displayName}
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-6xl font-bold text-slate-600">
                                        {featuredData.displayName[0]}
                                    </div>
                                )}
                            </div>

                            {/* Content Side */}
                            <div className="flex flex-col justify-center">
                                <div className="mb-6 flex gap-1 text-yellow-400">
                                    {Array.from({ length: featuredData.rating }).map((_, i) => (
                                        <svg key={i} className="h-6 w-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <blockquote className="mb-8 text-2xl font-medium leading-relaxed text-slate-100 sm:text-3xl">
                                    "{featuredData.content}"
                                </blockquote>
                                <div>
                                    <div className="text-xl font-bold text-white">{featuredData.displayName}</div>
                                    <div className="text-indigo-400">{featuredData.headline}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Slider (Review Deck) */}
                    {slider.length > 0 && (
                        <div className="mx-auto mt-16 max-w-full">
                            <div className="flex snap-x gap-6 overflow-x-auto pb-8 scrollbar-hide">
                                {slider.map((t) => {
                                    const data = processTestimonial(t);
                                    return (
                                        <div key={t.id} className="w-[300px] flex-none snap-start rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-slate-900 sm:w-[350px]">
                                            <div className="mb-4 flex gap-1 text-yellow-400">
                                                {Array.from({ length: t.rating }).map((_, i) => (
                                                    <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                ))}
                                            </div>
                                            <p className="mb-6 line-clamp-4 text-sm leading-relaxed text-slate-300">"{t.content}"</p>

                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-800">
                                                    {data.image ? (
                                                        <img src={data.image} alt={data.displayName} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center font-bold text-slate-500">{data.displayName[0]}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{data.displayName}</div>
                                                    <div className="truncate text-xs text-slate-500">{data.headline}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
