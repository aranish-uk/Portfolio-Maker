"use client";

import { THEMES } from "@/lib/themes";
import { useEffect, useState } from "react";

export default function ThemePage() {
  const [currentTheme, setCurrentTheme] = useState<string>("CLASSIC");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setCurrentTheme(data.portfolio.theme));
  }, []);

  async function selectTheme(theme: string) {
    const response = await fetch("/api/portfolio/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });

    if (!response.ok) {
      setStatus("Failed to set theme.");
      return;
    }

    setCurrentTheme(theme);
    setStatus("Theme updated.");
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Theme Selection</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => selectTheme(theme.id)}
            className={`rounded-xl border p-4 text-left ${currentTheme === theme.id ? "border-indigo-600 bg-indigo-50" : "border-slate-200 bg-white"}`}
          >
            <h2 className="font-semibold">{theme.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{theme.description}</p>
          </button>
        ))}
      </div>
      {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}
    </div>
  );
}
