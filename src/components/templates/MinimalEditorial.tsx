import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function MinimalEditorial({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col p-5 bg-[#fafafa] text-[#1a1a1a] font-serif border border-gray-200 shadow-sm relative">
      
      {/* Top Title Section */}
      <div className="flex-none text-center flex flex-col justify-center mb-6" style={{ height: '20%' }}>
        <FitText text={product.producer} maxFontSize={26} minFontSize={12} fontWeight={700} uppercase letterSpacing="0.05em" trackReady={forPrint} />
        <div className="mt-1">
          <FitText text={product.name} maxFontSize={16} minFontSize={8} fontStyle="italic" color="#444" trackReady={forPrint} />
        </div>
        {product.region && (
          <div className="mt-2 border-t border-gray-300 pt-2 mx-auto w-3/4">
            <FitText text={product.region} maxFontSize={9} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.15em" color={config.mutedColor} trackReady={forPrint} />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-6 min-h-0 relative">
        
        {/* Left - Bottle */}
        {showBottle && (
          <div className="flex-none w-2/5 flex flex-col items-center">
            {showScore && (
              <div className="mb-3 w-full flex items-center justify-center gap-2 border-b border-dotted border-gray-400 pb-3">
                <div className="w-10 h-10 bg-[#1a1a1a] flex-none rounded-full flex flex-col items-center justify-center p-1 text-white">
                  <FitText text={String(product.score)} maxFontSize={18} minFontSize={10} fontFamily="sans" fontWeight={800} color="#fff" trackReady={forPrint} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#1a1a1a]">Points</div>
                  {product.reviewer && <div className="text-[6px] font-sans uppercase text-gray-500 mt-0.5">{product.reviewer}</div>}
                </div>
              </div>
            )}
            <div className="flex-1 w-full bg-white border border-gray-200 p-2 shadow-sm">
              <img src={bottleUrl} alt="Bottle" className="w-full h-full object-contain object-bottom" crossOrigin={forPrint ? 'anonymous' : undefined} />
            </div>
          </div>
        )}

        {/* Right - Description */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-end mb-2 border-b-2 border-[#1a1a1a] pb-1">
            <div className="text-[8px] font-sans font-bold uppercase tracking-widest text-gray-400">Tasting Notes</div>
            {product.vintage && (
              <div className="w-12">
                <FitText text={product.vintage} maxFontSize={12} minFontSize={6} fontFamily="sans" fontWeight={700} trackReady={forPrint} />
              </div>
            )}
          </div>
          
          <div className="flex-1 leading-relaxed">
            <FitText text={product.description} maxFontSize={12} minFontSize={6} fontStyle="normal" fitMode="lines" lineCount={9} textAlign="left" color="#333" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="flex-none mt-4 h-[6%] grid grid-cols-4 gap-2 border-t-2 border-[#1a1a1a] pt-2">
        <div className="col-span-3 flex items-center">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
          )}
        </div>
        <div className="col-span-1 flex justify-end items-center">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="h-full object-contain max-h-[20px]" crossOrigin={forPrint ? 'anonymous' : undefined} />
          )}
        </div>
      </div>

    </div>
  );
}
