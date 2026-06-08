import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { PageBoot } from "@/components/page-boot";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const siteUrl = "https://black-swan-intelligence.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Black Swan — The intelligence layer for misogyny risk",
    template: "%s · Black Swan",
  },
  description:
    "Black Swan is a proprietary language intelligence model that detects, measures, and rates misogyny risk across digital content, conversations, datasets, and AI outputs — before harm scales.",
  keywords: [
    "misogyny detection",
    "AI safety",
    "trust and safety",
    "content moderation",
    "risk scoring",
    "gendered harm",
    "dataset auditing",
    "brand safety",
    "platform governance",
  ],
  authors: [{ name: "Black Swan" }],
  openGraph: {
    title: "Black Swan — The intelligence layer for misogyny risk",
    description:
      "Detect, measure, and rate misogyny risk across content, conversations, datasets, and AI outputs before harm scales.",
    url: siteUrl,
    siteName: "Black Swan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Swan — The intelligence layer for misogyny risk",
    description:
      "Proprietary AI for gendered harm detection, measurement, and governance.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1320",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PageBoot>{children}</PageBoot>
      </body>
    </html>
  );
}
