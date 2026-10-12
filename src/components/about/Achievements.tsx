"use client";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/motion/useReveal";
import { EASE } from "@/components/motion/useSlide";
import { about } from "@/config/about";

const { achievements: data } = about;

type Stat = typeof data.stats[number];

function StatNumber({
  stat,
  revealed,
  reduced,
  index,
}: {
  stat: Stat;
  revealed: boolean;
  reduced: boolean;
  index: number;
}) {
  const elRef = useRef<HTMLSpanElement>(null);
  const suffix = "suffix" in stat ? (stat as Stat & { suffix?: string }).suffix ?? "" : "";
  const display = String(stat.value) + suffix;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.textContent = display;
    if (reduced || !revealed || stat.kind === "year") return;
    let raf = 0;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        el.textContent = String(Math.round(stat.value * easeOut(t))) + suffix;
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = display;
      };
      raf = requestAnimationFrame(tick);
    }, index * 100);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [revealed, reduced, stat.value, stat.kind, suffix, display, index]);

  return (
    <span ref={elRef} aria-label={display}>
      {display}
    </span>
  );
}

export default function Achievements({ showDrafts }: { showDrafts: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const { ref, revealed } = useReveal<HTMLDivElement>(0.3);

  const visibleStats = data.stats.filter(
    (s) => s.confirmed || showDrafts
  );

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-h2"
      className="section"
      style={{ background: "#fff", overflowX: "clip", paddingBlock: "var(--space-section)" }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 56 }}
        >
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 44,
              padding: "0 20px",
              borderRadius: 999,
              background: "transparent",
              border: "1px solid var(--pill-border)",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--ink)",
            }}>
              {data.tag}
            </span>
          </div>
          <h2
            id="achievements-h2"
            style={{
              fontSize: "clamp(32px, 3.5vw, 48px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "16ch",
              textWrap: "balance",
            }}
          >
            {data.h2}
          </h2>
        </motion.div>

        {/* Stat strip — untransformed wrapper for useReveal */}
        <div ref={ref}>
          <style>{`
            .stat-strip {
              display: grid;
              grid-template-columns: repeat(var(--stat-n, 4), minmax(0, 1fr));
            }
            .stat-cell {
              container-type: inline-size;
              padding-block: clamp(32px, 3vw, 48px);
              padding-inline: clamp(24px, 3vw, 48px);
            }
            .stat-cell:first-child { padding-left: 0; }
            .stat-num {
              font-size: clamp(48px, 6vw, 104px);
              font-weight: 400;
              letter-spacing: -0.04em;
              line-height: 1.0;
              color: var(--ink);
              font-variant-numeric: tabular-nums;
            }
            @container (max-width: 240px) {
              .stat-num { font-size: min(clamp(48px, 6vw, 104px), 22cqw); }
            }
            @media (max-width: 767px) {
              .stat-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 32px; }
              .stat-cell:nth-child(2n+1) { padding-left: 0; }
            }
          `}</style>
          <div
            className="stat-strip"
            style={{ "--stat-n": visibleStats.length } as React.CSSProperties}
          >
            {visibleStats.map((stat, i) => (
              <motion.div
                key={stat.id}
                className="stat-cell"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={revealed ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              >
                <div className="stat-num">
                  <StatNumber
                    stat={stat}
                    revealed={revealed}
                    reduced={reduced}
                    index={i}
                  />
                </div>
                <p style={{
                  fontSize: "clamp(16px, 1.3vw, 18px)",
                  color: "var(--text-muted)",
                  marginTop: 12,
                  lineHeight: 1.4,
                }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
