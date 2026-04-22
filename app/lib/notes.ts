import { Person } from './types'

export interface Note {
  id: string
  text: string
  author: Person
  createdAt: string   // ISO
  editedAt?: string   // ISO, only if edited
  pinned: boolean
}

const KEY = 'ima-notes'

export function loadNotes(): Note[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Note[]) : []
  } catch {
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(notes))
}

// Pinned first (by createdAt), then unpinned (by createdAt) — oldest at top
export function sortNotes(notes: Note[]): Note[] {
  const byDate = (a: Note, b: Note) => a.createdAt.localeCompare(b.createdAt)
  return [
    ...notes.filter(n => n.pinned).sort(byDate),
    ...notes.filter(n => !n.pinned).sort(byDate),
  ]
}
