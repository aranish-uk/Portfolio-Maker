import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-100">Portfolio Dashboard</h1>
            <p className="text-sm text-slate-400">{session.user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500" href="/dashboard">
              Overview
            </Link>
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500" href="/dashboard/onboarding">
              Onboarding
            </Link>
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500" href="/dashboard/theme">
              Theme
            </Link>
            <Link className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500" href="/dashboard/publish">
              Publish
            </Link>
            <SignOutButton />
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
