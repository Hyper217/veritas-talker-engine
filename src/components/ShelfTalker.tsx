import { Wine } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Product, AppSettings } from '../types';
import { formatDropboxUrl } from '../lib/utils';
import { FLOW_PRESETS, zoneStyle } from '../lib/flowLayout';

interface Props {
  product: Product;
  settings?: AppSettings;
  forPrint?: boolean;
}

function AutoSizeText({
  text,
  color = '#1a1a1a',
  className = '',
}: {
  text: string;
  color?: string;
  className?: string;
}) {
  const [fontSize, setFontSize] = useState(14);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFontSize(14);
  }, [text]);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const container = containerRef.current;
    const inner = textRef.current;

    if (inner.scrollHeight > container.offsetHeight && fontSize > 8) {
      container.removeAttribute('data-autosize-ready');
      const timeout = setTimeout(() => {
        setFontSize((prev) => prev - 0.5);
      }, 5);
      return () => clearTimeout(timeout);
    }

    container.setAttribute('data-autosize-ready', 'true');
  }, [text, fontSize]);

  return (
    <div ref={containerRef} data-autosize className={`h-full overflow-hidden relative w-full ${className}`}>
      <div
        ref={textRef}
        className="leading-snug italic relative shelf-talker-content w-full"
        style={{ fontSize: `${fontSize}px`, color }}
        dangerouslySetInnerHTML={{
          __html:
            text ||
            '"Explosive aromatics of wild strawberry and damp earth. The palate is refined, showing exceptional tension."',
        }}
      />
    </div>
  );
}

function NoirAutoSizeText({ text, accentColor }: { text: string; accentColor: string }) {
  return (
    <AutoSizeText
      text={text}
      color={`${accentColor}E6`}
      className="flex items-center px-2 text-center font-serif"
    />
  );
}

function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((char) => char + char).join('');
  }
  if (cleanHex.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ShelfTalker({ product, settings, forPrint = false }: Props) {
  const imageUrl = formatDropboxUrl(product.dropboxImageUrl);
  const logoUrl = product.logoUrl || settings?.defaultLogoUrl;
  const formattedLogoUrl = logoUrl
    ? logoUrl.startsWith('data:')
      ? logoUrl
      : formatDropboxUrl(logoUrl)
    : null;
  const layout = settings?.designLayout || 'royal-dark';

  const printClass = forPrint ? 'shadow-none' : '';

  const renderFlowImport = (presetKey: 'royal-dark' | 'flow-art-deco') => {
    const preset = FLOW_PRESETS[presetKey];
    const flowLayout = preset.layout;
    const { zones } = flowLayout;
    const textColor = preset.textColor;
    
    // Override default accentColor with user selected royalDarkColor if it exists
    const flowAccent = (presetKey === 'royal-dark' && settings?.royalDarkColor)
      ? settings.royalDarkColor
      : preset.accentColor;

    const shadowColor = flowLayout.textShadowColor ?? 'rgba(0,0,0,0.85)';
    const shadowBlur = flowLayout.textShadowBlur ?? 8;
    const textShadow = shadowBlur > 0
      ? `0 1px ${shadowBlur}px ${shadowColor}, 0 0 ${shadowBlur * 2}px ${shadowColor}`
      : 'none';

    const panelOpacity = flowLayout.descriptionPanelOpacity ?? 0;
    const panelColor = flowLayout.descriptionPanelColor ?? '#ffffff';
    const tagSep = flowLayout.tagSeparator ?? ' ';

    const tags =
      product.tags.length > 0 ? product.tags : settings?.defaultTags ?? [];

    return (
      <div
        className={`shelf-talker w-[384px] h-[510px] relative overflow-hidden box-border ${printClass}`}
        id={`shelf-talker-${product.id}`}
      >
        {preset.backgroundImageUrl ? (
          <img
            src={preset.backgroundImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center p-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
              Design preset background missing
            </p>
          </div>
        )}

        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Region */}
          <div
            className="absolute flex items-center justify-center overflow-hidden px-0.5"
            style={zoneStyle(zones.region)}
          >
            <p
              className="text-[9px] font-bold uppercase tracking-widest leading-none text-center w-full"
              style={{ color: presetKey === 'royal-dark' ? flowAccent : textColor, textShadow }}
            >
              {product.region || 'Region'}
            </p>
          </div>

          {/* Producer */}
          <div
            className={`absolute flex overflow-hidden px-0.5 ${presetKey === 'royal-dark' ? 'items-center justify-center' : 'items-end'}`}
            style={zoneStyle(zones.producer)}
          >
            {presetKey === 'royal-dark' ? (
              <p
                className="font-serif text-[22px] font-medium tracking-[0.05em] uppercase leading-tight text-center w-full"
                style={{ color: flowAccent, textShadow }}
              >
                {product.producer || 'Producer'}
              </p>
            ) : (
              <p
                className="font-serif text-[20px] font-black uppercase leading-tight w-full"
                style={{ color: textColor, textShadow }}
              >
                {product.producer || 'Producer'}
              </p>
            )}
          </div>

          {/* Wine name + vintage */}
          <div
            className={`absolute flex overflow-hidden px-0.5 ${presetKey === 'royal-dark' ? 'items-center justify-center' : 'items-start'}`}
            style={zoneStyle(zones.wineName)}
          >
            {presetKey === 'royal-dark' ? (
              <p
                className="font-serif text-[16px] italic leading-snug text-center w-full"
                style={{ color: textColor, textShadow }}
              >
                {product.vintage} {product.name}
              </p>
            ) : (
              <p
                className="font-serif text-[14px] italic leading-snug w-full"
                style={{ color: textColor, textShadow }}
              >
                {product.vintage} {product.name}
              </p>
            )}
          </div>

          {/* Score */}
          {product.score != null && product.score > 0 && (
            <div
              className="absolute flex flex-col items-center justify-center overflow-hidden"
              style={zoneStyle(zones.score)}
            >
              {presetKey === 'royal-dark' ? (
                <>
                  <span className="font-serif text-[42px] font-black leading-none" style={{ color: flowAccent, textShadow }}>
                    {product.score}
                  </span>
                  <span className="text-[9px] font-bold uppercase opacity-80" style={{ color: flowAccent }}>
                    {product.reviewer || 'PTS'}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-serif text-2xl font-black leading-none" style={{ color: flowAccent, textShadow }}>
                    {product.score}
                  </span>
                  <span className="text-[6px] font-bold uppercase opacity-80" style={{ color: flowAccent }}>
                    {product.reviewer || 'PTS'}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Bottle */}
          <div
            className="absolute flex items-end justify-center overflow-hidden"
            style={zoneStyle(zones.bottle)}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Bottle"
                className="max-h-full max-w-full object-contain drop-shadow-md"
                crossOrigin="anonymous"
              />
            ) : null}
          </div>

          {/* Tasting notes */}
          <div
            className="absolute overflow-hidden rounded-sm p-1"
            style={{
              ...zoneStyle(zones.description),
              backgroundColor:
                panelOpacity > 0 ? hexToRgba(panelColor, panelOpacity / 100) : 'transparent',
            }}
          >
            {presetKey === 'royal-dark' ? (
              <AutoSizeText
                text={product.description}
                color={`${textColor}E6`}
                className="flex items-center px-1 text-center font-serif"
              />
            ) : (
              <AutoSizeText text={product.description} color={textColor} />
            )}
          </div>

          {/* Tags */}
          <div
            className="absolute flex items-center justify-center overflow-hidden px-1"
            style={zoneStyle(zones.tags)}
          >
            <p
              className="text-[9px] font-black uppercase tracking-wider text-center leading-none w-full"
              style={{ color: flowAccent, textShadow }}
            >
              {tags.slice(0, 3).join(tagSep)}
            </p>
          </div>

          {/* Logo */}
          {formattedLogoUrl && (
            <div
              className="absolute flex items-center justify-center overflow-hidden"
              style={zoneStyle(zones.logo)}
            >
              <img
                src={formattedLogoUrl}
                alt="Logo"
                className="max-h-full max-w-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderFlowImport(layout);
}
