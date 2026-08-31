import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-white text-[#111] p-4 border-4 border-[#111]',
  identityClassName: 'border-b-2 border-[#111] pb-1 mb-1 px-1',
  bodyClassName: 'gap-0 min-h-0',
  bottleWellClassName: 'border-2 border-[#111] p-2',
  pickupClassName: 'border-l-2 border-[#111] pl-2',
  footerClassName: 'mt-2 pt-2 border-t-2 border-[#111] bg-white',
  scoreBubbleClassName: 'bg-[#111] shadow-sm',
  scoreLabel: 'Points',
  scoreLabelClassName: 'text-[#111]',
  reviewerClassName: 'text-gray-500',
  nameFontStyle: 'normal',
  notesFontStyle: 'italic',
  colors: {
    name: '#111111',
    producer: '#555555',
    numeral: '#111111',
    price: '#111111',
    hook: '#111111',
    notes: '#111111',
    region: '#555555',
    tags: '#111111',
    scoreNumber: '#ffffff',
  },
};

export default function CleanMinimal(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
