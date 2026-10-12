export type Testimonial = {
  id: string;
  quote: string;
  highlight?: string;     // a substring of quote that receives the marker-underline animation
  name?: string;          // omit for placeholder entries; author block falls back to role + descriptor
  role: string;
  organisation: string;   // descriptor line: "Manufacturing company, Gurgaon"
  sector: "Corporate" | "Healthcare" | "Other Industries";
  photo?: string;         // /path/to/headshot.jpg — client must consent separately to photo use
  caseStudySlug?: string;
  approved: boolean;      // client has reviewed and approved the quote
  consent: boolean;       // client has given explicit consent to publish
  placeholder?: boolean;  // true = preview-only; never published on production
};

// Production testimonials — leave empty until real quotes with approved:true + consent:true are collected.
// See CONTENT_TODO.md for the intake checklist.
export const testimonials: Testimonial[] = [];

// Preview-only placeholder entries — never shown on azureinnovations.co.in
// Replace all five before launch. See CONTENT_TODO.md.
export const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "p1",
    quote: "Every laptop arrived configured and ready to use, so our team started work on day one.",
    highlight: "our team started work on day one",
    role: "Head of IT",
    organisation: "Manufacturing company, Gurgaon",
    sector: "Corporate",
    approved: true,
    consent: true,
    placeholder: true,
  },
  {
    id: "p2",
    quote: "We used to chase different vendors for every issue. Now one team looks after our devices from purchase to support.",
    highlight: "one team looks after our devices",
    role: "Operations Director",
    organisation: "Media company, Noida",
    sector: "Corporate",
    approved: true,
    consent: true,
    placeholder: true,
  },
  {
    id: "p3",
    quote: "Our clinical staff get secure, up-to-date devices without the IT team having to touch each one.",
    highlight: "without the IT team having to touch each one",
    role: "IT Manager",
    organisation: "Healthcare provider, Delhi",
    sector: "Healthcare",
    approved: true,
    consent: true,
    placeholder: true,
  },
  {
    id: "p4",
    quote: "When something goes wrong, we call one number and it gets sorted.",
    highlight: "we call one number and it gets sorted",
    role: "Operations Lead",
    organisation: "Retail business, Delhi NCR",
    sector: "Other Industries",
    approved: true,
    consent: true,
    placeholder: true,
  },
  {
    id: "p5",
    quote: "Genuine products, honest advice and a team that actually picks up the phone.",
    highlight: "a team that actually picks up the phone",
    role: "Founder",
    organisation: "Design studio, Delhi",
    sector: "Other Industries",
    approved: true,
    consent: true,
    placeholder: true,
  },
];
