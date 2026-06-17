import React, { useState, useRef, useEffect } from 'react'

// AI bot response logic — pattern matching for common TUMO questions
function botReply(text) {
  const t = text.toLowerCase()

  if (/(привет|здравствуй|сәлем|салем|hi|hello)/.test(t))
    return 'Сәлем! 👋 Я виртуальный помощник TUMO Astana. Помогу ответить на вопросы о записи, расписании, курсах и многом другом. Чем могу помочь?'

  if (/(запис|заявк|регистрац|как попасть|как записать)/.test(t))
    return 'Чтобы записать ребёнка в TUMO:\n1. Нажмите «Подать заявку» на главном экране\n2. Заполните данные ребёнка и родителя\n3. Подпишите согласие через ЭЦП\n4. Если есть свободное место — заявка принята сразу, иначе вы встаёте в очередь.\n\nПосле зачисления ребёнок проходит ориентационный месяц и сам выбирает 4 направления на tumo.world.'

  if (/(возраст|сколько лет|лет)/.test(t))
    return 'TUMO принимает детей от 12 до 18 лет. Никакого предварительного опыта не требуется — всему учат с нуля.'

  if (/(курс|направлен|чему учат|программ)/.test(t))
    return 'В TUMO Astana доступны направления:\n• Программирование\n• Анимация\n• Робототехника\n• Графический дизайн\n• Музыкальные технологии\n• 3D-моделирование\n• Видеопроизводство\n• Веб-разработка\n• Game Design\n• Фотография\n• Моушн-дизайн\n\nКаждый ученик выбирает 4 из них после ориентационного месяца на платформе tumo.world.'

  if (/(стоим|цена|плат|бесплатн|сколько стоит)/.test(t))
    return 'TUMO полностью бесплатно для всех учеников. Никаких скрытых платежей нет — только принести желание учиться! 🎉'

  if (/(расписан|время|часы|когда|режим)/.test(t))
    return 'TUMO Astana работает:\n🗓️ Понедельник, Вторник, Четверг, Пятница: 10:30 – 18:30\n🗓️ Среда, Суббота, Воскресенье: выходной\n\nКаждый ученик посещает центр 2 раза в неделю: Пн+Чт или Вт+Пт, в одном из трёх потоков: 10:30–12:30, 14:30–16:30 или 16:30–18:30.'

  if (/(адрес|где находит|как доехать|местонахожден|location)/.test(t))
    return 'TUMO Astana находится по адресу:\n📍 пр. Мангілік Ел, 55/14, Астана\n\nКак добраться:\n🚇 Метро: станция «Байконур» (синяя линия)\n🚌 Автобус: №32, 45, 118, остановка «TUMO Center»\n\nПосмотрите «Гид по зданию» в приложении — там есть пошаговая инструкция.'

  if (/(очередь|лимит|мест нет|не принят|ждать)/.test(t))
    return 'Если мест нет — вы автоматически встаёте в очередь. Когда кто-то из принятых откажется от места, система автоматически переводит следующего по очереди и уведомляет.\n\nПроверить позицию можно в разделе «Статус» по номеру заявки.'

  if (/(turnikет|турникет|биометр|лицо|вход|пройти)/.test(t))
    return 'После принятия заявки родитель может зарегистрировать биометрию ребёнка (фото лица) прямо в этом приложении. Тогда ребёнок сможет проходить через турникет по распознаванию лица — без карточки и без ожидания.\n\nДля этого нужно дать согласие через ЭЦП.'

  if (/(t360|т360)/.test(t))
    return 'T360 — внутренняя система TUMO для персонала: Coach-ей и Workshop Leader-ов. Ученики и родители через неё не работают.\n\nДля учеников есть платформа tumo.world, где они выбирают курсы и видят свой прогресс.'

  if (/(tumo.world|тумо.ворлд)/.test(t))
    return 'tumo.world — это учебная платформа TUMO, где ученики:\n• Выбирают 4 направления после ориентационного месяца\n• Смотрят обучающие видео\n• Сдают задания\n• Видят свой прогресс\n\nДоступ к tumo.world ученик получает после зачисления.'

  if (/(portfel|portfolio|портфол|работ)/.test(t))
    return 'Работы учеников можно посмотреть в разделе «Сообщество» этого приложения. Там ученики публикуют свои проекты, а другие могут ставить лайки и вдохновляться!'

  if (/(challenge|challend|челлендж|соревнован|конкурс)/.test(t))
    return 'В TUMO регулярно проводятся челленджи и конкурсы по разным направлениям. Загляните в раздел «Челленджи» в приложении — там есть активные задания с призами и дедлайнами!'

  if (/(спасибо|рахмет|thank|thanks)/.test(t))
    return 'Пожалуйста! 😊 Если возникнут ещё вопросы — пишите, всегда помогу. Удачи вам и вашему ребёнку в TUMO! 🚀'

  return 'Хороший вопрос! Если я не смог ответить точно, напишите нам напрямую:\n📧 astana@tumo.org\n📞 +7 (7172) 000-00-00\n\nИли посетите ресепшн TUMO — там помогут с любым вопросом.'
}

const QUICK_REPLIES = [
  'Как записаться?',
  'Сколько стоит?',
  'Какие курсы?',
  'Где находитесь?',
  'Что такое tumo.world?',
  'Турникет и биометрия',
]

const INIT_MESSAGES = [
  {
    id: 0,
    role: 'bot',
    text: 'Сәлем! 👋 Я виртуальный помощник TUMO Astana. Могу ответить на вопросы о записи, курсах, расписании, tumo.world и многом другом. Чем помочь?',
    time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
  },
]

export default function ChatScreen({ onBack }) {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function send(text) {
    const msg = text.trim()
    if (!msg) return
    const time = new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' })
    setMessages((ms) => [...ms, { id: Date.now(), role: 'user', text: msg, time }])
    setInput('')
    setTyping(true)

    const delay = 700 + Math.random() * 800
    setTimeout(() => {
      setTyping(false)
      setMessages((ms) => [
        ...ms,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: botReply(msg),
          time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, delay)
  }

  const showQuickReplies = messages.length <= 1

  return (
    <div className="mob-screen">
      {/* Header */}
      <div className="mob-coach-chat-header">
        {onBack && (
          <button className="mob-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
        )}
        <div className="mob-coach-chat-info">
          <div className="mob-coach-chat-avatar" style={{ background: 'rgba(184,115,224,0.12)', fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>TUMO Support</div>
            <div style={{ fontSize: 11, color: '#4D8B31' }}>● онлайн · ИИ-ассистент</div>
          </div>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* Messages */}
      <div className="mob-chat-messages mob-scroll">
        {messages.map((m) => (
          <div key={m.id} className={`mob-msg-row ${m.role === 'user' ? 'mob-msg-row-user' : ''}`}>
            {m.role === 'bot' && <div className="mob-msg-bot-avatar">🤖</div>}
            <div className={`mob-bubble ${m.role === 'user' ? 'mob-bubble-user' : 'mob-bubble-bot'}`}>
              <p style={{ whiteSpace: 'pre-line', margin: 0, lineHeight: 1.5 }}>{m.text}</p>
              <span className="mob-msg-time">{m.time}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="mob-msg-row">
            <div className="mob-msg-bot-avatar">🤖</div>
            <div className="mob-bubble mob-bubble-bot mob-typing-bubble">
              <span className="mob-typing-dot" />
              <span className="mob-typing-dot" />
              <span className="mob-typing-dot" />
            </div>
          </div>
        )}

        {/* Quick replies */}
        {showQuickReplies && !typing && (
          <div className="mob-quick-replies">
            {QUICK_REPLIES.map((q) => (
              <button key={q} className="mob-quick-reply" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mob-chat-input-row">
        <input
          className="mob-chat-input"
          placeholder="Задайте вопрос…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
        />
        <button
          className="mob-chat-send"
          onClick={() => send(input)}
          disabled={!input.trim() || typing}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
