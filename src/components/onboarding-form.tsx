"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

    if (resumeFile.size > 1 * 1024 * 1024) {
      setStatus("Resume file too large (max 1MB).");
      setIsBusy(false);
      return;
    }

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

    if (heroFile.size > 2 * 1024 * 1024) {
      setStatus("Image too large (max 2MB).");
      setIsBusy(false);
      return;
    }

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
    setStatus("Saved! moving to next step...");
    router.refresh();
    router.push("/dashboard/publish");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      {/* Step 1: Resume Upload */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">
            1
          </div>
          <h2 className="text-lg font-semibold text-slate-100">Upload Resume</h2>
        </div>

        <p className="mb-6 text-sm text-slate-400">
          Upload your existing resume (PDF or DOCX). We'll use AI to extract your details and pre-fill your portfolio.
        </p>

        <div className="group relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-8 text-center transition-colors hover:border-indigo-500/50 hover:bg-slate-900">
          <input
            className="absolute inset-0 cursor-pointer opacity-0"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
            disabled={isBusy}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-slate-800 p-3 text-slate-400 group-hover:text-indigo-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-300">
              {resumeFile ? resumeFile.name : "Click or drag to upload"}
            </p>
            <p className="text-xs text-slate-500">PDF or DOCX up to 1MB</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            type="button"
            disabled={!resumeFile || isBusy}
            onClick={uploadResume}
          >
            {isBusy && status.includes("resume") ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
            ) : null}
            Upload & Parse
          </button>
        </div>
      </section>

      {/* Step 2: Hero Image */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">
            2
          </div>
          <h2 className="text-lg font-semibold text-slate-100">Hero Image</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Choose a professional photo for your portfolio header (Max 2MB).
            </p>
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100 file:mr-4 file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-indigo-400 hover:file:bg-slate-700"
              type="file"
              accept="image/*"
              onChange={(event) => setHeroFile(event.target.files?.[0] || null)}
              disabled={isBusy}
            />
            <button
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              type="button"
              disabled={!heroFile || isBusy}
              onClick={uploadHero}
            >
              {isBusy && status.includes("Hero") ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              ) : null}
              Upload Image
            </button>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {portfolio.heroImageUrl ? (
              <Image
                src={portfolio.heroImageUrl}
                alt="Hero preview"
                className="h-full w-full object-cover"
                width={600}
                height={400}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-600">
                <span className="text-sm">No image uploaded</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Step 3: Profile Details */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">
            3
          </div>
          <h2 className="text-lg font-semibold text-slate-100">Details</h2>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Display Name <span className="text-red-400">*</span></label>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Jane Doe" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Headline <span className="text-red-400">*</span></label>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Senior Software Engineer" value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Contact Email <span className="text-red-400">*</span></label>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="jane@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Location</label>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="San Francisco, CA" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Bio <span className="text-red-400">*</span></label>
            <textarea className="min-h-[100px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Brief professional summary..." value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Skills (one per line)</label>
            <textarea className="min-h-[100px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Links (JSON)</label>
              <textarea className="min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={linksJson} onChange={(e) => setLinksJson(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Education (JSON)</label>
              <textarea className="min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={educationsJson} onChange={(e) => setEducationsJson(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Experience (JSON)</label>
            <textarea className="min-h-[150px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={experiencesJson} onChange={(e) => setExperiencesJson(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Projects (JSON)</label>
            <textarea className="min-h-[150px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={projectsJson} onChange={(e) => setProjectsJson(e.target.value)} />
          </div>

          <div className="flex justify-end pt-4">
            <button
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-green-500 disabled:opacity-50"
              type="button"
              disabled={isBusy}
              onClick={saveProfile}
            >
              {isBusy && status.includes("Saving") ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              ) : null}
              Save Profile
            </button>
          </div>
        </div>
      </section>

      {/* Status Toasts / Alerts */}
      {status ? (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`flex max-w-sm items-center gap-3 rounded-lg border p-4 shadow-xl backdrop-blur-md ${status.toLowerCase().includes("fail") || status.toLowerCase().includes("error")
            ? "border-red-500/50 bg-red-950/90 text-red-200"
            : "border-indigo-500/50 bg-indigo-950/90 text-indigo-200"
            }`}>
            {status.toLowerCase().includes("fail") || status.toLowerCase().includes("error") ? (
              <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="h-5 w-5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            )}
            <p className="text-sm font-medium">{status}</p>
            <button onClick={() => setStatus("")} className="ml-auto opacity-70 hover:opacity-100"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
