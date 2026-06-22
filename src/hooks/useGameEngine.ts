import { useCallback, useEffect, useRef, useState } from 'react';
import { BINS } from '../data/bins';
import { TRASH } from '../data/trash';
import type {
  BeltItem,
  BinId,
  DropResult,
  FloatText,
  GameStatus,
  TrashDef,
  WorkPart,
  WorkState,
} from '../types/game';

// 難易度パラメータ。renderには影響しないのでrefで持つ。
const INIT_SPEED = 48; // px/秒
const INIT_GAP = 5500; // 出現間隔ms
const MIN_GAP = 2600;
const MAX_SPEED = 140;
const GAP_STEP = 120; // 1体ごとに間隔を詰める
const SPEED_STEP = 1.2; // 1体ごとに加速

// state を ref と同期して持つヘルパー。
// イベントハンドラやタイマーから最新値を読むために使う。
function useStateRef<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  const ref = useRef<T>(initial);
  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const nv =
        typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      ref.current = nv;
      return nv;
    });
  }, []);
  return [value, set, ref] as const;
}

let uid = 1;
const nextId = () => uid++;

export interface GameEngine {
  status: GameStatus;
  score: number;
  lives: number;
  combo: number;
  beltItems: BeltItem[];
  work: WorkState | null;
  floats: FloatText[];
  hoveredBin: BinId | null;
  binFlash: { id: BinId; kind: 'good' | 'bad' } | null;
  containerRef: React.RefObject<HTMLDivElement>;
  registerBin: (id: BinId) => (el: HTMLElement | null) => void;
  start: () => void;
  grab: (id: number) => void;
  decompose: () => void;
  dropPart: (part: WorkPart, clientX: number, clientY: number) => DropResult;
  dragOver: (clientX: number, clientY: number) => void;
  dragEnd: () => void;
  miss: (id: number) => void;
}

export function useGameEngine(): GameEngine {
  const [status, setStatus] = useStateRef<GameStatus>('start');
  const [score, setScore, scoreRef] = useStateRef(0);
  const [lives, setLives, livesRef] = useStateRef(5);
  const [combo, setCombo, comboRef] = useStateRef(0);
  const [beltItems, setBeltItems, beltRef] = useStateRef<BeltItem[]>([]);
  const [work, setWork, workRef] = useStateRef<WorkState | null>(null);
  const [floats, setFloats] = useStateRef<FloatText[]>([]);
  const [hoveredBin, setHoveredBin] = useState<BinId | null>(null);
  const [binFlash, setBinFlash] = useState<GameEngine['binFlash']>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const binEls = useRef<Map<BinId, HTMLElement>>(new Map());
  const diff = useRef({ speed: INIT_SPEED, gap: INIT_GAP });

  // ---- ゴミ箱の要素を登録（座標あたり判定に使う） ----
  const registerBin = useCallback(
    (id: BinId) => (el: HTMLElement | null) => {
      if (el) binEls.current.set(id, el);
      else binEls.current.delete(id);
    },
    []
  );

  const binAtPoint = useCallback((x: number, y: number) => {
    for (const [id, el] of binEls.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return { id, el };
      }
    }
    return null;
  }, []);

  // ---- 浮き上がりテキスト ----
  const addFloat = useCallback(
    (text: string, x: number, y: number, kind: 'good' | 'bad') => {
      const id = nextId();
      setFloats((prev) => [...prev, { id, text, x, y, kind }]);
      window.setTimeout(() => {
        setFloats((prev) => prev.filter((f) => f.id !== id));
      }, 800);
    },
    [setFloats]
  );

  const flashBin = useCallback((id: BinId, kind: 'good' | 'bad') => {
    setBinFlash({ id, kind });
    window.setTimeout(() => setBinFlash(null), 400);
  }, []);

  // ---- ライフ減少（共通） ----
  const loseLife = useCallback(
    (x: number, y: number, msg: string) => {
      if (livesRef.current <= 0) return;
      const nv = livesRef.current - 1;
      setLives(nv);
      setCombo(0);
      addFloat(msg, x, y, 'bad');
      if (nv <= 0) {
        setStatus('gameover');
      }
    },
    [addFloat, livesRef, setCombo, setLives, setStatus]
  );

  // ---- ゴミ出現 ----
  const spawn = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const d = diff.current;
    // 進むほど複合ゴミの割合を上げる
    const hard = Math.min(0.6, (Math.max(0, INIT_GAP - d.gap) / 2900) * 0.6);
    const pool = TRASH.filter((t: TrashDef) =>
      Math.random() < hard ? !t.simple : true
    );
    const def = pool[Math.floor(Math.random() * pool.length)] ?? TRASH[3];
    const fromX = w + 40;
    const toX = w * 0.06;
    const travelMs = ((fromX - toX) / d.speed) * 1000;
    setBeltItems((prev) => [
      ...prev,
      { id: nextId(), def, fromX, toX, travelMs },
    ]);
  }, [setBeltItems]);

  // ---- 出現ループ（status が playing の間だけ） ----
  useEffect(() => {
    if (status !== 'playing') return;
    let timer = 0;
    const tick = () => {
      spawn();
      const d = diff.current;
      d.gap = Math.max(MIN_GAP, d.gap - GAP_STEP);
      d.speed = Math.min(MAX_SPEED, d.speed + SPEED_STEP);
      timer = window.setTimeout(tick, d.gap);
    };
    timer = window.setTimeout(tick, 900);
    return () => window.clearTimeout(timer);
  }, [status, spawn]);

  // ---- 開始 ----
  const start = useCallback(() => {
    diff.current = { speed: INIT_SPEED, gap: INIT_GAP };
    setScore(0);
    setLives(5);
    setCombo(0);
    setBeltItems([]);
    setWork(null);
    setFloats([]);
    setHoveredBin(null);
    setBinFlash(null);
    setStatus('playing');
  }, [setBeltItems, setCombo, setFloats, setLives, setScore, setStatus, setWork]);

  // ---- つかむ → 作業エリアへ ----
  const grab = useCallback(
    (id: number) => {
      if (workRef.current) return; // 作業エリアは1つだけ
      const item = beltRef.current.find((i) => i.id === id);
      if (!item) return;
      setBeltItems((prev) => prev.filter((i) => i.id !== id));

      const def = item.def;
      const n = def.parts.length;
      const parts: WorkPart[] = def.parts.map((p, i) => ({
        ...p,
        id: nextId(),
        homeLeft: 50 + (i - (n - 1) / 2) * 26, // 横に広げる(%)
        homeTop: def.simple ? 30 : 35,
      }));
      setWork({ def, decomposed: def.simple, parts });
    },
    [beltRef, setBeltItems, setWork, workRef]
  );

  // ---- 流れ切ってミス ----
  const miss = useCallback(
    (id: number) => {
      const el = containerRef.current;
      const exists = beltRef.current.some((i) => i.id === id);
      if (!exists) return;
      setBeltItems((prev) => prev.filter((i) => i.id !== id));
      const w = el ? el.clientWidth : 0;
      const h = el ? el.clientHeight : 0;
      loseLife(w * 0.06, h * 0.29, 'みのがし');
    },
    [beltRef, loseLife, setBeltItems]
  );

  // ---- 複合ゴミを分解 ----
  const decompose = useCallback(() => {
    setWork((prev) => {
      if (!prev || prev.decomposed) return prev;
      return { ...prev, decomposed: true };
    });
    const el = containerRef.current;
    if (el) {
      addFloat('ばらばら！', el.clientWidth * 0.5, el.clientHeight * 0.5, 'good');
    }
  }, [addFloat, setWork]);

  // ---- ドラッグ中のゴミ箱ハイライト ----
  const dragOver = useCallback(
    (x: number, y: number) => {
      const hit = binAtPoint(x, y);
      setHoveredBin(hit ? hit.id : null);
    },
    [binAtPoint]
  );
  const dragEnd = useCallback(() => setHoveredBin(null), []);

  // ---- パーツをゴミ箱にドロップ → 判定 ----
  const dropPart = useCallback(
    (part: WorkPart, x: number, y: number): DropResult => {
      setHoveredBin(null);
      const hit = binAtPoint(x, y);
      if (!hit) return 'return'; // 箱の外 → 元の位置へ戻す（減点なし）

      const el = containerRef.current;
      const gr = el?.getBoundingClientRect();
      const br = hit.el.getBoundingClientRect();
      const fx = br.left + br.width / 2 - (gr?.left ?? 0);
      const fy = br.top - (gr?.top ?? 0);

      if (hit.id === part.bin) {
        // 正解
        flashBin(hit.id, 'good');
        const nc = comboRef.current + 1;
        setCombo(nc);
        const gain = 10 * (1 + Math.floor((nc - 1) / 3)); // 3連ごとに倍率UP
        setScore(scoreRef.current + gain);
        addFloat('+' + gain, fx, fy, 'good');
        // パーツを取り除く。全部終わったら作業エリアを空に。
        setWork((prev) => {
          if (!prev) return prev;
          const parts = prev.parts.filter((p) => p.id !== part.id);
          return parts.length ? { ...prev, parts } : null;
        });
        return 'consumed';
      }

      // 不正解
      flashBin(hit.id, 'bad');
      loseLife(fx, fy, 'ちがうよ');
      return 'return';
    },
    [
      addFloat,
      binAtPoint,
      comboRef,
      flashBin,
      loseLife,
      scoreRef,
      setCombo,
      setScore,
      setWork,
    ]
  );

  // miss は BeltItem から渡されるので安定参照にしておく
  const missRef = useRef(miss);
  missRef.current = miss;
  const stableMiss = useCallback((id: number) => missRef.current(id), []);

  return {
    status,
    score,
    lives,
    combo,
    beltItems,
    work,
    floats,
    hoveredBin,
    binFlash,
    containerRef,
    registerBin,
    start,
    grab,
    decompose,
    dropPart,
    dragOver,
    dragEnd,
    miss: stableMiss,
  };
}

export { BINS };
