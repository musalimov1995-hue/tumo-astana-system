import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase.js'

// ---------- Config (не меняется) ----------

export const COACHES = [
  { id: 'coach-1', name: 'Айгерим Бекова',       emoji: '👩‍🏫', focus: 'Программирование, Веб-разработка',   room: 5  },
  { id: 'coach-2', name: 'Дамир Серик',           emoji: '👨‍🔧', focus: 'Робототехника, 3D-моделирование',    room: 8  },
  { id: 'coach-3', name: 'Мадина Алиева',         emoji: '👩‍🎨', focus: 'Анимация, Графический дизайн',       room: 11 },
  { id: 'coach-4', name: 'Азат Нурмагамбетов',    emoji: '🎬',  focus: 'Видеопроизводство, Фотография',      room: 3  },
  { id: 'coach-5', name: 'Карина Жаксыбекова',    emoji: '🎵',  focus: 'Музыкальные технологии, Game Design', room: 14 },
  { id: 'coach-6', name: 'Тимур Абенов',          emoji: '🧑‍💻', focus: 'Веб-разработка, Моушн-дизайн',       room: 7  },
  { id: 'coach-7', name: 'Сабина Досмагамбетова', emoji: '👩‍🔬', focus: 'Программирование, Game Design',      room: 10 },
]

export const TIME_SLOTS = [
  { id: 'morning',   label: '10:30 – 12:30', icon: '🌅' },
  { id: 'afternoon', label: '14:30 – 16:30', icon: '☀️' },
  { id: 'evening',   label: '16:30 – 18:30', icon: '🌆' },
]

export const DAY_PAIRS = [
  { id: 'mon-thu', label: 'Понедельник + Четверг', short: 'Пн + Чт' },
  { id: 'tue-fri', label: 'Вторник + Пятница',     short: 'Вт + Пт' },
]

function assignCoach() {
  return COACHES[Math.floor(Math.random() * COACHES.length)]
}

// ---------- Статические данные (не в Supabase) ----------

const initialCurators = [
  { id: 'cur-1', username: 'a.bekova',  password: 'demo123', name: 'Айгерим Бекова', groups: ['Программирование'] },
  { id: 'cur-2', username: 'd.serik',   password: 'demo123', name: 'Дамир Серик',    groups: ['Робототехника', 'Дизайн'] },
]

const initialStudents = [
  { id: 'stu-1', applicationId: 'app-1001', name: 'Алина Сатпаева',  courses: ['Программирование','Веб-разработка','3D-моделирование','Game Design'], curatorId: 'cur-1' },
  { id: 'stu-2', applicationId: 'app-1002', name: 'Ерлан Жумабаев', courses: ['Робототехника','Программирование','Game Design','3D-моделирование'],   curatorId: 'cur-2' },
]

const initialAttendance = [
  { id: 'att-1', studentId: 'stu-1', date: '2026-06-10', present: true  },
  { id: 'att-2', studentId: 'stu-1', date: '2026-06-12', present: false },
  { id: 'att-3', studentId: 'stu-2', date: '2026-06-10', present: true  },
  { id: 'att-4', studentId: 'stu-2', date: '2026-06-12', present: true  },
]

const initialProgressNotes = [
  { id: 'pn-1', studentId: 'stu-1', date: '2026-06-12', note: 'Хорошо освоила условные операторы, нужно подтянуть циклы.' },
  { id: 'pn-2', studentId: 'stu-2', date: '2026-06-12', note: 'Собрал первого робота-исследователя, отличная мотивация.'  },
]

// ---------- Маппинг Supabase row ↔ app объект ----------

function rowToStream(row) {
  return {
    id: row.id,
    title: row.title,
    capacity: row.capacity,
    status: row.status,
    graduatedCount: row.graduated_count ?? null,
  }
}

function rowToApp(row) {
  return {
    id: row.id,
    childName:    row.child_name,
    childAge:     row.child_age,
    parentName:   row.parent_name,
    parentPhone:  row.parent_phone,
    parentEmail:  row.parent_email,
    streamId:     row.stream_id,
    status:       row.status,
    queuePosition: row.queue_position,
    submittedAt:  row.submitted_at,
    schedule:     row.schedule_days ? { days: row.schedule_days, time: row.schedule_time } : null,
    coachId:      row.coach_id,
    coachName:    row.coach_name,
    coachEmoji:   row.coach_emoji,
    coachFocus:   row.coach_focus,
    workshopRoom: row.workshop_room,
  }
}

function appToRow(app) {
  return {
    id:            app.id,
    child_name:    app.childName,
    child_age:     app.childAge,
    parent_name:   app.parentName,
    parent_phone:  app.parentPhone,
    parent_email:  app.parentEmail  ?? null,
    stream_id:     app.streamId,
    status:        app.status,
    queue_position: app.queuePosition ?? null,
    submitted_at:  app.submittedAt,
    schedule_days: app.schedule?.days ?? null,
    schedule_time: app.schedule?.time ?? null,
    coach_id:      app.coachId       ?? null,
    coach_name:    app.coachName     ?? null,
    coach_emoji:   app.coachEmoji    ?? null,
    coach_focus:   app.coachFocus    ?? null,
    workshop_room: app.workshopRoom  ?? null,
  }
}

// ---------- Singleton state ----------

let state = {
  streams:       [],
  applications:  [],
  curators:      initialCurators,
  students:      initialStudents,
  attendance:    initialAttendance,
  progressNotes: initialProgressNotes,
  loaded:        false,
}

const listeners = new Set()

function emit() { listeners.forEach((fn) => fn(state)) }

function setState(updater) {
  state = updater(state)
  emit()
}

// ---------- Инициализация из Supabase ----------

export async function initStore() {
  if (state.loaded) return

  const [{ data: streams, error: se }, { data: apps, error: ae }] = await Promise.all([
    getSupabase().from('streams').select('*').order('created_at'),
    getSupabase().from('applications').select('*').order('submitted_at'),
  ])

  if (se || ae) {
    console.error('Supabase load error:', se ?? ae)
    setState((s) => ({ ...s, loaded: true }))
    return
  }

  setState((s) => ({
    ...s,
    streams:      (streams || []).map(rowToStream),
    applications: (apps    || []).map(rowToApp),
    loaded:       true,
  }))
}

// ---------- Производные данные ----------

function getActiveStream(s) {
  return s.streams.find((str) => str.status === 'open') || null
}

function getOccupiedSeats(s, streamId) {
  return s.applications.filter((a) => a.streamId === streamId && a.status === 'accepted').length
}

export function getStreamSummary() {
  const active = getActiveStream(state)
  if (!active) return null
  const occupied = getOccupiedSeats(state, active.id)
  return { ...active, occupied, free: Math.max(active.capacity - occupied, 0) }
}

export function findApplicationById(id) {
  return state.applications.find((a) => a.id === id) || null
}

export function getAllApplicationsForStream(streamId) {
  return state.applications.filter((a) => a.streamId === streamId)
}

export function getAllStreams() {
  return state.streams
}

// ---------- Мутации (async — пишут в Supabase) ----------

export async function submitApplication({ childName, childAge, parentName, parentPhone, parentEmail, schedule }) {
  const active = getActiveStream(state)
  if (!active) throw new Error('Нет открытого потока для приёма заявок')

  const occupied      = getOccupiedSeats(state, active.id)
  const hasSeat       = occupied < active.capacity
  const waitlistCount = state.applications.filter(
    (a) => a.streamId === active.id && a.status === 'waitlisted'
  ).length

  const coach = hasSeat ? assignCoach() : null

  const newApp = {
    id:           `app-${Date.now()}`,
    childName,
    childAge:     Number(childAge),
    parentName,
    parentPhone,
    parentEmail:  parentEmail || null,
    streamId:     active.id,
    status:       hasSeat ? 'accepted' : 'waitlisted',
    queuePosition: hasSeat ? null : waitlistCount + 1,
    submittedAt:  new Date().toISOString(),
    schedule:     schedule || null,
    coachId:      coach?.id    ?? null,
    coachName:    coach?.name  ?? null,
    coachEmoji:   coach?.emoji ?? null,
    coachFocus:   coach?.focus ?? null,
    workshopRoom: coach?.room  ?? null,
  }

  // Optimistic local update
  setState((s) => ({ ...s, applications: [...s.applications, newApp] }))

  // Persist
  const { error } = await getSupabase().from('applications').insert(appToRow(newApp))
  if (error) {
    console.error('Supabase insert error:', error)
    throw new Error(`Supabase: ${error.message} (code: ${error.code})`)
  }

  return newApp
}

export async function withdrawApplication(applicationId) {
  const app = state.applications.find((a) => a.id === applicationId)
  if (!app) return

  const streamId = app.streamId
  const stream   = state.streams.find((s) => s.id === streamId)

  let updatedApps = state.applications.map((a) =>
    a.id === applicationId ? { ...a, status: 'withdrawn' } : a
  )

  const occupied  = updatedApps.filter((a) => a.streamId === streamId && a.status === 'accepted').length
  const freeSeats = Math.max(stream.capacity - occupied, 0)

  const promotedApps = []

  if (freeSeats > 0) {
    const waitlist = updatedApps
      .filter((a) => a.streamId === streamId && a.status === 'waitlisted')
      .sort((a, b) => a.queuePosition - b.queuePosition)
    const toPromoteIds = new Set(waitlist.slice(0, freeSeats).map((a) => a.id))

    updatedApps = updatedApps.map((a) => {
      if (!toPromoteIds.has(a.id)) return a
      const coach = assignCoach()
      const promoted = {
        ...a, status: 'accepted', queuePosition: null,
        coachId: coach.id, coachName: coach.name, coachEmoji: coach.emoji,
        coachFocus: coach.focus, workshopRoom: coach.room,
      }
      promotedApps.push(promoted)
      return promoted
    })

    let pos = 1
    updatedApps = updatedApps.map((a) =>
      a.streamId === streamId && a.status === 'waitlisted'
        ? { ...a, queuePosition: pos++ }
        : a
    )
  }

  // Local update
  setState((s) => ({ ...s, applications: updatedApps }))

  // Supabase sync
  const remainingWaitlist = updatedApps.filter(
    (a) => a.streamId === streamId && a.status === 'waitlisted'
  )
  const results = await Promise.all([
    getSupabase().from('applications').update({ status: 'withdrawn' }).eq('id', applicationId),
    ...promotedApps.map((a) => getSupabase().from('applications').update(appToRow(a)).eq('id', a.id)),
    ...remainingWaitlist.map((a) =>
      getSupabase().from('applications').update({ queue_position: a.queuePosition }).eq('id', a.id)
    ),
  ])
  results.forEach(({ error }) => { if (error) console.error('Supabase update error:', error) })
}

export async function setStreamCapacity(streamId, newCapacity) {
  const updatedStreams = state.streams.map((str) =>
    str.id === streamId ? { ...str, capacity: newCapacity } : str
  )
  let updatedApps = [...state.applications]

  const occupied  = updatedApps.filter((a) => a.streamId === streamId && a.status === 'accepted').length
  const freeSeats = Math.max(newCapacity - occupied, 0)
  const promotedApps = []

  if (freeSeats > 0) {
    const waitlist = updatedApps
      .filter((a) => a.streamId === streamId && a.status === 'waitlisted')
      .sort((a, b) => a.queuePosition - b.queuePosition)
    const toPromoteIds = new Set(waitlist.slice(0, freeSeats).map((a) => a.id))

    updatedApps = updatedApps.map((a) => {
      if (!toPromoteIds.has(a.id)) return a
      const coach = assignCoach()
      const promoted = {
        ...a, status: 'accepted', queuePosition: null,
        coachId: coach.id, coachName: coach.name, coachEmoji: coach.emoji,
        coachFocus: coach.focus, workshopRoom: coach.room,
      }
      promotedApps.push(promoted)
      return promoted
    })

    let pos = 1
    updatedApps = updatedApps
      .sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0))
      .map((a) =>
        a.streamId === streamId && a.status === 'waitlisted'
          ? { ...a, queuePosition: pos++ }
          : a
      )
  }

  // Local update
  setState((s) => ({ ...s, streams: updatedStreams, applications: updatedApps }))

  // Supabase sync
  const remainingWaitlist = updatedApps.filter(
    (a) => a.streamId === streamId && a.status === 'waitlisted'
  )
  const results = await Promise.all([
    getSupabase().from('streams').update({ capacity: newCapacity }).eq('id', streamId),
    ...promotedApps.map((a) => getSupabase().from('applications').update(appToRow(a)).eq('id', a.id)),
    ...remainingWaitlist.map((a) =>
      getSupabase().from('applications').update({ queue_position: a.queuePosition }).eq('id', a.id)
    ),
  ])
  results.forEach(({ error }) => { if (error) console.error('Supabase update error:', error) })
}

// ---------- Curator / student / attendance (остаются in-memory) ----------

export function loginCurator(username, password) {
  return state.curators.find((c) => c.username === username && c.password === password) || null
}

export function getStudentsForCurator(curatorId) {
  return state.students.filter((s) => s.curatorId === curatorId)
}

export function getAttendanceForStudent(studentId) {
  return state.attendance.filter((a) => a.studentId === studentId).sort((a, b) => a.date.localeCompare(b.date))
}

export function getProgressForStudent(studentId) {
  return state.progressNotes.filter((p) => p.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date))
}

export function markAttendance(studentId, date, present) {
  setState((s) => {
    const existing = s.attendance.find((a) => a.studentId === studentId && a.date === date)
    const attendance = existing
      ? s.attendance.map((a) => a.id === existing.id ? { ...a, present } : a)
      : [...s.attendance, { id: `att-${Date.now()}`, studentId, date, present }]
    return { ...s, attendance }
  })
}

export function addProgressNote(studentId, note) {
  setState((s) => ({
    ...s,
    progressNotes: [
      { id: `pn-${Date.now()}`, studentId, date: new Date().toISOString().slice(0, 10), note },
      ...s.progressNotes,
    ],
  }))
}

// ---------- React hook ----------

export function useStore() {
  const [snapshot, setSnapshot] = useState(state)
  useEffect(() => {
    const listener = (s) => setSnapshot(s)
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [])
  return snapshot
}
