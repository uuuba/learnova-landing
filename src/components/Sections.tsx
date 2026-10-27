'use client'

import type { Copy } from '@/lib/content'
import type { SiteSettings } from '@/lib/types'
import Image from 'next/image'
import { Icon } from './Icon'
import { LeadForm } from './LeadForm'
import { useApp } from './Providers'

export function Stats({ data }: { data?: Copy['stats'] } = {}) {
  const { t } = useApp()
  const content = data ?? t.stats
  return (
    <section className="stats" aria-label="Skill Nova">
      <div className="wrap stats-in">
        {content.map((s) => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Features({ data }: { data?: Copy['features'] } = {}) {
  const { t } = useApp()
  const content = data ?? t.features
  return (
    <section className="sec" id="features">
      <div className="wrap">
        <h2 className="sec-title">{content.title}</h2>
        <div className="grid4">
          {content.items.map((item) => (
            <article key={item.title} className="card">
              <span className="ico">
                <Icon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p className="mu">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function How({ data }: { data?: Copy['how'] } = {}) {
  const { t } = useApp()
  const content = data ?? t.how
  return (
    <section className="sec sec-alt" id="how">
      <div className="wrap">
        <h2 className="sec-title">{content.title}</h2>
        <ol className="steps">
          {content.items.map((step, i) => (
            <li key={step.title}>
              <span className="num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p className="mu">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Courses({ data }: { data?: Copy['courses'] } = {}) {
  const { t } = useApp()
  const content = data ?? t.courses
  return (
    <section className="sec sec-alt" id="courses">
      <div className="wrap">
        <h2 className="sec-title">{content.title}</h2>
        <p className="lead">{content.lead}</p>
        <div className="grid4 courses">
          {content.items.map((c) => (
            <article key={c.title} className="course">
              <Image src={c.img} alt="" width={420} height={240} />
              <div>
                <h3>{c.title}</h3>
                <p className="mu">{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq({ data }: { data?: Copy['faq'] } = {}) {
  const { t } = useApp()
  const content = data ?? t.faq
  return (
    <section className="sec" id="faq">
      <div className="wrap narrow">
        <h2 className="sec-title">{content.title}</h2>
        <div className="faq">
          {content.items.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <Icon name="plus" size={18} />
              </summary>
              <p className="mu">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Subscribe({ data }: { data?: Copy['form'] } = {}) {
  const { t } = useApp()
  const content = data ?? t.form
  return (
    <section className="sec cta" id="subscribe">
      <div className="wrap narrow">
        <div className="cta-box">
          <h2 className="sec-title">{content.title}</h2>
          <p className="lead">{content.lead}</p>
          <LeadForm data={content} />
        </div>
      </div>
    </section>
  )
}

export function Footer({ site }: { site?: SiteSettings } = {}) {
  const { t } = useApp()
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <p>{site?.footer ?? t.footer}</p>
        <small>© 2026 {site?.brand ?? "Skill Nova"}</small>
        {site?.contacts && <p>{site.contacts}</p>}
        {site?.socials.map(social => <a key={social.url} href={social.url} rel="noopener noreferrer">{social.label}</a>)}
      </div>
    </footer>
  )
}
