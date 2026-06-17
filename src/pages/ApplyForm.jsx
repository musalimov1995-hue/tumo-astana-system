import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitApplication, getStreamSummary } from '../data/store.js'

const initialForm = {
  childName: '',
  childAge: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  consent: false,
}

export default function ApplyForm() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const summary = getStreamSummary()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.childName || !form.parentName || !form.parentPhone || !form.childAge) {
      setError('Заполните все обязательные поля.')
      return
    }
    const age = Number(form.childAge)
    if (age < 10 || age > 18) {
      setError('Возраст ребёнка должен быть от 10 до 18 лет.')
      return
    }
    if (!form.consent) {
      setError('Нужно согласие на обработку персональных данных ребёнка.')
      return
    }

    try {
      const app = await submitApplication(form)
      setResult(app)
    } catch (err) {
      setError(err.message)
    }
  }

  if (result) {
    const accepted = result.status === 'accepted'
    return (
      <main className="page page-narrow">
        <div className={`alert ${accepted ? 'alert-success' : 'alert-warning'}`} style={{ marginBottom: 24 }}>
          {accepted
            ? 'Заявка принята! Место в потоке закреплено за ребёнком.'
            : `Мест в текущем потоке нет. Заявка в очереди, позиция: ${result.queuePosition}.`}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Номер вашей заявки</h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--primary)', marginBottom: 16 }}>
            {result.id}
          </p>
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            Направления выбираются после ориентационного месяца — прямо на платформе tumo.world.
          </div>
          <p className="muted" style={{ marginBottom: 20 }}>
            Сохраните номер заявки — по нему можно проверить статус в любой момент.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => { setResult(null); setForm(initialForm) }}>
              Подать ещё одну заявку
            </button>
            <Link to="/status" className="btn btn-primary">Проверить статус</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page page-narrow">
      <div className="eyebrow">Анкета ребёнка</div>
      <h1 className="page-title">Подать заявку на поток</h1>
      <p className="page-subtitle">
        {summary
          ? `Сейчас открыт «${summary.title}», свободно ${summary.free} из ${summary.capacity} мест.`
          : 'Сейчас нет открытого потока для приёма.'}
      </p>

      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        Направления не выбираются при регистрации. После зачисления ребёнок проходит ориентационный месяц,
        а затем выбирает курсы самостоятельно на платформе tumo.world.
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Имя и фамилия ребёнка *</label>
            <input value={form.childName} onChange={(e) => update('childName', e.target.value)} placeholder="Например, Алина Сатпаева" />
          </div>
          <div className="form-field">
            <label>Возраст ребёнка *</label>
            <input type="number" min="10" max="18" value={form.childAge} onChange={(e) => update('childAge', e.target.value)} placeholder="13" />
          </div>

          <div className="form-field">
            <label>Имя родителя/опекуна *</label>
            <input value={form.parentName} onChange={(e) => update('parentName', e.target.value)} placeholder="Гульнара Сатпаева" />
          </div>
          <div className="form-field">
            <label>Телефон *</label>
            <input value={form.parentPhone} onChange={(e) => update('parentPhone', e.target.value)} placeholder="+7 701 000 00 00" />
          </div>

          <div className="form-field form-field-full">
            <label>Email</label>
            <input type="email" value={form.parentEmail} onChange={(e) => update('parentEmail', e.target.value)} placeholder="example@mail.com" />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
          <input
            type="checkbox"
            style={{ width: 'auto', marginTop: 2 }}
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
          />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Я согласен(на) на обработку персональных данных ребёнка для целей зачисления и обучения в TUMO Astana.
          </span>
        </label>

        {error && <div className="alert alert-warning" style={{ marginBottom: 16 }}>{error}</div>}

        <button type="submit" className="btn btn-primary btn-block">Отправить заявку</button>
      </form>
    </main>
  )
}
