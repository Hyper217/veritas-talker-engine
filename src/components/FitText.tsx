import { useRef, useLayoutEffect, useState, useCallback } from 'react';
import {
  binarySearchFontSize,
  fontSizeFromLineHeight,
  ruledLineMetrics,
  textFits,
} from '../lib/layoutFit';
import type { FitMode } from '../types';

export interface FitTextProps {
  text: string;
  color?: string;
  className?: string;
  maxFontSize?: number;
  minFontSize?: number;
  fontFamily?: 'serif' | 'sans' | 'cinzel' | 'cormorant' | 'libre';
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: string;
  lineHeight?: number;
  uppercase?: boolean;
  singleLine?: boolean;
  html?: boolean;
  trackReady?: boolean;
  fitMode?: FitMode;
  lineCount?: number;
  paddingX?: number;
  paddingY?: number;
  lineOffsetTop?: number;
  field?: string;
  /** Zone height as % — required for ruled-line mode */
  zoneHeightPercent?: number;
}

export default function FitText({
  text,
  color = '#1a1a1a',
  className = '',
  maxFontSize = 14,
  minFontSize = 7,
  fontFamily = 'serif',
  fontWeight = 400,
  fontStyle = 'normal',
  textAlign = 'left',
  letterSpacing,
  lineHeight = 1.35,
  uppercase = false,
  singleLine = false,
  html = false,
  trackReady = true,
  fitMode = 'box',
  lineCount,
  paddingX = 2,
  paddingY = 2,
  lineOffsetTop = 0,
  zoneHeightPercent,
  field,
}: FitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ fontSize: maxFontSize, lineHeightPx: 0 });

  const applyStyles = useCallback(
    (el: HTMLElement, size: number, lineHeightPx?: number) => {
      el.style.fontSize = `${size}px`;
      if (lineHeightPx && lineHeightPx > 0) {
        el.style.lineHeight = `${lineHeightPx}px`;
      } else {
        el.style.lineHeight = String(lineHeight);
      }
    },
    [lineHeight]
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = textRef.current;
    if (!container || !inner) return;

    const isSingle = singleLine || fitMode === 'single';
    const displayText = text || (html ? 'Sample tasting notes with refined aromatics.' : '');

    if (!displayText.trim()) {
      setMetrics({ fontSize: maxFontSize, lineHeightPx: 0 });
      container.removeAttribute('data-overflow');
      if (trackReady) container.setAttribute('data-autosize-ready', 'true');
      return;
    }

    let resolvedLineHeightPx = 0;
    let searchMax = maxFontSize;
    let searchMin = minFontSize;

    const contentHeight =
      container.clientHeight - paddingY * 2 - (lineOffsetTop || 0);

    if (fitMode === 'lines' && lineCount && lineCount > 0 && contentHeight > 0) {
      resolvedLineHeightPx = contentHeight / lineCount;
      const idealSize = fontSizeFromLineHeight(resolvedLineHeightPx);
      searchMax = Math.min(maxFontSize, idealSize);
      searchMin = minFontSize;
    } else if (fitMode === 'lines' && lineCount && lineCount > 0 && zoneHeightPercent) {
      const ruled = ruledLineMetrics(zoneHeightPercent, lineCount, paddingY, lineOffsetTop);
      resolvedLineHeightPx = ruled.lineHeightPx;
      const idealSize = fontSizeFromLineHeight(ruled.lineHeightPx);
      searchMax = Math.min(maxFontSize, idealSize);
      searchMin = minFontSize;
    }

    const finalSize = binarySearchFontSize(
      container,
      inner,
      searchMin,
      searchMax,
      isSingle,
      (size) => applyStyles(inner, size, resolvedLineHeightPx || undefined)
    );

    // If ruled/container lines still overflow at min size, shrink line height proportionally
    if (
      fitMode === 'lines' &&
      lineCount &&
      resolvedLineHeightPx > 0 &&
      !textFits(inner, container, false)
    ) {
      const shrink = container.clientHeight / Math.max(inner.scrollHeight, 1);
      resolvedLineHeightPx = Math.max(resolvedLineHeightPx * shrink, minFontSize * 1.1);
      applyStyles(inner, minFontSize, resolvedLineHeightPx);
    }

    setMetrics({ fontSize: finalSize, lineHeightPx: resolvedLineHeightPx });

    const fits = textFits(inner, container, isSingle);
    const atMin = finalSize <= minFontSize + 0.3;
    const warnOverflow =
      !fits ||
      (atMin && (field === 'name' || field === 'hook' || field === 'notes') && displayText.length > 8);

    if (warnOverflow) {
      container.setAttribute('data-overflow', 'true');
    } else {
      container.removeAttribute('data-overflow');
    }
    if (trackReady) {
      container.setAttribute('data-autosize-ready', 'true');
    } else {
      container.removeAttribute('data-autosize-ready');
    }
  }, [
    text,
    maxFontSize,
    minFontSize,
    singleLine,
    fitMode,
    lineCount,
    paddingX,
    paddingY,
    lineOffsetTop,
    zoneHeightPercent,
    html,
    uppercase,
    lineHeight,
    trackReady,
    field,
    applyStyles,
  ]);

  const fontClass =
    fontFamily === 'sans' ? 'font-sans'
    : fontFamily === 'cinzel' ? 'font-cinzel'
    : fontFamily === 'cormorant' ? 'font-cormorant'
    : fontFamily === 'libre' ? 'font-libre'
    : 'font-serif';
  const isSingle = singleLine || fitMode === 'single';

  return (
    <div
      ref={containerRef}
      data-autosize={trackReady ? true : undefined}
      data-field={field}
      className={`h-full w-full overflow-hidden ${className}`}
      style={{
        padding: `${paddingY}px ${paddingX}px`,
        paddingTop: lineOffsetTop ? `${paddingY + lineOffsetTop}px` : `${paddingY}px`,
      }}
    >
      <div
        ref={textRef}
        className={`relative w-full shelf-talker-content ${fontClass} ${uppercase ? 'uppercase' : ''} ${isSingle ? 'whitespace-nowrap' : ''}`}
        style={{
          fontSize: `${metrics.fontSize}px`,
          color,
          fontWeight,
          fontStyle,
          textAlign,
          letterSpacing,
          lineHeight:
            metrics.lineHeightPx > 0 ? `${metrics.lineHeightPx}px` : lineHeight,
          wordBreak: isSingle ? 'normal' : 'break-word',
          overflowWrap: isSingle ? 'normal' : 'break-word',
        }}
        {...(html
          ? {
              dangerouslySetInnerHTML: {
                __html:
                  text ||
                  'Refined aromatics with exceptional tension and a lingering finish.',
              },
            }
          : { children: text })}
      />
    </div>
  );
}
