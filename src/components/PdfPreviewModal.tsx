/**
 * Letter-size preview of the print PDF.
 * Print opens the system dialog; the Canon driver profile is not set from the page.
 */

import { Download, Printer, X } from 'lucide-react';

interface Props {
  url: string;
  filename: string;
  talkerCount: number;
  pages: string[];
  onClose: () => void;
}

export default function PdfPreviewModal({ url, filename, talkerCount, pages, onClose }: Props) {
  const handlePrint = () => {
    const win = window.open(url, '_blank');
    if (!win) return;
    window.setTimeout(() => {
      win.focus();
      win.print();
    }, 600);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-3xl h-[min(92vh,900px)] bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-white/10">
          <div className="min-w-0">
            <h2 className="text-white text-sm font-bold">Print preview</h2>
            <p className="text-white/45 text-xs mt-0.5">
              {talkerCount} talker{talkerCount === 1 ? '' : 's'} · {pages.length} sheet{pages.length === 1 ? '' : 's'} · US Letter · portrait · actual size
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10"
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#111] p-4 space-y-4">
          {pages.map((page, index) => (
            <img
              key={index}
              src={page}
              alt={`Letter sheet ${index + 1}`}
              className="mx-auto w-full max-w-[520px] bg-white shadow-lg"
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-t border-white/10">
          <p className="flex-1 text-white/45 text-[11px] leading-relaxed">
            In the print dialog, open Print using system dialog, then choose the Canon copier and the SHELF TALKERS profile. Nothing prints until you confirm there.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#E8C94A]"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
