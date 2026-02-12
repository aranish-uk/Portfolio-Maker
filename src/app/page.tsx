import Link from "next/link";
import { getAuthSession } from "@/lib/auth";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-14">
        <header className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Portfolio Maker</p>
          <Link
            href={session?.user ? "/dashboard" : "/login"}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
          >
            {session?.user ? "Dashboard" : "Sign In"}
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Build your portfolio in minutes using your resume.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Authenticate, upload resume, auto-parse with AI, tweak fields, choose a theme, and publish to a personal slug.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={session?.user ? "/dashboard/onboarding" : "/login"} className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              Start Building
            </Link>
            <Link href="/u/demo" className="rounded-lg border border-slate-600 px-5 py-3 text-sm">
              See Example URL Format
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
