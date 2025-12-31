import { create } from 'zustand'

export interface WeakConcept {
  concept: string
  strength: number // 0-100, lower = weaker
  attempts: number
  wrongAttempts: number
  lastPracticed: string
}

export interface ProblemAttempt {
  problemId: string
  concept: string
  hintsUsed: number
  correct: boolean
  timeSpent: number
  timestamp: string
}

export interface LabAttempt {
  labId: string
  mode: 'guided' | 'exam'
  score: number
  mistakes: number
  timestamp: string
}

interface AppState {
  darkMode: boolean
  weakConcepts: WeakConcept[]
  problemAttempts: ProblemAttempt[]
  labAttempts: LabAttempt[]
  toggleDarkMode: () => void
  addProblemAttempt: (attempt: ProblemAttempt) => void
  addLabAttempt: (attempt: LabAttempt) => void
  updateWeakConcepts: () => void
  loadFromStorage: () => void
}

const STORAGE_KEY = 'chemistry-platform-storage'

export const useStore = create<AppState>((set, get) => ({
  darkMode: false,
  weakConcepts: [],
  problemAttempts: [],
  labAttempts: [],

  loadFromStorage: () => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        set({
          darkMode: data.darkMode || false,
          weakConcepts: data.weakConcepts || [],
          problemAttempts: data.problemAttempts || [],
          labAttempts: data.labAttempts || [],
        })
        // Apply dark mode class
        if (data.darkMode) {
          document.documentElement.classList.add('dark')
        }
      }
    } catch (e) {
      console.error('Failed to load from storage', e)
    }
  },

  toggleDarkMode: () => {
    const newMode = !get().darkMode
    set({ darkMode: newMode })
    // Update HTML class
    if (typeof window !== 'undefined') {
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      // Save to storage
      get().saveToStorage()
    }
  },

  addProblemAttempt: (attempt) => {
    const attempts = [...get().problemAttempts, attempt]
    set({ problemAttempts: attempts })
    get().updateWeakConcepts()
    get().saveToStorage()
  },

  addLabAttempt: (attempt) => {
    const attempts = [...get().labAttempts, attempt]
    set({ labAttempts: attempts })
    get().saveToStorage()
  },

  updateWeakConcepts: () => {
    const attempts = get().problemAttempts
    const conceptMap = new Map<string, { attempts: number; wrong: number; hints: number }>()

    attempts.forEach((attempt) => {
      const existing = conceptMap.get(attempt.concept) || { attempts: 0, wrong: 0, hints: 0 }
      conceptMap.set(attempt.concept, {
        attempts: existing.attempts + 1,
        wrong: existing.wrong + (attempt.correct ? 0 : 1),
        hints: existing.hints + attempt.hintsUsed,
      })
    })

    const weakConcepts: WeakConcept[] = Array.from(conceptMap.entries()).map(([concept, data]) => {
      const accuracy = (data.attempts - data.wrong) / data.attempts
      const hintPenalty = data.hints / (data.attempts * 3) // Penalize hint usage
      const strength = Math.max(0, Math.min(100, (accuracy - hintPenalty) * 100))

      return {
        concept,
        strength,
        attempts: data.attempts,
        wrongAttempts: data.wrong,
        lastPracticed: new Date().toISOString(),
      }
    })

    set({ weakConcepts })
    get().saveToStorage()
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return
    try {
      const state = get()
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          darkMode: state.darkMode,
          weakConcepts: state.weakConcepts,
          problemAttempts: state.problemAttempts,
          labAttempts: state.labAttempts,
        })
      )
    } catch (e) {
      console.error('Failed to save to storage', e)
    }
  },
}))

