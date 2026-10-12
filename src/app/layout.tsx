import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/config/site";
import LenisProvider from "@/components/LenisProvider";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AgentationDev from "@/components/AgentationDev";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apple Business Partner & IT Solutions in Delhi NCR | Azure Innovations",
  description: SITE.description,
  openGraph: {
    title: "Apple Business Partner & IT Solutions in Delhi NCR | Azure Innovations",
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
  other: {
    build: process.env.NEXT_PUBLIC_BUILD_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "unknown",
    "build-note": process.env.NEXT_PUBLIC_BUILD_NOTE ?? "unknown",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <noscript><style>{`[style*="opacity: 0"]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style></noscript>
        <LenisProvider>
          {children}
          <WhatsAppFloat />
          <AgentationDev />
        </LenisProvider>
      </body>
    </html>
  );
}
