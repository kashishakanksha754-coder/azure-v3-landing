export type Flagged<T> = T & { confirmed: boolean };

export const about = {
  hero: {
    tag: "About Azure",
    h1: "Your technology partner across Delhi NCR.",
    promise: "Company with a promise.",
    pills: ["Apple Business Partner", "Microsoft Surface Partner", "Naraina · Noida · Gurgaon"],
    media: { src: "/images/about.jpg", alt: "Azure Innovations store and team" },
  },
  achievements: {
    tag: "Achievements",
    h2: "A track record you can rely on.",
    intro: "Years of partnership, a dedicated team and customers who stay.",
    cards: [
      { id: "apple",     text: "Apple Business Partner since 2004",                  fallback: "Apple Business Partner", needsConfirm: true,  confirmed: false },
      { id: "microsoft", text: "Microsoft Surface Partner",                           confirmed: true },
      { id: "team",      text: "A dedicated sales, presales and service team",        confirmed: true },
      { id: "retention", text: "Long-term customer relationships and high retention", confirmed: true },
    ],
    stats: [
      { id: "since",   value: 2004, kind: "year"  as const, label: "Apple partner since",       confirmed: false },
      { id: "offices", value: 3,    kind: "count" as const, label: "Offices across Delhi NCR",  confirmed: true  },
      { id: "engs",    value: 15,   kind: "count" as const, suffix: "+", label: "Certified engineers", confirmed: false },
      { id: "areas",   value: 4,    kind: "count" as const, label: "Service areas",             confirmed: true  },
    ],
    milestones: [] as Flagged<{ year: number; title: string; text?: string }>[],
    recognitions: [] as Flagged<{ title: string; issuer: string; year: number }>[],
  },
  story: {
    tag: "Our story",
    h2: "From humble beginnings to a team-driven partner.",
    approved: false,
    body: [
      "Azure Innovations has been an Apple partner since 2004. We began with humble beginnings and grew into a team-driven organisation with offices in Naraina, Noida and Gurgaon.",
      "Today we supply genuine Apple and Microsoft Surface products and look after them from setup to support, so the technology our customers choose keeps working for them.",
    ],
    photo: { src: "/images/corporate.jpg", alt: "A team working together around a laptop" },
  },
  mission: {
    tag: "Our mission",
    approved: false,
    text: "To help organisations get the most from Apple and Microsoft technology, with genuine products, expert setup and support that lasts the life of every device.",
    how: ["Device configuration", "Device management", "On-site support"],
  },
  vision: {
    tag: "Our vision",
    approved: false,
    text: "To be the technology partner organisations in Delhi NCR trust first, known for a promise kept and relationships that last.",
    how: ["Genuine products", "Long-term relationships", "Local teams"],
  },
} as const;
