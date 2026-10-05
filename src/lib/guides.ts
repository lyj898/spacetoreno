import { getCollection, type CollectionEntry } from 'astro:content';
import { HUB_ORDER, guideUrl, type HubKey } from './site';

export type Guide = CollectionEntry<'guides'>;

export function urlFor(guide: Guide): string {
  return guideUrl(guide.data.hub, guide.id);
}

/** Every guide, grouped in hub order and then by each guide's `order` within its hub. */
export async function allGuides(): Promise<Guide[]> {
  const guides = await getCollection('guides');
  return guides.sort(
    (a, b) => HUB_ORDER.indexOf(a.data.hub) - HUB_ORDER.indexOf(b.data.hub) || a.data.order - b.data.order
  );
}

/** A hub's own guides first (in order), then guides from other hubs that list it in `alsoIn`. */
export async function guidesForHub(hub: HubKey): Promise<Guide[]> {
  const guides = await allGuides();
  const own = guides.filter((g) => g.data.hub === hub);
  const borrowed = guides.filter((g) => g.data.hub !== hub && g.data.alsoIn.includes(hub));
  return [...own, ...borrowed];
}

/** Up to `limit` other guides a reader of `guide` is likely to want next: same hub first. */
export async function relatedGuides(guide: Guide, limit = 3): Promise<Guide[]> {
  const guides = await allGuides();
  const others = guides.filter((g) => g.id !== guide.id);
  const sameHub = others.filter((g) => g.data.hub === guide.data.hub || g.data.alsoIn.includes(guide.data.hub));
  const rest = others.filter((g) => !sameHub.includes(g));
  return [...sameHub, ...rest].slice(0, limit);
}
