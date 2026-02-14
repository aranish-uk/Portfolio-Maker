import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { redirect } from "next/navigation";
import { DashboardTestimonialButton } from "@/components/dashboard-testimonial-button";
import { DeleteAccountSection } from "@/components/delete-account-section";

export default async function DashboardPage() {
  const session = await getAuthSession();
  const userId = session!.user!.id;

  const portfolio = await getOrCreatePortfolio(userId);
  const counts = await prisma.portfolio.findUnique({
    where: { id: portfolio.id },
    include: {
      links: true,
      projects: true,
      experiences: true,
      educations: true,
      skills: true,
      parsedResume: true,
    },
  });

  const testimonial = await prisma.testimonial.findFirst({
    where: { userId },
    select: {
      rating: true,
      content: true,
      isAnonymous: true,
      showWebsite: true,
    },
  });

  // Redirect to onboarding if no content
  if (!counts?.parsedResume && counts?.experiences.length === 0 && counts?.projects.length === 0) {
    redirect("/dashboard/onboarding");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Portfolio status</h2>
        <p className="mt-2 text-sm text-slate-300">Slug: {portfolio.slug}</p>
        <p className="text-sm text-slate-300">Published: {portfolio.published ? "Yes" : "No"}</p>
        <p className="text-sm text-slate-300">Theme: {portfolio.theme}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/dashboard/theme" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
            Customize Theme
          </Link>
          <Link href={`/u/${portfolio.slug}`} target="_blank" className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-indigo-400 transition hover:bg-slate-900 hover:text-indigo-300">
            Open Website
          </Link>
          <DashboardTestimonialButton existingReview={testimonial} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Content summary</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          <li>Skills: {counts?.skills.length ?? 0}</li>
          <li>Experience: {counts?.experiences.length ?? 0}</li>
          <li>Projects: {counts?.projects.length ?? 0}</li>
          <li>Education: {counts?.educations.length ?? 0}</li>
          <li>Links: {counts?.links.length ?? 0}</li>
        </ul>
      </section>
      <DeleteAccountSection />
    </div>
  );
}
