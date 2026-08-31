/**
 * catalogStore.ts
 * Persistence layer — catalog in IndexedDB (large capacity), settings/sessions in localStorage.
 */

import type { Product, AppSettings, CatalogSession } from '../types';
import { isTemplateId } from './templates';
import {
  idbDeleteProduct,
  idbGetAllProducts,
  idbPutProduct,
  idbReplaceAllProducts,
} from './idb';
import { normalizeProduct } from './product';

const KEYS = {
  catalog:  'veritas_catalog',
  sessions: 'veritas_sessions',
  settings: 'veritas_settings',
  migrated: 'veritas_catalog_migrated_v1',
} as const;

export type CatalogSaveResult =
  | { ok: true; catalog: Product[] }
  | { ok: false; error: 'quota' | 'unavailable'; message: string };

function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'QuotaExceededError';
}

function saveFailure(error: unknown): CatalogSaveResult {
  if (isQuotaError(error)) {
    return {
      ok: false,
      error: 'quota',
      message: 'Catalog storage is full. Remove items or use Dropbox links instead of uploaded images.',
    };
  }

  return {
    ok: false,
    error: 'unavailable',
    message: 'Could not save catalog. Check that this browser allows site storage.',
  };
}

function loadLegacyCatalog(): Product[] {
  try {
    const raw = localStorage.getItem(KEYS.catalog);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

async function migrateLegacyCatalogIfNeeded(): Promise<Product[]> {
  if (localStorage.getItem(KEYS.migrated) === '1') return [];

  const legacy = loadLegacyCatalog();
  if (legacy.length === 0) {
    localStorage.setItem(KEYS.migrated, '1');
    return [];
  }

  await idbReplaceAllProducts(legacy);
  localStorage.removeItem(KEYS.catalog);
  localStorage.setItem(KEYS.migrated, '1');
  return legacy;
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export async function loadCatalog(): Promise<Product[]> {
  try {
    const items = await idbGetAllProducts<Product>();
    const source = items.length > 0 ? items : await migrateLegacyCatalogIfNeeded();
    return source.map(normalizeProduct);
  } catch {
    return loadLegacyCatalog().map(normalizeProduct);
  }
}

export async function saveCatalog(catalog: Product[]): Promise<CatalogSaveResult> {
  try {
    await idbReplaceAllProducts(catalog);
    return { ok: true, catalog };
  } catch (error) {
    return saveFailure(error);
  }
}

export async function addToCatalog(product: Product): Promise<CatalogSaveResult> {
  try {
    await idbPutProduct(product);
    const catalog = await idbGetAllProducts<Product>();
    return { ok: true, catalog };
  } catch (error) {
    return saveFailure(error);
  }
}

export async function removeFromCatalog(id: string): Promise<CatalogSaveResult> {
  try {
    await idbDeleteProduct(id);
    const catalog = await idbGetAllProducts<Product>();
    return { ok: true, catalog };
  } catch (error) {
    return saveFailure(error);
  }
}

export async function addManyToCatalog(products: Product[]): Promise<CatalogSaveResult> {
  if (products.length === 0) {
    const catalog = await loadCatalog();
    return { ok: true, catalog };
  }

  try {
    const existing = await idbGetAllProducts<Product>();
    const merged = [...existing, ...products];
    await idbReplaceAllProducts(merged);
    return { ok: true, catalog: merged };
  } catch (error) {
    return saveFailure(error);
  }
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
  templateId: 'noir',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      defaultLogoUrl: parsed.defaultLogoUrl ?? DEFAULT_SETTINGS.defaultLogoUrl,
      defaultTags:    parsed.defaultTags    ?? DEFAULT_SETTINGS.defaultTags,
      templateId:     isTemplateId(parsed.templateId) ? parsed.templateId : DEFAULT_SETTINGS.templateId,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}
