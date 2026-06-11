import type { FloatText } from '../types/game';

interface Props {
  floats: FloatText[];
}

export default function FloatingTexts({ floats }: Props) {
  return (
    <>
      {floats.map((f) => (
        <div
          key={f.id}
          style={{ left: f.x, top: f.y }}
          className={
            'pointer-events-none absolute z-50 animate-float-up text-[clamp(18px,3vw,30px)] font-black ' +
            (f.kind === 'good' ? 'text-good' : 'text-bad')
          }
        >
          {f.text}
        </div>
      ))}
    </>
  );
}
