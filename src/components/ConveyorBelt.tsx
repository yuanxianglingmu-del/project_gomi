import type { BeltItem as BeltItemModel } from '../types/game';
import BeltItem from './BeltItem';

interface Props {
  items: BeltItemModel[];
  onGrab: (id: number) => void;
  onMiss: (id: number) => void;
}

export default function ConveyorBelt({ items, onGrab, onMiss }: Props) {
  return (
    <>
      {/* ベルトの見た目 */}
      <div className="absolute left-0 right-0 top-[16%] z-10 h-[26%] border-y-[6px] border-t-[#e8b27a] border-b-[#7a4d22] bg-belt-stripes">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent to-40%" />
        {/* ミスライン */}
        <div className="absolute left-[6%] top-[14%] h-[36%] w-[5px] rounded bg-miss-stripes opacity-85" />
      </div>

      {/* 流れるゴミ */}
      {items.map((item) => (
        <BeltItem
          key={item.id}
          item={item}
          onGrab={onGrab}
          onMiss={onMiss}
        />
      ))}
    </>
  );
}
