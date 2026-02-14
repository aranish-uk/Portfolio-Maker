import React from "react";

export default function CookiesPage() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-20 text-slate-300">
            <h1 className="mb-8 text-3xl font-bold text-white">Cookie Policy</h1>
            <div className="prose prose-invert max-w-none">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <h3>1. What Are Cookies?</h3>
                <p>Cookies are small text files stored on your device when you visit a website. They help us recognize you and remember your preferences.</p>

                <h3>2. How We Use Cookies</h3>
                <ul>
                    <li><strong>Essential Cookies:</strong> Required for login and security (e.g., session tokens). You cannot opt out of these.</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the site to improve it.</li>
                    <li><strong>Functional Cookies:</strong> Remember your theme preferences and settings.</li>
                </ul>

                <h3>3. Managing Cookies</h3>
                <p>You can control or delete cookies through your browser settings. However, disabling essential cookies may prevent you from logging in or using the Dashboard.</p>

                <h3>4. GDPR & CCPA</h3>
                <p>We respect your privacy rights under GDPR and CCPA. We do not track you across other websites or sell your browsing data.</p>
            </div>
        </main>
    );
}
