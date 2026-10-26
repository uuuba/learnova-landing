'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { COPY, type Copy, type Lang } from '@/lib/content'

type Theme = 'light' | 'dark'

type Ctx = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Copy
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<Ctx | null>(null)

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uk')
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ln-lang')
      if (saved === 'uk' || saved === 'en') setLangState(saved)
      else if (navigator.language.toLowerCase().startsWith('uk')) setLangState('uk')
      else setLangState('en')
    } catch {
      setLangState('uk')
    }
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = COPY[lang].meta.title
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem('ln-lang', next)
    } catch {}
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('ln-t', next)
      } catch {}
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, t: COPY[lang], theme, toggleTheme }),
    [lang, setLang, theme, toggleTheme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <Providers>')
  return ctx
}
