import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Solutions from "@/components/Solutions";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Shop from "@/components/Shop";
import Testimonials from "@/components/Testimonials";
import SuccessStories from "@/components/SuccessStories";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";
import { SITE } from "@/config/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/brand/logo.png`,
      },
      ...SITE.locations
        .filter((l) => l.address)
        .map((loc) => ({
          "@type": "LocalBusiness",
          name: `${SITE.name} – ${loc.name}`,
          address: { "@type": "PostalAddress", streetAddress: loc.address },
          telephone: loc.phone || undefined,
          url: SITE.url,
        })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* 1 — Hero: light */}
        <div data-surface="white">
          <Hero />
        </div>

        {/* 2 — Trusted by */}
        <TrustedBy />

        {/* 3 — About strip */}
        <div data-surface="white">
          <About />
        </div>

        {/* 3b — Stats: pink-50 (self-contained) */}
        <Stats />

        {/* 4 — Solutions: pink-50 bg (self-contained) */}
        <Solutions />

        {/* 5 — Services: white (self-contained) */}
        <Services />

        {/* 6 — Industries: white (self-contained) */}
        <Industries />

        {/* 7 — Shop: white (self-contained) */}
        <Shop />

        {/* 8 — Testimonials: white (hidden until content approved) */}
        <div data-surface="white">
          <Testimonials />
        </div>

        {/* 9 — Success stories: grey (hidden until stories confirmed) */}
        <SuccessStories />

        {/* 10 — Closing CTA: dark gradient */}
        <ClosingCTA />
      </main>
      {/* 11 — Footer: dark */}
      <Footer />
    </>
  );
}
