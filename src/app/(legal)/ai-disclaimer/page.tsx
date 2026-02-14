import React from "react";

export default function AIDisclaimerPage() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-20 text-slate-300">
            <h1 className="mb-8 text-3xl font-bold text-white">AI Extraction Disclaimer</h1>
            <div className="prose prose-invert max-w-none">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Automated Processing</h3>
                <p>Portfolio Maker uses artificial intelligence and machine learning algorithms to extract information from your uploaded resume and generate portfolio content. While we strive for high accuracy, these systems are not perfect.</p>

                <h3>2. Potential Errors</h3>
                <p>The generated content may contain:</p>
                <ul>
                    <li>Inaccuracies in dates, titles, or descriptions.</li>
                    <li>Missing information that was visually complex in your document.</li>
                    <li>Formatting errors or hallucinations (text that wasn't in the original).</li>
                </ul>

                <h3>3. User Responsibility</h3>
                <p><strong>You are responsible for reviewing and verifying all generated content.</strong> Do not rely solely on the AI output for professional applications. You must edit and correct any errors before publishing your portfolio.</p>

                <h3>4. Not Professional Advice</h3>
                <p>The Service is a tool for visualization and does not constitute professional career counseling or resume writing advice.</p>
            </div>
        </main>
    );
}
