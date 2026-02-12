import type { ThemeName } from "@prisma/client";

export const THEMES: Array<{
  id: ThemeName;
  name: string;
  description: string;
  classes: {
    page: string;
    card: string;
    accent: string;
  };
}> = [
  {
    id: "CLASSIC",
    name: "Classic",
    description: "Clean and professional.",
    classes: {
      page: "bg-slate-50 text-slate-900",
      card: "bg-white border border-slate-200",
      accent: "text-indigo-600",
    },
  },
  {
    id: "MINIMAL",
    name: "Minimal",
    description: "Simple spacing and neutral palette.",
    classes: {
      page: "bg-neutral-100 text-neutral-900",
      card: "bg-white border border-neutral-300",
      accent: "text-neutral-900",
    },
  },
  {
    id: "BOLD",
    name: "Bold",
    description: "High contrast and strong headings.",
    classes: {
      page: "bg-zinc-900 text-zinc-100",
      card: "bg-zinc-800 border border-zinc-700",
      accent: "text-emerald-400",
    },
  },
  {
    id: "SUNSET",
    name: "Sunset",
    description: "Warm gradient and energetic tone.",
    classes: {
      page: "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-rose-950",
      card: "bg-white/80 border border-rose-200",
      accent: "text-rose-700",
    },
  },
  {
    id: "OCEAN",
    name: "Ocean",
    description: "Cool palette with calm contrast.",
    classes: {
      page: "bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 text-blue-950",
      card: "bg-white/85 border border-sky-200",
      accent: "text-blue-700",
    },
  },
];

export function getTheme(theme: ThemeName) {
  return THEMES.find((item) => item.id === theme) ?? THEMES[0];
}
