import React, { useState } from 'react'
import { getSupabase } from '../lib/supabase.js'

export default function AuthScreen({ onAuth }) {
  const [tab, setTab]         = useState('login') // 'login' | 'register'
  const [form, setForm]       = useState({ fullName: '', phone: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }))
    setError('')
  }

  function normalizePhone(p) {
    return p.replace(/\D/g, '').replace(/^8/, '7')
  }

  async function handleRegister() {
    if (!form.fullName.trim())          { setError('Введите имя и фамилию'); return }
    if (form.phone.replace(/\D/g,'').length < 10) { setError('Введите корректный номер телефона'); return }
    if (form.password.length < 6)       { setError('Пароль — минимум 6 символов'); return }
    if (form.password !== form.confirm) { setError('Пароли не совпадают'); return }

    setLoading(true)
    const phone = normalizePhone(form.phone)
    const sb = getSupabase()

    // Check if already exists
    const { data: existing } = await sb.from('app_users').select('id').eq('phone', phone).maybeSingle()
    if (existing) { setError('Этот номер уже зарегистрирован. Войдите.'); setLoading(false); return }

    const { data, error } = await sb.from('app_users')
      .insert({ full_name: form.fullName.trim(), phone, password: form.password })
      .select()
      .single()

    setLoading(false)
    if (error) { setError('Ошибка регистрации: ' + error.message); return }
    onAuth(data)
  }

  async function handleLogin() {
    if (!form.phone)    { setError('Введите номер телефона'); return }
    if (!form.password) { setError('Введите пароль'); return }

    setLoading(true)
    const phone = normalizePhone(form.phone)
    const { data, error } = await getSupabase()
      .from('app_users')
      .select('*')
      .eq('phone', phone)
      .eq('password', form.password)
      .maybeSingle()

    setLoading(false)
    if (error || !data) { setError('Неверный номер или пароль'); return }
    onAuth(data)
  }

  return (
    <div className="mob-screen mob-scroll" style={{ justifyContent: 'center', paddingTop: 32 }}>
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <div className="mob-logo-mark" style={{ width: 52, height: 52, marginBottom: 12 }} />
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, margin: 0 }}>TUMO Astana</h1>
        <p className="mob-muted" style={{ fontSize: 13, marginTop: 4 }}>Войдите или зарегистрируйтесь</p>
      </div>

      {/* Tabs */}
      <div className="mob-auth-tabs">
        <button className={`mob-auth-tab ${tab === 'login' ? 'mob-auth-tab-active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
          Войти
        </button>
        <button className={`mob-auth-tab ${tab === 'register' ? 'mob-auth-tab-active' : ''}`} onClick={() => { setTab('register'); setError('') }}>
          Регистрация
        </button>
      </div>

      <div className="mob-card" style={{ marginTop: 16 }}>
        {tab === 'register' && (
          <div className="mob-field" style={{ marginBottom: 14 }}>
            <label>Имя и фамилия *</label>
            <input className="mob-input" placeholder="Алмас Мусалимов"
              value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
          </div>
        )}

        <div className="mob-field" style={{ marginBottom: 14 }}>
          <label>Номер телефона *</label>
          <input className="mob-input" type="tel" placeholder="+7 701 000 00 00"
            value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>

        <div className="mob-field" style={{ marginBottom: tab === 'register' ? 14 : 20 }}>
          <label>Пароль *</label>
          <input className="mob-input" type="password" placeholder="••••••"
            value={form.password} onChange={(e) => set('password', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && tab === 'login' && handleLogin()} />
        </div>

        {tab === 'register' && (
          <div className="mob-field" style={{ marginBottom: 20 }}>
            <label>Повторите пароль *</label>
            <input className="mob-input" type="password" placeholder="••••••"
              value={form.confirm} onChange={(e) => set('confirm', e.target.value)} />
          </div>
        )}

        {error && <div className="mob-error" style={{ marginBottom: 14 }}>{error}</div>}

        <button
          className="mob-btn-primary"
          style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          onClick={tab === 'login' ? handleLogin : handleRegister}
          disabled={loading}
        >
          {loading
            ? 'Загрузка…'
            : tab === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </div>

      <p className="mob-muted" style={{ textAlign: 'center', fontSize: 12, marginTop: 16, padding: '0 20px' }}>
        Этот аккаунт даёт доступ к приложению TUMO Astana.
        Это не то же самое, что аккаунт tumo.world.
      </p>
    </div>
  )
}
