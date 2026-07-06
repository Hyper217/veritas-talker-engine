import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function BotanicalGreen({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;
  const descLines = showScore ? 6 : 8;

  return (
    <div className="w-full h-full flex flex-col p-3 bg-[#e6dfd3] text-[#433521] font-serif relative overflow-hidden">

      <div className="absolute inset-2 border-2 border-[#5a6b4a] rounded-xl pointer-events-none opacity-50" />
      <div className="absolute inset-3 border border-[#5a6b4a] rounded-lg pointer-events-none opacity-30" />

      {/* Ribbon-style Header */}
      <div className="flex-none bg-[#5a6b4a] text-[#fdfbf7] mx-3 mt-1 rounded-t-lg shadow-sm flex flex-col justify-center items-center px-3 relative z-10 overflow-hidden" style={{ height: '20%' }}>
        <div className="w-full text-center mb-0.5">
          <FitText text={product.producer} maxFontSize={20} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#fdfbf7" trackReady={forPrint} />
        </div>
        <div className="w-4/5 text-center">
          <FitText text={product.name} maxFontSize={12} minFontSize={7} fontStyle="italic" color="#e6dfd3" trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-3 px-3 py-2 min-h-0 relative z-10">

        <div className="flex-none w-[45%] flex flex-col min-h-0">
          <div className="flex-none flex justify-between items-end mb-1">
            {product.region && (
              <div className="flex-1 min-w-0">
                <FitText text={product.region} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
              </div>
            )}
            {product.vintage && (
              <div className="w-10 text-right shrink-0">
                <FitText text={product.vintage} maxFontSize={10} minFontSize={6} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
              </div>
            )}
          </div>

          {showBottle ? (
            <div className="flex-1 min-h-0 w-full bg-white shadow-sm p-2 flex items-end justify-center rounded-lg border border-[#c4bba9] overflow-hidden">
              <img src={bottleUrl} alt="Bottle" className="max-h-full max-w-full object-contain object-bottom" crossOrigin={forPrint ? 'anonymous' : undefined} />
            </div>
          ) : (
            <div className="flex-1 min-h-0" />
          )}
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#fdfbf7] border border-[#c4bba9] p-2 shadow-sm rounded-lg overflow-hidden">
          {showScore && (
            <div className="flex-none flex items-center gap-2 mb-2 border-b border-[#e6dfd3] pb-2">
              <div className="w-10 h-10 bg-[#5a6b4a] text-[#fdfbf7] flex flex-col items-center justify-center rounded-full shadow-sm flex-none">
                <FitText text={String(product.score)} maxFontSize={22} minFontSize={11} fontWeight={900} color="#fdfbf7" trackReady={forPrint} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#5a6b4a]">Rating</div>
                {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#6b5a48] mt-0.5 truncate">{product.reviewer}</div>}
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 h-0 overflow-hidden">
            <FitText text={product.description} maxFontSize={10} minFontSize={5} fontStyle="italic" fitMode="lines" lineCount={descLines} textAlign="left" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none shrink-0 bg-[#5a6b4a] mx-3 mb-1 rounded-b-lg px-3 py-2 flex justify-between items-center z-20 shadow-sm" style={{ minHeight: '9%' }}>
        <div className="flex-1 min-w-0">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color="#fdfbf7" trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-5 w-1/4 flex justify-end shrink-0">
            <img src={logoUrl} alt="Logo" className="h-full object-contain bg-white rounded-sm px-1" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
