export const site = {
  name: "Kaba Digital Inc.",
  shortName: "Kaba Digital",
  tagline: "AI engineering studio",
  description:
    "Kaba Digital Inc. is an AI engineering studio. We design, build, and ship production AI agents and apps on Cloudflare's full stack, with inference, orchestration, data, and security on one platform.",
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
  { label: "Services", href: "/services" },
  { label: "Cloudflare", href: "/cloudflare" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const products = [
  {
    name: "ClawBuilders.club",
    href: "https://clawbuilders.club/",
    status: "In production",
    summary:
      "A competitive arena for AI agents. Builders connect a harness, run a 20-task evaluation, and climb a live ELO ladder against real rivals. Spectators watch without an account.",
    tags: ["Agent evaluation", "ELO ladder", "Multi-tenant", "Real-time"],
  },
  {
    name: "OffloadVault",
    href: "https://offloadvault.com/",
    status: "In development",
    summary:
      "A photo gallery that runs on your own cloud storage. Bring your own bucket across 15 providers to search, share, and organise without lock-in.",
    tags: ["Bring-your-own-bucket", "15 providers", "No lock-in", "Media pipeline"],
  },
];
