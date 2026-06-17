import React, { useState } from 'react'
import { findApplicationById } from '../data/store.js'

export default function StatusScreen() {
  const [id, setId] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  function search() {
    const app = findApplicationById(id.trim())
    setResult(app)
    setSearched(true)
  }

  const statusLabel = {
    accepted: 'Принят',
    waitlisted: 'В очереди',
    withdrawn: 'Отозвана',
  }
  const statusClass = {
    accepted: 'mob-badge-ok',
    waitlisted: 'mob-badge-warn',
    withdrawn: 'mob-badge-neutral',
  }

  return (
    <div className="mob-screen mob-scroll">
      <div className="mob-screen-title-block">
        <p className="mob-screen-eyebrow">Проверить</p>
        <h2 className="mob-screen-h2">Статус заявки</h2>
      </div>

      <div className="mob-card">
        <div className="mob-field">
          <label>Номер заявки</label>
          <input
            className="mob-input"
            placeholder="app-1001"
            value={id}
            onChange={(e) => { setId(e.target.value); setSearched(false) }}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
        </div>
        <button className="mob-btn-primary" style={{ width: '100%' }} onClick={search} disabled={!id.trim()}>
          Найти
        </button>
      </div>

      {searched && !result && (
        <div className="mob-error" style={{ marginTop: 16 }}>
          Заявка не найдена. Проверьте номер.
        </div>
      )}

      {result && (
        <div className="mob-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <strong style={{ fontSize: 16 }}>{result.childName}</strong>
            <span className={`mob-badge ${statusClass[result.status] || 'mob-badge-neutral'}`}>
              {statusLabel[result.status] || result.status}
            </span>
          </div>

          <div className="mob-summary-row" style={{ marginBottom: 8 }}>
            <span className="mob-muted">Родитель</span>
            <span>{result.parentName}</span>
          </div>
          <div className="mob-summary-row" style={{ marginBottom: 8 }}>
            <span className="mob-muted">Подана</span>
            <span>{new Date(result.submittedAt).toLocaleDateString('ru-KZ')}</span>
          </div>

          {result.status === 'waitlisted' && (
            <div className="mob-info-banner" style={{ marginTop: 12 }}>
              Позиция в очереди: <strong>№{result.queuePosition}</strong>. Уведомим при освобождении места.
            </div>
          )}

          {result.status === 'accepted' && (
            <div className="mob-ecp-success" style={{ marginTop: 12 }}>
              <div className="mob-ecp-check">✓</div>
              <div>
                <div style={{ fontWeight: 600 }}>Место закреплено</div>
                <div className="mob-muted">Направления: {result.courses.join(', ')}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mob-info-banner" style={{ marginTop: 20 }}>
        <strong>Тестовые номера:</strong> app-1001 (принят), app-1002 (принят), app-1003 (очередь)
      </div>
    </div>
  )
}
