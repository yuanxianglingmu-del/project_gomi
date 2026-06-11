import type { TrashDef } from '../types/game';

// 流れてくるゴミの一覧と分解ルール。
// simple=false のものはタップで複数パーツに分解してから分別する。
// 行を追加・編集するだけでゴミの種類を増やせる。
export const TRASH: TrashDef[] = [
  {
    key: 'pet_drink',
    emoji: '🥤',
    simple: false,
    parts: [
      { ico: '🍶', bin: 'pet', tag: '本体' },
      { ico: '🏷️', bin: 'plastic', tag: 'ラベル' },
      { ico: '🔘', bin: 'plastic', tag: 'キャップ' },
    ],
  },
  {
    key: 'jam_bin',
    emoji: '🫙',
    simple: false,
    parts: [
      { ico: '🍾', bin: 'bin', tag: '本体' },
      { ico: '⭕', bin: 'can', tag: '金属ふた' },
      { ico: '🏷️', bin: 'moeru', tag: '紙ラベル' },
    ],
  },
  {
    key: 'bento',
    emoji: '🍱',
    simple: false,
    parts: [
      { ico: '🥡', bin: 'plastic', tag: '容器' },
      { ico: '🥢', bin: 'moeru', tag: 'わりばし' },
    ],
  },
  {
    key: 'can_juice',
    emoji: '🥫',
    simple: true,
    parts: [{ ico: '🥫', bin: 'can', tag: 'カン' }],
  },
  {
    key: 'ramune',
    emoji: '🍾',
    simple: true,
    parts: [{ ico: '🍾', bin: 'bin', tag: 'ビン' }],
  },
  {
    key: 'glass_cup',
    emoji: '🥛',
    simple: true,
    parts: [{ ico: '🥛', bin: 'bin', tag: 'ガラス' }],
  },
  {
    key: 'paper_cup',
    emoji: '🥤',
    simple: true,
    parts: [{ ico: '🥤', bin: 'moeru', tag: '紙コップ' }],
  },
  {
    key: 'snack_bag',
    emoji: '🍬',
    simple: true,
    parts: [{ ico: '🛍️', bin: 'plastic', tag: 'おかしの袋' }],
  },
  {
    key: 'broken_dish',
    emoji: '🍽️',
    simple: true,
    parts: [{ ico: '🍽️', bin: 'moenai', tag: 'われた皿' }],
  },
  {
    key: 'battery',
    emoji: '🔋',
    simple: true,
    parts: [{ ico: '🔋', bin: 'yugai', tag: 'でんち' }],
  },
  {
    key: 'powerbank',
    emoji: '🔌',
    simple: true,
    parts: [{ ico: '🔋', bin: 'yugai', tag: '充電器' }],
  },
];
