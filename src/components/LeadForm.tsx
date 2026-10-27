'use client'

import type { Copy } from '@/lib/content'
import { useState } from 'react'
import { useApp } from './Providers'

type Status = 'idle' | 'sending' | 'ok' | 'duplicate' | 'invalid' | 'error'

export function LeadForm({ data }: { data?: Copy['form'] } = {}) {
  const { t, lang } = useApp()
  const f = data ?? t.form
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, lang, website }),
      })
      if (res.status === 201) {
        setStatus('ok')
        setEmail('')
        setName('')
      } else if (res.status === 409) setStatus('duplicate')
      else if (res.status === 400) setStatus('invalid')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const message =
    status === 'ok'
      ? f.ok
      : status === 'duplicate'
        ? f.duplicate
        : status === 'invalid'
          ? f.invalid
          : status === 'error'
            ? f.error
            : ''

  return (
    <form className="lead-form" onSubmit={onSubmit} noValidate>
      <label>
        {f.name}
        <input
          type="text"
          name="name"
          autoComplete="name"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        {f.email}
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== 'sending') setStatus('idle')
          }}
          aria-invalid={status === 'invalid'}
        />
      </label>
      <input
        className="hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <button className="b" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.submit}
      </button>
      <p className={`msg ${status === 'ok' ? 'good' : status === 'idle' ? '' : 'bad'}`} role="status">
        {message}
      </p>
    </form>
  )
}
