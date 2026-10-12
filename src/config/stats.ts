import { SITE, PARTNER, APPLE_PRODUCT_LINES } from "./site";
import { SERVICES_DATA } from "./services";
import { SOLUTIONS_LIST } from "./solutions";
import { INDUSTRIES } from "./industries";

// ── Stat where value = items.length ──────────────────────────────────────────
export type DerivedStat = {
  id: string;
  label: string;
  items: readonly string[];
  source: string;
  confirmed: boolean;
  showInGlance: boolean;
};

// ── Stat with a client-supplied number (never derived from a list) ────────────
// Renders only when value is a number AND confirmed is true
export type ClientStat = {
  id: string;
  label: string;
  source: "client-confirmed";
  value: number | null;
  suffix?: string;
  confirmed: boolean;
  showInGlance: boolean;
};

export type StatConfig = DerivedStat | ClientStat;

// ── Contact channels derived from site config ─────────────────────────────────
const contactItems: string[] = [
  ...(SITE.contact.whatsappUrl ? ["WhatsApp"] : []),
  ...(SITE.contact.phone       ? ["Phone"]    : []),
  ...(SITE.contact.email       ? ["Email"]    : []),
];

// ── 12 production stats (confirmed:true) ─────────────────────────────────────
// Production order: offices, service areas, brand partners, solution areas,
// industry sectors, Apple product lines, sales channels, core values,
// buying options, extra solutions, contact channels, head office
export const PROD_STATS: DerivedStat[] = [
  {
    id: "offices",
    label: "Offices across Delhi NCR",
    items: SITE.locations.map((l) => l.name.split(",")[0].trim()),
    source: "site config",
    confirmed: true,
    showInGlance: true,
  },
  {
    id: "services",
    label: "Service areas",
    items: SERVICES_DATA.map((s) => s.title),
    source: "services config",
    confirmed: true,
    showInGlance: true,
  },
  {
    id: "partners",
    label: "Brand partners",
    items: Object.values(PARTNER) as string[],
    source: "site config",
    confirmed: true,
    showInGlance: true,
  },
  {
    id: "solutions",
    label: "Solution areas",
    items: SOLUTIONS_LIST.filter((s) => !s.hiddenInProd).map((s) => s.title),
    source: "solutions config",
    confirmed: true,
    showInGlance: true,
  },
  {
    id: "industries",
    label: "Industry sectors",
    items: INDUSTRIES.map((i) => i.name),
    source: "industries config",
    confirmed: true,
    showInGlance: true,
  },
  {
    id: "apple-lines",
    label: "Apple product lines",
    items: APPLE_PRODUCT_LINES,
    source: "company profile",
    confirmed: true,
    showInGlance: false,
  },
  {
    id: "sales-channels",
    label: "Sales channels",
    items: ["Direct sales", "Indirect channels", "Systems integrators"],
    source: "company profile",
    confirmed: true,
    showInGlance: false,
  },
  {
    id: "core-values",
    label: "Core values",
    items: ["Customer focus", "Excellence", "Openness", "Ongoing support"],
    source: "company profile",
    confirmed: true,
    showInGlance: false,
  },
  {
    id: "buying-options",
    label: "Buying options",
    items: ["Leasing and financing", "Buyback on old devices", "Promotional discounts", "OEM cashback offers"],
    source: "company profile",
    confirmed: true,
    showInGlance: false,
  },
  {
    id: "extra-solutions",
    label: "Extra solutions",
    items: [
      "Mobile application development",
      "Video streaming solutions",
      "Surveillance and security solutions",
      "AV solutions",
    ],
    source: "company profile",
    confirmed: true,
    showInGlance: false,
  },
  {
    id: "contact-channels",
    label: "Ways to reach us",
    items: contactItems,
    source: "site config",
    confirmed: true,
    showInGlance: false,
  },
  {
    id: "head-office",
    label: "Head office",
    items: ["Naraina", "New Delhi"],
    source: "site config",
    confirmed: true,
    showInGlance: false,
  },
];

// ── Draft-only extra stats (confirmed:false or value:null) ────────────────────
// Rendered only when showDrafts() is true.
// Note: customers-served never renders while value is null — even in draft mode.
export const DRAFT_STATS_EXTRA: StatConfig[] = [
  {
    id: "authorised-brands",
    label: "Authorised brands",
    items: ["Apple", "Microsoft Surface", "Canon", "Samsung"],
    source: "company profile",
    confirmed: false,
    showInGlance: false,
  },
  {
    id: "customers-served",
    label: "Customers served",
    source: "client-confirmed",
    value: null,
    suffix: "+",
    confirmed: false,
    showInGlance: false,
  },
];
