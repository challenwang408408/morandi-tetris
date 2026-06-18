import { Board } from './components/Board'
import { Effects } from './components/Effects'
import { HistoryPanel } from './components/HistoryPanel'
import { SettingsModal } from './components/SettingsModal'
import { SidePanel } from './components/SidePanel'
import { useTetris } from './game/useTetris'
import { useEffect, useState } from 'react'

function Overlay({
  status,
  score,
  level,
  lines,
  onStart,
}: {
  status: 'idle' | 'playing' | 'paused' | 'over'
  score: number
  level: number
  lines: number
  onStart: () => void
}) {
  if (status === 'playing') return null
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-morandi-dark/80 rounded">
      {status === 'idle' && (
        <>
          <p className="font-pixel text-lg text-morandi-paper mb-2">MORANDI</p>
          <p className="font-pixel text-xl text-[#E8C26A] mb-6">TETRIS</p>
          <button
            onClick={onStart}
            className="font-pixel text-[11px] px-6 py-3 rounded-md bg-morandi-moss text-morandi-paper hover:bg-morandi-taupe transition-colors"
          >
            PRESS START
          </button>
          <p className="font-terminal text-base text-morandi-shadow mt-4">
            方向键移动 · 空格硬降
          </p>
        </>
      )}
      {status === 'paused' && (
        <p className="font-pixel text-2xl text-morandi-paper blink">PAUSED</p>
      )}
      {status === 'over' && (
        <>
          <p className="font-pixel text-2xl text-[#B07A7A] mb-4">GAME OVER</p>
          <div className="font-terminal text-xl text-morandi-paper mb-1">
            分数 {score.toLocaleString()}
          </div>
          <div className="font-terminal text-base text-morandi-shadow mb-6">
            Lv.{level} · {lines} 行
          </div>
          <button
            onClick={onStart}
            className="font-pixel text-[11px] px-6 py-3 rounded-md bg-morandi-moss text-morandi-paper hover:bg-morandi-taupe transition-colors"
          >
            再来一局
          </button>
        </>
      )}
    </div>
  )
}

function App() {
  const t = useTetris()
  const { state, effects, shake, history, showHistory, showSettings, keyMap } = t
  const a = t.actions

  const [best, setBest] = useState(0)
  useEffect(() => {
    setBest(history.reduce((m, r) => (r.score > m ? r.score : m), 0))
  }, [history])

  return (
    <div className="min-h-screen bg-morandi-sand flex flex-col items-center px-4 py-6">
      <nav className="w-full max-w-3xl sticky top-0 z-40 flex items-center justify-between py-2 px-3 mb-2 bg-morandi-paper/90 backdrop-blur-sm border-b border-morandi-fog">
        <a href="/" className="font-terminal text-lg text-morandi-ink no-underline hover:text-morandi-clay">Challen 王</a>
        <a href="/#projects" className="font-terminal text-base text-morandi-taupe no-underline hover:text-morandi-ink">← 项目档案</a>
      </nav>
      <header className="mb-6 text-center">
        <h1 className="font-pixel text-2xl text-morandi-ink tracking-wider">
          MORANDI TETRIS
        </h1>
        <p className="font-terminal text-lg text-morandi-taupe mt-1">
          像素俄罗斯方块 · 莫兰迪色系 · {best > 0 ? `历史最高 ${best.toLocaleString()}` : '尚无记录'}
        </p>
      </header>

      <main className="flex gap-6 items-start">
        <div className="relative">
          <Board state={state} shake={shake} />
          <Effects effects={effects} />
          <Overlay
            status={state.status}
            score={state.score}
            level={state.level}
            lines={state.lines}
            onStart={a.start}
          />
        </div>
        <SidePanel
          state={state}
          onStart={a.start}
          onPause={a.pause}
          onHistory={() => a.setShowHistory(true)}
          onSettings={() => a.setShowSettings(true)}
        />
      </main>

      <footer className="mt-6 font-terminal text-sm text-morandi-shadow">
        彩蛋：Tetris 消除 · Combo 连击 · 隐藏异形方块 · 速通成就 · 完美着陆 · Konami 码 · 笑脸方块
      </footer>

      {showHistory && (
        <HistoryPanel
          records={history}
          onClose={() => a.setShowHistory(false)}
          onClear={a.clearHistoryRecords}
        />
      )}
      {showSettings && (
        <SettingsModal
          keyMap={keyMap}
          onSave={a.setKeyMap}
          onClose={() => a.setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
