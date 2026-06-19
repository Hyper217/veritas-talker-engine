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

export type DesignLayout =
  | 'noir-luxury'
  | 'clean-minimal'
  | 'autumn-harvest'
  | 'burgundy-modern'
  | 'burgundy-heritage'
  | 'festive-winter'
  | 'light-airy'
  | 'minimal-editorial'
  | 'organic-natural';

export type FlowLayoutPreset = 'default' | 'art-deco' | 'custom';

/** Position as % of talker (0–100) */
export interface FlowZone {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type ZoneKey =
  | 'region'
  | 'producer'
  | 'wineName'
  | 'score'
  | 'bottle'
  | 'description'
  | 'tags'
  | 'logo';

/** How text should conform to the design structure */
export type FitMode = 'box' | 'lines' | 'single';

export interface ZoneTypography {
  maxFontSize?: number;
  minFontSize?: number;
  fontFamily?: 'serif' | 'sans';
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  uppercase?: boolean;
  letterSpacing?: string;
  /** Unitless ratio, or overridden when fitMode is 'lines' */
  lineHeight?: number;
  colorRole?: 'text' | 'accent' | 'muted';
  /** Explicit color that overrides colorRole (e.g. light text on a dark header band) */
  color?: string;
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  singleLine?: boolean;
  /** Match ruled lines printed on the template artwork */
  fitMode?: FitMode;
  /** Number of ruled lines visible in this zone (description panels) */
  lineCount?: number;
  /** Inner padding in pixels */
  paddingX?: number;
  paddingY?: number;
  /** Offset from zone top to first text baseline (px) */
  lineOffsetTop?: number;
}

export interface FlowDesignLayout {
  preset: FlowLayoutPreset;
  zones: Record<ZoneKey, FlowZone>;
  textOnDark?: boolean;
  descriptionPanelOpacity?: number;
  tagSeparator?: string;
  textShadowColor?: string;
  textShadowBlur?: number;
  descriptionPanelColor?: string;
  typography?: Partial<Record<ZoneKey, ZoneTypography>>;
}

export type LayoutZoneOverrides = Partial<Record<ZoneKey, Partial<FlowZone>>>;
export type TypographyZoneOverrides = Partial<Record<ZoneKey, Partial<ZoneTypography>>>;

export interface AppSettings {
  defaultLogoUrl: string;
  defaultTags: string[];
  designLayout: DesignLayout;
  royalDarkColor?: string;
  layoutOverrides?: Partial<Record<DesignLayout, LayoutZoneOverrides>>;
  typographyOverrides?: Partial<Record<DesignLayout, TypographyZoneOverrides>>;
}

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';

export const TALKER_HEIGHT_PX = 510;
export const TALKER_WIDTH_PX = 384;
