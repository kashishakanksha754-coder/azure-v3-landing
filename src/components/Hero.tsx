"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Pill from "@/components/ui/Pill";
import Tag from "@/components/ui/Tag";
import ImagePanel from "@/components/ui/ImagePanel";

const EASE = [0.22, 1, 0.36, 1] as const;

const APPLE_ICON = (
  <svg width="13" height="16" viewBox="0 0 814 1000" fill="currentColor" aria-hidden>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 71 0 130.5 46.4 174.9 46.4 42.7 0 109.2-49 192.5-49 30.9 0 108.2 2.6 168.7 75.3zM529.5 97.5c32.7-37.7 55.6-90.6 55.6-143.5 0-7.7-.6-15.5-1.9-22.5-52.9 2-115.4 35.3-153.2 78.4-28.3 32.1-56.3 85.1-56.3 139 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 47.5 0 105.8-31.5 140.3-71.9z"/>
  </svg>
);
const INTERVAL = 6500;

type SlideData = {
  eyebrow: string;
  heading: string;
  sub: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  img?: string;
  imgAlt?: string;
};

const SLIDES: SlideData[] = [
  {
    eyebrow: "Apple Business Partner",
    heading: "Apple technology that works for your business.",
    sub: "Genuine devices. Set up, enrolled and supported by a team that stays after the sale.",
    primaryLabel: "Contact us",
    primaryHref: "#contact",
    secondaryLabel: "What we do",
    secondaryHref: "#solutions",
    img: "/images/desk-devices.jpg",
    imgAlt: "Business team using Apple MacBooks in a corporate meeting room",
  },
  {
    eyebrow: "Device deployment",
    heading: "Deployed, configured and managed for you.",
    sub: "Every device arrives ready to use — enrolled, secured and set up for your team.",
    primaryLabel: "Learn more",
    primaryHref: "#contact?need=device-deployment",
    secondaryLabel: "Our services",
    secondaryHref: "#services",
    img: "/images/corporate.jpg",
    imgAlt: "Team collaborating on Apple MacBooks in a modern office",
  },
  {
    eyebrow: "AMC and IT support",
    heading: "Support that stays after the sale.",
    sub: "One team for hardware, software and on-site support — from setup to the end of every device's life.",
    primaryLabel: "Get support",
    primaryHref: "#contact?need=amc-it-support",
    secondaryLabel: "Our services",
    secondaryHref: "#services",
    img: "/images/technician.jpg",
    imgAlt: "IT engineer managing infrastructure with a Surface device",
  },
];

// ── Per-slide progress bar ─────────────────────────────────────────────────
function ProgressBars({
  total,
  active,
  paused,
  interval,
  onDone,
}: {
  total: number;
  active: number;
  paused: boolean;
  interval: number;
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const pausedAtRef = useRef<number>(0);

  useEffect(() => {
    setProgress(0);
    startRef.current = performance.now();
    pausedAtRef.current = 0;

    const tick = (now: number) => {
      if (pausedRef.current) {
        if (!pausedAtRef.current) pausedAtRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (pausedAtRef.current) {
        startRef.current += now - pausedAtRef.current;
        pausedAtRef.current = 0;
      }
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / interval, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused === false]);

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,.28)",
            flex: i === active ? "0 0 48px" : "0 0 24px",
            position: "relative",
            overflow: "hidden",
            transition: "flex 0.3s var(--ease)",
          }}
        >
          {i === active && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${progress * 100}%`,
                background: "#fff",
                borderRadius: 2,
              }}
            />
          )}
          {i < active && (
            <div style={{ position: "absolute", inset: 0, background: "#fff", borderRadius: 2 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Slide (all 3 slides share this layout) ───────────────────────────────
function Slide({
  data,
  visible,
  reduced,
  isFirst,
}: {
  data: SlideData;
  visible: boolean;
  reduced: boolean;
  isFirst?: boolean;
}) {
  const Heading = isFirst ? "h1" : "h2";
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduced ? 0.01 : 0.6, ease: EASE }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ImagePanel
        src={data.img}
        alt={data.imgAlt ?? ""}
        scrim="left"
        priority={isFirst}
        style={{ position: "absolute", inset: 0, borderRadius: 0 }}
        sizes="100vw"
      >
        <div
          className="container"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: "100svh",
            paddingTop: "clamp(80px, 10vw, 120px)",
            paddingBottom: "clamp(80px, 10vw, 120px)",
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 24 }}>
              <Tag variant="on-dark" icon={data.eyebrow === "Apple Business Partner" ? APPLE_ICON : undefined}>{data.eyebrow}</Tag>
            </div>
            <Heading
              style={{
                fontSize: "clamp(40px, 5.5vw, 76px)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 1.06,
                color: "#fff",
                marginBottom: 20,
                textWrap: "balance",
              }}
            >
              {data.heading}
            </Heading>
            <p style={{ fontSize: "clamp(16px, 1.5vw, 18px)", color: "rgba(255,255,255,.75)", lineHeight: 1.6, marginBottom: 36, maxWidth: 460 }}>
              {data.sub}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Pill variant="white" href={data.primaryHref}>{data.primaryLabel}</Pill>
              <Pill variant="outline-white" href={data.secondaryHref}>{data.secondaryLabel}</Pill>
            </div>
          </div>
        </div>
      </ImagePanel>
    </motion.div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const total = SLIDES.length;

  const next = useCallback(() => setSlide((s) => (s + 1) % total), [total]);
  const prev = useCallback(() => setSlide((s) => (s - 1 + total) % total), [total]);
  const goTo = useCallback((i: number) => setSlide(i), []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const hero = document.getElementById("hero");
      if (!hero?.matches(":focus-within")) return;
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [prev, next]);

  const isDark = slide > 0;

  return (
    <section
      id="hero"
      data-section="hero"
      data-header-theme={isDark ? "dark" : "dark"}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <Slide key={i} data={s} visible={reduced ? i === 0 : slide === i} reduced={!!reduced} isFirst={i === 0} />
      ))}

      {/* Bottom nav bar */}
      {!reduced && (
        <div
          style={{
            position: "absolute",
            bottom: "clamp(20px, 3vw, 36px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Prev */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,.18)",
              border: "1px solid rgba(255,255,255,.3)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.32)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.18)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M9 2L4 7L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Progress bars — act as both indicator and timing */}
          <ProgressBars
            total={total}
            active={slide}
            paused={paused}
            interval={INTERVAL}
            onDone={next}
          />

          {/* Next */}
          <button
            onClick={next}
            aria-label="Next slide"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,.18)",
              border: "1px solid rgba(255,255,255,.3)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.32)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.18)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M5 2L10 7L5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
