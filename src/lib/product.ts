import type { Product } from '../types';

/** Fill fields added after a catalog item was saved so old records still render. */
export function normalizeProduct(raw: Product): Product {
  return {
    ...raw,
    producer: raw.producer ?? '',
    name: raw.name ?? '',
    vintage: raw.vintage ?? '',
    price: raw.price ?? '',
    region: raw.region ?? '',
    hook: raw.hook ?? '',
    score: raw.score ?? null,
    reviewer: raw.reviewer ?? '',
    description: raw.description ?? '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    bottleImageUrl: raw.bottleImageUrl ?? '',
    logoUrl: raw.logoUrl ?? '',
    showScore: raw.showScore ?? false,
    showBottle: raw.showBottle ?? false,
  };
}
