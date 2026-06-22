interface Props {
  combo: number;
}

// 2連続以上で表示。comboの値をkeyにしてポップアニメを再生する。
export default function ComboBadge({ combo }: Props) {
  if (combo < 2) return null;
  return (
    <div
      key={combo}
      className="pointer-events-none absolute left-1/2 top-[13%] z-30 -translate-x-1/2 animate-pop-in text-[clamp(18px,3vw,30px)] font-black text-accent [text-shadow:0_2px_0_#fff]"
    >
      {combo}れんぞく！
    </div>
  );
}
