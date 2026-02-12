import type { ThemeName } from "@prisma/client";

export type ThemeType = "light" | "dark";
export type ThemeLayout = "stack" | "grid" | "sidebar";

export interface Theme {
  id: ThemeName;
  name: string;
  description: string;
  type: ThemeType;
  layout: ThemeLayout;
  classes: {
    page: string;
    card: string;
    heading: string;
    text: string;
    accent: string;
    button: string;
    border: string;
  };
}

export const THEMES: Theme[] = [
  // --- LIGHT THEMES ---
  {
    id: "CLASSIC",
    name: "Executive",
    description: "Professional sidebar layout for serious business.",
    type: "light",
    layout: "sidebar",
    classes: {
      page: "bg-slate-50",
      card: "bg-white shadow-sm ring-1 ring-slate-900/5",
      heading: "font-serif text-slate-900",
      text: "text-slate-600",
      accent: "text-indigo-600",
      button: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
      border: "border-slate-200",
    },
  },
  {
    id: "MINIMAL",
    name: "Studio",
    description: "Clean grid layout with ample whitespace.",
    type: "light",
    layout: "grid",
    classes: {
      page: "bg-white",
      card: "bg-neutral-50 ring-1 ring-neutral-900/5",
      heading: "font-sans tracking-tight text-neutral-900",
      text: "text-neutral-500",
      accent: "text-neutral-900",
      button: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm",
      border: "border-neutral-100",
    },
  },
  {
    id: "SUNSET",
    name: "Sunrise",
    description: "Warm gradients with a centered stack layout.",
    type: "light",
    layout: "stack",
    classes: {
      page: "bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50",
      card: "bg-white/60 backdrop-blur-md shadow-xl shadow-orange-500/5 ring-1 ring-orange-900/5",
      heading: "font-sans font-bold text-orange-950",
      text: "text-orange-900/80",
      accent: "text-rose-600",
      button: "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40",
      border: "border-white/50",
    },
  },
  {
    id: "OCEAN",
    name: "Coastal",
    description: "Breezy blue tones with a split layout.",
    type: "light",
    layout: "sidebar",
    classes: {
      page: "bg-cyan-50",
      card: "bg-white shadow-lg shadow-cyan-900/5 ring-1 ring-cyan-900/5",
      heading: "font-sans text-cyan-950",
      text: "text-cyan-800",
      accent: "text-cyan-600",
      button: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm",
      border: "border-cyan-100",
    },
  },

  // --- DARK THEMES ---
  {
    id: "MIDNIGHT",
    name: "Midnight",
    description: "Deep purple darkness with a centered stack layout.",
    type: "dark",
    layout: "stack",
    classes: {
      page: "bg-slate-950",
      card: "bg-slate-900/50 backdrop-blur-sm border border-slate-800",
      heading: "font-sans font-black tracking-tight text-white",
      text: "text-slate-400",
      accent: "text-violet-400",
      button: "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/20",
      border: "border-slate-800",
    },
  },
  {
    id: "ABYSS",
    name: "Abyss",
    description: "Dark blue tones with a grid layout.",
    type: "dark",
    layout: "grid",
    classes: {
      page: "bg-slate-900",
      card: "bg-slate-800/80 border border-slate-700",
      heading: "font-sans text-sky-100",
      text: "text-slate-300",
      accent: "text-sky-400",
      button: "bg-sky-600 text-white hover:bg-sky-500 shadow-lg shadow-sky-500/20",
      border: "border-slate-700",
    },
  },
  {
    id: "BOLD",
    name: "Noir",
    description: "High contrast monochrome sidebar layout.",
    type: "dark",
    layout: "sidebar",
    classes: {
      page: "bg-black",
      card: "bg-zinc-900 border border-zinc-800",
      heading: "font-sans font-bold text-white",
      text: "text-zinc-400",
      accent: "text-white",
      button: "bg-white text-black hover:bg-zinc-200",
      border: "border-zinc-800",
    },
  },
  {
    id: "TERMINAL",
    name: "Terminal",
    description: "Monospaced retro styling for developers.",
    type: "dark",
    layout: "stack",
    classes: {
      page: "bg-black",
      card: "bg-black border border-green-900",
      heading: "font-mono text-green-500",
      text: "text-green-700 font-mono",
      accent: "text-green-400",
      button: "bg-green-900/30 text-green-400 border border-green-500 hover:bg-green-900/50",
      border: "border-green-800",
    },
  },
];

export function getTheme(theme: ThemeName): Theme {
  return THEMES.find((item) => item.id === theme) ?? THEMES[0];
}
