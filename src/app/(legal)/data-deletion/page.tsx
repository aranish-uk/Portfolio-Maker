import React from "react";

export default function DataDeletionPage() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-20 text-slate-300">
            <h1 className="mb-8 text-3xl font-bold text-white">Data Deletion Policy</h1>
            <div className="prose prose-invert max-w-none">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Your Right to Delete</h3>
                <p>You have the right to request the complete deletion of your account and all associated data at any time.</p>

                <h3>2. How to Delete Your Account</h3>
                <p>You can delete your account directly through the Dashboard:</p>
                <ol>
                    <li>Log in to your Dashboard.</li>
                    <li>Navigate to the "Account" or "Settings" section (typically at the bottom of the page).</li>
                    <li>Click "Delete Account" and follow the confirmation prompts.</li>
                </ol>
                <p>Alternatively, you can email a deletion request to privacy@aranish.uk.</p>

                <h3>3. What Gets Deleted?</h3>
                <p>When you delete your account, we strictly remove:</p>
                <ul>
                    <li>Your user profile and login credentials.</li>
                    <li>Your generated portfolio website and slug.</li>
                    <li>All uploaded files (Resumes, Images) from our storage.</li>
                    <li>Any reviews or testimonials you have posted.</li>
                </ul>
                <p>This action is <strong>permanent and irreversible</strong>.</p>

                <h3>4. Timeline</h3>
                <p>Automated deletion via the Dashboard is immediate. Email requests are processed within 30 days.</p>
            </div>
        </main>
    );
}
