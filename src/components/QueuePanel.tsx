/**
 * QueuePanel.tsx
 * Print queue — list of products staged for PDF export.
 */

import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Printer, Trash2, GripVertical, Wine } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  queue: Product[];
  onReorder: (queue: Product[]) => void;
  onRemove: (id: string) => void;
  onLoadItem: (product: Product) => void;
  onGeneratePdf: () => void;
  isGenerating: boolean;
}

export default function QueuePanel({
  queue, onReorder, onRemove, onLoadItem, onGeneratePdf, isGenerating,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-sm font-bold">Print Queue</h3>
            <p className="text-white/40 text-xs mt-0.5">
              {queue.length === 0 ? 'No items yet' : `${queue.length} talker${queue.length === 1 ? '' : 's'}`}
            </p>
          </div>
          {queue.length > 0 && (
            <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-black flex items-center justify-center">
              {queue.length}
            </span>
          )}
        </div>
      </div>

      {/* Queue items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Wine className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-white/30 text-xs leading-relaxed">
              Search the <strong className="text-white/50">Catalog</strong> and tap <strong className="text-white/50">+</strong> to stage talkers,<br />
              or fill in the form and click <strong className="text-white/50">Add to Queue</strong>
            </p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={queue}
            onReorder={onReorder}
            className="space-y-1.5"
          >
            <AnimatePresence>
              {queue.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group flex items-center gap-2 bg-white/5 hover:bg-white/8 rounded-lg px-2 py-2.5 cursor-default transition-colors"
                >
                  {/* Drag handle */}
                  <GripVertical className="w-3.5 h-3.5 text-white/20 shrink-0 cursor-grab active:cursor-grabbing" />

                  {/* Info */}
                  <button
                    type="button"
                    onClick={() => onLoadItem(item)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-white text-xs font-semibold truncate leading-tight">
                      {item.producer || 'Unnamed'}
                    </p>
                    <p className="text-white/40 text-[10px] truncate leading-tight mt-0.5">
                      {[item.name, item.vintage].filter(Boolean).join(' · ') || 'No details'}
                    </p>
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>

      {/* Print button */}
      <div className="p-3 border-t border-white/8">
        <motion.button
          whileHover={queue.length > 0 ? { scale: 1.02 } : {}}
          whileTap={queue.length > 0 ? { scale: 0.98 } : {}}
          onClick={onGeneratePdf}
          disabled={queue.length === 0 || isGenerating}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            queue.length === 0
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : isGenerating
              ? 'bg-[#D4AF37]/60 text-black/60 cursor-wait'
              : 'bg-[#D4AF37] text-black hover:bg-[#E8C94A] shadow-[0_4px_24px_rgba(212,175,55,0.35)]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Generating PDF…
            </>
          ) : (
            <>
              <Printer className="w-4 h-4" />
              Export PDF
              {queue.length > 0 && ` (${queue.length})`}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
