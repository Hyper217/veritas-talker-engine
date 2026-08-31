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
};

export const TEMPLATE_LIST: TemplateConfig[] = Object.values(TEMPLATES);

export function getTemplate(id: TemplateId): TemplateConfig {
  return TEMPLATES[id] ?? TEMPLATES.noir;
}

export function isTemplateId(id: unknown): id is TemplateId {
  return typeof id === 'string' && id in TEMPLATES;
}
