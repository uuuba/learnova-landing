'use client'

import type { SiteSettings } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import { useApp } from './Providers'
import { LANGS } from '@/lib/content'

export function Header({ site }: { site?: SiteSettings } = {}) {
  const { t, lang, setLang, theme, toggleTheme } = useApp()
  const nav = site ? site.nav.map(item => ({ label: item.label, id: item.href.slice(1) })) : t.nav
  const navKey = JSON.stringify(nav)
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    sections.forEach((el) => observer.observe(el))

    const onScroll = () => {
      if (window.scrollY < 200) setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [navKey])

  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <a className="logo" href="#top" aria-label={site?.brand ?? "Skill Nova"}>
          <i />
          {site?.brand ?? "Skill Nova"}
        </a>

        <nav className="nav" aria-label="Main">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? 'on' : undefined}
              aria-current={active === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="tools">
          <div className="seg" role="group" aria-label="Language">
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code === 'uk' ? 'UA' : 'EN'}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="ib"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
          <a className="b b-sm" href="#subscribe">
            {t.headerCta}
          </a>
        </div>
      </div>
    </header>
  )
}
