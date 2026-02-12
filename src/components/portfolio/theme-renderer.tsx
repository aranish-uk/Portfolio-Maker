import type { ThemeName } from "@prisma/client";
import { getTheme } from "@/lib/themes";
import Image from "next/image";

export type PublicPortfolio = {
  displayName: string | null;
  headline: string | null;
  bio: string | null;
  heroImageUrl: string | null;
  location: string | null;
  contactEmail: string | null;
  theme: ThemeName;
  skills: Array<{ value: string }>;
  links: Array<{ label: string; url: string }>;
  experiences: Array<{ company: string; role: string; start: string; end: string; highlights: unknown }>;
  educations: Array<{ school: string; degree: string; start: string; end: string }>;
  projects: Array<{ name: string; description: string; url: string | null; highlights: unknown }>;
};

function toArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function ThemeRenderer({ portfolio }: { portfolio: PublicPortfolio }) {
  const theme = getTheme(portfolio.theme);

  return (
    <main className={`min-h-screen ${theme.classes.page}`}>
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <section className={`rounded-2xl p-6 md:p-10 ${theme.classes.card}`}>
          {portfolio.heroImageUrl ? (
            <Image
              src={portfolio.heroImageUrl}
              alt="Hero"
              className="mb-6 h-52 w-full rounded-xl object-cover md:h-72"
              width={1280}
              height={720}
            />
          ) : null}
          <h1 className="text-3xl font-bold md:text-5xl">{portfolio.displayName || "Your Name"}</h1>
          <p className={`mt-2 text-lg ${theme.classes.accent}`}>{portfolio.headline || "Your headline"}</p>
          <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm md:text-base">{portfolio.bio || ""}</p>
        </section>

        <section className={`mt-6 rounded-2xl p-6 ${theme.classes.card}`}>
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {portfolio.skills.map((item) => (
              <span key={item.value} className="rounded-full bg-black/5 px-3 py-1 text-sm dark:bg-white/10">
                {item.value}
              </span>
            ))}
          </div>
        </section>

        <section className={`mt-6 rounded-2xl p-6 ${theme.classes.card}`}>
          <h2 className="text-xl font-semibold">Experience</h2>
          <div className="mt-3 space-y-4">
            {portfolio.experiences.map((item) => (
              <article key={`${item.company}-${item.role}`}>
                <h3 className="font-semibold">{item.role} - {item.company}</h3>
                <p className="text-sm opacity-80">{item.start} to {item.end}</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {toArray(item.highlights).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={`mt-6 rounded-2xl p-6 ${theme.classes.card}`}>
          <h2 className="text-xl font-semibold">Projects</h2>
          <div className="mt-3 space-y-4">
            {portfolio.projects.map((item) => (
              <article key={item.name}>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm">{item.description}</p>
                {item.url ? (
                  <a className={`text-sm ${theme.classes.accent}`} href={item.url} target="_blank" rel="noreferrer">
                    {item.url}
                  </a>
                ) : null}
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {toArray(item.highlights).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={`mt-6 rounded-2xl p-6 ${theme.classes.card}`}>
          <h2 className="text-xl font-semibold">Education</h2>
          <div className="mt-3 space-y-4">
            {portfolio.educations.map((item) => (
              <article key={`${item.school}-${item.degree}`}>
                <h3 className="font-semibold">{item.degree}</h3>
                <p className="text-sm">{item.school}</p>
                <p className="text-xs opacity-70">{item.start} to {item.end}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`mt-6 rounded-2xl p-6 ${theme.classes.card}`}>
          <h2 className="text-xl font-semibold">Contact & Links</h2>
          <p className="mt-2 text-sm">{portfolio.contactEmail || ""}</p>
          <p className="text-sm">{portfolio.location || ""}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {portfolio.links.map((item) => (
              <a
                key={`${item.label}-${item.url}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className={`text-sm font-medium ${theme.classes.accent}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
