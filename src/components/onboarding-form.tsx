"use client";
import React from "react";
import Image from "next/image";

type ApiPortfolio = {
  id: string;
  slug: string;
  displayName: string | null;
  headline: string | null;
  bio: string | null;
  contactEmail: string | null;
  location: string | null;
  heroImageUrl: string | null;
  skills: Array<{ value: string }>;
  links: Array<{ label: string; url: string }>;
  experiences: Array<{ company: string; role: string; start: string; end: string; highlights: unknown }>;
  educations: Array<{ school: string; degree: string; start: string; end: string }>;
  projects: Array<{ name: string; description: string; url: string | null; highlights: unknown }>;
  resumeUploads: Array<{ id: string; fileName: string }>;
};

function toLines(items: string[]): string {
  return items.join("\n");
}

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toJsonText(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function safeJsonArray<T>(value: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function OnboardingForm({ initial }: { initial: ApiPortfolio }) {
  const [portfolio, setPortfolio] = React.useState<ApiPortfolio>(initial);
  const [status, setStatus] = React.useState<string>("");
  const [isBusy, setIsBusy] = React.useState(false);

  const [displayName, setDisplayName] = React.useState(initial.displayName || "");
  const [headline, setHeadline] = React.useState(initial.headline || "");
  const [bio, setBio] = React.useState(initial.bio || "");
  const [contactEmail, setContactEmail] = React.useState(initial.contactEmail || "");
  const [location, setLocation] = React.useState(initial.location || "");
  const [skillsText, setSkillsText] = React.useState(toLines(initial.skills.map((item) => item.value)));
  const [linksJson, setLinksJson] = React.useState(toJsonText(initial.links));
  const [experiencesJson, setExperiencesJson] = React.useState(toJsonText(initial.experiences));
  const [educationsJson, setEducationsJson] = React.useState(toJsonText(initial.educations));
  const [projectsJson, setProjectsJson] = React.useState(toJsonText(initial.projects));

  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [heroFile, setHeroFile] = React.useState<File | null>(null);

  async function refresh() {
    const response = await fetch("/api/portfolio", { cache: "no-store" });
    const data = await response.json();
    setPortfolio(data.portfolio);

    setDisplayName(data.portfolio.displayName || "");
    setHeadline(data.portfolio.headline || "");
    setBio(data.portfolio.bio || "");
    setContactEmail(data.portfolio.contactEmail || "");
    setLocation(data.portfolio.location || "");
    setSkillsText(toLines(data.portfolio.skills.map((item: { value: string }) => item.value)));
    setLinksJson(toJsonText(data.portfolio.links));
    setExperiencesJson(toJsonText(data.portfolio.experiences));
    setEducationsJson(toJsonText(data.portfolio.educations));
    setProjectsJson(toJsonText(data.portfolio.projects));
  }

  async function uploadResume() {
    if (!resumeFile) return;
    setIsBusy(true);
    setStatus("Uploading resume...");

    const formData = new FormData();
    formData.append("file", resumeFile);

    const uploadResponse = await fetch("/api/resume/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok) {
      setStatus(uploadData.error || "Failed to upload resume.");
      setIsBusy(false);
      return;
    }

    setStatus("Parsing resume with AI...");

    const parseResponse = await fetch("/api/resume/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId: uploadData.upload.id }),
    });

    const parseData = await parseResponse.json();
    if (!parseResponse.ok) {
      setStatus(parseData.error || "Failed to parse resume.");
      setIsBusy(false);
      return;
    }

    await refresh();
    setStatus("Resume parsed and form prefilled.");
    setIsBusy(false);
  }

  async function uploadHero() {
    if (!heroFile) return;
    setIsBusy(true);
    setStatus("Uploading hero image...");

    const formData = new FormData();
    formData.append("file", heroFile);

    const response = await fetch("/api/hero/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "Failed to upload hero image.");
      setIsBusy(false);
      return;
    }

    await refresh();
    setStatus("Hero image uploaded.");
    setIsBusy(false);
  }

  async function saveProfile() {
    setIsBusy(true);
    setStatus("Saving profile...");

    const payload = {
      displayName,
      headline,
      bio,
      contactEmail,
      location,
      skills: parseLines(skillsText),
      links: safeJsonArray<{ label: string; url: string }>(linksJson, []),
      experiences: safeJsonArray<{
        company: string;
        role: string;
        start: string;
        end: string;
        highlights: string[];
      }>(experiencesJson, []),
      educations: safeJsonArray<{
        school: string;
        degree: string;
        start: string;
        end: string;
      }>(educationsJson, []),
      projects: safeJsonArray<{
        name: string;
        description: string;
        url?: string;
        highlights: string[];
      }>(projectsJson, []),
    };

    const response = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(typeof data.error === "string" ? data.error : "Failed to save profile.");
      setIsBusy(false);
      return;
    }

    setPortfolio(data.portfolio);
    setStatus("Profile saved.");
    setIsBusy(false);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">1. Upload Resume</h2>
        <p className="mt-1 text-sm text-slate-600">Upload PDF or DOCX, then parse it with AI into structured fields.</p>
        <input
          className="mt-3 block w-full rounded-lg border border-slate-300 p-2 text-sm"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
        />
        <button
          className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="button"
          disabled={!resumeFile || isBusy}
          onClick={uploadResume}
        >
          Upload and Parse
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">2. Upload Hero Image</h2>
        <input
          className="mt-3 block w-full rounded-lg border border-slate-300 p-2 text-sm"
          type="file"
          accept="image/*"
          onChange={(event) => setHeroFile(event.target.files?.[0] || null)}
        />
        <button
          className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="button"
          disabled={!heroFile || isBusy}
          onClick={uploadHero}
        >
          Upload Image
        </button>
        {portfolio.heroImageUrl ? (
          <Image
            src={portfolio.heroImageUrl}
            alt="Hero preview"
            className="mt-3 h-32 w-full rounded-lg object-cover"
            width={1200}
            height={400}
          />
        ) : null}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">3. Edit Profile Data</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 p-2 text-sm" placeholder="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <input className="rounded-lg border border-slate-300 p-2 text-sm" placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <input className="rounded-lg border border-slate-300 p-2 text-sm" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          <input className="rounded-lg border border-slate-300 p-2 text-sm" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <textarea className="mt-3 min-h-24 w-full rounded-lg border border-slate-300 p-2 text-sm" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-600">Skills (one per line)</label>
        <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 p-2 text-sm" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />

        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-600">Links JSON</label>
        <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 p-2 text-sm font-mono" value={linksJson} onChange={(e) => setLinksJson(e.target.value)} />

        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-600">Experience JSON</label>
        <textarea className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 p-2 text-sm font-mono" value={experiencesJson} onChange={(e) => setExperiencesJson(e.target.value)} />

        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-600">Education JSON</label>
        <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 p-2 text-sm font-mono" value={educationsJson} onChange={(e) => setEducationsJson(e.target.value)} />

        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-600">Projects JSON</label>
        <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 p-2 text-sm font-mono" value={projectsJson} onChange={(e) => setProjectsJson(e.target.value)} />

        <button
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="button"
          disabled={isBusy}
          onClick={saveProfile}
        >
          Save Profile
        </button>
      </section>

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </div>
  );
}
