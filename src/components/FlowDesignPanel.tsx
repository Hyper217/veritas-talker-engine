import { useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Trash2, ExternalLink, Sparkles, Check } from 'lucide-react';
import { FlowDesign } from '../types';
import FlowLayoutEditor from './FlowLayoutEditor';

const FLOW_URL = 'https://labs.google/fx/tools/flow';

interface Props {
  designs: FlowDesign[];
  activeDesignId?: string;
  onImport: (file: File) => void;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FlowDesign>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onUseLayout: () => void;
}

export default function FlowDesignPanel({
  designs,
  activeDesignId,
  onImport,
  onSelect,
  onUpdate,
  onDelete,
  onClose,
  onUseLayout,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const activeDesign = designs.find((d) => d.id === activeDesignId);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="absolute left-20 inset-y-0 w-96 bg-white border-r border-editorial-border z-40 flex flex-col shadow-2xl"
    >
      <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gradient-to-br from-violet-50 to-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Imported Designs</h2>
          </div>
          <p className="text-[10px] text-stone-500 leading-relaxed max-w-[260px]">
            PNG/JPG artwork you export from{' '}
            <a href={FLOW_URL} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
              Google Flow
            </a>
            . Any style — rustic, minimal, colorful, noir, etc. The app places wine data on top.
          </p>
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-black shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-stone-100 space-y-3">
        <a
          href={FLOW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-violet-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Google Flow
        </a>

        <label className="cursor-pointer block">
          <div className="flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-violet-200 rounded text-[10px] font-bold uppercase tracking-widest text-violet-600 hover:border-violet-400 hover:bg-violet-50/50 transition-all">
            <Upload className="w-3.5 h-3.5" />
            Import from Google Flow (PNG/JPG)
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              if (fileRef.current) fileRef.current.value = '';
            }}
          />
        </label>

        {activeDesign && (
          <div className="pt-2 space-y-2 border-t border-stone-100">
            <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
              Text colors for “{activeDesign.name}”
            </p>
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="text-[8px] uppercase text-stone-400 font-bold">Main text</span>
                <input
                  type="color"
                  value={activeDesign.textColor ?? '#111827'}
                  onChange={(e) => onUpdate(activeDesign.id, { textColor: e.target.value })}
                  className="w-full h-8 rounded border border-stone-200 cursor-pointer"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[8px] uppercase text-stone-400 font-bold">Accent / tags</span>
                <input
                  type="color"
                  value={activeDesign.accentColor ?? '#111827'}
                  onChange={(e) => onUpdate(activeDesign.id, { accentColor: e.target.value })}
                  className="w-full h-8 rounded border border-stone-200 cursor-pointer"
                />
              </label>
            </div>
            <p className="text-[8px] text-stone-400 leading-relaxed">
              Tune these so wine text reads clearly on your Flow artwork.
            </p>
            <FlowLayoutEditor
              design={activeDesign}
              onUpdate={(updates) => onUpdate(activeDesign.id, updates)}
            />
          </div>
        )}

        <details className="text-[9px] text-stone-500 leading-relaxed">
          <summary className="cursor-pointer font-bold uppercase tracking-wider text-stone-400 hover:text-violet-600">
            How to export from Flow
          </summary>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside pl-1">
            <li>In Flow, set aspect ratio to <strong>3:4</strong> portrait (not 9:16)</li>
            <li>Leave open areas for bottle photo and wine text, or design fully in Flow</li>
            <li>Download as PNG from your Flow project</li>
            <li>Import here and adjust text colors if needed</li>
          </ol>
        </details>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {designs.length > 0 ? (
          designs.map((design) => {
            const isActive = design.id === activeDesignId;
            return (
              <div
                key={design.id}
                className={`group relative rounded-lg border overflow-hidden transition-all cursor-pointer ${
                  isActive ? 'border-violet-500 ring-2 ring-violet-200' : 'border-stone-100 hover:border-stone-300'
                }`}
                onClick={() => {
                  onSelect(design.id);
                  onUseLayout();
                }}
              >
                <div className="aspect-[4/5] bg-stone-100 relative">
                  <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover" />
                  {isActive && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between bg-white">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">{design.name}</p>
                    <p className="text-[9px] text-stone-400">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(design.id);
                    }}
                    className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete design"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Sparkles className="w-10 h-10 text-violet-100 mb-4" />
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-loose">
              No imports yet
              <br />
              <span className="text-[10px] font-normal normal-case tracking-normal text-stone-300">
                Design in Google Flow, export PNG, import here
              </span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
