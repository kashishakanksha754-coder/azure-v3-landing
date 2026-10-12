export type Solution = {
  slug: string;
  title: string;
  line: string;
  img: string;
  alt: string;
  hiddenInProd?: boolean;
  approved: boolean;
};

export const SOLUTIONS_LIST: Solution[] = [
  {
    slug: "ai",
    title: "AI",
    line: "Apple devices and workflows ready for the AI tools your team uses.",
    img: "/images/workspace.jpg",
    alt: "Professional using AI tools on a Mac at a modern desk",
    approved: false,
  },
  {
    slug: "hospitals",
    title: "Hospitals",
    line: "Reliable Apple devices and support for healthcare and hospitality teams.",
    img: "/images/healthcare.jpg",
    alt: "Healthcare professional using an iPad in a clinical setting",
    approved: false,
  },
  {
    slug: "switching-from-windows-to-mac",
    title: "Switching from Windows to Mac",
    line: "A guided move from Windows to Mac, from planning to setup.",
    img: "/images/choose.jpg",
    alt: "Mac setup on a clean desk next to a Windows laptop",
    approved: false,
  },
  {
    slug: "device-deployment",
    title: "Device deployment",
    line: "Devices configured, enrolled and delivered ready to use.",
    img: "/images/deploy.jpg",
    alt: "Row of MacBooks being configured for enterprise deployment",
    approved: false,
  },
  {
    slug: "video-streaming-solutions",
    title: "Video streaming solutions",
    line: "Streaming and AV setups for studios, offices and events.",
    img: "/images/services-streaming.jpg",
    alt: "Professionals in a modern studio with streaming equipment",
    approved: false,
  },
  {
    slug: "app-and-web-development",
    title: "App and web development",
    line: "Mobile and web applications built for your business.",
    img: "/images/services-software.jpg",
    alt: "Developer writing code on a MacBook Pro",
    approved: false,
  },
  {
    slug: "trainings",
    title: "Trainings",
    line: "Practical training for teams adopting Apple technology.",
    img: "/images/corporate.jpg",
    alt: "Team in a training session using Apple devices",
    approved: false,
  },
  {
    slug: "school-and-college-labs",
    title: "School and college labs",
    line: "Apple device programmes for educational institutions.",
    img: "/images/education.jpg",
    alt: "Students using iPads in a school computer lab",
    hiddenInProd: true,
    approved: false,
  },
];
