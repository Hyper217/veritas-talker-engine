import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function BurgundyMarble({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col bg-[#f0ede6] text-[#3a1622] font-serif overflow-hidden relative">
      
      {/* Texture Background Overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #d0c8b8 0%, transparent 100%)' }}></div>

      {/* Deep Burgundy Header with Gold Trim */}
      <div className="flex-none bg-[#6b1c32] text-white flex flex-col justify-center items-center px-4 relative z-10 shadow-md border-b-4 border-[#c9a94a]" style={{ height: '22%' }}>
        <div className="w-full text-center mb-1">
          <FitText text={product.producer} maxFontSize={24} minFontSize={10} fontWeight={700} uppercase letterSpacing="0.05em" color="#fff" trackReady={forPrint} />
        </div>
        <div className="w-4/5 text-center">
          <FitText text={product.name} maxFontSize={14} minFontSize={7} fontStyle="italic" color="#f5e9c8" trackReady={forPrint} />
        </div>
      </div>

      {/* Region & Vintage Ribbon */}
      <div className="flex-none h-[6%] bg-[#3a1622] text-[#f5e9c8] flex justify-between items-center px-4 shadow-sm z-10">
        <div className="flex-1">
          {product.region && (
            <FitText text={product.region} maxFontSize={9} minFontSize={5} fontFamily="sans" fontWeight={600} uppercase letterSpacing="0.1em" color="#f5e9c8" trackReady={forPrint} />
          )}
        </div>
        {product.vintage && (
          <div className="w-16 text-right">
            <FitText text={product.vintage} maxFontSize={11} minFontSize={6} fontFamily="sans" fontWeight={700} color="#c9a94a" trackReady={forPrint} />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-3 px-4 py-3 min-h-0 relative z-10">
        
        {/* Left Column — bottle stays inside column bounds */}
        <div className="flex-none w-[45%] flex flex-col min-h-0">
          {showBottle && (
            <div className="flex-1 min-h-0 w-full bg-white shadow-sm p-2 flex items-end justify-center rounded-sm overflow-hidden">
              <img
                src={bottleUrl}
                alt="Bottle"
                className="max-h-full max-w-full object-contain object-bottom"
                crossOrigin={forPrint ? 'anonymous' : undefined}
              />
            </div>
          )}
        </div>

        {/* Right Column — score + notes */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {showScore && (
            <div className="flex-none mb-2 flex items-center gap-3 bg-[#fff] border-y border-r border-[#e8dcc8] rounded-r-full py-1 pr-4 pl-1 shadow-sm relative -left-4">
              <div className="w-12 h-12 bg-[#6b1c32] rounded-full flex flex-col items-center justify-center shadow-md flex-none border-2 border-[#c9a94a]">
                <FitText text={String(product.score)} maxFontSize={22} minFontSize={12} fontWeight={900} color="#f5e9c8" trackReady={forPrint} />
              </div>
              <div className="flex flex-col justify-center text-left flex-1 min-w-0">
                <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#6b1c32]">Points</div>
                {product.reviewer && <div className="text-[6px] font-sans uppercase text-[#8a5a68] mt-0.5 truncate">{product.reviewer}</div>}
              </div>
            </div>
          )}
          
          <div className="flex-1 min-h-0 h-0 bg-white shadow-sm rounded-sm p-3 border-t-2 border-[#6b1c32] overflow-hidden">
            <FitText
              text={product.description}
              maxFontSize={11}
              minFontSize={5}
              fontStyle="italic"
              fitMode="lines"
              lineCount={showScore ? 7 : 9}
              textAlign="left"
              trackReady={forPrint}
            />
          </div>
        </div>
      </div>

      {/* Footer — reserved strip so tags never sit under body content */}
      <div className="flex-none shrink-0 px-4 py-2 flex justify-between items-center mx-2 z-20 bg-[#f0ede6]" style={{ minHeight: '9%' }}>
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
