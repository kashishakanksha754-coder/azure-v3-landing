"use client";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function useSlide() {
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMobile(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const dist = reduce || mobile ? 0 : 90;
  const rise = reduce ? 0 : mobile ? 32 : 0;
  const dur  = reduce ? 0.2 : 1;
  const gap  = reduce ? 0 : 0.09;

  const col = (side: "left" | "right", delay = 0) => ({
    hidden: { opacity: 0, x: side === "left" ? -dist : dist, y: rise },
    show: {
      opacity: 1, x: 0, y: 0,
      transition: { duration: dur, ease: EASE, delay, when: "beforeChildren", staggerChildren: gap },
    },
  });

  const item = (from: "left" | "right" | "up" = "up") => ({
    hidden: {
      opacity: 0,
      x: from === "left" ? -dist * 0.4 : from === "right" ? dist * 0.4 : 0,
      y: from === "up" ? (reduce ? 0 : 18) : rise * 0.5,
    },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: reduce ? 0.2 : 0.7, ease: EASE } },
  });

  const pop = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: reduce ? 0.2 : 0.5, ease: EASE } },
  };

  const line = {
    hidden: { scaleX: reduce ? 1 : 0 },
    show: { scaleX: 1, transition: { duration: reduce ? 0.2 : 0.8, ease: EASE } },
  };

  return { col, item, pop, line, reduce };
}

export const inView = { once: true, amount: 0.3 } as const;
