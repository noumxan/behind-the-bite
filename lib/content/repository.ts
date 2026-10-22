import { seedCms } from "./seed";
import type { CmsState, PublishStatus } from "./types";
import { STORAGE_KEYS, getAdapter } from "../storage/adapter";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function loadCms(): CmsState {
  const stored = getAdapter().get<CmsState>(STORAGE_KEYS.cms);
  if (!stored) return clone(seedCms);
  return {
    careers: stored.careers?.length ? stored.careers : clone(seedCms.careers),
    missions: stored.missions?.length ? stored.missions : clone(seedCms.missions),
    resources: stored.resources?.length ? stored.resources : clone(seedCms.resources),
    opportunities: stored.opportunities?.length
      ? stored.opportunities
      : clone(seedCms.opportunities),
    homepage: stored.homepage ?? clone(seedCms.homepage),
    products: mergeById(stored.products, seedCms.products),
    supportResources: mergeById(stored.supportResources, seedCms.supportResources),
  };
}

function mergeById<T extends { id: string }>(stored: T[] | undefined, seed: T[]) {
  const list = stored?.length ? [...stored] : [];
  for (const item of seed) {
    if (!list.some((row) => row.id === item.id)) list.push(clone(item));
  }
  return list.length ? list : clone(seed);
}

export function saveCms(state: CmsState) {
  getAdapter().set(STORAGE_KEYS.cms, state);
}

export function restoreSeededCms() {
  const next = clone(seedCms);
  saveCms(next);
  return next;
}

export function publishedOnly<T extends { status: PublishStatus }>(items: T[]) {
  return items.filter((item) => item.status === "published");
}

export function upsertById<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex((entry) => entry.id === item.id);
  if (index === -1) return [...list, item];
  const next = [...list];
  next[index] = item;
  return next;
}

export function needsReview(lastReviewed: string, days = 90) {
  const then = new Date(lastReviewed).getTime();
  if (Number.isNaN(then)) return true;
  return Date.now() - then > days * 24 * 60 * 60 * 1000;
}
