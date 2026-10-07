import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/**
 * Every project that should appear on the site, in display order.
 * This is the single place that honours `visible: false`, so hiding a project
 * is a one-line frontmatter change and nothing needs to be commented out.
 */
export async function getVisibleProjects(): Promise<Project[]> {
  const all = await getCollection("projects", ({ data }) => data.visible);
  return all.sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

export const relationshipNote: Record<Project["data"]["relationship"], string> = {
  Founded: "Founded and run by Kaba Digital",
  "Equity partner": "Startup partnership: engineering for equity and a fee",
  Client: "Client engagement",
};
