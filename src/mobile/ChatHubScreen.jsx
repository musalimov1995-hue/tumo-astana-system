import React from 'react'

export default function ChatHubScreen({ application, onOpenAI, onOpenCoach }) {
  const accepted   = application?.status === 'accepted'
  const hasCoach   = accepted && application?.coachName

  return (
    <div className="mob-screen mob-scroll" style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
          Чаты
        </h2>
        <p className="mob-muted" style={{ fontSize: 13 }}>Выберите с кем хотите пообщаться</p>
      </div>

      {/* AI Support */}
      <button className="mob-chat-hub-card" onClick={onOpenAI}>
        <div className="mob-chat-hub-icon" style={{ background: 'rgba(184,115,224,0.12)', color: '#B873E0' }}>
          🤖
        </div>
        <div className="mob-chat-hub-info">
          <strong>Поддержка TUMO</strong>
          <span className="mob-muted">AI-бот · отвечает мгновенно</span>
          <div className="mob-chat-hub-topics">
            <span>Регистрация</span>
            <span>Расписание</span>
            <span>tumo.world</span>
            <span>Турникет</span>
          </div>
        </div>
        <div className="mob-chat-hub-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </button>

      {/* Coach Chat */}
      <button
        className={`mob-chat-hub-card ${!hasCoach ? 'mob-chat-hub-card-locked' : ''}`}
        onClick={hasCoach ? onOpenCoach : undefined}
        style={{ cursor: hasCoach ? 'pointer' : 'default' }}
      >
        <div className="mob-chat-hub-icon" style={{
          background: hasCoach ? 'rgba(77,139,49,0.1)' : '#F0EDF5',
          fontSize: hasCoach ? 24 : 20,
        }}>
          {hasCoach ? application.coachEmoji : '👤'}
        </div>
        <div className="mob-chat-hub-info">
          <strong>{hasCoach ? application.coachName : 'Learning Coach'}</strong>
          {hasCoach ? (
            <>
              <span className="mob-muted">{application.coachFocus}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4D8B31', display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: '#4D8B31', fontWeight: 600 }}>онлайн · Room #{application.workshopRoom}</span>
              </div>
            </>
          ) : (
            <>
              <span className="mob-muted">Личный тьютор от TUMO</span>
              <div className="mob-info-banner" style={{ marginTop: 8, fontSize: 11, padding: '6px 10px' }}>
                {accepted
                  ? 'Coach будет назначен после обработки заявки'
                  : 'Доступно после принятия заявки'}
              </div>
            </>
          )}
        </div>
        {hasCoach && (
          <div className="mob-chat-hub-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        )}
      </button>

      {!accepted && (
        <div className="mob-info-banner" style={{ marginTop: 8 }}>
          Чат с Coach-ем откроется после регистрации и получения места в потоке.
        </div>
      )}
    </div>
  )
}
