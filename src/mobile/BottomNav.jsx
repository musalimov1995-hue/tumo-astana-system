import React from 'react'

const tabs = [
  { id: 'home',      label: 'Главная',    icon: HomeIcon },
  { id: 'community', label: 'Портфолио',  icon: GridIcon },
  { id: 'challenges',label: 'Челленджи',  icon: TrophyIcon },
  { id: 'chat',      label: 'Поддержка',  icon: ChatIcon },
  { id: 'guide',     label: 'Гид',        icon: MapIcon },
]

export default function BottomNav({ active, onNav }) {
  return (
    <nav className="mob-bottom-nav">
      {tabs.map((t) => {
        const Icon = t.icon
        return (
          <button
            key={t.id}
            className={`mob-tab ${active === t.id ? 'mob-tab-active' : ''}`}
            onClick={() => onNav(t.id)}
          >
            <Icon active={active === t.id} />
            <span>{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      {!active && <path d="M9 21V12h6v9" />}
    </svg>
  )
}

function GridIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill={active ? 'currentColor' : 'none'} />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill={active ? 'currentColor' : 'none'} />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill={active ? 'currentColor' : 'none'} />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill={active ? 'currentColor' : 'none'} />
    </svg>
  )
}

function TrophyIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M8 21h8M12 17v4M5 3H3v5c0 2.21 1.79 4 4 4M19 3h2v5c0 2.21-1.79 4-4 4"/>
      <path d="M7 3h10v7a5 5 0 01-10 0V3z" fill={active ? 'currentColor' : 'none'} />
    </svg>
  )
}

function ChatIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function MapIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 20L3 17V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4" fill={active ? 'currentColor' : 'none'} />
    </svg>
  )
}
