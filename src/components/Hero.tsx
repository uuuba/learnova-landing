'use client'

import Image from 'next/image'
import type { Copy } from '@/lib/content'
import { useApp } from './Providers'

const DEMO_SCORES = [36, 26, 17, 8]

export function Hero({ data, image }: { data?: Copy['hero']; image?: { url: string; alt: string } } = {}) {
  const { t } = useApp()
  const h = data ?? t.hero
  const total = DEMO_SCORES.reduce((a, b) => a + b, 0)

  return (
    <section className="hero" id="top">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>{h.heading}</h1>
          <p className="lead">{h.lead}</p>
          <div className="row">
            <a className="b" href="#subscribe">
              {h.primary}
            </a>
            <a className="b b-ghost" href="#how">
              {h.secondary}
            </a>
          </div>
        </div>

        <article className="rec" aria-label={h.cardTitle}>
          <Image src={image?.url ?? "/img/eng.jpg"} alt={image?.alt ?? ""} width={560} height={300} priority className="rec-img" unoptimized={Boolean(image)} />
          <div className="rec-body">
            <div className="rec-head">
              <div>
                <h2>{h.cardTitle}</h2>
                <p className="mu">{h.cardMeta}</p>
              </div>
              <div className="score" aria-label={`${total} ${h.cardMatch}`}>
                <strong>{total}</strong>
                <span>% {h.cardMatch}</span>
              </div>
            </div>

            <ul className="bars">
              {t.parts.map((part, i) => (
                <li key={part.key}>
                  <span>{part.label}</span>
                  <div className="track">
                    <div className="fill" style={{ width: `${(DEMO_SCORES[i] / part.max) * 100}%` }} />
                  </div>
                  <b>
                    {DEMO_SCORES[i]}/{part.max}
                  </b>
                </li>
              ))}
            </ul>

            <div className="why">
              <b>{h.cardWhy}</b>
              <p>{h.cardWhyText}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
