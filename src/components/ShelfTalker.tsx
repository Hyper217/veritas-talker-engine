import { Wine } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Product, AppSettings, FlowDesign } from '../types';
import { formatDropboxUrl } from '../lib/utils';
import { getFlowLayout, zoneStyle } from '../lib/flowLayout';

interface Props {
  product: Product;
  settings?: AppSettings;
  forPrint?: boolean;
  flowDesign?: FlowDesign | null;
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

export default function ShelfTalker({ product, settings, forPrint = false, flowDesign }: Props) {
  const imageUrl = formatDropboxUrl(product.dropboxImageUrl);
  const logoUrl = product.logoUrl || settings?.defaultLogoUrl;
  const formattedLogoUrl = logoUrl
    ? logoUrl.startsWith('data:')
      ? logoUrl
      : formatDropboxUrl(logoUrl)
    : null;
  const layout = settings?.designLayout || 'royal-dark';
  const accentColor = settings?.royalDarkColor || flowDesign?.accentColor || '#D4AF37';

  const printClass = forPrint ? 'shadow-none' : '';
  const noirShadow = forPrint ? '' : 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]';

  const renderNoir = () => (
    <div
      className={`shelf-talker w-[384px] h-[510px] bg-[#0c0c0c] flex flex-col font-sans overflow-hidden box-border relative ${noirShadow} border border-stone-800 ${printClass}`}
      id={`shelf-talker-${product.id}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(60,60,60,0.15)_0%,transparent_70%)]" />

      <header className="pt-10 pb-2 px-8 flex flex-col items-center relative z-10">
        <h1
          className="font-serif text-[26px] font-medium tracking-[0.05em] leading-tight"
          style={{ color: accentColor }}
        >
          {product.producer || 'Producer Name'}
        </h1>
        <div className="flex items-center gap-4 w-full justify-center mt-3">
          <div
            className="h-[1px] flex-1"
            style={{ background: `linear-gradient(to right, transparent, ${accentColor}66, transparent)` }}
          />
          <span
            className="text-[10px] font-black uppercase tracking-[0.3em]"
            style={{ color: accentColor }}
          >
            Cellars
          </span>
          <div
            className="h-[1px] flex-1"
            style={{ background: `linear-gradient(to left, transparent, ${accentColor}66, transparent)` }}
          />
        </div>
      </header>

      <div className="flex-1 px-8 py-4 flex flex-col relative">
        <div className="flex flex-1 gap-2 items-center relative">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-[160px] h-[220px] rounded-t-[80px] border-2 flex items-center justify-center bg-black/40 relative"
              style={{ borderColor: `${accentColor}99`, boxShadow: `0 0 20px ${accentColor}1A` }}
            >
              <div
                className="absolute inset-0 rounded-t-[80px] border pointer-events-none"
                style={{ borderColor: `${accentColor}33` }}
              />
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Bottle"
                  className="h-[85%] object-contain filter brightness-[1.1] contrast-[1.1]"
                  crossOrigin="anonymous"
                />
              ) : (
                <div
                  className="text-[8px] font-black uppercase tracking-[0.5em] leading-[10px] text-center px-4"
                  style={{ color: `${accentColor}33` }}
                >
                  | Bottle
                  <br />
                  Silhouette |
                </div>
              )}
            </div>
          </div>

          {product.score && product.score > 0 && (
            <div className="flex flex-col items-end justify-center pt-8 pr-2 shrink-0">
              <span
                className="text-[7px] font-black uppercase tracking-[0.2em] leading-none mb-2 opacity-50 whitespace-nowrap"
                style={{ color: accentColor }}
              >
                Critical Score
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[72px] font-black leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                  style={{
                    background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}CC)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {product.score}
                </span>
                <span
                  className="text-[12px] italic font-serif leading-none opacity-80"
                  style={{ color: accentColor }}
                >
                  pts
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <h2 className="font-serif text-[38px] text-white font-medium leading-none tracking-tight">
            {product.vintage} {product.name.split("'")[0].trim() || 'Variety'}
          </h2>
          {product.name.includes("'") && (
            <p
              className="font-serif italic text-[22px] leading-none mt-2"
              style={{ color: `${accentColor}E6` }}
            >
              '{product.name.split("'")[1].replace("'", "").trim()}'
            </p>
          )}

          <div
            className="flex items-center gap-2 justify-center mt-5 text-[11px] font-black uppercase tracking-[0.2em]"
            style={{ color: `${accentColor}B3` }}
          >
            <span>{product.region?.split(',')[0].trim() || 'REGION'}</span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${accentColor}66` }} />
            <span>{product.region?.split(',')[1]?.trim() || 'COUNTRY'}</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 mt-2 overflow-hidden px-1">
          <NoirAutoSizeText text={product.description} accentColor={accentColor} />
        </div>
      </div>

      <footer className="h-24 bg-black/40 border-t border-stone-900/50 flex flex-col px-8 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
        <div className="flex-1 grid grid-cols-3 divide-x divide-stone-900/50 py-3">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-[7px] text-stone-600 font-black uppercase tracking-widest">Natural</span>
            <span className="text-[11px] text-stone-300 font-bold tracking-tight">
              {product.tags[0] || 'Organic'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 px-4">
            <span className="text-[7px] text-stone-600 font-black uppercase tracking-widest">Ferment</span>
            <span className="text-[11px] text-stone-300 font-bold tracking-tight">
              {product.tags[1] || 'Native'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-[7px] text-stone-600 font-black uppercase tracking-widest">Clarity</span>
            <span className="text-[11px] font-bold tracking-tight" style={{ color: accentColor }}>
              {product.tags[2] || 'Unfiltered'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderFlowImport = () => {
    const flowLayout = getFlowLayout(flowDesign);
    const { zones } = flowLayout;
    const textColor = flowDesign?.textColor ?? (flowLayout.textOnDark ? '#D4AF37' : '#111827');
    const flowAccent = flowDesign?.accentColor ?? textColor;
    const textShadow = flowLayout.textOnDark
      ? '0 1px 4px rgba(0,0,0,0.85), 0 0 12px rgba(0,0,0,0.5)'
      : '0 1px 3px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.6)';
    const panelOpacity = flowLayout.descriptionPanelOpacity ?? 0;
    const tagSep = flowLayout.tagSeparator ?? ' ';

    const tags =
      product.tags.length > 0 ? product.tags : settings?.defaultTags ?? [];

    return (
      <div
        className={`shelf-talker w-[384px] h-[510px] relative overflow-hidden box-border ${printClass}`}
        id={`shelf-talker-${product.id}`}
      >
        {flowDesign?.imageUrl ? (
          <img
            src={flowDesign.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center p-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
              Import artwork from Google Flow
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
              style={{ color: textColor, textShadow }}
            >
              {product.region || 'Region'}
            </p>
          </div>

          {/* Producer */}
          <div
            className="absolute flex items-end overflow-hidden px-0.5"
            style={zoneStyle(zones.producer)}
          >
            <p
              className="font-serif text-[20px] font-black uppercase leading-tight w-full"
              style={{ color: textColor, textShadow }}
            >
              {product.producer || 'Producer'}
            </p>
          </div>

          {/* Wine name + vintage */}
          <div
            className="absolute flex items-start overflow-hidden px-0.5"
            style={zoneStyle(zones.wineName)}
          >
            <p
              className="font-serif text-[14px] italic leading-snug w-full"
              style={{ color: textColor, textShadow }}
            >
              {product.name || 'Wine Name'} · {product.vintage}
            </p>
          </div>

          {/* Score */}
          {product.score != null && product.score > 0 && (
            <div
              className="absolute flex flex-col items-center justify-center overflow-hidden"
              style={zoneStyle(zones.score)}
            >
              <span className="font-serif text-2xl font-black leading-none" style={{ color: flowAccent, textShadow }}>
                {product.score}
              </span>
              <span className="text-[6px] font-bold uppercase opacity-80" style={{ color: flowAccent }}>
                {product.reviewer || 'PTS'}
              </span>
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
                panelOpacity > 0 ? `rgba(255,255,255,${panelOpacity / 100})` : 'transparent',
            }}
          >
            <AutoSizeText text={product.description} color={textColor} />
          </div>

          {/* Tags */}
          <div
            className="absolute flex items-center justify-center overflow-hidden px-1"
            style={zoneStyle(zones.tags)}
          >
            <p
              className="text-[8px] font-black uppercase tracking-wider text-center leading-none w-full"
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

  if (layout === 'flow-custom') {
    return renderFlowImport();
  }

  return renderNoir();
}
