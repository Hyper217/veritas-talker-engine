import type { TemplateProps } from './TemplateProps';
import FitText from '../FitText';

export default function CleanMinimal({ product, config, bottleUrl, logoUrl, tagText, forPrint }: TemplateProps) {
  const showScore = product.showScore && product.score !== null;
  const showBottle = product.showBottle && !!bottleUrl;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-white text-[#111] font-serif border-4 border-[#111]">
      
      {/* Title Box */}
      <div className="flex-none border-b-2 border-[#111] pb-3 mb-3 text-center flex flex-col justify-center gap-1" style={{ height: '22%' }}>
        <FitText text={product.producer} maxFontSize={24} minFontSize={10} fontWeight={700} uppercase trackReady={forPrint} />
        <FitText text={product.name} maxFontSize={16} minFontSize={8} fontStyle="italic" trackReady={forPrint} />
        {product.region && (
          <div className="mt-1">
            <FitText text={product.region} maxFontSize={10} minFontSize={6} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" color={config.mutedColor} trackReady={forPrint} />
          </div>
        )}
      </div>

      {/* Main Body Split */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Left Column - Bottle */}
        {showBottle && (
          <div className="flex-none w-1/3 border-2 border-[#111] p-2 flex items-end justify-center h-[85%]">
            <img src={bottleUrl} alt="Bottle" className="w-full h-full object-contain object-bottom" crossOrigin={forPrint ? 'anonymous' : undefined} />
          </div>
        )}

        {/* Right Column - Notes */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start mb-2">
            {showScore && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 bg-[#111] text-white flex flex-col items-center justify-center p-1 rounded-full shadow-sm flex-none">
                  <FitText text={String(product.score)} maxFontSize={24} minFontSize={12} fontWeight={900} color="#fff" trackReady={forPrint} />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-[7px] font-sans uppercase tracking-widest font-bold text-[#111]">Points</div>
                  {product.reviewer && <div className="text-[6px] font-sans uppercase text-gray-500 mt-0.5">{product.reviewer}</div>}
                </div>
              </div>
            )}
            {product.vintage && (
              <div className="text-right">
                <FitText text={product.vintage} maxFontSize={14} minFontSize={8} fontFamily="sans" fontWeight={700} color={config.mutedColor} trackReady={forPrint} />
              </div>
            )}
          </div>
          
          <div className="flex-1 border-l-2 border-[#111] pl-3">
            <FitText text={product.description} maxFontSize={13} minFontSize={6} fontStyle="italic" fitMode="lines" lineCount={10} textAlign="left" trackReady={forPrint} />
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="flex-none mt-3 pt-2 border-t-2 border-[#111] flex justify-between items-center h-[8%]">
        <div className="flex-1 px-2">
          {tagText && (
            <FitText text={tagText} maxFontSize={9} minFontSize={5} fontFamily="sans" fontWeight={700} uppercase letterSpacing="0.1em" trackReady={forPrint} />
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
