import React from "react";

export default function PrivacyPage() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-20 text-slate-300">
            <h1 className="mb-8 text-3xl font-bold text-white">Privacy Policy</h1>
            <div className="prose prose-invert max-w-none">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Data Collection</h3>
                <p>We collect the following data to provide our Service:</p>
                <ul>
                    <li><strong>Account Data:</strong> Email address and encrypted password (or OAuth tokens).</li>
                    <li><strong>User Content:</strong> Resumes (PDF/DOCX), profile photos, and portfolio details you enter.</li>
                    <li><strong>Usage Data:</strong> Analytics on how you interact with the site (cookies).</li>
                </ul>

                <h3>2. How We Use Your Data</h3>
                <p>We use your data solely to:</p>
                <ul>
                    <li>Authenticate you and secure your account.</li>
                    <li>Parse your resume and generate your portfolio website.</li>
                    <li>Improve the functionality of the Service.</li>
                </ul>
                <p>We do <strong>not</strong> sell your personal data to third parties.</p>

                <h3>3. Data Retention</h3>
                <p>We retain your data as long as your account is active. If you delete your account, your data (including resumes and images) is permanently deleted from our systems immediately.</p>

                <h3>4. Third-Party Services</h3>
                <p>We use trusted third-party providers for infrastructure:</p>
                <ul>
                    <li><strong>Vercel:</strong> Hosting and database storage.</li>
                    <li><strong>Vercel Blob:</strong> File storage for images and resumes.</li>
                    <li><strong>OpenAI (or similar):</strong> Processing text for parsing (data is not trained upon).</li>
                </ul>

                <h3>5. Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                    <li>Access the personal data we hold about you.</li>
                    <li>Request corrections to your data.</li>
                    <li>Request full deletion of your account and data.</li>
                    <li>Export your data.</li>
                </ul>

                <h3>6. Security</h3>
                <p>We use industry-standard encryption (SSL/TLS) and secure database practices. However, no method of transmission over the internet is 100% secure.</p>

                <h3>7. Contact</h3>
                <p>For privacy concerns, contact: privacy@aranish.uk</p>
            </div>
        </main>
    );
}
