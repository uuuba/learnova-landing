'use client'

import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import { useApp } from './Providers'
import { LANGS } from '@/lib/content'

export function Header() {
  const { t, lang, setLang, theme, toggleTheme } = useApp()
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const sections = t.nav
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
  }, [t])

  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <a className="logo" href="#top" aria-label="Skill Nova">
          <i />
          Skill Nova
        </a>

        <nav className="nav" aria-label="Main">
          {t.nav.map((item) => (
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
