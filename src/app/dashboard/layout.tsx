import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { SignOutButton } from "@/components/sign-out-button";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const portfolio = await getOrCreatePortfolio(session.user.id);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-100">Portfolio Dashboard</h1>
            <p className="text-sm text-slate-400">{session.user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-400 transition-colors" href="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-400 transition-colors" href="/dashboard/onboarding">
              Onboarding
            </Link>
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-400 transition-colors" href="/dashboard/publish">
              Publish
            </Link>
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-400 transition-colors" href="/dashboard/theme">
              Theme
            </Link>

            <a
              href={`/u/${portfolio.slug}`}
              target="_blank"
              className="flex items-center gap-1 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
            >
              Visit <ArrowTopRightOnSquareIcon className="size-4" />
            </a>

            <div className="ml-2 pl-2 border-l border-slate-700">
              <SignOutButton />
            </div>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
