import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function AutumnHarvest({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#f5b667] via-[#f3a144] to-[#e17424] text-[#5c1d12] font-serif overflow-hidden relative">
      
      {/* Decorative Border */}
      <div className="absolute inset-2 border-[3px] border-[#8b2500] pointer-events-none opacity-80"></div>
      <div className="absolute inset-3 border border-[#8b2500] pointer-events-none opacity-50"></div>

      {/* Banner Area */}
      <div className="flex-none bg-[#8b2500] text-[#fdfbf7] mx-6 mt-6 shadow-lg flex flex-col justify-center items-center py-3 px-4 relative z-10 rounded-sm" style={{ height: '16%' }}>
        {/* Banner Tails (Pure CSS magic) */}
        <div className="absolute -left-3 top-2 bottom-2 w-3 bg-[#5c1d12] -z-10 transform skew-y-12"></div>
        <div className="absolute -right-3 top-2 bottom-2 w-3 bg-[#5c1d12] -z-10 transform -skew-y-12"></div>
        
        <div className="w-full text-center mb-1">
          <FitText text={product.producer} maxFontSize={20} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#fdfbf7" trackReady={forPrint} />
        </div>
        <div className="w-[85%] text-center">
          <FitText text={product.name} maxFontSize={13} minFontSize={7} fontStyle="italic" color="#f5b667" trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-4 px-6 pt-4 pb-2 min-h-0 relative z-10">
        
        {/* Left Column */}
        <div className="flex-none w-[45%] flex flex-col h-full">
          <div className="flex-none mb-2">
            {product.region && (
              <div className="mb-1">
                <FitText text={product.region} maxFontSize={10} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.textColor} textAlign="left" trackReady={forPrint} />
              </div>
            )}
            <div className="flex justify-between items-end">
              {showScore && (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#8b2500] text-white flex flex-col items-center justify-center p-1 rounded-full shadow-md flex-none">
                    <FitText text={String(product.score)} maxFontSize={24} minFontSize={12} fontWeight={900} color="#fff" trackReady={forPrint} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#8b2500]">Score</div>
                    {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#5c1d12] mt-0.5 truncate">{product.reviewer}</div>}
                  </div>
                </div>
              )}
              {product.vintage && (
                <div className="w-12 text-right">
                  <FitText text={product.vintage} maxFontSize={11} minFontSize={6} fontFamily="sans" fontWeight={800} color={config.textColor} trackReady={forPrint} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex items-end justify-center pt-2">
            {showBottle && (
              <img src={bottleUrl} alt="Bottle" className="w-full h-full object-contain object-bottom drop-shadow-xl" crossOrigin={forPrint ? 'anonymous' : undefined} />
            )}
          </div>
        </div>

        {/* Right Column - Notes Box */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fdfaf4] border-2 border-[#8b2500] p-3 shadow-lg rounded-sm mb-4 relative z-10">
          <div className="flex-1">
            <FitText text={product.description} maxFontSize={11} minFontSize={5} fontStyle="italic" fitMode="lines" lineCount={12} textAlign="left" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="flex-none h-[6%] px-6 mb-4 flex justify-between items-center z-10">
        <div className="flex-1">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={800} uppercase letterSpacing="0.1em" color={config.textColor} trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-full w-1/4 flex justify-end">
            <img src={logoUrl} alt="Logo" className="h-full object-contain mix-blend-multiply" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
