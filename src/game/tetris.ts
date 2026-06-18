import type { Cell, Piece, PieceType } from './types'

export const COLS = 10
export const ROWS = 20
export const HIDDEN_ROWS = 2

export const COLORS: Record<PieceType, string> = {
  I: '#6FAFB0',
  O: '#C2A85A',
  T: '#A07CB0',
  S: '#7FA982',
  Z: '#B07A7A',
  J: '#6A86B0',
  L: '#B08A6A',
  PLUS: '#D4B5A0',
  SMILE: '#D9C27A',
}

const CELL_ID: Record<PieceType, number> = {
  I: 1,
  O: 2,
  T: 3,
  S: 4,
  Z: 5,
  J: 6,
  L: 7,
  PLUS: 8,
  SMILE: 9,
}

export function cellTypeOf(cell: Cell): PieceType | null {
  for (const k of Object.keys(CELL_ID) as PieceType[]) {
    if (CELL_ID[k] === cell) return k
  }
  return null
}

const SHAPES: Record<PieceType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  PLUS: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  SMILE: [
    [1, 1],
    [1, 1],
  ],
}

const STANDARD_BAG: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']

export function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0))
}

export function rotateCW(m: number[][]): number[][] {
  const n = m.length
  const res = Array.from({ length: n }, () => Array<number>(n).fill(0))
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      res[c][n - 1 - r] = m[r][c]
    }
  }
  return res
}

export function makePiece(type: PieceType): Piece {
  const shape = SHAPES[type].map((row) => [...row])
  const n = shape.length
  const col = Math.floor((COLS - n) / 2)
  return { type, shape, row: 0, col, rotation: 0 }
}

export function clonePiece(p: Piece): Piece {
  return {
    type: p.type,
    shape: p.shape.map((r) => [...r]),
    row: p.row,
    col: p.col,
    rotation: p.rotation,
  }
}

export function collides(board: Cell[][], p: Piece): boolean {
  const n = p.shape.length
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!p.shape[r][c]) continue
      const br = p.row + r
      const bc = p.col + c
      if (bc < 0 || bc >= COLS || br >= ROWS) return true
      if (br < 0) continue
      if (board[br][bc] !== 0) return true
    }
  }
  return false
}

export function merge(board: Cell[][], p: Piece): Cell[][] {
  const next = board.map((r) => [...r])
  const id = CELL_ID[p.type]
  const n = p.shape.length
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!p.shape[r][c]) continue
      const br = p.row + r
      const bc = p.col + c
      if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
        next[br][bc] = id
      }
    }
  }
  return next
}

export function clearLines(board: Cell[][]): {
  board: Cell[][]
  cleared: number[]
} {
  const cleared: number[] = []
  for (let r = 0; r < ROWS; r++) {
    if (board[r].every((c) => c !== 0)) cleared.push(r)
  }
  if (cleared.length === 0) return { board, cleared }
  const kept = board.filter((_, r) => !cleared.includes(r))
  const newRows = Array.from({ length: cleared.length }, () =>
    Array<Cell>(COLS).fill(0),
  )
  return { board: [...newRows, ...kept], cleared }
}

export function dropDistance(board: Cell[][], p: Piece): number {
  let d = 0
  const test = clonePiece(p)
  while (true) {
    test.row += 1
    if (collides(board, test)) break
    d += 1
  }
  return d
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function refillBag(): PieceType[] {
  return shuffle(STANDARD_BAG)
}

export function pickNext(
  bag: PieceType[],
  score: number,
): { type: PieceType; bag: PieceType[] } {
  let nextBag = bag
  if (nextBag.length === 0) nextBag = refillBag()

  const tier = Math.floor(score / 10000)
  if (tier >= 1 && Math.random() < 0.15) {
    return { type: 'PLUS', bag: nextBag }
  }

  const [type, ...rest] = nextBag
  let finalType: PieceType = type
  if (type === 'O' && Math.random() < 0.01) {
    finalType = 'SMILE'
  }
  return { type: finalType, bag: rest }
}

export function scoreForLines(
  lines: number,
  level: number,
  combo: number,
  isSmile: boolean,
): number {
  const base = [0, 100, 300, 500, 800][lines] ?? 0
  let s = base * level
  if (combo > 0) s += 50 * combo * level
  if (isSmile) s *= 2
  return s
}

export function levelFromLines(lines: number): number {
  return Math.floor(lines / 10) + 1
}

export function dropInterval(level: number): number {
  const ms = Math.max(80, 800 - (level - 1) * 60)
  return ms
}

export function rotatePiece(board: Cell[][], p: Piece): Piece {
  if (p.type === 'O' || p.type === 'SMILE') return clonePiece(p)
  const rotated = rotateCW(p.shape)
  const tries = [0, -1, 1, -2, 2]
  for (const kick of tries) {
    const test = clonePiece(p)
    test.shape = rotated
    test.col = p.col + kick
    if (!collides(board, test)) {
      test.rotation = (p.rotation + 1) % 4
      return test
    }
  }
  return clonePiece(p)
}
