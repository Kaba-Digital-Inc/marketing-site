import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    date: z.coerce.date(),
    category: z.enum(["Small business", "Enterprise", "Startups", "Engineering"]),
    // Short label shown on the card and as the breadcrumb.
    kicker: z.string().optional(),
    // Shorter <title> for search results when the headline is long.
    seoTitle: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string().max(170),
    // Shorter <title> for search results when "Title: tagline" is too long.
    seoTitle: z.string().optional(),
    status: z.enum(["live", "in-development"]),
    // Set to false to hide a project everywhere (cards, nav, footer, sitemap) without deleting it.
    visible: z.boolean().default(true),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    url: z.string().url().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    relationship: z.enum(["Founded", "Equity partner", "Client"]),
    // Slugs of entries in the partners collection that support this project (shown as logos).
    partners: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    date: z.coerce.date(),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/partners" }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(["Platform", "Technology", "Sponsor"]),
    tagline: z.string(),
    description: z.string().max(170),
    // Optional: a partner without written permission to show its logo is shown as a text wordmark.
    logo: z.string().optional(),
    // Icon-only marks get the company name set beside them.
    logoIsIcon: z.boolean().default(false),
    // Some logo files have more padding than others; scale to even them out visually.
    logoScale: z.number().default(1),
    url: z.string().url(),
    // Only partners with something substantive to say get their own page.
    page: z.boolean().default(false),
    order: z.number().default(100),
    // One honest line about where the relationship stands. Never claim more than is true.
    status: z.string().optional(),
    // Add credentials only when they are real and verifiable.
    credentials: z.array(z.object({ name: z.string(), detail: z.string() })).default([]),
    events: z
      .array(z.object({ title: z.string(), note: z.string().optional(), date: z.string().optional(), place: z.string().optional() }))
      .default([]),
    date: z.coerce.date(),
  }),
});

export const collections = { insights, projects, partners };
