import type { DropResult, WorkPart, WorkState } from '../types/game';
import DraggablePart from './DraggablePart';

interface Props {
  work: WorkState | null;
  onDecompose: () => void;
  onDropPart: (part: WorkPart, x: number, y: number) => DropResult;
  onDragOver: (x: number, y: number) => void;
}

export default function WorkArea({
  work,
  onDecompose,
  onDropPart,
  onDragOver,
}: Props) {
  return (
    <>
      {/* 操作のヒント（作業エリアが空のとき） */}
      {!work && (
        <div className="absolute left-1/2 top-[45%] z-[12] -translate-x-1/2 whitespace-nowrap rounded-[14px] bg-white/70 px-[14px] py-1 text-[clamp(13px,2vw,20px)] font-extrabold text-[#5a6b73]">
          ゴミをタップしてつかもう！
        </div>
      )}

      {/* 作業エリア本体 */}
      <div className="absolute left-[8%] right-[8%] top-[46%] z-[18] h-[30%]">
        {work && !work.decomposed && (
          // 複合ゴミ：タップで分解
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onDecompose();
            }}
            className="absolute left-1/2 top-[30%] flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-0.5"
          >
            <span className="text-[clamp(34px,6vw,60px)] drop-shadow-[0_4px_3px_rgba(0,0,0,0.28)]">
              {work.def.emoji}
            </span>
            <span className="rounded-[10px] bg-white px-2 py-px text-[clamp(10px,1.5vw,14px)] font-extrabold shadow-[0_2px_0_rgba(0,0,0,0.1)]">
              タップで分解
            </span>
          </button>
        )}

        {work &&
          work.decomposed &&
          work.parts.map((part) => (
            <DraggablePart
              key={part.id}
              part={part}
              onDrop={onDropPart}
              onDragOver={onDragOver}
            />
          ))}
      </div>
    </>
  );
}
