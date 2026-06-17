import React, { useState } from 'react'

const STEPS = [
  {
    icon: '🚇',
    title: 'LRT / автобус',
    desc: 'Станция "Nazarbayev University" или автобус №32, 45, 118 — остановка "TUMO Center".',
  },
  {
    icon: '🏢',
    title: 'Вход в здание',
    desc: 'Главный вход — стеклянные двери со стороны театра.',
  },
  {
    icon: '🎫',
    title: 'Турникет',
    desc: 'Посмотрите в камеру турникета — система распознает лицо и откроет проход.',
  },
  {
    icon: '🛗',
    title: 'Лифт / лестница',
    desc: 'TUMO находится на 3-м этаже. Лифт — прямо по коридору.',
  },
  {
    icon: '📍',
    title: 'Ресепшн TUMO',
    desc: 'Ресепшн находится на втором этаже.',
  },
]

export default function GuideScreen() {
  const [activeStep, setActiveStep] = useState(null)

  return (
    <div className="mob-screen mob-scroll">
      <div className="mob-screen-title-block">
        <p className="mob-screen-eyebrow">Навигация</p>
        <h2 className="mob-screen-h2">Как пройти в TUMO</h2>
      </div>

      {/* Map placeholder */}
      <div className="mob-map-placeholder">
        <div className="mob-map-inner">
          <div className="mob-map-pin">📍</div>
          <div className="mob-map-label">TUMO Center Astana</div>
          <div className="mob-muted" style={{ fontSize: 12, marginTop: 4 }}>
            пр. Мангілік Ел, 55/14, Астана
          </div>
        </div>
      </div>

      {/* Video guide placeholder */}
      <div className="mob-video-placeholder">
        <div className="mob-video-play">▶</div>
        <div className="mob-video-label">Видео-гид по входу в здание</div>
        <div className="mob-muted" style={{ fontSize: 12 }}>2 мин · HD</div>
      </div>

      {/* Step-by-step */}
      <p className="mob-section-label" style={{ marginTop: 8, marginBottom: 12 }}>Пошаговая инструкция</p>
      <div className="mob-guide-steps">
        {STEPS.map((s, i) => (
          <button
            key={i}
            className={`mob-guide-step ${activeStep === i ? 'mob-guide-step-open' : ''}`}
            onClick={() => setActiveStep(activeStep === i ? null : i)}
          >
            <div className="mob-guide-step-row">
              <div className="mob-guide-step-icon">{s.icon}</div>
              <div className="mob-guide-step-title">
                <span className="mob-guide-step-num">{i + 1}</span>
                {s.title}
              </div>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ flexShrink: 0, opacity: 0.4, transform: activeStep === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {activeStep === i && (
              <p className="mob-guide-step-desc">{s.desc}</p>
            )}
          </button>
        ))}
      </div>

      <div className="mob-info-banner" style={{ marginTop: 16 }}>
        Режим работы: <strong>Пн, Вт, Чт, Пт — 10:30–18:30</strong><br />
        <span style={{ fontSize: 12 }}>Среда, суббота, воскресенье — выходной</span>
      </div>
    </div>
  )
}
