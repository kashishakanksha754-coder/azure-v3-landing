"use client";
import Tag from "@/components/ui/Tag";
import Pill from "@/components/ui/Pill";
import ImagePanel from "@/components/ui/ImagePanel";
import { PAGES_LIVE } from "@/config/pages";
import { PARTNER, SITE } from "@/config/site";

// ── Checklist — confirmed data only ─────────────────────────────────────────
const CHECKS = [
  PARTNER.apple,
  PARTNER.microsoft,
  "Device deployment and configuration",
  "On-site support across Delhi, Noida and Gurgaon",
  "Annual maintenance contracts",
] as const;

const CHECK_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: 3 }}>
    <circle cx="8" cy="8" r="7.5" stroke="var(--pink-300)" />
    <path d="M5 8.5l2 1.8 4-4.6" stroke="var(--pink-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function About() {
  return (
    <section id="about" data-section="about" className="section" style={{ background: "var(--white)" }}>
      <style>{`
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; }
        @media (max-width: 1023px) { .about-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="container">
        <div className="about-grid" style={{ gap: "clamp(40px, 6vw, 96px)" }}>

          {/* LEFT — text */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ display: "inline-block", marginBottom: 24 }}>
              <Tag variant="outline">Our story</Tag>
            </span>
            <h2 style={{ maxWidth: "18ch", marginBottom: 20 }}>
              Your technology partner across Delhi NCR.
            </h2>
            <p style={{ fontSize: "clamp(16px, 1.5vw, 18px)", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 16, maxWidth: "52ch" }}>
              Azure Innovations is a Delhi NCR technology partner for Apple and Microsoft Surface. We supply the devices and look after them, from setup to support.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.4vw, 17px)", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 32, maxWidth: "52ch" }}>
              Genuine products with solutions, setup and support for businesses and organisations across Delhi, Noida and Gurgaon.
            </p>

            {/* Checklist */}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {CHECKS.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 16, color: "var(--ink)", lineHeight: 1.45 }}>
                  {CHECK_ICON}
                  {item}
                </li>
              ))}
            </ul>

            {/* Office location chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {SITE.locations.map((loc) => (
                <span key={loc.name} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  border: "1px solid var(--line)",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}>
                  {loc.name}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {PAGES_LIVE.about && <Pill href="/about">About us</Pill>}
              <Pill variant="outline" href="#contact">Get in touch</Pill>
            </div>
          </div>

          {/* RIGHT — image, stretches to full left-column height */}
          <div style={{ position: "relative", minHeight: "clamp(400px, 48vw, 620px)" }}>
            <ImagePanel
              src="/images/corporate.jpg"
              alt="Azure Innovations team at work in a modern office"
              scrim="bottom"
              priority={false}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "var(--radius-img)",
                "--brand-wash": "none",
              } as React.CSSProperties}
              sizes="(max-width: 1023px) 100vw, 50vw"
            >
              <span style={{ fontSize: 13, letterSpacing: "0.07em", color: "rgba(255,255,255,.65)" }}>
                Naraina · Noida · Gurgaon
              </span>
            </ImagePanel>
          </div>
        </div>
      </div>
    </section>
  );
}
