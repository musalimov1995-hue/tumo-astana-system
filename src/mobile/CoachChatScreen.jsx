import React, { useState, useRef, useEffect } from 'react'
import { DAY_PAIRS, TIME_SLOTS } from '../data/store.js'

// Coach replies — more human, slower than AI, sometimes busy
function coachReply(text, coach, schedule) {
  const t = text.toLowerCase()
  const firstName = coach?.name?.split(' ')[0] ?? 'Coach'
  const dayPair  = DAY_PAIRS.find((d) => d.id === schedule?.days)
  const timeSlot = TIME_SLOTS.find((ts) => ts.id === schedule?.time)

  if (/(привет|сәлем|салем|здравствуй|hi|hello)/.test(t))
    return `Сәлем! 👋 Я ${coach?.name}, твой Learning Coach в TUMO. Рад познакомиться! Если есть вопросы — пиши, отвечу как только освобожусь с мастер-класса 😊`

  if (/(когда|расписан|время|поток|прийти|приход)/.test(t)) {
    if (dayPair && timeSlot)
      return `Ты записан(а) на ${dayPair.short}, поток ${timeSlot.label} 📅\n\nПриходи чуть заранее — минут за 5-10, чтобы успеть войти через турникет и найти кабинет.`
    return 'Проверь своё расписание — оно было в карточке после регистрации. Если не помнишь, напиши администратору.'
  }

  if (/(кабинет|комнат|room|куда|где|найти|заблудил)/.test(t))
    return `Наш Workshop Room — #${coach?.room ?? '—'}, 3-й этаж. Выходишь из лифта направо, второй поворот налево. Там будет табличка с моим именем на двери 🚪\n\nЕсли потеряешься — спроси у ресепшн.`

  if (/(что взять|принест|ноутбук|материал|нужно)/.test(t))
    return 'Из обязательного — ничего особенного 🙂 Всё оборудование есть в центре. Можешь взять ноутбук если привык работать на своём, но это не обязательно. Заряди телефон — иногда нужен для некоторых заданий.'

  if (/(курс|направлен|выбрать|tumo.world)/.test(t))
    return `Направления выбираешь сам(а) на tumo.world после ориентационного месяца — там будет всё понятно 🌐\n\nМоя специализация: ${coach?.focus ?? '—'}. Если хочешь что-то по этим темам — могу помочь разобраться на занятиях.`

  if (/(опозда|задержа|не прийти|пропуст|болен|болею|заболел)/.test(t))
    return 'Всякое бывает 🤒 Напиши мне заранее если не сможешь прийти, я отмечу в системе. Если заболел — поправляйся, пропуск закроем. Если просто опаздываешь — тоже напиши, подожду немного.'

  if (/(домашн|задани|hw|homework)/.test(t))
    return 'В TUMO нет домашних заданий в классическом смысле 😄 Но если хочешь практиковаться дома — на tumo.world есть дополнительные материалы. Я тоже могу порекомендовать что почитать/посмотреть по твоим курсам.'

  if (/(страшно|боюсь|нервничаю|переживаю|волнуюс)/.test(t))
    return 'Понимаю 😊 Первый раз всегда немного волнительно. Но поверь — у нас очень дружелюбная атмосфера. Никто не будет смеяться если что-то не получается, мы все учимся вместе. Увидишь — быстро освоишься!'

  if (/(спасибо|рахмет|thank)/.test(t))
    return `Всегда пожалуйста, ${text.includes('!') ? '😄' : '🙂'} Если появятся вопросы — пиши. До встречи в центре!`

  // Default — busy coach
  const busyReplies = [
    `Привет! Сейчас на мастер-классе, отвечу через час 🙏 Если срочно — обратись к ресепшн TUMO.`,
    `Получил сообщение! Разберу чуть позже — сейчас занят с группой. Спасибо за терпение 🎓`,
    `Хороший вопрос! Напомни мне об этом при встрече в центре, там объясню подробнее 👍`,
  ]
  return busyReplies[Math.floor(Math.random() * busyReplies.length)]
}

const QUICK = [
  'Когда мне приходить?',
  'Где найти кабинет?',
  'Что взять с собой?',
  'Как выбрать курсы?',
]

export default function CoachChatScreen({ application, onBack }) {
  const coach = application ? {
    name: application.coachName,
    emoji: application.coachEmoji,
    focus: application.coachFocus,
    room: application.workshopRoom,
  } : null

  const schedule = application?.schedule

  const initMsg = coach
    ? [{
        id: 0, role: 'coach',
        text: `Сәлем! 👋 Меня зовут ${coach.name}, я твой Learning Coach в TUMO Astana.\n\nМоя специализация: ${coach.focus}. Мы будем встречаться в Workshop Room #${coach.room}.\n\nЕсли есть вопросы о центре, расписании или чём угодно — пиши! Стараюсь отвечать быстро, но иногда бываю на мастер-классах 😊`,
        time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
      }]
    : [{
        id: 0, role: 'coach',
        text: 'Coach будет назначен после принятия вашей заявки. Вернитесь в этот чат после регистрации!',
        time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
      }]

  const [messages, setMessages] = useState(initMsg)
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function send(text) {
    const msg = text.trim()
    if (!msg || !coach) return
    const time = new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' })
    setMessages((ms) => [...ms, { id: Date.now(), role: 'user', text: msg, time }])
    setInput('')
    setTyping(true)

    // Coach is slower than AI — feels like a real person
    const delay = 1800 + Math.random() * 1500
    setTimeout(() => {
      setTyping(false)
      setMessages((ms) => [
        ...ms,
        {
          id: Date.now() + 1, role: 'coach',
          text: coachReply(msg, coach, schedule),
          time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, delay)
  }

  const showQuick = messages.length <= 1 && coach

  return (
    <div className="mob-screen">
      {/* Header */}
      <div className="mob-coach-chat-header">
        <button className="mob-back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="mob-coach-chat-info">
          <div className="mob-coach-chat-avatar">
            {coach?.emoji ?? '👤'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {coach?.name ?? 'Learning Coach'}
            </div>
            <div style={{ fontSize: 11, color: coach ? '#4D8B31' : '#9C97A3' }}>
              {coach ? `● онлайн · Room #${coach.room}` : 'Coach не назначен'}
            </div>
          </div>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* Messages */}
      <div className="mob-chat-messages mob-scroll">
        {messages.map((m) => (
          <div key={m.id} className={`mob-msg-row ${m.role === 'user' ? 'mob-msg-row-user' : ''}`}>
            {m.role === 'coach' && (
              <div className="mob-msg-bot-avatar" style={{ background: 'rgba(184,115,224,0.1)', fontSize: 16 }}>
                {coach?.emoji ?? '👤'}
              </div>
            )}
            <div className={`mob-bubble ${m.role === 'user' ? 'mob-bubble-user' : 'mob-bubble-coach'}`}>
              <p style={{ whiteSpace: 'pre-line', margin: 0, lineHeight: 1.55 }}>{m.text}</p>
              <span className="mob-msg-time">{m.time}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="mob-msg-row">
            <div className="mob-msg-bot-avatar" style={{ background: 'rgba(184,115,224,0.1)', fontSize: 16 }}>
              {coach?.emoji ?? '👤'}
            </div>
            <div className="mob-bubble mob-bubble-coach mob-typing-bubble">
              <span className="mob-typing-dot" style={{ background: '#B873E0' }} />
              <span className="mob-typing-dot" style={{ background: '#B873E0' }} />
              <span className="mob-typing-dot" style={{ background: '#B873E0' }} />
            </div>
          </div>
        )}

        {showQuick && !typing && (
          <div className="mob-quick-replies">
            {QUICK.map((q) => (
              <button key={q} className="mob-quick-reply" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mob-chat-input-row">
        <input
          className="mob-chat-input"
          placeholder={coach ? `Написать ${coach.name.split(' ')[0]}…` : 'Coach не назначен'}
          value={input}
          disabled={!coach}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
        />
        <button className="mob-chat-send" onClick={() => send(input)} disabled={!input.trim() || typing || !coach}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
