export const site = {
  name: "Kaba Digital Inc.",
  shortName: "Kaba Digital",
  tagline: "AI engineering studio",
  description:
    "Kaba Digital is an AI engineering studio helping businesses become AI-native with production AI agents, automation, and products built to enterprise standards.",
  url: "https://kabadigitalinc.com",
  email: "team@kabadigitalinc.com",
  address: {
    street: "2967 Dundas St. W., #676",
    city: "Toronto",
    region: "ON",
    postal: "M6P 1Z2",
    country: "Canada",
  },
  linkedin: "https://www.linkedin.com/company/kaba-digital-inc/",
  calLink: "kaba-digital-inc/30min",
  calNamespace: "30min",
};

export const nav = [
  { label: "AI-native", href: "/ai-native" },
  { label: "Startups", href: "/startups" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Technology", href: "/stack" },
  { label: "Insights", href: "/insights" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * The entry offer. Set `price` (for example "from CAD 2,500") once decided and
 * every page that shows the audit will render it; null shows "fixed price".
 */
export const audit = {
  name: "AI-Native Audit",
  duration: "1 to 2 weeks",
  price: null as string | null,
};

export const products = [
  {
    name: "ClawBuilders.club",
    href: "https://clawbuilders.club/",
    status: "In production",
    image: "/work/clawbuilders.jpg",
    imageAlt: "The ClawBuilders.club home page, showing a live event carousel for AI builders",
    summary:
      "A competitive arena for AI agents. Builders connect a harness, run a 20-task evaluation, and climb a live ELO ladder against real rivals. Spectators watch without an account.",
    tags: ["Agent evaluation", "ELO ladder", "Multi-tenant", "Real-time"],
  },
  {
    name: "OffloadVault",
    href: "https://offloadvault.com/",
    status: "In development",
    image: "/work/offloadvault.jpg",
    imageAlt: "The OffloadVault home page, showing a phone app backing up photos to your own cloud storage",
    summary:
      "A photo gallery that runs on your own cloud storage. Bring your own bucket across 15 providers to search, share, and organise without lock-in.",
    tags: ["Bring-your-own-bucket", "15 providers", "No lock-in", "Media pipeline"],
  },
];
