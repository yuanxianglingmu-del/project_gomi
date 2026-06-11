import type { BinDef } from '../types/game';

// ゴミ箱の一覧（左から並ぶ順）。ここを編集すると分別先が変わる。
export const BINS: BinDef[] = [
  { id: 'moeru', emoji: '🔥', label: 'もえる' },
  { id: 'moenai', emoji: '🚯', label: 'もえない' },
  { id: 'pet', emoji: '🍶', label: 'ペットボトル' },
  { id: 'plastic', emoji: '♳', label: 'プラスチック' },
  { id: 'can', emoji: '🥫', label: 'カン' },
  { id: 'bin', emoji: '🍾', label: 'ビン' },
  { id: 'yugai', emoji: '⚠️', label: '有害ごみ' },
];
