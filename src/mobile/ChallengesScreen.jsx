import React, { useState } from 'react'

const CHALLENGES = [
  {
    id: 1,
    emoji: '🎨',
    color: '#B873E0',
    bg: 'rgba(184,115,224,0.1)',
    title: 'Анимация за 24 часа',
    course: 'Анимация',
    desc: 'Создай короткую анимацию (мин. 5 сек) на любую тему за 24 часа. Можно использовать любой инструмент.',
    deadline: '20 июня',
    daysLeft: 3,
    participants: 18,
    prize: '🥇 Попасть в галерею TUMO',
    difficulty: 'Средний',
    joined: false,
  },
  {
    id: 2,
    emoji: '🕹️',
    color: '#4facfe',
    bg: 'rgba(79,172,254,0.1)',
    title: 'Game Jam выходного дня',
    course: 'Программирование',
    desc: 'Разработай мини-игру за выходные. Тема объявляется в пятницу вечером. Solo или команда до 2 человек.',
    deadline: '22 июня',
    daysLeft: 5,
    participants: 31,
    prize: '🎮 Кастомный контроллер',
    difficulty: 'Сложный',
    joined: false,
  },
  {
    id: 3,
    emoji: '📸',
    color: '#fa709a',
    bg: 'rgba(250,112,154,0.1)',
    title: 'Фото Астаны: твой взгляд',
    course: 'Дизайн',
    desc: 'Сними 5 фотографий Астаны, которые показывают её с неожиданной стороны. Обработка разрешена.',
    deadline: '25 июня',
    daysLeft: 8,
    participants: 24,
    prize: '🖼️ Принт в рамке в центре',
    difficulty: 'Лёгкий',
    joined: false,
  },
  {
    id: 4,
    emoji: '🤖',
    color: '#43e97b',
    bg: 'rgba(67,233,123,0.1)',
    title: 'Робот-помощник',
    course: 'Робототехника',
    desc: 'Построй робота, который решает бытовую задачу. Оценивается: оригинальность идеи, реализация, презентация.',
    deadline: '30 июня',
    daysLeft: 13,
    participants: 11,
    prize: '🔧 Набор электронных компонентов',
    difficulty: 'Сложный',
    joined: false,
  },
  {
    id: 5,
    emoji: '🎵',
    color: '#fee140',
    bg: 'rgba(254,225,64,0.1)',
    title: 'Битмейкер недели',
    course: 'Музыка',
    desc: 'Создай трек длиной 2–4 минуты в любом жанре. Голосование в конце недели среди всех учеников TUMO.',
    deadline: '23 июня',
    daysLeft: 6,
    participants: 9,
    prize: '🎤 Час в студии записи TUMO',
    difficulty: 'Средний',
    joined: false,
  },
]

const difficultyColor = {
  'Лёгкий':  { color: '#4D8B31', bg: 'rgba(77,139,49,0.1)' },
  'Средний': { color: '#E8590C', bg: 'rgba(232,89,12,0.1)' },
  'Сложный': { color: '#B873E0', bg: 'rgba(184,115,224,0.1)' },
}

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState(CHALLENGES)
  const [tab, setTab] = useState('active') // active | joined

  function toggleJoin(id) {
    setChallenges((cs) =>
      cs.map((c) =>
        c.id === id
          ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 }
          : c
      )
    )
  }

  const visible = tab === 'joined' ? challenges.filter((c) => c.joined) : challenges

  return (
    <div className="mob-screen">
      <div className="mob-comm-header">
        <div>
          <p className="mob-screen-eyebrow">TUMO Challenges</p>
          <h2 className="mob-screen-h2" style={{ fontSize: 20 }}>Челленджи</h2>
        </div>
        <div className="mob-badge mob-badge-warn" style={{ fontSize: 12 }}>
          {challenges.filter((c) => c.joined).length} активных
        </div>
      </div>

      {/* Tabs */}
      <div className="mob-ch-tabs">
        <button className={`mob-ch-tab ${tab === 'active' ? 'mob-ch-tab-active' : ''}`} onClick={() => setTab('active')}>
          Все челленджи
        </button>
        <button className={`mob-ch-tab ${tab === 'joined' ? 'mob-ch-tab-active' : ''}`} onClick={() => setTab('joined')}>
          Мои ({challenges.filter((c) => c.joined).length})
        </button>
      </div>

      <div className="mob-scroll" style={{ paddingTop: 12 }}>
        {visible.length === 0 && (
          <div className="mob-empty-state">
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
            <p>Присоединись к челленджу!</p>
          </div>
        )}
        {visible.map((ch) => {
          const diff = difficultyColor[ch.difficulty]
          return (
            <div key={ch.id} className="mob-ch-card">
              <div className="mob-ch-top">
                <div className="mob-ch-icon" style={{ background: ch.bg, color: ch.color }}>
                  {ch.emoji}
                </div>
                <div className="mob-ch-meta">
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span className="mob-badge mob-badge-neutral" style={{ fontSize: 10 }}>{ch.course}</span>
                    <span className="mob-badge" style={{ fontSize: 10, background: diff.bg, color: diff.color }}>
                      {ch.difficulty}
                    </span>
                  </div>
                  <strong style={{ fontSize: 15 }}>{ch.title}</strong>
                </div>
              </div>

              <p className="mob-muted" style={{ lineHeight: 1.5, marginBottom: 12 }}>{ch.desc}</p>

              <div className="mob-ch-stats">
                <div className="mob-ch-stat">
                  <span>⏰</span>
                  <span>{ch.daysLeft} дн. осталось</span>
                </div>
                <div className="mob-ch-stat">
                  <span>👥</span>
                  <span>{ch.participants} участников</span>
                </div>
              </div>

              <div className="mob-ch-prize">
                <span>{ch.prize}</span>
              </div>

              <button
                className={ch.joined ? 'mob-btn-secondary' : 'mob-btn-primary'}
                style={{ width: '100%', marginTop: 12, fontSize: 14, padding: '11px 16px' }}
                onClick={() => toggleJoin(ch.id)}
              >
                {ch.joined ? '✓ Участвую — отказаться' : 'Присоединиться'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
