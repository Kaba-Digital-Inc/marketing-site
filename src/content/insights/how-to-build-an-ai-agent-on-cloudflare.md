---
title: "How to build an AI agent on Cloudflare: the architecture"
seoTitle: "How to build an AI agent on Cloudflare"
description: "The four layers of an AI agent on the Cloudflare developer platform, how state and identity work, how long tasks run, what it costs, and when not to use it."
date: 2026-10-07
category: "Engineering"
---

Most AI agent demos break at the same places: they forget what happened, they cannot wait, they cost more than expected, and nobody can see what they did. Cloudflare publishes a platform for building agents that addresses those four problems in one place. This guide explains how the pieces fit, based on the Cloudflare [agents platform page](https://agents.cloudflare.com/) and its [developer documentation](https://developers.cloudflare.com/agents/).

## The four layers

An agent is easier to design when you separate what it receives, how it decides, how it keeps going, and what it can do.

1. **Inputs.** How work reaches the agent: Email Workers, WebSockets, calls, plain HTTP, and scheduled triggers.
2. **Reasoning.** Workers AI runs hosted models on the platform, and AI Gateway sits in front of third-party model providers, adding caching, rate limiting, and analytics.
3. **Execution.** Durable Objects hold each agent's state and identity, and Workflows run longer jobs that must survive failures and waiting.
4. **Tools.** What the agent can actually do: remote MCP servers, Browser Rendering for web tasks, Vectorize for retrieval, and D1 and R2 for data and files.

The Agents SDK is the layer that ties these together. It is a JavaScript and TypeScript SDK for building stateful agents with persistent memory, real-time connections, and scheduled tasks.

## State and identity: the part people get wrong

An agent that forgets is a chatbot. On Cloudflare, an agent's memory lives in a Durable Object, and a Durable Object is reached by an identifier. If you derive that identifier from a stable name, such as a customer or conversation ID, every request for that name reaches the same agent with the same state. If you create a fresh identifier on each request, you get a new, empty agent every time, and the failure is silent: nothing errors, the agent just never remembers.

The practical rule: decide what an agent instance represents (one customer, one case, one team), name it deterministically, and test that a second request really sees the first one's state.

## Waiting is normal, so design for it

Agents spend most of their time waiting: on a model, on a tool, or on a person. Two features matter here.

- **Scheduling.** An agent can schedule its own follow-up, such as "check again in six hours," instead of relying on an external cron job pointed at an endpoint.
- **Workflows.** For multi-step work that can take minutes or days, a workflow keeps its place across retries and delays.

Cloudflare also documents a human-in-the-loop pattern, shown in an [example from Knock](https://blog.cloudflare.com/building-agents-at-knock-agents-sdk/): an agent handling a virtual card request pauses for human approval before acting. For anything involving money, customer data, or irreversible actions, that pause should be a design requirement, not an afterthought.

## Cost: what is cheap and what is not

Cloudflare describes billing for agent workloads as based on CPU time rather than wall-clock time. For an agent that is mostly waiting, that matters, because the waiting is not what you pay for.

Two cautions. Model inference is a separate cost and often the biggest line, so track cost per task, not just platform cost. And billing models change, so check the current [pricing](https://www.cloudflare.com/plans/) before you commit to a budget.

## A short checklist before production

- **An evaluation set** of real cases, run on every change to the model or prompt.
- **A cost budget** per conversation or task, with an alert when it is exceeded.
- **Least-privilege tools,** so an agent can only do what the job needs.
- **Approval steps** for sensitive actions, with the agent's reasoning shown to the approver.
- **Logging** of every decision, so you can replay and audit what happened.

## When not to use Cloudflare

It is not the right answer every time.

- If your agent code is mainly **Python**, note that the Agents SDK is written for JavaScript and TypeScript.
- If your data must **stay inside your own cloud account** for policy reasons, a different platform may fit better.
- If you already run a **working system elsewhere,** a migration needs a clear reason.

We stay platform-neutral for exactly this reason. See [how we choose our technology](/stack/), or read about [building agents on Cloudflare with us](/cloudflare/).
