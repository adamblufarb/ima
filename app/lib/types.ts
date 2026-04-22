export type Person = 'שרון' | 'ארם' | 'איתמר' | 'אדם' | 'אורי' | 'אילן' | 'אלה'

export const PEOPLE: Person[] = ['שרון', 'ארם', 'איתמר', 'אדם', 'אורי', 'אילן', 'אלה']

export type SlotKey = 'morning' | 'noon' | 'evening'

export const SLOTS: Record<SlotKey, { label: string; time: string }> = {
  morning: { label: 'בוקר',    time: '07:45–08:30' },
  noon:    { label: 'צהריים',  time: '13:00–14:00' },
  evening: { label: 'ערב',     time: '18:00–19:00' },
}

export const SLOT_KEYS: SlotKey[] = ['morning', 'noon', 'evening']

export interface DaySlots {
  morning: Person[]
  noon:    Person[]
  evening: Person[]
}

// Keyed by YYYY-MM-DD
export type Schedule = Record<string, DaySlots>
