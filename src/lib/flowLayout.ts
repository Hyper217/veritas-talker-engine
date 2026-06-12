import { FlowDesignLayout, FlowZone } from '../types';

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

export interface FlowPreset {
  name: string;
  backgroundImageUrl: string;
  textColor: string;
  accentColor: string;
  layout: FlowDesignLayout;
}

export const FLOW_PRESETS: Record<'flow-art-deco', FlowPreset> = {
  'flow-art-deco': {
    name: 'Art Deco',
    backgroundImageUrl: '/designs/art-deco.png',
    textColor: '#D4AF37',
    accentColor: '#D4AF37',
    layout: ART_DECO_FLOW_LAYOUT,
  },
};

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

