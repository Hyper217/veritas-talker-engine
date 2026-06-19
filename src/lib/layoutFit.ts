/** Binary-search font fitting utilities for shelf talker zones */

export interface FitMetrics {
  fontSize: number;
  lineHeightPx: number;
  fits: boolean;
}

export function zoneHeightPx(zoneHeightPercent: number, talkerHeight = 510): number {
  return (zoneHeightPercent / 100) * talkerHeight;
}

export function zoneWidthPx(zoneWidthPercent: number, talkerWidth = 384): number {
  return (zoneWidthPercent / 100) * talkerWidth;
}

/** Derive line height from ruled-line count inside a zone */
export function ruledLineMetrics(
  zoneHeightPercent: number,
  lineCount: number,
  paddingY = 0,
  lineOffsetTop = 0,
  talkerHeight = 510
): { lineHeightPx: number; contentHeightPx: number } {
  const zoneH = zoneHeightPx(zoneHeightPercent, talkerHeight);
  const contentHeightPx = zoneH - paddingY * 2 - lineOffsetTop;
  const lineHeightPx = contentHeightPx / lineCount;
  return { lineHeightPx, contentHeightPx };
}

/** Font size that visually sits on ruled lines (cap height ≈ 72% of line box) */
export function fontSizeFromLineHeight(lineHeightPx: number, ratio = 0.72): number {
  return lineHeightPx * ratio;
}

export function textFits(
  el: HTMLElement,
  container: HTMLElement,
  singleLine: boolean
): boolean {
  const heightOk = el.scrollHeight <= container.clientHeight + 0.5;
  const widthOk = singleLine
    ? el.scrollWidth <= container.clientWidth + 0.5
    : el.scrollWidth <= container.clientWidth + 1;
  return heightOk && widthOk;
}

/** Binary search for largest font size that fits the container */
export function binarySearchFontSize(
  container: HTMLElement,
  inner: HTMLElement,
  min: number,
  max: number,
  singleLine: boolean,
  apply: (size: number) => void
): number {
  let lo = min;
  let hi = max;
  let best = min;

  while (hi - lo > 0.25) {
    const mid = (lo + hi) / 2;
    apply(mid);
    if (textFits(inner, container, singleLine)) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  apply(best);
  return best;
}

/** Strip HTML for plain-text length heuristics */
export function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent ?? '';
}
