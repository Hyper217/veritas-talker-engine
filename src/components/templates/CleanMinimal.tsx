import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function CleanMinimal({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;
  const descLines = showScore ? 7 : 9;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-white text-[#111] font-serif border-4 border-[#111] overflow-hidden">

      {/* Title Box */}
      <div className="flex-none border-b-2 border-[#111] pb-2 mb-2 text-center flex flex-col justify-center gap-0.5" style={{ height: '20%' }}>
        <FitText text={product.producer} maxFontSize={22} minFontSize={10} fontWeight={700} uppercase trackReady={forPrint} />
        <FitText text={product.name} maxFontSize={15} minFontSize={8} fontStyle="italic" trackReady={forPrint} />
        {product.region && (
          <div className="mt-0.5">
            <FitText text={product.region} maxFontSize={9} minFontSize={6} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-3 min-h-0">

        {showBottle && (
          <div className="flex-none w-[38%] flex flex-col min-h-0">
            <div className="flex-1 min-h-0 border-2 border-[#111] p-2 flex items-end justify-center overflow-hidden">
              <img src={bottleUrl} alt="Bottle" className="max-h-full max-w-full object-contain object-bottom" crossOrigin={forPrint ? 'anonymous' : undefined} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-none flex justify-between items-start mb-1">
            {showScore && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#111] text-white flex flex-col items-center justify-center rounded-full shadow-sm flex-none">
                  <FitText text={String(product.score)} maxFontSize={22} minFontSize={11} fontWeight={900} color="#fff" trackReady={forPrint} />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#111]">Points</div>
                  {product.reviewer && <div className="text-[6px] font-sans uppercase text-gray-500 mt-0.5 truncate">{product.reviewer}</div>}
                </div>
              </div>
            )}
            {product.vintage && (
              <div className="text-right shrink-0">
                <FitText text={product.vintage} maxFontSize={13} minFontSize={8} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 h-0 border-l-2 border-[#111] pl-2 overflow-hidden">
            <FitText text={product.description} maxFontSize={12} minFontSize={5} fontStyle="italic" fitMode="lines" lineCount={descLines} textAlign="left" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none shrink-0 mt-2 pt-2 border-t-2 border-[#111] flex justify-between items-center bg-white" style={{ minHeight: '9%' }}>
        <div className="flex-1 min-w-0 px-1">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" trackReady={forPrint} />
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
