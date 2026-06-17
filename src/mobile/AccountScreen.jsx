import React, { useState, useEffect } from 'react'
import { generateEmail, generatePassword } from '../utils/translit.js'
import { DAY_PAIRS, TIME_SLOTS } from '../data/store.js'

export default function AccountScreen({ application, onNext, onHome }) {
  const { childName, childAge, coachName, coachEmoji, coachFocus, workshopRoom, schedule } = application || {}

  const eligible = childAge >= 12 && childAge <= 18
  const [email]    = useState(() => eligible ? generateEmail(childName) : null)
  const [password] = useState(() => eligible ? generatePassword() : null)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPass,  setCopiedPass]  = useState(false)
  const [creating, setCreating] = useState(true)

  const dayPair  = DAY_PAIRS.find((d) => d.id === schedule?.days)
  const timeSlot = TIME_SLOTS.find((t) => t.id === schedule?.time)

  useEffect(() => {
    const t = setTimeout(() => setCreating(false), 2000)
    return () => clearTimeout(t)
  }, [])

  function copy(text, setFlag) {
    navigator.clipboard.writeText(text).catch(() => {})
    setFlag(true)
    setTimeout(() => setFlag(false), 2000)
  }

  if (creating) {
    return (
      <div className="mob-screen mob-scroll" style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <div className="mob-t360-logo">T360</div>
        <div className="mob-ecp-step" style={{ marginTop: 20, flexDirection: 'column', gap: 12 }}>
          <div className="mob-spinner" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 14, color: '#6B6670' }}>Создаём аккаунт в T360…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mob-screen mob-scroll" style={{ paddingTop: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        <div className="mob-t360-logo" style={{ marginBottom: 12 }}>T360</div>
        <div className="mob-badge mob-badge-ok" style={{ fontSize: 13, padding: '6px 14px', marginBottom: 10 }}>
          ✓ Аккаунт создан
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, textAlign: 'center', margin: 0 }}>
          Добро пожаловать, {childName?.split(' ')[0]}!
        </h2>
      </div>

      {/* Credentials */}
      {eligible && (
        <div className="mob-creds-card" style={{ marginBottom: 14 }}>
          <div className="mob-creds-row">
            <div className="mob-creds-label"><span className="mob-creds-icon">✉️</span><span>Email / Логин</span></div>
            <div className="mob-creds-value">{email}</div>
            <button className={`mob-copy-btn ${copiedEmail ? 'mob-copy-btn-ok' : ''}`} onClick={() => copy(email, setCopiedEmail)}>
              {copiedEmail ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
          <div className="mob-creds-divider" />
          <div className="mob-creds-row">
            <div className="mob-creds-label"><span className="mob-creds-icon">🔑</span><span>Пароль</span></div>
            <div className="mob-creds-value mob-creds-password">{password}</div>
            <button className={`mob-copy-btn ${copiedPass ? 'mob-copy-btn-ok' : ''}`} onClick={() => copy(password, setCopiedPass)}>
              {copiedPass ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
        </div>
      )}

      {!eligible && (
        <div className="mob-info-banner" style={{ marginBottom: 14 }}>
          Аккаунт tumo.world создаётся для учеников от 12 лет. {childName?.split(' ')[0]} сможет получить доступ позже.
        </div>
      )}

      {/* Coach card */}
      {coachName && (
        <div className="mob-card" style={{ marginBottom: 14 }}>
          <p className="mob-section-label" style={{ marginBottom: 12 }}>Ваш Learning Coach</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div className="mob-coach-avatar mob-coach-avatar-lg">{coachEmoji}</div>
            <div>
              <strong style={{ fontSize: 16 }}>{coachName}</strong>
              <p className="mob-muted" style={{ marginTop: 3 }}>{coachFocus}</p>
            </div>
          </div>
          <div className="mob-coach-room-badge">
            <span>🚪</span>
            <span>Workshop Room <strong>#{workshopRoom}</strong></span>
          </div>
        </div>
      )}

      {/* Schedule card */}
      {dayPair && timeSlot && (
        <div className="mob-card" style={{ marginBottom: 14 }}>
          <p className="mob-section-label" style={{ marginBottom: 10 }}>Расписание</p>
          <div className="mob-summary-row" style={{ marginBottom: 8 }}>
            <span className="mob-muted">Дни</span>
            <strong>{dayPair.short}</strong>
          </div>
          <div className="mob-summary-row">
            <span className="mob-muted">Поток</span>
            <strong>{timeSlot.icon} {timeSlot.label}</strong>
          </div>
        </div>
      )}

      {/* Next steps */}
      <div className="mob-account-steps" style={{ marginBottom: 16 }}>
        <p className="mob-section-label" style={{ marginBottom: 10 }}>Что дальше?</p>
        {[
          { icon: '📧', text: 'Войди в Gmail через выданный email — там будет папка TUMO Astana' },
          { icon: '🌐', text: 'Зайди на tumo.world с этим же email и паролем' },
          { icon: '📚', text: 'После ориентационного месяца выбери 4 направления на tumo.world' },
          { icon: '🚪', text: `Приходи в Workshop Room #${workshopRoom ?? '—'} к своему Coach-у` },
          { icon: '🎫', text: 'Турникет откроется автоматически — лицо уже зарегистрировано' },
        ].map((s, i) => (
          <div key={i} className="mob-account-step">
            <span className="mob-account-step-icon">{s.icon}</span>
            <span>{s.text}</span>
          </div>
        ))}
      </div>

      <div className="mob-info-banner" style={{ marginBottom: 20 }}>
        Смените пароль после первого входа в Gmail.
      </div>

      <button className="mob-btn-primary" style={{ width: '100%', marginBottom: 10 }} onClick={onNext}>
        Смотреть вводные видео →
      </button>
      <button className="mob-btn-secondary" style={{ width: '100%', marginBottom: 16 }} onClick={onHome}>
        Пропустить, на главную
      </button>
    </div>
  )
}
