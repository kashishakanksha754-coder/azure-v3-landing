"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { PRODUCTS, SHOP_FILTERS } from "@/config/site";
import type { ProductCategory } from "@/config/site";
import { PAGES_LIVE } from "@/config/pages";
import ImagePanel from "@/components/ui/ImagePanel";
import Pill from "@/components/ui/Pill";
import Tag from "@/components/ui/Tag";

const EASE = [0.22, 1, 0.36, 1] as const;

// Shine sweep overlay — mount with a new key each time to restart the CSS animation
function ShineOverlay({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain" as string,
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,.45) 50%, transparent 65%)",
        backgroundSize: "250% 100%",
        animation: "shop-shine 1.2s ease-in-out forwards",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}

function ShopBanner() {
  return (
    <section id="shop" data-section="shop" className="section" style={{ background: "#fff", paddingBottom: 0 }}>
      <div className="container">
        <div style={{ borderRadius: "var(--radius-img)", overflow: "hidden" }}>
          <ImagePanel
            src="/images/desk-devices.jpg"
            alt="Apple devices for your team"
            ratio="21/9"
            scrim="left"
            sizes="100vw"
          >
            <div style={{ maxWidth: 520 }}>
              <span style={{ display: "inline-block", marginBottom: 20 }}>
                <Tag variant="on-dark">Shop</Tag>
              </span>
              <h2 style={{ fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
                Apple devices for your team.
              </h2>
              <p style={{ fontSize: "clamp(15px, 1.4vw, 17px)", color: "rgba(255,255,255,.75)", lineHeight: 1.65, marginBottom: 28 }}>
                Genuine Apple and Microsoft Surface products — supplied, set up and supported.
              </p>
              <Pill variant="white" href="#contact?need=devices">Get a quote</Pill>
            </div>
          </ImagePanel>
        </div>
      </div>
    </section>
  );
}

export default function Shop() {
  if (!PAGES_LIVE.shop) return <ShopBanner />;

  const [active, setActive] = useState<"All" | ProductCategory>("All");
  const [shineKeys, setShineKeys] = useState<Record<string, number>>({});
  const reduced = useReducedMotion();
  const fireShine = useCallback((id: string) => {
    if (reduced) return;
    setShineKeys((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, [reduced]);

  const filtered =
    active === "All"
      ? PRODUCTS.slice(0, 6)
      : PRODUCTS.filter((p) => p.category === active).slice(0, 6);

  const isEmpty = active !== "All" && filtered.length === 0;

  return (
    <>
      <section id="shop" data-section="shop" style={{ background: "var(--section-bg)" }}>
        <div className="container">
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 48,
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ marginBottom: 10 }}
              >
                Shop the latest from Apple and Microsoft.
              </motion.h2>
              <p style={{ fontSize: 17, color: "var(--text-muted)" }}>
                Genuine products. Enquire for personal or business purchases.
              </p>
            </div>
            <Link href="/shop" className="link-arrow" style={{ flexShrink: 0 }}>
              View all products <span>→</span>
            </Link>
          </div>

          {/* Filter pills */}
          <LayoutGroup>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 48,
                overflowX: "auto",
                paddingBottom: 4,
                scrollbarWidth: "none",
              }}
            >
              {(["All", ...SHOP_FILTERS] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f as "All" | ProductCategory)}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    boxSizing: "border-box",
                    height: 48, minHeight: 48, padding: "0 22px", borderRadius: 999,
                    border: `1px solid ${active === f ? "transparent" : "var(--pill-border)"}`,
                    background: active === f ? "var(--blue-bright)" : "transparent",
                    color: active === f ? "#fff" : "var(--text)",
                    fontSize: 15, lineHeight: 1,
                    cursor: "pointer", fontFamily: "var(--font)", fontWeight: 400,
                    whiteSpace: "nowrap", flexShrink: 0,
                    transition: "background 0.25s, color 0.25s, border-color 0.25s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </LayoutGroup>

          {/* Grid */}
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                borderRadius: "var(--radius-card)",
                background: "var(--card)",
                padding: "56px 40px",
                textAlign: "center",
              }}
            >
              <h3 style={{ marginBottom: 12 }}>Looking for {active}?</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
                Tell us what you need and we&rsquo;ll help you find it.
              </p>
              <Pill variant="white" href={`#contact?need=${String(active).toLowerCase()}`}>Enquire Now</Pill>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="shop-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
                    onMouseEnter={() => fireShine(p.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "#fff",
                      borderRadius: "var(--radius-card-sm)",
                      overflow: "hidden",
                      boxShadow: "0 12px 32px -16px rgba(31,111,216,.25)",
                    }}
                  >
                    {/* Square image box */}
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "1 / 1",
                        background: "#fff",
                        borderRadius: "var(--radius-card-sm)",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {p.tag && (
                        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
                          <Tag
                            size="chip"
                            style={
                              p.tag === "NEW"
                                ? { background: "var(--magenta-600)", borderColor: "var(--magenta-600)", color: "#fff" }
                                : p.tag === "BESTSELLER"
                                ? { background: "var(--blue-bright)", borderColor: "var(--blue-bright)", color: "#fff" }
                                : p.tag === "FEATURED"
                                ? { background: "var(--navy-900)", borderColor: "var(--navy-900)", color: "#fff" }
                                : undefined
                            }
                          >
                            {p.tag}
                          </Tag>
                        </div>
                      )}
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 48vw, 32vw"
                        style={{ objectFit: "contain" }}
                      />
                      {p.id === "iphone-18-pro" && (shineKeys[p.id] ?? 0) > 0 && (
                        <ShineOverlay key={shineKeys[p.id]} src={p.image} />
                      )}
                    </div>

                    {/* Card body */}
                    <div
                      style={{
                        padding: "24px 28px 32px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: 8,
                          fontSize: 22,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.name}
                      </h3>
                      <p
                        style={{
                          fontSize: 16,
                          color: "var(--text-muted)",
                          marginBottom: 24,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: "2.5em",
                          lineHeight: 1.5,
                        }}
                      >
                        {p.desc}
                      </p>
                      <Pill
                        size="md"
                        roll
                        variant="primary"
                        href={`#contact?need=${p.id}`}
                        style={{ marginTop: "auto", alignSelf: "flex-start" }}
                      >
                        Enquire Now
                      </Pill>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Mobile swipe: cards at 78vw, only shown < 640px */}
          <style>{`
            @keyframes shop-shine {
              from { background-position: 150% center; }
              to   { background-position: -50% center; }
            }
            @media (max-width: 639px) {
              .shop-grid {
                display: flex !important;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
                gap: 16px !important;
              }
              .shop-grid > div {
                min-width: 78vw;
                scroll-snap-align: start;
                flex-shrink: 0;
              }
            }
            @media (max-width: 1023px) and (min-width: 640px) {
              .shop-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>

          {/* Business quote banner */}
          <div
            data-surface="dark"
            style={{
              marginTop: 40,
              borderRadius: "var(--radius-card)",
              background: "var(--grad-brand)",
              boxShadow: "inset 0 0 0 1px rgba(168,90,123,.18)",
              padding: "clamp(32px, 4vw, 56px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3 style={{ marginBottom: 8, fontSize: "clamp(22px, 2vw, 32px)", color: "var(--on-dark)" }}>
                Buying for your organisation?
              </h3>
              <p style={{ color: "var(--on-dark-muted)", fontSize: 17 }}>
                Get a business quote for bulk and institutional orders.
              </p>
            </div>
            <Pill
              variant="outline-white"
              href="#contact?need=business-quote"
              style={{ flexShrink: 0 }}
            >
              Get a business quote
            </Pill>
          </div>
        </div>
      </section>
    </>
  );
}
