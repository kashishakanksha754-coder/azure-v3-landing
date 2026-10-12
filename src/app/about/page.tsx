import type { Metadata } from "next";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClosingCTA from "@/components/ClosingCTA";
import AboutHero from "@/components/about/AboutHero";
import Achievements from "@/components/about/Achievements";
import OurStory from "@/components/about/OurStory";
import Mission from "@/components/about/Mission";
import Vision from "@/components/about/Vision";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "About Azure Innovations | Apple Business Partner in Delhi NCR",
  description:
    "Azure Innovations is an Apple Business Partner and Microsoft Surface Partner, supplying genuine products with setup and support for businesses and organisations across Delhi NCR.",
  alternates: { canonical: "https://azureinnovations.co.in/about" },
  openGraph: {
    title: "About Azure Innovations | Apple Business Partner in Delhi NCR",
    description:
      "Azure Innovations is an Apple Business Partner and Microsoft Surface Partner, supplying genuine products with setup and support for businesses and organisations across Delhi NCR.",
    url: "https://azureinnovations.co.in/about",
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
    images: [{ url: `${SITE.url}/images/about.jpg`, width: 1200, height: 630, alt: "Azure Innovations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Azure Innovations | Apple Business Partner in Delhi NCR",
    description:
      "Azure Innovations is an Apple Business Partner and Microsoft Surface Partner, supplying genuine products with setup and support for businesses and organisations across Delhi NCR.",
    images: [`${SITE.url}/images/about.jpg`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      url: "https://azureinnovations.co.in/about",
      name: "About Azure Innovations",
      description:
        "Azure Innovations is an Apple Business Partner and Microsoft Surface Partner in Delhi NCR.",
      isPartOf: { "@type": "WebSite", url: SITE.url },
    },
    {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/brand/logo.png`,
      areaServed: "Delhi NCR",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.locations[0].address,
      },
      telephone: SITE.locations[0].phone || undefined,
    },
  ],
};

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ asProd?: string }>;
}) {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "";
  const isProdHost =
    /(^|\.)azureinnovations\.co\.in$/.test(host) ||
    (process.env.NEXT_PUBLIC_PRODUCTION_HOSTS ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
      .includes(host);

  const sp = await searchParams;
  const asProd = sp.asProd === "1";
  const showDrafts = !isProdHost && !asProd;
  if (showDrafts) console.warn("[About] Draft content visible — non-production host.");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main">
        <AboutHero />
        <Achievements showDrafts={showDrafts} />
        <OurStory showDrafts={showDrafts} />
        <Mission showDrafts={showDrafts} />
        <Vision showDrafts={showDrafts} />
        <div id="contact" data-surface="white">
          <ClosingCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
