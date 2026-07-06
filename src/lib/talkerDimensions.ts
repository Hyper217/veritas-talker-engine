import type { TemplateId } from '../types';

export const TALKER_WIDTH_PX  = 384;
export const TALKER_HEIGHT_PX = 512;

export const TALKER_WIDTH_MM  = 101.6;
export const TALKER_HEIGHT_MM = 135.4;

export interface TalkerDimensions {
  widthPx: number; heightPx: number;
  widthMm: number; heightMm: number;
}

/** All templates share the same physical dimensions (4×5.33 inches / 3:4 ratio) */
export function getTalkerDimensions(_layout: TemplateId | string): TalkerDimensions {
  return {
    widthPx:  TALKER_WIDTH_PX,
    heightPx: TALKER_HEIGHT_PX,
    widthMm:  TALKER_WIDTH_MM,
    heightMm: TALKER_HEIGHT_MM,
  };
}

export function getGridPositions(_layout: TemplateId | string): { x: number; y: number }[] {
  // Page Width = 215.9 mm (8.5 in)
  // Page Height = 279.4 mm (11 in)
  // Total Content Width = TALKER_WIDTH_MM * 2 + gap = 203.2 + 2 = 205.2 mm
  // Left Margin = (215.9 - 205.2) / 2 = 5.35 mm
  // Total Content Height = TALKER_HEIGHT_MM * 2 + gap = 270.8 + 2 = 272.8 mm
  // Top Margin = (279.4 - 272.8) / 2 = 3.3 mm
  
  const gap      = 2;
  const startY   = 3.3;
  const col1X    = 5.35;
  const col2X    = col1X + TALKER_WIDTH_MM + gap;
  const row2Y    = startY + TALKER_HEIGHT_MM + gap;
  
  return [
    { x: col1X, y: startY },
    { x: col2X, y: startY },
    { x: col1X, y: row2Y  },
    { x: col2X, y: row2Y  },
  ];
}
