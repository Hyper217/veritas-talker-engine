import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function AutumnHarvest({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;
  const descLines = 8;

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#f5b667] via-[#f3a144] to-[#e17424] text-[#5c1d12] font-serif overflow-hidden relative">

      <div className="absolute inset-2 border-[3px] border-[#8b2500] pointer-events-none opacity-80" />
      <div className="absolute inset-3 border border-[#8b2500] pointer-events-none opacity-50" />

      {/* Banner Area */}
      <div className="flex-none bg-[#8b2500] text-[#fdfbf7] mx-5 mt-4 shadow-lg flex flex-col justify-center items-center py-2 px-3 relative z-10 rounded-sm overflow-hidden" style={{ height: '15%' }}>
        <div className="absolute -left-3 top-2 bottom-2 w-3 bg-[#5c1d12] -z-10 transform skew-y-12" />
        <div className="absolute -right-3 top-2 bottom-2 w-3 bg-[#5c1d12] -z-10 transform -skew-y-12" />

        <div className="w-full text-center mb-0.5">
          <FitText text={product.producer} maxFontSize={18} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#fdfbf7" trackReady={forPrint} />
        </div>
        <div className="w-[85%] text-center">
          <FitText text={product.name} maxFontSize={12} minFontSize={7} fontStyle="italic" color="#f5b667" trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-3 px-5 py-2 min-h-0 relative z-10">

        <div className="flex-none w-[45%] flex flex-col min-h-0">
          <div className="flex-none mb-1">
            {product.region && (
              <div className="mb-0.5">
                <FitText text={product.region} maxFontSize={9} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.textColor} textAlign="left" trackReady={forPrint} />
              </div>
            )}
            <div className="flex justify-between items-end">
              {showScore && (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 bg-[#8b2500] text-white flex flex-col items-center justify-center rounded-full shadow-md flex-none">
                    <FitText text={String(product.score)} maxFontSize={22} minFontSize={11} fontWeight={900} color="#fff" trackReady={forPrint} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#8b2500]">Score</div>
                    {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#5c1d12] mt-0.5 truncate">{product.reviewer}</div>}
                  </div>
                </div>
              )}
              {product.vintage && (
                <div className="w-12 text-right shrink-0">
                  <FitText text={product.vintage} maxFontSize={11} minFontSize={6} fontFamily="sans" fontWeight={800} color={config.textColor} trackReady={forPrint} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex items-end justify-center overflow-hidden">
            {showBottle && (
              <img src={bottleUrl} alt="Bottle" className="max-h-full max-w-full object-contain object-bottom drop-shadow-xl" crossOrigin={forPrint ? 'anonymous' : undefined} />
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#fdfaf4] border-2 border-[#8b2500] p-2 shadow-lg rounded-sm overflow-hidden">
          <div className="flex-1 min-h-0 h-0 overflow-hidden">
            <FitText text={product.description} maxFontSize={10} minFontSize={5} fontStyle="italic" fitMode="lines" lineCount={descLines} textAlign="left" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none shrink-0 px-5 py-2 flex justify-between items-center z-20" style={{ minHeight: '9%' }}>
        <div className="flex-1 min-w-0">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={800} uppercase letterSpacing="0.1em" color={config.textColor} trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-6 w-1/4 flex justify-end shrink-0">
            <img src={logoUrl} alt="Logo" className="h-full object-contain mix-blend-multiply" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
