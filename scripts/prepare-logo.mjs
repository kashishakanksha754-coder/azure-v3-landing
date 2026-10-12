// Logo preparation script — run with: node scripts/prepare-logo.mjs
// Source: the 2081×1057 PNG shared by the client (transparent background, grey+purple)
import sharp from "sharp";
import { statSync, copyFileSync } from "fs";

const SRC  = process.argv[2] || "assets-src/logo/source.png";
const OUT  = "public/brand";
const MIN_H = 600; // minimum output height

// ── RGB ↔ HSL helpers ─────────────────────────────────────────────────────────
function rgbToHsl(r, g, b) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
  let h=0, s=0, l=(max+min)/2;
  if (d>0) {
    s=d/(1-Math.abs(2*l-1));
    if (max===r) h=((g-b)/d+6)%6;
    else if (max===g) h=(b-r)/d+2;
    else h=(r-g)/d+4;
    h/=6;
  }
  return [h,s,l];
}
function hslToRgb(h,s,l) {
  const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h*6)%2-1)), m=l-c/2;
  let r=0,g=0,b=0;
  const hi=Math.floor(h*6)%6;
  if      (hi===0){r=c;g=x;}
  else if (hi===1){r=x;g=c;}
  else if (hi===2){g=c;b=x;}
  else if (hi===3){g=x;b=c;}
  else if (hi===4){r=x;b=c;}
  else            {r=c;b=x;}
  return [Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];
}

// ── Load and trim source ──────────────────────────────────────────────────────
console.log(`Source: ${SRC}`);
const srcMeta = await sharp(SRC).metadata();
console.log(`  ${srcMeta.width}×${srcMeta.height} hasAlpha:${srcMeta.hasAlpha}`);

// Trim: use sharp's built-in trim (removes transparent edges)
const trimBuf = await sharp(SRC).ensureAlpha().trim({ threshold: 5 }).toBuffer();
const trimMeta = await sharp(trimBuf).metadata();
console.log(`  Trimmed: ${trimMeta.width}×${trimMeta.height}`);

// Scale to ensure height ≥ MIN_H; don't downscale if already bigger
const scale = trimMeta.height < MIN_H ? Math.ceil(MIN_H / trimMeta.height) : 1;
const outW = trimMeta.width  * scale;
const outH = trimMeta.height * scale;
console.log(`  Scale: ${scale}× → ${outW}×${outH}`);

// ── 1. Header logo (original colours) ────────────────────────────────────────
await sharp(trimBuf)
  .resize(outW, outH, { kernel: "lanczos3", fit: "fill" })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/logo.png`);
await sharp(trimBuf)
  .resize(outW, outH, { kernel: "lanczos3", fit: "fill" })
  .webp({ quality: 95 })
  .toFile(`${OUT}/logo.webp`);
const hm = await sharp(`${OUT}/logo.png`).metadata();
console.log(`\nlogo.png: ${hm.width}×${hm.height}  (${(statSync(OUT+"/logo.png").size/1024).toFixed(0)}KB)`);

// Sample opaque pixels for colour report
{
  const { data, info } = await sharp(`${OUT}/logo.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const greys=[], purples=[];
  for (let i=0; i<info.width*info.height && (greys.length<3||purples.length<3); i++) {
    const a=data[i*4+3]; if(a<200) continue;
    const [,s]=rgbToHsl(data[i*4],data[i*4+1],data[i*4+2]);
    const col=`rgb(${data[i*4]},${data[i*4+1]},${data[i*4+2]})`;
    if(s<0.18&&greys.length<3) greys.push(col);
    else if(s>=0.18&&purples.length<3) purples.push(col);
  }
  console.log(`  grey samples:   ${greys.join(" | ")}`);
  console.log(`  purple samples: ${purples.join(" | ")}`);
}

// ── 2. Footer logo (grey lightened to be readable on #0F0F0F) ────────────────
const { data: px, info } = await sharp(trimBuf)
  .resize(outW, outH, { kernel: "lanczos3", fit: "fill" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const N   = info.width * info.height;
const out = Buffer.alloc(N * 4);

const SAT_THRESH  = 0.18;  // below = grey
const GREY_L_MIN  = 0.74;  // lightest grey → 74% lightness
const GREY_L_MAX  = 0.90;  // darkest grey  → 90% lightness
const PURPLE_LIFT = 0.08;  // max lightness boost for purple

for (let i=0; i<N; i++) {
  const ri=i*4;
  const r=px[ri], g=px[ri+1], b=px[ri+2], a=px[ri+3];
  out[ri+3]=a;
  if (a<5) { out[ri]=r; out[ri+1]=g; out[ri+2]=b; continue; }
  const [h,s,l]=rgbToHsl(r,g,b);
  let nr,ng,nb;
  if (s<SAT_THRESH) {
    // Grey → remap lightness into readable range, preserve tonal variation
    const newL = GREY_L_MIN + l*(GREY_L_MAX-GREY_L_MIN);
    [nr,ng,nb]=hslToRgb(h,s,newL);
  } else {
    // Purple/pink → keep hue+saturation, slight lightness lift if dark
    const newL = l<0.55 ? Math.min(l+PURPLE_LIFT, 1) : l;
    [nr,ng,nb]=hslToRgb(h,s,newL);
  }
  out[ri]=nr; out[ri+1]=ng; out[ri+2]=nb;
}

const raw2 = { raw: { width: info.width, height: info.height, channels: 4 } };
await sharp(out, raw2).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-footer.png`);
await sharp(out, raw2).webp({ quality: 95 }).toFile(`${OUT}/logo-footer.webp`);

const fm = await sharp(`${OUT}/logo-footer.png`).metadata();
console.log(`\nlogo-footer.png: ${fm.width}×${fm.height}  (${(statSync(OUT+"/logo-footer.png").size/1024).toFixed(0)}KB)`);

{
  const { data: d, info: fi } = await sharp(`${OUT}/logo-footer.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const greys=[], purples=[];
  for (let i=0; i<fi.width*fi.height && (greys.length<3||purples.length<3); i++) {
    const a=d[i*4+3]; if(a<200) continue;
    const [,s]=rgbToHsl(d[i*4],d[i*4+1],d[i*4+2]);
    const col=`rgb(${d[i*4]},${d[i*4+1]},${d[i*4+2]})`;
    if(s<0.18&&greys.length<3) greys.push(col);
    else if(s>=0.18&&purples.length<3) purples.push(col);
  }
  console.log(`  grey  → ${greys.join(" | ")}  (readable on #0F0F0F)`);
  console.log(`  purple kept: ${purples.join(" | ")}`);
}

console.log("\nDone.");
