export interface ServiceItem {
  id: string;
  title: string;
  line1: string;
  line2: string;
  pill: string;
  pillHref: string;
  img: string;
  alt: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "device-deployment",
    title: "Device deployment",
    line1: "Every device arrives enrolled, configured and ready to use — on your systems, on day one.",
    line2: "We handle the entire setup: Apple Business Manager, MDM enrolment, app installation and delivery.",
    pill: "Learn more",
    pillHref: "#contact?need=device-deployment",
    img: "/images/deploy.jpg",
    alt: "MacBooks lined up and being configured for enterprise deployment",
  },
  {
    id: "device-management",
    title: "Device management",
    line1: "Ongoing MDM management keeps every device secure, compliant and up to date — without your team lifting a finger.",
    line2: "Remote lock, wipe, policy enforcement and app management across your entire fleet.",
    pill: "Learn more",
    pillHref: "#contact?need=device-management",
    img: "/images/device-mgmt.jpg",
    alt: "IT professional managing a fleet of devices from a dashboard",
  },
  {
    id: "on-site-support",
    title: "On-site support",
    line1: "Our engineers come to you — for installs, repairs, upgrades and hands-on support.",
    line2: "Scheduled visits and rapid response across Delhi, Noida and Gurgaon.",
    pill: "Learn more",
    pillHref: "#contact?need=on-site-support",
    img: "/images/technician.jpg",
    alt: "Azure Innovations engineer providing on-site support at a client office",
  },
  {
    id: "amc-it-support",
    title: "AMC and IT support",
    line1: "Annual maintenance contracts that cover hardware, software and IT infrastructure — one agreement, one team.",
    line2: "Predictable costs, priority response and a dedicated point of contact for everything technology.",
    pill: "Learn more",
    pillHref: "#contact?need=amc-it-support",
    img: "/images/it-professional.jpg",
    alt: "IT support engineer working at a network rack in a server room",
  },
];
