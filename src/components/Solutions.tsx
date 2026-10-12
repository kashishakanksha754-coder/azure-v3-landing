"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ImagePanel from "@/components/ui/ImagePanel";
import Tag from "@/components/ui/Tag";
import { SOLUTIONS_LIST } from "@/config/solutions";
import { PAGES_LIVE } from "@/config/pages";

const EASE = [0.22, 1, 0.36, 1] as const;

function getHref(slug: string) {
  return PAGES_LIVE.solutions ? `/solutions/${slug}` : `#contact?need=${slug}`;
}

function isProd() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "azureinnovations.co.in";
}

function SolutionCard({
  solution,
  index,
}: {
  solution: typeof SOLUTIONS_LIST[0];
  index: number;
}) {
  return (
    <motion.a
      href={getHref(solution.slug)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.07 }}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: "var(--radius-img)",
        overflow: "hidden",
      }}
    >
      <ImagePanel
        src={solution.img}
        alt={solution.alt}
        ratio="4/5"
        scrim="bottom"
        sizes="(max-width: 639px) 80vw, (max-width: 1023px) 45vw, 22vw"
      >
        <div style={{ width: "100%" }}>
          <p style={{ fontSize: 18, fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 8 }}>
            {solution.title}
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.78)", lineHeight: 1.45, marginBottom: 12 }}>
            {solution.line}
          </p>
          <div style={{ borderBottom: "1px solid rgba(255,255,255,.4)", paddingBottom: 10, marginTop: 4 }}>
            <span style={{ fontSize: 14, color: "var(--white)" }}>
              Learn more →
            </span>
          </div>
        </div>
      </ImagePanel>
    </motion.a>
  );
}

export default function Solutions() {
  const swipeRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  // Filter out hiddenInProd on production
  const [visibleSolutions, setVisible] = useState(SOLUTIONS_LIST);
  useEffect(() => {
    if (isProd()) {
      setVisible(SOLUTIONS_LIST.filter((s) => !s.hiddenInProd));
    }
  }, []);

  useEffect(() => {
    const el = swipeRef.current;
    if (!el) return;
    const handler = () => {
      const cardW = el.offsetWidth * 0.80 + 16;
      const idx = Math.round(el.scrollLeft / cardW);
      setActiveDot(Math.min(visibleSolutions.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [visibleSolutions.length]);

  return (
    <section
      id="solutions"
      data-section="solutions"
      className="section"
      style={{ background: "var(--white)", paddingBottom: 0 }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span style={{ display: "inline-block", marginBottom: 20 }}>
            <Tag variant="outline">What we do</Tag>
          </span>
          <h2 style={{ maxWidth: "18ch", marginBottom: 16 }}>
            Solutions built around how you work.
          </h2>
          <p style={{ fontSize: "clamp(16px, 1.5vw, 18px)", color: "var(--text-muted)", maxWidth: "56ch", lineHeight: 1.6 }}>
            From device deployment to custom development — we cover the full technology lifecycle.
          </p>
        </div>

        {/* Desktop 4-col grid */}
        <div
          className="hidden md:grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {visibleSolutions.map((s, i) => (
            <SolutionCard key={s.slug} solution={s} index={i} />
          ))}
        </div>

        {/* Tablet 2-col */}
        <style>{`
          @media (min-width: 640px) and (max-width: 1023px) {
            .sol-tablet { display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .sol-mobile  { display: none !important; }
          }
        `}</style>
        <div className="sol-tablet hidden" style={{ display: "none" }}>
          {visibleSolutions.map((s, i) => (
            <SolutionCard key={s.slug} solution={s} index={i} />
          ))}
        </div>

        {/* Mobile swipe */}
        <div className="md:hidden">
          <div
            ref={swipeRef}
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
              msOverflowStyle: "none" as React.CSSProperties["msOverflowStyle"],
              scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"],
            }}
          >
            {visibleSolutions.map((s, i) => (
              <div key={s.slug} style={{ minWidth: "80vw", scrollSnapAlign: "start", flexShrink: 0 }}>
                <SolutionCard solution={s} index={i} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {visibleSolutions.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to item ${i + 1}`}
                onClick={() => {
                  const el = swipeRef.current;
                  if (!el) return;
                  const cardW = el.offsetWidth * 0.80 + 16;
                  el.scrollTo({ left: i * cardW, behavior: "smooth" });
                }}
                style={{
                  width: activeDot === i ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activeDot === i ? "var(--pink-600)" : "var(--line)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "width 0.3s var(--ease), background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
