// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  producer: string;       // Brand / Producer (≤40 chars)
  name: string;           // Item / Wine name (≤60 chars)
  vintage: string;        // Year / Vintage (≤4 chars)
  price: string;          // Optional shelf price (≤16 chars) — hidden when empty
  region: string;         // Region / Origin (≤50 chars)
  hook: string;           // Arm’s-length one-liner (≤90 chars)
  score: number | null;   // Score 0–100 (3 chars)
  reviewer: string;       // Reviewer / Source (≤30 chars)
  description: string;    // Tasting notes / Summary (≤300 chars)
  tags: string[];         // Attributes / Tags (80 chars total)
  bottleImageUrl: string; // Data URI, blob URL, or Dropbox URL
  logoUrl: string;        // Winery / Brand logo
  showScore: boolean;     // Per-item: show score bubble
  showBottle: boolean;    // Per-item: show bottle image
}

export const HOOK_LIMIT = 90;
export const PRICE_LIMIT = 16;

// ─── Templates ────────────────────────────────────────────────────────────────

export type TemplateId = 'noir' | 'ivory' | 'cellar' | 'copper';

export type FitMode = 'box' | 'lines' | 'single';

// ─── Template Config ──────────────────────────────────────────────────────────

export interface TemplateConfig {
  id: TemplateId;
  label: string;
  description: string;
  thumbnailUrl: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  textOnDark: boolean;
  tagSeparator?: string;
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  defaultLogoUrl: string;
  defaultTags: string[];
  templateId: TemplateId;
}

// ─── Catalog / Sessions ───────────────────────────────────────────────────────

export interface CatalogSession {
  id: string;
  name: string;
  items: Product[];
}
