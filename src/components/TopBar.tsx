interface Props {
  score: number;
  lives: number;
}

const MAX_LIVES = 5;

export default function TopBar({ score, lives }: Props) {
  return (
    <div className="absolute left-0 right-0 top-0 z-30 flex h-[11%] items-center justify-between px-6">
      <div className="flex items-center gap-2 rounded-[22px] bg-white px-[18px] py-[6px] font-extrabold shadow-toy">
        <span className="text-[clamp(16px,2.6vw,26px)]">とくてん</span>
        <span className="inline-block min-w-[2ch] text-right text-[clamp(16px,2.6vw,26px)] text-accent">
          {score}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-[22px] bg-white px-[18px] py-[6px] text-[clamp(18px,3vw,30px)] tracking-widest shadow-toy">
        {Array.from({ length: MAX_LIVES }).map((_, i) => (
          <span
            key={i}
            className={
              'transition-transform duration-200 ' +
              (i >= lives ? 'scale-75 opacity-25' : '')
            }
          >
            ❤
          </span>
        ))}
      </div>
    </div>
  );
}
