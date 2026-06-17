import React, { useState, useRef, useEffect } from 'react'

const SCAN_PHASES = ['ready', 'scanning', 'processing', 'done']

export default function FaceScanScreen({ studentName, onBack, onDone }) {
  const [phase, setPhase] = useState('ready')
  const [camError, setCamError] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  function startCamera() {
    setCamError('')
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 320, height: 320 } })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setPhase('scanning')
      })
      .catch(() => {
        setCamError('Нет доступа к камере. Разрешите использование камеры в настройках браузера.')
      })
  }

  function captureAndProcess() {
    setPhase('processing')
    setTimeout(() => {
      stopCamera()
      setPhase('done')
    }, 2200)
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  useEffect(() => () => stopCamera(), [])

  return (
    <div className="mob-screen">
      <div className="mob-inner-header">
        <button className="mob-back-btn" onClick={() => { stopCamera(); onBack() }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="mob-inner-title">Биометрия</span>
        <span />
      </div>

      <div className="mob-scroll mob-scroll-inner" style={{ alignItems: 'center' }}>
        <p className="mob-section-label" style={{ textAlign: 'center', marginBottom: 6 }}>
          Регистрация лица — {studentName}
        </p>
        <p className="mob-muted" style={{ textAlign: 'center', marginBottom: 20 }}>
          {phase === 'ready' && 'Камера сфотографирует лицо ребёнка и сохранит в защищённую базу данных для прохода через турникет.'}
          {phase === 'scanning' && 'Смотрите прямо в камеру. Нажмите «Сфотографировать».'}
          {phase === 'processing' && 'Обработка…'}
          {phase === 'done' && 'Биометрия зарегистрирована успешно.'}
        </p>

        <div className="mob-face-frame">
          {/* Camera video */}
          {(phase === 'scanning' || phase === 'processing') && (
            <video
              ref={videoRef}
              muted
              playsInline
              className="mob-face-video"
            />
          )}

          {/* Oval overlay */}
          {(phase === 'scanning' || phase === 'processing') && (
            <div className="mob-face-oval" />
          )}

          {/* Scan animation */}
          {phase === 'processing' && (
            <div className="mob-face-scanline" />
          )}

          {/* Corner brackets */}
          {(phase === 'scanning' || phase === 'processing') && (
            <>
              <div className="mob-corner mob-corner-tl" />
              <div className="mob-corner mob-corner-tr" />
              <div className="mob-corner mob-corner-bl" />
              <div className="mob-corner mob-corner-br" />
            </>
          )}

          {/* Ready state */}
          {phase === 'ready' && (
            <div className="mob-face-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B873E0" strokeWidth="1.2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
                <path d="M15 3h4v4M9 3H5v4M15 21h4v-4M9 21H5v-4"/>
              </svg>
            </div>
          )}

          {/* Done state */}
          {phase === 'done' && (
            <div className="mob-face-done">
              <div className="mob-face-done-circle">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4D8B31" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {camError && <div className="mob-error" style={{ marginTop: 16 }}>{camError}</div>}

        {phase === 'ready' && (
          <button className="mob-btn-primary" style={{ marginTop: 24, width: '100%' }} onClick={startCamera}>
            Включить камеру
          </button>
        )}
        {phase === 'scanning' && (
          <button className="mob-btn-primary" style={{ marginTop: 24, width: '100%' }} onClick={captureAndProcess}>
            Сфотографировать
          </button>
        )}
        {phase === 'processing' && (
          <div className="mob-ecp-step" style={{ marginTop: 24 }}>
            <div className="mob-spinner" />
            <span>Анализ и сохранение в базу данных…</span>
          </div>
        )}

        {phase === 'done' && (
          <div className="mob-face-success-text">
            <div className="mob-badge mob-badge-ok" style={{ fontSize: 14, padding: '8px 16px' }}>
              ✓ Биометрия зарегистрирована
            </div>
            <p className="mob-muted" style={{ marginTop: 12, textAlign: 'center' }}>
              Теперь ребёнок может проходить через турникет по распознаванию лица.
            </p>
          </div>
        )}
      </div>

      <div className="mob-footer">
        <button className="mob-btn-primary" disabled={phase !== 'done'} onClick={onDone}>
          {phase === 'done' ? 'Готово' : 'Завершите сканирование'}
        </button>
      </div>
    </div>
  )
}
