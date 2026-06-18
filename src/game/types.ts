export type PieceType =
  | 'I'
  | 'O'
  | 'T'
  | 'S'
  | 'Z'
  | 'J'
  | 'L'
  | 'PLUS'
  | 'SMILE'

export type Cell = number

export interface Piece {
  type: PieceType
  shape: number[][]
  row: number
  col: number
  rotation: number
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over'

export interface GameState {
  board: Cell[][]
  current: Piece | null
  next: PieceType
  bag: PieceType[]
  score: number
  level: number
  lines: number
  combo: number
  maxCombo: number
  tetrisCount: number
  status: GameStatus
  startTime: number
  elapsed: number
  godMode: boolean
}

export interface GameRecord {
  id: string
  score: number
  level: number
  lines: number
  durationSec: number
  date: string
  isHighScore: boolean
  tetrisCount: number
  maxCombo: number
}

export interface EasterEggEvent {
  id: string
  kind:
    | 'tetris'
    | 'combo'
    | 'plus'
    | 'speedster'
    | 'perfect'
    | 'godmode'
    | 'smile'
  text: string
  createdAt: number
}
