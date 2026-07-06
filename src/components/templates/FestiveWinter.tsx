import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function FestiveWinter({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;
  const descLines = showScore ? 7 : 9;

  return (
    <div className="w-full h-full flex flex-col p-3 bg-[#1a2639] text-[#eef2f8] font-serif overflow-hidden relative border-[4px] border-[#cdd6e4]">

      <div className="absolute inset-[6px] border border-[#cdd6e4] opacity-50 pointer-events-none" />

      {/* Top Banner */}
      <div className="flex-none flex flex-col justify-center items-center px-4 relative z-10 mb-2 overflow-hidden" style={{ height: '17%' }}>
        <div className="w-[80%] border-t border-b border-[#cdd6e4] py-2 text-center">
          <FitText text={product.producer} maxFontSize={18} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#eef2f8" trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-4 px-2 min-h-0 relative z-10">

        <div className="flex-none w-[45%] flex flex-col min-h-0">
          <div className="flex-none mb-2 border-b border-[#43526d] pb-1">
            <FitText text={product.name} maxFontSize={13} minFontSize={7} fontStyle="italic" textAlign="left" color="#eef2f8" trackReady={forPrint} />
            <div className="flex justify-between items-end mt-1">
              {product.region && (
                <div className="flex-1 min-w-0">
                  <FitText text={product.region} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.1em" color={config.mutedColor} textAlign="left" trackReady={forPrint} />
                </div>
              )}
              {product.vintage && (
                <div className="w-10 text-right shrink-0 ml-2">
                  <FitText text={product.vintage} maxFontSize={10} minFontSize={6} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {showScore && (
              <div className="flex-none mb-2 flex items-center gap-2">
                <div className="w-10 h-10 bg-[#cdd6e4] text-[#1a2639] flex flex-col items-center justify-center rounded-full shadow-sm flex-none">
                  <FitText text={String(product.score)} maxFontSize={22} minFontSize={11} fontWeight={900} color="#1a2639" trackReady={forPrint} />
                </div>
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#cdd6e4]">Points</div>
                  {product.reviewer && <div className="text-[6px] font-sans uppercase text-gray-400 mt-0.5 truncate">{product.reviewer}</div>}
                </div>
              </div>
            )}

            {showBottle && (
              <div className="flex-1 min-h-0 w-full flex items-end justify-center overflow-hidden">
                <img src={bottleUrl} alt="Bottle" className="max-h-full max-w-full object-contain object-bottom filter drop-shadow-md" crossOrigin={forPrint ? 'anonymous' : undefined} />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0 pt-1">
          <div className="flex-1 min-h-0 h-0 relative border-l border-[#43526d] pl-3 overflow-hidden">
            <FitText text={product.description} maxFontSize={11} minFontSize={5} fontStyle="normal" fitMode="lines" lineCount={descLines} textAlign="left" color="#eef2f8" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none shrink-0 px-3 py-2 flex justify-between items-center z-20 border-t border-[#43526d] bg-[#1a2639]" style={{ minHeight: '9%' }}>
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
