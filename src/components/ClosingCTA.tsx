"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/config/site";
import ImagePanel from "@/components/ui/ImagePanel";
import Pill from "@/components/ui/Pill";
import Tag from "@/components/ui/Tag";

const WHATSAPP_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.881a.5.5 0 0 0 .618.632l6.222-1.632A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 0 1-5.012-1.374l-.36-.213-3.692.969.986-3.604-.234-.37A9.792 9.792 0 0 1 2.182 12C2.182 6.572 6.572 2.182 12 2.182S21.818 6.572 21.818 12 17.428 21.818 12 21.818z" />
  </svg>
);

const PHONE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

export default function ClosingCTA() {
  const [mailtoHref, setMailtoHref] = useState(`mailto:${SITE.contact.email}`);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("?")) {
      const p = new URLSearchParams(hash.slice(hash.indexOf("?") + 1));
      const need = p.get("need");
      if (need && SITE.contact.email) {
        setMailtoHref(`mailto:${SITE.contact.email}?subject=${encodeURIComponent(`Enquiry: ${need}`)}`);
      }
    }
  }, []);

  const phoneHref = `tel:${SITE.contact.phone.replace(/\s/g, "")}`;

  return (
    <section
      id="contact"
      data-section="cta"
      data-surface="dark"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "clamp(480px, 55vw, 640px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background image */}
      <ImagePanel
        src="/images/desk-devices.jpg"
        alt=""
        scrim="brand"
        priority
        style={{ position: "absolute", inset: 0, borderRadius: 0 }}
        sizes="100vw"
      />

      {/* Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          paddingBlock: "clamp(96px, 12vw, 160px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Tag variant="on-dark">Contact</Tag>
        </div>

        <h2
          style={{
            fontSize: "clamp(36px, 5vw, 68px)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#fff",
            maxWidth: "18ch",
            marginBottom: 20,
          }}
        >
          Let&rsquo;s find the right technology for your organisation.
        </h2>

        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,.72)",
            maxWidth: 520,
            marginBottom: 44,
            lineHeight: 1.55,
          }}
        >
          Tell us what you need and our team will get back to you within one business day.
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {SITE.contact.email && (
            <Pill variant="white" href={mailtoHref}>
              Send an email
            </Pill>
          )}

          <Pill variant="white" href={phoneHref} style={{ gap: 8 }} aria-label={`Call Azure Innovations: ${SITE.contact.phone}`}>
            {PHONE_ICON}
            Call us
          </Pill>

          <Pill
            variant="outline-white"
            href={SITE.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ gap: 8 }}
          >
            {WHATSAPP_ICON}
            Chat on WhatsApp
          </Pill>
        </div>

        <p style={{ marginTop: 32, fontSize: 14, color: "rgba(255,255,255,.5)" }}>
          Naraina · Noida · Gurgaon
        </p>
      </div>
    </section>
  );
}
