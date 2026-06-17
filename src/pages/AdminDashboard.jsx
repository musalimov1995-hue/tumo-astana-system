import React, { useState } from 'react'
import {
  useStore,
  getAllStreams,
  getAllApplicationsForStream,
  setStreamCapacity,
  withdrawApplication,
  getStreamSummary,
} from '../data/store.js'

const statusLabels = {
  accepted: 'Принят',
  waitlisted: 'В очереди',
  withdrawn: 'Отозвана',
}

export default function AdminDashboard() {
  useStore()
  const streams = getAllStreams()
  const activeStream = streams.find((s) => s.status === 'open')
  const [capacityInput, setCapacityInput] = useState(activeStream?.capacity ?? 0)
  const summary = getStreamSummary()

  const applications = activeStream ? getAllApplicationsForStream(activeStream.id) : []
  const accepted = applications.filter((a) => a.status === 'accepted')
  const waitlisted = applications.filter((a) => a.status === 'waitlisted').sort((a, b) => a.queuePosition - b.queuePosition)
  const withdrawn = applications.filter((a) => a.status === 'withdrawn')

  async function applyCapacity() {
    if (!activeStream) return
    await setStreamCapacity(activeStream.id, Number(capacityInput))
  }

  return (
    <main className="page page-wide">
      <div className="eyebrow">Для администрации центра</div>
      <h1 className="page-title">Управление потоком</h1>
      <p className="page-subtitle">
        Лимит мест обычно равен числу детей, выпустившихся из предыдущего потока. При увеличении лимита
        система автоматически переводит из очереди тех, кто следующий.
      </p>

      {activeStream && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-heading">
            <h2>{activeStream.title}</h2>
          </div>

          <div className="gauge" style={{ marginBottom: 24 }}>
            <div className="gauge-track">
              <div
                className={`gauge-fill ${summary.occupied >= summary.capacity ? 'is-full' : ''}`}
                style={{ '--fill': `${Math.min(Math.round((summary.occupied / summary.capacity) * 100), 100)}%` }}
              />
            </div>
            <div className="gauge-labels">
              <span>Занято: <strong>{summary.occupied}</strong> / <strong>{summary.capacity}</strong></span>
              <span>В очереди: <strong style={{ color: 'var(--warning)' }}>{waitlisted.length}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div className="form-field" style={{ marginBottom: 0, maxWidth: 220 }}>
              <label>Лимит мест в потоке</label>
              <input
                type="number"
                value={capacityInput}
                onChange={(e) => setCapacityInput(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={applyCapacity}>Применить лимит</button>
          </div>
          <p className="field-hint">
            Подсказка: в предыдущем потоке выпустилось {streams.find((s) => s.status === 'closed')?.graduatedCount ?? '—'} детей —
            это естественная база для лимита нового потока.
          </p>
        </div>
      )}

      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        Направления не выбираются при регистрации — каждый ученик выбирает их самостоятельно на платформе tumo.world после ориентационного месяца. T360 — система для Coach-ей и Workshop Leader-ов.
      </div>

      <div className="section-heading">
        <h2>Принятые ({accepted.length})</h2>
      </div>
      <div className="card" style={{ marginBottom: 28, padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Ребёнок</th><th>Возраст</th><th>Родитель</th><th>Телефон</th><th>Подана</th><th></th>
            </tr>
          </thead>
          <tbody>
            {accepted.map((a) => (
              <tr key={a.id}>
                <td>{a.childName}</td>
                <td className="table-numeric">{a.childAge}</td>
                <td>{a.parentName}</td>
                <td className="table-numeric">{a.parentPhone}</td>
                <td className="table-numeric">{new Date(a.submittedAt).toLocaleDateString('ru-KZ')}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => withdrawApplication(a.id).catch(console.error)}>
                    Отчислить
                  </button>
                </td>
              </tr>
            ))}
            {accepted.length === 0 && (
              <tr><td colSpan={6} className="empty-state">Пока никого не принято.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="section-heading">
        <h2>Очередь ({waitlisted.length})</h2>
      </div>
      <div className="card" style={{ marginBottom: 28, padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>#</th><th>Ребёнок</th><th>Возраст</th><th>Родитель</th><th>Телефон</th><th>Подана</th>
            </tr>
          </thead>
          <tbody>
            {waitlisted.map((a) => (
              <tr key={a.id}>
                <td className="table-numeric">{a.queuePosition}</td>
                <td>{a.childName}</td>
                <td className="table-numeric">{a.childAge}</td>
                <td>{a.parentName}</td>
                <td className="table-numeric">{a.parentPhone}</td>
                <td className="table-numeric">{new Date(a.submittedAt).toLocaleDateString('ru-KZ')}</td>
              </tr>
            ))}
            {waitlisted.length === 0 && (
              <tr><td colSpan={6} className="empty-state">Очередь пуста.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {withdrawn.length > 0 && (
        <>
          <div className="section-heading">
            <h2>Отчисленные ({withdrawn.length})</h2>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <table className="table">
              <thead><tr><th>Ребёнок</th><th>Возраст</th><th>Статус</th></tr></thead>
              <tbody>
                {withdrawn.map((a) => (
                  <tr key={a.id}>
                    <td>{a.childName}</td>
                    <td className="table-numeric">{a.childAge}</td>
                    <td><span className="badge badge-withdrawn">{statusLabels[a.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  )
}
