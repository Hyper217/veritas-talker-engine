import { DesignLayout } from '../types';

export const TALKER_WIDTH_PX = 384;
export const TALKER_HEIGHT_PX = 510;

export const TALKER_WIDTH_MM = 101.6;
export const TALKER_HEIGHT_MM = 134.9375;

export interface TalkerDimensions {
  widthPx: number;
  heightPx: number;
  widthMm: number;
  heightMm: number;
}

export function getTalkerDimensions(_layout: DesignLayout): TalkerDimensions {
  return {
    widthPx: TALKER_WIDTH_PX,
    heightPx: TALKER_HEIGHT_PX,
    widthMm: TALKER_WIDTH_MM,
    heightMm: TALKER_HEIGHT_MM,
  };
}

export function getGridPositions(_layout: DesignLayout): { x: number; y: number }[] {
  const startY = 5;
  const verticalGap = 2;
  const col1X = 12.7;
  const col2X = col1X + TALKER_WIDTH_MM;

  return [
    { x: col1X, y: startY },
    { x: col2X, y: startY },
    { x: col1X, y: startY + TALKER_HEIGHT_MM + verticalGap },
    { x: col2X, y: startY + TALKER_HEIGHT_MM + verticalGap },
  ];
}
