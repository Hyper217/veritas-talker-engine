import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-[#1a2639] text-[#eef2f8] p-3 border-[4px] border-[#cdd6e4]',
  overlays: (
    <div className="absolute inset-[6px] border border-[#cdd6e4] opacity-50 pointer-events-none" />
  ),
  identityClassName: 'px-4 mb-1',
  bodyClassName: 'gap-0 px-2 min-h-0',
  bottleWellClassName: '',
  pickupClassName: 'border-l border-[#43526d] pl-3 pt-1',
  footerClassName: 'px-3 py-2 border-t border-[#43526d] bg-[#1a2639]',
  scoreBubbleClassName: 'bg-[#cdd6e4] shadow-sm',
  scoreLabel: 'Points',
  scoreLabelClassName: 'text-[#cdd6e4]',
  reviewerClassName: 'text-gray-400',
  notesFontStyle: 'normal',
  colors: {
    name: '#eef2f8',
    producer: '#cdd6e4',
    numeral: '#eef2f8',
    price: '#cdd6e4',
    hook: '#eef2f8',
    notes: '#eef2f8',
    region: '#aab6c8',
    tags: '#aab6c8',
    scoreNumber: '#1a2639',
  },
};

export default function FestiveWinter(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
