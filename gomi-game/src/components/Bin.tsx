import type { BinDef } from '../types/game';

interface Props {
  bin: BinDef;
  hot: boolean; // ドラッグ中にこの箱の上にいる
  flash: 'good' | 'bad' | null;
  registerRef: (el: HTMLElement | null) => void;
}

export default function Bin({ bin, hot, flash, registerRef }: Props) {
  return (
    <div
      ref={registerRef}
      data-bin={bin.id}
      className={
        'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-t-[18px] rounded-b-[14px] border-b-8 bg-white shadow-toy transition-transform ' +
        (hot
          ? '-translate-y-2 scale-[1.04] border-b-accent bg-[#fff3e8]'
          : 'border-b-[#d9dee0]') +
        (flash === 'good' ? ' animate-flash-good' : '') +
        (flash === 'bad' ? ' animate-flash-bad' : '')
      }
    >
      <span className="text-[clamp(22px,4vw,40px)] leading-none">
        {bin.emoji}
      </span>
      <span className="text-[clamp(10px,1.6vw,16px)] font-black leading-tight">
        {bin.label}
      </span>
    </div>
  );
}
