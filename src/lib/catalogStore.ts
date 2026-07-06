/**
 * catalogStore.ts
 * Abstracted persistence layer — localStorage now, swap to API later with
 * a single import change. All reads/writes go through these functions.
 */

import type { Product, AppSettings, CatalogSession } from '../types';

const KEYS = {
  catalog:  'veritas_catalog',
  sessions: 'veritas_sessions',
  settings: 'veritas_settings',
} as const;

// ─── Catalog ──────────────────────────────────────────────────────────────────

export function loadCatalog(): Product[] {
  try {
    const raw = localStorage.getItem(KEYS.catalog);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCatalog(catalog: Product[]): void {
  localStorage.setItem(KEYS.catalog, JSON.stringify(catalog));
}

export function addToCatalog(product: Product): Product[] {
  const catalog = loadCatalog();
  const updated = [...catalog, product];
  saveCatalog(updated);
  return updated;
}

export function removeFromCatalog(id: string): Product[] {
  const updated = loadCatalog().filter((p) => p.id !== id);
  saveCatalog(updated);
  return updated;
}

// ─── Sessions (print batches) ─────────────────────────────────────────────────

export function loadSessions(): CatalogSession[] {
  try {
    const raw = localStorage.getItem(KEYS.sessions);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: CatalogSession): CatalogSession[] {
  const sessions = loadSessions();
  const updated = [...sessions, session];
  localStorage.setItem(KEYS.sessions, JSON.stringify(updated));
  return updated;
}

export function deleteSession(id: string): CatalogSession[] {
  const updated = loadSessions().filter((s) => s.id !== id);
  localStorage.setItem(KEYS.sessions, JSON.stringify(updated));
  return updated;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  defaultLogoUrl: '',
  defaultTags: ['ORGANIC', 'UNFILTERED', 'NATIVE FERMENTS'],
  templateId: 'art-deco',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      defaultLogoUrl: parsed.defaultLogoUrl ?? DEFAULT_SETTINGS.defaultLogoUrl,
      defaultTags:    parsed.defaultTags    ?? DEFAULT_SETTINGS.defaultTags,
      templateId:     parsed.templateId     ?? DEFAULT_SETTINGS.templateId,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}
