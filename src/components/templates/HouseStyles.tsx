import TalkerShell, { type TalkerChrome } from './TalkerShell';
import type { TemplateProps } from './TemplateProps';

function houseOverlays(border: string) {
  return (
    <>
      <div className="absolute inset-3 pointer-events-none" style={{ border: `1px solid ${border}` }} />
      <div
        className="absolute left-8 right-8 z-20 pointer-events-none"
        style={{ top: '10%', height: '1px', background: border }}
      />
    </>
  );
}

const noirChrome: TalkerChrome = {
  rootClassName: 'bg-[#0a0a0a] text-[#f4e7c5] p-5',
  overlays: houseOverlays('#c9a227'),
  identityClassName: 'px-5',
  bodyClassName: 'gap-0 px-4 min-h-0',
  bottleWellClassName: 'p-2 border border-[#c9a227]/35',
  pickupClassName: 'pt-1',
  footerClassName: 'px-4 py-2 border-t border-[#c9a227]',
  scoreBubbleClassName: 'bg-[#c9a227] shadow-sm',
  scoreLabel: 'Rating',
  scoreLabelClassName: 'text-[#c9a227]',
  reviewerClassName: 'text-[#a89870]',
  logoClassName: 'brightness-0 invert',
  nameFontFamily: 'serif',
  producerFontFamily: 'cinzel',
  producerLetterSpacing: '0.28em',
  notesFontStyle: 'italic',
  colors: {
    name: '#c9a227',
    producer: '#a89870',
    numeral: '#f4e7c5',
    price: '#c9a227',
    hook: '#f4e7c5',
    notes: '#f4e7c5',
    region: '#a89870',
    tags: '#a89870',
    scoreNumber: '#0a0a0a',
  },
};

const ivoryChrome: TalkerChrome = {
  rootClassName: 'bg-[#f3eee4] text-[#3b1c22] p-5',
  overlays: houseOverlays('#c9b79a'),
  identityClassName: 'px-5',
  bodyClassName: 'gap-0 px-4 min-h-0',
  bottleWellClassName: 'p-2 border border-[#c9b79a]',
  pickupClassName: 'pt-1',
  footerClassName: 'px-4 py-2 border-t border-[#6b1e2a]/40',
  scoreBubbleClassName: 'bg-[#6b1e2a] shadow-sm',
  scoreLabel: 'Rating',
  scoreLabelClassName: 'text-[#6b1e2a]',
  reviewerClassName: 'text-[#7a6558]',
  nameFontFamily: 'cormorant',
  producerFontFamily: 'cormorant',
  producerLetterSpacing: '0.28em',
  notesFontStyle: 'italic',
  colors: {
    name: '#6b1e2a',
    producer: '#7a6558',
    numeral: '#3b1c22',
    price: '#6b1e2a',
    hook: '#3b1c22',
    notes: '#3b1c22',
    region: '#7a6558',
    tags: '#7a6558',
    scoreNumber: '#f3eee4',
  },
};

const cellarChrome: TalkerChrome = {
  rootClassName: 'bg-[#16241c] text-[#f3eee4] p-5',
  overlays: houseOverlays('#3d5a48'),
  identityClassName: 'px-5',
  bodyClassName: 'gap-0 px-4 min-h-0',
  bottleWellClassName: 'p-2 border border-[#3d5a48]',
  pickupClassName: 'pt-1',
  footerClassName: 'px-4 py-2 border-t border-[#c4a574]/50',
  scoreBubbleClassName: 'bg-[#c4a574] shadow-sm',
  scoreLabel: 'Rating',
  scoreLabelClassName: 'text-[#c4a574]',
  reviewerClassName: 'text-[#b7c4b0]',
  logoClassName: 'brightness-0 invert',
  nameFontFamily: 'libre',
  producerFontFamily: 'cinzel',
  producerLetterSpacing: '0.28em',
  notesFontStyle: 'italic',
  colors: {
    name: '#c4a574',
    producer: '#b7c4b0',
    numeral: '#f3eee4',
    price: '#c4a574',
    hook: '#f3eee4',
    notes: '#f3eee4',
    region: '#b7c4b0',
    tags: '#b7c4b0',
    scoreNumber: '#16241c',
  },
};

const copperChrome: TalkerChrome = {
  rootClassName: 'bg-[#1c1714] text-[#f2e6d8] p-5',
  overlays: houseOverlays('#8a5a32'),
  identityClassName: 'px-5',
  bodyClassName: 'gap-0 px-4 min-h-0',
  bottleWellClassName: 'p-2 border border-[#8a5a32]',
  pickupClassName: 'pt-1',
  footerClassName: 'px-4 py-2 border-t border-[#c47a3a]/50',
  scoreBubbleClassName: 'bg-[#c47a3a] shadow-sm',
  scoreLabel: 'Rating',
  scoreLabelClassName: 'text-[#c47a3a]',
  reviewerClassName: 'text-[#cbb8a4]',
  logoClassName: 'brightness-0 invert',
  nameFontFamily: 'serif',
  producerFontFamily: 'cinzel',
  producerLetterSpacing: '0.28em',
  notesFontStyle: 'italic',
  colors: {
    name: '#c47a3a',
    producer: '#cbb8a4',
    numeral: '#f2e6d8',
    price: '#c47a3a',
    hook: '#f2e6d8',
    notes: '#f2e6d8',
    region: '#cbb8a4',
    tags: '#cbb8a4',
    scoreNumber: '#1c1714',
  },
};

export function Noir(props: TemplateProps) {
  return <TalkerShell {...props} chrome={noirChrome} />;
}

export function Ivory(props: TemplateProps) {
  return <TalkerShell {...props} chrome={ivoryChrome} />;
}

export function Cellar(props: TemplateProps) {
  return <TalkerShell {...props} chrome={cellarChrome} />;
}

export function Copper(props: TemplateProps) {
  return <TalkerShell {...props} chrome={copperChrome} />;
}
