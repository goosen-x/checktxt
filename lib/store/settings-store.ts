import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ResultTab = 'errors' | 'seo' | 'plagiarism' | 'style'

interface SettingsState {
  // Privacy mode - when enabled, disables LT and plagiarism checks
  privateMode: boolean

  // Active tab in results panel
  activeTab: ResultTab

  // Keywords for SEO analysis
  seoKeywords: string[]

  // Actions
  setPrivateMode: (enabled: boolean) => void
  togglePrivateMode: () => void
  setActiveTab: (tab: ResultTab) => void
  setSeoKeywords: (keywords: string[]) => void
  addSeoKeyword: (keyword: string) => void
  removeSeoKeyword: (keyword: string) => void
  reset: () => void
}

const initialState = {
  privateMode: false,
  activeTab: 'errors' as ResultTab,
  seoKeywords: [],
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPrivateMode: (privateMode) => set({ privateMode }),

      togglePrivateMode: () => {
        const { privateMode } = get()
        set({ privateMode: !privateMode })
      },

      setActiveTab: (activeTab) => set({ activeTab }),

      setSeoKeywords: (seoKeywords) => set({ seoKeywords }),

      addSeoKeyword: (keyword) => {
        const { seoKeywords } = get()
        const trimmed = keyword.trim().toLowerCase()
        if (trimmed && !seoKeywords.includes(trimmed)) {
          set({ seoKeywords: [...seoKeywords, trimmed] })
        }
      },

      removeSeoKeyword: (keyword) => {
        const { seoKeywords } = get()
        set({ seoKeywords: seoKeywords.filter(k => k !== keyword) })
      },

      reset: () => set(initialState),
    }),
    {
      name: 'checktxt:settings',
    }
  )
)
