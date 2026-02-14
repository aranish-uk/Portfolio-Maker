import React from "react";

export default function TermsPage() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-20 text-slate-300">
            <h1 className="mb-8 text-3xl font-bold text-white">Terms of Service</h1>
            <div className="prose prose-invert max-w-none">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Acceptance of Terms</h3>
                <p>By creating an account or using Portfolio Maker ("the Service"), you agree to be bound by these Terms. If you do not agree, you must stop using the Service.</p>

                <h3>2. Eligibility</h3>
                <p>You must be at least 18 years old to use this Service. By using it, you represent and warrant that you meet this requirement.</p>

                <h3>3. User Accounts</h3>
                <p>You are responsible for maintaining the security of your account credentials. You are responsible for all activities that occur under your account.</p>

                <h3>4. IP & Content Ownership</h3>
                <p><strong>You retain full ownership</strong> of your resume, portfolio data, and any content you upload. We do not claim ownership over your personal data.</p>
                <p>By uploading content, you grant Portfolio Maker a limited, non-exclusive, revocable license to store, process, display, and distribute your content solely for the purpose of providing the Service (e.g., generating and hosting your portfolio).</p>

                <h3>5. Acceptable Use</h3>
                <p>You agree NOT to upload:</p>
                <ul>
                    <li>Content that infringes on guarantees or copyrights of others.</li>
                    <li>Illegal, hateful, fraudulent, or abusive content.</li>
                    <li>Malware, viruses, or harmful code.</li>
                </ul>
                <p>We reserve the right to terminate accounts that violate these policies without notice.</p>

                <h3>6. AI & Parsing Disclaimer</h3>
                <p>Our Service uses automated systems to parse resumes and generate portfolios. We do <strong>not</strong> guarantee the accuracy, completeness, or quality of the output. You are responsible for verifying and editing your portfolio before sharing it.</p>

                <h3>7. No Warranty</h3>
                <p>The Service is provided "AS IS" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free.</p>

                <h3>8. Limitation of Liability</h3>
                <p>To the fullest extent permitted by law, Portfolio Maker shall not be liable for any indirect, incidental, or consequential damages, including loss of data. Our total liability shall not exceed the amount you paid to us (if any) in the last 12 months.</p>

                <h3>9. Termination</h3>
                <p>We reserve the right to suspend or discontinue the Service at any time, for any reason, with or without notice. You may delete your account at any time.</p>

                <h3>10. Governing Law</h3>
                <p>These Terms are governed by the laws of the State of Arizona, USA, without regard to conflict of law principles.</p>

                <h3>11. Contact</h3>
                <p>For support or legal inquiries, please contact: support@aranish.uk</p>
            </div>
        </main>
    );
}
