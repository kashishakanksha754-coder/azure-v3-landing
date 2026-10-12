"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ImagePanel from "@/components/ui/ImagePanel";
import Tag from "@/components/ui/Tag";
import { INDUSTRIES } from "@/config/industries";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Desktop expanding accordion ───────────────────────────────────────────
function DesktopAccordion() {
  const [active, setActive] = useState<number>(0);
  const reduced = useReducedMotion();

  return (
    <div
      style={{
        display: "flex",
        height: "clamp(480px, 56vw, 640px)",
        gap: 4,
        borderRadius: "var(--radius-img)",
        overflow: "hidden",
      }}
    >
      {INDUSTRIES.map((ind, i) => (
        <motion.div
          key={ind.id}
          animate={{ flex: active === i ? 3 : 1 }}
          transition={{ duration: reduced ? 0.01 : 0.55, ease: EASE }}
          style={{
            position: "relative",
            cursor: "pointer",
            minWidth: 0,
          }}
          onClick={() => setActive(i)}
          onMouseEnter={() => setActive(i)}
          role="button"
          tabIndex={0}
          aria-expanded={active === i}
          aria-label={ind.name}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActive(i); }}
        >
          <ImagePanel
            src={ind.img}
            alt={ind.alt}
            scrim="bottom"
            style={{ position: "absolute", inset: 0, borderRadius: 0 }}
            sizes="(max-width: 1023px) 100vw, 33vw"
          >
            <div style={{ width: "100%", overflow: "hidden" }}>
              {/* Always-visible vertical label (collapsed) */}
              <AnimatePresence initial={false}>
                {active !== i && (
                  <motion.p
                    key="label-collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(255,255,255,.82)",
                      letterSpacing: "-0.01em",
                      writingMode: "vertical-rl" as React.CSSProperties["writingMode"],
                      transform: "rotate(180deg)",
                      whiteSpace: "nowrap",
                      paddingBottom: 4,
                    }}
                  >
                    {ind.name}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Expanded content */}
              <AnimatePresence initial={false}>
                {active === i && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: 0.15 }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.68)", marginBottom: 12 }}>
                      {ind.tagline}
                    </p>
                    <h3 style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 12 }}>
                      {ind.name}
                    </h3>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,.72)", lineHeight: 1.6, marginBottom: 20, maxWidth: 320 }}>
                      {ind.detail}
                    </p>
                    <a
                      href={`#contact?need=${ind.contactNeed}`}
                      style={{ fontSize: 14, color: "rgba(255,255,255,.9)", borderBottom: "1px solid rgba(255,255,255,.4)", paddingBottom: 2, textDecoration: "none" }}
                    >
                      Get in touch →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ImagePanel>
        </motion.div>
      ))}
    </div>
  );
}

// ── Mobile stacked cards ──────────────────────────────────────────────────
function MobileStack() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {INDUSTRIES.map((ind) => (
        <div key={ind.id} style={{ borderRadius: "var(--radius-img)", overflow: "hidden" }}>
          <ImagePanel
            src={ind.img}
            alt={ind.alt}
            ratio="16/9"
            scrim="bottom"
            sizes="100vw"
          >
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.68)", marginBottom: 8 }}>
                {ind.tagline}
              </p>
              <h3 style={{ fontSize: 22, fontWeight: 400, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 12 }}>
                {ind.name}
              </h3>
              <a
                href={`#contact?need=${ind.contactNeed}`}
                style={{ fontSize: 14, color: "rgba(255,255,255,.9)", borderBottom: "1px solid rgba(255,255,255,.4)", paddingBottom: 2, textDecoration: "none" }}
              >
                Get in touch →
              </a>
            </div>
          </ImagePanel>
        </div>
      ))}
    </div>
  );
}

export default function Industries() {
  return (
    <section
      id="industries"
      data-section="industries"
      className="section"
      style={{ background: "#fff", paddingBottom: 0 }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span style={{ display: "inline-block", marginBottom: 20 }}>
            <Tag variant="outline">Industries</Tag>
          </span>
          <h2 style={{ maxWidth: "18ch", marginBottom: 16 }}>
            Who we work with.
          </h2>
          <p style={{ fontSize: "clamp(16px, 1.5vw, 18px)", color: "var(--text-muted)", maxWidth: "56ch", lineHeight: 1.6 }}>
            We partner with organisations across sectors to supply, deploy and support Apple and Microsoft Surface technology.
          </p>
        </div>

        {/* Desktop accordion */}
        <div className="hidden lg:block">
          <DesktopAccordion />
        </div>

        {/* Mobile stack */}
        <div className="lg:hidden">
          <MobileStack />
        </div>
      </div>
    </section>
  );
}
