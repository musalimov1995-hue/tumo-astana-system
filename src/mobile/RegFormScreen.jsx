import React, { useState } from 'react'
import { DAY_PAIRS, TIME_SLOTS } from '../data/store.js'

export default function RegFormScreen({ onBack, onSubmit }) {
  const [step, setStep] = useState(1) // 1 child | 2 parent | 3 schedule
  const [form, setForm] = useState({
    childName: '', childAge: '',
    parentName: '', parentPhone: '', parentEmail: '',
    days: '', time: '',
  })
  const [error, setError] = useState('')

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }))
    setError('')
  }

  function next() {
    if (step === 1) {
      if (!form.childName.trim() || !form.childAge) { setError('Заполните имя и возраст ребёнка'); return }
      const age = Number(form.childAge)
      if (age < 11 || age > 19) { setError('Возраст должен быть от 12 до 18 лет'); return }
    }
    if (step === 2) {
      if (!form.parentName.trim() || !form.parentPhone.trim()) { setError('Заполните имя и телефон родителя'); return }
    }
    if (step === 3) {
      if (!form.days) { setError('Выберите дни посещения'); return }
      if (!form.time) { setError('Выберите время потока'); return }
      onSubmit({ ...form, schedule: { days: form.days, time: form.time } })
      return
    }
    setError('')
    setStep((s) => s + 1)
  }

  const dayPair = DAY_PAIRS.find((d) => d.id === form.days)
  const timeSlot = TIME_SLOTS.find((t) => t.id === form.time)

  return (
    <div className="mob-screen">
      <div className="mob-inner-header">
        <button className="mob-back-btn" onClick={step === 1 ? onBack : () => { setStep((s) => s - 1); setError('') }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="mob-inner-title">Регистрация</span>
        <span className="mob-step-chip">{step} / 3</span>
      </div>

      <div className="mob-step-track">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`mob-step-dot ${s <= step ? 'mob-step-dot-active' : ''}`} />
        ))}
      </div>

      <div className="mob-scroll mob-scroll-inner">

        {/* ── Шаг 1: Данные ребёнка ── */}
        {step === 1 && (
          <div className="mob-form-section">
            <p className="mob-section-label">Данные ребёнка</p>
            <div className="mob-field">
              <label>Имя и фамилия *</label>
              <input className="mob-input" placeholder="Алина Сатпаева"
                value={form.childName} onChange={(e) => set('childName', e.target.value)} />
            </div>
            <div className="mob-field">
              <label>Возраст *</label>
              <input className="mob-input" type="number" placeholder="13" min="10" max="18"
                value={form.childAge} onChange={(e) => set('childAge', e.target.value)} />
            </div>
            <div className="mob-info-banner" style={{ marginTop: 4 }}>
              Направления не выбираются при регистрации — ребёнок выберет 4 курса после ориентационного месяца на tumo.world.
            </div>
          </div>
        )}

        {/* ── Шаг 2: Данные родителя ── */}
        {step === 2 && (
          <div className="mob-form-section">
            <p className="mob-section-label">Данные родителя / опекуна</p>
            <div className="mob-field">
              <label>Имя и фамилия *</label>
              <input className="mob-input" placeholder="Гульнара Сатпаева"
                value={form.parentName} onChange={(e) => set('parentName', e.target.value)} />
            </div>
            <div className="mob-field">
              <label>Телефон *</label>
              <input className="mob-input" type="tel" placeholder="+7 701 000 00 00"
                value={form.parentPhone} onChange={(e) => set('parentPhone', e.target.value)} />
            </div>
            <div className="mob-field">
              <label>Email</label>
              <input className="mob-input" type="email" placeholder="email@mail.com"
                value={form.parentEmail} onChange={(e) => set('parentEmail', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── Шаг 3: Расписание ── */}
        {step === 3 && (
          <div className="mob-form-section">
            <p className="mob-section-label">Расписание посещений</p>

            <div className="mob-info-banner" style={{ marginBottom: 18 }}>
              TUMO работает <strong>Пн, Вт, Чт, Пт</strong> с 10:30 до 18:30.
              Каждый ученик приходит <strong>2 раза в неделю</strong>.
            </div>

            {/* Day pair */}
            <p className="mob-sched-label">Выберите дни посещения</p>
            <div className="mob-sched-grid">
              {DAY_PAIRS.map((d) => (
                <button
                  key={d.id}
                  className={`mob-sched-card ${form.days === d.id ? 'mob-sched-card-on' : ''}`}
                  onClick={() => set('days', d.id)}
                >
                  <span className="mob-sched-card-icon">📅</span>
                  <strong>{d.short}</strong>
                  <span className="mob-muted" style={{ fontSize: 11 }}>{d.label}</span>
                </button>
              ))}
            </div>

            {/* Time slot */}
            <p className="mob-sched-label" style={{ marginTop: 18 }}>Выберите поток (время)</p>
            <div className="mob-sched-slots">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t.id}
                  className={`mob-slot-row ${form.time === t.id ? 'mob-slot-row-on' : ''}`}
                  onClick={() => set('time', t.id)}
                >
                  <span className="mob-slot-icon">{t.icon}</span>
                  <span className="mob-slot-time">{t.label}</span>
                  {form.time === t.id && <span className="mob-slot-check">✓</span>}
                </button>
              ))}
            </div>

            {/* Summary */}
            {form.days && form.time && (
              <div className="mob-sched-summary">
                <span>📌</span>
                <span>
                  <strong>{dayPair?.short}</strong> · <strong>{timeSlot?.label}</strong>
                  <br />
                  <span className="mob-muted">2 раза в неделю, {timeSlot?.label.split('–')[0].trim()} — {timeSlot?.label.split('–')[1].trim()}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {error && <div className="mob-error" style={{ marginTop: 8 }}>{error}</div>}
      </div>

      <div className="mob-footer">
        <button className="mob-btn-primary" onClick={next}>
          {step === 3 ? 'Далее → Согласие' : 'Продолжить'}
        </button>
      </div>
    </div>
  )
}
