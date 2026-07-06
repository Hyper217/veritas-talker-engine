/**
 * TemplateGallery.tsx
 * Template picker — sidebar panel (desktop) or modal (optional).
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { TEMPLATE_LIST } from '../lib/templates';
import { PREVIEW_PRODUCT, PREVIEW_SETTINGS } from '../lib/previewSample';
import ShelfTalker from './ShelfTalker';
import type { TemplateId } from '../types';

interface PickerProps {
  currentId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onClose: () => void;
  compact?: boolean;
}

/** Reusable template grid — used in sidebar panel and modal */
export function TemplatePicker({ currentId, onSelect, onClose, compact = false }: PickerProps) {
  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8 shrink-0">
        <div>
          <h3 className="text-white text-sm font-bold">Shelf Talker Styles</h3>
          <p className="text-white/40 text-xs">{TEMPLATE_LIST.length} templates</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
          {TEMPLATE_LIST.map((tmpl) => {
            const isSelected = tmpl.id === currentId;
            return (
              <motion.button
                key={tmpl.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onSelect(tmpl.id); onClose(); }}
                className={`relative rounded-xl overflow-hidden text-left focus:outline-none transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.35)]'
                    : 'ring-1 ring-white/10 hover:ring-white/30'
                }`}
              >
                <div className="aspect-[3/4] bg-zinc-900 pointer-events-none">
                  <ShelfTalker
                    product={PREVIEW_PRODUCT}
                    settings={{ ...PREVIEW_SETTINGS, templateId: tmpl.id }}
                  />
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2 py-2">
                  <p className="text-white text-[10px] font-bold leading-tight">{tmpl.label}</p>
                  {!compact && (
                    <p className="text-white/60 text-[9px] leading-tight mt-0.5 line-clamp-1">{tmpl.description}</p>
                  )}
                </div>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-black" strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface ModalProps {
  currentId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onClose: () => void;
}

/** Full-screen modal fallback (mobile / preview shortcut) */
export default function TemplateGallery({ currentId, onSelect, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="gallery-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="gallery-panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <TemplatePicker currentId={currentId} onSelect={onSelect} onClose={onClose} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
