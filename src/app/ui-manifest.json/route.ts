import { NextResponse } from "next/server";

const SECTIONS = [
  "header",
  "hero",
  "trusted-by",
  "about",
  "solutions",
  "services",
  "industries",
  "shop",
  "testimonials",
  "success-stories",
  "cta",
  "footer",
] as const;

const IMAGE_PANEL_COUNTS: Record<string, number> = {
  header:           1,
  hero:             3,
  "trusted-by":     0,
  about:            1,
  solutions:        8,
  services:         4,
  industries:       5,
  shop:             1,
  testimonials:     1,
  "success-stories": 4,
  cta:              1,
  footer:           0,
};

const PALETTE_TOKENS = {
  "--pink-50":  "#FDF4F8",
  "--pink-100": "#F9E6EF",
  "--pink-200": "#F1CADB",
  "--pink-300": "#E4A3BF",
  "--pink-400": "#CB7599",
  "--pink-500": "#A85A7B",
  "--pink-600": "#8F4568",
  "--pink-700": "#743553",
  "--pink-800": "#572740",
  "--pink-900": "#3B1A2B",
  "--pink-950": "#26101C",
  "--grad-brand": "linear-gradient(135deg, #26101C 0%, #743553 50%, #CB7599 100%)",
  "--radius-img": "28px",
  "--section-gap": "clamp(88px, 11vw, 160px)",
};

export function GET() {
  const buildSha =
    (process.env.NEXT_PUBLIC_BUILD_SHA ??
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 8)) ||
    "local";

  return NextResponse.json({
    buildSha,
    sections: SECTIONS,
    imagePanelCounts: IMAGE_PANEL_COUNTS,
    paletteTokens: PALETTE_TOKENS,
  });
}
