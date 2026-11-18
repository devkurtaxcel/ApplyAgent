import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION = "Secure, AI-powered job application agent using Auth0 Token Vault.";

// Structured data: the app and its maker (same Person @id as www.kurtaxcel.com).
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://applyagent.kurtaxcel.com/#app",
  name: "ApplyAgent",
  url: "https://applyagent.kurtaxcel.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "An AI job-application agent that analyzes job descriptions and prepares applications, with the person approving every send. Built for the Authorized to Act hackathon.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: {
    "@type": "Person",
    "@id": "https://www.kurtaxcel.com/#person",
    name: "Kurt Axcel",
    alternateName: "Kurt Axcel Peñano",
    url: "https://www.kurtaxcel.com",
    sameAs: ["https://links.kurtaxcel.com", "https://github.com/devkurtaxcel", "https://devpost.com/devkurtaxcel"],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://applyagent.kurtaxcel.com"),
  title: "ApplyAgent | Authorized to Act",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  authors: [{ name: "Kurt Axcel", url: "https://www.kurtaxcel.com" }],
  creator: "Kurt Axcel",
  openGraph: {
    type: "website",
    url: "https://applyagent.kurtaxcel.com",
    siteName: "ApplyAgent",
    title: "ApplyAgent | Authorized to Act",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyAgent | Authorized to Act",
    description: DESCRIPTION,
    creator: "@POVniAxcel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
