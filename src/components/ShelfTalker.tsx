import { Product, AppSettings, ZoneKey, ZoneTypography, DesignLayout } from '../types';
import { formatDropboxUrl } from '../lib/utils';
import {
  FLOW_PRESETS,
  getEffectiveZones,
  getEffectiveTypography,
  zoneStyle,
} from '../lib/flowLayout';
import FitText from './FitText';

interface Props {
  product: Product;
  settings?: AppSettings;
  forPrint?: boolean;
  layoutEditMode?: boolean;
}

function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((char) => char + char).join('');
  }
  if (cleanHex.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resolveColor(
  role: ZoneTypography['colorRole'],
  preset: (typeof FLOW_PRESETS)[DesignLayout],
  accent: string
): string {
  switch (role) {
    case 'accent':
      return accent;
    case 'muted':
      return preset.mutedColor ?? preset.textColor;
    default:
      return preset.textColor;
  }
}

export default function ShelfTalker({ product, settings, forPrint = false, layoutEditMode = false }: Props) {
  const imageUrl = formatDropboxUrl(product.dropboxImageUrl);
  const logoUrl = product.logoUrl || settings?.defaultLogoUrl;
  const formattedLogoUrl = logoUrl
    ? logoUrl.startsWith('data:')
      ? logoUrl
      : formatDropboxUrl(logoUrl)
    : null;

  const layoutKey = settings?.designLayout || 'noir-luxury';
  const preset = FLOW_PRESETS[layoutKey];
  const flowLayout = preset.layout;
  const zones = getEffectiveZones(layoutKey, settings?.layoutOverrides);
  const typography = getEffectiveTypography(layoutKey, settings?.typographyOverrides);

  const accent =
    layoutKey === 'noir-luxury' && settings?.royalDarkColor
      ? settings.royalDarkColor
      : preset.accentColor;

  const shadowColor = flowLayout.textShadowColor ?? 'rgba(0,0,0,0.85)';
  const shadowBlur = flowLayout.textShadowBlur ?? 0;
  const textShadow =
    shadowBlur > 0
      ? `0 1px ${shadowBlur}px ${shadowColor}, 0 0 ${shadowBlur * 2}px ${shadowColor}`
      : 'none';

  const panelOpacity = flowLayout.descriptionPanelOpacity ?? 0;
  const panelColor = flowLayout.descriptionPanelColor ?? '#ffffff';
  const tagSep = flowLayout.tagSeparator ?? ' · ';
  const tags = product.tags.length > 0 ? product.tags : settings?.defaultTags ?? [];
  const printClass = forPrint ? 'shadow-none' : '';

  const renderZoneText = (
    zoneKey: ZoneKey,
    content: string,
    fallback: string,
    options?: { html?: boolean; trackReady?: boolean }
  ) => {
    const style = typography[zoneKey] ?? {};
    const zone = zones[zoneKey];
    const color = style.color ?? resolveColor(style.colorRole ?? 'text', preset, accent);
    const fitMode = style.singleLine ? 'single' : (style.fitMode ?? 'box');

    return (
      <FitText
        text={content || fallback}
        color={color}
        maxFontSize={style.maxFontSize ?? 12}
        minFontSize={style.minFontSize ?? 6}
        fontFamily={style.fontFamily ?? 'serif'}
        fontWeight={style.fontWeight ?? 400}
        fontStyle={style.fontStyle ?? 'normal'}
        textAlign={style.textAlign ?? 'left'}
        letterSpacing={style.letterSpacing}
        lineHeight={style.lineHeight ?? 1.35}
        uppercase={style.uppercase}
        singleLine={style.singleLine}
        html={options?.html}
        trackReady={layoutEditMode || (options?.trackReady ?? zoneKey === 'description')}
        fitMode={fitMode}
        lineCount={style.lineCount}
        paddingX={style.paddingX}
        paddingY={style.paddingY}
        lineOffsetTop={style.lineOffsetTop}
        zoneHeightPercent={zone.height}
      />
    );
  };

  return (
    <div
      className={`shelf-talker w-[384px] h-[510px] relative overflow-hidden box-border ${printClass}`}
      id={`shelf-talker-${product.id}`}
    >
      <img
        src={preset.backgroundImageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        crossOrigin="anonymous"
      />

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          data-layout-zone="region"
          className="absolute flex overflow-hidden"
          style={{
            ...zoneStyle(zones.region),
            alignItems: typography.region?.alignItems ?? 'center',
            justifyContent: typography.region?.justifyContent ?? 'center',
            textShadow,
          }}
        >
          {renderZoneText('region', product.region, 'Region', { trackReady: false })}
        </div>

        <div
          data-layout-zone="producer"
          className="absolute flex overflow-hidden"
          style={{
            ...zoneStyle(zones.producer),
            alignItems: typography.producer?.alignItems ?? 'center',
            justifyContent: typography.producer?.justifyContent ?? 'center',
            textShadow,
          }}
        >
          {renderZoneText('producer', product.producer, 'Producer', { trackReady: false })}
        </div>

        <div
          data-layout-zone="wineName"
          className="absolute flex overflow-hidden"
          style={{
            ...zoneStyle(zones.wineName),
            alignItems: typography.wineName?.alignItems ?? 'center',
            justifyContent: typography.wineName?.justifyContent ?? 'center',
            textShadow,
          }}
        >
          {renderZoneText(
            'wineName',
            `${product.vintage} ${product.name}`.trim(),
            'Vintage Wine Name',
            { trackReady: false }
          )}
        </div>

        {product.score != null && product.score > 0 && (
          <div
            data-layout-zone="score"
            className="absolute flex flex-col overflow-hidden"
            style={{
              ...zoneStyle(zones.score),
              alignItems: typography.score?.alignItems ?? 'center',
              justifyContent: typography.score?.justifyContent ?? 'center',
              textShadow,
            }}
          >
            <div className="flex-[2] w-full min-h-0 overflow-hidden">
              <FitText
                text={String(product.score)}
                color={resolveColor(typography.score?.colorRole ?? 'accent', preset, accent)}
                maxFontSize={typography.score?.maxFontSize ?? 36}
                minFontSize={typography.score?.minFontSize ?? 12}
                fontFamily={typography.score?.fontFamily ?? 'serif'}
                fontWeight={typography.score?.fontWeight ?? 900}
                textAlign="center"
                fitMode="single"
                singleLine
                trackReady={layoutEditMode}
                paddingX={typography.score?.paddingX}
                paddingY={0}
              />
            </div>
            <div className="flex-[1] w-full min-h-0 overflow-hidden">
              <FitText
                text={product.reviewer || 'PTS'}
                color={resolveColor(typography.score?.colorRole ?? 'accent', preset, accent)}
                maxFontSize={8}
                minFontSize={5}
                fontFamily="sans"
                fontWeight={700}
                textAlign="center"
                uppercase
                fitMode="single"
                singleLine
                trackReady={layoutEditMode}
                className="opacity-85"
              />
            </div>
          </div>
        )}

        <div
          data-layout-zone="bottle"
          className="absolute flex items-end justify-center overflow-hidden"
          style={zoneStyle(zones.bottle)}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Bottle"
              className="max-h-full max-w-full object-contain drop-shadow-md"
              crossOrigin="anonymous"
            />
          ) : null}
        </div>

        <div
          data-layout-zone="description"
          className="absolute overflow-hidden"
          style={{
            ...zoneStyle(zones.description),
            backgroundColor:
              panelOpacity > 0 ? hexToRgba(panelColor, panelOpacity / 100) : 'transparent',
          }}
        >
          {renderZoneText('description', product.description, '', { html: true, trackReady: true })}
        </div>

        <div
          data-layout-zone="tags"
          className="absolute flex overflow-hidden"
          style={{
            ...zoneStyle(zones.tags),
            alignItems: typography.tags?.alignItems ?? 'center',
            justifyContent: typography.tags?.justifyContent ?? 'center',
            textShadow,
          }}
        >
          {renderZoneText('tags', tags.slice(0, 3).join(tagSep), '', { trackReady: false })}
        </div>

        {formattedLogoUrl && (
          <div
            data-layout-zone="logo"
            className="absolute flex items-center justify-center overflow-hidden"
            style={zoneStyle(zones.logo)}
          >
            <img
              src={formattedLogoUrl}
              alt="Logo"
              className="max-h-full max-w-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
        )}
      </div>
    </div>
  );
}
