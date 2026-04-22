'use client'

import { PEOPLE, Person, SlotKey, SLOTS } from '@/app/lib/types'

interface SlotCardProps {
  slotKey: SlotKey
  visitors: Person[]               // up to 2, positional
  onSetVisitor: (index: 0 | 1, name: Person | '') => void
  readOnly?: boolean
}

function VisitorDropdown({
  label,
  value,
  exclude,
  onChange,
  readOnly,
}: {
  label: string
  value: Person | ''
  exclude: Person | ''
  onChange: (name: Person | '') => void
  readOnly?: boolean
}) {
  const options = PEOPLE.filter(p => p !== exclude)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-400 shrink-0 w-14">{label}</span>
      {readOnly ? (
        <span className={`text-sm px-3 py-1.5 rounded-lg flex-1 ${
          value
            ? 'bg-emerald-100 border border-emerald-200 text-emerald-700'
            : 'text-zinc-400 italic'
        }`}>
          {value || '—'}
        </span>
      ) : (
        <select
          value={value}
          onChange={e => onChange(e.target.value as Person | '')}
          className="flex-1 bg-zinc-50 border border-zinc-200 text-sm text-zinc-700
                     rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-400
                     cursor-pointer appearance-none"
          dir="rtl"
        >
          <option value="">—</option>
          {options.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      )}
    </div>
  )
}

export default function SlotCard({ slotKey, visitors, onSetVisitor, readOnly }: SlotCardProps) {
  const { label, time } = SLOTS[slotKey]
  const v0: Person | '' = visitors[0] ?? ''
  const v1: Person | '' = visitors[1] ?? ''

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex flex-col gap-2.5">
      {/* Slot header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-zinc-700">{label}</span>
        <span className="text-xs text-zinc-400 font-mono">{time}</span>
      </div>

      {/* Two visitor dropdowns */}
      <div className="flex flex-col gap-1.5">
        <VisitorDropdown
          label="מבקר 1"
          value={v0}
          exclude={v1}
          onChange={name => onSetVisitor(0, name)}
          readOnly={readOnly}
        />
        <VisitorDropdown
          label="מבקר 2"
          value={v1}
          exclude={v0}
          onChange={name => onSetVisitor(1, name)}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}
