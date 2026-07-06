import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function BotanicalGreen({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-[#e6dfd3] text-[#433521] font-serif relative">
      
      {/* Decorative Border */}
      <div className="absolute inset-2 border-2 border-[#5a6b4a] rounded-xl pointer-events-none opacity-50"></div>
      <div className="absolute inset-3 border border-[#5a6b4a] rounded-lg pointer-events-none opacity-30"></div>

      {/* Ribbon-style Header */}
      <div className="flex-none bg-[#5a6b4a] text-[#fdfbf7] mx-4 mt-2 rounded-t-lg shadow-sm flex flex-col justify-center items-center p-3 relative z-10" style={{ height: '22%' }}>
        <div className="w-full text-center mb-1">
          <FitText text={product.producer} maxFontSize={22} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#fdfbf7" trackReady={forPrint} />
        </div>
        <div className="w-4/5 text-center">
          <FitText text={product.name} maxFontSize={13} minFontSize={7} fontStyle="italic" color="#e6dfd3" trackReady={forPrint} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 relative z-10 mt-1">
        
        {/* Left Column */}
        <div className="flex-none w-[45%] flex flex-col">
          <div className="flex justify-between items-end mb-2">
            {product.region && (
              <div className="flex-1">
                <FitText text={product.region} maxFontSize={9} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
              </div>
            )}
            {product.vintage && (
              <div className="w-10 text-right">
                <FitText text={product.vintage} maxFontSize={10} minFontSize={6} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
              </div>
            )}
          </div>

          {showBottle ? (
            <div className="flex-1 w-full bg-white shadow-sm p-2 flex items-end justify-center rounded-lg border border-[#c4bba9]">
              <img src={bottleUrl} alt="Bottle" className="w-full h-full object-contain object-bottom" crossOrigin={forPrint ? 'anonymous' : undefined} />
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>

        {/* Right Column - Score & Notes */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fdfbf7] border border-[#c4bba9] p-3 shadow-sm rounded-lg relative">
          
          {showScore && (
            <div className="flex items-center gap-2 mb-3 border-b border-[#e6dfd3] pb-3">
              <div className="w-12 h-12 bg-[#5a6b4a] text-[#fdfbf7] flex flex-col items-center justify-center p-1 rounded-full shadow-sm flex-none">
                <FitText text={String(product.score)} maxFontSize={24} minFontSize={12} fontWeight={900} color="#fdfbf7" trackReady={forPrint} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#5a6b4a]">Rating</div>
                {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#6b5a48] mt-0.5 truncate">{product.reviewer}</div>}
              </div>
            </div>
          )}
          
          <div className="flex-1">
            <FitText text={product.description} maxFontSize={11} minFontSize={5} fontStyle="italic" fitMode="lines" lineCount={11} textAlign="left" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="flex-none h-[7%] bg-[#5a6b4a] mx-4 mb-2 rounded-b-lg px-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex-1">
          {tagText && (
            <FitText text={tagText} maxFontSize={8} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color="#fdfbf7" trackReady={forPrint} />
          )}
        </div>
        {logoUrl && (
          <div className="h-full w-1/4 flex justify-end py-1">
            <img src={logoUrl} alt="Logo" className="h-full object-contain bg-white rounded-sm px-1" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}
      </div>

    </div>
  );
}
