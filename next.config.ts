import type { NextConfig } from "next";
import { execSync } from "child_process";

function shell(cmd: string, fallback = "unknown"): string {
  try { return execSync(cmd, { encoding: "utf8" }).trim(); }
  catch { return fallback; }
}

const buildSha =
  (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 8) ||
  shell("git rev-parse --short HEAD");

const buildNote =
  (process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "").slice(0, 60) ||
  shell("git log -1 --format=%s").slice(0, 60);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_SHA: buildSha,
    NEXT_PUBLIC_BUILD_NOTE: buildNote,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/solutions/education",
        destination: "/solutions",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
