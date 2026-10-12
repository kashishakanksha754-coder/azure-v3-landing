"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/motion/useReveal";
import { EASE } from "@/components/motion/useSlide";
import { about } from "@/config/about";

const { mission } = about;

function WordReveal({ text, reduced }: { text: string; reduced: boolean }) {
  const words = text.split(/\s+/);
  const n = words.length;
  const maxStagger = 0.9 / Math.max(1, n - 1);
  const stagger = Math.min(0.022, maxStagger);

  if (reduced) {
    return <span>{text}</span>;
  }

  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: stagger * i }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

export default function Mission({ showDrafts }: { showDrafts: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const { ref, revealed } = useReveal<HTMLDivElement>(0.3);

  if (!mission.approved && !showDrafts) return null;

  return (
    <section
      id="mission"
      aria-labelledby="mission-h2"
      className="section"
      data-surface="dark"
      style={{
        background: "var(--grad-magenta)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)",
        paddingBlock: "var(--space-section)",
        overflowX: "clip",
      }}
    >
      {/* White grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "linear-gradient(to right, rgba(255,255,255,1) 40%, rgba(255,255,255,0) 100%)",
        WebkitMaskImage: "linear-gradient(to right, rgba(255,255,255,1) 40%, rgba(255,255,255,0) 100%)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          ref={ref}
          initial={reduced ? false : { opacity: 0, x: -80 }}
          animate={revealed ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 1, ease: EASE }}
          style={{ maxWidth: "60ch" }}
        >
          {/* Tag */}
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              height: 40, padding: "0 18px", borderRadius: 999,
              background: "transparent", border: "1px solid rgba(255,255,255,.5)",
              fontSize: 13, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#fff",
              marginBottom: 28,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
            {mission.tag}
          </span>

          {/* Statement as proper h2 */}
          <h2
            id="mission-h2"
            aria-label={mission.text}
            style={{
              fontSize: "clamp(28px, 3.2vw, 44px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#fff",
              textWrap: "balance",
              marginBottom: 32,
            }}
          >
            {revealed ? <WordReveal text={mission.text} reduced={reduced} /> : <span style={{ opacity: 0 }}>{mission.text}</span>}
          </h2>

          {/* How chips */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={revealed ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            {mission.how.map((item, i) => (
              <motion.span
                key={item}
                initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                animate={revealed ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.4, ease: EASE, delay: 0.65 + i * 0.06 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  height: 38, padding: "0 16px", borderRadius: 999,
                  background: "transparent", border: "1px solid rgba(255,255,255,.55)",
                  fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
                {item}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
