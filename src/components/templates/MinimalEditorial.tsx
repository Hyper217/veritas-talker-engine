import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function MinimalEditorial({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;
  const descLines = showScore ? 6 : 8;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-[#fafafa] text-[#1a1a1a] font-serif border border-gray-200 shadow-sm relative overflow-hidden">

      {/* Top Title Section */}
      <div className="flex-none text-center flex flex-col justify-center mb-3 overflow-hidden" style={{ height: '18%' }}>
        <FitText text={product.producer} maxFontSize={24} minFontSize={12} fontWeight={700} uppercase letterSpacing="0.05em" trackReady={forPrint} />
        <div className="mt-0.5">
          <FitText text={product.name} maxFontSize={15} minFontSize={8} fontStyle="italic" color="#444" trackReady={forPrint} />
        </div>
        {product.region && (
          <div className="mt-1 border-t border-gray-300 pt-1 mx-auto w-3/4">
            <FitText text={product.region} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.15em" color={config.mutedColor} trackReady={forPrint} />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-4 min-h-0 relative">

        {showBottle && (
          <div className="flex-none w-2/5 flex flex-col min-h-0">
            {showScore && (
              <div className="flex-none mb-2 w-full flex items-center justify-center gap-2 border-b border-dotted border-gray-400 pb-2">
                <div className="w-10 h-10 bg-[#1a1a1a] flex-none rounded-full flex flex-col items-center justify-center text-white">
                  <FitText text={String(product.score)} maxFontSize={18} minFontSize={10} fontFamily="sans" fontWeight={800} color="#fff" trackReady={forPrint} />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#1a1a1a]">Points</div>
                  {product.reviewer && <div className="text-[6px] font-sans uppercase text-gray-500 mt-0.5 truncate">{product.reviewer}</div>}
                </div>
              </div>
            )}
            <div className="flex-1 min-h-0 w-full bg-white border border-gray-200 p-2 shadow-sm overflow-hidden flex items-end justify-center">
              <img src={bottleUrl} alt="Bottle" className="max-h-full max-w-full object-contain object-bottom" crossOrigin={forPrint ? 'anonymous' : undefined} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-none flex justify-between items-end mb-1 border-b-2 border-[#1a1a1a] pb-1">
            <div className="text-[8px] font-sans font-bold uppercase tracking-widest text-gray-400">Tasting Notes</div>
            {product.vintage && (
              <div className="w-12 shrink-0">
                <FitText text={product.vintage} maxFontSize={11} minFontSize={6} fontFamily="sans" fontWeight={700} trackReady={forPrint} />
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 h-0 overflow-hidden">
            <FitText text={product.description} maxFontSize={11} minFontSize={5} fontStyle="normal" fitMode="lines" lineCount={descLines} textAlign="left" color="#333" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none shrink-0 mt-2 grid grid-cols-4 gap-2 border-t-2 border-[#1a1a1a] pt-2 bg-[#fafafa]" style={{ minHeight: '9%' }}>
        <div className="col-span-3 flex items-center min-w-0">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
          )}
        </div>
        <div className="col-span-1 flex justify-end items-center">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="h-5 object-contain" crossOrigin={forPrint ? 'anonymous' : undefined} />
          )}
        </div>
      </div>

    </div>
  );
}
