'use client'

import { useState, useEffect } from 'react'
import { Schedule, Person, SlotKey } from '@/app/lib/types'
import { loadSchedule, saveSchedule, getDay, setVisitorInSlot } from '@/app/lib/storage'
import { weekAheadKeys, isPast } from '@/app/lib/dates'
import DayCard from './DayCard'
import NotesTab from './NotesTab'

type Tab = 'visits' | 'archive' | 'notes'

export default function ScheduleApp() {
  const [tab, setTab] = useState<Tab>('visits')
  const [schedule, setSchedule] = useState<Schedule>({})
  const [weekDates, setWeekDates] = useState<string[]>([])

  useEffect(() => {
    setSchedule(loadSchedule())
    setWeekDates(weekAheadKeys())
  }, [])

  function handleSetVisitor(date: string, slot: SlotKey, index: 0 | 1, name: Person | '') {
    setSchedule(prev => {
      const next = setVisitorInSlot(prev, date, slot, index, name)
      saveSchedule(next)
      return next
    })
  }

  const archiveDates = Object.keys(schedule)
    .filter(isPast)
    .sort((a, b) => (a > b ? -1 : 1))

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-zinc-800">מבקרים את אמא 🧡</h1>

          <div className="flex rounded-xl overflow-hidden border border-zinc-200 text-sm font-medium">
            <button
              onClick={() => setTab('notes')}
              className={`px-4 py-2 transition-colors cursor-pointer ${
                tab === 'notes'
                  ? 'bg-orange-500 text-white'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
              }`}
            >
              הערות
            </button>
            <button
              onClick={() => setTab('visits')}
              className={`px-4 py-2 transition-colors cursor-pointer ${
                tab === 'visits'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
              }`}
            >
              ביקורים
            </button>
            <button
              onClick={() => setTab('archive')}
              className={`px-4 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                tab === 'archive'
                  ? 'bg-zinc-500 text-white'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
              }`}
            >
              ארכיון
              {archiveDates.length > 0 && (
                <span className="text-xs bg-zinc-200 text-zinc-600 rounded-full w-5 h-5 flex items-center justify-center">
                  {archiveDates.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === 'visits' && (
          <div className="flex flex-col gap-4">
            {weekDates.length === 0 ? (
              <div className="text-zinc-400 text-center py-12">טוען...</div>
            ) : (
              weekDates.map(date => (
                <DayCard
                  key={date}
                  dateKey={date}
                  slots={getDay(schedule, date)}
                  onSetVisitor={(slot, index, name) => handleSetVisitor(date, slot, index, name)}
                />
              ))
            )}
          </div>
        )}

        {tab === 'notes' && <NotesTab />}

        {tab === 'archive' && (
          <div className="flex flex-col gap-4">
            {archiveDates.length === 0 ? (
              <div className="text-zinc-400 text-center py-12">
                <p className="text-4xl mb-3">📁</p>
                <p>אין ביקורים בארכיון עדיין</p>
              </div>
            ) : (
              archiveDates.map(date => (
                <DayCard
                  key={date}
                  dateKey={date}
                  slots={getDay(schedule, date)}
                  onSetVisitor={() => {}}
                  readOnly
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
