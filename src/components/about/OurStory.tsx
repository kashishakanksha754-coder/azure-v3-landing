"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/motion/useReveal";
import { EASE } from "@/components/motion/useSlide";
import { about } from "@/config/about";
import Tag from "@/components/ui/Tag";

const { story } = about;

export default function OurStory({ showDrafts }: { showDrafts: boolean }) {
  const reduced = useReducedMotion();
  const { ref: gridRef, revealed } = useReveal<HTMLDivElement>(0.2);

  const shouldShow = story.approved || showDrafts;
  if (!shouldShow) return null;

  return (
    <section id="story" aria-labelledby="story-h2" className="section" style={{ paddingBlock: "var(--space-section)" }}>
      <div className="container">
          {/* Untransformed wrapper for useReveal */}
          <div ref={gridRef}>
            <div className="story-split-grid">
              <style>{`
                .story-split-grid {
                  display: grid;
                  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
                  gap: 48px;
                  align-items: stretch;
                }
                @media (max-width: 1023px) {
                  .story-split-grid {
                    grid-template-columns: 1fr !important;
                    gap: clamp(16px, 2.5vw, 24px) !important;
                  }
                  .story-photo-card { aspect-ratio: 1 / 1 !important; width: 100%; }
                }
              `}</style>

              {/* LEFT — Photo card (square) */}
              <motion.div
                className="story-photo-card"
                initial={reduced ? false : { opacity: 0, x: -48, scale: 1.06 }}
                animate={revealed ? { opacity: 1, x: 0, scale: 1 } : undefined}
                transition={{ duration: 0.9, ease: EASE }}
                style={{
                  borderRadius: 40,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "1 / 1",
                }}
              >
                <Image
                  src={story.photo.src}
                  alt={story.photo.alt}
                  fill
                  sizes="(max-width: 1023px) 90vw, 55vw"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </motion.div>

              {/* RIGHT — Text card */}
              <motion.div
                initial={reduced ? false : { opacity: 0, x: 48 }}
                animate={revealed ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                style={{
                  borderRadius: 40,
                  background: "var(--surface-blue)",
                  border: "1px solid #BBD3F5",
                  padding: "clamp(28px, 3vw, 48px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* Tag */}
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={revealed ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
                  style={{ marginBottom: 20 }}
                >
                  <Tag variant="outline">{story.tag}</Tag>
                </motion.div>

                {/* H2 */}
                <motion.h2
                  id="story-h2"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={revealed ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.39 }}
                  style={{
                    fontSize: "clamp(30px, 2.8vw, 44px)",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.15,
                    textWrap: "balance",
                    marginBottom: 24,
                  }}
                >
                  {story.h2.replace("team-driven", "team‑driven")}
                </motion.h2>

                {/* Body paragraphs */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                  {story.body.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={revealed ? { opacity: 1, y: 0 } : undefined}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.48 + i * 0.09 }}
                      style={{
                        fontSize: "clamp(16px, 1.4vw, 18px)",
                        color: "var(--text-muted)",
                        lineHeight: 1.65,
                      }}
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>

                {/* Contact pill */}
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={revealed ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.48 + story.body.length * 0.09 }}
                >
                  <a
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 52,
                      padding: "0 28px",
                      borderRadius: 999,
                      background: "var(--ink)",
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 400,
                      textDecoration: "none",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Get in touch
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
    </section>
  );
}
