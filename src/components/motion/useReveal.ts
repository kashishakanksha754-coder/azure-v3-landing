"use client";
import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement>(threshold = 0.85) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * threshold && r.bottom > 0) { setRevealed(true); return true; }
      return false;
    };
    if (reduce || check()) { setRevealed(true); return; }
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (check()) cleanup(); }); };
    const cleanup = () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const failsafe = setTimeout(() => setRevealed(true), 4000);
    return () => { cleanup(); clearTimeout(failsafe); cancelAnimationFrame(raf); };
  }, [revealed, threshold]);

  return { ref, revealed };
}
