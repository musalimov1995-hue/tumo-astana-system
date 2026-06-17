import React, { useState } from 'react'

const demoProfiles = [
  { id: 'demo-1', name: 'Тестовый профиль А', courses: ['Программирование', 'Game Design'] },
  { id: 'demo-2', name: 'Тестовый профиль Б', courses: ['Робототехника', '3D-моделирование'] },
]

export default function FaceConcept() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  function runDemo(matched) {
    setResult(null)
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setResult(matched ? demoProfiles[0] : null)
    }, 1800)
  }

  return (
    <main className="page page-narrow">
      <div className="eyebrow">Будущий модуль · концепт</div>
      <h1 className="page-title">Проход через турникет</h1>

      <div className="concept-banner">
        Это демонстрационный макет на тестовых, вымышленных профилях. Реального распознавания лиц,
        камеры или базы данных детей здесь нет. Запуск настоящего сбора биометрии детей требует отдельного
        решения руководства центра, согласования с юридическим отделом и процедур защиты персональных данных —
        этот экран только показывает идею сценария.
      </div>

      <div className="card">
        <div className="turnstile-demo">
          <div className="turnstile-face">
            {scanning ? '🔍' : result ? '✅' : '🙂'}
            {scanning && <div className="turnstile-scan-line" />}
          </div>

          {!scanning && !result && (
            <p className="muted" style={{ textAlign: 'center' }}>
              Нажмите «Сымитировать сканирование», чтобы увидеть, как будет выглядеть сценарий прохода.
            </p>
          )}

          {scanning && <p className="muted">Сравнение с тестовой базой профилей…</p>}

          {result && !scanning && (
            <>
              <div className="turnstile-gate">Турникет открыт — {result.name}</div>
              <span className="muted">Направления: {result.courses.join(', ')} (тестовые данные)</span>
            </>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => runDemo(true)} disabled={scanning}>
              Сымитировать сканирование (успех)
            </button>
            <button className="btn btn-secondary" onClick={() => runDemo(false)} disabled={scanning}>
              Сымитировать (не найден)
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>Как это будет работать в реальной версии</h3>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
          Камера на турникете делает снимок, система сравнивает его с базой профилей учеников, у которых
          родители подписали отдельное согласие на обработку биометрических данных. При совпадении турникет
          открывается и в системе фиксируется отметка о приходе — это может автоматически закрывать посещаемость
          в кабинете куратора. Для запуска этой части нужны: официальное решение центра о сборе биометрии детей,
          согласованная политика хранения данных и техническое задание на оборудование турникета.
        </p>
      </div>
    </main>
  )
}
