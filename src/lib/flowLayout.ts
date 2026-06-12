import { FlowDesignLayout, FlowZone, DesignLayout } from '../types';

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

/** Coordinates for the user's uploaded premium Noir gold-and-black image template */
export const NOIR_FLOW_LAYOUT: FlowDesignLayout = {
  preset: 'art-deco',
  textOnDark: true,
  descriptionPanelOpacity: 0,
  tagSeparator: ' · ',
  textShadowColor: 'rgba(0,0,0,0.85)',
  textShadowBlur: 8,
  descriptionPanelColor: '#ffffff',
  zones: {
    region: { top: 16.5, left: 6, width: 50, height: 6 },
    producer: { top: 5, left: 6, width: 50, height: 10 },
    wineName: { top: 34, left: 60, width: 32, height: 16 },
    score: { top: 4, left: 60, width: 32, height: 21 },
    bottle: { top: 29.5, left: 10, width: 38, height: 50.5 },
    description: { top: 54, left: 60, width: 32, height: 26 },
    tags: { top: 84.5, left: 6, width: 88, height: 5.5 },
    logo: { top: 92, left: 42, width: 16, height: 6 },
  },
};

export interface FlowPreset {
  name: string;
  backgroundImageUrl: string;
  textColor: string;
  accentColor: string;
  layout: FlowDesignLayout;
}

export const FLOW_PRESETS: Record<DesignLayout, FlowPreset> = {
  'royal-dark': {
    name: 'Noir',
    backgroundImageUrl: '/designs/noir.jpg',
    textColor: '#ffffff',
    accentColor: '#D4AF37',
    layout: NOIR_FLOW_LAYOUT,
  },
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

