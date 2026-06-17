import React, { useState } from 'react'

const COURSES = ['Все', 'Анимация', 'Программирование', 'Дизайн', 'Робототехника', '3D', 'Видео', 'Музыка']

const POSTS = [
  {
    id: 1,
    author: 'Алина С.',
    avatar: '🎨',
    avatarBg: '#E8D5F5',
    course: 'Анимация',
    title: 'Мой первый 2D-персонаж',
    desc: 'Нарисовала персонажа за 3 занятия в Adobe Animate. Вдохновлялась студией Ghibli.',
    imageBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    imageEmoji: '✨',
    likes: 34,
    comments: 8,
    liked: false,
  },
  {
    id: 2,
    author: 'Ерлан Ж.',
    avatar: '🤖',
    avatarBg: '#D5EAF5',
    course: 'Робототехника',
    title: 'Робот-сортировщик',
    desc: 'Собрал автономного робота на Arduino, который сортирует предметы по цвету с помощью датчика.',
    imageBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    imageEmoji: '🦾',
    likes: 51,
    comments: 12,
    liked: false,
  },
  {
    id: 3,
    author: 'Диана К.',
    avatar: '💻',
    avatarBg: '#D5F5E3',
    course: 'Программирование',
    title: 'Игра «Змейка» на Python',
    desc: 'Написала классическую змейку с рекордами и сохранением в файл. 200 строк кода!',
    imageBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    imageEmoji: '🐍',
    likes: 29,
    comments: 5,
    liked: false,
  },
  {
    id: 4,
    author: 'Арман Б.',
    avatar: '🎵',
    avatarBg: '#FFF3D5',
    course: 'Музыка',
    title: 'Трек в Ableton',
    desc: 'Мой первый electronic-трек за 2 месяца. Lo-fi chill vibes, сделан полностью в Ableton Live.',
    imageBg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    imageEmoji: '🎧',
    likes: 67,
    comments: 21,
    liked: false,
  },
  {
    id: 5,
    author: 'Зарина М.',
    avatar: '🎬',
    avatarBg: '#F5D5D5',
    course: 'Видео',
    title: 'Короткий фильм «Рассвет»',
    desc: 'Сняла 3-минутный фильм об одном утре в Астане. Монтаж в Premiere Pro.',
    imageBg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    imageEmoji: '🎥',
    likes: 88,
    comments: 17,
    liked: false,
  },
  {
    id: 6,
    author: 'Нурсултан А.',
    avatar: '🧊',
    avatarBg: '#D5F0F5',
    course: '3D',
    title: 'Архитектурная визуализация',
    desc: 'Смоделировал концепт будущего TUMO центра в Blender. Рендер занял 4 часа.',
    imageBg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    imageEmoji: '🏛️',
    likes: 43,
    comments: 9,
    liked: false,
  },
]

export default function CommunityScreen() {
  const [filter, setFilter] = useState('Все')
  const [posts, setPosts] = useState(POSTS)

  function toggleLike(id) {
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    )
  }

  const visible = filter === 'Все' ? posts : posts.filter((p) => p.course === filter)

  return (
    <div className="mob-screen">
      <div className="mob-comm-header">
        <div>
          <p className="mob-screen-eyebrow">TUMO Community</p>
          <h2 className="mob-screen-h2" style={{ fontSize: 20 }}>Работы учеников</h2>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mob-filter-scroll">
        {COURSES.map((c) => (
          <button
            key={c}
            className={`mob-filter-chip ${filter === c ? 'mob-filter-chip-active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mob-scroll" style={{ paddingTop: 12 }}>
        {visible.map((post) => (
          <div key={post.id} className="mob-post-card">
            {/* Author row */}
            <div className="mob-post-author">
              <div className="mob-avatar" style={{ background: post.avatarBg }}>{post.avatar}</div>
              <div className="mob-post-author-info">
                <strong>{post.author}</strong>
                <span className="mob-badge mob-badge-neutral" style={{ fontSize: 10 }}>{post.course}</span>
              </div>
            </div>

            {/* Image area */}
            <div className="mob-post-image" style={{ background: post.imageBg }}>
              <span className="mob-post-image-emoji">{post.imageEmoji}</span>
            </div>

            {/* Content */}
            <div className="mob-post-body">
              <strong style={{ fontSize: 14 }}>{post.title}</strong>
              <p className="mob-muted" style={{ marginTop: 4, lineHeight: 1.5 }}>{post.desc}</p>
            </div>

            {/* Actions */}
            <div className="mob-post-actions">
              <button
                className={`mob-post-action-btn ${post.liked ? 'mob-post-liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                {post.liked ? '❤️' : '🤍'} {post.likes}
              </button>
              <button className="mob-post-action-btn">
                💬 {post.comments}
              </button>
              <button className="mob-post-action-btn">
                ↗️ Поделиться
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
