import { useGameEngine } from '../hooks/useGameEngine';
import BinRow from './BinRow';
import ComboBadge from './ComboBadge';
import ConveyorBelt from './ConveyorBelt';
import FloatingTexts from './FloatingTexts';
import TopBar from './TopBar';
import WorkArea from './WorkArea';
import GameOverOverlay from './overlays/GameOverOverlay';
import StartOverlay from './overlays/StartOverlay';

export default function Game() {
  const g = useGameEngine();

  return (
    <div
      ref={g.containerRef}
      className="relative aspect-video max-h-[720px] max-w-[1280px] overflow-hidden bg-sky-grass font-round text-ink"
      style={{ width: '100%', height: '100%' }}
    >
      <TopBar score={g.score} lives={g.lives} />
      <ComboBadge combo={g.combo} />

      <ConveyorBelt items={g.beltItems} onGrab={g.grab} onMiss={g.miss} />

      <WorkArea
        work={g.work}
        onDecompose={g.decompose}
        onDropPart={g.dropPart}
        onDragOver={g.dragOver}
      />

      <BinRow
        hoveredBin={g.hoveredBin}
        binFlash={g.binFlash}
        registerBin={g.registerBin}
      />

      <FloatingTexts floats={g.floats} />

      {g.status === 'start' && <StartOverlay onStart={g.start} />}
      {g.status === 'gameover' && (
        <GameOverOverlay score={g.score} onRestart={g.start} />
      )}
    </div>
  );
}
