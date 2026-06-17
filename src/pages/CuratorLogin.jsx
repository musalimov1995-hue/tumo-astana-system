import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCurator } from '../data/store.js'

export default function CuratorLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const curator = loginCurator(username, password)
    if (!curator) {
      setError('Неверный логин или пароль.')
      return
    }
    navigate(`/curator/${curator.id}`)
  }

  return (
    <main className="page page-narrow">
      <div className="eyebrow">Кабинет куратора</div>
      <h1 className="page-title">Вход</h1>
      <p className="page-subtitle">Демо-доступ: логин <strong>a.bekova</strong>, пароль <strong>demo123</strong></p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Логин</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="a.bekova" />
        </div>
        <div className="form-field">
          <label>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <div className="alert alert-warning" style={{ marginBottom: 16 }}>{error}</div>}
        <button type="submit" className="btn btn-primary btn-block">Войти</button>
      </form>
    </main>
  )
}
