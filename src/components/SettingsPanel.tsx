/**
 * SettingsPanel.tsx
 * App-level settings: default template, default tags, logo URL.
 */

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { AppSettings, TemplateId } from '../types';
import { TEMPLATE_LIST } from '../lib/templates';

interface Props {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<AppSettings>({ ...settings });

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
        <h3 className="text-white font-bold text-sm">App Settings</h3>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-6">

        {/* Default template */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">Default Template</label>
          <select
            value={draft.templateId}
            onChange={(e) => setDraft({ ...draft, templateId: e.target.value as TemplateId })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
          >
            {TEMPLATE_LIST.map((t) => (
              <option key={t.id} value={t.id} className="bg-zinc-900">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Default tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">Default Tags</label>
          <p className="text-white/30 text-[10px]">Comma-separated. Applied to new items automatically.</p>
          <input
            type="text"
            value={draft.defaultTags.join(', ')}
            onChange={(e) => setDraft({
              ...draft,
              defaultTags: e.target.value.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean),
            })}
            placeholder="ORGANIC, UNFILTERED"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Default logo URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">Default Logo URL</label>
          <p className="text-white/30 text-[10px]">Used when a product has no individual logo set.</p>
          <input
            type="url"
            value={draft.defaultLogoUrl}
            onChange={(e) => setDraft({ ...draft, defaultLogoUrl: e.target.value })}
            placeholder="https://your-logo.com/logo.png"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

      </div>

      <div className="p-4 border-t border-white/8">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
