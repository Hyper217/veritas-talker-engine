import type { Product } from '../types';

export interface TalkerOccupancy {
  showBottle: boolean;
  showScore: boolean;
  showPrice: boolean;
  showHook: boolean;
  showVintage: boolean;
  showRegion: boolean;
  showTags: boolean;
  showLogo: boolean;
  showFooter: boolean;
  showNumerals: boolean;
  notesLineCount: number;
  hookLineCount: number;
}

/** Which zones are live, and how many note lines the leftover height can take. */
export function getOccupancy(
  product: Product,
  bottleUrl: string,
  logoUrl: string,
  tagText: string,
): TalkerOccupancy {
  const showBottle = product.showBottle && !!bottleUrl;
  const showScore = product.showScore && product.score !== null;
  const showPrice = !!product.price?.trim();
  const showHook = !!product.hook?.trim();
  const showVintage = !!product.vintage?.trim();
  const showRegion = !!product.region?.trim();
  const showTags = !!tagText.trim();
  const showLogo = !!logoUrl;
  const showFooter = showTags || showLogo;
  const showNumerals = showVintage || showPrice;

  let notesLineCount = 5;
  if (!showScore) notesLineCount += 2;
  if (!showHook) notesLineCount += 2;
  if (!showRegion) notesLineCount += 1;

  return {
    showBottle,
    showScore,
    showPrice,
    showHook,
    showVintage,
    showRegion,
    showTags,
    showLogo,
    showFooter,
    showNumerals,
    notesLineCount,
    hookLineCount: showScore ? 1 : 2,
  };
}
