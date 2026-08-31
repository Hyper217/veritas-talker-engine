import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { TemplateId } from '../types';
import { getGridPositions, getTalkerDimensions } from './talkerDimensions';

const CAPTURE_SCALE = 3;

function fixOklchColors(clonedDoc: Document) {
  const elements = clonedDoc.getElementsByTagName('*');
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i] as HTMLElement;
    const style = window.getComputedStyle(el);

    el.style.fontFamily = style.fontFamily;
    el.style.fontWeight = style.fontWeight;
    el.style.fontSize = style.fontSize;
    el.style.letterSpacing = style.letterSpacing;

    if (style.color.includes('okl')) el.style.color = '#111827';
    if (style.backgroundColor.includes('okl')) {
      el.style.backgroundColor = style.backgroundColor.includes('transparent')
        ? 'transparent'
        : '#ffffff';
    }
    if (style.borderColor.includes('okl')) el.style.borderColor = '#000000';
  }
}

/** Crop or pad canvas to an exact pixel size without stretching content */
export function normalizeCanvas(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const normalized = document.createElement('canvas');
  normalized.width = targetWidth;
  normalized.height = targetHeight;
  const ctx = normalized.getContext('2d');
  if (!ctx) return source;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  const srcAspect = source.width / source.height;
  const dstAspect = targetWidth / targetHeight;

  let sx = 0;
  let sy = 0;
  let sw = source.width;
  let sh = source.height;

  if (Math.abs(srcAspect - dstAspect) > 0.005) {
    if (srcAspect > dstAspect) {
      sw = source.height * dstAspect;
      sx = (source.width - sw) / 2;
    } else {
      sh = source.width / dstAspect;
      sy = (source.height - sh) / 2;
    }
  }

  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  return normalized;
}

export async function waitForElementReady(
  container: HTMLElement,
  timeoutMs = 10000
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    const images = Array.from(container.getElementsByTagName('img'));
    const imagesReady =
      images.length === 0 ||
      images.every((img) => img.complete && (img.naturalHeight > 0 || img.src.startsWith('data:')));

    const autosizeEls = Array.from(container.querySelectorAll('[data-autosize]'));
    const autosizeReady =
      autosizeEls.length === 0 ||
      autosizeEls.every((el) => el.getAttribute('data-autosize-ready') === 'true');

    if (imagesReady && autosizeReady) {
      await new Promise((r) => setTimeout(r, 150));
      return;
    }

    await new Promise((r) => setTimeout(r, 50));
  }
}

export async function captureTalkerElement(
  container: HTMLElement,
  widthPx: number,
  heightPx: number
): Promise<HTMLCanvasElement> {
  const talkerEl =
    (container.querySelector('.shelf-talker-root') as HTMLElement | null) ?? container;

  talkerEl.style.width = `${widthPx}px`;
  talkerEl.style.height = `${heightPx}px`;
  talkerEl.style.boxShadow = 'none';

  const rawCanvas = await html2canvas(talkerEl, {
    scale: CAPTURE_SCALE,
    width: widthPx,
    height: heightPx,
    windowWidth: widthPx,
    windowHeight: heightPx,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => fixOklchColors(clonedDoc),
  });

  return normalizeCanvas(
    rawCanvas,
    widthPx * CAPTURE_SCALE,
    heightPx * CAPTURE_SCALE
  );
}

export function buildPdfFromCanvases(
  canvases: HTMLCanvasElement[],
  layout: TemplateId | string
): jsPDF {
  const { widthMm, heightMm } = getTalkerDimensions(layout);
  const positions = getGridPositions(layout);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  for (let i = 0; i < canvases.length; i++) {
    const posIdx = i % 4;
    if (i > 0 && posIdx === 0) {
      pdf.addPage();
    }

    const { x, y } = positions[posIdx];
    const imgData = canvases[i].toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', x, y, widthMm, heightMm, undefined, 'SLOW');
  }

  return pdf;
}

export function getPageCount(itemCount: number): number {
  return Math.max(1, Math.ceil(itemCount / 4));
}
