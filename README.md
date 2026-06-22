# ゴミ分別ゲーム（React + TypeScript + Tailwind）

ベルトコンベアで流れてくるゴミをつかみ、分解して、正しいゴミ箱へ分別する
キッズ向け学習ゲーム。

## 動かし方

```bash
npm install
npm run dev      # 開発サーバ
npm run build    # 本番ビルド（型チェック込み）
npm run typecheck
```

## 構成（コンポーネント志向）

ロジックはすべて `hooks/useGameEngine.ts` に集約し、各コンポーネントは
「表示」と「入力を engine に渡す」だけに徹している。

```
src/
├─ types/game.ts          型定義
├─ data/bins.ts           ゴミ箱マスタ（ここを編集すると分別先が増減）
├─ data/trash.ts          ゴミマスタ＝分解ルール（行を足すだけで種類追加）
├─ hooks/useGameEngine.ts 状態・出現ループ・判定・スコア（ゲームの頭脳）
└─ components/
   ├─ Game.tsx            全体の組み立て
   ├─ TopBar.tsx          とくてん＋ライフ
   ├─ ComboBadge.tsx      連続ボーナス表示
   ├─ ConveyorBelt.tsx    ベルト本体
   ├─ BeltItem.tsx        流れるゴミ1つ（Web Animations APIで移動）
   ├─ WorkArea.tsx        作業エリア（分解の分岐）
   ├─ DraggablePart.tsx   ドラッグできるパーツ
   ├─ BinRow.tsx / Bin.tsx ゴミ箱
   ├─ FloatingTexts.tsx   ＋点／ミスの演出
   └─ overlays/           スタート・ゲームオーバー画面
```

## 設計メモ

- ベルトの移動は毎フレーム setState せず **Web Animations API** で動かしている。
  流れ切ると `finish` イベントで「みのがし」判定。つかむと要素がアンマウントされ
  アニメは自動キャンセルされる。
- 難易度（速度・出現間隔）は render に影響しないので `useRef` で保持し、
  1体出現するごとに少しずつ上げている。`useGameEngine.ts` 冒頭の定数で調整可能。
- 配色・しま模様・アニメは `tailwind.config.js` にトークンとして定義。

## 調整ポイント

- 難易度: `useGameEngine.ts` の `INIT_SPEED / INIT_GAP / MIN_GAP / MAX_SPEED`。
- ゴミの種類・分解ルール: `data/trash.ts`。
- ゴミ箱: `data/bins.ts`。
- 絵文字は仮。本番はイラスト画像への差し替えを想定。
