interface Props {
  onStart: () => void;
}

const RULES = ['① 流れるゴミをタップ', '② タップで分解', '③ ゴミ箱へスライド'];

export default function StartOverlay({ onStart }: Props) {
  return (
    <Overlay>
      <h1 className="m-0 mb-1.5 text-[clamp(28px,6vw,54px)] text-accent">
        ゴミ分別ゲーム
      </h1>
      <div className="mb-[18px] flex flex-wrap justify-center gap-[14px]">
        {RULES.map((r) => (
          <span
            key={r}
            className="rounded-[14px] bg-[#f1f7fa] px-[14px] py-2 text-[clamp(12px,2vw,18px)] font-bold"
          >
            {r}
          </span>
        ))}
      </div>
      <p className="my-2 mb-5 text-[clamp(14px,2.4vw,22px)] leading-[1.7] text-[#52636b]">
        ながれてくるゴミを，ただしいゴミ箱に分けよう！
        <br />
        みのがすと❤がへるよ．
      </p>
      <StartButton onStart={onStart} label="スタート" />
    </Overlay>
  );
}

export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[rgba(40,60,75,0.55)] backdrop-blur-[3px]">
      <div className="max-w-[80%] rounded-[30px] bg-white px-[clamp(28px,6vw,64px)] py-[clamp(20px,4vw,40px)] text-center shadow-[0_14px_0_rgba(0,0,0,0.18)]">
        {children}
      </div>
    </div>
  );
}

export function StartButton({
  onStart,
  label,
}: {
  onStart: () => void;
  label: string;
}) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onStart();
      }}
      className="cursor-pointer rounded-full border-none bg-accent px-11 py-3.5 text-[clamp(18px,3vw,28px)] font-black text-white shadow-[0_6px_0_#c96a26] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#c96a26]"
    >
      {label}
    </button>
  );
}
