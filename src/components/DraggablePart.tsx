import { useRef, useState } from 'react';
import type { DropResult, WorkPart } from '../types/game';

interface Props {
  part: WorkPart;
  onDrop: (part: WorkPart, clientX: number, clientY: number) => DropResult;
  onDragOver: (clientX: number, clientY: number) => void;
}

// 位置の持ち方：
//  - home: 初期位置。% 指定（作業エリア基準）。
//  - free: ドラッグ中。px 指定（作業エリア＝offsetParent 基準）。
type Pos =
  | { mode: 'home' }
  | { mode: 'free'; left: number; top: number };

export default function DraggablePart({ part, onDrop, onDragOver }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos>({ mode: 'home' });
  const drag = useRef<{ offX: number; offY: number; parentLeft: number; parentTop: number } | null>(
    null
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    // 作業エリア（位置決めの基準になる親）の座標
    const parent = el.offsetParent as HTMLElement | null;
    const pr = parent?.getBoundingClientRect() ?? { left: 0, top: 0 } as DOMRect;
    const r = el.getBoundingClientRect();
    const centerX = r.left + r.width / 2;
    const centerY = r.top + r.height / 2;

    drag.current = {
      offX: e.clientX - centerX,
      offY: e.clientY - centerY,
      parentLeft: pr.left,
      parentTop: pr.top,
    };
    // いまの見た目位置を px に固定（カクつき防止）
    setPos({
      mode: 'free',
      left: centerX - pr.left,
      top: centerY - pr.top,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    setPos({
      mode: 'free',
      left: e.clientX - d.offX - d.parentLeft,
      top: e.clientY - d.offY - d.parentTop,
    });
    onDragOver(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current = null;
    const result = onDrop(part, e.clientX, e.clientY);
    // consumed のときは親が parts から外す（=アンマウント）。
    // return のときは元の位置へ戻す。
    if (result === 'return') setPos({ mode: 'home' });
  };

  const style: React.CSSProperties =
    pos.mode === 'home'
      ? { left: `${part.homeLeft}%`, top: `${part.homeTop}%` }
      : { left: `${pos.left}px`, top: `${pos.top}px` };

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={style}
      className={
        'absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none flex-col items-center gap-0.5 ' +
        (pos.mode === 'free'
          ? 'z-40 cursor-grabbing'
          : 'z-20 transition-[left,top] duration-200')
      }
    >
      <span
        className={
          'text-[clamp(30px,5.2vw,52px)] drop-shadow-[0_4px_3px_rgba(0,0,0,0.28)] ' +
          (pos.mode === 'free' ? 'scale-[1.18]' : '')
        }
      >
        {part.ico}
      </span>
      <span className="rounded-[10px] bg-white px-2 py-px text-[clamp(10px,1.5vw,14px)] font-extrabold shadow-[0_2px_0_rgba(0,0,0,0.1)]">
        {part.tag}
      </span>
    </div>
  );
}
