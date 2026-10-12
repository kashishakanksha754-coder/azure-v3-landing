"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Pill from "@/components/ui/Pill";
import ImagePanel from "@/components/ui/ImagePanel";
import { PAGES_LIVE } from "@/config/pages";
import { SOLUTIONS_LIST } from "@/config/solutions";
import { SITE } from "@/config/site";
import { showDrafts } from "@/lib/env";

const EASE = [0.22, 1, 0.36, 1] as const;

const H_DESKTOP = 76;
const H_MOBILE  = 64;
const LOGO_DESKTOP = 40;
const LOGO_MOBILE  = 32;

// ── Shared contact helpers ────────────────────────────────────────────────────
const WA_URL = `${SITE.contact.whatsappUrl}?text=${encodeURIComponent("Hi, I’d like some help choosing the right technology.")}`;
const PHONE_URL = `tel:${SITE.contact.phone.replace(/\s/g, "")}`;

type MegaCol = {
  heading: string;
  items: { label: string; href: string; line?: string }[];
};

const APPLE_SURFACE_COL: MegaCol = {
  heading: "Apple and Surface",
  items: [
    { label: "Mac",               href: "#contact?need=mac" },
    { label: "iPhone",            href: "#contact?need=iphone" },
    { label: "iPad",              href: "#contact?need=ipad" },
    { label: "Apple Watch",       href: "#contact?need=apple-watch" },
    { label: "Accessories",       href: "#contact?need=accessories" },
    { label: "Microsoft Surface", href: "#contact?need=surface" },
  ],
};

const SERVICES_COL: MegaCol = {
  heading: "Services",
  items: [
    { label: "Device deployment",  href: "#contact?need=device-deployment",  line: "Configure, enroll and deliver" },
    { label: "Device management",  href: "#contact?need=device-management",  line: "Ongoing MDM and support" },
    { label: "On-site support",    href: "#contact?need=on-site-support",    line: "Engineers at your location" },
    { label: "AMC and IT support", href: "#contact?need=amc-it-support",     line: "Annual maintenance contracts" },
  ],
};

function getSolutionsCol(): MegaCol {
  const drafts = showDrafts();
  const items = SOLUTIONS_LIST
    .filter((s) => !s.hiddenInProd || drafts)
    .map((s) => ({
      label: s.title,
      href: PAGES_LIVE.solutions ? `/solutions/${s.slug}` : `#contact?need=${s.slug}`,
    }));
  return { heading: "Solutions", items };
}

// ── Shared promo tile content ─────────────────────────────────────────────────
function PromoContent({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ width: "100%", textAlign: "left" }}>
      <span style={{
        display: "block",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,.90)",
        marginBottom: 10,
      }}>
        Need help choosing?
      </span>
      <p style={{
        fontSize: "clamp(24px, 2vw, 28px)",
        fontWeight: 400,
        letterSpacing: "-0.025em",
        lineHeight: 1.1,
        color: "#fff",
        marginBottom: 8,
      }}>
        Talk to an Azure expert
      </p>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,.92)", lineHeight: 1.5, marginBottom: 20 }}>
        Our team will help you pick the right devices and support.
      </p>
      {/* Buttons: flex:1 so they share width evenly and stack full-width when narrow */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <Pill
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="white"
          aria-label="Chat with Azure Innovations on WhatsApp"
          style={{ color: "var(--pink-700)", flex: "1 1 auto", justifyContent: "center", height: 44 }}
          onClick={onClose}
        >
          WhatsApp us
        </Pill>
        <Pill
          href={PHONE_URL}
          variant="outline-white"
          aria-label="Call Azure Innovations"
          style={{ flex: "1 1 auto", justifyContent: "center", height: 44 }}
          onClick={onClose}
        >
          Call us
        </Pill>
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.90)", letterSpacing: "0.04em" }}>
        Naraina · Noida · Gurgaon
      </span>
    </div>
  );
}

// ── Full-width mega menu ───────────────────────────────────────────────────
function MegaMenu({
  open,
  headerH,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  headerH: number;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const reduced = useReducedMotion();
  const solutionsCol = getSolutionsCol();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="mega-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: headerH,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,.04)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              zIndex: 55,
            }}
          />

          {/* Full-width panel */}
          <motion.div
            key="mega-panel"
            role="dialog"
            aria-label="What we do"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 6, transition: { duration: 0.14, ease: EASE } }}
            transition={{ duration: 0.22, ease: EASE }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
              position: "fixed",
              top: headerH,
              left: 0,
              right: 0,
              zIndex: 60,
            }}
          >
            <div style={{ height: 8 }} />
            <div
              style={{
                background: "#FFFFFF",
                borderBottom: "1px solid var(--line)",
                boxShadow: "0 24px 64px rgba(27,21,25,.10)",
              }}
            >
              <div
                className="container"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1.15fr",
                  columnGap: 56,
                  paddingBlock: 40,
                  alignItems: "stretch",
                }}
              >
                {[APPLE_SURFACE_COL, SERVICES_COL, solutionsCol].map((col) => (
                  <div key={col.heading}>
                    <p style={{
                      paddingLeft: 12,
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: 20,
                    }}>
                      {col.heading}
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            style={{
                              display: "block",
                              padding: "8px 12px",
                              borderRadius: 10,
                              textDecoration: "none",
                              transition: "background 150ms",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--pink-50)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ display: "block", fontSize: 16, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{item.label}</span>
                            {item.line && <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginTop: 1 }}>{item.line}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Promo image panel — stretches to tallest column height */}
                <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch" }}>
                  <ImagePanel
                    src="/images/business.jpg"
                    alt="Azure Innovations team ready to help"
                    scrim="bottom"
                    objectPosition="center 70%"
                    style={{
                      flex: 1,
                      borderRadius: 28,
                      minHeight: "clamp(260px, 28vw, 400px)",
                      "--brand-wash": "none",
                    } as React.CSSProperties}
                    sizes="(max-width: 1679px) 22vw, 380px"
                  >
                    <PromoContent onClose={onClose} />
                  </ImagePanel>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Mobile accordion ──────────────────────────────────────────────────────
function MobileAccordion({
  label,
  col,
  onClose,
}: {
  label: string;
  col: MegaCol;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div style={{ borderBottom: "1px solid var(--line)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "-0.03em",
          color: "var(--text)",
          padding: "14px 0",
        }}
      >
        {label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22, ease: EASE }} style={{ display: "flex" }}>
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.25, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: 16, display: "flex", flexDirection: "column", gap: 2 }}>
              {col.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 4px",
                    textDecoration: "none",
                    borderRadius: 10,
                  }}
                >
                  <span style={{ flex: 1, fontSize: 17, color: "var(--text)" }}>{item.label}</span>
                  <ChevronRight size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────
export default function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [isDark, setIsDark]         = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen]     = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const pathname = usePathname();

  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openTimer  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isDarkRef  = useRef(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      const hero = document.getElementById("hero");
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight - H_DESKTOP : 0;
      const inHero = hero ? y < heroBottom : false;
      const newDark = inHero;
      if (newDark !== isDarkRef.current) {
        isDarkRef.current = newDark;
        setIsDark(newDark);
      }
      setScrolled(y > 24);
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") { setMegaOpen(false); setMobileOpen(false); } };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const scheduleMegaClose = useCallback(() => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  const cancelMegaClose = useCallback(() => clearTimeout(closeTimer.current), []);

  const openMega = useCallback(() => {
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);
    if (!megaOpen) {
      openTimer.current = setTimeout(() => setMegaOpen(true), 80);
    }
  }, [megaOpen]);

  const closeMega = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    setMegaOpen(false);
  }, []);

  const headerBg = isDark
    ? (scrolled || megaOpen ? "rgba(59,26,43,.88)" : "transparent")
    : (scrolled || megaOpen ? "rgba(255,255,255,.95)"  : "#FFFFFF");
  const headerBlur = scrolled || megaOpen ? "blur(16px)" : "none";
  const headerBorder = isDark
    ? (scrolled || megaOpen ? "1px solid rgba(255,255,255,.08)" : "1px solid transparent")
    : "1px solid var(--line)";
  const linkColor = isDark ? "rgba(255,255,255,.82)" : "var(--text-muted)";
  const linkHover = isDark ? "#fff" : "var(--ink)";
  const logoSrc = isDark ? "/brand/logo-footer.png" : "/brand/logo.png";
  const headerH = isMobile ? H_MOBILE : H_DESKTOP;

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        data-section="header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: headerH,
          background: headerBg,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
          borderBottom: headerBorder,
          boxShadow: isDark ? "none" : "0 8px 24px -12px rgba(27,21,25,.08)",
          transition: "height 0.2s var(--ease), background 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src={logoSrc}
              alt="Azure Innovations"
              width={1920}
              height={830}
              priority
              style={{
                height: isMobile ? LOGO_MOBILE : LOGO_DESKTOP,
                width: "auto",
                display: "block",
                transition: "height 0.2s var(--ease)",
              }}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex"
            role="navigation"
            style={{ alignItems: "center", gap: 36 }}
          >
            {/* What we do — mega menu trigger */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={openMega}
              onMouseLeave={scheduleMegaClose}
            >
              <button
                aria-haspopup="dialog"
                aria-expanded={megaOpen}
                onClick={() => setMegaOpen((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  height: 44,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                  fontSize: 16,
                  color: linkColor,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = linkHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = linkColor; }}
              >
                What we do
                <motion.span
                  animate={{ rotate: megaOpen ? 180 : 0 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  style={{ display: "flex" }}
                >
                  <ChevronDown size={15} />
                </motion.span>
              </button>
            </div>

            <Link
              href="#industries"
              style={{ display: "inline-flex", alignItems: "center", height: 44, fontSize: 16, color: linkColor, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = linkHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = linkColor; }}
            >
              Industries
            </Link>

            {PAGES_LIVE.about && (
              <Link
                href="/about"
                aria-current={pathname === "/about" ? "page" : undefined}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 44,
                  fontSize: 16,
                  color: pathname === "/about" ? "var(--pink-500)" : linkColor,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = linkHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = pathname === "/about" ? "var(--pink-500)" : linkColor; }}
              >
                Who we are
              </Link>
            )}

            {PAGES_LIVE.shop && (
              <Link
                href="/shop"
                style={{ display: "inline-flex", alignItems: "center", height: 44, fontSize: 16, color: linkColor, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = linkHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = linkColor; }}
              >
                Shop
              </Link>
            )}
          </nav>

          {/* CTA + hamburger */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
            <Pill
              size="md"
              className="hidden lg:inline-flex"
              href="#contact"
              style={isDark
                ? { background: "var(--pink-500)", color: "#fff", borderColor: "var(--pink-500)" }
                : undefined
              }
            >
              Contact us
            </Pill>

            <button
              className="lg:hidden flex items-center justify-center"
              onClick={() => setMobileOpen((o) => !o)}
              style={{
                width: 44,
                height: 44,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isDark ? "rgba(255,255,255,.85)" : "var(--text)",
                padding: 0,
              }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop mega menu */}
      <MegaMenu
        open={megaOpen}
        headerH={headerH}
        onClose={closeMega}
        onMouseEnter={cancelMegaClose}
        onMouseLeave={scheduleMegaClose}
      />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "#fff",
              overflow: "auto",
              padding: `${H_MOBILE + 24}px 24px 48px`,
            }}
          >
            <button
              onClick={closeMobile}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>

            <MobileAccordion label="What we do" col={APPLE_SURFACE_COL} onClose={closeMobile} />
            <MobileAccordion label="Services"   col={SERVICES_COL}      onClose={closeMobile} />
            <MobileAccordion label="Solutions"  col={getSolutionsCol()}  onClose={closeMobile} />

            {[
              { label: "Industries", href: "#industries" },
              ...(PAGES_LIVE.about ? [{ label: "Who we are", href: "/about" }] : []),
              ...(PAGES_LIVE.shop  ? [{ label: "Shop",        href: "/shop"  }] : []),
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={closeMobile}
                style={{
                  display: "block",
                  fontSize: 28,
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  textDecoration: "none",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                {l.label}
              </Link>
            ))}

            {/* Contact primary */}
            <div style={{ marginTop: 32, marginBottom: 20 }}>
              <Pill href="#contact" style={{ width: "100%", justifyContent: "center" }} onClick={closeMobile}>
                Contact us
              </Pill>
            </div>

            {/* Mobile promo panel — 4:3, same buttons */}
            <ImagePanel
              src="/images/business.jpg"
              alt="Azure Innovations team ready to help"
              ratio="4/3"
              scrim="bottom"
              objectPosition="center 70%"
              style={{
                borderRadius: 20,
                "--brand-wash": "none",
              } as React.CSSProperties}
              sizes="(max-width: 767px) calc(100vw - 48px), 390px"
            >
              <PromoContent onClose={closeMobile} />
            </ImagePanel>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
