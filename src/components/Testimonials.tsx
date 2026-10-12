"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "@/config/testimonials";
import { testimonials as realData, PLACEHOLDER_TESTIMONIALS } from "@/config/testimonials";
import { TESTIMONIALS_LIVE } from "@/config/site";
import Tag from "@/components/ui/Tag";

const EASE = [0.22, 1, 0.36, 1] as const;
const WORD_DURATION = 0.6;
const STAGGER_BASE = 0.022;
const MAX_ANIM_S = 0.9;
const HL_OFFSET_S = 0.25;

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ name, photo }: { name?: string; photo?: string }) {
  const shell: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: "50%",
    flexShrink: 0,
    border: "3px solid #fff",
    boxShadow: "0 2px 12px rgba(0,0,0,.10)",
    overflow: "hidden",
    background: "var(--navy-tint)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (photo && name) {
    return (
      <div style={shell}>
        <Image
          src={photo}
          alt={name}
          width={80}
          height={80}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  if (name) {
    const initials = name
      .split(" ")
      .map((w) => w[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div style={{ ...shell, fontSize: 24, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "-0.02em" }}>
        {initials}
      </div>
    );
  }

  // No name — neutral person icon
  return (
    <div style={shell}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="15" r="7" fill="var(--text-muted)" />
        <path d="M6 37c0-7.732 6.268-14 14-14s14 6.268 14 14H6z" fill="var(--text-muted)" />
      </svg>
    </div>
  );
}

// ── Parse quote into word objects, marking which belong to the highlight ───────
type WordEntry = { word: string; isHighlight: boolean };

function parseWords(quote: string, highlight?: string): WordEntry[] {
  const rawWords = quote.split(/\s+/);
  if (!highlight) return rawWords.map((word) => ({ word, isHighlight: false }));

  const lower = quote.toLowerCase();
  const lowerHL = highlight.toLowerCase();
  const hlStart = lower.indexOf(lowerHL);
  if (hlStart === -1) return rawWords.map((word) => ({ word, isHighlight: false }));
  const hlEnd = hlStart + highlight.length;

  let charPos = 0;
  return rawWords.map((word) => {
    const wordStart = quote.indexOf(word, charPos);
    const wordEnd = wordStart + word.length;
    charPos = wordEnd;
    const isHighlight = wordStart >= hlStart && wordEnd <= hlEnd + 1;
    return { word, isHighlight };
  });
}

// ── Word-by-word animated quote with highlight underline draw ─────────────────
function AnimatedQuote({ t, reduced }: { t: Testimonial; reduced: boolean }) {
  const words = parseWords(t.quote, t.highlight);
  const n = words.length;
  const maxStagger = (MAX_ANIM_S - WORD_DURATION) / Math.max(1, n - 1);
  const stagger = Math.min(STAGGER_BASE, maxStagger);
  const hlDelayS = stagger * (n - 1) + HL_OFFSET_S;

  const textStyle: React.CSSProperties = {
    fontSize: "clamp(20px, 1.9vw, 28px)",
    fontWeight: 400,
    lineHeight: 1.45,
    letterSpacing: "-0.02em",
    color: "var(--ink)",
    margin: 0,
  };

  if (reduced) {
    return (
      <p style={textStyle}>
        {words.map(({ word, isHighlight }, i) => (
          <span key={i} className={isHighlight ? "tmt-hl tmt-hl-done" : undefined}>
            {word}
            {i < n - 1 ? " " : ""}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p style={textStyle}>
      {words.map(({ word, isHighlight }, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: stagger * i, duration: WORD_DURATION, ease: EASE }}
          className={isHighlight ? "tmt-hl" : undefined}
          style={
            isHighlight
              ? ({ "--tmt-hl-delay": `${hlDelayS}s` } as React.CSSProperties)
              : undefined
          }
        >
          {word}
          {i < n - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

// ── Single slide ───────────────────────────────────────────────────────────────
function Slide({
  t,
  dir,
  reduced,
}: {
  t: Testimonial;
  dir: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      custom={dir}
      variants={{
        enter: (d: number) => ({ x: d * 28, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d * -28, opacity: 0 }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        gridArea: "1 / 1",
        background: "var(--surface-pink)",
        borderRadius: "clamp(32px, 3vw, 48px)",
        padding: "clamp(40px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Quote text */}
      <div style={{ position: "relative", zIndex: 1, marginBottom: 36 }}>
        <AnimatedQuote t={t} reduced={reduced} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--line)", marginBottom: 28, position: "relative", zIndex: 1 }} />

      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        <Avatar name={t.name} photo={t.photo} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {t.name && (
            <div style={{ fontSize: 20, fontWeight: 400, color: "var(--ink)", lineHeight: 1.2, marginBottom: 4 }}>
              {t.name}
            </div>
          )}
          <div style={{ fontSize: 16, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {t.role} &middot; {t.organisation}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Testimonials() {
  const approved = realData.filter((t) => t.approved && t.consent);
  if (!TESTIMONIALS_LIVE && approved.length === 0) return null;

  const [isProductionHost, setIsProductionHost] = useState(false);
  const [previewMode, setPreviewMode] = useState(
    process.env.NEXT_PUBLIC_SAMPLE_CONTENT === "true" || approved.length < 3
  );

  useEffect(() => {
    const host = window.location.hostname;
    const prodHosts = (process.env.NEXT_PUBLIC_PRODUCTION_HOSTS || "azureinnovations.co.in")
      .split(",")
      .map((h) => h.trim());
    const isProd = prodHosts.some((h) => host === h || host.endsWith("." + h));

    if (isProd) {
      setIsProductionHost(true);
      setPreviewMode(false);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "testimonials") setPreviewMode(true);
    }
  }, []);

  useEffect(() => {
    if (previewMode && !isProductionHost) {
      console.warn(
        "[Testimonials] Placeholder entries are active. Replace with approved client quotes before launch."
      );
    }
  }, [previewMode, isProductionHost]);

  // Production host: only real approved+consent data, never placeholders
  // Preview / staging: placeholders when < 3 real quotes
  const data: Testimonial[] = isProductionHost
    ? approved
    : previewMode
    ? PLACEHOLDER_TESTIMONIALS
    : approved;

  const count = data.length;

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const reduced = useReducedMotion() ?? false;

  const goTo = useCallback(
    (idx: number, direction: number) => {
      const wrapped = ((idx % count) + count) % count;
      setDir(direction);
      setActive(wrapped);
    },
    [count]
  );

  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Production: hide entirely if < 3 real quotes; preview: PLACEHOLDER always has 5
  if (isProductionHost && approved.length < 3) return null;
  if (!isProductionHost && count < 3) return null;

  const current = data[active];
  const ariaAnnouncement = `Testimonial ${active + 1} of ${count}: ${current.role}, ${current.organisation}`;

  return (
    <section
      id="testimonials"
      data-section="testimonials"
      aria-label="Client testimonials"
      style={{ padding: "clamp(96px, 10vw, 144px) 0" }}
    >
        <style>{`
          .tmt-nav-btn {
            width: 48px; height: 48px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            background: transparent; border: 1px solid var(--line);
            cursor: pointer; color: var(--ink);
            transition: background 200ms; padding: 0;
          }
          .tmt-nav-btn:hover { background: var(--surface); }
          .tmt-hl {
            background-image: linear-gradient(var(--magenta-600) 0 0);
            background-size: 0% 2px;
            background-repeat: no-repeat;
            background-position: left bottom;
            animation: tmtHlDraw 500ms ease forwards;
            animation-delay: var(--tmt-hl-delay, 0s);
            padding-bottom: 2px;
          }
          .tmt-hl-done {
            background-size: 100% 2px;
            animation: none;
          }
          @keyframes tmtHlDraw {
            from { background-size: 0% 2px; }
            to { background-size: 100% 2px; }
          }
        `}</style>

        {/* ARIA live announcement */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}
        >
          {ariaAnnouncement}
        </div>

        <div className="container">
          {/* ── Header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 40 }}>
            <div>
              <span style={{ display: "inline-block", marginBottom: 16 }}>
                <Tag>Testimonials</Tag>
              </span>
              <h2 style={{ margin: 0, fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
                What our clients say
              </h2>
            </div>

            {/* Counter + prev/next */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <span style={{ fontSize: 15, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="tmt-nav-btn" aria-label="Previous testimonial" onClick={prev}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="tmt-nav-btn" aria-label="Next testimonial" onClick={next}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Slide track ── */}
          <div role="region" aria-roledescription="carousel" aria-label="Testimonials" style={{ display: "grid" }}>
            <AnimatePresence custom={dir}>
              <Slide
                key={current.id}
                t={current}
                dir={dir}
                reduced={reduced}
              />
            </AnimatePresence>
          </div>

          {/* ── Dots ── */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32 }}>
            {data.map((_, i) => (
              <motion.button
                key={i}
                layout
                transition={{ duration: 0.3, ease: EASE }}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                style={{
                  height: 10,
                  width: i === active ? 44 : 10,
                  borderRadius: 999,
                  background: i === active ? "var(--magenta-600)" : "var(--line)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>
  );
}
