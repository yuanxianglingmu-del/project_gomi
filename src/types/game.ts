// ゴミ箱の種類を表すID。ここに増減させると分別先の選択肢が変わる。
export type BinId =
  | 'moeru' // もえる
  | 'moenai' // もえない
  | 'pet' // ペットボトル
  | 'plastic' // プラスチック
  | 'can' // カン
  | 'bin' // ビン
  | 'yugai'; // 有害ごみ

export interface BinDef {
  id: BinId;
  emoji: string;
  label: string;
}

// ゴミを構成するパーツ1つ分の定義（どのゴミ箱が正解か）。
export interface PartDef {
  ico: string;
  bin: BinId;
  tag: string;
}

// 流れてくるゴミの定義。simple=true は分解なしの1パーツ。
export interface TrashDef {
  key: string;
  emoji: string;
  simple: boolean;
  parts: PartDef[];
}

export type GameStatus = 'start' | 'playing' | 'gameover';

// ベルト上を流れているゴミ1つ分の実体。
export interface BeltItem {
  id: number;
  def: TrashDef;
  fromX: number; // 出現位置(px)
  toX: number; // ミスライン位置(px)
  travelMs: number; // 流れ切るまでの時間
}

// 作業エリアに置かれた、ドラッグ対象のパーツ。
export interface WorkPart extends PartDef {
  id: number;
  homeLeft: number; // 初期位置(%)
  homeTop: number; // 初期位置(%)
}

// 作業エリアの状態。
export interface WorkState {
  def: TrashDef;
  decomposed: boolean; // 分解済みか
  parts: WorkPart[]; // 未分別のパーツ（正解したら取り除かれる）
}

// ＋点やミスを表示する浮き上がりテキスト。
export interface FloatText {
  id: number;
  text: string;
  x: number; // ゲーム領域内のpx
  y: number;
  kind: 'good' | 'bad';
}

export type DropResult = 'consumed' | 'return';
