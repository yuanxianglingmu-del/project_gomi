import { useEffect, useRef } from 'react';
import type { BeltItem as BeltItemModel } from '../types/game';

interface Props {
  item: BeltItemModel;
  onGrab: (id: number) => void;
  onMiss: (id: number) => void;
}

// 1つのゴミ。マウント時に右→左へ流れるアニメを開始し、
// 流れ切ったら（finish）onMissを呼ぶ。つかまれると親から除去され、
// アンマウントでアニメは自動キャンセルされる。
export default function BeltItem({ item, onGrab, onMiss }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [
        { transform: `translateX(${item.fromX}px)` },
        { transform: `translateX(${item.toX}px)` },
      ],
      { duration: item.travelMs, easing: 'linear', fill: 'forwards' }
    );
    const handleFinish = () => onMiss(item.id);
    anim.addEventListener('finish', handleFinish);
    return () => {
      anim.removeEventListener('finish', handleFinish);
      anim.cancel();
    };
  }, [item.id, item.fromX, item.toX, item.travelMs, onMiss]);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        e.preventDefault();
        onGrab(item.id);
      }}
      className="absolute left-0 top-[16%] z-20 flex h-[26%] cursor-pointer items-center justify-center"
    >
      <span className="select-none text-[clamp(34px,6vw,60px)] drop-shadow-[0_4px_3px_rgba(0,0,0,0.25)] transition-transform active:scale-110">
        {item.def.emoji}
      </span>
    </div>
  );
}
