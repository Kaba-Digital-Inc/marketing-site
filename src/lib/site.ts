export const site = {
  name: "Kaba Digital Inc.",
  shortName: "Kaba Digital Inc.",
  tagline: "AI engineering studio",
  description:
    "We build and run production AI agents and automation for small businesses, startups, and enterprises, with equity partnerships for selected startups.",
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
  { label: "Investors", href: "/investors" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Technology", href: "/stack" },
  { label: "Agents on Cloudflare", href: "/cloudflare" },
  { label: "Insights", href: "/insights" },
  { label: "Partners", href: "/partners" },
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

