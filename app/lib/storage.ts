import { Schedule, DaySlots, Person, SlotKey, SLOT_KEYS } from './types'

const KEY = 'ima-schedule'

function emptyDay(): DaySlots {
  return { morning: [], noon: [], evening: [] }
}

export function loadSchedule(): Schedule {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Schedule) : {}
  } catch {
    return {}
  }
}

export function saveSchedule(schedule: Schedule): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(schedule))
}

export function getDay(schedule: Schedule, date: string): DaySlots {
  return schedule[date] ?? emptyDay()
}

// Set visitor at positional index 0 or 1 within a slot.
// name='' clears that position.
export function setVisitorInSlot(
  schedule: Schedule,
  date: string,
  slot: SlotKey,
  slotIndex: 0 | 1,
  name: Person | ''
): Schedule {
  const day = getDay(schedule, date)
  const current = day[slot]

  // Represent both positions explicitly
  const pos0: Person | '' = current[0] ?? ''
  const pos1: Person | '' = current[1] ?? ''
  const next = slotIndex === 0 ? [name, pos1] : [pos0, name]

  // Filter empty, deduplicate
  const visitors = next.filter((v, i, a) => v !== '' && a.indexOf(v) === i) as Person[]

  const newDay: DaySlots = { ...day, [slot]: visitors }

  const isEmpty = SLOT_KEYS.every(k => newDay[k].length === 0)
  if (isEmpty) {
    const { [date]: _, ...rest } = schedule
    return rest
  }

  return { ...schedule, [date]: newDay }
}
