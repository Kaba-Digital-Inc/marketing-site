import { useState } from "react";

type Group = {
  id: string;
  label: string;
  blurb: string;
  items: string[];
};

const groups: Group[] = [
  {
    id: "agents",
    label: "Agents & inference",
    blurb:
      "The part of Cloudflare that most people do not know exists: model inference, agent identity, durable state, and routing, all on the same platform as your app.",
    items: [
      "Workers AI",
      "Agents SDK",
      "AI Gateway",
      "Durable Objects",
      "Vectorize",
      "Model routing & fallback",
      "MCP tool servers",
      "Prompt caching",
    ],
  },
  {
    id: "data",
    label: "Data & storage",
    blurb:
      "State that lives next to the compute: relational, object, key-value, and vector, plus the connection layer for the database you already run.",
    items: [
      "D1 (SQLite)",
      "R2 object storage",
      "KV",
      "Hyperdrive",
      "Queues",
      "Analytics Engine",
      "Vectorize indexes",
      "Cron Triggers",
    ],
  },
  {
    id: "compute",
    label: "Compute & orchestration",
    blurb:
      "Where the work actually runs: long tasks, sandboxes, headless browsers, and services that call each other without leaving the network.",
    items: [
      "Workers",
      "Workflows",
      "Containers",
      "Browser Rendering",
      "Service bindings",
      "Static assets & Pages",
      "Cron & scheduled jobs",
      "Durable execution",
    ],
  },
  {
    id: "security",
    label: "Security & access",
    blurb:
      "The layer that decides who and what gets in, for your users, your team, and your own infrastructure.",
    items: [
      "Zero Trust",
      "Access",
      "Gateway (SWG)",
      "WARP client",
      "Cloudflare Tunnel",
      "WAF",
      "Bot management",
      "Turnstile",
    ],
  },
  {
    id: "delivery",
    label: "Delivery & networks",
    blurb:
      "How it reaches people, and how you find out when something breaks: performance, routing, and observability.",
    items: [
      "DNS & routing",
      "Load balancing",
      "Caching",
      "Spectrum (TCP/UDP)",
      "Logpush",
      "Web Analytics",
      "Audit logs",
      "Terraform provider",
    ],
  },
];

export default function CatalogTabs() {
  const [active, setActive] = useState(groups[0].id);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {groups.map((g) => {
          const isActive = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActive(g.id)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                isActive
                  ? "border-ultra bg-ultra text-chalk"
                  : "border-line text-ink-soft hover:border-chalk/25 hover:text-ink"
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <h3 className="font-display text-[26px] font-semibold tracking-tight text-ink">{current.label}</h3>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft text-pretty">{current.blurb}</p>
        </div>

        <ul className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {current.items.map((item) => (
            <li
              key={item}
              className="border-b border-line py-3.5 text-[15px] text-ink-soft"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
