import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Highlight, Language, LanguageOption } from '@/lib/types'

interface EditorState {
  // Text content
  text: string

  // Language settings
  language: LanguageOption
  detectedLanguage: Language | null

  // Highlights for errors/issues
  highlights: Highlight[]
  activeHighlight: string | null

  // Actions
  setText: (text: string) => void
  setLanguage: (lang: LanguageOption) => void
  setDetectedLanguage: (lang: Language | null) => void
  setHighlights: (highlights: Highlight[]) => void
  addHighlights: (highlights: Highlight[]) => void
  clearHighlights: () => void
  setActiveHighlight: (id: string | null) => void
  dismissHighlight: (id: string) => void
  applyReplacement: (id: string, replacement: string) => void
  reset: () => void
}

const initialState = {
  text: '',
  language: 'auto' as LanguageOption,
  detectedLanguage: null,
  highlights: [],
  activeHighlight: null,
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setText: (text) => set({ text }),

      setLanguage: (language) => set({ language }),

      setDetectedLanguage: (detectedLanguage) => set({ detectedLanguage }),

      setHighlights: (highlights) => set({ highlights }),

      addHighlights: (newHighlights) => {
        const { highlights } = get()
        set({ highlights: [...highlights, ...newHighlights] })
      },

      clearHighlights: () => set({ highlights: [], activeHighlight: null }),

      setActiveHighlight: (activeHighlight) => set({ activeHighlight }),

      dismissHighlight: (id) => {
        const { highlights, activeHighlight } = get()
        set({
          highlights: highlights.filter(h => h.id !== id),
          activeHighlight: activeHighlight === id ? null : activeHighlight,
        })
      },

      applyReplacement: (id, replacement) => {
        const { text, highlights } = get()
        const highlight = highlights.find(h => h.id === id)

        if (!highlight) return

        const { offset, length } = highlight
        const newText = text.slice(0, offset) + replacement + text.slice(offset + length)

        // Calculate position delta
        const delta = replacement.length - length

        // Update remaining highlights positions
        const newHighlights = highlights
          .filter(h => h.id !== id)
          .map(h => {
            if (h.offset > offset) {
              return { ...h, offset: h.offset + delta }
            }
            // Check for overlapping highlights and remove them
            if (h.offset < offset && h.offset + h.length > offset) {
              return null
            }
            return h
          })
          .filter((h): h is Highlight => h !== null)

        set({
          text: newText,
          highlights: newHighlights,
          activeHighlight: null,
        })
      },

      reset: () => set(initialState),
    }),
    {
      name: 'checktxt:editor',
      partialize: (state) => ({
        text: state.text,
        language: state.language,
      }),
    }
  )
)

// Selectors
export const selectWordCount = (state: EditorState) =>
  state.text.trim() ? state.text.trim().split(/\s+/).length : 0

export const selectCharCount = (state: EditorState) =>
  state.text.length

export const selectEffectiveLanguage = (state: EditorState): Language =>
  state.language === 'auto'
    ? state.detectedLanguage || 'ru'
    : state.language

export const selectHighlightsByType = (type: Highlight['type']) => (state: EditorState) =>
  state.highlights.filter(h => h.type === type)

export const selectHighlightById = (id: string) => (state: EditorState) =>
  state.highlights.find(h => h.id === id)
