"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TestimonialModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showWebsite, setShowWebsite] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, content, isAnonymous, showWebsite }),
            });

            if (!res.ok) throw new Error("Failed to submit");

            router.refresh();
            onClose();
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-100">Leave a Review</h2>
                <p className="mb-4 text-sm text-slate-400">Tell us what you think about Portfolio Maker.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-colors ${rating >= star ? "text-yellow-400" : "text-slate-600 hover:text-slate-500"}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">Your Feedback</label>
                        <textarea
                            required
                            minLength={10}
                            maxLength={500}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                            rows={4}
                            placeholder="I love using Portfolio Maker because..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                            />
                            Submit Anonymously (Hide Name & Photo)
                        </label>

                        {!isAnonymous && (
                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={showWebsite}
                                    onChange={(e) => setShowWebsite(e.target.checked)}
                                    className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                                />
                                Show Link to My Portfolio
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
