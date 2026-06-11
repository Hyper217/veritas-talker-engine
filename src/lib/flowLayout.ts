import { FlowDesign, FlowDesignLayout, FlowLayoutPreset, FlowZone } from '../types';

export const DEFAULT_FLOW_LAYOUT: FlowDesignLayout = {
  preset: 'default',
  textOnDark: false,
  descriptionPanelOpacity: 70,
  tagSeparator: ' ',
  textShadowColor: 'rgba(255,255,255,0.9)',
  textShadowBlur: 4,
  descriptionPanelColor: '#ffffff',
  zones: {
    region: { top: 4, left: 5, width: 58, height: 4 },
    producer: { top: 9, left: 5, width: 52, height: 7 },
    wineName: { top: 16, left: 5, width: 52, height: 6 },
    score: { top: 3.5, left: 74, width: 21, height: 10 },
    bottle: { top: 28, left: 5, width: 38, height: 50 },
    description: { top: 32, left: 46, width: 49, height: 44 },
    tags: { top: 91, left: 5, width: 68, height: 5 },
    logo: { top: 87, left: 78, width: 18, height: 10 },
  },
};

/** Matches Flow art with left arch, right text column, footer band */
export const ART_DECO_FLOW_LAYOUT: FlowDesignLayout = {
  preset: 'art-deco',
  textOnDark: true,
  descriptionPanelOpacity: 0,
  tagSeparator: ' · ',
  textShadowColor: 'rgba(0,0,0,0.85)',
  textShadowBlur: 8,
  descriptionPanelColor: '#ffffff',
  zones: {
    region: { top: 3, left: 5, width: 32, height: 4.5 },
    producer: { top: 8.5, left: 5, width: 50, height: 7 },
    wineName: { top: 15.5, left: 5, width: 50, height: 5.5 },
    score: { top: 3, left: 70, width: 25, height: 11 },
    bottle: { top: 24, left: 7, width: 46, height: 54 },
    description: { top: 28, left: 54, width: 41, height: 52 },
    tags: { top: 90.5, left: 4, width: 92, height: 5 },
    logo: { top: 86, left: 80, width: 16, height: 8 },
  },
};

export const FLOW_LAYOUT_PRESETS: Record<FlowLayoutPreset, FlowDesignLayout> = {
  default: DEFAULT_FLOW_LAYOUT,
  'art-deco': ART_DECO_FLOW_LAYOUT,
  custom: DEFAULT_FLOW_LAYOUT,
};

export type FlowZoneKey = keyof FlowDesignLayout['zones'];

export const FLOW_ZONE_LABELS: Record<FlowZoneKey, string> = {
  region: 'Region',
  producer: 'Producer',
  wineName: 'Wine name + vintage',
  score: 'Score badge',
  bottle: 'Bottle photo',
  description: 'Tasting notes',
  tags: 'Tags footer',
  logo: 'Logo',
};

export function getFlowLayout(design?: { layout?: FlowDesignLayout } | null): FlowDesignLayout {
  if (!design?.layout?.zones) return DEFAULT_FLOW_LAYOUT;
  return {
    ...DEFAULT_FLOW_LAYOUT,
    ...design.layout,
    zones: { ...DEFAULT_FLOW_LAYOUT.zones, ...design.layout.zones },
  };
}

export function applyLayoutPreset(preset: FlowLayoutPreset): FlowDesignLayout {
  const base = FLOW_LAYOUT_PRESETS[preset === 'custom' ? 'default' : preset];
  return JSON.parse(JSON.stringify({ ...base, preset })) as FlowDesignLayout;
}

export function layoutForNewImport(): Partial<FlowDesign> {
  return {
    textColor: '#D4AF37',
    accentColor: '#D4AF37',
    layout: applyLayoutPreset('art-deco'),
  };
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
