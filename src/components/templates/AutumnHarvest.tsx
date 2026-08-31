import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-gradient-to-br from-[#f5b667] via-[#f3a144] to-[#e17424] text-[#5c1d12]',
  overlays: (
    <>
      <div className="absolute inset-2 border-[3px] border-[#8b2500] pointer-events-none opacity-80" />
      <div className="absolute inset-3 border border-[#8b2500] pointer-events-none opacity-50" />
    </>
  ),
  identityClassName: 'bg-[#8b2500] mx-5 mt-4 shadow-lg px-3 rounded-sm',
  bodyClassName: 'gap-0 px-5 py-2 min-h-0',
  bottleWellClassName: '',
  pickupClassName: 'bg-[#fdfaf4] border-2 border-[#8b2500] p-2 shadow-lg rounded-sm',
  footerClassName: 'px-5 py-2',
  scoreBubbleClassName: 'bg-[#8b2500] shadow-md',
  scoreLabel: 'Score',
  scoreLabelClassName: 'text-[#8b2500]',
  reviewerClassName: 'text-[#5c1d12]',
  notesFontStyle: 'italic',
  logoClassName: 'mix-blend-multiply',
  colors: {
    name: '#fdfbf7',
    producer: '#f5b667',
    numeral: '#fdfbf7',
    price: '#f5b667',
    hook: '#5c1d12',
    notes: '#5c1d12',
    region: '#5c1d12',
    tags: '#5c1d12',
    scoreNumber: '#ffffff',
  },
};

export default function AutumnHarvest(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
