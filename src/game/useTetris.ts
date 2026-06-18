import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clearLines,
  clonePiece,
  collides,
  dropDistance,
  dropInterval,
  emptyBoard,
  levelFromLines,
  makePiece,
  merge,
  pickNext,
  refillBag,
  rotatePiece,
  ROWS,
  scoreForLines,
} from './tetris'
import { addRecord, clearHistory, loadHistory } from './storage'
import type { EasterEggEvent, GameRecord, GameState } from './types'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

function makeInitialState(): GameState {
  return {
    board: emptyBoard(),
    current: null,
    next: 'I',
    bag: refillBag(),
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    maxCombo: 0,
    tetrisCount: 0,
    status: 'idle',
    startTime: 0,
    elapsed: 0,
    godMode: false,
  }
}

function pushEffect(
  setEffects: React.Dispatch<React.SetStateAction<EasterEggEvent[]>>,
  kind: EasterEggEvent['kind'],
  text: string,
) {
  const id = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  setEffects((prev) => [...prev, { id, kind, text, createdAt: Date.now() }])
  window.setTimeout(() => {
    setEffects((prev) => prev.filter((e) => e.id !== id))
  }, 1700)
}

interface Achievements {
  speedster: boolean
  godUsed: boolean
}

export function useTetris() {
  const [state, setState] = useState<GameState>(makeInitialState)
  const [effects, setEffects] = useState<EasterEggEvent[]>([])
  const [shake, setShake] = useState(false)
  const [history, setHistory] = useState<GameRecord[]>(() => loadHistory())
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [keyMap, setKeyMap] = useState<Record<string, string>>({
    left: 'ArrowLeft',
    right: 'ArrowRight',
    rotate: 'ArrowUp',
    softDrop: 'ArrowDown',
    hardDrop: ' ',
    pause: 'p',
  })

  const stateRef = useRef(state)
  stateRef.current = state
  const keyMapRef = useRef(keyMap)
  keyMapRef.current = keyMap
  const achievementsRef = useRef<Achievements>({
    speedster: false,
    godUsed: false,
  })
  const konamiRef = useRef<string[]>([])

  const triggerShake = useCallback(() => {
    setShake(true)
    window.setTimeout(() => setShake(false), 420)
  }, [])

  const lockAndSpawn = useCallback(
    (s: GameState): GameState => {
      if (!s.current) return s
      const merged = merge(s.board, s.current)

      // perfect landing: 方块落地最低填充行是否被消除
      let minLanded = ROWS
      const n = s.current.shape.length
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (s.current.shape[r][c]) {
            const br = s.current.row + r
            if (br < minLanded) minLanded = br
          }
        }
      }

      const { board, cleared } = clearLines(merged)
      const linesCleared = cleared.length

      let combo = 0
      let score = s.score
      let tetrisCount = s.tetrisCount
      let maxCombo = s.maxCombo

      if (linesCleared > 0) {
        combo = s.combo + 1
        const isSmile = s.current.type === 'SMILE'
        score += scoreForLines(linesCleared, s.level, combo - 1, isSmile)
        if (combo > maxCombo) maxCombo = combo

        if (linesCleared === 4) {
          tetrisCount += 1
          pushEffect(setEffects, 'tetris', 'TETRIS!')
          triggerShake()
        }

        if (combo >= 2) {
          pushEffect(setEffects, 'combo', `COMBO x${combo}`)
        }

        if (cleared.includes(minLanded)) {
          pushEffect(setEffects, 'perfect', 'PERFECT!')
        }

        if (
          !achievementsRef.current.speedster &&
          s.elapsed <= 60 &&
          s.lines + linesCleared >= 10
        ) {
          achievementsRef.current.speedster = true
          pushEffect(setEffects, 'speedster', 'SPEEDSTER!')
          triggerShake()
        }
      } else {
        combo = 0
      }

      const lines = s.lines + linesCleared
      const level = levelFromLines(lines)

      // spawn next
      const picked = pickNext(s.bag, score)
      const next = makePiece(picked.type)
      const newNext: GameState['next'] = picked.type

      let status: GameState['status'] = 'playing'
      let gameOver = false
      if (collides(board, next)) {
        status = 'over'
        gameOver = true
      }

      const newState: GameState = {
        ...s,
        board,
        current: gameOver ? null : next,
        next: newNext,
        bag: picked.bag,
        score,
        level,
        lines,
        combo,
        maxCombo,
        tetrisCount,
        status,
        godMode: gameOver ? false : s.godMode,
      }

      if (gameOver) {
        const record: GameRecord = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          score: newState.score,
          level: newState.level,
          lines: newState.lines,
          durationSec: Math.round(newState.elapsed),
          date: new Date().toISOString(),
          isHighScore: false,
          tetrisCount: newState.tetrisCount,
          maxCombo: newState.maxCombo,
        }
        const updated = addRecord(record)
        setHistory(updated)
        pushEffect(setEffects, 'godmode', 'GAME OVER')
      } else {
        if (picked.type === 'PLUS') {
          pushEffect(setEffects, 'plus', '+ 彩蛋方块')
        } else if (picked.type === 'SMILE') {
          pushEffect(setEffects, 'smile', ':) 笑脸 x2')
        }
      }

      return newState
    },
    [triggerShake],
  )

  const tick = useCallback(() => {
    const s = stateRef.current
    if (s.status !== 'playing' || !s.current) return
    const test = clonePiece(s.current)
    test.row += 1
    if (collides(s.board, test)) {
      setState((prev) => lockAndSpawn(prev))
    } else {
      setState((prev) => ({ ...prev, current: test }))
    }
  }, [lockAndSpawn])

  const start = useCallback(() => {
    achievementsRef.current = { speedster: false, godUsed: false }
    const fresh = makeInitialState()
    const picked = pickNext(fresh.bag, 0)
    const piece = makePiece('I')
    setState({
      ...fresh,
      current: piece,
      next: picked.type,
      bag: picked.bag,
      status: 'playing',
      startTime: Date.now(),
      elapsed: 0,
    })
  }, [])

  const pause = useCallback(() => {
    setState((s) =>
      s.status === 'playing'
        ? { ...s, status: 'paused' }
        : s.status === 'paused'
          ? { ...s, status: 'playing' }
          : s,
    )
  }, [])

  const move = useCallback((dir: -1 | 1) => {
    setState((s) => {
      if (s.status !== 'playing' || !s.current) return s
      const test = clonePiece(s.current)
      test.col += dir
      if (collides(s.board, test)) return s
      return { ...s, current: test }
    })
  }, [])

  const rotate = useCallback(() => {
    setState((s) => {
      if (s.status !== 'playing' || !s.current) return s
      const rotated = rotatePiece(s.board, s.current)
      return { ...s, current: rotated }
    })
  }, [])

  const softDrop = useCallback(() => {
    setState((s) => {
      if (s.status !== 'playing' || !s.current) return s
      const test = clonePiece(s.current)
      test.row += 1
      if (collides(s.board, test)) {
        return lockAndSpawn(s)
      }
      return { ...s, current: test, score: s.score + 1 }
    })
  }, [lockAndSpawn])

  const hardDrop = useCallback(() => {
    setState((s) => {
      if (s.status !== 'playing' || !s.current) return s
      const dist = dropDistance(s.board, s.current)
      const dropped = clonePiece(s.current)
      dropped.row += dist
      const scored = { ...s, current: dropped, score: s.score + dist * 2 }
      return lockAndSpawn(scored)
    })
  }, [lockAndSpawn])

  const clearHistoryRecords = useCallback(() => {
    clearHistory()
    setHistory([])
  }, [])

  const toggleGodMode = useCallback(() => {
    setState((s) => {
      if (s.status !== 'playing') return s
      const next = !s.godMode
      if (next && !achievementsRef.current.godUsed) {
        achievementsRef.current.godUsed = true
        pushEffect(setEffects, 'godmode', 'GOD MODE')
      }
      return { ...s, godMode: next }
    })
  }, [])

  // game loop
  useEffect(() => {
    if (state.status !== 'playing') return
    const interval = state.godMode
      ? dropInterval(state.level) * 2.5
      : dropInterval(state.level)
    const id = window.setInterval(tick, interval)
    return () => window.clearInterval(id)
  }, [state.status, state.level, state.godMode, tick])

  // elapsed timer
  useEffect(() => {
    if (state.status !== 'playing') return
    const id = window.setInterval(() => {
      setState((s) =>
        s.status === 'playing'
          ? { ...s, elapsed: (Date.now() - s.startTime) / 1000 }
          : s,
      )
    }, 250)
    return () => window.clearInterval(id)
  }, [state.status, state.startTime])

  // keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const km = keyMapRef.current
      const key = e.key

      // konami code
      konamiRef.current = [...konamiRef.current.slice(-9), key]
      if (
        konamiRef.current.length === KONAMI.length &&
        KONAMI.every((k, i) => konamiRef.current[i] === k)
      ) {
        e.preventDefault()
        toggleGodMode()
        konamiRef.current = []
        return
      }

      if (key === km.left) {
        e.preventDefault()
        move(-1)
      } else if (key === km.right) {
        e.preventDefault()
        move(1)
      } else if (key === km.rotate) {
        e.preventDefault()
        rotate()
      } else if (key === km.softDrop) {
        e.preventDefault()
        softDrop()
      } else if (key === km.hardDrop) {
        e.preventDefault()
        hardDrop()
      } else if (key === km.pause) {
        e.preventDefault()
        pause()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move, rotate, softDrop, hardDrop, pause, toggleGodMode])

  return {
    state,
    effects,
    shake,
    history,
    showHistory,
    showSettings,
    keyMap,
    actions: {
      start,
      pause,
      move,
      rotate,
      softDrop,
      hardDrop,
      toggleGodMode,
      setShowHistory,
      setShowSettings,
      setKeyMap,
      clearHistoryRecords,
    },
  }
}
