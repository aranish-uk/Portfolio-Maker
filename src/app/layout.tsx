import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://portfolio-maker.vercel.app"),
  title: {
    default: "Portfolio Maker | AI-Powered Resume to Website",
    template: "%s | Portfolio Maker",
  },
  description: "Transform your resume into a stunning, professional portfolio website in seconds with AI. Support for PDF, DOCX, and custom themes.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Portfolio Maker",
    title: "Portfolio Maker | AI-Powered Resume to Website",
    description: "Transform your resume into a stunning, professional portfolio website in seconds with AI.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Maker Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Maker | AI-Powered Resume to Website",
    description: "Transform your resume into a stunning, professional portfolio website in seconds with AI.",
    images: ["/opengraph-image.png"],
    creator: "@portfolio_maker",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  keywords: ["portfolio maker", "resume to website", "ai portfolio", "nextjs portfolio", "resume builder"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
