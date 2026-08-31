import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-[#e6dfd3] text-[#433521] p-3',
  overlays: (
    <>
      <div className="absolute inset-2 border-2 border-[#5a6b4a] rounded-xl pointer-events-none opacity-50" />
      <div className="absolute inset-3 border border-[#5a6b4a] rounded-lg pointer-events-none opacity-30" />
    </>
  ),
  identityClassName: 'bg-[#5a6b4a] mx-3 mt-1 rounded-t-lg shadow-sm px-3',
  bodyClassName: 'gap-0 px-3 py-2 min-h-0',
  bottleWellClassName: 'bg-white shadow-sm p-2 rounded-lg border border-[#c4bba9]',
  pickupClassName: 'bg-[#fdfbf7] border border-[#c4bba9] p-2 shadow-sm rounded-lg',
  footerClassName: 'bg-[#5a6b4a] mx-3 mb-1 rounded-b-lg px-3 py-2 shadow-sm',
  scoreBubbleClassName: 'bg-[#5a6b4a] shadow-sm',
  scoreLabel: 'Rating',
  scoreLabelClassName: 'text-[#5a6b4a]',
  reviewerClassName: 'text-[#6b5a48]',
  notesFontStyle: 'italic',
  logoClassName: 'bg-white rounded-sm px-1',
  colors: {
    name: '#fdfbf7',
    producer: '#e6dfd3',
    numeral: '#fdfbf7',
    price: '#e6dfd3',
    hook: '#433521',
    notes: '#433521',
    region: '#6b5a48',
    tags: '#fdfbf7',
    scoreNumber: '#fdfbf7',
  },
};

export default function BotanicalGreen(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
