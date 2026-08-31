import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-[#0a0a0a] text-[#f5e9c8] p-4 border-[6px] border-[#0a0a0a]',
  overlays: (
    <>
      <div className="absolute inset-2 border-2 border-[#D4AF37] pointer-events-none" />
      <div className="absolute inset-[14px] border border-[#D4AF37] opacity-60 pointer-events-none" />
    </>
  ),
  identityClassName: 'px-5',
  bodyClassName: 'gap-0 px-3 min-h-0',
  bottleWellClassName:
    'border border-[#D4AF37] rounded-t-full p-2 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]',
  pickupClassName: 'pt-1',
  footerClassName: 'px-3 py-2 border-t border-[#D4AF37] bg-[#0a0a0a]',
  scoreBubbleClassName: 'bg-[#D4AF37] shadow-sm',
  scoreLabel: 'Rating',
  scoreLabelClassName: 'text-[#D4AF37]',
  reviewerClassName: 'text-[#c9a94a]',
  logoClassName: 'filter brightness-0 invert sepia hue-rotate-[20deg] saturate-[200%]',
  producerLetterSpacing: '0.14em',
  colors: {
    name: '#D4AF37',
    producer: '#f5e9c8',
    numeral: '#f5e9c8',
    price: '#D4AF37',
    hook: '#f5e9c8',
    notes: '#f5e9c8',
    region: '#c9a94a',
    tags: '#D4AF37',
    scoreNumber: '#0a0a0a',
  },
};

export default function ArtDeco(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
