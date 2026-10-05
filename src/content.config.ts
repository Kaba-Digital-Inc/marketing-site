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

export const collections = { insights };
