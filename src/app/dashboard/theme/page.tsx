"use client";

import { THEMES } from "@/lib/themes";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ThemePage() {
  const [currentTheme, setCurrentTheme] = useState<string>("CLASSIC");
  const [status, setStatus] = useState("");

  const lightThemes = THEMES.filter((t) => t.type === "light");
  const darkThemes = THEMES.filter((t) => t.type === "dark");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setCurrentTheme(data.portfolio.theme));
  }, []);

  async function selectTheme(theme: string) {
    // Optimistic update
    const previous = currentTheme;
    setCurrentTheme(theme);
    setStatus("Saving...");

    try {
      const response = await fetch("/api/portfolio/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }
      setStatus("Saved!");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setCurrentTheme(previous);
      setStatus("Failed to save.");
    }
  }

  return (
    <div className="space-y-10 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Design & Theme</h1>
        <p className="text-slate-400">Choose a layout and color palette that matches your personal brand.</p>
      </header>

      {/* Light Themes */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-200 border-b border-slate-800 pb-2">Light Themes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lightThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={currentTheme === theme.id}
              onSelect={() => selectTheme(theme.id)}
            />
          ))}
        </div>
      </section>

      {/* Dark Themes */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-200 border-b border-slate-800 pb-2">Dark Themes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {darkThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={currentTheme === theme.id}
              onSelect={() => selectTheme(theme.id)}
            />
          ))}
        </div>
      </section>

      <div className="fixed bottom-6 right-6">
        {status && (
          <div className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

function ThemeCard({ theme, isSelected, onSelect }: { theme: any; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col items-start gap-4 rounded-2xl border p-6 text-left transition-all hover:scale-[1.02] ${isSelected
          ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20"
          : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
        }`}
    >
      <div className={`h-24 w-full rounded-lg shadow-inner ${theme.classes.page} border ${theme.classes.border} relative overflow-hidden`}>
        {/* Mini Preview */}
        <div className={`absolute left-4 top-4 h-2 w-16 rounded-full ${theme.classes.button} opacity-50`}></div>
        <div className="absolute left-4 top-8 flex gap-2">
          <div className={`h-16 w-32 rounded bg-white/50 shadow-sm ${theme.classes.card}`}></div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">{theme.name}</h3>
          {isSelected && <CheckCircleIcon className="size-6 text-indigo-500" />}
        </div>
        <p className="text-sm text-slate-400">{theme.description}</p>
        <div className="mt-3 flex gap-2">
          <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
            {theme.layout.charAt(0).toUpperCase() + theme.layout.slice(1)} Layout
          </span>
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${theme.type === 'dark' ? 'bg-slate-900 text-slate-300 ring-slate-700' : 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
            {theme.type === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
      </div>
    </button>
  )
}
