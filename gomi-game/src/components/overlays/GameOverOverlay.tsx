import { Overlay, StartButton } from './StartOverlay';

interface Props {
  score: number;
  onRestart: () => void;
}

export default function GameOverOverlay({ score, onRestart }: Props) {
  return (
    <Overlay>
      <h1 className="m-0 mb-1.5 text-[clamp(28px,6vw,54px)] text-accent">
        おしまい！
      </h1>
      <p className="my-2 mb-5 text-[clamp(14px,2.4vw,22px)] leading-[1.7] text-[#52636b]">
        きみのとくてんは
        <br />
        <span className="text-[clamp(20px,4vw,34px)] font-black text-ink">
          {score} てん
        </span>
      </p>
      <StartButton onStart={onRestart} label="もういちど" />
    </Overlay>
  );
}
