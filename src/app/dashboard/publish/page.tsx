"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PublishPage() {
  const [slug, setSlug] = useState("");
  const [publishedSlug, setPublishedSlug] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setSlug(data.portfolio.slug);
        if (data.portfolio.published) {
          setPublishedSlug(data.portfolio.slug);
        }
      });
  }, []);

  async function publish() {
    const response = await fetch("/api/portfolio/slug", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Failed to publish.");
      return;
    }

    setPublishedSlug(data.slug);
    setSlug(data.slug);
    setStatus("Portfolio published.");
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h1 className="text-2xl font-bold text-slate-100">Publish</h1>
      <p className="mt-1 text-sm text-slate-400">Choose your slug and publish your portfolio.</p>
      <input
        className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <button className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500" type="button" onClick={publish}>
        Publish
      </button>

      {publishedSlug ? (
        <p className="mt-3 text-sm text-slate-200">
          Public URL: <a className="text-indigo-400 hover:text-indigo-300" href={`/u/${publishedSlug}`}>{`/u/${publishedSlug}`}</a>
        </p>
      ) : null}

      {status ? <p className="mt-2 text-sm text-slate-300">{status}</p> : null}

      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
        <Link href="/dashboard/theme" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
          Next: Customize Theme →
        </Link>
      </div>
    </div>
  );
}
