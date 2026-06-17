import React from 'react'
import { Link } from 'react-router-dom'
import { getStreamSummary } from '../data/store.js'

export default function Home() {
  const summary = getStreamSummary()
  const fillPercent = summary ? Math.round((summary.occupied / summary.capacity) * 100) : 0
  const isFull = summary && summary.occupied >= summary.capacity

  return (
    <main className="page page-wide">
      <div className="eyebrow">Платформа приёма и кураторства</div>
      <h1 className="page-title">Добро пожаловать в TUMO!</h1>
      <p className="page-subtitle">
        Родители подают заявку и сразу видят, есть ли место в потоке или их ребёнок встал в очередь.
        Коучи отмечают посещаемость и прогресс. Лимит следующего потока считается по числу выпустившихся —
        вручную или автоматически.
      </p>

      {summary && (
        <div className="card" style={{ marginBottom: 36 }}>
          <div className="section-heading">
            <h2>{summary.title}</h2>
            <span className="muted">Лимит обновляется в админ-панели</span>
          </div>
          <div className="gauge">
            <div className="gauge-track">
              <div
                className={`gauge-fill ${isFull ? 'is-full' : ''}`}
                style={{ '--fill': `${fillPercent}%` }}
              />
            </div>
            <div className="gauge-labels">
              <span>Занято мест: <strong>{summary.occupied}</strong> из <strong>{summary.capacity}</strong></span>
              <span>{isFull ? 'Набор закрыт — новые заявки идут в очередь' : `Свободно: ${summary.free}`}</span>
            </div>
          </div>
        </div>
      )}

      <div className="role-grid">
        <Link to="/apply" className="role-card">
          <div className="role-card-icon tone-olive">01</div>
          <h3>Для родителей</h3>
          <p>Заполнить анкету ребёнка и подать заявку на текущий поток.</p>
        </Link>
        <Link to="/status" className="role-card">
          <div className="role-card-icon tone-terracotta">02</div>
          <h3>Проверить статус</h3>
          <p>Узнать, принята заявка или ребёнок в очереди, и какая позиция.</p>
        </Link>
        <Link to="/curator" className="role-card">
          <div className="role-card-icon tone-green">03</div>
          <h3>Для коуча</h3>
          <p>Войти в кабинет, отметить посещаемость и прогресс учеников.</p>
        </Link>
      </div>

      <div className="card" style={{ marginTop: 40 }}>
        <div className="flex-between">
          <div className="stack">
            <strong>Админ-панель центра</strong>
            <span className="muted">Управление потоками, лимитами и всеми заявками</span>
          </div>
          <Link to="/admin" className="btn btn-secondary">Открыть</Link>
        </div>
      </div>
    </main>
  )
}
