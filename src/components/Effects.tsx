import type { EasterEggEvent } from '../game/types'

const STYLE: Record<
  EasterEggEvent['kind'],
  { color: string; size: number }
> = {
  tetris: { color: '#E8C26A', size: 30 },
  combo: { color: '#7FA982', size: 18 },
  plus: { color: '#D4B5A0', size: 16 },
  speedster: { color: '#6A86B0', size: 24 },
  perfect: { color: '#E8C26A', size: 20 },
  godmode: { color: '#A07CB0', size: 24 },
  smile: { color: '#D9C27A', size: 16 },
}

export function Effects({ effects }: { effects: EasterEggEvent[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {effects.map((e, i) => {
        const s = STYLE[e.kind] ?? STYLE.combo
        return (
          <div
            key={e.id}
            className="pop-text font-pixel absolute"
            style={{
              color: s.color,
              fontSize: s.size,
              top: `${28 + i * 14}%`,
              left: '50%',
              textShadow: '3px 3px 0 #1c1a17',
              whiteSpace: 'nowrap',
            }}
          >
            {e.text}
          </div>
        )
      })}
    </div>
  )
}
