import type { ThemeName } from "@prisma/client";
import { getTheme, type Theme } from "@/lib/themes";
import Image from "next/image";
import {
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  LinkIcon,
  MapPinIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

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

  // Layout Switcher
  switch (theme.layout) {
    case "sidebar":
      return <SidebarLayout portfolio={portfolio} theme={theme} />;
    case "grid":
      return <GridLayout portfolio={portfolio} theme={theme} />;
    case "stack":
    default:
      return <StackLayout portfolio={portfolio} theme={theme} />;
  }
}

// --- LAYOUTS ---

function StackLayout({ portfolio, theme }: { portfolio: PublicPortfolio; theme: Theme }) {
  return (
    <main className={`min-h-screen pb-20 ${theme.classes.page} ${theme.classes.text}`}>
      <div className="mx-auto max-w-3xl px-6 pt-20">
        <HeroSection portfolio={portfolio} theme={theme} aligned="center" />

        <div className="mt-16 space-y-12">
          <Section title="Experience" icon={<BriefcaseIcon className="size-5" />} theme={theme}>
            {portfolio.experiences.map((item, i) => (
              <ExperienceCard key={i} item={item} theme={theme} />
            ))}
          </Section>

          <Section title="Projects" icon={<CodeBracketIcon className="size-5" />} theme={theme}>
            {portfolio.projects.map((item, i) => (
              <ProjectCard key={i} item={item} theme={theme} />
            ))}
          </Section>

          <Section title="Education" icon={<AcademicCapIcon className="size-5" />} theme={theme}>
            {portfolio.educations.map((item, i) => (
              <EducationCard key={i} item={item} theme={theme} />
            ))}
          </Section>

          <Section title="Skills" icon={<CodeBracketIcon className="size-5" />} theme={theme}>
            <SkillList skills={portfolio.skills} theme={theme} />
          </Section>

          <Section title="Connect" icon={<LinkIcon className="size-5" />} theme={theme}>
            <LinksList portfolio={portfolio} theme={theme} />
          </Section>
        </div>
      </div>
    </main>
  );
}

function GridLayout({ portfolio, theme }: { portfolio: PublicPortfolio; theme: Theme }) {
  return (
    <main className={`min-h-screen pb-20 ${theme.classes.page} ${theme.classes.text}`}>
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <HeroSection portfolio={portfolio} theme={theme} aligned="left" />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Experience spans 2 cols */}
          <div className={`col-span-1 rounded-3xl p-8 md:col-span-2 ${theme.classes.card} ${theme.classes.border} border`}>
            <h2 className={`mb-6 text-2xl font-bold ${theme.classes.heading}`}>Experience</h2>
            <div className="space-y-8">
              {portfolio.experiences.map((item, i) => (
                <ExperienceCard key={i} item={item} theme={theme} />
              ))}
            </div>
          </div>

          {/* Sidebar Col: Skills & Education */}
          <div className="space-y-8">
            <div className={`rounded-3xl p-8 ${theme.classes.card} ${theme.classes.border} border`}>
              <h2 className={`mb-6 text-xl font-bold ${theme.classes.heading}`}>Skills</h2>
              <SkillList skills={portfolio.skills} theme={theme} />
            </div>

            <div className={`rounded-3xl p-8 ${theme.classes.card} ${theme.classes.border} border`}>
              <h2 className={`mb-6 text-xl font-bold ${theme.classes.heading}`}>Education</h2>
              {portfolio.educations.map((item, i) => (
                <EducationCard key={i} item={item} theme={theme} simple />
              ))}
            </div>
          </div>

          {/* Projects Full Width (or 3 cols if we had more) */}
          <div className={`col-span-1 rounded-3xl p-8 md:col-span-3 ${theme.classes.card} ${theme.classes.border} border`}>
            <h2 className={`mb-6 text-2xl font-bold ${theme.classes.heading}`}>Projects</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {portfolio.projects.map((item, i) => (
                <ProjectCard key={i} item={item} theme={theme} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <LinksList portfolio={portfolio} theme={theme} />
        </div>
      </div>
    </main>
  );
}

function SidebarLayout({ portfolio, theme }: { portfolio: PublicPortfolio; theme: Theme }) {
  return (
    <main className={`flex min-h-screen flex-col lg:flex-row ${theme.classes.page} ${theme.classes.text}`}>
      {/* Sidebar */}
      <div className={`w-full shrink-0 border-r p-8 lg:h-screen lg:w-96 lg:sticky lg:top-0 lg:overflow-y-auto ${theme.classes.card} ${theme.classes.border}`}>
        <div className="flex flex-col h-full justify-between">
          <div>
            {portfolio.heroImageUrl && (
              <Image
                src={portfolio.heroImageUrl}
                alt="Hero"
                className="mb-8 h-48 w-48 rounded-full object-cover shadow-xl"
                width={300}
                height={300}
              />
            )}
            <h1 className={`text-4xl font-bold ${theme.classes.heading}`}>{portfolio.displayName}</h1>
            <p className={`mt-2 text-xl ${theme.classes.accent}`}>{portfolio.headline}</p>
            <p className="mt-6 text-sm leading-relaxed opacity-80">{portfolio.bio}</p>

            <div className="mt-8 space-y-2 text-sm opacity-70">
              {portfolio.location && <div className="flex items-center gap-2"><MapPinIcon className="size-4" /> {portfolio.location}</div>}
              {portfolio.contactEmail && <div className="flex items-center gap-2"><EnvelopeIcon className="size-4" /> {portfolio.contactEmail}</div>}
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <LinksList portfolio={portfolio} theme={theme} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 lg:p-16 space-y-16 max-w-4xl">
        <section>
          <h2 className={`mb-8 text-2xl font-bold border-b pb-4 ${theme.classes.heading} ${theme.classes.border}`}>Experience</h2>
          <div className="space-y-12">
            {portfolio.experiences.map((item, i) => (
              <ExperienceCard key={i} item={item} theme={theme} />
            ))}
          </div>
        </section>

        <section>
          <h2 className={`mb-8 text-2xl font-bold border-b pb-4 ${theme.classes.heading} ${theme.classes.border}`}>Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((item, i) => (
              <ProjectCard key={i} item={item} theme={theme} />
            ))}
          </div>
        </section>

        <section>
          <h2 className={`mb-8 text-2xl font-bold border-b pb-4 ${theme.classes.heading} ${theme.classes.border}`}>Education & Skills</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              {portfolio.educations.map((item, i) => (
                <EducationCard key={i} item={item} theme={theme} simple />
              ))}
            </div>
            <div>
              <SkillList skills={portfolio.skills} theme={theme} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// --- COMPONENTS ---

function HeroSection({ portfolio, theme, aligned }: { portfolio: PublicPortfolio; theme: Theme; aligned: "center" | "left" }) {
  return (
    <section className={`flex flex-col gap-6 ${aligned === "center" ? "items-center text-center" : "items-start text-left"}`}>
      {portfolio.heroImageUrl && (
        <Image
          src={portfolio.heroImageUrl}
          alt="Hero"
          className={`h-32 w-32 rounded-full object-cover shadow-2xl ring-4 ${theme.classes.border} ${aligned === "center" ? "mx-auto" : ""}`}
          width={200}
          height={200}
        />
      )}
      <div>
        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl ${theme.classes.heading}`}>
          {portfolio.displayName || "Your Name"}
        </h1>
        <p className={`mt-4 text-xl font-medium ${theme.classes.accent}`}>
          {portfolio.headline || "Creative Professional"}
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-80">
          {portfolio.bio}
        </p>

        <div className={`mt-6 flex flex-wrap gap-4 opacity-70 ${aligned === "center" ? "justify-center" : ""}`}>
          {portfolio.location && <span className="flex items-center gap-1.5"><MapPinIcon className="size-4" /> {portfolio.location}</span>}
          {portfolio.contactEmail && <span className="flex items-center gap-1.5"><EnvelopeIcon className="size-4" /> {portfolio.contactEmail}</span>}
        </div>
      </div>
    </section>
  )
}

function Section({ title, icon, children, theme }: { title: string; icon: React.ReactNode; children: React.ReactNode; theme: Theme }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <section className={`rounded-3xl p-8 border ${theme.classes.card} ${theme.classes.border}`}>
      <div className="mb-8 flex items-center gap-3">
        <div className={`rounded-lg p-2 ${theme.classes.button} bg-opacity-10 text-current`}>
          {icon}
        </div>
        <h2 className={`text-2xl font-bold ${theme.classes.heading}`}>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ExperienceCard({ item, theme }: { item: PublicPortfolio["experiences"][0]; theme: Theme }) {
  return (
    <div className="relative border-l-2 pl-6 py-1 border-current opacity-90 hover:opacity-100 transition-opacity">
      <h3 className={`text-lg font-bold ${theme.classes.heading}`}>{item.role}</h3>
      <div className="flex flex-wrap items-baseline gap-2 mb-2">
        <span className="font-medium opacity-90">{item.company}</span>
        <span className="text-xs uppercase tracking-wider opacity-60">• {item.start} — {item.end}</span>
      </div>
      <ul className="space-y-1.5 text-sm leading-relaxed opacity-80">
        {toArray(item.highlights).map((line, i) => (
          <li key={i}>• {line}</li>
        ))}
      </ul>
    </div>
  )
}

function ProjectCard({ item, theme }: { item: PublicPortfolio["projects"][0]; theme: Theme }) {
  return (
    <div className={`group rounded-xl p-5 border transition hover:-translate-y-1 ${theme.classes.border} bg-black/5 dark:bg-white/5`}>
      <div className="flex items-start justify-between gap-4">
        <h3 className={`font-bold ${theme.classes.heading}`}>{item.name}</h3>
        {item.url && (
          <a href={item.url} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100">
            <LinkIcon className="size-4" />
          </a>
        )}
      </div>
      <p className="mt-2 text-sm opacity-80">{item.description}</p>
    </div>
  )
}

function EducationCard({ item, theme, simple }: { item: PublicPortfolio["educations"][0]; theme: Theme; simple?: boolean }) {
  return (
    <div className={`mb-4 ${simple ? "" : "border-b pb-4 last:border-0"}`}>
      <h3 className={`font-bold ${theme.classes.heading}`}>{item.school}</h3>
      <p className="text-sm opacity-90">{item.degree}</p>
      <p className="text-xs opacity-60 mt-1">{item.start} — {item.end}</p>
    </div>
  )
}

function SkillList({ skills, theme }: { skills: PublicPortfolio["skills"]; theme: Theme }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill.value} className={`px-3 py-1 rounded-full text-sm font-medium border ${theme.classes.border} ${theme.classes.accent} bg-current bg-opacity-10 dark:bg-opacity-20`}>
          {skill.value}
        </span>
      ))}
    </div>
  )
}

function LinksList({ portfolio, theme }: { portfolio: PublicPortfolio; theme: Theme }) {
  return (
    <div className="flex flex-wrap gap-4">
      {portfolio.links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${theme.classes.button}`}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
