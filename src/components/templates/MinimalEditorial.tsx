import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

const chrome: TalkerChrome = {
  rootClassName: 'bg-[#fafafa] text-[#1a1a1a] p-4 border border-gray-200 shadow-sm',
  identityClassName: 'px-1 mb-2',
  bodyClassName: 'gap-0 min-h-0',
  bottleWellClassName: 'bg-white border border-gray-200 p-2 shadow-sm',
  pickupClassName: 'pl-1',
  footerClassName: 'mt-2 pt-2 border-t-2 border-[#1a1a1a] bg-[#fafafa]',
  scoreBubbleClassName: 'bg-[#1a1a1a]',
  scoreLabel: 'Points',
  scoreLabelClassName: 'text-[#1a1a1a]',
  reviewerClassName: 'text-gray-500',
  notesFontStyle: 'normal',
  colors: {
    name: '#1a1a1a',
    producer: '#555555',
    numeral: '#1a1a1a',
    price: '#1a1a1a',
    hook: '#1a1a1a',
    notes: '#333333',
    region: '#555555',
    tags: '#555555',
    scoreNumber: '#ffffff',
  },
};

export default function MinimalEditorial(props: TemplateProps) {
  return <TalkerShell {...props} chrome={chrome} />;
}
