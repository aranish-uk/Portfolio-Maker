import Link from "next/link";
import Image from "next/image";
import { getAuthSession } from "@/lib/auth";
import { TestimonialsList } from "@/components/testimonials-list";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-[10%] top-[20%] h-[40rem] w-[40rem] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-[10%] left-[20%] h-[40rem] w-[40rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-8 md:py-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg shadow-indigo-500/20">
              <Image src="/icon.png" alt="Portfolio Maker Logo" fill className="object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Portfolio Maker</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href={session?.user ? "/dashboard" : "/login"}
              className="rounded-full border border-slate-700 bg-slate-900/50 px-5 py-2 text-sm font-medium transition-colors hover:border-slate-600 hover:bg-slate-800"
            >
              {session?.user ? "Go to Dashboard" : "Sign In"}
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center pt-8">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            </span>
            New: AI-Powered Resume Parsing
          </div>

          <h1 className="mt-8 max-w-4xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
            Transform your resume into a <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">stunning portfolio</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Stop building from scratch. Upload your PDF resume, let our AI handle the parsing, and publish a professional portfolio website in seconds.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={session?.user ? "/dashboard/onboarding" : "/login"}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Building Free
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>

            <Link
              href="/u/demo"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 px-8 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-colors hover:bg-slate-800 hover:text-white"
            >
              View Demo Portfolio
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid gap-8 md:grid-cols-3 pt-8 pb-4">
          {[
            {
              title: "AI Extraction",
              description: "Upload your PDF or DOCX. We extract skills, experience, and projects automatically.",
              icon: (
                <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
            {
              title: "Instant Publish",
              description: "Get a unique URL (e.g., yourname.portfolio) to share with recruiters instantly.",
              icon: (
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: "Beautiful Themes",
              description: "Choose from professionally designed themes that look great on any device.",
              icon: (
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              ),
            },
          ].map((feature, i) => (
            <div key={i} className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:border-slate-700 hover:bg-slate-900">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-slate-800 p-3 shadow-lg group-hover:bg-slate-800/80">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-100">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>

        <TestimonialsList />

        {/* Footer */}
        <footer className="mt-4 border-t border-slate-800 pt-8 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Portfolio Maker. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
