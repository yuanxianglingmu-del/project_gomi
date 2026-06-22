import { BINS } from '../data/bins';
import type { BinId } from '../types/game';
import Bin from './Bin';

interface Props {
  hoveredBin: BinId | null;
  binFlash: { id: BinId; kind: 'good' | 'bad' } | null;
  registerBin: (id: BinId) => (el: HTMLElement | null) => void;
}

export default function BinRow({ hoveredBin, binFlash, registerBin }: Props) {
  return (
    <div className="absolute bottom-[1.5%] left-0 right-0 z-[15] flex h-[21%] gap-[1.2%] px-[1.5%]">
      {BINS.map((bin) => (
        <Bin
          key={bin.id}
          bin={bin}
          hot={hoveredBin === bin.id}
          flash={binFlash?.id === bin.id ? binFlash.kind : null}
          registerRef={registerBin(bin.id)}
        />
      ))}
    </div>
  );
}
