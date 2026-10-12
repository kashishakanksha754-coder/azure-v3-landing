export interface CollageProduct {
  id: string;
  alt: string;
  src: string;
  scale?: number; // visual balance override 0.9–1.15
}

// 4 rows × 2 columns. Row 0+1 = main 2×2 tiles. Row 2 = optional third row (40% opacity).
// Row 3 reserved for future expansion.
export const HERO_COLLAGE: [CollageProduct, CollageProduct][] = [
  [
    { id: "iphone-18-pro",  alt: "iPhone 18 Pro",    src: "/products/iphone-18-pro-gloss.webp", scale: 1.0 },
    { id: "macbook-pro-m5", alt: "MacBook Pro M5",   src: "/products/macbook-pro-m5.png",       scale: 1.0 },
  ],
  [
    { id: "mac-studio",     alt: "Mac Studio",       src: "/products/mac-studio.avif",          scale: 0.95 },
    { id: "ipad-pro-m4",    alt: "iPad Pro M4",      src: "/products/ipad-pro-m4.png",          scale: 1.0 },
  ],
  [
    { id: "watch-ultra-4",  alt: "Apple Watch Ultra 4", src: "/products/watch-ultra4.avif",     scale: 0.92 },
    { id: "iphone-17-pro",  alt: "iPhone 17 Pro",    src: "/products/iphone-17-pro.avif",       scale: 1.0 },
  ],
  [
    { id: "imac-blue",      alt: "iMac",             src: "/products/imac-blue.png",            scale: 1.0 },
    { id: "iphone-se",      alt: "iPhone SE",        src: "/products/iphone-se-pink.png",       scale: 1.0 },
  ],
];
