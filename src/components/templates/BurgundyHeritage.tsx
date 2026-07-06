import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function BurgundyHeritage({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;
  const showMeta = showScore || !!product.vintage;
  const descLines = showMeta ? 6 : 8;

  return (
    <div className="w-full h-full flex flex-col bg-[#fdfaf4] text-[#3a1622] font-serif overflow-hidden relative border-[6px] border-[#3a1622]">

      {/* Deep Burgundy Header */}
      <div className="flex-none bg-[#7a1f38] text-[#fdfaf4] flex flex-col justify-center items-center px-4 relative shadow-md z-10 overflow-hidden" style={{ height: '20%' }}>
        <div className="absolute inset-2 border border-[#fdfaf4] opacity-30 pointer-events-none" />
        <div className="w-full text-center mb-0.5">
          <FitText text={product.producer} maxFontSize={22} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#fdfaf4" trackReady={forPrint} />
        </div>
        <div className="w-4/5 text-center">
          <FitText text={product.name} maxFontSize={13} minFontSize={7} fontStyle="italic" color="#fdfaf4" trackReady={forPrint} />
        </div>
        {product.region && (
          <div className="mt-1 text-center w-3/4 opacity-80">
            <FitText text={product.region} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.1em" color="#fdfaf4" trackReady={forPrint} />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-3 px-4 py-2 min-h-0 relative">

        {/* Left Column — bottle */}
        <div className="flex-none w-[45%] flex flex-col min-h-0">
          {showBottle ? (
            <div className="flex-1 min-h-0 w-full border border-[#d8c3a5] p-2 bg-[#f8f1e5] shadow-inner rounded-sm flex items-end justify-center overflow-hidden">
              <img
                src={bottleUrl}
                alt="Bottle"
                className="max-h-full max-w-full object-contain object-bottom"
                crossOrigin={forPrint ? 'anonymous' : undefined}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0" />
          )}
        </div>

        {/* Right Column — meta + notes */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 border border-[#d8c3a5] bg-white p-2 shadow-sm rounded-sm overflow-hidden">
          {showMeta && (
            <div className="flex-none flex justify-between items-center mb-1 border-b border-[#e8dcc8] pb-1">
              {showScore ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 bg-[#7a1f38] text-[#fdfaf4] flex flex-col items-center justify-center rounded-full shadow-inner flex-none border border-[#d8c3a5]">
                    <FitText text={String(product.score)} maxFontSize={20} minFontSize={11} fontWeight={900} color="#fdfaf4" trackReady={forPrint} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#7a1f38]">Rating</div>
                    {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#8a5a68] mt-0.5 truncate">{product.reviewer}</div>}
                  </div>
                </div>
              ) : (
                <div />
              )}
              {product.vintage && (
                <div className="text-right shrink-0 pl-2">
                  <FitText text={product.vintage} maxFontSize={11} minFontSize={7} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
                </div>
              )}
            </div>
          )}

          <div className="flex-1 min-h-0 h-0 overflow-hidden">
            <FitText
              text={product.description}
              maxFontSize={10}
              minFontSize={5}
              fontStyle="italic"
              fitMode="lines"
              lineCount={descLines}
              textAlign="left"
              trackReady={forPrint}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none shrink-0 px-4 py-2 flex justify-between items-center bg-[#fdfaf4] border-t border-[#e8dcc8] z-20" style={{ minHeight: '10%' }}>
        <div className="flex-1 min-w-0">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-6 w-1/4 flex justify-end shrink-0">
            <img src={logoUrl} alt="Logo" className="h-full object-contain" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
