import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function ArtDeco({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-[#0a0a0a] text-[#f5e9c8] font-serif overflow-hidden relative border-[6px] border-[#0a0a0a]">
      
      {/* Outer Gold Border */}
      <div className="absolute inset-2 border-2 border-[#D4AF37] pointer-events-none"></div>
      <div className="absolute inset-[14px] border border-[#D4AF37] opacity-60 pointer-events-none"></div>

      {/* Title Banner */}
      <div className="flex-none flex flex-col justify-center items-center px-8 relative z-10 mt-6 mb-2" style={{ height: '18%' }}>
        <div className="w-full text-center border-b border-[#D4AF37] pb-2 mb-2">
          <FitText text={product.producer} maxFontSize={20} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.1em" color={config.accentColor} trackReady={forPrint} />
        </div>
        <div className="w-[90%] text-center">
          <FitText text={product.name} maxFontSize={13} minFontSize={7} fontStyle="italic" color={config.textColor} trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-4 px-6 min-h-0 relative z-10">
        
        {/* Left Column - Bottle (Arched) */}
        <div className="flex-none w-[45%] flex flex-col">
          <div className="flex-1 w-full border border-[#D4AF37] rounded-t-full p-2 flex items-end justify-center relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
            {/* Inner Arch Line */}
            <div className="absolute inset-2 border border-[#D4AF37] opacity-50 rounded-t-full pointer-events-none"></div>
            {showBottle && (
              <img src={bottleUrl} alt="Bottle" className="w-full h-[90%] object-contain object-bottom drop-shadow-2xl z-10" crossOrigin={forPrint ? 'anonymous' : undefined} />
            )}
          </div>
        </div>

        {/* Right Column - Score & Notes */}
        <div className="flex-1 flex flex-col min-w-0 pt-2">
          
          <div className="flex-none mb-3">
            {product.region && (
              <div className="mb-2 border-b border-[#333] pb-1">
                <FitText text={product.region} maxFontSize={10} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.15em" color={config.mutedColor} textAlign="left" trackReady={forPrint} />
              </div>
            )}
            
            <div className="flex justify-between items-end mt-2">
              {showScore && (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#D4AF37] text-[#0a0a0a] flex flex-col items-center justify-center p-1 rounded-full shadow-sm flex-none">
                    <FitText text={String(product.score)} maxFontSize={24} minFontSize={12} fontWeight={900} color="#0a0a0a" trackReady={forPrint} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#D4AF37]">Rating</div>
                    {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#c9a94a] mt-0.5 truncate">{product.reviewer}</div>}
                  </div>
                </div>
              )}
              {product.vintage && (
                <div className="w-12 text-right">
                  <FitText text={product.vintage} maxFontSize={11} minFontSize={6} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-h-0 mt-2 border-t border-[#D4AF37] pt-3">
            <FitText text={product.description} maxFontSize={12} minFontSize={5} fontStyle="normal" fitMode="lines" lineCount={10} textAlign="left" color={config.textColor} trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="flex-none h-[6%] px-6 mt-4 flex justify-between items-center z-10 border-t border-[#D4AF37] pt-2 mb-2">
        <div className="flex-1">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.accentColor} trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-full w-1/4 flex justify-end">
            <img src={logoUrl} alt="Logo" className="h-full object-contain filter brightness-0 invert sepia hue-rotate-[20deg] saturate-[200%]" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
