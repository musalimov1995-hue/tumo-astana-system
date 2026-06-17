import React, { useState, useEffect } from 'react'

// Simulates the NCALayer / eGov mobile ЭЦП signing flow
const ECP_STEPS = ['idle', 'connecting', 'key_choice', 'pin', 'signing', 'signed']

export default function ConsentScreen({ formData, onBack, onSigned }) {
  const [ecpState, setEcpState] = useState('idle')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [biometryConsent, setBiometryConsent] = useState(false)
  const [dataConsent, setDataConsent] = useState(false)

  // Auto-advance connecting → key_choice
  useEffect(() => {
    if (ecpState === 'connecting') {
      const t = setTimeout(() => setEcpState('key_choice'), 1600)
      return () => clearTimeout(t)
    }
    if (ecpState === 'signing') {
      const t = setTimeout(() => { setEcpState('signed') }, 2000)
      return () => clearTimeout(t)
    }
  }, [ecpState])

  function startEcp() {
    setEcpState('connecting')
  }

  function confirmPin() {
    if (pin.length < 4) { setPinError('Введите PIN-код (минимум 4 цифры)'); return }
    setPinError('')
    setEcpState('signing')
  }

  const canSign = dataConsent && biometryConsent

  return (
    <div className="mob-screen">
      <div className="mob-inner-header">
        <button className="mob-back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="mob-inner-title">Согласие родителя</span>
        <span />
      </div>

      <div className="mob-scroll mob-scroll-inner">
        {/* Summary */}
        <div className="mob-consent-summary">
          <div className="mob-summary-row">
            <span className="mob-muted">Ребёнок</span>
            <strong>{formData.childName}, {formData.childAge} лет</strong>
          </div>
          <div className="mob-summary-row">
            <span className="mob-muted">Родитель</span>
            <strong>{formData.parentName}</strong>
          </div>
          {formData.schedule && (
            <div className="mob-summary-row">
              <span className="mob-muted">Расписание</span>
              <span style={{textAlign:'right',fontSize:12}}>
                {formData.schedule.days === 'mon-thu' ? 'Пн + Чт' : 'Вт + Пт'}
                {' · '}
                {formData.schedule.time === 'morning' ? '10:30–12:30' : formData.schedule.time === 'afternoon' ? '14:30–16:30' : '16:30–18:30'}
              </span>
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="mob-consent-checks">
          <label className="mob-check-row">
            <input type="checkbox" checked={dataConsent} onChange={(e) => setDataConsent(e.target.checked)} />
            <span>
              Я даю согласие на обработку персональных данных моего ребёнка в целях зачисления и обучения в TUMO Astana.
            </span>
          </label>
          <label className="mob-check-row">
            <input type="checkbox" checked={biometryConsent} onChange={(e) => setBiometryConsent(e.target.checked)} />
            <span>
              Я даю согласие на сбор и обработку биометрических данных (фото лица) ребёнка для идентификации при входе через турникет.
            </span>
          </label>
        </div>

        {/* ЭЦП block */}
        <div className="mob-ecp-block">
          <div className="mob-ecp-header">
            <div className="mob-ecp-logo">ЭЦП</div>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>Подписать через eGov / NCA QOLDAN</div>
              <div className="mob-muted">Цифровая подпись НУЦ РК</div>
            </div>
          </div>

          {ecpState === 'idle' && (
            <button
              className="mob-btn-primary"
              style={{ marginTop: 16 }}
              onClick={startEcp}
              disabled={!canSign}
            >
              {!canSign ? 'Сначала дайте оба согласия' : 'Открыть ЭЦП-подписание'}
            </button>
          )}

          {ecpState === 'connecting' && (
            <div className="mob-ecp-step">
              <div className="mob-spinner" />
              <span>Подключение к NCALayer…</span>
            </div>
          )}

          {ecpState === 'key_choice' && (
            <div className="mob-ecp-key-list">
              <p style={{fontSize:13,marginBottom:10,color:'#6B6670'}}>Выберите ключ ЭЦП:</p>
              <button
                className="mob-ecp-key-item"
                onClick={() => setEcpState('pin')}
              >
                <div className="mob-ecp-key-icon">🔑</div>
                <div>
                  <div style={{fontWeight:600,fontSize:13}}>RSA — {formData.parentName}</div>
                  <div className="mob-muted">AUTH · Действителен до 2027</div>
                </div>
              </button>
            </div>
          )}

          {ecpState === 'pin' && (
            <div className="mob-ecp-pin">
              <p style={{fontSize:13,marginBottom:10,color:'#6B6670'}}>Введите PIN-код ЭЦП:</p>
              <div className="mob-pin-dots">
                {[0,1,2,3,4,5].map((i) => (
                  <div key={i} className={`mob-pin-dot ${i < pin.length ? 'mob-pin-dot-filled' : ''}`} />
                ))}
              </div>
              <div className="mob-numpad">
                {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
                  <button
                    key={i}
                    className={`mob-numpad-key ${k === '' ? 'mob-numpad-empty' : ''}`}
                    onClick={() => {
                      if (k === '⌫') { setPin((p) => p.slice(0, -1)); setPinError('') }
                      else if (k !== '' && pin.length < 6) { setPin((p) => p + String(k)); setPinError('') }
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>
              {pinError && <div className="mob-error">{pinError}</div>}
              <button className="mob-btn-primary" style={{marginTop:12}} onClick={confirmPin}>
                Подтвердить
              </button>
            </div>
          )}

          {ecpState === 'signing' && (
            <div className="mob-ecp-step">
              <div className="mob-spinner" />
              <span>Формирование подписи…</span>
            </div>
          )}

          {ecpState === 'signed' && (
            <div className="mob-ecp-success">
              <div className="mob-ecp-check">✓</div>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>Документ подписан</div>
                <div className="mob-muted">ЭЦП НУЦ РК · {new Date().toLocaleDateString('ru-KZ')}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mob-footer">
        <button
          className="mob-btn-primary"
          disabled={ecpState !== 'signed'}
          onClick={onSigned}
        >
          {ecpState === 'signed' ? 'Отправить заявку' : 'Подпишите документ через ЭЦП'}
        </button>
      </div>
    </div>
  )
}
