import type { Product } from '../types';

/** Match catalog items against a free-text search query. */
export function matchCatalogSearch(product: Product, query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const haystack = [
    product.producer,
    product.name,
    product.vintage,
    product.region,
    product.reviewer,
    product.description,
    ...product.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const terms = trimmed.split(/\s+/).filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}

export function filterCatalog(catalog: Product[], query: string): Product[] {
  if (!query.trim()) return catalog;
  return catalog.filter((product) => matchCatalogSearch(product, query));
}
