import type { ReactNode } from 'react';
import FitText from '../FitText';
import { cn } from '../../lib/utils';
import { getOccupancy } from '../../lib/talkerOccupancy';
import { BOTTLE_COL_PCT, FOOTER_MIN_PCT, IDENTITY_BAND_PCT, TYPE_SCALE } from '../../lib/typeScale';
import type { TemplateProps } from './TemplateProps';

export interface TalkerChrome {
  rootClassName: string;
  overlays?: ReactNode;
  identityClassName: string;
  identityDecor?: ReactNode;
  bodyClassName?: string;
  bottleWellClassName: string;
  pickupClassName: string;
  footerClassName: string;
  scoreBubbleClassName: string;
  scoreLabel: string;
  scoreLabelClassName?: string;
  reviewerClassName?: string;
  logoClassName?: string;
  nameFontStyle?: 'normal' | 'italic';
  notesFontStyle?: 'normal' | 'italic';
  producerLetterSpacing?: string;
  colors: {
    name: string;
    producer: string;
    numeral: string;
    price: string;
    hook: string;
    notes: string;
    region: string;
    tags: string;
    scoreNumber: string;
  };
}

interface ShellProps extends TemplateProps {
  chrome: TalkerChrome;
}

export default function TalkerShell({
  product,
  bottleUrl,
  logoUrl,
  tagText,
  forPrint,
  distancePreview = false,
  chrome,
}: ShellProps) {
  const occ = getOccupancy(product, bottleUrl, logoUrl, tagText);
  const dimPickup = distancePreview && !forPrint;
  const pickupDimClass = dimPickup ? 'talker-distance-pickup' : '';

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col overflow-hidden relative font-serif',
        chrome.rootClassName,
      )}
    >
      {chrome.overlays}

      {/* Identity — full-width, name-first, dual-distance */}
      <div
        className={cn(
          'flex-none flex flex-col justify-center items-center relative z-10 overflow-hidden',
          chrome.identityClassName,
        )}
        style={{ height: `${IDENTITY_BAND_PCT}%` }}
      >
        {chrome.identityDecor}

        <div className="w-full flex-1 min-h-0 flex items-center justify-center px-1">
          <FitText
            field="name"
            text={product.name}
            maxFontSize={TYPE_SCALE.name.max}
            minFontSize={TYPE_SCALE.name.min}
            fontWeight={700}
            fontStyle={chrome.nameFontStyle ?? 'normal'}
            color={chrome.colors.name}
            textAlign="center"
            fitMode="box"
            paddingY={1}
            trackReady={forPrint}
          />
        </div>

        {product.producer && (
          <div className="w-[92%] flex-none" style={{ height: '16%' }}>
            <FitText
              field="producer"
              text={product.producer}
              maxFontSize={TYPE_SCALE.producer.max}
              minFontSize={TYPE_SCALE.producer.min}
              fontWeight={600}
              uppercase
              letterSpacing={chrome.producerLetterSpacing ?? '0.12em'}
              color={chrome.colors.producer}
              textAlign="center"
              fitMode="single"
              trackReady={forPrint}
            />
          </div>
        )}

        {occ.showNumerals && (
          <div
            className="flex-none flex items-baseline justify-center gap-3 w-full px-2"
            style={{ height: '24%' }}
          >
            {occ.showVintage && (
              <div className="min-w-0" style={{ width: occ.showPrice ? '42%' : '70%' }}>
                <FitText
                  field="vintage"
                  text={product.vintage}
                  maxFontSize={TYPE_SCALE.numeral.max}
                  minFontSize={TYPE_SCALE.numeral.min}
                  fontWeight={700}
                  fontFamily="sans"
                  color={chrome.colors.numeral}
                  textAlign="center"
                  fitMode="single"
                  trackReady={forPrint}
                />
              </div>
            )}
            {occ.showVintage && occ.showPrice && (
              <span
                className="flex-none opacity-40 text-[10px] leading-none"
                style={{ color: chrome.colors.numeral }}
              >
                ·
              </span>
            )}
            {occ.showPrice && (
              <div className="min-w-0" style={{ width: occ.showVintage ? '42%' : '70%' }}>
                <FitText
                  field="price"
                  text={product.price}
                  maxFontSize={TYPE_SCALE.numeral.max}
                  minFontSize={TYPE_SCALE.numeral.min}
                  fontWeight={700}
                  fontFamily="sans"
                  color={chrome.colors.price}
                  textAlign="center"
                  fitMode="single"
                  trackReady={forPrint}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body — supporting bottle + pickup column */}
      <div
        className={cn(
          'flex-1 flex min-h-0 relative z-10',
          chrome.bodyClassName,
        )}
      >
        {occ.showBottle && (
          <div
            className="flex-none flex flex-col min-h-0 pr-2"
            style={{ width: `${BOTTLE_COL_PCT}%` }}
          >
            <div
              className={cn(
                'flex-1 min-h-0 w-full flex items-end justify-center overflow-hidden',
                chrome.bottleWellClassName,
              )}
            >
              <img
                src={bottleUrl}
                alt=""
                className="max-h-[94%] max-w-full object-contain object-bottom"
                crossOrigin={forPrint ? 'anonymous' : undefined}
              />
            </div>
          </div>
        )}

        <div
          className={cn(
            'flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden',
            chrome.pickupClassName,
            pickupDimClass,
          )}
        >
          {occ.showHook && (
            <div className="flex-none" style={{ height: occ.showScore ? '18%' : '22%' }}>
              <FitText
                field="hook"
                text={product.hook}
                maxFontSize={TYPE_SCALE.hook.max}
                minFontSize={TYPE_SCALE.hook.min}
                fontWeight={600}
                fontStyle="italic"
                color={chrome.colors.hook}
                textAlign="left"
                fitMode="lines"
                lineCount={occ.hookLineCount}
                trackReady={forPrint}
              />
            </div>
          )}

          {occ.showScore && (
            <div className="flex-none flex items-center gap-2 mb-1 mt-0.5">
              <div
                className={cn(
                  'w-10 h-10 flex-none flex items-center justify-center rounded-full',
                  chrome.scoreBubbleClassName,
                )}
              >
                <FitText
                  field="score"
                  text={String(product.score)}
                  maxFontSize={TYPE_SCALE.score.max}
                  minFontSize={TYPE_SCALE.score.min}
                  fontWeight={900}
                  color={chrome.colors.scoreNumber}
                  trackReady={forPrint}
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div
                  className={cn(
                    'text-[7px] font-sans uppercase tracking-widest font-bold',
                    chrome.scoreLabelClassName,
                  )}
                >
                  {chrome.scoreLabel}
                </div>
                {product.reviewer && (
                  <div
                    className={cn(
                      'text-[6px] font-sans uppercase mt-0.5 truncate',
                      chrome.reviewerClassName,
                    )}
                  >
                    {product.reviewer}
                  </div>
                )}
              </div>
            </div>
          )}

          {occ.showRegion && (
            <div className="flex-none" style={{ height: '12%' }}>
              <FitText
                field="region"
                text={product.region}
                maxFontSize={TYPE_SCALE.caption.max}
                minFontSize={TYPE_SCALE.caption.min}
                fontFamily="sans"
                fontWeight={600}
                uppercase
                letterSpacing="0.12em"
                color={chrome.colors.region}
                textAlign="left"
                fitMode="single"
                trackReady={forPrint}
              />
            </div>
          )}

          {product.description && (
            <div className="flex-1 min-h-0 h-0 overflow-hidden">
              <FitText
                field="notes"
                text={product.description}
                maxFontSize={TYPE_SCALE.notes.max}
                minFontSize={TYPE_SCALE.notes.min}
                fontStyle={chrome.notesFontStyle ?? 'italic'}
                color={chrome.colors.notes}
                textAlign="left"
                fitMode="lines"
                lineCount={occ.notesLineCount}
                trackReady={forPrint}
              />
            </div>
          )}
        </div>
      </div>

      {occ.showFooter && (
        <div
          className={cn(
            'flex-none shrink-0 flex justify-between items-center relative z-20',
            chrome.footerClassName,
            pickupDimClass,
          )}
          style={{ minHeight: `${FOOTER_MIN_PCT}%` }}
        >
          <div className="flex-1 min-w-0">
            {occ.showTags && (
              <FitText
                field="tags"
                text={tagText}
                maxFontSize={TYPE_SCALE.caption.max}
                minFontSize={TYPE_SCALE.caption.min}
                fontFamily="sans"
                fontWeight={700}
                uppercase
                letterSpacing="0.1em"
                color={chrome.colors.tags}
                trackReady={forPrint}
              />
            )}
          </div>
          {occ.showLogo && (
            <div className={cn('h-6 w-1/4 flex justify-end shrink-0 ml-2', occ.showTags ? '' : 'w-full')}>
              <img
                src={logoUrl}
                alt=""
                className={cn('h-full object-contain', chrome.logoClassName)}
                crossOrigin={forPrint ? 'anonymous' : undefined}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
