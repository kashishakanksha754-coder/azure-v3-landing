"use client";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { EASE } from "@/components/motion/useSlide";
import { about } from "@/config/about";
import ProductCollage from "@/components/ui/ProductCollage";

const { hero } = about;

export default function AboutHero() {
  const reduced = useReducedMotion();

  const scrollToAchievements = () => {
    const el = document.getElementById("achievements");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="about-hero"
      aria-labelledby="about-h1"
      style={{
        position: "relative",
        isolation: "isolate",
        paddingTop: "clamp(168px, 14vw, 208px)",
        paddingBottom: "clamp(80px, 8vw, 120px)",
        overflowX: "clip",
      }}
    >
      <style>{`
        .about-hero-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
          align-items: start;
        }
        .about-hero-left  { grid-column: 1 / 6; }
        .about-hero-right { grid-column: 6 / 13; }
        @media (max-width: 1023px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-hero-left  { grid-column: 1; }
          .about-hero-right {
            order: 2;
            margin: 0 auto;
            width: min(90vw, 540px);
          }
        }
        .about-h1-line  { display: block; overflow: hidden; padding-bottom: .14em; margin-bottom: -.14em; }
        .about-h1-inner { display: inline-block; white-space: nowrap; }
        @media (max-width: 767px) {
          .about-h1-line  { display: inline; overflow: visible; padding: 0; margin: 0; }
          .about-h1-inner { display: inline; white-space: normal; }
        }
        .about-hero-glow-mg {
          position: absolute; top: -120px; left: -180px; width: 520px; height: 520px;
          background: radial-gradient(ellipse, rgba(173,76,116,.14) 0%, transparent 70%);
          pointer-events: none; z-index: -1;
        }
        .about-hero-glow-bl {
          position: absolute; top: -80px; right: -120px; width: 460px; height: 460px;
          background: radial-gradient(ellipse, rgba(31,111,216,.12) 0%, transparent 70%);
          pointer-events: none; z-index: -1;
        }
        @media (max-width: 767px) {
          .about-hero-glow-mg, .about-hero-glow-bl { display: none; }
        }
      `}</style>

      {/* Background */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: -1, background: "var(--wash-blue)" }}
        aria-hidden
      >
        <div className="about-hero-glow-mg" />
        <div className="about-hero-glow-bl" />
      </div>

      <div className="container" style={{ position: "relative" }}>
        <div className="about-hero-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="about-hero-left">

            {/* Tag pill */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ display: "inline-flex", marginBottom: 20 }}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 40, padding: "0 18px", borderRadius: 999,
                background: "#fff", border: "1px solid var(--pill-border)",
                fontSize: 13, fontWeight: 500, letterSpacing: ".12em",
                textTransform: "uppercase", color: "var(--ink)",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--magenta-600)", flexShrink: 0,
                }} />
                ABOUT AZURE
              </span>
            </motion.div>

            {/* H1 — two lines with slide-up */}
            <h1
              id="about-h1"
              style={{
                fontSize: "clamp(38px, 4.5vw, 64px)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                textWrap: "balance",
                marginBottom: 20,
              }}
            >
              <span className="about-h1-line">
                <motion.span
                  className="about-h1-inner"
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                >
                  Your technology partner across
                </motion.span>
              </span>{" "}
              <span className="about-h1-line">
                <motion.span
                  className="about-h1-inner"
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                  style={{ color: "var(--magenta-600)" }}
                >
                  Delhi NCR.
                </motion.span>
              </span>
            </h1>

            {/* Promise */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
              style={{ fontSize: 22, fontStyle: "italic", color: "var(--magenta-600)", marginBottom: 24 }}
            >
              {hero.promise}
            </motion.p>

            {/* Partner pills */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.38 }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}
            >
              {[
                { label: "Apple Business Partner",   style: { background: "var(--surface-pink)", border: "1px solid #F3C3D8", color: "var(--magenta-600)" } },
                { label: "Microsoft Surface Partner", style: { background: "var(--surface-blue)", border: "1px solid #BBD3F5", color: "var(--blue-600)" } },
                { label: "Naraina · Noida · Gurgaon", style: { background: "#fff", border: "1px solid var(--pill-border)", color: "var(--ink)" } },
              ].map((pill, i) => (
                <motion.span
                  key={pill.label}
                  initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.42 + i * 0.07 }}
                  style={{
                    display: "inline-flex", alignItems: "center",
                    height: 40, padding: "0 18px", borderRadius: 999,
                    fontSize: 14, fontWeight: 400, ...pill.style,
                  }}
                >
                  {pill.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Scroll link */}
            <motion.button
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.62 }}
              onClick={scrollToAchievements}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer", padding: 0,
                fontSize: 15, fontWeight: 400, color: "var(--ink)",
                borderBottom: "1px solid var(--magenta-600)", paddingBottom: 2,
              }}
            >
              See our achievements{" "}
              <motion.span
                style={{ display: "inline-block" }}
                whileHover={{ y: 4 }}
                transition={{ duration: 0.2 }}
              >
                &#8595;
              </motion.span>
            </motion.button>
          </div>

          {/* ── RIGHT COLUMN — Tile Collage (shared with homepage) ── */}
          <div className="about-hero-right">
            <ProductCollage variant="about" reduced={!!reduced} fadeColor="var(--wash-blue)" />
          </div>

        </div>
      </div>
    </section>
  );
}
