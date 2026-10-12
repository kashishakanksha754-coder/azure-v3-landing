"use client";
import { useEffect, useState } from "react";

export function usePreviewMode(key: string) {
  const [isProduction, setIsProduction] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const prodHosts = (process.env.NEXT_PUBLIC_PRODUCTION_HOSTS || "azureinnovations.co.in")
      .split(",").map((h) => h.trim());
    const isProd = prodHosts.some((h) => host === h || host.endsWith("." + h));
    setIsProduction(isProd);

    if (!isProd) {
      const params = new URLSearchParams(window.location.search);
      const isSample = process.env.NEXT_PUBLIC_SAMPLE_CONTENT === "true";
      setShowPreview(isSample || params.get("preview") === key);
    }
  }, [key]);

  useEffect(() => {
    if (showPreview && !isProduction) {
      console.warn(`[About] Preview mode active — unconfirmed content is visible. Remove ?preview=${key} or set NEXT_PUBLIC_SAMPLE_CONTENT=false before going live.`);
    }
  }, [showPreview, isProduction, key]);

  return { isProduction, showPreview };
}
