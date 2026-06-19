import {
  AppSettings,
  DesignLayout,
  FlowDesignLayout,
  FlowZone,
  LayoutZoneOverrides,
  TypographyZoneOverrides,
  ZoneKey,
  ZoneTypography,
} from '../types';

/**
 * Zone coordinates are measured directly from each background artwork
 * (3:4 templates) and expressed as % of the 384×510 talker so text lands
 * inside the printed nameplates, ruled lines, and frames.
 */

const baseTypography: Partial<Record<ZoneKey, ZoneTypography>> = {
  region: {
    fitMode: 'single',
    maxFontSize: 9,
    minFontSize: 5,
    fontFamily: 'sans',
    fontWeight: 700,
    uppercase: true,
    letterSpacing: '0.14em',
    textAlign: 'center',
    colorRole: 'muted',
    alignItems: 'center',
    justifyContent: 'center',
    paddingX: 2,
    paddingY: 0,
  },
  producer: {
    fitMode: 'single',
    maxFontSize: 19,
    minFontSize: 7,
    fontFamily: 'serif',
    fontWeight: 700,
    uppercase: true,
    textAlign: 'center',
    colorRole: 'accent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingX: 2,
    paddingY: 0,
  },
  wineName: {
    fitMode: 'single',
    maxFontSize: 13,
    minFontSize: 6,
    fontFamily: 'serif',
    fontWeight: 400,
    fontStyle: 'italic',
    textAlign: 'center',
    colorRole: 'text',
    alignItems: 'center',
    justifyContent: 'center',
    paddingX: 2,
    paddingY: 0,
  },
  score: {
    fitMode: 'box',
    maxFontSize: 34,
    minFontSize: 12,
    fontFamily: 'serif',
    fontWeight: 900,
    textAlign: 'center',
    colorRole: 'accent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingX: 0,
    paddingY: 0,
  },
  description: {
    fitMode: 'lines',
    lineCount: 8,
    maxFontSize: 12,
    minFontSize: 6,
    fontFamily: 'serif',
    fontWeight: 400,
    fontStyle: 'italic',
    textAlign: 'left',
    colorRole: 'text',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingX: 4,
    paddingY: 2,
    lineOffsetTop: 0,
  },
  tags: {
    fitMode: 'single',
    maxFontSize: 8,
    minFontSize: 5,
    fontFamily: 'sans',
    fontWeight: 800,
    uppercase: true,
    letterSpacing: '0.08em',
    textAlign: 'center',
    colorRole: 'accent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingX: 2,
    paddingY: 0,
  },
};

function tdef(zoneKey: ZoneKey, overrides: Partial<ZoneTypography>): ZoneTypography {
  return { ...baseTypography[zoneKey]!, ...overrides };
}

function layout(
  zones: Record<ZoneKey, FlowZone>,
  overrides: Partial<FlowDesignLayout> = {}
): FlowDesignLayout {
  const { typography: typoOverride, ...rest } = overrides;
  return {
    preset: 'custom',
    textOnDark: false,
    descriptionPanelOpacity: 0,
    tagSeparator: ' · ',
    textShadowBlur: 0,
    ...rest,
    zones,
    typography: { ...baseTypography, ...typoOverride },
  };
}

/* ───────────────── NOIR LUXURY ─────────────────
   Art-Deco black plate (title) · left arch (bottle) · right ruled panel (notes) */
export const NOIR_LUXURY_LAYOUT = layout(
  {
    producer: { top: 11.4, left: 26, width: 48, height: 4 },
    wineName: { top: 15.4, left: 27, width: 46, height: 3.2 },
    region: { top: 30.5, left: 56, width: 33, height: 3.4 },
    score: { top: 34, left: 56, width: 33, height: 10 },
    bottle: { top: 32, left: 11, width: 35, height: 51 },
    description: { top: 49, left: 56.5, width: 32, height: 28 },
    tags: { top: 89.4, left: 10, width: 80, height: 3.4 },
    logo: { top: 91.2, left: 44, width: 13, height: 5 },
  },
  {
    preset: 'art-deco',
    textOnDark: true,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowBlur: 6,
    typography: {
      producer: tdef('producer', { maxFontSize: 17, colorRole: 'accent' }),
      wineName: tdef('wineName', { maxFontSize: 12, colorRole: 'text' }),
      region: tdef('region', { colorRole: 'accent', textAlign: 'center' }),
      score: tdef('score', { maxFontSize: 30 }),
      description: tdef('description', { lineCount: 8, maxFontSize: 11, paddingX: 4 }),
      tags: tdef('tags', { colorRole: 'accent' }),
    },
  }
);

/* ───────────────── CLEAN MINIMAL ─────────────────
   Full header box · inset bottle box · open notes block · footer strip */
export const CLEAN_MINIMAL_LAYOUT = layout(
  {
    producer: { top: 8, left: 7, width: 86, height: 8 },
    wineName: { top: 17, left: 7, width: 86, height: 6 },
    region: { top: 24.5, left: 7, width: 86, height: 4 },
    bottle: { top: 40, left: 8, width: 27, height: 45 },
    description: { top: 39.5, left: 40, width: 54, height: 46 },
    score: { top: 89, left: 6, width: 16, height: 6 },
    tags: { top: 89, left: 24, width: 52, height: 6 },
    logo: { top: 89, left: 80, width: 14, height: 6 },
  },
  {
    typography: {
      producer: tdef('producer', {
        maxFontSize: 19,
        textAlign: 'left',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        colorRole: 'text',
      }),
      wineName: tdef('wineName', {
        maxFontSize: 14,
        textAlign: 'left',
        justifyContent: 'flex-start',
      }),
      region: tdef('region', { textAlign: 'left', justifyContent: 'flex-start', colorRole: 'muted' }),
      description: tdef('description', {
        fitMode: 'box',
        fontStyle: 'normal',
        maxFontSize: 12,
        paddingX: 6,
        paddingY: 4,
        lineHeight: 1.5,
      }),
      score: tdef('score', { maxFontSize: 24, colorRole: 'text', textAlign: 'left', justifyContent: 'flex-start' }),
      tags: tdef('tags', { colorRole: 'text', maxFontSize: 7, textAlign: 'left', justifyContent: 'flex-start' }),
    },
  }
);

/* ───────────────── AUTUMN HARVEST ─────────────────
   Two-line title banner · open center-left (bottle) · right notes panel */
export const AUTUMN_HARVEST_LAYOUT = layout(
  {
    producer: { top: 7, left: 15, width: 70, height: 5.5 },
    wineName: { top: 12.5, left: 17, width: 66, height: 4.5 },
    region: { top: 22.5, left: 9, width: 44, height: 4 },
    score: { top: 27.5, left: 9, width: 18, height: 9 },
    bottle: { top: 38, left: 9, width: 43, height: 44 },
    description: { top: 20, left: 60, width: 28, height: 62 },
    tags: { top: 90.5, left: 8, width: 84, height: 4.5 },
    logo: { top: 90, left: 82, width: 12, height: 5 },
  },
  {
    typography: {
      producer: tdef('producer', { maxFontSize: 17, color: '#fff5e8', textAlign: 'center' }),
      wineName: tdef('wineName', { maxFontSize: 13, fontStyle: 'normal', fontWeight: 700, color: '#fff5e8', textAlign: 'center' }),
      region: tdef('region', { textAlign: 'center', colorRole: 'muted' }),
      score: tdef('score', { maxFontSize: 26 }),
      description: tdef('description', {
        fitMode: 'box',
        fontStyle: 'normal',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        maxFontSize: 11,
        paddingX: 6,
        paddingY: 6,
        lineHeight: 1.45,
      }),
      tags: tdef('tags', { color: '#fff5e8', textAlign: 'center' }),
    },
  }
);

/* ───────────────── BURGUNDY MODERN ─────────────────
   Maroon header band · open cream · twin lower frames (bottle | notes) */
export const BURGUNDY_MODERN_LAYOUT = layout(
  {
    producer: { top: 3.5, left: 9, width: 82, height: 6.5 },
    wineName: { top: 16, left: 8, width: 58, height: 5.5 },
    region: { top: 22, left: 8, width: 58, height: 4 },
    score: { top: 16, left: 71, width: 21, height: 11 },
    bottle: { top: 45.5, left: 8, width: 37, height: 47 },
    description: { top: 45.5, left: 51.5, width: 41, height: 47 },
    tags: { top: 39.5, left: 8, width: 84, height: 3.6 },
    logo: { top: 28, left: 74, width: 17, height: 8 },
  },
  {
    typography: {
      producer: tdef('producer', { maxFontSize: 18, color: '#f5ead8', textAlign: 'center' }),
      wineName: tdef('wineName', { maxFontSize: 13, textAlign: 'left', justifyContent: 'flex-start' }),
      region: tdef('region', { textAlign: 'left', justifyContent: 'flex-start', colorRole: 'muted' }),
      score: tdef('score', { maxFontSize: 30 }),
      description: tdef('description', {
        fitMode: 'box',
        fontStyle: 'normal',
        maxFontSize: 11,
        paddingX: 8,
        paddingY: 6,
        lineHeight: 1.5,
      }),
      tags: tdef('tags', { colorRole: 'accent' }),
    },
  }
);

/* ───────────────── BURGUNDY HERITAGE ─────────────────
   Maroon header · deckled bottle (lower-left) · tall recessed notes panel (right) */
export const BURGUNDY_HERITAGE_LAYOUT = layout(
  {
    producer: { top: 3.5, left: 8, width: 84, height: 6.5 },
    wineName: { top: 14, left: 8, width: 58, height: 4.5 },
    region: { top: 18.8, left: 8, width: 58, height: 3.5 },
    score: { top: 13, left: 70, width: 20, height: 8 },
    bottle: { top: 24, left: 8, width: 46, height: 62 },
    description: { top: 25, left: 62, width: 29, height: 63 },
    tags: { top: 93, left: 10, width: 80, height: 3.2 },
    logo: { top: 92.5, left: 80, width: 12, height: 4.5 },
  },
  {
    typography: {
      producer: tdef('producer', { maxFontSize: 18, color: '#f5ead8', textAlign: 'center' }),
      wineName: tdef('wineName', { maxFontSize: 13, textAlign: 'center' }),
      region: tdef('region', { textAlign: 'center', colorRole: 'muted' }),
      score: tdef('score', { maxFontSize: 24 }),
      description: tdef('description', {
        fitMode: 'box',
        fontStyle: 'normal',
        alignItems: 'flex-start',
        maxFontSize: 11,
        paddingX: 8,
        paddingY: 10,
        lineHeight: 1.55,
      }),
      tags: tdef('tags', { colorRole: 'accent', textAlign: 'center' }),
    },
  }
);

/* ───────────────── FESTIVE WINTER ─────────────────
   Silver ribbon (producer) · upper-left header · lower-left bottle · right ruled lines */
export const FESTIVE_WINTER_LAYOUT = layout(
  {
    producer: { top: 11.4, left: 28, width: 44, height: 4.2 },
    wineName: { top: 24, left: 8, width: 42, height: 4.5 },
    region: { top: 29, left: 8, width: 42, height: 3.4 },
    score: { top: 33.5, left: 8, width: 20, height: 9 },
    bottle: { top: 44, left: 7, width: 40, height: 36 },
    description: { top: 46, left: 53, width: 33, height: 24 },
    tags: { top: 86, left: 16, width: 64, height: 3.6 },
    logo: { top: 90, left: 43, width: 14, height: 5 },
  },
  {
    textOnDark: true,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowBlur: 4,
    typography: {
      producer: tdef('producer', { maxFontSize: 15, colorRole: 'text', textAlign: 'center' }),
      wineName: tdef('wineName', { maxFontSize: 12, colorRole: 'text', textAlign: 'left', justifyContent: 'flex-start' }),
      region: tdef('region', { colorRole: 'muted', textAlign: 'left', justifyContent: 'flex-start' }),
      score: tdef('score', { maxFontSize: 26, colorRole: 'accent' }),
      description: tdef('description', {
        lineCount: 8,
        fontStyle: 'normal',
        colorRole: 'text',
        maxFontSize: 10.5,
        paddingX: 4,
        paddingY: 2,
      }),
      tags: tdef('tags', { colorRole: 'accent' }),
    },
  }
);

/* ───────────────── LIGHT & AIRY ─────────────────
   Notched header (producer) · text left · gray bottle panel right · footer box */
export const LIGHT_AIRY_LAYOUT = layout(
  {
    producer: { top: 9, left: 11, width: 78, height: 5 },
    wineName: { top: 18, left: 9, width: 46, height: 4.5 },
    region: { top: 23, left: 9, width: 46, height: 3.4 },
    score: { top: 88, left: 9, width: 17, height: 5.5 },
    bottle: { top: 18, left: 48, width: 43, height: 64 },
    description: { top: 29, left: 9, width: 38, height: 50 },
    tags: { top: 88, left: 28, width: 50, height: 5.5 },
    logo: { top: 88, left: 79, width: 13, height: 5.5 },
  },
  {
    typography: {
      producer: tdef('producer', { maxFontSize: 15, colorRole: 'text', textAlign: 'center', uppercase: true }),
      wineName: tdef('wineName', { maxFontSize: 12, textAlign: 'left', justifyContent: 'flex-start' }),
      region: tdef('region', { textAlign: 'left', justifyContent: 'flex-start', colorRole: 'muted' }),
      score: tdef('score', { maxFontSize: 22, colorRole: 'accent', textAlign: 'left', justifyContent: 'flex-start' }),
      description: tdef('description', {
        fitMode: 'box',
        fontStyle: 'normal',
        maxFontSize: 11,
        paddingX: 4,
        paddingY: 4,
        lineHeight: 1.5,
      }),
      tags: tdef('tags', { colorRole: 'accent', maxFontSize: 7 }),
    },
  }
);

/* ───────────────── MINIMAL EDITORIAL ─────────────────
   Header box · inset bottle box · 9 dashed ruled lines · 5-cell footer */
export const MINIMAL_EDITORIAL_LAYOUT = layout(
  {
    producer: { top: 8, left: 7, width: 86, height: 9 },
    wineName: { top: 18, left: 7, width: 86, height: 6.5 },
    region: { top: 25, left: 7, width: 86, height: 4 },
    bottle: { top: 36, left: 9.5, width: 34, height: 46 },
    description: { top: 38.5, left: 51, width: 41, height: 46 },
    score: { top: 89, left: 6, width: 14, height: 6 },
    tags: { top: 89, left: 21, width: 52, height: 6 },
    logo: { top: 89, left: 75, width: 19, height: 6 },
  },
  {
    typography: {
      producer: tdef('producer', {
        maxFontSize: 18,
        textAlign: 'left',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        colorRole: 'text',
      }),
      wineName: tdef('wineName', { textAlign: 'left', justifyContent: 'flex-start' }),
      region: tdef('region', { textAlign: 'left', justifyContent: 'flex-start', colorRole: 'muted' }),
      description: tdef('description', {
        lineCount: 9,
        fontStyle: 'normal',
        maxFontSize: 13,
        paddingX: 4,
        paddingY: 2,
      }),
      score: tdef('score', { maxFontSize: 22, colorRole: 'text', textAlign: 'left', justifyContent: 'flex-start' }),
      tags: tdef('tags', { colorRole: 'text', maxFontSize: 6.5 }),
    },
  }
);

/* ───────────────── ORGANIC NATURAL ─────────────────
   Green ribbon (title) · upper-left header · deckled bottle (lower-left) · vine notes panel (right) */
export const ORGANIC_NATURAL_LAYOUT = layout(
  {
    producer: { top: 10, left: 17, width: 66, height: 5.5 },
    wineName: { top: 16, left: 17, width: 66, height: 4.5 },
    region: { top: 27, left: 8, width: 36, height: 4 },
    score: { top: 32, left: 8, width: 18, height: 8 },
    bottle: { top: 52, left: 13, width: 28, height: 34 },
    description: { top: 31, left: 49, width: 39, height: 50 },
    tags: { top: 90, left: 8, width: 70, height: 3.6 },
    logo: { top: 89.5, left: 80, width: 13, height: 5 },
  },
  {
    typography: {
      producer: tdef('producer', { maxFontSize: 15, colorRole: 'text', textAlign: 'center', uppercase: true }),
      wineName: tdef('wineName', { maxFontSize: 12, fontStyle: 'normal', fontWeight: 600, colorRole: 'text', textAlign: 'center' }),
      region: tdef('region', { textAlign: 'left', justifyContent: 'flex-start', colorRole: 'muted' }),
      score: tdef('score', { maxFontSize: 24 }),
      description: tdef('description', {
        fitMode: 'box',
        fontStyle: 'normal',
        maxFontSize: 10.5,
        paddingX: 6,
        paddingY: 6,
        lineHeight: 1.5,
      }),
      tags: tdef('tags', { colorRole: 'text' }),
    },
  }
);

export interface FlowPreset {
  name: string;
  backgroundImageUrl: string;
  textColor: string;
  accentColor: string;
  mutedColor?: string;
  layout: FlowDesignLayout;
}

export const FLOW_PRESETS: Record<DesignLayout, FlowPreset> = {
  'noir-luxury': {
    name: 'Noir Luxury',
    backgroundImageUrl: '/designs/noir-luxury.jpeg',
    textColor: '#f5e9c8',
    accentColor: '#D4AF37',
    mutedColor: '#c9a94a',
    layout: NOIR_LUXURY_LAYOUT,
  },
  'clean-minimal': {
    name: 'Clean Minimal',
    backgroundImageUrl: '/designs/clean-minimal.jpeg',
    textColor: '#1a1a1a',
    accentColor: '#1a1a1a',
    mutedColor: '#555555',
    layout: CLEAN_MINIMAL_LAYOUT,
  },
  'autumn-harvest': {
    name: 'Autumn Harvest',
    backgroundImageUrl: '/designs/autumn-harvest.jpeg?v=2',
    textColor: '#5c1d12',
    accentColor: '#8b2500',
    mutedColor: '#7a3a25',
    layout: AUTUMN_HARVEST_LAYOUT,
  },
  'burgundy-modern': {
    name: 'Burgundy Modern',
    backgroundImageUrl: '/designs/burgundy-modern.jpeg',
    textColor: '#3a1622',
    accentColor: '#6b1c32',
    mutedColor: '#8a5a68',
    layout: BURGUNDY_MODERN_LAYOUT,
  },
  'burgundy-heritage': {
    name: 'Burgundy Heritage',
    backgroundImageUrl: '/designs/burgundy-heritage.jpeg?v=2',
    textColor: '#3a1622',
    accentColor: '#7a1f38',
    mutedColor: '#8a5a68',
    layout: BURGUNDY_HERITAGE_LAYOUT,
  },
  'festive-winter': {
    name: 'Festive Winter',
    backgroundImageUrl: '/designs/festive-winter.jpeg',
    textColor: '#eef2f8',
    accentColor: '#cdd6e4',
    mutedColor: '#aab6c8',
    layout: FESTIVE_WINTER_LAYOUT,
  },
  'light-airy': {
    name: 'Light & Airy',
    backgroundImageUrl: '/designs/light-airy.jpeg',
    textColor: '#1e3d2f',
    accentColor: '#2d5a3d',
    mutedColor: '#4d7a5d',
    layout: LIGHT_AIRY_LAYOUT,
  },
  'minimal-editorial': {
    name: 'Minimal Editorial',
    backgroundImageUrl: '/designs/minimal-editorial.jpeg',
    textColor: '#1a1a1a',
    accentColor: '#333333',
    mutedColor: '#666666',
    layout: MINIMAL_EDITORIAL_LAYOUT,
  },
  'organic-natural': {
    name: 'Organic Natural',
    backgroundImageUrl: '/designs/organic-natural.jpeg',
    textColor: '#433521',
    accentColor: '#5a6b4a',
    mutedColor: '#6b5a48',
    layout: ORGANIC_NATURAL_LAYOUT,
  },
};

export const DESIGN_LAYOUTS: DesignLayout[] = Object.keys(FLOW_PRESETS) as DesignLayout[];

const LEGACY_LAYOUT_MAP: Record<string, DesignLayout> = {
  'royal-dark': 'noir-luxury',
  'flow-art-deco': 'burgundy-heritage',
  'flow-custom': 'noir-luxury',
};

export function migrateDesignLayout(raw: unknown): DesignLayout {
  if (typeof raw === 'string' && raw in FLOW_PRESETS) return raw as DesignLayout;
  if (typeof raw === 'string' && raw in LEGACY_LAYOUT_MAP) return LEGACY_LAYOUT_MAP[raw];
  return 'noir-luxury';
}

export function zoneStyle(zone: FlowZone): {
  top: string;
  left: string;
  width: string;
  height: string;
} {
  return {
    top: `${zone.top}%`,
    left: `${zone.left}%`,
    width: `${zone.width}%`,
    height: `${zone.height}%`,
  };
}

export function getEffectiveZones(
  layoutKey: DesignLayout,
  overrides?: AppSettings['layoutOverrides']
): Record<ZoneKey, FlowZone> {
  const base = FLOW_PRESETS[layoutKey].layout.zones;
  const custom = overrides?.[layoutKey];
  if (!custom) return base;

  const merged = { ...base };
  for (const key of Object.keys(custom) as ZoneKey[]) {
    merged[key] = { ...base[key], ...custom[key] };
  }
  return merged;
}

export function getEffectiveTypography(
  layoutKey: DesignLayout,
  overrides?: AppSettings['typographyOverrides']
): Partial<Record<ZoneKey, ZoneTypography>> {
  const base = FLOW_PRESETS[layoutKey].layout.typography ?? {};
  const custom = overrides?.[layoutKey];
  if (!custom) return base;

  const merged = { ...base };
  for (const key of Object.keys(custom) as ZoneKey[]) {
    merged[key] = { ...(base[key] ?? {}), ...custom[key] };
  }
  return merged;
}

/** Zones users reposition — text fields plus bottle/logo placement */
export const EDITABLE_ZONE_KEYS: ZoneKey[] = [
  'producer',
  'wineName',
  'region',
  'score',
  'bottle',
  'description',
  'tags',
  'logo',
];

/** Text zones checked for overlap clashes */
export const TEXT_ZONE_KEYS: ZoneKey[] = [
  'region',
  'producer',
  'wineName',
  'score',
  'description',
  'tags',
];

export function zonesOverlap(a: FlowZone, b: FlowZone, gap = 0.5): boolean {
  const aRight = a.left + a.width;
  const aBottom = a.top + a.height;
  const bRight = b.left + b.width;
  const bBottom = b.top + b.height;
  return !(
    aRight <= b.left + gap ||
    a.left >= bRight - gap ||
    aBottom <= b.top + gap ||
    a.top >= bBottom - gap
  );
}

export function findZoneOverlaps(
  zones: Record<ZoneKey, FlowZone>,
  keys: ZoneKey[] = TEXT_ZONE_KEYS
): Array<[ZoneKey, ZoneKey]> {
  const pairs: Array<[ZoneKey, ZoneKey]> = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      if (zonesOverlap(zones[keys[i]], zones[keys[j]])) {
        pairs.push([keys[i], keys[j]]);
      }
    }
  }
  return pairs;
}

export function clampZone(zone: FlowZone, minSize = 3): FlowZone {
  const width = Math.max(minSize, Math.min(100 - zone.left, zone.width));
  const height = Math.max(minSize, Math.min(100 - zone.top, zone.height));
  const left = Math.max(0, Math.min(100 - width, zone.left));
  const top = Math.max(0, Math.min(100 - height, zone.top));
  return { top, left, width, height };
}

export const ZONE_LABELS: Record<ZoneKey, string> = {
  region: 'Region',
  producer: 'Producer',
  wineName: 'Wine Name',
  score: 'Score / Rating',
  bottle: 'Bottle Image',
  description: 'Tasting Notes',
  tags: 'Tags / Footer',
  logo: 'Logo',
};

export function resetLayoutOverrides(
  overrides: AppSettings['layoutOverrides'] | undefined,
  layoutKey: DesignLayout
): AppSettings['layoutOverrides'] {
  if (!overrides?.[layoutKey]) return overrides;
  const next = { ...overrides };
  delete next[layoutKey];
  return Object.keys(next).length > 0 ? next : undefined;
}

export function resetTypographyOverrides(
  overrides: AppSettings['typographyOverrides'] | undefined,
  layoutKey: DesignLayout
): AppSettings['typographyOverrides'] {
  if (!overrides?.[layoutKey]) return overrides;
  const next = { ...overrides };
  delete next[layoutKey];
  return Object.keys(next).length > 0 ? next : undefined;
}

export function resetAllLayoutCustomizations(
  layoutOverrides: AppSettings['layoutOverrides'] | undefined,
  typographyOverrides: AppSettings['typographyOverrides'] | undefined,
  layoutKey: DesignLayout
): Pick<AppSettings, 'layoutOverrides' | 'typographyOverrides'> {
  return {
    layoutOverrides: resetLayoutOverrides(layoutOverrides, layoutKey),
    typographyOverrides: resetTypographyOverrides(typographyOverrides, layoutKey),
  };
}

export function updateZoneOverride(
  overrides: LayoutZoneOverrides | undefined,
  zoneKey: ZoneKey,
  field: keyof FlowZone,
  value: number
): LayoutZoneOverrides {
  return {
    ...overrides,
    [zoneKey]: {
      ...overrides?.[zoneKey],
      [field]: value,
    },
  };
}

export function updateZoneBounds(
  overrides: LayoutZoneOverrides | undefined,
  zoneKey: ZoneKey,
  bounds: FlowZone
): LayoutZoneOverrides {
  return {
    ...overrides,
    [zoneKey]: clampZone(bounds),
  };
}

export function updateTypographyOverride(
  overrides: TypographyZoneOverrides | undefined,
  zoneKey: ZoneKey,
  field: keyof ZoneTypography,
  value: ZoneTypography[keyof ZoneTypography]
): TypographyZoneOverrides {
  return {
    ...overrides,
    [zoneKey]: {
      ...overrides?.[zoneKey],
      [field]: value,
    },
  };
}
