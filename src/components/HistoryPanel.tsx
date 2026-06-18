import type { GameRecord } from '../game/types'

function fmtDate(iso: string): string {
  const d = new Date(iso)
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  const dd = d.getDate().toString().padStart(2, '0')
  const hh = d.getHours().toString().padStart(2, '0')
  const mi = d.getMinutes().toString().padStart(2, '0')
  return `${mm}/${dd} ${hh}:${mi}`
}

function fmtDur(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function HistoryPanel({
  records,
  onClose,
  onClear,
}: {
  records: GameRecord[]
  onClose: () => void
  onClear: () => void
}) {
  const best = records.reduce((m, r) => (r.score > m ? r.score : m), 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-morandi-ink/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-morandi-paper rounded-xl border border-morandi-fog shadow-2xl w-[520px] max-w-full max-h-[82vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-morandi-fog">
          <h2 className="font-pixel text-sm text-morandi-ink">战局历史</h2>
          <button
            onClick={onClose}
            className="font-terminal text-2xl text-morandi-taupe hover:text-morandi-ink px-2 leading-none"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-morandi px-6 py-4 flex-1">
          {records.length === 0 ? (
            <div className="text-center py-12 text-morandi-taupe font-terminal text-lg">
              还没有战局记录，开始第一局吧
            </div>
          ) : (
            <table className="w-full font-terminal text-base">
              <thead>
                <tr className="text-morandi-taupe text-sm border-b border-morandi-fog">
                  <th className="text-left py-2 font-normal">#</th>
                  <th className="text-right py-2 font-normal">分数</th>
                  <th className="text-right py-2 font-normal">等级</th>
                  <th className="text-right py-2 font-normal">行数</th>
                  <th className="text-right py-2 font-normal">时长</th>
                  <th className="text-right py-2 font-normal">Tetris</th>
                  <th className="text-right py-2 font-normal">Combo</th>
                  <th className="text-right py-2 font-normal">日期</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-morandi-fog/40 hover:bg-morandi-sand/60"
                  >
                    <td className="py-2 text-morandi-taupe">{i + 1}</td>
                    <td
                      className="py-2 text-right font-terminal text-xl"
                      style={{
                        color: r.isHighScore ? '#C2A28E' : '#5A544A',
                        fontWeight: r.isHighScore ? 'bold' : 'normal',
                      }}
                    >
                      {r.score.toLocaleString()}
                      {r.score === best && r.score > 0 ? ' ★' : ''}
                    </td>
                    <td className="py-2 text-right text-morandi-ink">{r.level}</td>
                    <td className="py-2 text-right text-morandi-ink">{r.lines}</td>
                    <td className="py-2 text-right text-morandi-ink">
                      {fmtDur(r.durationSec)}
                    </td>
                    <td className="py-2 text-right text-morandi-moss">
                      {r.tetrisCount}
                    </td>
                    <td className="py-2 text-right text-morandi-clay">
                      {r.maxCombo > 0 ? `x${r.maxCombo}` : '-'}
                    </td>
                    <td className="py-2 text-right text-morandi-taupe text-sm">
                      {fmtDate(r.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-morandi-fog">
          <span className="font-terminal text-base text-morandi-taupe">
            共 {records.length} 局 · 最高 {best.toLocaleString()}
          </span>
          <button
            onClick={onClear}
            disabled={records.length === 0}
            className="font-pixel text-[9px] px-3 py-2 rounded-md bg-morandi-paper border border-morandi-fog text-morandi-clay hover:bg-morandi-stone disabled:opacity-40 transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  )
}
