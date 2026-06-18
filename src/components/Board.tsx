import {
  cellTypeOf,
  clonePiece,
  COLORS,
  COLS,
  dropDistance,
  ROWS,
} from '../game/tetris'
import type { GameState, PieceType } from '../game/types'

interface DisplayCell {
  type: PieceType | null
  ghost: boolean
}

const CELL = 28

export function Board({
  state,
  shake,
}: {
  state: GameState
  shake: boolean
}) {
  const cells: DisplayCell[][] = state.board.map((row) =>
    row.map((c) => ({ type: cellTypeOf(c), ghost: false })),
  )

  if (state.current) {
    const cur = state.current
    const n = cur.shape.length
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!cur.shape[r][c]) continue
        const br = cur.row + r
        const bc = cur.col + c
        if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
          cells[br][bc] = { type: cur.type, ghost: false }
        }
      }
    }
    const ghost = clonePiece(cur)
    ghost.row += dropDistance(state.board, cur)
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!ghost.shape[r][c]) continue
        const br = ghost.row + r
        const bc = ghost.col + c
        if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
          if (!cells[br][bc].type) {
            cells[br][bc] = { type: cur.type, ghost: true }
          }
        }
      }
    }
  }

  return (
    <div
      className={`pixel-board scanlines relative ${shake ? 'shake' : ''}`}
      style={{ padding: 6, borderRadius: 4, display: 'inline-block' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
          gap: 1,
        }}
      >
        {cells.flatMap((row, r) =>
          row.map((cell, c) => {
            const color = cell.type ? COLORS[cell.type] : null
            return (
              <div
                key={`${r}-${c}`}
                className={`cell ${color && !cell.ghost ? 'filled' : ''} ${cell.ghost ? 'ghost' : ''}`}
                style={{
                  width: CELL,
                  height: CELL,
                  background: color ? color : '#1c1a17',
                  borderRadius: 2,
                }}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}
