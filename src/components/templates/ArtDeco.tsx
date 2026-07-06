import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function ArtDeco({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;
  const descLines = showScore ? 7 : 9;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-[#0a0a0a] text-[#f5e9c8] font-serif overflow-hidden relative border-[6px] border-[#0a0a0a]">

      <div className="absolute inset-2 border-2 border-[#D4AF37] pointer-events-none" />
      <div className="absolute inset-[14px] border border-[#D4AF37] opacity-60 pointer-events-none" />

      {/* Title Banner */}
      <div className="flex-none flex flex-col justify-center items-center px-6 relative z-10" style={{ height: '18%' }}>
        <div className="w-full text-center border-b border-[#D4AF37] pb-1 mb-1">
          <FitText text={product.producer} maxFontSize={20} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.1em" color={config.accentColor} trackReady={forPrint} />
        </div>
        <div className="w-[90%] text-center">
          <FitText text={product.name} maxFontSize={13} minFontSize={7} fontStyle="italic" color={config.textColor} trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-3 px-4 min-h-0 relative z-10">

        {/* Left Column - Bottle (Arched) */}
        <div className="flex-none w-[45%] flex flex-col min-h-0">
          <div className="flex-1 min-h-0 w-full border border-[#D4AF37] rounded-t-full p-2 flex items-end justify-center relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
            <div className="absolute inset-2 border border-[#D4AF37] opacity-50 rounded-t-full pointer-events-none" />
            {showBottle && (
              <img src={bottleUrl} alt="Bottle" className="max-h-[92%] max-w-full object-contain object-bottom drop-shadow-2xl z-10" crossOrigin={forPrint ? 'anonymous' : undefined} />
            )}
          </div>
        </div>

        {/* Right Column - Score & Notes */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 pt-1">

          <div className="flex-none mb-2">
            {product.region && (
              <div className="mb-1 border-b border-[#333] pb-1">
                <FitText text={product.region} maxFontSize={10} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.15em" color={config.mutedColor} textAlign="left" trackReady={forPrint} />
              </div>
            )}

            <div className="flex justify-between items-end">
              {showScore && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#D4AF37] text-[#0a0a0a] flex flex-col items-center justify-center rounded-full shadow-sm flex-none">
                    <FitText text={String(product.score)} maxFontSize={22} minFontSize={11} fontWeight={900} color="#0a0a0a" trackReady={forPrint} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#D4AF37]">Rating</div>
                    {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#c9a94a] mt-0.5 truncate">{product.reviewer}</div>}
                  </div>
                </div>
              )}
              {product.vintage && (
                <div className="w-12 text-right shrink-0">
                  <FitText text={product.vintage} maxFontSize={11} minFontSize={6} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 h-0 border-t border-[#D4AF37] pt-2 overflow-hidden">
            <FitText text={product.description} maxFontSize={11} minFontSize={5} fontStyle="normal" fitMode="lines" lineCount={descLines} textAlign="left" color={config.textColor} trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none shrink-0 px-4 py-2 flex justify-between items-center z-20 border-t border-[#D4AF37] bg-[#0a0a0a]" style={{ minHeight: '9%' }}>
        <div className="flex-1 min-w-0">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.accentColor} trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-6 w-1/4 flex justify-end shrink-0">
            <img src={logoUrl} alt="Logo" className="h-full object-contain filter brightness-0 invert sepia hue-rotate-[20deg] saturate-[200%]" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
