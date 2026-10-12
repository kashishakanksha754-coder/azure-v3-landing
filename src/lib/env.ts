const PROD_HOST = "azureinnovations.co.in";

export function isProd(): boolean {
  if (typeof window !== "undefined") {
    return window.location.hostname === PROD_HOST;
  }
  return process.env.VERCEL_URL?.includes(PROD_HOST) ||
    process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV?.includes("preview");
}

export function showDrafts(): boolean {
  return !isProd();
}
