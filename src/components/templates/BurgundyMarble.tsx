import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-[#f0ede6] text-[#3a1622]',
  overlays: (
    <div
      className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(circle at center, #d0c8b8 0%, transparent 100%)' }}
    />
  ),
  identityClassName: 'bg-[#6b1c32] px-4 shadow-md border-b-4 border-[#c9a94a]',
  bodyClassName: 'gap-0 px-4 py-3 min-h-0',
  bottleWellClassName: 'bg-white shadow-sm p-2 rounded-sm',
  pickupClassName: 'bg-white shadow-sm rounded-sm p-2 border-t-2 border-[#6b1c32]',
  footerClassName: 'px-4 py-2 mx-2 bg-[#f0ede6]',
  scoreBubbleClassName: 'bg-[#6b1c32] shadow-md border-2 border-[#c9a94a]',
  scoreLabel: 'Points',
  scoreLabelClassName: 'text-[#6b1c32]',
  reviewerClassName: 'text-[#8a5a68]',
  notesFontStyle: 'italic',
  colors: {
    name: '#ffffff',
    producer: '#f5e9c8',
    numeral: '#c9a94a',
    price: '#f5e9c8',
    hook: '#3a1622',
    notes: '#3a1622',
    region: '#8a5a68',
    tags: '#8a5a68',
    scoreNumber: '#f5e9c8',
  },
};

export default function BurgundyMarble(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
