import type { Product, TemplateConfig } from '../../types';

export interface TemplateProps {
  product: Product;
  config: TemplateConfig;
  bottleUrl: string;
  logoUrl: string;
  tagText: string;
  forPrint: boolean;
}
