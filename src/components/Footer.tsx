"use client";
import Image from "next/image";
import Link from "next/link";
import { SITE, PARTNER } from "@/config/site";
import { PAGES_LIVE } from "@/config/pages";
import { SERVICES_DATA } from "@/config/services";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: PAGES_LIVE.about ? "/about" : "#contact" },
  { label: "Industries", href: "/#industries" },
  { label: "Shop", href: "#shop" },
  { label: "Contact", href: "#contact" },
];

const SOLUTION_LINKS = [
  { label: "Device deployment", href: "#contact?need=device-deployment" },
  { label: "Device management", href: "#contact?need=device-management" },
  { label: "On-site support", href: "#contact?need=on-site-support" },
  { label: "AI and automation", href: "#contact?need=ai" },
  { label: "App development", href: "#contact?need=app-and-web-development" },
];

// Stroke-style SVG icons — same weight / linecap as lucide-react
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const SOCIAL_LINKS = [
  { key: "facebook",  href: SITE.social.facebook,  label: "Azure Innovations on Facebook",  Icon: FacebookIcon  },
  { key: "instagram", href: SITE.social.instagram, label: "Azure Innovations on Instagram", Icon: InstagramIcon },
  { key: "linkedin",  href: SITE.social.linkedin,  label: "Azure Innovations on LinkedIn",  Icon: LinkedInIcon  },
] as const;

const HAIRLINE = "color-mix(in srgb, var(--pink-300) 20%, transparent)";

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href || "#"}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      aria-label={label}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "var(--pink-800)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--on-dark-muted)",
        textDecoration: "none",
        flexShrink: 0,
        transition: "background 200ms, color 200ms, transform 200ms",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = "#FFFFFF";
        el.style.color = "#000000";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "var(--pink-800)";
        el.style.color = "var(--on-dark-muted)";
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      data-section="footer"
      data-surface="dark"
      style={{
        background: "var(--pink-950)",
        borderRadius: "48px 48px 0 0",
        marginTop: 120,
        padding: "96px 0 40px",
      }}
    >
      <style>{`
        .footer-logo { height: var(--logo-h, 44px); width: auto; display: block; }
        @media (max-width: 639px) { :root { --logo-h: 36px; } }
        .footer-link {
          font-size: 14px;
          color: var(--on-dark-muted);
          text-decoration: none;
          transition: color 200ms;
        }
        .footer-link:hover { color: #fff; }
      `}</style>
      <div className="container">
        <div
          style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.4fr", gap: 48, marginBottom: 64 }}
          className="max-lg:grid-cols-2 max-sm:grid-cols-1"
        >
          {/* ── Brand ── */}
          <div>
            <Link href="/" style={{ display: "inline-flex", marginBottom: 24 }}>
              <Image
                src="/brand/logo-footer.png"
                alt="Azure Innovations"
                width={1920}
                height={830}
                className="footer-logo"
              />
            </Link>

            {SOCIAL_LINKS.some(({ href }) => href) && (
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                {SOCIAL_LINKS.filter(({ href }) => !!href).map(({ key, href, label, Icon }) => (
                  <SocialBtn key={key} href={href} label={label}>
                    <Icon />
                  </SocialBtn>
                ))}
              </div>
            )}

            <div style={{ width: "100%", height: 1, background: HAIRLINE, marginBottom: 24 }} />
            <p style={{ fontSize: 14, color: "var(--on-dark-muted)", lineHeight: 1.6 }}>
              {PARTNER.apple} and {PARTNER.microsoft}, serving businesses and organisations across Delhi NCR.
            </p>
          </div>

          {/* ── Company ── */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--on-dark-muted)", marginBottom: 20 }}>Company</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href} className="footer-link">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* ── Services + Solutions ── */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--on-dark-muted)", marginBottom: 20 }}>Services</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {SERVICES_DATA.map((svc) => (
                <li key={svc.id}>
                  <Link href={svc.pillHref} className="footer-link">{svc.title}</Link>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--on-dark-muted)", marginBottom: 20 }}>Solutions</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {SOLUTION_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href} className="footer-link">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* ── Contact Us ── */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--on-dark-muted)", marginBottom: 20 }}>Contact Us</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SITE.contact.email && (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Mail size={15} style={{ color: "var(--on-dark-muted)", marginTop: 2, flexShrink: 0 }} />
                  <a href={`mailto:${SITE.contact.email}`} className="footer-link">{SITE.contact.email}</a>
                </div>
              )}
              {SITE.contact.phone && (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Phone size={15} style={{ color: "var(--on-dark-muted)", marginTop: 2, flexShrink: 0 }} />
                  <a href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`} className="footer-link">{SITE.contact.phone}</a>
                </div>
              )}
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <MessageCircle size={15} style={{ color: "var(--on-dark-muted)", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, color: "var(--on-dark)", marginBottom: 2 }}>WhatsApp</div>
                  <a
                    href={SITE.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    style={{ fontSize: 13 }}
                  >
                    {SITE.contact.phone}
                  </a>
                </div>
              </div>
              {SITE.locations.filter((l) => l.address).map((loc) => (
                <div key={loc.name} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={15} style={{ color: "var(--on-dark-muted)", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, color: "var(--on-dark)", marginBottom: 2 }}>{loc.name}</div>
                    <div style={{ fontSize: 13, color: "var(--on-dark-muted)", lineHeight: 1.5 }}>{loc.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <p style={{ fontSize: 13, color: "var(--on-dark-muted)" }}>© 2026 Azure Innovations. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/privacy" className="footer-link" style={{ fontSize: 13 }}>Privacy Policy</Link>
            <Link href="/terms" className="footer-link" style={{ fontSize: 13 }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
