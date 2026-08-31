import type { AppSettings, Product } from '../types';

/** Generic wine-bottle silhouette for template gallery previews */
const PREVIEW_BOTTLE_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 320" fill="none">
    <defs>
      <linearGradient id="g" x1="60" y1="0" x2="60" y2="320" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#3d2518"/>
        <stop offset="45%" stop-color="#1a0f0a"/>
        <stop offset="100%" stop-color="#0d0806"/>
      </linearGradient>
    </defs>
    <path fill="url(#g)" d="M52 0h16v28c10 6 14 18 14 32v8c0 8-4 14-10 18v166c0 22-14 36-30 36s-30-14-30-36V86c-6-4-10-10-10-18v-8c0-14 4-26 14-32V0z"/>
    <ellipse cx="60" cy="286" rx="22" ry="6" fill="#000" opacity="0.25"/>
  </svg>`,
)}`;

export const PREVIEW_PRODUCT: Product = {
  id: 'preview-sample',
  producer: 'Château Veritas',
  name: 'Reserve Cabernet',
  vintage: '2021',
  price: '$48',
  region: 'Napa Valley, CA',
  hook: 'Cedar, blackberry, and 40-year vines.',
  score: 94,
  reviewer: 'Wine Spectator',
  description:
    'Layers of blackberry, cedar, and dark chocolate with silky tannins and a long, elegant finish.',
  tags: ['Organic', 'Limited Release'],
  bottleImageUrl: PREVIEW_BOTTLE_SVG,
  logoUrl: '',
  showScore: true,
  showBottle: true,
};

export const PREVIEW_SETTINGS: AppSettings = {
  defaultLogoUrl: '',
  defaultTags: ['Organic', 'Limited Release'],
  templateId: 'noir',
};
