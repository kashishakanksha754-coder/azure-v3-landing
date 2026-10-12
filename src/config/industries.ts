export const INDUSTRIES = [
  {
    id: "media",
    name: "Media and advertising agencies",
    tagline: "High-performance Apple for creative teams",
    detail: "Pro Mac workstations, iPads and iPhones for production studios, newsrooms and creative agencies that depend on uptime.",
    img: "/images/industries.jpg",
    alt: "Creative professionals working on a Mac in an advertising agency",
    contactNeed: "media-agencies",
  },
  {
    id: "corporates",
    name: "Corporates",
    tagline: "Devices and management for modern workplaces",
    detail: "From procurement to MDM enrolment — Apple and Surface devices configured, secured and ready for your team from day one.",
    img: "/images/corporate.jpg",
    alt: "Corporate office with professionals using Apple devices",
    contactNeed: "corporates",
  },
  {
    id: "developers",
    name: "Software developers and startups",
    tagline: "Apple for teams that build things",
    detail: "MacBooks and development setups for engineering teams and startups — configured and deployed so you can ship faster.",
    img: "/images/workspace.jpg",
    alt: "Developers coding on MacBook Pros in a startup office",
    contactNeed: "developers",
  },
  {
    id: "healthcare",
    name: "Healthcare and hospitality",
    tagline: "Reliable devices for clinical and guest teams",
    detail: "Secure, managed Apple devices for hospitals, clinics, hotels and service teams — configured for your workflows.",
    img: "/images/healthcare.jpg",
    alt: "Healthcare professional using an iPad in a clinical setting",
    contactNeed: "hospitals",
  },
  {
    id: "gifting",
    name: "Corporate gifting and rewards",
    tagline: "Premium Apple and Surface for gifting programmes",
    detail: "Bulk Apple and Surface devices for corporate gifting, incentive programmes and employee rewards — genuine products with warranty.",
    img: "/images/desk-devices.jpg",
    alt: "Premium Apple devices gift-wrapped for a corporate gifting programme",
    contactNeed: "gifting",
  },
] as const;

export type Industry = typeof INDUSTRIES[number];
