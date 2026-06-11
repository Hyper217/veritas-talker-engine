export interface Product {
  id: string;
  producer: string;
  name: string;
  vintage: string;
  region: string;
  score: number | null;
  reviewer: string;
  description: string;
  tags: string[];
  dropboxImageUrl: string;
  logoUrl: string;
}

/** Built-in Noir (black & gold) or Google Flow import */
export type DesignLayout = 'royal-dark' | 'flow-custom';

export type FlowLayoutPreset = 'default' | 'art-deco' | 'custom';

/** Position as % of talker (0–100) */
export interface FlowZone {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface FlowDesignLayout {
  preset: FlowLayoutPreset;
  zones: {
    region: FlowZone;
    producer: FlowZone;
    wineName: FlowZone;
    score: FlowZone;
    bottle: FlowZone;
    description: FlowZone;
    tags: FlowZone;
    logo: FlowZone;
  };
  /** Use light text + dark shadow (for dark Flow backgrounds) */
  textOnDark?: boolean;
  /** 0 = transparent tasting-note panel */
  descriptionPanelOpacity?: number;
  tagSeparator?: string;
}

export interface FlowDesign {
  id: string;
  name: string;
  /** Full shelf talker artwork exported from Google Flow */
  imageUrl: string;
  textColor?: string;
  accentColor?: string;
  layout?: FlowDesignLayout;
  createdAt: string;
}

export interface AppSettings {
  defaultLogoUrl: string;
  defaultTags: string[];
  designLayout: DesignLayout;
  /** Accent color for Noir layout (default gold) */
  royalDarkColor?: string;
  activeFlowDesignId?: string;
}

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
