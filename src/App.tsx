/**
 * App.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Veritas Shelf Talker Engine — template-flow rework
 *
 * Layout:
 *   Desktop (≥1024px): [Nav 64px] | [Form 360px] | [Preview flex] | [Queue 260px]
 *   Tablet  (768–1023): [Nav] | [Form/Preview tabs] | [Queue drawer]
 *   Mobile  (<768px):   Bottom tab bar — Form / Preview / Queue
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wine, Plus, Database, Settings as SettingsIcon, Palette,
  Search, CheckSquare, Square, Trash2, X, Eye, FileText, List,
} from 'lucide-react';
import type { Product, AppSettings, TemplateId } from './types';
import ShelfTalker from './components/ShelfTalker';
import FormPanel from './components/FormPanel';
import QueuePanel from './components/QueuePanel';
import { TemplatePicker } from './components/TemplateGallery';
import SettingsPanel from './components/SettingsPanel';
import Toast, { ToastMessage } from './components/Toast';
import { getTalkerDimensions } from './lib/talkerDimensions';
import { buildPdfFromCanvases, captureTalkerElement, waitForElementReady } from './lib/pdf';
import {
  loadSettings, saveSettings,
  loadCatalog, saveCatalog, addToCatalog, removeFromCatalog,
  loadSessions, saveSession,
} from './lib/catalogStore';
import { APP_VERSION } from './version';

// ─── Initial state ────────────────────────────────────────────────────────────

function blankProduct(settings: AppSettings): Product {
  return {
    id: crypto.randomUUID(),
    producer: '',
    name: '',
    vintage: new Date().getFullYear().toString(),
    region: '',
    score: null,
    reviewer: '',
    description: '',
    tags: [...settings.defaultTags],
    bottleImageUrl: '',
    logoUrl: settings.defaultLogoUrl,
    showScore: false,
    showBottle: false,
  };
}

// ─── Mobile tab type ──────────────────────────────────────────────────────────

type MobileTab = 'form' | 'preview' | 'queue';

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Persisted state ──
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [catalog, setCatalog]   = useState<Product[]>(loadCatalog);
  const [sessions, setSessions] = useState(loadSessions);

  // ── Editor state ──
  const [product, setProduct]       = useState<Product>(() => blankProduct(loadSettings()));
  const [queue, setQueue]           = useState<Product[]>([]);
  const [printItem, setPrintItem]   = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ── UI state ──
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCatalog, setShowCatalog]   = useState(false);
  const [mobileTab, setMobileTab]       = useState<MobileTab>('form');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogSelectMode, setCatalogSelectMode] = useState(false);
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<Set<string>>(new Set());

  // ── Toasts ──
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Save settings ──
  const handleSaveSettings = useCallback((s: AppSettings) => {
    setSettings(s);
    saveSettings(s);
    showToast('Settings saved');
  }, [showToast]);

  // ── Template selection ──
  const handleSelectTemplate = useCallback((id: TemplateId) => {
    const next = { ...settings, templateId: id };
    setSettings(next);
    saveSettings(next);
    showToast('Style updated');
  }, [settings, showToast]);

  // ── Product actions ──
  const handleAddToQueue = useCallback(() => {
    if (!product.producer && !product.name) {
      showToast('Add a producer or item name first', 'error');
      return;
    }
    setQueue((q) => [...q, { ...product, id: crypto.randomUUID() }]);
    setMobileTab('queue');
    showToast('Added to print queue');
  }, [product, showToast]);

  const handleSaveToCatalog = useCallback(() => {
    if (!product.producer && !product.name) {
      showToast('Add a producer or item name first', 'error');
      return;
    }
    const updated = addToCatalog({ ...product, id: crypto.randomUUID() });
    setCatalog(updated);
    showToast('Saved to catalog');
  }, [product, showToast]);

  const handleClearForm = useCallback(() => {
    setProduct(blankProduct(settings));
  }, [settings]);

  const handleLoadFromCatalog = useCallback((item: Product) => {
    setProduct({ ...item, id: crypto.randomUUID() });
    setShowCatalog(false);
    setMobileTab('form');
    showToast(`Loaded: ${item.producer || item.name}`);
  }, [showToast]);

  const handleLoadFromQueue = useCallback((item: Product) => {
    setProduct({ ...item });
    setMobileTab('form');
  }, []);

  const handleRemoveFromQueue = useCallback((id: string) => {
    setQueue((q) => q.filter((p) => p.id !== id));
  }, []);

  const handleRemoveFromCatalog = useCallback((id: string) => {
    const updated = removeFromCatalog(id);
    setCatalog(updated);
  }, []);

  // ── Catalog bulk add to queue ──
  const addSelectedToQueue = useCallback(() => {
    const selected = catalog.filter((p) => selectedCatalogIds.has(p.id));
    setQueue((q) => [...q, ...selected.map((p) => ({ ...p, id: crypto.randomUUID() }))]);
    setSelectedCatalogIds(new Set());
    setCatalogSelectMode(false);
    setShowCatalog(false);
    showToast(`Added ${selected.length} item${selected.length === 1 ? '' : 's'} to queue`);
  }, [catalog, selectedCatalogIds, showToast]);

  // ── PDF generation ──
  const waitForRender = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => { requestAnimationFrame(() => { resolve(); }); });
    });

  const handleGeneratePdf = useCallback(async () => {
    if (queue.length === 0) return;
    setIsGenerating(true);
    try {
      const dims = getTalkerDimensions(settings.templateId as any);
      const canvases: HTMLCanvasElement[] = [];

      for (const item of queue) {
        setPrintItem(item);
        await waitForRender();
        const printZone  = document.getElementById('print-zone');
        const printTarget = document.getElementById('print-target');
        if (!printZone || !printTarget) continue;
        await waitForElementReady(printZone);
        const canvas = await captureTalkerElement(printTarget, dims.widthPx, dims.heightPx);
        canvases.push(canvas);
      }

      setPrintItem(null);
      if (canvases.length === 0) {
        showToast('Nothing captured — check images loaded correctly', 'error');
        return;
      }

      const pdf  = buildPdfFromCanvases(canvases, settings.templateId as any);
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`shelf-talkers-${date}.pdf`);
      showToast(`PDF ready — ${queue.length} talker${queue.length === 1 ? '' : 's'}`);

      // Auto-save session
      const session = { id: crypto.randomUUID(), name: `Batch ${sessions.length + 1} — ${date}`, items: [...queue] };
      const updated = saveSession(session);
      setSessions(updated);
    } catch (err) {
      console.error(err);
      showToast('PDF generation failed', 'error');
    } finally {
      setPrintItem(null);
      setIsGenerating(false);
    }
  }, [queue, settings, sessions, showToast]);

  // ── Filtered catalog ──
  const filteredCatalog = catalog.filter((p) => {
    if (!catalogSearch.trim()) return true;
    const s = catalogSearch.toLowerCase();
    return p.producer.toLowerCase().includes(s) || p.name.toLowerCase().includes(s) || p.region.toLowerCase().includes(s);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="vt-app">

      {/* ── Hidden print capture zone ── */}
      {printItem && (
        <div
          id="print-zone"
          style={{
            position: 'fixed', top: '-9999px', left: '-9999px',
            width: '384px', height: '512px', overflow: 'hidden', zIndex: -1,
          }}
        >
          <ShelfTalker product={printItem} settings={settings} forPrint />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT (≥ 1024px) — four-column
      ══════════════════════════════════════════════════════════════════ */}
      <div className="vt-desktop-shell">

        {/* ── Left nav ── */}
        <nav className="vt-nav">
          <div className="vt-nav-logo">
            <Wine className="w-5 h-5 text-white" />
          </div>

          <div className="vt-nav-actions">
            <NavBtn
              icon={<Palette className="w-5 h-5" />}
              label="Styles"
              title="Shelf Talker Styles"
              active={showTemplates}
              onClick={() => {
                setShowTemplates((v) => !v);
                setShowCatalog(false);
                setShowSettings(false);
              }}
            />
            <NavBtn
              icon={<Database className="w-5 h-5" />}
              label="Catalog"
              active={showCatalog}
              onClick={() => { setShowCatalog((v) => !v); setShowSettings(false); setShowTemplates(false); }}
              badge={catalog.length}
            />
            <NavBtn
              icon={<SettingsIcon className="w-5 h-5" />}
              label="Settings"
              active={showSettings}
              onClick={() => { setShowSettings((v) => !v); setShowCatalog(false); setShowTemplates(false); }}
            />
          </div>

          <div className="mt-auto pb-2 text-center text-white/20 text-[9px] font-mono">
            v{APP_VERSION}
          </div>
        </nav>

        {/* ── Sliding panel: Catalog or Settings ── */}
        <AnimatePresence>
          {(showCatalog || showSettings || showTemplates) && (
            <motion.div
              key="side-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: showTemplates ? 320 : 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="vt-side-panel"
              style={{ overflow: 'hidden' }}
            >
              {showTemplates && (
                <TemplatePicker
                  currentId={settings.templateId}
                  onSelect={handleSelectTemplate}
                  onClose={() => setShowTemplates(false)}
                  compact
                />
              )}
              {showSettings && (
                <SettingsPanel
                  settings={settings}
                  onSave={handleSaveSettings}
                  onClose={() => setShowSettings(false)}
                />
              )}
              {showCatalog && (
                <CatalogPanel
                  catalog={filteredCatalog}
                  search={catalogSearch}
                  onSearch={setCatalogSearch}
                  selectMode={catalogSelectMode}
                  selected={selectedCatalogIds}
                  onToggleSelect={(id) => {
                    setSelectedCatalogIds((prev) => {
                      const next = new Set(prev);
                      next.has(id) ? next.delete(id) : next.add(id);
                      return next;
                    });
                  }}
                  onToggleSelectMode={() => { setCatalogSelectMode((v) => !v); setSelectedCatalogIds(new Set()); }}
                  onAddSelected={addSelectedToQueue}
                  onLoad={handleLoadFromCatalog}
                  onRemove={handleRemoveFromCatalog}
                  onClose={() => setShowCatalog(false)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Form panel ── */}
        <div className="vt-form-panel">
          <div className="vt-panel-header">
            <h2 className="vt-panel-title">New Talker</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleClearForm} className="vt-btn-ghost" title="Clear form">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <FormPanel product={product} onChange={setProduct} />
          </div>
          <div className="vt-form-actions">
            <button onClick={handleSaveToCatalog} className="vt-btn-secondary">
              <Database className="w-3.5 h-3.5" />
              Save to Catalog
            </button>
            <button onClick={handleAddToQueue} className="vt-btn-primary">
              <Plus className="w-3.5 h-3.5" />
              Add to Queue
            </button>
          </div>
        </div>

        {/* ── Preview panel ── */}
        <div className="vt-preview-panel">
          <div className="vt-panel-header">
            <h2 className="vt-panel-title">Preview</h2>
            <button
              onClick={() => {
                setShowTemplates(true);
                setShowCatalog(false);
                setShowSettings(false);
              }}
              className="vt-btn-ghost text-xs gap-1.5"
            >
              <Palette className="w-3.5 h-3.5" />
              Change Style
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-xs">
              <ShelfTalker product={product} settings={settings} />
            </div>
          </div>
        </div>

        {/* ── Queue panel ── */}
        <div className="vt-queue-panel">
          <QueuePanel
            queue={queue}
            onReorder={setQueue}
            onRemove={handleRemoveFromQueue}
            onLoadItem={handleLoadFromQueue}
            onGeneratePdf={handleGeneratePdf}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE LAYOUT (< 1024px) — tab-based
      ══════════════════════════════════════════════════════════════════ */}
      <div className="vt-mobile-shell">

        {/* Mobile header */}
        <header className="vt-mobile-header">
          <div className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-white font-bold text-sm">Shelf Talker</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setShowTemplates((v) => !v);
                setShowCatalog(false);
                setShowSettings(false);
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${showTemplates ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              title="Shelf Talker Styles"
            >
              <Palette className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setShowCatalog((v) => !v); setShowSettings(false); setShowTemplates(false); }}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${showCatalog ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              title="Catalog"
            >
              <Database className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setShowSettings((v) => !v); setShowCatalog(false); setShowTemplates(false); }}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${showSettings ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile content */}
        <div className="vt-mobile-content">
          {/* Mobile overlay panels */}
          <AnimatePresence>
            {(showCatalog || showSettings || showTemplates) && (
              <motion.div
                key="mobile-overlay"
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute inset-0 z-20 bg-[#111111] flex flex-col"
              >
                {showTemplates && (
                  <TemplatePicker
                    currentId={settings.templateId}
                    onSelect={handleSelectTemplate}
                    onClose={() => setShowTemplates(false)}
                    compact
                  />
                )}
                {showSettings && (
                  <SettingsPanel settings={settings} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />
                )}
                {showCatalog && (
                  <CatalogPanel
                    catalog={filteredCatalog}
                    search={catalogSearch}
                    onSearch={setCatalogSearch}
                    selectMode={catalogSelectMode}
                    selected={selectedCatalogIds}
                    onToggleSelect={(id) => {
                      setSelectedCatalogIds((prev) => {
                        const next = new Set(prev);
                        next.has(id) ? next.delete(id) : next.add(id);
                        return next;
                      });
                    }}
                    onToggleSelectMode={() => { setCatalogSelectMode((v) => !v); setSelectedCatalogIds(new Set()); }}
                    onAddSelected={addSelectedToQueue}
                    onLoad={handleLoadFromCatalog}
                    onRemove={handleRemoveFromCatalog}
                    onClose={() => setShowCatalog(false)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mobileTab === 'form' && (
              <motion.div key="tab-form" {...tabAnim} className="vt-mobile-tab-content">
                <FormPanel product={product} onChange={setProduct} />
                <div className="vt-form-actions px-4 pb-4">
                  <button onClick={handleSaveToCatalog} className="vt-btn-secondary">
                    <Database className="w-3.5 h-3.5" />
                    Save to Catalog
                  </button>
                  <button onClick={handleAddToQueue} className="vt-btn-primary">
                    <Plus className="w-3.5 h-3.5" />
                    Add to Queue
                  </button>
                </div>
              </motion.div>
            )}

            {mobileTab === 'preview' && (
              <motion.div key="tab-preview" {...tabAnim} className="vt-mobile-tab-content items-center justify-center p-4">
                <div className="w-full max-w-xs">
                  <ShelfTalker product={product} settings={settings} />
                </div>
              </motion.div>
            )}

            {mobileTab === 'queue' && (
              <motion.div key="tab-queue" {...tabAnim} className="vt-mobile-tab-content">
                <QueuePanel
                  queue={queue}
                  onReorder={setQueue}
                  onRemove={handleRemoveFromQueue}
                  onLoadItem={handleLoadFromQueue}
                  onGeneratePdf={handleGeneratePdf}
                  isGenerating={isGenerating}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom tab bar */}
        <nav className="vt-tab-bar">
          <TabBarBtn icon={<FileText className="w-5 h-5" />} label="Form"    active={mobileTab === 'form'}    onClick={() => setMobileTab('form')} />
          <TabBarBtn icon={<Eye className="w-5 h-5" />}      label="Preview" active={mobileTab === 'preview'} onClick={() => setMobileTab('preview')} />
          <TabBarBtn
            icon={
              <div className="relative">
                <List className="w-5 h-5" />
                {queue.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </div>
            }
            label="Queue"
            active={mobileTab === 'queue'}
            onClick={() => setMobileTab('queue')}
          />
        </nav>
      </div>

      {/* ── Toasts ── */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ─── Nav button ───────────────────────────────────────────────────────────────

function NavBtn({
  icon, label, title, active, onClick, badge,
}: {
  icon: React.ReactNode;
  label: string;
  title?: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      title={title ?? label}
      className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
        active ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-[8px] font-semibold uppercase tracking-wider">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-black text-[8px] font-black rounded-full flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

// ─── Tab bar button ───────────────────────────────────────────────────────────

function TabBarBtn({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
        active ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white/60'
      }`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}

// ─── Tab animation ────────────────────────────────────────────────────────────

const tabAnim = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1 },
  exit:     { opacity: 0 },
  transition: { duration: 0.15 },
};

// ─── Catalog Panel ────────────────────────────────────────────────────────────

interface CatalogPanelProps {
  catalog: Product[];
  search: string;
  onSearch: (s: string) => void;
  selectMode: boolean;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectMode: () => void;
  onAddSelected: () => void;
  onLoad: (p: Product) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

function CatalogPanel({
  catalog, search, onSearch, selectMode, selected, onToggleSelect,
  onToggleSelectMode, onAddSelected, onLoad, onRemove, onClose,
}: CatalogPanelProps) {
  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8 shrink-0">
        <div>
          <h3 className="text-white text-sm font-bold">Catalog</h3>
          <p className="text-white/40 text-xs">{catalog.length} saved item{catalog.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-1">
          {catalog.length > 0 && (
            <button
              onClick={onToggleSelectMode}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              {selectMode ? 'Cancel' : 'Select'}
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search catalog…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        {catalog.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
            <Wine className="w-8 h-8 text-white/15" />
            <p className="text-white/30 text-xs">Your saved items will appear here</p>
          </div>
        ) : (
          <div className="space-y-1 py-1">
            {catalog.map((item) => {
              const isSelected = selected.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`group flex items-center gap-2 rounded-lg px-2 py-2.5 transition-colors ${
                    isSelected ? 'bg-[#D4AF37]/10' : 'hover:bg-white/5'
                  }`}
                >
                  {selectMode && (
                    <button onClick={() => onToggleSelect(item.id)} className="shrink-0">
                      {isSelected
                        ? <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
                        : <Square className="w-4 h-4 text-white/30" />
                      }
                    </button>
                  )}
                  <button
                    onClick={() => !selectMode && onLoad(item)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-white text-xs font-semibold truncate">{item.producer || 'Unnamed'}</p>
                    <p className="text-white/40 text-[10px] truncate">
                      {[item.name, item.vintage, item.region].filter(Boolean).join(' · ')}
                    </p>
                  </button>
                  {!selectMode && (
                    <button
                      onClick={() => onRemove(item.id)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-red-400 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk add */}
      {selectMode && selected.size > 0 && (
        <div className="p-3 border-t border-white/8 shrink-0">
          <button
            onClick={onAddSelected}
            className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-bold hover:bg-[#E8C94A] transition-colors"
          >
            Add {selected.size} to Queue
          </button>
        </div>
      )}
    </div>
  );
}
