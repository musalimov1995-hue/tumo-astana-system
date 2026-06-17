import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useStore,
  getStudentsForCurator,
  getAttendanceForStudent,
  getProgressForStudent,
  markAttendance,
  addProgressNote,
} from '../data/store.js'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function StudentRow({ student }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const attendance = getAttendanceForStudent(student.id)
  const progress = getProgressForStudent(student.id)
  const today = todayISO()
  const todayRecord = attendance.find((a) => a.date === today)

  const presentCount = attendance.filter((a) => a.present).length
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0

  function handleNoteSubmit(e) {
    e.preventDefault()
    if (!note.trim()) return
    addProgressNote(student.id, note.trim())
    setNote('')
  }

  return (
    <div className="card">
      <div className="flex-between" onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }}>
        <div className="stack">
          <strong>{student.name}</strong>
          <span className="muted">Курсы (после ориентации): {student.courses.join(', ')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="muted">Посещаемость: <strong style={{ color: 'var(--text-primary)' }}>{attendanceRate}%</strong></span>
          <button className="btn btn-ghost">{open ? 'Скрыть' : 'Открыть'}</button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div className="section-heading">
            <h3 style={{ fontSize: 15 }}>Посещаемость сегодня ({today})</h3>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <button
              className="btn btn-primary"
              style={{ opacity: todayRecord?.present === true ? 1 : 0.5 }}
              onClick={() => markAttendance(student.id, today, true)}
            >
              Присутствовал
            </button>
            <button
              className="btn btn-danger"
              style={{ opacity: todayRecord?.present === false ? 1 : 0.5 }}
              onClick={() => markAttendance(student.id, today, false)}
            >
              Отсутствовал
            </button>
          </div>

          <h3 style={{ fontSize: 15, marginBottom: 12 }}>История посещаемости</h3>
          <table className="table" style={{ marginBottom: 24 }}>
            <thead>
              <tr><th>Дата</th><th>Статус</th></tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td className="table-numeric">{a.date}</td>
                  <td>
                    <span className={`badge ${a.present ? 'badge-accepted' : 'badge-withdrawn'}`}>
                      {a.present ? 'Был' : 'Не был'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Заметки о прогрессе</h3>
          <form onSubmit={handleNoteSubmit} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Добавить заметку о прогрессе…" />
            <button className="btn btn-secondary" type="submit">Добавить</button>
          </form>
          <div className="stack" style={{ gap: 12 }}>
            {progress.map((p) => (
              <div key={p.id} style={{ fontSize: 14 }}>
                <span className="muted" style={{ fontFamily: 'var(--font-mono)', marginRight: 10 }}>{p.date}</span>
                {p.note}
              </div>
            ))}
            {progress.length === 0 && <span className="muted">Пока нет заметок.</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CuratorDashboard() {
  const { curatorId } = useParams()
  const navigate = useNavigate()
  useStore() // подписка на изменения для перерисовки
  const students = getStudentsForCurator(curatorId)

  return (
    <main className="page page-wide">
      <div className="flex-between" style={{ marginBottom: 8 }}>
        <div className="eyebrow">Кабинет куратора</div>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>Выйти</button>
      </div>
      <h1 className="page-title">Мои ученики</h1>
      <p className="page-subtitle">Отмечайте посещаемость и ведите заметки о прогрессе каждого ученика.</p>

      <div className="stack" style={{ gap: 16 }}>
        {students.map((s) => <StudentRow key={s.id} student={s} />)}
        {students.length === 0 && (
          <div className="empty-state">За вами пока не закреплено учеников.</div>
        )}
      </div>
    </main>
  )
}
