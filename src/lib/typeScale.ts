/** Print-safe type tokens for the 384×512 (3:4) talker. */

export const TYPE_SCALE = {
  name:     { max: 32, min: 16 },
  producer: { max: 13, min: 8 },
  numeral:  { max: 24, min: 12 },
  hook:     { max: 14, min: 9 },
  notes:    { max: 11, min: 7 },
  caption:  { max: 8, min: 5 },
  score:    { max: 22, min: 11 },
} as const;

export const IDENTITY_BAND_PCT = 32;
export const FOOTER_MIN_PCT = 9;
export const BOTTLE_COL_PCT = 38;
