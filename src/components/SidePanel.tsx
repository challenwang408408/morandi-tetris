import { COLORS, makePiece } from '../game/tetris'
import type { GameState, PieceType } from '../game/types'

function NextPreview({ type }: { type: PieceType }) {
  const { shape } = makePiece(type)
  const n = shape.length
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${n}, 18px)`,
        gridTemplateRows: `repeat(${n}, 18px)`,
        gap: 1,
        justifyContent: 'center',
      }}
    >
      {shape.flatMap((row, r) =>
        row.map((v, c) => (
          <div
            key={`${r}-${c}`}
            className={v ? 'cell filled' : ''}
            style={{
              width: 18,
              height: 18,
              background: v ? COLORS[type] : '#2f2c28',
              borderRadius: 2,
            }}
          />
        )),
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-pixel text-[9px] tracking-wider text-morandi-taupe uppercase">
        {label}
      </span>
      <span
        className="font-terminal text-2xl leading-none"
        style={{ color: accent ?? '#5A544A' }}
      >
        {value}
      </span>
    </div>
  )
}

export function SidePanel({
  state,
  onStart,
  onPause,
  onHistory,
  onSettings,
}: {
  state: GameState
  onStart: () => void
  onPause: () => void
  onHistory: () => void
  onSettings: () => void
}) {
  const mm = Math.floor(state.elapsed / 60)
  const ss = Math.floor(state.elapsed % 60)
  const time = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-4 w-[200px]">
      <div className="rounded-lg border border-morandi-fog bg-morandi-paper p-4 flex flex-col items-center gap-3 shadow-sm">
        <span className="font-pixel text-[9px] tracking-wider text-morandi-taupe uppercase">
          Next
        </span>
        <NextPreview type={state.next} />
      </div>

      <div className="rounded-lg border border-morandi-fog bg-morandi-paper p-4 flex flex-col gap-3 shadow-sm">
        <Stat label="Score" value={state.score.toLocaleString()} accent="#5A544A" />
        <div className="h-px bg-morandi-fog/60" />
        <Stat label="Level" value={state.level} accent="#9AA897" />
        <Stat label="Lines" value={state.lines} accent="#9AA897" />
        <Stat label="Time" value={time} accent="#9AA897" />
        <div className="h-px bg-morandi-fog/60" />
        <Stat
          label="Combo"
          value={state.combo > 0 ? `x${state.combo}` : '-'}
          accent="#C2A28E"
        />
        <Stat label="Tetris" value={state.tetrisCount} accent="#C2A28E" />
        {state.godMode && (
          <div className="font-pixel text-[9px] text-center rainbow pt-1">
            GOD MODE
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {state.status === 'idle' || state.status === 'over' ? (
          <button
            onClick={onStart}
            className="font-pixel text-[10px] py-3 rounded-md bg-morandi-moss text-morandi-paper hover:bg-morandi-taupe transition-colors shadow-sm"
          >
            {state.status === 'over' ? 'RESTART' : 'START'}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="font-pixel text-[10px] py-3 rounded-md bg-morandi-stone text-morandi-ink hover:bg-morandi-fog transition-colors shadow-sm"
          >
            {state.status === 'paused' ? 'RESUME' : 'PAUSE'}
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onHistory}
            className="font-pixel text-[9px] py-2 rounded-md bg-morandi-paper border border-morandi-fog text-morandi-taupe hover:bg-morandi-stone transition-colors"
          >
            HISTORY
          </button>
          <button
            onClick={onSettings}
            className="font-pixel text-[9px] py-2 rounded-md bg-morandi-paper border border-morandi-fog text-morandi-taupe hover:bg-morandi-stone transition-colors"
          >
            SETTINGS
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-morandi-fog bg-morandi-paper p-3 text-morandi-taupe">
        <p className="font-pixel text-[8px] mb-2 tracking-wider">CONTROLS</p>
        <ul className="font-terminal text-base leading-tight space-y-0.5">
          <li>← → 移动</li>
          <li>↑ 旋转</li>
          <li>↓ 软降</li>
          <li>Space 硬降</li>
          <li>P 暂停</li>
        </ul>
        <p className="font-terminal text-sm text-morandi-shadow mt-2 italic">
          隐藏彩蛋：↑↑↓↓←→←→BA
        </p>
      </div>
    </div>
  )
}
