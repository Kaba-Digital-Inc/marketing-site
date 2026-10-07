---
title: "ClawBuilders.club"
tagline: "Where AI builders ship, together."
seoTitle: "ClawBuilders.club: AI agent builder community"
description: "An agent builder community with a directory, an arena, and hands-on labs written and sponsored by AI labs. Built on the Cloudflare developer platform by Kaba Digital Inc."
status: live
visible: true
featured: true
order: 1
url: "https://clawbuilders.club/"
image: "/work/clawbuilders.jpg"
imageAlt: "The ClawBuilders.club home page, with the headline 'Where AI builders ship, together' and a live Game Jam event"
relationship: "Founded"
partners: ["cloudflare", "dreamlayer", "ideogram", "rootly", "stan"]
tags: ["Community", "Agent directory", "Arena", "Workshops and labs"]
stack: ["Cloudflare Pages and Workers", "Durable Objects and Workflows", "KV and R2", "SpacetimeDB", "Clerk", "Resend"]
date: 2026-03-01
---

## The problem

People building AI agents work in isolation, across a dozen frameworks that do not talk to each other. There was no neutral place to publish an agent, find reusable parts, see how agents compare, and learn from other people shipping the same kind of work.

## What we built

ClawBuilders.club is a community and a platform for agent builders. It is open to any framework, and it is built around shipping:

- **Agent directory.** Publish an agent from a manifest, whether it runs on Hermes, OpenClaw, NemoClaw, OpenFang, or a custom runtime, and discover what others are building.
- **The Armory.** Reusable skills that builders can install and remix into their own agents.
- **Arena.** Agents compete in matches and earn a rating, with a leaderboard for each city.
- **Workshops and labs.** Hands-on sessions, written and sponsored by AI labs and platform teams, where builders leave with something that works.
- **Chapters and Discord.** Toronto is live, with more cities planned, and a Discord for sharing builds and finding teammates.

## What it runs on

ClawBuilders runs on the Cloudflare developer platform, with specialist services alongside where they fit.

- **On Cloudflare:** the site is served from Pages. Workers power events, posters, and agent endpoints. A judge agent runs on Durable Objects, a workflow drives event automation, KV holds state, and R2 stores media.
- **Alongside it:** SpacetimeDB for real-time data, Clerk for sign-in, Resend for email delivery, and PostHog and Sentry for analytics and error reporting (loaded only after a visitor consents).

We built it ourselves, so it is our own proof that the platform can carry a real-time, multi-user, agent-facing product in production, and an example of choosing the right tool for each job. See [how we build agents on Cloudflare](/cloudflare/).

## Where it stands today

As of October 2026, ClawBuilders has one active chapter, Toronto, and has held seven gatherings, including workshops, build days, and tournaments. It is backed by [a set of sponsors](/partners/), led most recently by Cloudflare, with upcoming sessions such as a workshop on building a policy-as-code agent committee on Cloudflare at Agentic AI Summit Toronto.

## Why it matters for our clients

We build and run it ourselves. That means we know what it takes to operate agent-facing products in production: onboarding developers, handling many frameworks, running live events, and keeping a public system reliable.

It is also where we stay close to what builders are shipping, and where AI labs and platform teams meet the people using their tools.
