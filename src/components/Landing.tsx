'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchLanding } from '@/lib/landing-api'
import type { LandingPage, LoadState, PageBlock } from '@/lib/types'
import { useApp } from './Providers'
import { Header } from './Header'
import { Hero } from './Hero'
import { Stats, Features, How, Courses, Faq, Subscribe, Footer } from './Sections'

export function useLanding(slug: string) {
  const { lang } = useApp()
  const [state, setState] = useState<LoadState<LandingPage>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const reload = useCallback(() => setAttempt(value => value + 1), [])
  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })
    void fetchLanding(slug, lang, controller.signal).then(result => {
      if (controller.signal.aborted) return
      setState(result.ok ? { status: 'ready', data: result.data } : { status: 'error', error: result.error })
      if (result.ok) { document.title = result.data.seo.title; document.querySelector('meta[name="description"]')?.setAttribute('content', result.data.seo.description) }
    })
    return () => controller.abort()
  }, [slug, lang, attempt])
  return { state, reload }
}
export function BlockRenderer({ block }: { block: PageBlock }) {
  switch (block.blockType) {
    case 'hero': return <Hero data={block.data} image={block.image} />
    case 'features': return <Features data={block.data} />
    case 'steps': return <How data={block.data} />
    case 'stats': return <Stats data={block.data} />
    case 'faq': return <Faq data={block.data} />
    case 'cta': return <Subscribe data={block.data} />
    case 'courses': return <Courses data={block.data} />
  }
}
export function States({ state, reload }: { state: LoadState<LandingPage>; reload: () => void }) {
  const { lang } = useApp()
  if (state.status === 'loading') return <main className="sec wrap" aria-busy="true"><p role="status">{lang === 'uk' ? 'Завантаження…' : 'Loading…'}</p></main>
  if (state.status === 'error') return <main className="sec wrap"><p role="alert">{lang === 'uk' ? 'Не вдалося завантажити сторінку.' : 'Unable to load the page.'}</p><button className="b" onClick={reload}>{lang === 'uk' ? 'Повторити' : 'Retry'}</button></main>
  return <><Header site={state.data.site} /><main>{state.data.blocks.map((block, index) => <BlockRenderer key={`${block.blockType}-${index}`} block={block} />)}</main><Footer site={state.data.site} /></>
}
export function Landing() {
  return <States {...useLanding('home')} />
}
