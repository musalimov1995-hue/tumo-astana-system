import React from 'react'
import { DAY_PAIRS, TIME_SLOTS } from '../data/store.js'

export default function SuccessScreen({ application, onFaceScan, onHome }) {
  const accepted = application?.status === 'accepted'

  const dayPair  = DAY_PAIRS.find((d) => d.id === application?.schedule?.days)
  const timeSlot = TIME_SLOTS.find((t) => t.id === application?.schedule?.time)

  return (
    <div className="mob-screen mob-scroll" style={{ paddingTop: 28 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        <div className="mob-success-icon" style={accepted
          ? { background: 'rgba(184,115,224,0.12)', color: '#B873E0' }
          : { background: 'rgba(232,89,12,0.1)', color: '#E8590C' }}>
          {accepted ? '✓' : '⏳'}
        </div>
        <h2 className="mob-success-title">
          {accepted ? 'Заявка принята!' : 'Вы в очереди'}
        </h2>
        <p className="mob-muted" style={{ textAlign: 'center', maxWidth: 260 }}>
          {accepted
            ? 'Место закреплено. Зарегистрируйте биометрию ребёнка.'
            : `Мест пока нет. Позиция в очереди: №${application?.queuePosition}. Уведомим когда освободится место.`}
        </p>
      </div>

      {/* Application ID */}
      <div className="mob-card" style={{ marginBottom: 12 }}>
        <div className="mob-summary-row" style={{ marginBottom: 8 }}>
          <span className="mob-muted">Номер заявки</span>
          <strong style={{ fontFamily: 'var(--font-mono)', color: '#B873E0', fontSize: 12 }}>
            {application?.id}
          </strong>
        </div>
        <div className="mob-summary-row" style={{ marginBottom: 8 }}>
          <span className="mob-muted">Ребёнок</span>
          <strong>{application?.childName}, {application?.childAge} лет</strong>
        </div>
        <div className="mob-summary-row">
          <span className="mob-muted">Статус</span>
          <span className={`mob-badge ${accepted ? 'mob-badge-ok' : 'mob-badge-warn'}`}>
            {accepted ? 'Принят' : 'В очереди'}
          </span>
        </div>
      </div>

      {/* Schedule */}
      {accepted && dayPair && timeSlot && (
        <div className="mob-card" style={{ marginBottom: 12 }}>
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

      {/* Coach preview */}
      {accepted && application?.coachName && (
        <div className="mob-card" style={{ marginBottom: 16 }}>
          <p className="mob-section-label" style={{ marginBottom: 10 }}>Ваш Learning Coach</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="mob-coach-avatar">{application.coachEmoji}</div>
            <div>
              <strong style={{ fontSize: 15 }}>{application.coachName}</strong>
              <p className="mob-muted" style={{ marginTop: 2 }}>{application.coachFocus}</p>
              <p className="mob-muted" style={{ marginTop: 2 }}>
                Workshop Room <strong style={{ color: '#1A1A1A' }}>#{application.workshopRoom}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="mob-muted" style={{ textAlign: 'center', fontSize: 12, marginBottom: 20 }}>
        Сохраните номер заявки для проверки статуса.
      </p>

      {accepted && (
        <button className="mob-btn-primary" style={{ width: '100%', marginBottom: 10 }} onClick={onFaceScan}>
          Зарегистрировать биометрию →
        </button>
      )}
      <button className="mob-btn-secondary" style={{ width: '100%' }} onClick={onHome}>
        На главную
      </button>
    </div>
  )
}
