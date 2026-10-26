'use client'

import Image from 'next/image'
import { Icon } from './Icon'
import { LeadForm } from './LeadForm'
import { useApp } from './Providers'

export function Stats() {
  const { t } = useApp()
  return (
    <section className="stats" aria-label="Skill Nova">
      <div className="wrap stats-in">
        {t.stats.map((s) => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Features() {
  const { t } = useApp()
  return (
    <section className="sec" id="features">
      <div className="wrap">
        <h2 className="sec-title">{t.features.title}</h2>
        <div className="grid4">
          {t.features.items.map((item) => (
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

export function How() {
  const { t } = useApp()
  return (
    <section className="sec sec-alt" id="how">
      <div className="wrap">
        <h2 className="sec-title">{t.how.title}</h2>
        <ol className="steps">
          {t.how.items.map((step, i) => (
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

export function Courses() {
  const { t } = useApp()
  return (
    <section className="sec sec-alt" id="courses">
      <div className="wrap">
        <h2 className="sec-title">{t.courses.title}</h2>
        <p className="lead">{t.courses.lead}</p>
        <div className="grid4 courses">
          {t.courses.items.map((c) => (
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

export function Faq() {
  const { t } = useApp()
  return (
    <section className="sec" id="faq">
      <div className="wrap narrow">
        <h2 className="sec-title">{t.faq.title}</h2>
        <div className="faq">
          {t.faq.items.map((item) => (
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

export function Subscribe() {
  const { t } = useApp()
  return (
    <section className="sec cta" id="subscribe">
      <div className="wrap narrow">
        <div className="cta-box">
          <h2 className="sec-title">{t.form.title}</h2>
          <p className="lead">{t.form.lead}</p>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useApp()
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <p>{t.footer}</p>
        <small>© 2026 Skill Nova</small>
      </div>
    </footer>
  )
}
