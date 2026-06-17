import React, { useState } from 'react'
import { findApplicationById } from '../data/store.js'

const statusLabels = {
  accepted: 'Принят в поток',
  waitlisted: 'В очереди',
  withdrawn: 'Отозвана',
}

export default function CheckStatus() {
  const [id, setId] = useState('')
  const [searched, setSearched] = useState(false)
  const [app, setApp] = useState(null)

  function handleSearch(e) {
    e.preventDefault()
    setApp(findApplicationById(id.trim()))
    setSearched(true)
  }

  return (
    <main className="page page-narrow">
      <div className="eyebrow">Для родителей</div>
      <h1 className="page-title">Статус заявки</h1>
      <p className="page-subtitle">Введите номер заявки, который вы получили при подаче анкеты.</p>

      <form className="card" onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <div className="form-field" style={{ flex: 1, marginBottom: 0 }}>
          <label>Номер заявки</label>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="app-1001" />
        </div>
        <button type="submit" className="btn btn-primary">Проверить</button>
      </form>

      {searched && !app && (
        <div className="alert alert-warning" style={{ marginTop: 20 }}>
          Заявка с таким номером не найдена. Проверьте номер и попробуйте снова.
        </div>
      )}

      {app && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3>{app.childName}</h3>
            <span className={`badge badge-${app.status}`}>{statusLabels[app.status]}</span>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span className="muted">Направления: {app.courses.join(', ')}</span>
            <span className="muted">Подана: {new Date(app.submittedAt).toLocaleString('ru-RU')}</span>
            {app.status === 'waitlisted' && (
              <span className="muted">Позиция в очереди: <strong style={{ color: 'var(--warning)' }}>{app.queuePosition}</strong></span>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
