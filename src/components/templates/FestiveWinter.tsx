import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function FestiveWinter({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-[#1a2639] text-[#eef2f8] font-serif overflow-hidden relative border-[4px] border-[#cdd6e4]">
      
      {/* Decorative Silver Inner Border */}
      <div className="absolute inset-[6px] border border-[#cdd6e4] opacity-50 pointer-events-none"></div>

      {/* Top Banner Area */}
      <div className="flex-none flex flex-col justify-center items-center px-4 relative z-10 mb-4 mt-2" style={{ height: '20%' }}>
        <div className="w-[80%] border-t border-b border-[#cdd6e4] py-3 text-center">
          <FitText text={product.producer} maxFontSize={20} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#eef2f8" trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-5 px-3 min-h-0 relative z-10">
        
        {/* Left Column - Details & Bottle */}
        <div className="flex-none w-[45%] flex flex-col">
          <div className="flex-none mb-3 border-b border-[#43526d] pb-2">
            <FitText text={product.name} maxFontSize={14} minFontSize={7} fontStyle="italic" textAlign="left" color="#eef2f8" trackReady={forPrint} />
            <div className="flex justify-between items-end mt-2">
              {product.region && (
                <div className="flex-1">
                  <FitText text={product.region} maxFontSize={9} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.1em" color={config.mutedColor} textAlign="left" trackReady={forPrint} />
                </div>
              )}
              {product.vintage && (
                <div className="w-10 text-right ml-2">
                  <FitText text={product.vintage} maxFontSize={10} minFontSize={6} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {showScore && (
              <div className="flex-none mb-3 flex items-center gap-2">
                <div className="w-12 h-12 bg-[#cdd6e4] text-[#1a2639] flex flex-col items-center justify-center p-1 rounded-full shadow-sm flex-none">
                  <FitText text={String(product.score)} maxFontSize={24} minFontSize={12} fontWeight={900} color="#1a2639" trackReady={forPrint} />
                </div>
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#cdd6e4]">Points</div>
                  {product.reviewer && <div className="text-[6px] font-sans uppercase text-gray-400 mt-0.5 truncate">{product.reviewer}</div>}
                </div>
              </div>
            )}
            
            {showBottle && (
              <div className="flex-1 w-full flex items-end justify-center pt-2">
                <img src={bottleUrl} alt="Bottle" className="w-full h-full object-contain object-bottom filter drop-shadow-md" crossOrigin={forPrint ? 'anonymous' : undefined} />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Ruled Notes */}
        <div className="flex-1 flex flex-col min-w-0 pt-2">
          {/* We simulate ruled lines by relying on FitText's lines mode, but here we can add actual border-bottoms if we render the lines manually, 
              but FitText handles font scaling. Let's use a subtle background stripe. */}
          <div className="flex-1 relative border-l border-[#43526d] pl-4">
            <FitText text={product.description} maxFontSize={12} minFontSize={5} fontStyle="normal" fitMode="lines" lineCount={9} textAlign="left" color="#eef2f8" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none h-[6%] px-3 mt-3 flex justify-between items-center z-10 border-t border-[#43526d] pt-2 mb-1">
        <div className="flex-1">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-full w-1/4 flex justify-end">
            <img src={logoUrl} alt="Logo" className="h-full object-contain" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
