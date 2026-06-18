import { useEffect, useState } from 'react'

const LABELS: Record<string, string> = {
  left: '左移',
  right: '右移',
  rotate: '旋转',
  softDrop: '软降',
  hardDrop: '硬降',
  pause: '暂停',
}

const ORDER = ['left', 'right', 'rotate', 'softDrop', 'hardDrop', 'pause']

function keyLabel(k: string): string {
  if (k === ' ') return 'Space'
  const map: Record<string, string> = {
    ArrowLeft: '←',
    ArrowRight: '→',
    ArrowUp: '↑',
    ArrowDown: '↓',
  }
  return map[k] ?? k.toUpperCase()
}

export function SettingsModal({
  keyMap,
  onSave,
  onClose,
}: {
  keyMap: Record<string, string>
  onSave: (km: Record<string, string>) => void
  onClose: () => void
}) {
  const [local, setLocal] = useState<Record<string, string>>(keyMap)
  const [listening, setListening] = useState<string | null>(null)

  useEffect(() => {
    if (!listening) return
    const handler = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.key === 'Escape') {
        setListening(null)
        return
      }
      setLocal((prev) => ({ ...prev, [listening]: e.key }))
      setListening(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [listening])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-morandi-ink/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-morandi-paper rounded-xl border border-morandi-fog shadow-2xl w-[420px] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-morandi-fog">
          <h2 className="font-pixel text-sm text-morandi-ink">按键设置</h2>
          <button
            onClick={onClose}
            className="font-terminal text-2xl text-morandi-taupe hover:text-morandi-ink px-2 leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-2">
          {ORDER.map((k) => (
            <div
              key={k}
              className="flex items-center justify-between py-2 border-b border-morandi-fog/40"
            >
              <span className="font-terminal text-lg text-morandi-ink">
                {LABELS[k]}
              </span>
              <button
                onClick={() => setListening(k)}
                className={`font-pixel text-[10px] px-3 py-2 rounded-md min-w-[90px] transition-colors ${
                  listening === k
                    ? 'bg-morandi-moss text-morandi-paper blink'
                    : 'bg-morandi-stone text-morandi-ink hover:bg-morandi-fog'
                }`}
              >
                {listening === k ? '按键中…' : keyLabel(local[k])}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 px-6 py-3 border-t border-morandi-fog">
          <button
            onClick={onClose}
            className="font-pixel text-[9px] px-4 py-2 rounded-md bg-morandi-paper border border-morandi-fog text-morandi-taupe hover:bg-morandi-stone transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              onSave(local)
              onClose()
            }}
            className="font-pixel text-[9px] px-4 py-2 rounded-md bg-morandi-moss text-morandi-paper hover:bg-morandi-taupe transition-colors"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  )
}
