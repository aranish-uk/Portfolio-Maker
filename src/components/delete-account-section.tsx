"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function DeleteAccountSection() {
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (confirmText !== "DELETE") return;

        setIsDeleting(true);
        try {
            const res = await fetch("/api/user/delete", { method: "DELETE" });
            if (res.ok) {
                await signOut({ callbackUrl: "/" });
            } else {
                alert("Failed to delete account. Please try again.");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
            setIsDeleting(false);
        }
    }

    if (!isConfirming) {
        return (
            <section className="mt-12 rounded-xl border border-red-900/50 bg-red-950/10 p-6">
                <h2 className="text-lg font-semibold text-red-200">Danger Zone</h2>
                <p className="mt-2 text-sm text-red-200/70">
                    Permanently delete your account, portfolio, and all associated data. This action cannot be undone.
                </p>
                <div className="mt-4">
                    <button
                        onClick={() => setIsConfirming(true)}
                        className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-900/50 hover:text-red-100"
                    >
                        Delete Account
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="mt-12 rounded-xl border border-red-500/50 bg-red-950/30 p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-red-200">Are you absolutely sure?</h2>
            <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-red-950 p-4 text-sm text-red-200">
                    <p className="font-bold">Warning: This will delete:</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1 opacity-80">
                        <li>Your account login</li>
                        <li>Your published portfolio site (slug will be released)</li>
                        <li>Your uploaded resume and images</li>
                        <li>Any reviews you have posted</li>
                    </ul>
                </div>

                <div>
                    <label className="block text-xs font-medium text-red-200 mb-1">
                        Type <span className="font-mono font-bold select-all">DELETE</span> to confirm
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full rounded-lg border border-red-900/50 bg-red-950/50 px-3 py-2 text-sm text-red-100 placeholder-red-900/50 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="DELETE"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={confirmText !== "DELETE" || isDeleting}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting..." : "Confirm Deletion"}
                    </button>
                    <button
                        onClick={() => {
                            setIsConfirming(false);
                            setConfirmText("");
                        }}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </section>
    );
}
