import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Printer, Trash2, Download, Wine, LayoutGrid, Settings as SettingsIcon, X, Search, Gem, CheckSquare, Square, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, AppSettings } from './types';
import ShelfTalker from './components/ShelfTalker';
import RichTextEditor from './components/RichTextEditor';
import Toast, { ToastMessage } from './components/Toast';
import { formatDropboxUrl } from './lib/utils';
import { getTalkerDimensions } from './lib/talkerDimensions';
import {
  buildPdfFromCanvases,
  captureTalkerElement,
  getPageCount,
  waitForElementReady,
} from './lib/pdf';
import { APP_VERSION } from './version';

const INITIAL_SETTINGS: AppSettings = {
  defaultLogoUrl: '',
  defaultTags: ['ORGANIC', 'NATIVE FERMENTS', 'UNFILTERED'],
  designLayout: 'royal-dark',
  royalDarkColor: '#D4AF37',
};

function migrateSettings(raw: Partial<AppSettings>): AppSettings {
  const layout = ((raw.designLayout as any) === 'flow-custom' || raw.designLayout === 'flow-art-deco') 
    ? 'flow-art-deco' 
    : 'royal-dark';
  return {
    defaultLogoUrl: raw.defaultLogoUrl ?? '',
    defaultTags: raw.defaultTags ?? INITIAL_SETTINGS.defaultTags,
    designLayout: layout,
    royalDarkColor: raw.royalDarkColor ?? '#D4AF37',
  };
}

const INITIAL_PRODUCT: Product = {
  id: crypto.randomUUID(),
  producer: '',
  name: '',
  vintage: new Date().getFullYear().toString(),
  region: '',
  score: null,
  reviewer: '',
  description: '',
  tags: [],
  dropboxImageUrl: '',
  logoUrl: '',
};

export default function App() {
  const [product, setProduct] = useState<Product>(INITIAL_PRODUCT);
  const [queue, setQueue] = useState<Product[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printItem, setPrintItem] = useState<Product | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<Set<string>>(new Set());
  const [catalogSelectMode, setCatalogSelectMode] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('veritas_settings');
    if (!saved) return INITIAL_SETTINGS;
    try {
      return migrateSettings(JSON.parse(saved));
    } catch {
      return INITIAL_SETTINGS;
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalog, setCatalog] = useState<Product[]>(() => {
    const saved = localStorage.getItem('veritas_catalog');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredCatalog = useMemo(() => {
    if (!catalogSearch.trim()) return catalog;
    const s = catalogSearch.toLowerCase();
    return catalog.filter(p => 
      p.producer.toLowerCase().includes(s) || 
      p.name.toLowerCase().includes(s) || 
      p.region.toLowerCase().includes(s)
    );
  }, [catalog, catalogSearch]);



  useEffect(() => {
    if (settings.defaultTags.length > 0 && product.tags.length === 0 && tagInput === '') {
      setProduct(prev => ({ ...prev, tags: settings.defaultTags }));
      setTagInput(settings.defaultTags.join(', '));
    }
  }, [settings.defaultTags, product.tags.length, tagInput]);

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const waitForRender = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('veritas_settings', JSON.stringify(newSettings));
  };

  const handleAddToQueue = () => {
    setQueue([...queue, { ...product, id: crypto.randomUUID() }]);
    // We don't reset everything, just maybe the name/vintage so they can add another
  };

  const removeFromQueue = (id: string) => {
    setQueue(queue.filter((p) => p.id !== id));
  };

  const [sessions, setSessions] = useState<{id: string, name: string, items: Product[]}[]>(() => {
    const saved = localStorage.getItem('veritas_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveSession = () => {
    if (queue.length === 0) return;
    const name = `Batch ${sessions.length + 1} - ${new Date().toLocaleDateString()}`;
    const newSessions = [...sessions, { id: crypto.randomUUID(), name, items: [...queue] }];
    setSessions(newSessions);
    localStorage.setItem('veritas_sessions', JSON.stringify(newSessions));
    showToast('Batch saved to history');
  };

  const handleLoadSession = (items: Product[]) => {
    setQueue([...items]);
  };

  const handleRestart = () => {
    if (confirm('Clear current workspace? This will reset the editor and empty the print queue. Your catalog and saved batches will remain intact.')) {
      setQueue([]);
      setProduct({
        ...INITIAL_PRODUCT,
        id: crypto.randomUUID(),
        tags: settings.defaultTags 
      });
      setTagInput(settings.defaultTags.join(', '));
    }
  };

  const handleGeneratePdf = async () => {
    if (queue.length === 0) return;
    setIsGenerating(true);

    try {
      const dims = getTalkerDimensions(settings.designLayout);
      const canvases: HTMLCanvasElement[] = [];

      for (const item of queue) {
        setPrintItem(item);
        await waitForRender();

        const printZone = document.getElementById('print-zone');
        const printTarget = document.getElementById('print-target');
        if (!printZone || !printTarget) continue;

        await waitForElementReady(printZone);
        const canvas = await captureTalkerElement(
          printTarget,
          dims.widthPx,
          dims.heightPx
        );
        canvases.push(canvas);
      }

      setPrintItem(null);

      if (canvases.length === 0) {
        showToast('Nothing captured — check that images loaded correctly.', 'error');
        return;
      }

      const pdf = buildPdfFromCanvases(canvases, settings.designLayout);
      const pages = getPageCount(queue.length);
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`veritas-shelf-talkers-${date}.pdf`);
      showToast(`PDF ready — ${queue.length} talker${queue.length === 1 ? '' : 's'} across ${pages} page${pages === 1 ? '' : 's'}`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      showToast('PDF generation failed. Try using local images or Dropbox raw links.', 'error');
    } finally {
      setPrintItem(null);
      setIsGenerating(false);
    }
  };

  const toggleCatalogSelection = (id: string) => {
    setSelectedCatalogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addSelectedToQueue = () => {
    const selected = catalog.filter((p) => selectedCatalogIds.has(p.id));
    if (selected.length === 0) return;
    setQueue((prev) => [
      ...prev,
      ...selected.map((p) => ({ ...p, id: crypto.randomUUID() })),
    ]);
    setSelectedCatalogIds(new Set());
    setCatalogSelectMode(false);
    showToast(`Added ${selected.length} wine${selected.length === 1 ? '' : 's'} to print queue`);
  };

  const addToCatalog = () => {
    const updatedCatalog = [...catalog, { ...product, id: crypto.randomUUID() }];
    setCatalog(updatedCatalog);
    localStorage.setItem('veritas_catalog', JSON.stringify(updatedCatalog));
    showToast('Wine saved to catalog');
  };

  const removeFromCatalog = (id: string) => {
    setCatalog(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('veritas_catalog', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="flex h-screen w-full bg-deep-grass overflow-hidden font-sans">
      {/* Sessions Sidebar (Far Left) */}
      <aside className="w-20 h-full flex flex-col bg-periwinkle border-r border-periwinkle/20 items-center py-6 gap-6 shrink-0 z-30 relative overflow-y-auto custom-scrollbar">
        <div className="absolute inset-0 bg-grain opacity-[0.05] pointer-events-none" />
        <div className="w-10 h-10 bg-vibrant-blue rounded-lg flex items-center justify-center mb-4 shrink-0 relative z-10 shadow-lg">
          <Wine className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex flex-col gap-4 flex-1 items-center w-full">
          <button 
            onClick={() => { setShowSettings(false); setShowCatalog(!showCatalog); }}
            title="Wine Catalog"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 relative z-10 ${showCatalog ? 'bg-vibrant-blue text-white shadow-xl scale-110' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <Database className="w-5 h-5" />
          </button>

          <button 
            onClick={() => { setShowCatalog(false); setShowSettings(true); }}
            title="App Settings"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 relative z-10 ${showSettings ? 'bg-vibrant-blue text-white shadow-xl scale-110' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          <div className="w-12 h-[1px] bg-white/20 mx-auto shrink-0 relative z-10" />

          <button 
            onClick={handleSaveSession}
            title="Save Session"
            disabled={queue.length === 0}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0 disabled:opacity-20 relative z-10"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-[1px] bg-white/20 mx-auto shrink-0 relative z-10" />

          {/* Design selector — Noir + Art Deco presets */}
          <div className="flex flex-col gap-3 shrink-0 relative z-10">
            <h3 className="text-[8px] text-white/40 uppercase font-black text-center mb-1 tracking-widest leading-tight">Style</h3>
            <button
              onClick={() => handleSaveSettings({ ...settings, designLayout: 'royal-dark' })}
              title="Noir — Black & Gold"
              className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${settings.designLayout === 'royal-dark' ? 'bg-vibrant-blue text-white border-vibrant-blue shadow-lg' : 'bg-white/10 text-white/40 border-transparent hover:border-white/20'}`}
            >
              <Gem className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSaveSettings({ ...settings, designLayout: 'flow-art-deco' })}
              title="Art Deco Layout"
              className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${settings.designLayout === 'flow-art-deco' ? 'bg-violet-500 text-white border-violet-500 shadow-lg' : 'bg-white/10 text-white/40 border-transparent hover:border-white/20'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {settings.designLayout === 'royal-dark' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-2 relative z-10 w-full px-2 pt-2"
              >
                <h3 className="text-[8px] text-white/40 uppercase font-black text-center mb-1 tracking-widest">Gold Accent</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { name: 'Gold', color: '#D4AF37' },
                    { name: 'Royal Blue', color: '#3d5afe' },
                    { name: 'Emerald', color: '#10b981' },
                    { name: 'Crimson', color: '#dc2626' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => handleSaveSettings({...settings, royalDarkColor: c.color})}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${settings.royalDarkColor === c.color || (!settings.royalDarkColor && c.color === '#D4AF37') ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/20 hover:scale-105'}`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="w-12 h-[1px] bg-white/20 mx-auto relative z-10" />
          
          <div className="flex flex-col gap-3 shrink-0 relative z-10 w-full px-2">
            <h3 className="text-[8px] text-white/40 uppercase font-black text-center mb-1 tracking-widest">History</h3>
            {sessions.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleLoadSession(s.items)}
                title={s.name}
                className="w-12 h-12 rounded-md bg-periwinkle/30 border border-periwinkle/20 flex flex-col items-center justify-center text-[10px] font-bold text-white hover:bg-periwinkle/50 hover:border-white/30 transition-all group relative shrink-0"
              >
                <span>#{idx + 1}</span>
                <span className="text-[7px] opacity-0 group-hover:opacity-100 absolute -bottom-5 bg-black text-white p-1 rounded whitespace-nowrap z-50 pointer-events-none">Load</span>
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleRestart}
          title="Reset Workspace"
          className="w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-transparent transition-all mt-auto shrink-0 relative z-10 group"
        >
          <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
        <p className="text-[9px] text-white/35 font-bold uppercase tracking-widest shrink-0 relative z-10 pb-1">
          v{APP_VERSION}
        </p>
      </aside>

      {/* Editor Sidebar */}
      <aside className="w-[340px] h-full flex flex-col bg-pale-mint border-r border-editorial-border shrink-0 z-20 relative">
        <div className="absolute inset-0 bg-grain opacity-[0.02] pointer-events-none" />
        <div className="p-6 border-b border-gray-100 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
              <Wine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black italic tracking-tight">Veritas Engine</h1>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-none mt-1">Build v{APP_VERSION}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Form Fields */}
          <section className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Producer</label>
                <span className="text-[9px] text-blue-500 font-medium font-serif italic">Serif Display</span>
              </div>
              <input 
                type="text"
                placeholder="PRODUCER NAME"
                value={product.producer}
                onChange={e => setProduct({...product, producer: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all font-serif font-black uppercase"
              />
            </div>

            <div className="grid grid-cols-[1fr_80px] gap-3">
               <div className="space-y-1">
                 <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Wine Name</label>
                 <input 
                   type="text"
                   placeholder="e.g. Pinot Noir 'Freedom Hill'"
                   value={product.name}
                   onChange={e => setProduct({...product, name: e.target.value})}
                   className="w-full bg-white border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black font-serif italic"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Vintage</label>
                 <input 
                   type="text"
                   placeholder="2026"
                   value={product.vintage}
                   onChange={e => setProduct({...product, vintage: e.target.value})}
                   className="w-full bg-white border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black font-serif tracking-tighter"
                 />
               </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Region</label>
              <input 
                type="text"
                placeholder="Region, Country"
                value={product.region}
                onChange={e => setProduct({...product, region: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black uppercase tracking-wider text-[11px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Score</label>
                <input 
                  type="number"
                  placeholder="94"
                  value={product.score || ''}
                  onChange={e => setProduct({...product, score: e.target.value ? Number(e.target.value) : null})}
                  className="w-full bg-white border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Reviewer</label>
                <input 
                  type="text"
                  placeholder="Vinous"
                  value={product.reviewer}
                  onChange={e => setProduct({...product, reviewer: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Product Image (Dropbox)</label>
                <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Sync Active</span>
              </div>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/30'); }}
                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30'); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30');
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setProduct({ ...product, dropboxImageUrl: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="group relative h-24 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center transition-all hover:border-blue-200 cursor-pointer overflow-hidden"
              >
                {product.dropboxImageUrl ? (
                  <>
                    <img 
                      src={formatDropboxUrl(product.dropboxImageUrl)} 
                      className="h-full w-full object-contain p-2" 
                      alt="Preview" 
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setProduct({...product, dropboxImageUrl: ''}); }}
                      className="absolute top-1 right-1 p-1 bg-white/80 rounded-full shadow-sm text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Download className="w-5 h-5 text-gray-300" />
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center px-4">
                      Drag Dropbox File Here<br/>or paste link below
                    </span>
                  </div>
                )}
              </div>

              <input 
                type="text"
                placeholder="Share link (optional)..."
                value={product.dropboxImageUrl.startsWith('data:') ? '' : product.dropboxImageUrl}
                onChange={e => setProduct({...product, dropboxImageUrl: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded p-2.5 text-[11px] text-blue-600 truncate focus:outline-none focus:ring-1 focus:ring-black mt-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Collaborator Logo (Dropbox)</label>
                <LayoutGrid className="w-3 h-3 text-gray-300" />
              </div>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/30'); }}
                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30'); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30');
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setProduct({ ...product, logoUrl: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="group relative h-20 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center transition-all hover:border-blue-200 cursor-pointer overflow-hidden"
              >
                {product.logoUrl ? (
                  <>
                    <img 
                      src={product.logoUrl.startsWith('data:') ? product.logoUrl : formatDropboxUrl(product.logoUrl)} 
                      className="h-full w-full object-contain p-2" 
                      alt="Logo Preview" 
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setProduct({...product, logoUrl: ''}); }}
                      className="absolute top-1 right-1 p-1 bg-white/80 rounded-full shadow-sm text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Download className="w-4 h-4 text-gray-300" />
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center px-4">
                      Drag Logo Here
                    </span>
                  </div>
                )}
              </div>

              <input 
                type="text"
                placeholder="Logo share link (optional)..."
                value={product.logoUrl.startsWith('data:') ? '' : product.logoUrl}
                onChange={e => setProduct({...product, logoUrl: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded p-2.5 text-[11px] text-blue-600 truncate focus:outline-none focus:ring-1 focus:ring-black mt-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Editorial Review</label>
              <RichTextEditor 
                content={product.description}
                onChange={val => setProduct({...product, description: val})}
              />
              <p className="text-[9px] text-gray-400 italic mt-1">Highlighter and bold included for emphasis.</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Tags</label>
              <input 
                type="text"
                placeholder="Organic, Low Intervention..."
                value={tagInput}
                onChange={e => {
                  setTagInput(e.target.value);
                  setProduct({...product, tags: e.target.value.split(',').filter(t => t.trim() !== '')});
                }}
                className="w-full bg-white border border-gray-200 rounded p-2.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </section>

          <button 
            onClick={addToCatalog}
            className="w-full py-2 text-[10px] uppercase tracking-widest font-bold text-vibrant-blue hover:text-electric-purple transition-colors flex items-center justify-center gap-2 mb-2"
          >
            <Database className="w-3 h-3" />
            Save to Catalog
          </button>

          <button 
            onClick={handleAddToQueue}
            className="w-full py-4 bg-periwinkle border border-periwinkle rounded text-xs uppercase tracking-widest font-bold text-white hover:bg-periwinkle/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add to Queue
          </button>

          {/* Active Queue List */}
          {queue.length > 0 && (
            <div className="pt-8 space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Current Queue</h3>
                <span className="text-[9px] text-gray-400">{queue.length} items</span>
              </div>
              <div className="space-y-2">
                {queue.map((item, idx) => (
                  <div key={item.id} className="group flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100 relative">
                    <div className="w-8 h-10 bg-white border border-gray-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                      {item.dropboxImageUrl ? (
                        <img src={formatDropboxUrl(item.dropboxImageUrl)} className="h-full object-contain" />
                      ) : (
                        <Wine className="w-3 h-3 text-gray-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold truncate uppercase">{item.producer || 'Unnamed'}</p>
                      <p className="text-[9px] font-serif italic text-gray-500 truncate">{item.name}</p>
                    </div>
                    <button 
                      onClick={() => removeFromQueue(item.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-periwinkle/5 border-t border-periwinkle/10">
          <button
            onClick={handleGeneratePdf}
            disabled={queue.length === 0 || isGenerating}
            className="w-full py-4 bg-vibrant-blue text-white text-xs font-bold tracking-widest uppercase hover:bg-electric-purple disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95"
          >
            {isGenerating ? `Rendering ${printItem ? queue.findIndex(q => q.id === printItem.id) + 1 : 0}/${queue.length}...` : 'Generate Print PDF'}
          </button>
        </div>
      </aside>

      {/* Main Preview Canvas */}
      <main className="flex-1 bg-preview-canvas relative flex flex-col overflow-hidden">
        {/* Shading Overlays */}
        <div className="absolute inset-0 bg-grain z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] z-0 pointer-events-none" />

        <section className="flex-1 flex items-center justify-center p-12 overflow-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <ShelfTalker product={product} settings={settings} />
          </motion.div>
        </section>

        {/* Design Modals */}
        <AnimatePresence>
          {showCatalog && (
            <motion.div 
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -100, opacity: 0 }}
               className="absolute left-20 inset-y-0 w-80 bg-white border-r border-editorial-border z-40 flex flex-col shadow-2xl"
            >
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-stone-50">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Wine Catalog</h2>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{catalog.length} Items Total</p>
                  </div>
                  <button onClick={() => setShowCatalog(false)} className="text-stone-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="p-4 border-b border-stone-100 flex flex-col gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-periwinkle/50" />
                    <input 
                      type="text"
                      placeholder="Search catalog..."
                      value={catalogSearch}
                      onChange={e => setCatalogSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-vibrant-blue"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCatalogSelectMode(!catalogSelectMode);
                        setSelectedCatalogIds(new Set());
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                        catalogSelectMode
                          ? 'bg-vibrant-blue text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {catalogSelectMode ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      Select Multiple
                    </button>
                    {catalogSelectMode && selectedCatalogIds.size > 0 && (
                      <button
                        onClick={addSelectedToQueue}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-black text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                      >
                        <Printer className="w-3 h-3" />
                        Add {selectedCatalogIds.size}
                      </button>
                    )}
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {filteredCatalog.length > 0 ? (
                    filteredCatalog.map(item => (
                      <div 
                        key={item.id} 
                        className={`group p-3 bg-white border rounded-lg transition-all cursor-pointer relative ${
                          selectedCatalogIds.has(item.id)
                            ? 'border-vibrant-blue bg-blue-50/30'
                            : 'border-stone-100 hover:border-black'
                        }`}
                        onClick={() => {
                          if (catalogSelectMode) {
                            toggleCatalogSelection(item.id);
                            return;
                          }
                          setProduct({ ...item, id: crypto.randomUUID() });
                          setTagInput(item.tags.join(', '));
                          setShowCatalog(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {catalogSelectMode && (
                            <div className="pt-1 shrink-0">
                              {selectedCatalogIds.has(item.id) ? (
                                <CheckSquare className="w-4 h-4 text-vibrant-blue" />
                              ) : (
                                <Square className="w-4 h-4 text-stone-300" />
                              )}
                            </div>
                          )}
                          <div className="w-10 h-12 bg-stone-50 rounded flex items-center justify-center shrink-0">
                            {item.dropboxImageUrl ? (
                              <img src={formatDropboxUrl(item.dropboxImageUrl)} className="h-full object-contain" alt="Bottle" />
                            ) : (
                              <Wine className="w-4 h-4 text-stone-200" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-black uppercase text-stone-900 truncate leading-tight">{item.producer}</h4>
                            <p className="text-[10px] font-serif italic text-stone-500 truncate">{item.name} {item.vintage}</p>
                            <div className="flex items-center gap-2 mt-1">
                               {item.score && (
                                 <span className="text-[8px] font-black text-white bg-slate-900 px-1 rounded">{item.score}</span>
                               )}
                               <span className="text-[8px] font-bold text-stone-300 uppercase tracking-tight truncate">{item.region}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setQueue([...queue, { ...item, id: crypto.randomUUID() }]);
                              }}
                              className="bg-stone-100 p-2 rounded-full text-stone-600 transition-all hover:bg-black hover:text-white"
                              title="Add to Print Queue"
                            >
                               <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCatalog(item.id);
                              }}
                              className="bg-red-50 p-2 rounded-full text-red-600 transition-all hover:bg-red-500 hover:text-white"
                              title="Delete from Catalog"
                            >
                               <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center p-8">
                       <Wine className="w-10 h-10 text-stone-100 mb-4" />
                       <p className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-loose">
                         Catalog Empty<br/>
                         <span className="text-[10px] font-medium lowercase tracking-normal text-stone-300 italic">
                           Save wines from the editor to populate your catalog.
                         </span>
                       </p>
                     </div>
                  )}
               </div>
            </motion.div>
          )}

          {showSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
              onClick={() => setShowSettings(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Application Settings</h2>
                  <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Default Logo */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Default Collaborator Logo (Dropbox Link)</label>
                    <div 
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/30'); }}
                      onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30'); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handleSaveSettings({ ...settings, defaultLogoUrl: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="h-32 border-2 border-dashed border-gray-100 rounded flex items-center justify-center overflow-hidden hover:border-blue-200 cursor-pointer"
                    >
                      {settings.defaultLogoUrl ? (
                         <img 
                           src={settings.defaultLogoUrl.startsWith('data:') ? settings.defaultLogoUrl : formatDropboxUrl(settings.defaultLogoUrl)} 
                           className="h-full object-contain p-2"
                         />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-300">
                          <Download className="w-6 h-6" />
                          <span className="text-[9px] uppercase font-bold tracking-widest">Drop Master Logo</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="text"
                      placeholder="Paste Dropbox link..."
                      value={settings.defaultLogoUrl.startsWith('data:') ? '' : settings.defaultLogoUrl}
                      onChange={e => handleSaveSettings({...settings, defaultLogoUrl: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded p-2 text-[11px] text-blue-600 truncate focus:outline-none"
                    />
                  </div>

                  {/* Default Tags */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Default Shelf Tags</label>
                    <input 
                      type="text"
                      placeholder="ORGANIC, UNFILTERED..."
                      value={settings.defaultTags.join(', ')}
                      onChange={e => handleSaveSettings({...settings, defaultTags: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded p-2 text-[11px] focus:outline-none"
                    />
                    <p className="text-[9px] text-gray-400 italic">These tags will populate automatically for new items.</p>
                  </div>


                </div>

                <div className="bg-slate-50 p-6 border-t border-gray-100 mt-4 flex justify-end">
                   <button 
                     onClick={() => setShowSettings(false)}
                     className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-all"
                   >
                     Done
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}


        </AnimatePresence>

        {/* Queue Preview Overlay */}
        <AnimatePresence>
          {queue.length > 0 && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="absolute bottom-8 right-8 z-20 flex gap-4"
            >
              <div className="p-4 bg-white border border-editorial-border rounded shadow-xl flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-gray-400">Print Layout</p>
                  <p className="text-xs font-serif italic text-gray-800">
                    {queue.length} talker{queue.length === 1 ? '' : 's'} · {getPageCount(queue.length)} sheet{getPageCount(queue.length) === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center text-[10px] font-bold">
                  {queue.length % 4 || 4}/4
                </div>
                <button 
                  onClick={() => setQueue([])}
                  title="Clear Queue"
                  className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Off-screen but in-layout container for reliable PDF capture */}
      <div
        id="print-zone"
        className="fixed left-0 top-0 -z-50 opacity-0 pointer-events-none overflow-hidden"
        style={{
          width: getTalkerDimensions(settings.designLayout).widthPx,
          height: getTalkerDimensions(settings.designLayout).heightPx,
        }}
        aria-hidden="true"
      >
        {printItem && (
          <div
            id="print-target"
            style={{
              width: getTalkerDimensions(settings.designLayout).widthPx,
              height: getTalkerDimensions(settings.designLayout).heightPx,
            }}
          >
            <ShelfTalker product={printItem} settings={settings} forPrint />
          </div>
        )}
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
