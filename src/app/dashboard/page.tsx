import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreatePortfolio } from "@/lib/portfolio";

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
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Portfolio status</h2>
        <p className="mt-2 text-sm text-slate-700">Slug: {portfolio.slug}</p>
        <p className="text-sm text-slate-700">Published: {portfolio.published ? "Yes" : "No"}</p>
        <p className="text-sm text-slate-700">Theme: {portfolio.theme}</p>
        <Link href={`/u/${portfolio.slug}`} className="mt-3 inline-block text-sm font-medium text-indigo-600">
          Open public URL
        </Link>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Content summary</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          <li>Skills: {counts?.skills.length ?? 0}</li>
          <li>Experience: {counts?.experiences.length ?? 0}</li>
          <li>Projects: {counts?.projects.length ?? 0}</li>
          <li>Education: {counts?.educations.length ?? 0}</li>
          <li>Links: {counts?.links.length ?? 0}</li>
        </ul>
      </section>
    </div>
  );
}
