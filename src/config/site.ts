export const PARTNER = {
  apple: "Apple Business Partner",
  microsoft: "Microsoft Surface Partner",
} as const;

// Apple product lines shown in the menu and derived stats — single source of truth
export const APPLE_PRODUCT_LINES = [
  "Mac", "iPhone", "iPad", "Apple Watch", "Accessories",
] as const;

// Set to false until the badge assets exist in public/brand/
export const SHOW_APPLE_BADGE = false;

// Set to true once Apple approves the required trademark footnote wording
export const SHOW_APPLE_TRADEMARK_LINE = false;

export const SITE = {
  name: "Azure Innovations",
  legalName: "Azure Innovations",
  tagline: PARTNER.apple,
  description:
    "Azure Innovations is an Apple Business Partner and Microsoft Surface Partner. Genuine products with solutions, setup and support for businesses and organisations in Delhi NCR.",
  url: "https://azureinnovations.co.in",

  contact: {
    email: "",
    phone: "+91 98115 11755",
    whatsapp: "919811511755",
    whatsappUrl: "https://wa.me/919811511755",
  },

  locations: [
    {
      name: "Naraina, Delhi",
      label: "Head Office",
      address: "G-15, Ground Floor, Naraina Vihar, New Delhi – 110028",
      phone: "+91 98115 11755",
      mapsUrl: "https://maps.google.com/?q=Naraina+Vihar+New+Delhi",
    },
    {
      name: "Noida",
      label: "Branch",
      address: "",
      phone: "",
      mapsUrl: "",
    },
    {
      name: "Gurgaon",
      label: "Branch",
      address: "",
      phone: "",
      mapsUrl: "",
    },
  ],

  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    whatsapp: "https://wa.me/919811511755",
  },

  enquiryEmail: process.env.ENQUIRY_EMAIL || "",
} as const;

export const PRODUCTS = [
  // ── 2026 new arrivals ───────────────────────────────────────────────────
  {
    id: "iphone-18-pro",
    name: "iPhone 18 Pro",
    category: "iPhone" as const,
    tag: "NEW" as const,
    desc: "New 48MP camera with variable aperture and A20 Pro.",
    image: "/products/iphone-18-pro-gloss.webp",
    href: "/shop/iphone-18-pro",
  },
  {
    id: "watch-series-12",
    name: "Apple Watch Series 12",
    category: "Watch" as const,
    tag: "NEW" as const,
    desc: "New Health Sensing System and S11 chip.",
    image: "/products/watch-series12.webp",
    href: "/shop/watch-series-12",
  },
  {
    id: "watch-ultra-4",
    name: "Apple Watch Ultra 4",
    category: "Watch" as const,
    tag: "NEW" as const,
    desc: "Up to 50 hours of battery life for everyday use.",
    image: "/products/watch-ultra4.webp",
    href: "/shop/watch-ultra-4",
  },
  {
    id: "airpods-5",
    name: "AirPods 5",
    category: "AirPods" as const,
    tag: "NEW" as const,
    desc: "Active Noise Cancellation in an open-ear design.",
    image: "/products/airpods-pro.png",
    href: "/shop/airpods-5",
  },
  {
    id: "mac-studio",
    name: "Mac Studio",
    category: "Mac" as const,
    tag: "NEW" as const,
    desc: "M5 Max and M5 Ultra for the most demanding work.",
    image: "/products/mac-studio.webp",
    href: "/shop/mac-studio",
  },
  // ── Existing products ───────────────────────────────────────────────────
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    category: "iPhone" as const,
    tag: null,
    desc: "A19 Pro chip and a pro camera system with three 48MP cameras.",
    image: "/products/iphone-17-pro.webp",
    href: "/shop/iphone-17-pro",
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    category: "iPhone" as const,
    tag: null,
    desc: "The essential iPhone, refined for everyday use.",
    image: "/products/iphone17.png",
    href: "/shop/iphone-17",
  },
  {
    id: "iphone-17e",
    name: "iPhone 17e",
    category: "iPhone" as const,
    tag: null,
    desc: "Essential iPhone performance at an accessible price.",
    image: "/products/iphone17.png",
    href: "/shop/iphone-17e",
  },
  {
    id: "macbook-neo",
    name: "MacBook Neo",
    category: "Mac" as const,
    tag: null,
    desc: "The next generation of the world's best laptop.",
    image: "/products/macbook-neo.png",
    href: "/shop/macbook-neo",
  },
  {
    id: "macbook-air",
    name: "MacBook Air",
    category: "Mac" as const,
    tag: "BESTSELLER" as const,
    desc: "Thin, light and fast — the best-selling Mac.",
    image: "/products/macbook-air-norm.webp",
    href: "/shop/macbook-air",
  },
  {
    id: "macbook-pro",
    name: "MacBook Pro",
    category: "Mac" as const,
    tag: "FEATURED" as const,
    desc: "Pro performance in a portable design.",
    image: "/products/macbook-pro.png",
    href: "/shop/macbook-pro",
  },
  {
    id: "studio-display",
    name: "Apple Studio Display",
    category: "Mac" as const,
    tag: "FEATURED" as const,
    desc: "A stunning 5K Retina display for creative work.",
    image: "/products/studio-display-norm.webp",
    href: "/shop/studio-display",
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "iPad" as const,
    tag: "BESTSELLER" as const,
    desc: "For field teams, studios and everything in between.",
    image: "/products/ipad-air-norm.webp",
    href: "/shop/ipad-air",
  },
  {
    id: "watch-series-11",
    name: "Apple Watch Series 11",
    category: "Watch" as const,
    tag: null,
    desc: "Advanced health features in an aluminium case.",
    image: "/products/watch-series11.png",
    href: "/shop/watch-series-11",
  },
  {
    id: "watch-se-3",
    name: "Apple Watch SE 3",
    category: "Watch" as const,
    tag: null,
    desc: "Essential Apple Watch at an accessible price.",
    image: "/products/watch-se3.png",
    href: "/shop/watch-se-3",
  },
  {
    id: "watch-ultra-3",
    name: "Apple Watch Ultra 3",
    category: "Watch" as const,
    tag: "FEATURED" as const,
    desc: "The most rugged and capable Apple Watch.",
    image: "/products/watch-ultra3.png",
    href: "/shop/watch-ultra-3",
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    category: "AirPods" as const,
    tag: "BESTSELLER" as const,
    desc: "Industry-leading noise cancellation, all day long.",
    image: "/products/airpods-pro3-norm.webp",
    href: "/shop/airpods-pro-3",
  },
] as const;

export type ProductCategory = "Mac" | "iPad" | "iPhone" | "Watch" | "AirPods" | "Accessories" | "Surface";

export const SHOP_FILTERS: ProductCategory[] = [
  "Mac",
  "iPad",
  "iPhone",
  "Watch",
  "AirPods",
  "Accessories",
  "Surface",
];

export const SOLUTIONS = [
  {
    num: "01",
    title: "Corporate",
    desc: "Devices, setup and management for modern workplaces.",
    img: "/images/corporate.jpg",
    href: "/solutions/corporate",
    clients: "Trusted by EXL, Dentsu, Havas",
    objectPosition: "center center",
  },
  {
    num: "02",
    title: "Healthcare",
    desc: "Reliable, secure technology for clinical and admin teams.",
    img: "/images/healthcare.jpg",
    href: "/solutions/healthcare",
    clients: "Trusted by AIIMS",
    objectPosition: "center 30%",
  },
  {
    num: "03",
    title: "Other Industries",
    desc: "Solutions for manufacturing, media, retail and more.",
    img: "/images/industries.jpg",
    href: "/solutions/other-industries",
    clients: "Trusted by Jindal Steel, Somany, Oriflame",
    objectPosition: "center center",
  },
] as const;

// Set to false to hide the client trust lines on solution cards
export const SHOW_SOLUTION_CLIENTS = true;

// When true, Amity University and OP Jindal Global University logos are removed from
// the Trusted-by marquee and all client logo lists. Default false = logos remain.
export const HIDE_EDUCATION_CLIENTS = false;

export const CLIENT_LOGOS = [
  { name: "Somany Ceramics", src: "/clients/somany.png",       scale: 1,    approved: true,  permission: true,  education: false },
  { name: "AIIMS",           src: "/clients/aiims.png",        scale: 1.2,  approved: true,  permission: true,  education: false },
  { name: "Dentsu",          src: "/clients/dentsu.png",       scale: 1.2,  approved: true,  permission: true,  education: false },
  { name: "EXL",             src: "/clients/exl.jpg",          scale: 1.3,  approved: true,  permission: true,  education: false },
  { name: "Hakuhodo",        src: "/clients/hakuhodo.png",     scale: 0.9,  approved: true,  permission: true,  education: false },
  { name: "Jindal Steel",    src: "/clients/jindal-steel.png", scale: 1,    approved: true,  permission: true,  education: false },
  { name: "Oriflame",        src: "/clients/oriflame.png",     scale: 1,    approved: true,  permission: true,  education: false },
  { name: "Outlook",         src: "/clients/outlook.png",      scale: 1,    approved: true,  permission: true,  education: false },
  { name: "Religare",        src: "/clients/religare.png",     scale: 0.9,  approved: true,  permission: true,  education: false },
  { name: "Amity University",src: "/clients/amity.png",        scale: 1.3,  approved: false, permission: false, education: true  },
  { name: "OP Jindal",       src: "/clients/op-jindal.png",    scale: 1.15, approved: false, permission: false, education: true  },
  { name: "Havas",           src: "/clients/havas.png",        scale: 1,    approved: true,  permission: true,  education: false },
] as const;

export const SHOW_PARTNERS = false;

export const TESTIMONIALS_LIVE = false;
export const STORIES_LIVE = false;
