import { useCallback, useRef } from 'react';
import { AppSettings, FlowZone, ZoneKey } from '../types';
import {
  EDITABLE_ZONE_KEYS,
  ZONE_LABELS,
  clampZone,
  findZoneOverlaps,
  getEffectiveZones,
  updateZoneBounds,
} from '../lib/flowLayout';

interface Props {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  selectedZone: ZoneKey;
  onSelectZone: (zone: ZoneKey) => void;
  talkerId: string;
}

type DragKind = 'move' | 'resize-se';

export default function LayoutEditorOverlay({
  settings,
  onSave,
  selectedZone,
  onSelectZone,
  talkerId,
}: Props) {
  const layoutKey = settings.designLayout;
  const zones = getEffectiveZones(layoutKey, settings.layoutOverrides);
  const overlaps = findZoneOverlaps(zones);
  const overlappingKeys = new Set<ZoneKey>(
    overlaps.flatMap(([a, b]) => [a, b])
  );

  const dragRef = useRef<{
    zoneKey: ZoneKey;
    kind: DragKind;
    startX: number;
    startY: number;
    startZone: FlowZone;
    rect: DOMRect;
  } | null>(null);

  const persistZone = useCallback(
    (zoneKey: ZoneKey, bounds: FlowZone) => {
      const nextOverrides = {
        ...settings.layoutOverrides,
        [layoutKey]: updateZoneBounds(settings.layoutOverrides?.[layoutKey], zoneKey, bounds),
      };
      onSave({ ...settings, layoutOverrides: nextOverrides });
    },
    [layoutKey, onSave, settings]
  );

  const handlePointerDown = (
    e: React.PointerEvent,
    zoneKey: ZoneKey,
    kind: DragKind
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectZone(zoneKey);

    const talker = document.getElementById(`shelf-talker-${talkerId}`);
    if (!talker) return;

    dragRef.current = {
      zoneKey,
      kind,
      startX: e.clientX,
      startY: e.clientY,
      startZone: { ...zones[zoneKey] },
      rect: talker.getBoundingClientRect(),
    };

    const onMove = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dxPct = ((ev.clientX - drag.startX) / drag.rect.width) * 100;
      const dyPct = ((ev.clientY - drag.startY) / drag.rect.height) * 100;
      const start = drag.startZone;
      let next: FlowZone;

      if (drag.kind === 'move') {
        next = clampZone({
          ...start,
          left: start.left + dxPct,
          top: start.top + dyPct,
        });
      } else {
        next = clampZone({
          ...start,
          width: start.width + dxPct,
          height: start.height + dyPct,
        });
      }

      persistZone(drag.zoneKey, next);
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {EDITABLE_ZONE_KEYS.map((zoneKey) => {
        const zone = zones[zoneKey];
        const selected = selectedZone === zoneKey;
        const clashing = overlappingKeys.has(zoneKey);

        return (
          <div
            key={zoneKey}
            className={`absolute pointer-events-auto border-2 transition-colors ${
              selected
                ? 'border-emerald-400 bg-emerald-400/10'
                : clashing
                  ? 'border-red-400/80 bg-red-400/10'
                  : 'border-white/50 bg-white/5 hover:border-emerald-300/70'
            }`}
            style={{
              top: `${zone.top}%`,
              left: `${zone.left}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
            onPointerDown={(e) => handlePointerDown(e, zoneKey, 'move')}
          >
            <span
              className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded whitespace-nowrap ${
                clashing ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {ZONE_LABELS[zoneKey]}
            </span>

            {selected && (
              <div
                className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border border-white cursor-se-resize translate-x-1/2 translate-y-1/2"
                onPointerDown={(e) => handlePointerDown(e, zoneKey, 'resize-se')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
