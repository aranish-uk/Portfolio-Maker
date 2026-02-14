import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { SignInButtons } from "@/components/sign-in-buttons";

const providers = [
  process.env.GITHUB_ID && process.env.GITHUB_SECRET ? { id: "github", label: "GitHub" } : null,
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? { id: "google", label: "Google" } : null,
].filter((item): item is { id: string; label: string } => Boolean(item));

export default async function LoginPage() {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-indigo-950/30">
        <h1 className="text-2xl font-bold text-slate-100">Sign in</h1>
        <p className="mt-1 text-sm text-slate-400">Use Google or GitHub to create and manage your portfolio.</p>
        <div className="mt-6">
          <SignInButtons providers={providers} />
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-indigo-400">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-indigo-400">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
