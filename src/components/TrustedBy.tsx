"use client";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { CLIENT_LOGOS, PARTNER } from "@/config/site";

// Show logos with explicit approved + permission, never education clients
const ACTIVE_LOGOS = CLIENT_LOGOS.filter(
  (l) => (l as { approved?: boolean }).approved && (l as { permission?: boolean }).permission && !(l as { education?: boolean }).education
);

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Per-side blur overlay — 3 layers, strongest at outer edge ─────────────
function BlurEdge({ side }: { side: "left" | "right" }) {
  const dir = side === "left" ? "to right" : "to left";
  const layers = [
    { blur: 2,  mask: `linear-gradient(${dir}, black 0%, black 40%, transparent 100%)` },
    { blur: 5,  mask: `linear-gradient(${dir}, black 0%, black 25%, transparent 65%)` },
    { blur: 10, mask: `linear-gradient(${dir}, black 0%, transparent 35%)` },
  ];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        [side]: 0,
        top: 0,
        bottom: 0,
        width: "clamp(80px, 10vw, 200px)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {layers.map(({ blur, mask }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
    </div>
  );
}

// ── Moving logo row ────────────────────────────────────────────────────────
function Marquee({ logos }: { logos: readonly { name: string; src: string; scale: number }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const x = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (isPaused.current || !trackRef.current) return;
    const halfW = trackRef.current.scrollWidth / 2;
    if (halfW === 0) return;
    const pps = halfW / 45;
    let next = x.get() - pps * (delta / 1000);
    if (next <= -halfW) next += halfW;
    x.set(next);
  });

  const doubled = [...logos, ...logos];

  return (
    <div
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <motion.div
        ref={trackRef}
        style={{
          x,
          display: "flex",
          alignItems: "center",
          gap: "var(--tb-gap)",
          width: "max-content",
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="tb-logo"
            style={{
              flexShrink: 0,
              transform: `scale(${logo.scale})`,
              transformOrigin: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              style={{
                width: "auto",
                height: "var(--tb-h)",
                maxWidth: 120,
                objectFit: "contain",
                filter: "grayscale(1) contrast(1.1)",
                opacity: 0.7,
                mixBlendMode: "multiply",
                display: "block",
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const PARTNER_FALLBACK = [
  { name: PARTNER.apple,     src: "/brand/logo.png",           scale: 1   },
  { name: PARTNER.microsoft, src: "/brand/logo-footer.png",    scale: 0.9 },
] as const;

// ── Main section ───────────────────────────────────────────────────────────
export default function TrustedBy() {
  const reduced = useReducedMotion();
  const logos = ACTIVE_LOGOS.length >= 3 ? ACTIVE_LOGOS : PARTNER_FALLBACK;
  const eyebrow = ACTIVE_LOGOS.length >= 3 ? "Trusted by" : "We are";

  return (
    <div data-section="trusted-by" style={{ paddingInline: "clamp(8px, 1.1vw, 16px)", marginBlock: "clamp(24px, 3vw, 40px)" }}>
      <style>{`
        .tb-panel { --tb-h: 30px; --tb-gap: 72px; }
        @media (max-width: 479px) {
          .tb-panel { --tb-h: 24px; --tb-gap: 48px; }
        }
        .tb-logo img { transition: opacity 200ms, filter 200ms; }
        .tb-logo:hover img { opacity: 1 !important; filter: grayscale(0) contrast(1) !important; }
      `}</style>

      <div
        className="tb-panel"
        style={{
          background: "#FFFFFF",
          borderRadius: "clamp(32px, 3.3vw, 48px)",
          paddingBlock: "clamp(44px, 5vw, 64px)",
          overflow: "hidden",
          border: "1px solid var(--line)",
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            textAlign: "center",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-muted)",
            marginBottom: 36,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </motion.p>

        {reduced ? (
          // Reduced motion: static centred wrapping row
          <div
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              paddingInline: "clamp(24px, 4vw, 48px)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "clamp(32px, 4vw, 56px)",
              rowGap: 28,
            }}
          >
            {logos.map((logo) => (
              <div
                key={logo.name}
                style={{ transform: `scale(${logo.scale})`, transformOrigin: "center" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{
                    width: "auto",
                    height: "var(--tb-h)",
                    maxWidth: 120,
                    objectFit: "contain",
                    filter: "grayscale(1) contrast(1.1)",
                    opacity: 0.7,
                    mixBlendMode: "multiply",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          // Moving marquee with fade + blur at edges
          <div style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}>
            <div
              style={{
                overflow: "hidden",
                maskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)",
              }}
            >
              <Marquee logos={logos} />
            </div>
            <BlurEdge side="left" />
            <BlurEdge side="right" />
          </div>
        )}
      </div>
    </div>
  );
}
