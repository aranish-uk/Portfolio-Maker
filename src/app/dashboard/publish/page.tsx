"use client";

import { useEffect, useState } from "react";

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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h1 className="text-2xl font-bold text-slate-900">Publish</h1>
      <p className="mt-1 text-sm text-slate-600">Choose your slug and publish your portfolio.</p>
      <input
        className="mt-4 w-full rounded-lg border border-slate-300 p-2 text-sm"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <button className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white" type="button" onClick={publish}>
        Publish
      </button>

      {publishedSlug ? (
        <p className="mt-3 text-sm text-slate-800">
          Public URL: <a className="text-indigo-600" href={`/u/${publishedSlug}`}>{`/u/${publishedSlug}`}</a>
        </p>
      ) : null}

      {status ? <p className="mt-2 text-sm text-slate-700">{status}</p> : null}
    </div>
  );
}
