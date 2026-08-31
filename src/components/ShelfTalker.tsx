import { useMemo } from 'react';
import type { Product, AppSettings } from '../types';
import { getTemplate } from '../lib/templates';
import { formatDropboxUrl } from '../lib/utils';
import { Noir, Ivory, Cellar, Copper } from './templates';

interface Props {
  product: Product;
  settings?: AppSettings;
  forPrint?: boolean;
  distancePreview?: boolean;
}

export default function ShelfTalker({ product, settings, forPrint = false, distancePreview = false }: Props) {
  const templateId = settings?.templateId ?? 'noir';
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
      case 'ivory':  return <Ivory {...props} />;
      case 'cellar': return <Cellar {...props} />;
      case 'copper': return <Copper {...props} />;
      case 'noir':
      default:       return <Noir {...props} />;
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
