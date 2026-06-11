import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats Dropbox URLs for direct file access (required for PDF image capture)
 */
export function formatDropboxUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  if (url.includes('dropbox.com') || url.includes('dropboxusercontent.com')) {
    let formatted = url.replace('?dl=0', '?raw=1').replace('&dl=0', '&raw=1');
    if (!formatted.includes('raw=1') && !formatted.includes('dl=1')) {
      formatted += formatted.includes('?') ? '&raw=1' : '?raw=1';
    }
    return formatted.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }

  return url;
}

/**
 * Letter size dimensions in mm (standard for jsPDF)
 */
export const LETTER_WIDTH = 215.9; // 8.5 inches
export const LETTER_HEIGHT = 279.4; // 11 inches

/**
 * Talker dimensions in inches for reference (4x5)
 */
export const TALKER_WIDTH_IN = 4;
export const TALKER_HEIGHT_IN = 5;
