import { useMemo } from 'react';
import type { Product, AppSettings } from '../types';
import { getTemplate } from '../lib/templates';
import { formatDropboxUrl } from '../lib/utils';
import {
  CleanMinimal,
  MinimalEditorial,
  BurgundyHeritage,
  BurgundyMarble,
  BotanicalGreen,
  AutumnHarvest,
  FestiveWinter,
  ArtDeco,
} from './templates';

interface Props {
  product: Product;
  settings?: AppSettings;
  forPrint?: boolean;
  distancePreview?: boolean;
}

export default function ShelfTalker({ product, settings, forPrint = false, distancePreview = false }: Props) {
  const templateId = settings?.templateId ?? 'art-deco';
  const config = getTemplate(templateId);

  const bottleUrl = useMemo(() => {
    const url = product.bottleImageUrl;
    if (!url) return '';
    return url.startsWith('data:') || url.startsWith('blob:') ? url : formatDropboxUrl(url);
  }, [product.bottleImageUrl]);

  const logoUrl = useMemo(() => {
    const url = product.logoUrl || settings?.defaultLogoUrl || '';
    if (!url) return '';
    return url.startsWith('data:') || url.startsWith('blob:') ? url : formatDropboxUrl(url);
  }, [product.logoUrl, settings?.defaultLogoUrl]);

  const tags = product.tags?.length > 0 ? product.tags : (settings?.defaultTags ?? []);
  const tagText = tags.join(config.tagSeparator ?? ' · ');

  const props = {
    product,
    config,
    bottleUrl,
    logoUrl,
    tagText,
    forPrint,
    distancePreview: distancePreview && !forPrint,
  };

  const renderTemplate = () => {
    switch (templateId) {
      case 'clean-minimal':     return <CleanMinimal {...props} />;
      case 'minimal-editorial': return <MinimalEditorial {...props} />;
      case 'burgundy-heritage': return <BurgundyHeritage {...props} />;
      case 'burgundy-marble':   return <BurgundyMarble {...props} />;
      case 'botanical-green':   return <BotanicalGreen {...props} />;
      case 'autumn-harvest':    return <AutumnHarvest {...props} />;
      case 'rustic-kraft':      return <FestiveWinter {...props} />;
      case 'art-deco':          return <ArtDeco {...props} />;
      default:                  return <ArtDeco {...props} />;
    }
  };

  return (
    <div
      id={forPrint ? 'print-target' : undefined}
      className="shelf-talker-root"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 4',
        overflow: 'hidden',
        backgroundColor: '#fff',
        userSelect: 'none',
      }}
    >
      {renderTemplate()}
    </div>
  );
}
