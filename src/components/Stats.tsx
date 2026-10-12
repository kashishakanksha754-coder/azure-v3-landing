"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Tag from "@/components/ui/Tag";
import { PROD_STATS } from "@/config/stats";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Unified shape used by StatCard ────────────────────────────────────────────
type RenderStat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
};

// ── Count-up with per-stat stagger ────────────────────────────────────────────
function useCountUp(
  target: number,
  revealed: boolean,
  index: number,
  isReduced: boolean,
) {
  const [val, setVal]   = useState(0);
  const rafRef          = useRef<number>(0);
  const timerRef        = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!revealed) return;
    if (isReduced) { setVal(target); return; }
    timerRef.current = setTimeout(() => {
      const start = performance.now();
      const tick  = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        setVal(Math.round((1 - Math.pow(1 - t, 3)) * target));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, index * 100);
    return () => { clearTimeout(timerRef.current); cancelAnimationFrame(rafRef.current); };
  }, [target, revealed, index, isReduced]);

  return val;
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({
  stat,
  index,
  revealed,
  isReduced,
}: {
  stat: RenderStat;
  index: number;
  revealed: boolean;
  isReduced: boolean;
}) {
  const count  = useCountUp(stat.value, revealed, index, isReduced);
  const delay  = isReduced ? 0 : index * 0.1;
  const isLong = (String(stat.value) + (stat.suffix ?? "")).length >= 4;

  return (
    <motion.div
      className="stat-card"
      data-stat-id={stat.id}
      initial={{ opacity: 0, y: 12 }}
      animate={
        isReduced
          ? { opacity: 1, y: 0 }
          : revealed
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 12 }
      }
      transition={{ duration: isReduced ? 0 : 0.5, delay, ease: EASE }}
    >
      {/* Rule: 1px --pink-200 base + 2px --pink-500 animated accent */}
      <div style={{ position: "relative", height: 2, marginBottom: 24 }}>
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 1, background: "var(--pink-200)", transform: "translateY(-50%)",
        }} />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isReduced ? 1 : revealed ? 1 : 0 }}
          transition={{ duration: isReduced ? 0 : 0.6, delay, ease: EASE }}
          style={{
            position: "absolute", top: 0, left: 0,
            height: 2, width: 48, background: "var(--pink-500)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Number row — fixed height = max font size, numbers bottom-aligned */}
      <div className="stat-num-row">
        <div
          className={isLong ? "stat-num stat-num--long" : "stat-num"}
          style={{
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "var(--pink-500)",
            fontVariantNumeric: "tabular-nums",
            marginLeft: "-0.04em",
          }}
        >
          {count}{stat.suffix ?? ""}
        </div>
      </div>

      {/* Label — min-height 2lh keeps labels at the same y across columns */}
      <div
        className="stat-label"
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: "var(--ink)",
          lineHeight: 1.3,
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

// ── Stats section ─────────────────────────────────────────────────────────────
export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced    = useReducedMotion();
  const isReduced  = reduced ?? false;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const glanceStats: RenderStat[] = PROD_STATS
    .filter((s) => s.showInGlance && s.items.length > 0)
    .map((s) => ({ id: s.id, label: s.label, value: s.items.length }));

  return (
    <section id="stats" data-section="stats" style={{ background: "var(--pink-50)" }}>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          column-gap: 32px;
        }
        /* Each card is a container so 24cqw is relative to its width */
        .stat-card { container-type: inline-size; }
        /* Number font — cap at 24cqw so wide numbers never overflow their cell */
        .stat-num      { font-size: min(clamp(52px, 6vw, 96px), 24cqw); }
        .stat-num--long{ font-size: min(calc(clamp(52px, 6vw, 96px) * 0.82), calc(24cqw * 0.82)); }
        /* Number row: fixed height = max font box; numbers bottom-align */
        .stat-num-row {
          height: min(clamp(52px, 6vw, 96px), 24cqw);
          display: flex;
          align-items: flex-end;
          margin-bottom: 12px;
          overflow: visible;
        }
        /* Label row: min-height keeps labels at the same y across columns */
        .stat-label { min-height: 2lh; }
        /* Tablet: 3 columns */
        @media (min-width: 640px) and (max-width: 1023px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); row-gap: 48px; }
        }
        /* Mobile: 2 columns; 5th (odd last child) spans both, left-aligned */
        @media (max-width: 639px) {
          .stats-grid { grid-template-columns: 1fr 1fr; row-gap: 32px; }
          .stat-card:last-child:nth-child(odd) { grid-column: 1 / -1; }
          .stat-num-row { height: min(clamp(44px, 10vw, 72px), 24cqw); }
          .stat-num     { font-size: min(clamp(44px, 10vw, 72px), 24cqw); }
          .stat-num--long { font-size: min(calc(clamp(44px, 10vw, 72px) * 0.82), calc(24cqw * 0.82)); }
        }
      `}</style>

      <div
        className="container"
        ref={sectionRef}
        style={{ paddingBlock: "clamp(56px, 7vw, 88px)" }}
      >
        {/* Section header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ display: "inline-block", marginBottom: 20 }}>
            <Tag variant="outline">At a glance</Tag>
          </span>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--ink)",
            maxWidth: "20ch",
          }}>
            Azure at a glance.
          </h2>
        </div>

        {/* Stats grid */}
        <div className="stats-grid">
          {glanceStats.map((stat, i) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={i}
              revealed={revealed}
              isReduced={isReduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
