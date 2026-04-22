'use client'

import { DaySlots, Person, SlotKey, SLOT_KEYS } from '@/app/lib/types'
import { formatDateHebrewLong, isToday } from '@/app/lib/dates'
import SlotCard from './SlotCard'

interface DayCardProps {
  dateKey: string
  slots: DaySlots
  onSetVisitor: (slot: SlotKey, index: 0 | 1, name: Person | '') => void
  readOnly?: boolean
}

export default function DayCard({ dateKey, slots, onSetVisitor, readOnly }: DayCardProps) {
  const today = isToday(dateKey)

  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-3 shadow-sm
      ${today
        ? 'border-emerald-400 bg-emerald-50'
        : 'border-zinc-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-2">
        <h2 className={`font-bold text-base ${today ? 'text-emerald-700' : 'text-zinc-700'}`}>
          {formatDateHebrewLong(dateKey)}
        </h2>
        {today && (
          <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium">
            היום
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {SLOT_KEYS.map(slot => (
          <SlotCard
            key={slot}
            slotKey={slot}
            visitors={slots[slot]}
            onSetVisitor={(index, name) => onSetVisitor(slot, index, name)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  )
}
