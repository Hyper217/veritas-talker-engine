import type { TemplateId } from '../types';

export interface TemplateConfig {
  id: TemplateId;
  label: string;
  description: string;
  thumbnailUrl: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  textOnDark: boolean;
  tagSeparator: string;
}

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  noir: {
    id: 'noir',
    label: 'Noir',
    description: 'Black & gold — house style',
    thumbnailUrl: '',
    accentColor: '#c9a227',
    textColor: '#f4e7c5',
    mutedColor: '#a89870',
    textOnDark: true,
    tagSeparator: ' · ',
  },
  ivory: {
    id: 'ivory',
    label: 'Ivory',
    description: 'Cream & burgundy — house style',
    thumbnailUrl: '',
    accentColor: '#6b1e2a',
    textColor: '#3b1c22',
    mutedColor: '#7a6558',
    textOnDark: false,
    tagSeparator: ' · ',
  },
  cellar: {
    id: 'cellar',
    label: 'Cellar',
    description: 'Forest & ivory — house style',
    thumbnailUrl: '',
    accentColor: '#c4a574',
    textColor: '#f3eee4',
    mutedColor: '#b7c4b0',
    textOnDark: true,
    tagSeparator: ' · ',
  },
  copper: {
    id: 'copper',
    label: 'Copper',
    description: 'Charcoal & copper — house style',
    thumbnailUrl: '',
    accentColor: '#c47a3a',
    textColor: '#f2e6d8',
    mutedColor: '#cbb8a4',
    textOnDark: true,
    tagSeparator: ' · ',
  },
  'clean-minimal': {
    id: 'clean-minimal',
    label: 'Clean Minimal',
    description: 'Crisp line borders, classic layout',
    thumbnailUrl: '/designs/clean-minimal.jpeg',
    accentColor: '#111111',
    textColor: '#111111',
    mutedColor: '#555555',
    textOnDark: false,
    tagSeparator: '  ·  ',
  },
  'minimal-editorial': {
    id: 'minimal-editorial',
    label: 'Minimal Editorial',
    description: 'Dotted ruled lines, editorial structure',
    thumbnailUrl: '/designs/minimal-editorial.jpeg',
    accentColor: '#1a1a1a',
    textColor: '#1a1a1a',
    mutedColor: '#555555',
    textOnDark: false,
    tagSeparator: '  ·  ',
  },
  'burgundy-heritage': {
    id: 'burgundy-heritage',
    label: 'Burgundy Heritage',
    description: 'Deep burgundy header, cream parchment style',
    thumbnailUrl: '/designs/burgundy-heritage.jpeg',
    accentColor: '#7a1f38',
    textColor: '#3a1622',
    mutedColor: '#8a5a68',
    textOnDark: false,
    tagSeparator: '  ·  ',
  },
  'burgundy-marble': {
    id: 'burgundy-marble',
    label: 'Burgundy Modern',
    description: 'Rich burgundy header, elegant borders',
    thumbnailUrl: '/designs/burgundy-modern.jpeg',
    accentColor: '#6b1c32',
    textColor: '#3a1622',
    mutedColor: '#8a5a68',
    textOnDark: false,
    tagSeparator: '  ·  ',
  },
  'botanical-green': {
    id: 'botanical-green',
    label: 'Botanical Green',
    description: 'Kraft tones, sage green accents, rounded borders',
    thumbnailUrl: '/designs/organic-natural.jpeg',
    accentColor: '#5a6b4a',
    textColor: '#433521',
    mutedColor: '#6b5a48',
    textOnDark: false,
    tagSeparator: ' · ',
  },
  'autumn-harvest': {
    id: 'autumn-harvest',
    label: 'Autumn Harvest',
    description: 'Warm amber tones, maroon text, elegant framing',
    thumbnailUrl: '/designs/autumn-harvest.jpeg',
    accentColor: '#8b2500',
    textColor: '#5c1d12',
    mutedColor: '#7a3a25',
    textOnDark: false,
    tagSeparator: ' · ',
  },
  'rustic-kraft': {
    id: 'rustic-kraft',
    label: 'Festive Winter',
    description: 'Navy blue, silver accents, crisp ruled notes',
    thumbnailUrl: '/designs/festive-winter.jpeg',
    accentColor: '#cdd6e4',
    textColor: '#eef2f8',
    mutedColor: '#aab6c8',
    textOnDark: true,
    tagSeparator: ' · ',
  },
  'art-deco': {
    id: 'art-deco',
    label: 'Art Deco',
    description: 'Black base, intricate gold borders',
    thumbnailUrl: '/designs/art-deco.png',
    accentColor: '#D4AF37',
    textColor: '#f5e9c8',
    mutedColor: '#c9a94a',
    textOnDark: true,
    tagSeparator: ' · ',
  },
};

export const TEMPLATE_LIST: TemplateConfig[] = Object.values(TEMPLATES);

export function getTemplate(id: TemplateId): TemplateConfig {
  return TEMPLATES[id] ?? TEMPLATES.noir;
}

export function isTemplateId(id: unknown): id is TemplateId {
  return typeof id === 'string' && id in TEMPLATES;
}
