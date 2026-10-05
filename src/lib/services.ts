export type Service = {
  id: string;
  title: string;
  summary: string;
  capabilities: string[];
  outcome: string;
};

export const services: Service[] = [
  {
    id: "strategy",
    title: "AI Strategy & Readiness",
    summary:
      "A structured read on where AI actually pays off in your business, and what it takes to get there without burning a year on experiments.",
    capabilities: ["Opportunity mapping", "Feasibility & risk", "Build vs. buy", "Governance guardrails"],
    outcome: "A prioritized, costed roadmap you can act on in weeks.",
  },
  {
    id: "agents",
    title: "Agent & Workflow Engineering",
    summary:
      "Autonomous and semi-autonomous agents that do real work inside your operations, with approvals, retries, and audit trails.",
    capabilities: ["Tool use & function calling", "Multi-step orchestration", "Human-in-the-loop", "MCP & integrations"],
    outcome: "Workflows that run unattended and degrade gracefully.",
  },
  {
    id: "knowledge",
    title: "Knowledge & RAG Systems",
    summary:
      "Retrieval that answers from your documents, tickets, and databases with citations, not confident guesses.",
    capabilities: ["Chunking & embedding", "Vectorize + D1", "Hybrid search", "Citation & grounding"],
    outcome: "Answers your team can verify and trust.",
  },
  {
    id: "product",
    title: "AI Product Engineering",
    summary:
      "End-to-end AI features and products: interface, inference, data, billing, and deployment, shipped as one coherent system.",
    capabilities: ["Full-stack delivery", "On-platform inference", "Usage metering", "Design & UX"],
    outcome: "A product in users' hands, not a slide deck.",
  },
  {
    id: "platform",
    title: "Cloudflare Platform & Migration",
    summary:
      "Move workloads onto Cloudflare without re-architecting from scratch: Workers, Pages, R2, D1, and the data plane.",
    capabilities: ["Architecture review", "Migration & cutover", "Performance tuning", "Cost engineering"],
    outcome: "Lower latency, lower egress cost, fewer moving parts.",
  },
  {
    id: "managed",
    title: "Managed Cloudflare Services",
    summary:
      "We run Cloudflare for you: multi-tenant accounts, consolidated billing, Zero Trust rollout, monitoring, and incident response.",
    capabilities: ["Multi-tenant admin", "Consolidated billing", "Zero Trust rollout", "Monitoring & alerting"],
    outcome: "One partner accountable for your platform and security.",
  },
  {
    id: "evals",
    title: "Evals, Observability & AIOps",
    summary:
      "The part most pilots skip: measuring quality, tracking cost, catching regressions, and keeping models honest in production.",
    capabilities: ["Eval harnesses", "Tracing & logging", "Cost controls", "Regression gates"],
    outcome: "Confidence to change prompts and models safely.",
  },
  {
    id: "enablement",
    title: "Enablement & Training",
    summary:
      "Bring your engineers and operators up to speed so the capability stays inside the company after we leave.",
    capabilities: ["Team upskilling", "Playbooks & runbooks", "Architecture handover", "Cloudflare-aligned training"],
    outcome: "An internal team that can run and extend what we built.",
  },
];
