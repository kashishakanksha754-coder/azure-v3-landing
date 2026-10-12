"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useReveal } from "@/components/motion/useReveal";
import { HERO_COLLAGE } from "@/config/hero-collage";

const EASE = [0.22, 1, 0.36, 1] as const;

const TILE_BG: Record<string, string> = {
  "iphone-18-pro":  "var(--surface-pink)",
  "iphone-se":      "var(--surface-pink)",
  "iphone-17-pro":  "var(--surface-pink)",
  "watch-ultra-4":  "var(--surface-pink)",
  "macbook-pro-m5": "var(--surface-blue)",
  "macbook-neo":    "var(--surface-blue)",
  "airpods-pro":    "var(--surface-blue)",
};

// Homepage: treat each HERO_COLLAGE entry as a column with 2 rows
// About: transpose — left col = rows[*][0], right col = rows[*][1] (3 rows shown, row 2+ = optional)
function getColumns(variant: "hero" | "about") {
  if (variant === "about") {
    return [
      HERO_COLLAGE.slice(0, 3).map((row) => row[0]),
      HERO_COLLAGE.slice(0, 3).map((row) => row[1]),
    ] as const;
  }
  return HERO_COLLAGE as unknown as readonly (readonly { id: string; src: string; alt: string; scale?: number }[])[];
}

interface Props {
  variant: "hero" | "about";
  reduced: boolean;
  fadeColor: string;
}

export default function ProductCollage({ variant, reduced, fadeColor }: Props) {
  const tileRef = useRef<HTMLDivElement>(null);
  const twMV = useMotionValue(240);
  const { scrollY } = useScroll();
  const [viewH, setViewH] = useState(900);
  const { ref: revealRef, revealed } = useReveal<HTMLDivElement>(0.1);

  useEffect(() => { setViewH(window.innerHeight); }, []);

  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    const measure = () => { if (el.offsetWidth > 0) twMV.set(el.offsetWidth); };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [twMV]);

  // 0→1 as user scrolls 60% of viewport height — same as homepage
  const rawP = useTransform(scrollY, [0, viewH * 0.6], [0, 1]);
  const p = useSpring(rawP, { stiffness: 120, damping: 30 });
  // odd 1-indexed cols (0-indexed 0,2,4): 0 → +0.4325·tw
  // even 1-indexed cols (0-indexed 1,3): +0.1587·tw → 0
  const yOdd  = useTransform([p, twMV], ([pv, twv]: number[]) => pv * 0.4325 * twv);
  const yEven = useTransform([p, twMV], ([pv, twv]: number[]) => (1 - pv) * 0.1587 * twv);

  const isAbout = variant === "about";
  const columns = getColumns(variant);
  const shouldAnimate = isAbout ? revealed : true;

  return (
    <div
      ref={isAbout ? revealRef : undefined}
      className={isAbout ? "pc-about" : "collage"}
    >
      <style>{`
        /* ── shared derived geometry (--tw set per variant below) ── */
        .collage, .pc-about {
          --th: calc(var(--tw) * 1.0397);
          --cg: calc(var(--tw) * 0.1984);
          --rg: calc(var(--tw) * 0.0694);
          --off: calc(var(--tw) * 0.4325);
          --rad: calc(var(--tw) * 0.1587);
          position: relative;
          display: grid;
          column-gap: var(--cg);
          padding-bottom: var(--off);
        }
        /* homepage: 4 columns; tw derived so 4·tw + 3·cg = viewport width */
        .collage {
          --tw: clamp(104px, calc(100vw / 4.5952), 340px);
          grid-template-columns: repeat(4, var(--tw));
          justify-content: center;
        }
        /* about: 2-column right-aligned */
        .pc-about {
          --tw: clamp(104px, 16.65vw, 340px);
          grid-template-columns: repeat(2, var(--tw));
          justify-content: end;
        }
        .pc-col {
          display: flex;
          flex-direction: column;
          gap: var(--rg);
          will-change: transform;
        }
        .pc-tile {
          width: var(--tw);
          height: var(--th);
          border-radius: var(--rad);
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
          cursor: default;
        }
        .pc-tile-img {
          position: absolute;
          inset: 14% 14% 18%;
          transform: scale(var(--product-scale, 1));
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .pc-tile:hover .pc-tile-img { transform: scale(calc(var(--product-scale, 1) * 1.04)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pc-tile:hover .pc-tile-img { transform: scale(var(--product-scale, 1)); }
        }
        /* mobile: 3 cols for homepage (keep cols 1,2,3) */
        @media (max-width: 767px) {
          .collage {
            --tw: 29vw;
            --cg: 3.2vw;
            grid-template-columns: repeat(3, var(--tw));
          }
          .pc-col-hide-mobile { display: none !important; }
          .pc-about {
            --tw: clamp(104px, 38vw, 220px);
            grid-template-columns: repeat(2, var(--tw));
            justify-content: center;
          }
        }
      `}</style>

      {columns.map((col, colIdx) => {
        const isOddCol = colIdx % 2 === 0; // 0-indexed 0,2,4 → odd 1-indexed
        const hideMobile = !isAbout && (colIdx === 0 || colIdx === 4);
        return (
          <motion.div
            key={colIdx}
            className={`pc-col${hideMobile ? " pc-col-hide-mobile" : ""}`}
            style={reduced ? undefined : { y: isOddCol ? yOdd : yEven }}
          >
            {(col as readonly { id: string; src: string; alt: string; scale?: number }[]).map((product, rowIdx) => {
              const isOptional = isAbout && rowIdx >= 2;
              const initial = isAbout
                ? (reduced ? false : { opacity: 0, x: 48, scale: 0.96 })
                : (reduced ? false : { opacity: 0, y: 56, scale: 0.96 });
              return (
                <motion.div
                  key={product.id}
                  initial={initial}
                  animate={shouldAnimate ? { opacity: isOptional ? 0.4 : 1, x: 0, y: 0, scale: 1 } : undefined}
                  transition={{
                    duration: 0.9,
                    ease: EASE,
                    delay: colIdx * 0.09 + rowIdx * 0.12,
                  }}
                >
                  <div
                    className="pc-tile"
                    ref={colIdx === (isAbout ? 0 : 2) && rowIdx === 0 ? tileRef : undefined}
                    style={{ "--product-scale": product.scale ?? 1, background: TILE_BG[product.id] ?? "var(--tile)" } as React.CSSProperties}
                  >
                    <div className="pc-tile-img">
                      <Image
                        src={product.src}
                        alt={product.alt}
                        fill
                        sizes={
                          isAbout
                            ? "(max-width: 767px) 42vw, (max-width: 1920px) 22vw, 340px"
                            : "(max-width: 767px) 29vw, (max-width: 1562px) 22vw, 340px"
                        }
                        style={{
                          objectFit: "contain",
                          filter: "drop-shadow(0 calc(var(--tw) * .06) calc(var(--tw) * .08) rgba(1,21,47,.18))",
                        }}
                        priority={rowIdx === 0 && colIdx <= 2}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}

      {/* Bottom fade */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: 10,
          ...(isAbout
            ? {
                bottom: 0, left: 0, right: 0,
                height: "35%",
                background: `linear-gradient(to top, ${fadeColor} 0%, transparent 100%)`,
              }
            : {
                inset: 0,
                background: `linear-gradient(to bottom,
                  transparent                                         0%,
                  transparent                                        42%,
                  color-mix(in srgb, ${fadeColor} 12%, transparent) 50%,
                  color-mix(in srgb, ${fadeColor} 50%, transparent) 68%,
                  color-mix(in srgb, ${fadeColor} 85%, transparent) 88%,
                  ${fadeColor}                                      100%)`,
              }),
        }}
      />
    </div>
  );
}
