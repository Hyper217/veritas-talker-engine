import { FlowDesign, FlowDesignLayout, FlowLayoutPreset } from '../types';
import {
  FLOW_ZONE_LABELS,
  FlowZoneKey,
  applyLayoutPreset,
} from '../lib/flowLayout';

interface Props {
  design: FlowDesign;
  onUpdate: (updates: Partial<FlowDesign>) => void;
}

const PRESETS: { id: FlowLayoutPreset; label: string }[] = [
  { id: 'art-deco', label: 'Art Deco (arch left)' },
  { id: 'default', label: 'Default grid' },
];

export default function FlowLayoutEditor({ design, onUpdate }: Props) {
  const layout = design.layout ?? applyLayoutPreset('art-deco');

  const setLayout = (next: FlowDesignLayout) => {
    onUpdate({ layout: { ...next, preset: 'custom' } });
  };

  const applyPreset = (preset: FlowLayoutPreset) => {
    onUpdate({ layout: applyLayoutPreset(preset) });
  };

  const updateZone = (key: FlowZoneKey, field: 'top' | 'left' | 'width' | 'height', value: number) => {
    setLayout({
      ...layout,
      zones: {
        ...layout.zones,
        [key]: { ...layout.zones[key], [field]: value },
      },
    });
  };

  return (
    <div className="pt-2 space-y-3 border-t border-stone-100">
      <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
        Align text to “{design.name}”
      </p>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-wide transition-all ${
              layout.preset === p.id
                ? 'bg-violet-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-[9px] text-stone-600">
        <input
          type="checkbox"
          checked={layout.textOnDark ?? false}
          onChange={(e) => setLayout({ ...layout, textOnDark: e.target.checked })}
          className="rounded"
        />
        Light text on dark background
      </label>

      <label className="block space-y-1">
        <span className="text-[8px] uppercase text-stone-400 font-bold">
          Notes panel opacity ({layout.descriptionPanelOpacity ?? 0}%)
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={layout.descriptionPanelOpacity ?? 0}
          onChange={(e) =>
            setLayout({ ...layout, descriptionPanelOpacity: Number(e.target.value) })
          }
          className="w-full"
        />
        <span className="text-[8px] text-stone-400">Set to 0 if your Flow art has its own text area</span>
      </label>

      <details className="text-[9px]">
        <summary className="cursor-pointer font-bold uppercase tracking-wider text-stone-400 hover:text-violet-600">
          Fine-tune zones
        </summary>
        <div className="mt-2 space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          {(Object.keys(FLOW_ZONE_LABELS) as FlowZoneKey[]).map((key) => {
            const zone = layout.zones[key];
            return (
              <div key={key} className="space-y-1 pb-2 border-b border-stone-50 last:border-0">
                <p className="text-[8px] font-bold text-stone-500">{FLOW_ZONE_LABELS[key]}</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {(['top', 'left', 'width', 'height'] as const).map((field) => (
                    <label key={field} className="flex items-center gap-1">
                      <span className="text-[7px] uppercase text-stone-400 w-8">{field}</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={zone[field]}
                        onChange={(e) => updateZone(key, field, Number(e.target.value))}
                        className="w-full px-1 py-0.5 text-[9px] border border-stone-200 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
