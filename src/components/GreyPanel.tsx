"use client";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GreyPanel({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <div
      style={{
        paddingLeft: "clamp(8px, 1.1vw, 16px)",
        paddingRight: "clamp(8px, 1.1vw, 16px)",
        marginBlock: "clamp(24px, 3vw, 40px)",
      }}
    >
      <motion.div
        data-surface="grey"
        initial={reduced ? false : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{
          background: "var(--section-bg)",
          borderRadius: "clamp(32px, 3.3vw, 48px)",
          paddingBlock: "clamp(80px, 9vw, 128px)",
          overflow: "hidden",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
