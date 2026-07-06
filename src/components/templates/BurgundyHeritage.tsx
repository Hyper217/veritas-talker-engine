import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function BurgundyHeritage({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col bg-[#fdfaf4] text-[#3a1622] font-serif overflow-hidden relative border-[6px] border-[#3a1622]">
      
      {/* Deep Burgundy Header */}
      <div className="flex-none bg-[#7a1f38] text-[#fdfaf4] flex flex-col justify-center items-center px-4 relative shadow-md z-10" style={{ height: '24%' }}>
        <div className="absolute inset-2 border border-[#fdfaf4] opacity-30"></div>
        <div className="w-full text-center mb-1">
          <FitText text={product.producer} maxFontSize={24} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#fdfaf4" trackReady={forPrint} />
        </div>
        <div className="w-4/5 text-center">
          <FitText text={product.name} maxFontSize={14} minFontSize={7} fontStyle="italic" color="#fdfaf4" trackReady={forPrint} />
        </div>
        {product.region && (
          <div className="mt-2 text-center w-3/4 opacity-80">
            <FitText text={product.region} maxFontSize={9} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.1em" color="#fdfaf4" trackReady={forPrint} />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 relative">
        
        {/* Left Column */}
        <div className="flex-none w-[45%] flex flex-col">
          {showBottle ? (
            <div className="flex-1 w-full border border-[#d8c3a5] p-2 bg-[#f8f1e5] shadow-inner rounded-sm flex items-end justify-center overflow-hidden">
              <img src={bottleUrl} alt="Bottle" className="w-full h-full object-contain object-bottom" crossOrigin={forPrint ? 'anonymous' : undefined} />
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>

        {/* Right Column - Score & Notes */}
        <div className="flex-1 flex flex-col min-w-0 border border-[#d8c3a5] bg-white p-3 shadow-sm rounded-sm relative">
          
          <div className="flex justify-between items-start mb-3 border-b border-[#e8dcc8] pb-2">
            {showScore && (
              <div className="flex items-center gap-2 w-2/3">
                <div className="w-12 h-12 bg-[#7a1f38] text-[#fdfaf4] flex flex-col items-center justify-center p-1 rounded-full shadow-inner flex-none border border-[#d8c3a5]">
                  <FitText text={String(product.score)} maxFontSize={24} minFontSize={12} fontWeight={900} color="#fdfaf4" trackReady={forPrint} />
                </div>
                <div className="flex flex-col">
                  <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#7a1f38]">Rating</div>
                  {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#8a5a68] mt-0.5">{product.reviewer}</div>}
                </div>
              </div>
            )}
            {product.vintage && (
              <div className="text-right w-1/2 flex items-center justify-end h-full">
                <FitText text={product.vintage} maxFontSize={12} minFontSize={7} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <FitText text={product.description} maxFontSize={11} minFontSize={5} fontStyle="italic" fitMode="lines" lineCount={12} textAlign="left" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none h-[6%] px-4 pb-3 flex justify-between items-center bg-[#fdfaf4] border-t border-[#e8dcc8] mx-4 pt-2">
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
