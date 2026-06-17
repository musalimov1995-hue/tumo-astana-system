import React, { useEffect, Component } from 'react'
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import Home from './pages/Home.jsx'
import ApplyForm from './pages/ApplyForm.jsx'
import CheckStatus from './pages/CheckStatus.jsx'
import CuratorLogin from './pages/CuratorLogin.jsx'
import CuratorDashboard from './pages/CuratorDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import FaceConcept from './pages/FaceConcept.jsx'
import MobileApp from './pages/MobileApp.jsx'
import { initStore, useStore } from './data/store.js'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 32, fontFamily: 'monospace', color: '#c00' }}>
        <h2>Ошибка рендера:</h2>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{this.state.error.message}</pre>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#888' }}>{this.state.error.stack}</pre>
      </div>
    )
    return this.props.children
  }
}

function TopBar() {
  const location = useLocation()
  return (
    <header className="topbar">
      <Link to="/" className="topbar-brand">
        <span className="topbar-mark" />
        TUMO Astana
      </Link>
      <nav className="topbar-nav">
        <Link to="/apply">Подать заявку</Link>
        <Link to="/status">Статус заявки</Link>
        <Link to="/curator">Кураторам</Link>
        <Link to="/admin">Админ-панель</Link>
        <Link to="/face-concept">Концепт турникета</Link>
        <Link to="/app" style={{ color: '#B873E0', fontWeight: 700 }}>📱 Приложение</Link>
      </nav>
    </header>
  )
}

function AppLoader({ children }) {
  const { loaded } = useStore()
  useEffect(() => { initStore().catch((e) => console.error('initStore failed:', e)) }, [])
  if (!loaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 36, height: 36, border: '3px solid #E6E3E8', borderTopColor: '#B873E0', borderRadius: '50%', animation: 'mob-spin 0.8s linear infinite' }} />
        <span style={{ color: '#6B6670', fontSize: 14 }}>Подключение к базе данных…</span>
      </div>
    )
  }
  return children
}

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <TopBar />
        <ErrorBoundary>
        <AppLoader>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<ApplyForm />} />
          <Route path="/status" element={<CheckStatus />} />
          <Route path="/curator" element={<CuratorLogin />} />
          <Route path="/curator/:curatorId" element={<CuratorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/face-concept" element={<FaceConcept />} />
          <Route path="/app" element={<MobileApp />} />
        </Routes>
        </AppLoader>
        </ErrorBoundary>
      </div>
    </HashRouter>
  )
}
