import React, { useState } from 'react'
import { submitApplication } from '../data/store.js'
import BottomNav from '../mobile/BottomNav.jsx'
import AuthScreen from '../mobile/AuthScreen.jsx'
import WelcomeScreen from '../mobile/WelcomeScreen.jsx'
import RegFormScreen from '../mobile/RegFormScreen.jsx'
import ConsentScreen from '../mobile/ConsentScreen.jsx'
import FaceScanScreen from '../mobile/FaceScanScreen.jsx'
import SuccessScreen from '../mobile/SuccessScreen.jsx'
import AccountScreen from '../mobile/AccountScreen.jsx'
import OnboardingScreen from '../mobile/OnboardingScreen.jsx'
import CoachChatScreen from '../mobile/CoachChatScreen.jsx'
import ChatHubScreen from '../mobile/ChatHubScreen.jsx'
import StatusScreen from '../mobile/StatusScreen.jsx'
import GuideScreen from '../mobile/GuideScreen.jsx'
import CommunityScreen from '../mobile/CommunityScreen.jsx'
import ChallengesScreen from '../mobile/ChallengesScreen.jsx'
import ChatScreen from '../mobile/ChatScreen.jsx'

const TAB_SCREENS = ['home', 'community', 'challenges', 'chatHub', 'guide', 'onboarding']

export default function MobileApp() {
  const [user, setUser]               = useState(null)   // logged-in app_user from Supabase
  const [screen, setScreen]           = useState('home')
  const [tab, setTab]                 = useState('home')
  const [formData, setFormData]       = useState(null)
  const [application, setApplication] = useState(null)

  function nav(t) {
    const scr = t === 'chat' ? 'chatHub' : t
    setTab(t)
    setScreen(scr)
  }
  function home()       { setScreen('home'); setTab('home') }
  function backToChats(){ setScreen('chatHub'); setTab('chat') }

  function handleFormSubmit(data) { setFormData(data); setScreen('consent') }

  async function handleSigned() {
    try {
      const app = await submitApplication(formData)
      setApplication(app)
      setScreen('success')
    } catch (e) { alert(e.message) }
  }

  const isTabScreen = TAB_SCREENS.includes(screen)

  return (
    <div className="mob-app-wrap">
      <div className="mob-phone-frame">

        {/* Status bar */}
        <div className="mob-status-bar">
          <span>{new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="mob-status-icons">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1.5 8.5C5.2 4.8 10.3 2.5 12 2.5s6.8 2.3 10.5 6M5 12c1.9-1.9 4.4-3 7-3s5.1 1.1 7 3M8.5 15.5c1-1 2.2-1.5 3.5-1.5s2.5.5 3.5 1.5M12 19h.01"/>
            </svg>
            <svg width="22" height="13" viewBox="0 0 26 14" fill="none">
              <rect x="0.75" y="0.75" width="21.5" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="23" y="4" width="3" height="6" rx="1.5" fill="currentColor"/>
              <rect x="2" y="2" width="16" height="10" rx="1.5" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="mob-content-area">
          {/* ── Auth gate ── */}
          {!user && (
            <AuthScreen onAuth={(u) => { setUser(u); setScreen('home') }} />
          )}

          {/* ── App (only after login) ── */}
          {user && (
            <>
              {/* Tab screens */}
              {screen === 'home' && (
                <WelcomeScreen
                  user={user}
                  onStart={() => setScreen('register')}
                  onNav={nav}
                  application={application}
                  onCoachChat={() => setScreen('coachChat')}
                  onUpdateUser={setUser}
                />
              )}
              {screen === 'community'  && <CommunityScreen />}
              {screen === 'challenges' && <ChallengesScreen />}
              {screen === 'chatHub'    && (
                <ChatHubScreen
                  application={application}
                  onOpenAI={() => setScreen('aiChat')}
                  onOpenCoach={() => setScreen('coachChat')}
                />
              )}
              {screen === 'aiChat'     && <ChatScreen onBack={backToChats} />}
              {screen === 'guide'      && <GuideScreen />}
              {screen === 'onboarding' && <OnboardingScreen onFinish={home} />}

              {/* Registration flow */}
              {screen === 'register' && <RegFormScreen onBack={home} onSubmit={handleFormSubmit} />}
              {screen === 'consent' && formData && (
                <ConsentScreen formData={formData} onBack={() => setScreen('register')} onSigned={handleSigned} />
              )}

              {/* Post-registration */}
              {screen === 'success' && application && (
                <SuccessScreen application={application} onFaceScan={() => setScreen('face')} onHome={home} />
              )}
              {screen === 'face' && (
                <FaceScanScreen studentName={application?.childName || ''} onBack={() => setScreen('success')} onDone={() => setScreen('account')} />
              )}

              {/* T360 account + onboarding */}
              {screen === 'account' && application && (
                <AccountScreen application={application} onNext={() => setScreen('onboarding')} onHome={home} />
              )}

              {/* Coach chat */}
              {screen === 'coachChat' && (
                <CoachChatScreen application={application} onBack={backToChats} />
              )}
            </>
          )}
        </div>

        {user && isTabScreen && <BottomNav active={tab} onNav={nav} />}
      </div>

      <p className="mob-desktop-hint">
        Мобильное приложение TUMO Astana · открой на телефоне для полноэкранного режима
      </p>
    </div>
  )
}
