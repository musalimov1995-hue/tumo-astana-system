import React, { useState, useEffect, useRef } from 'react'

const VIDEOS = [
  {
    id: 1,
    title: 'Что такое TUMO?',
    subtitle: 'История, миссия и ценности центра',
    duration: '3:42',
    emoji: '🌍',
    bg: 'linear-gradient(135deg, #B873E0 0%, #6A3D9A 100%)',
    quiz: [
      {
        q: 'В каком году был основан первый TUMO?',
        options: ['2007', '2011', '2015', '2020'],
        correct: 1,
      },
      {
        q: 'Сколько стоит обучение в TUMO?',
        options: ['20 000 тг/мес', '50 000 тг/мес', 'Бесплатно', '10 000 тг/мес'],
        correct: 2,
      },
      {
        q: 'Для какого возраста предназначен TUMO?',
        options: ['6–12 лет', '10–18 лет', '14–22 года', 'Любой'],
        correct: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'Как устроено обучение',
    subtitle: 'Workshops, Self-learning и Coaches',
    duration: '4:15',
    emoji: '🎓',
    bg: 'linear-gradient(135deg, #4facfe 0%, #00b4db 100%)',
    quiz: [
      {
        q: 'Сколько направлений выбирает каждый ученик?',
        options: ['2', '3', '4', '6'],
        correct: 2,
      },
      {
        q: 'Кто такой Workshop Leader?',
        options: [
          'Администратор',
          'Профессионал, ведущий мастер-классы',
          'Родитель-волонтёр',
          'Старший ученик',
        ],
        correct: 1,
      },
      {
        q: 'Когда ученик выбирает свои 4 направления?',
        options: [
          'При регистрации',
          'В первый день',
          'После ориентационного месяца на tumo.world',
          'Администратор назначает сам',
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 3,
    title: 'Платформа tumo.world',
    subtitle: 'Как пользоваться учебной платформой',
    duration: '5:00',
    emoji: '💻',
    bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    quiz: [
      {
        q: 'Для чего нужна платформа tumo.world?',
        options: [
          'Для общения с родителями',
          'Для выбора курсов, просмотра видео и сдачи заданий',
          'Для оплаты обучения',
          'Только для кураторов',
        ],
        correct: 1,
      },
      {
        q: 'Через какой email входишь на tumo.world?',
        options: [
          'Личный Gmail',
          'Выданный T360 email вида имя.фамилия@tumo.world',
          'Через номер телефона',
          'Аккаунт Госуслуг',
        ],
        correct: 1,
      },
      {
        q: 'T360 предназначен для:',
        options: [
          'Учеников и родителей',
          'Только родителей',
          'Coach-ей и Workshop Leader-ов',
          'Всех сразу',
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 4,
    title: 'Первый день в TUMO',
    subtitle: 'Как войти, найти кабинет, что взять с собой',
    duration: '2:30',
    emoji: '🎫',
    bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    quiz: [
      {
        q: 'Как ученик проходит через турникет?',
        options: [
          'Показывает бумажный пропуск',
          'Набирает код на панели',
          'Смотрит в камеру — распознавание лица',
          'Называет имя охраннику',
        ],
        correct: 2,
      },
      {
        q: 'На каком этаже находится TUMO Astana?',
        options: ['1-й', '2-й', '3-й', '4-й'],
        correct: 2,
      },
      {
        q: 'Что нужно обязательно взять с собой в первый день?',
        options: [
          'Форму и сменную обувь',
          'Ноутбук и зарядку',
          'Паспорт и деньги',
          'Ничего особенного — всё есть в центре',
        ],
        correct: 3,
      },
    ],
  },
]

// ── Video player simulation ──────────────────────────────────
function VideoPlayer({ video, onFinished }) {
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef(null)

  function togglePlay() {
    if (progress >= 100) return
    if (playing) {
      clearInterval(intervalRef.current)
      setPlaying(false)
    } else {
      setPlaying(true)
    }
  }

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(intervalRef.current)
            setPlaying(false)
            return 100
          }
          return p + 1
        })
      }, 80) // ~8 seconds to "watch" the whole video
    }
    return () => clearInterval(intervalRef.current)
  }, [playing])

  const done = progress >= 100

  return (
    <div className="mob-video-player">
      <div className="mob-vp-screen" style={{ background: video.bg }}>
        <span className="mob-vp-emoji">{video.emoji}</span>
        {!done && (
          <button className="mob-vp-play-btn" onClick={togglePlay}>
            {playing
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
            }
          </button>
        )}
        {done && (
          <div className="mob-vp-done-badge">✓ Просмотрено</div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mob-vp-bar-wrap">
        <div className="mob-vp-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9C97A3', marginBottom: 16 }}>
        <span>{playing ? 'Идёт просмотр…' : done ? 'Просмотр завершён' : 'Нажмите ▶ чтобы начать'}</span>
        <span>{video.duration}</span>
      </div>

      <button className="mob-btn-primary" style={{ width: '100%' }} disabled={!done} onClick={onFinished}>
        {done ? 'Пройти тест →' : 'Досмотрите видео до конца'}
      </button>
    </div>
  )
}

// ── Quiz ────────────────────────────────────────────────────
function Quiz({ questions, onPass, onFail }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function select(qi, oi) {
    if (submitted) return
    setAnswers((a) => ({ ...a, [qi]: oi }))
  }

  function submit() {
    if (Object.keys(answers).length < questions.length) return
    setSubmitted(true)
    const correct = questions.filter((q, i) => answers[i] === q.correct).length
    setTimeout(() => {
      if (correct >= Math.ceil(questions.length * 0.67)) onPass(correct, questions.length)
      else onFail(correct, questions.length)
    }, 600)
  }

  return (
    <div className="mob-quiz">
      <p className="mob-section-label" style={{ marginBottom: 16 }}>Тест на понимание</p>
      {questions.map((q, qi) => (
        <div key={qi} className="mob-quiz-q">
          <p className="mob-quiz-q-text">{qi + 1}. {q.q}</p>
          <div className="mob-quiz-options">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi
              const isCorrect = q.correct === oi
              let cls = 'mob-quiz-option'
              if (selected) cls += ' mob-quiz-option-selected'
              if (submitted && isCorrect) cls += ' mob-quiz-option-correct'
              if (submitted && selected && !isCorrect) cls += ' mob-quiz-option-wrong'
              return (
                <button key={oi} className={cls} onClick={() => select(qi, oi)}>
                  <span className="mob-quiz-letter">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button
          className="mob-btn-primary"
          style={{ width: '100%', marginTop: 8 }}
          disabled={Object.keys(answers).length < questions.length}
          onClick={submit}
        >
          Проверить ответы
        </button>
      )}
    </div>
  )
}

// ── Result overlay ───────────────────────────────────────────
function QuizResult({ passed, correct, total, onNext, onRetry }) {
  return (
    <div className="mob-quiz-result">
      <div className={`mob-quiz-result-icon ${passed ? 'mob-qr-pass' : 'mob-qr-fail'}`}>
        {passed ? '🎉' : '😅'}
      </div>
      <h3 className="mob-quiz-result-title">{passed ? 'Отлично!' : 'Попробуй ещё раз'}</h3>
      <p className="mob-muted" style={{ textAlign: 'center', marginBottom: 20 }}>
        Правильных ответов: <strong>{correct}</strong> из <strong>{total}</strong>
        {!passed && ' — нужно минимум 2 из 3.'}
      </p>
      {passed
        ? <button className="mob-btn-primary" style={{ width: '100%' }} onClick={onNext}>Следующее видео →</button>
        : <button className="mob-btn-primary" style={{ width: '100%' }} onClick={onRetry}>Пересдать тест</button>
      }
    </div>
  )
}

// ── Main component ───────────────────────────────────────────
export default function OnboardingScreen({ onFinish }) {
  const [progress, setProgress] = useState(() =>
    VIDEOS.reduce((acc, v) => ({ ...acc, [v.id]: 'pending' }), {})
  ) // pending | watching | quiz | passed
  const [active, setActive] = useState(null) // id of video being viewed
  const [quizState, setQuizState] = useState(null) // null | { result, correct, total }

  const allDone = VIDEOS.every((v) => progress[v.id] === 'passed')

  function openVideo(id) {
    setActive(id)
    setQuizState(null)
    setProgress((p) => p[id] === 'pending' ? { ...p, [id]: 'watching' } : p)
  }

  function videoFinished() {
    setProgress((p) => ({ ...p, [active]: 'quiz' }))
  }

  function handlePass(correct, total) {
    setProgress((p) => ({ ...p, [active]: 'passed' }))
    setQuizState({ result: 'pass', correct, total })
  }

  function handleFail(correct, total) {
    setQuizState({ result: 'fail', correct, total })
  }

  function nextVideo() {
    const ids = VIDEOS.map((v) => v.id)
    const idx = ids.indexOf(active)
    const nextId = ids[idx + 1]
    if (nextId) { openVideo(nextId) }
    else { setActive(null) }
    setQuizState(null)
  }

  function retryQuiz() {
    setProgress((p) => ({ ...p, [active]: 'watching' }))
    setQuizState(null)
  }

  const video = VIDEOS.find((v) => v.id === active)
  const completedCount = VIDEOS.filter((v) => progress[v.id] === 'passed').length

  // ─── Detail view (video + quiz) ──
  if (active && video) {
    const phase = progress[active]
    return (
      <div className="mob-screen">
        <div className="mob-inner-header">
          <button className="mob-back-btn" onClick={() => { setActive(null); setQuizState(null) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <span className="mob-inner-title" style={{ fontSize: 13 }}>{video.title}</span>
          <span className="mob-step-chip">{video.duration}</span>
        </div>

        <div className="mob-scroll mob-scroll-inner">
          {(phase === 'watching' || phase === 'pending') && !quizState && (
            <VideoPlayer video={video} onFinished={videoFinished} />
          )}
          {phase === 'quiz' && !quizState && (
            <Quiz questions={video.quiz} onPass={handlePass} onFail={handleFail} />
          )}
          {phase === 'passed' && !quizState && (
            <div style={{ textAlign: 'center', paddingTop: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>Видео пройдено!</p>
              <p className="mob-muted" style={{ marginBottom: 24 }}>Вы уже ответили на тест правильно.</p>
              <button className="mob-btn-secondary" style={{ width: '100%' }} onClick={() => setActive(null)}>
                ← Назад к списку
              </button>
            </div>
          )}
          {quizState && (
            <QuizResult
              passed={quizState.result === 'pass'}
              correct={quizState.correct}
              total={quizState.total}
              onNext={nextVideo}
              onRetry={retryQuiz}
            />
          )}
        </div>
      </div>
    )
  }

  // ─── Video list view ──
  return (
    <div className="mob-screen">
      <div className="mob-comm-header">
        <div>
          <p className="mob-screen-eyebrow">Вводный курс</p>
          <h2 className="mob-screen-h2" style={{ fontSize: 20 }}>О TUMO</h2>
        </div>
        <span className="mob-badge mob-badge-ok">{completedCount}/{VIDEOS.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '10px 18px', background: '#fff', borderBottom: '1px solid #E6E3E8' }}>
        <div className="mob-gauge-track">
          <div className="mob-gauge-fill" style={{ width: `${(completedCount / VIDEOS.length) * 100}%`, background: '#B873E0' }} />
        </div>
        <p className="mob-muted" style={{ marginTop: 6, fontSize: 12 }}>
          {allDone ? 'Все видео просмотрены! 🎉' : `Осталось ${VIDEOS.length - completedCount} видео`}
        </p>
      </div>

      <div className="mob-scroll" style={{ paddingTop: 14 }}>
        {VIDEOS.map((v, i) => {
          const state = progress[v.id]
          const isPassed = state === 'passed'
          const isLocked = i > 0 && progress[VIDEOS[i - 1].id] !== 'passed'
          return (
            <button
              key={v.id}
              className={`mob-video-card ${isLocked ? 'mob-video-card-locked' : ''}`}
              onClick={() => !isLocked && openVideo(v.id)}
              disabled={isLocked}
            >
              <div className="mob-video-thumb" style={{ background: v.bg }}>
                <span style={{ fontSize: 28 }}>{v.emoji}</span>
                {isPassed && <div className="mob-video-thumb-done">✓</div>}
                {isLocked && <div className="mob-video-thumb-lock">🔒</div>}
              </div>
              <div className="mob-video-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <strong style={{ fontSize: 14, lineHeight: 1.3 }}>{v.title}</strong>
                  <span className="mob-muted" style={{ fontSize: 11, flexShrink: 0 }}>{v.duration}</span>
                </div>
                <p className="mob-muted" style={{ marginTop: 3, fontSize: 12 }}>{v.subtitle}</p>
                <div style={{ marginTop: 8 }}>
                  {isPassed
                    ? <span className="mob-badge mob-badge-ok" style={{ fontSize: 11 }}>✓ Пройдено</span>
                    : isLocked
                    ? <span className="mob-badge mob-badge-neutral" style={{ fontSize: 11 }}>🔒 Сначала предыдущее</span>
                    : state === 'quiz'
                    ? <span className="mob-badge mob-badge-warn" style={{ fontSize: 11 }}>📝 Пройди тест</span>
                    : <span className="mob-badge mob-badge-neutral" style={{ fontSize: 11 }}>▶ Смотреть</span>
                  }
                </div>
              </div>
            </button>
          )
        })}

        {allDone && (
          <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 8 }}>
            <button className="mob-btn-primary" style={{ width: '100%' }} onClick={onFinish}>
              Готово — перейти в приложение 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
