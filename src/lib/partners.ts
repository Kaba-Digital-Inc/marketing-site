import { getCollection, type CollectionEntry } from "astro:content";

export type Partner = CollectionEntry<"partners">;

export async function getPartners(): Promise<Partner[]> {
  const all = await getCollection("partners");
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Look up partners by slug, keeping the order given (used for a project's "supported by" row). */
export async function getPartnersBySlugs(slugs: string[]): Promise<Partner[]> {
  const all = await getPartners();
  return slugs.map((s) => all.find((p) => p.id === s)).filter((p): p is Partner => Boolean(p));
}

/** Where a logo should link: the partner's own page when it has one, otherwise its website. */
export function partnerHref(p: Partner) {
  return p.data.page ? { href: `/partners/${p.id}/`, external: false } : { href: p.data.url, external: true };
}
