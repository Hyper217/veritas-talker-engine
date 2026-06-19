import { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import {
  AppSettings,
  DesignLayout,
  FitMode,
  FlowZone,
  ZoneKey,
  ZoneTypography,
} from '../types';
import {
  EDITABLE_ZONE_KEYS,
  FLOW_PRESETS,
  ZONE_LABELS,
  findZoneOverlaps,
  getEffectiveTypography,
  getEffectiveZones,
  resetAllLayoutCustomizations,
  updateTypographyOverride,
  updateZoneOverride,
} from '../lib/flowLayout';

interface Props {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  selectedZone: ZoneKey;
  onSelectZone: (zone: ZoneKey) => void;
  previewProductId: string;
}

const ZONE_FIELDS: (keyof FlowZone)[] = ['top', 'left', 'width', 'height'];

const TYPO_FIELDS: {
  key: keyof ZoneTypography;
  label: string;
  min: number;
  max: number;
  step: number;
  show?: (style: ZoneTypography) => boolean;
}[] = [
  { key: 'maxFontSize', label: 'Max font', min: 5, max: 40, step: 0.5 },
  { key: 'minFontSize', label: 'Min font', min: 4, max: 24, step: 0.5 },
  { key: 'lineCount', label: 'Ruled lines', min: 3, max: 14, step: 1, show: (s) => s.fitMode === 'lines' },
  { key: 'lineOffsetTop', label: 'Line offset', min: 0, max: 24, step: 1 },
  { key: 'paddingX', label: 'Pad X', min: 0, max: 20, step: 1 },
  { key: 'paddingY', label: 'Pad Y', min: 0, max: 20, step: 1 },
  { key: 'lineHeight', label: 'Line height', min: 1, max: 2, step: 0.05, show: (s) => s.fitMode === 'box' },
];

function numVal(v: unknown, fallback: number): number {
  return typeof v === 'number' && !Number.isNaN(v) ? v : fallback;
}

export default function LayoutEditor({
  settings,
  onSave,
  selectedZone,
  onSelectZone,
  previewProductId,
}: Props) {
  const layoutKey = settings.designLayout;
  const zones = getEffectiveZones(layoutKey, settings.layoutOverrides);
  const typography = getEffectiveTypography(layoutKey, settings.typographyOverrides);
  const layoutOverrides = settings.layoutOverrides?.[layoutKey];
  const typoOverrides = settings.typographyOverrides?.[layoutKey];
  const zoneStyle = typography[selectedZone] ?? {};
  const overlaps = findZoneOverlaps(zones);
  const [overflowZones, setOverflowZones] = useState<ZoneKey[]>([]);

  useEffect(() => {
    const scan = () => {
      const talker = document.getElementById(`shelf-talker-${previewProductId}`);
      if (!talker) return;
      const found: ZoneKey[] = [];
      for (const key of EDITABLE_ZONE_KEYS) {
        const el = talker.querySelector(`[data-layout-zone="${key}"] [data-overflow="true"]`);
        if (el) found.push(key);
      }
      setOverflowZones(found);
    };
    scan();
    const id = window.setInterval(scan, 400);
    return () => window.clearInterval(id);
  }, [previewProductId, settings, zones, typography]);

  const handleZoneChange = (zoneKey: ZoneKey, field: keyof FlowZone, value: number) => {
    const nextOverrides = {
      ...settings.layoutOverrides,
      [layoutKey]: updateZoneOverride(layoutOverrides, zoneKey, field, value),
    };
    onSave({ ...settings, layoutOverrides: nextOverrides });
  };

  const handleTypoChange = <K extends keyof ZoneTypography>(
    field: K,
    value: ZoneTypography[K]
  ) => {
    const nextOverrides = {
      ...settings.typographyOverrides,
      [layoutKey]: updateTypographyOverride(typoOverrides, selectedZone, field, value),
    };
    onSave({ ...settings, typographyOverrides: nextOverrides });
  };

  const handleReset = () => {
    const reset = resetAllLayoutCustomizations(
      settings.layoutOverrides,
      settings.typographyOverrides,
      layoutKey
    );
    onSave({ ...settings, ...reset });
  };

  const fitMode: FitMode =
    zoneStyle.singleLine ? 'single' : (zoneStyle.fitMode ?? 'box');

  return (
    <div className="space-y-4 flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Layout Editor
          </h3>
          <p className="text-[9px] text-gray-400 mt-0.5">
            Drag boxes on talker · tune text fit
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          title="Reset layout for this style"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {(overlaps.length > 0 || overflowZones.length > 0) && (
        <div className="space-y-1.5 shrink-0">
          {overlaps.length > 0 && (
            <p className="flex items-start gap-1.5 text-[9px] text-red-600 bg-red-50 border border-red-100 rounded p-2">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              Zones overlap: {overlaps.map(([a, b]) => `${ZONE_LABELS[a]} / ${ZONE_LABELS[b]}`).join('; ')}
            </p>
          )}
          {overflowZones.length > 0 && (
            <p className="flex items-start gap-1.5 text-[9px] text-amber-700 bg-amber-50 border border-amber-100 rounded p-2">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              Text clipped: {overflowZones.map((z) => ZONE_LABELS[z]).join(', ')} — enlarge zone or lower min font
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1 shrink-0">
        {EDITABLE_ZONE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelectZone(key)}
            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded border transition-colors ${
              selectedZone === key
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
          >
            {ZONE_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 min-h-0">
        <div className="bg-stone-50 border border-stone-100 rounded p-3 space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
            {ZONE_LABELS[selectedZone]} — position
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ZONE_FIELDS.map((field) => (
              <label key={field} className="space-y-1">
                <span className="text-[8px] uppercase font-bold text-stone-400">{field}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={zones[selectedZone][field]}
                  onChange={(e) =>
                    handleZoneChange(selectedZone, field, parseFloat(e.target.value))
                  }
                  className="w-full accent-emerald-600"
                />
                <span className="text-[8px] text-stone-400 tabular-nums">
                  {zones[selectedZone][field].toFixed(1)}%
                </span>
              </label>
            ))}
          </div>
        </div>

        {selectedZone !== 'bottle' && selectedZone !== 'logo' && (
          <div className="bg-stone-50 border border-stone-100 rounded p-3 space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
              Text fit & ruled lines
            </p>

            <label className="block space-y-1">
              <span className="text-[8px] uppercase font-bold text-stone-400">Fit mode</span>
              <select
                value={fitMode}
                onChange={(e) => {
                  const mode = e.target.value as FitMode;
                  handleTypoChange('fitMode', mode);
                  handleTypoChange('singleLine', mode === 'single');
                }}
                className="w-full text-[10px] border border-stone-200 rounded p-1.5 bg-white"
              >
                <option value="single">Single line (shrink to fit width)</option>
                <option value="box">Free box (wrap + shrink)</option>
                <option value="lines">Ruled lines (match template lines)</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {TYPO_FIELDS.filter((f) => !f.show || f.show({ ...zoneStyle, fitMode })).map(
                ({ key, label, min, max, step }) => {
                  const base = FLOW_PRESETS[layoutKey].layout.typography?.[selectedZone]?.[key];
                  const value = numVal(zoneStyle[key] ?? base, min);
                  return (
                    <label key={key} className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-stone-400">{label}</span>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) =>
                          handleTypoChange(key, parseFloat(e.target.value) as never)
                        }
                        className="w-full accent-emerald-600"
                      />
                      <span className="text-[8px] text-stone-400 tabular-nums">
                        {typeof value === 'number' ? value.toFixed(key === 'lineHeight' ? 2 : 1) : value}
                      </span>
                    </label>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function hasLayoutOverrides(
  settings: AppSettings,
  layoutKey: DesignLayout = settings.designLayout
): boolean {
  return Boolean(
    settings.layoutOverrides?.[layoutKey] || settings.typographyOverrides?.[layoutKey]
  );
}
