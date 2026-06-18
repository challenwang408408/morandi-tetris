import type { GameRecord } from './types'

const KEY = 'tetris_morandi_history_v1'
const MAX = 20

export function loadHistory(): GameRecord[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as GameRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveHistory(records: GameRecord[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(records.slice(0, MAX)))
  } catch {
    // ignore quota errors
  }
}

export function addRecord(record: GameRecord): GameRecord[] {
  const existing = loadHistory()
  const prevHigh = existing.reduce(
    (m, r) => (r.score > m ? r.score : m),
    0,
  )
  record.isHighScore = record.score > prevHigh && record.score > 0
  const next = [record, ...existing].slice(0, MAX)
  saveHistory(next)
  return next
}

export function clearHistory(): GameRecord[] {
  saveHistory([])
  return []
}

export function highScore(records: GameRecord[]): number {
  return records.reduce((m, r) => (r.score > m ? r.score : m), 0)
}
