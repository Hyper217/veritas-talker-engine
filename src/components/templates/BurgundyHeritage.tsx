import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-[#fdfaf4] text-[#3a1622] border-[6px] border-[#3a1622]',
  identityClassName: 'bg-[#7a1f38] text-[#fdfaf4] px-4 shadow-md',
  identityDecor: (
    <div className="absolute inset-2 border border-[#fdfaf4] opacity-30 pointer-events-none" />
  ),
  bodyClassName: 'gap-0 px-4 py-2 min-h-0',
  bottleWellClassName: 'border border-[#d8c3a5] p-2 bg-[#f8f1e5] shadow-inner rounded-sm',
  pickupClassName: 'border border-[#d8c3a5] bg-white p-2 shadow-sm rounded-sm',
  footerClassName: 'px-4 py-2 bg-[#fdfaf4] border-t border-[#e8dcc8]',
  scoreBubbleClassName: 'bg-[#7a1f38] shadow-inner border border-[#d8c3a5]',
  scoreLabel: 'Rating',
  scoreLabelClassName: 'text-[#7a1f38]',
  reviewerClassName: 'text-[#8a5a68]',
  notesFontStyle: 'italic',
  colors: {
    name: '#fdfaf4',
    producer: '#fdfaf4',
    numeral: '#f5e9c8',
    price: '#fdfaf4',
    hook: '#3a1622',
    notes: '#3a1622',
    region: '#8a5a68',
    tags: '#8a5a68',
    scoreNumber: '#fdfaf4',
  },
};

export default function BurgundyHeritage(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
