export type Service = {
  id: string;
  title: string;
  summary: string;
  capabilities: string[];
  outcome: string;
  /** Deeper pages for this service, shown as links under the capabilities. */
  links?: { label: string; href: string }[];
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
    links: [
      { label: "AI agent development", href: "/services/ai-agent-development/" },
      { label: "AI automation services", href: "/services/ai-automation/" },
    ],
  },
  {
    id: "voice",
    title: "Voice & Realtime Agents",
    summary:
      "Conversational agents that talk and listen in real time, for customer service, intake, and operations, with the same approvals and audit trails as everything else we build.",
    capabilities: ["Realtime speech", "Telephony & web voice", "Handoff to humans", "Call analytics"],
    outcome: "Calls and conversations handled around the clock, with a person one step away.",
  },
  {
    id: "knowledge",
    title: "Knowledge & RAG Systems",
    summary:
      "Retrieval that answers from your documents, tickets, and databases with citations, not confident guesses.",
    capabilities: ["Chunking & embedding", "Vector search", "Hybrid search", "Citation & grounding"],
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
    title: "Cloud Platform & Migration",
    summary:
      "Move workloads onto a modern edge and serverless platform without re-architecting from scratch. We work in Cloudflare, Vercel, AWS, or your own cloud account.",
    capabilities: ["Architecture review", "Migration & cutover", "Performance tuning", "Cost engineering"],
    outcome: "Lower latency, lower egress cost, fewer moving parts.",
  },
  {
    id: "managed",
    title: "Managed AI Operations",
    summary:
      "We run your AI systems for you: watching quality and cost, tuning models and prompts, handling upgrades and incidents, with a named engineer on your account.",
    capabilities: ["Quality monitoring", "Cost controls", "Model upgrades", "Incident response"],
    outcome: "One partner accountable for your AI systems in production.",
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
    capabilities: ["Team upskilling", "Playbooks & runbooks", "Architecture handover", "Team training"],
    outcome: "An internal team that can run and extend what we built.",
    links: [{ label: "AI workshops and hands-on labs", href: "/services/ai-workshops/" }],
  },
];
