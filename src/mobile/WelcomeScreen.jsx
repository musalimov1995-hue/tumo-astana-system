import React, { useState } from 'react'
import { getStreamSummary, DAY_PAIRS, TIME_SLOTS } from '../data/store.js'
import { generateEmail, generatePassword } from '../utils/translit.js'
import { getSupabase } from '../lib/supabase.js'

export default function WelcomeScreen({ user, onStart, onNav, application, onCoachChat, onUpdateUser }) {
  const summary  = getStreamSummary()
  const isFull   = summary && summary.occupied >= summary.capacity
  const fillPct  = summary ? Math.round((summary.occupied / summary.capacity) * 100) : 0
  const accepted = application?.status === 'accepted'

  const dayPair  = DAY_PAIRS.find((d) => d.id === application?.schedule?.days)
  const timeSlot = TIME_SLOTS.find((t) => t.id === application?.schedule?.time)

  const [generating, setGenerating] = useState(false)
  const [showCreds, setShowCreds]   = useState(!!user?.tumo_email)
  const [copiedE, setCopiedE]       = useState(false)
  const [copiedP, setCopiedP]       = useState(false)

  async function handleGenerate() {
    if (user?.tumo_email) { setShowCreds(true); return }
    setGenerating(true)
    const email    = generateEmail(user.full_name)
    const password = generatePassword()
    const { data, error } = await getSupabase()
      .from('app_users')
      .update({ tumo_email: email, tumo_password: password })
      .eq('id', user.id)
      .select()
      .single()
    setGenerating(false)
    if (!error && data) { onUpdateUser(data); setShowCreds(true) }
  }

  function copy(text, setFlag) {
    navigator.clipboard.writeText(text).catch(() => {})
    setFlag(true)
    setTimeout(() => setFlag(false), 2000)
  }

  return (
    <div className="mob-screen mob-scroll">
      {/* Header with user + logout */}
      <div className="mob-home-topbar">
        <div>
          <div style={{ fontSize: 12, color: '#9C97A3' }}>Привет,</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{user?.full_name?.split(' ')[0] ?? 'Пользователь'}</div>
        </div>
        <div className="mob-logo-mark" style={{ width: 32, height: 32 }} />
      </div>

      {/* Capacity gauge */}
      {summary && (
        <div className="mob-card mob-capacity-card">
          <div className="mob-cap-label">
            <span>{summary.title}</span>
            <span className={`mob-badge ${isFull ? 'mob-badge-warn' : 'mob-badge-ok'}`}>
              {isFull ? 'Мест нет' : 'Открыт набор'}
            </span>
          </div>
          <div className="mob-gauge-track">
            <div className="mob-gauge-fill" style={{ width: `${fillPct}%`, background: isFull ? '#E8590C' : '#B873E0' }} />
          </div>
          <div className="mob-cap-numbers">
            <span>Занято <strong>{summary.occupied}</strong> из <strong>{summary.capacity}</strong></span>
            {!isFull && <span className="mob-muted">Свободно: {summary.free}</span>}
          </div>
        </div>
      )}

      {/* tumo.world credentials card */}
      <div className="mob-card" style={{ marginBottom: 12 }}>
        <p className="mob-section-label" style={{ marginBottom: 10 }}>Аккаунт tumo.world</p>
        {!showCreds ? (
          <>
            <p className="mob-muted" style={{ fontSize: 13, marginBottom: 14 }}>
              После зачисления в TUMO вам будет доступен личный кабинет на платформе tumo.world для выбора курсов.
            </p>
            <button
              className="mob-btn-primary"
              style={{ width: '100%', opacity: generating ? 0.7 : 1 }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Генерируем…' : '🔑 Сгенерировать логин и пароль'}
            </button>
          </>
        ) : (
          <>
            <div className="mob-creds-card" style={{ marginBottom: 0 }}>
              <div className="mob-creds-row">
                <div className="mob-creds-label"><span className="mob-creds-icon">✉️</span><span>Логин (Email)</span></div>
                <div className="mob-creds-value">{user.tumo_email}</div>
                <button className={`mob-copy-btn ${copiedE ? 'mob-copy-btn-ok' : ''}`} onClick={() => copy(user.tumo_email, setCopiedE)}>
                  {copiedE ? '✓' : 'Копировать'}
                </button>
              </div>
              <div className="mob-creds-divider" />
              <div className="mob-creds-row">
                <div className="mob-creds-label"><span className="mob-creds-icon">🔑</span><span>Пароль</span></div>
                <div className="mob-creds-value mob-creds-password">{user.tumo_password}</div>
                <button className={`mob-copy-btn ${copiedP ? 'mob-copy-btn-ok' : ''}`} onClick={() => copy(user.tumo_password, setCopiedP)}>
                  {copiedP ? '✓' : 'Копировать'}
                </button>
              </div>
            </div>
            <p className="mob-muted" style={{ fontSize: 11, marginTop: 10 }}>
              Используйте эти данные для входа на tumo.world после ориентационного месяца.
            </p>
          </>
        )}
      </div>

      {/* Coach card */}
      {accepted && application.coachName && (
        <button className="mob-coach-home-card" onClick={onCoachChat}>
          <div className="mob-coach-home-left">
            <div className="mob-coach-avatar">{application.coachEmoji}</div>
            <div>
              <div style={{ fontSize: 11, color: '#B873E0', fontWeight: 700, marginBottom: 2 }}>ВАШ LEARNING COACH</div>
              <strong style={{ fontSize: 14 }}>{application.coachName}</strong>
              <div className="mob-muted" style={{ fontSize: 12, marginTop: 1 }}>
                Room #{application.workshopRoom} · {dayPair?.short} · {timeSlot?.label}
              </div>
            </div>
          </div>
          <div className="mob-coach-home-badge">Чат</div>
        </button>
      )}

      {/* Action cards */}
      <div className="mob-action-list">
        {!accepted && (
          <button className="mob-action-card" onClick={onStart}>
            <div className="mob-action-icon" style={{ background: 'rgba(184,115,224,0.15)', color: '#B873E0' }}>
              <PlusIcon />
            </div>
            <div className="mob-action-text">
              <strong>Подать заявку</strong>
              <span>Зарегистрировать ребёнка в TUMO</span>
            </div>
            <ChevronRight />
          </button>
        )}

        <button className="mob-action-card" onClick={() => onNav('status')}>
          <div className="mob-action-icon" style={{ background: 'rgba(77,139,49,0.12)', color: '#4D8B31' }}>
            <SearchIcon />
          </div>
          <div className="mob-action-text">
            <strong>Проверить статус</strong>
            <span>Узнать позицию в очереди</span>
          </div>
          <ChevronRight />
        </button>

        <button className="mob-action-card" onClick={() => onNav('guide')}>
          <div className="mob-action-icon" style={{ background: 'rgba(232,89,12,0.1)', color: '#E8590C' }}>
            <MapPinIcon />
          </div>
          <div className="mob-action-text">
            <strong>Как пройти в TUMO</strong>
            <span>Гид по зданию и входу</span>
          </div>
          <ChevronRight />
        </button>
      </div>

      {/* Onboarding shortcut */}
      <button className="mob-onboarding-card" onClick={() => onNav('onboarding')}>
        <div className="mob-onboarding-left">
          <span className="mob-onboarding-emoji">📚</span>
          <div>
            <strong>Вводный курс о TUMO</strong>
            <span className="mob-muted">4 видео + тесты · обязательно</span>
          </div>
        </div>
        <ChevronRight />
      </button>

      <div className="mob-info-banner">
        Биометрия ребёнка регистрируется после принятия заявки — с согласия родителя через ЭЦП.
      </div>
    </div>
  )
}

function PlusIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg> }
function SearchIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg> }
function MapPinIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function ChevronRight(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,opacity:0.35}}><path d="M9 18l6-6-6-6"/></svg> }
