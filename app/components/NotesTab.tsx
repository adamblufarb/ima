'use client'

import { useState, useEffect } from 'react'
import { PEOPLE, Person } from '@/app/lib/types'
import { Note, loadNotes, saveNotes, sortNotes } from '@/app/lib/notes'

const MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${day} ב${month}, ${h}:${m}`
}

// ─── Add-note form ────────────────────────────────────────────────────────────

function AddNoteForm({ onSave, onCancel }: {
  onSave: (text: string, author: Person) => void
  onCancel: () => void
}) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState<Person | ''>('')

  return (
    <div className="bg-white border border-orange-300 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="מה חשוב לזכור?"
        rows={3}
        autoFocus
        dir="rtl"
        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm rounded-xl
                   px-3 py-2 resize-none focus:outline-none focus:border-orange-400
                   placeholder:text-zinc-400"
      />
      <select
        value={author}
        onChange={e => setAuthor(e.target.value as Person)}
        dir="rtl"
        className="bg-zinc-50 border border-zinc-200 text-sm text-zinc-700 rounded-lg
                   px-3 py-2 focus:outline-none focus:border-orange-400 cursor-pointer"
      >
        <option value="">— מי מוסיף? —</option>
        {PEOPLE.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <div className="flex gap-2">
        <button
          onClick={() => text.trim() && author && onSave(text.trim(), author as Person)}
          disabled={!text.trim() || !author}
          className="flex-1 py-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40
                     disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg
                     transition-colors cursor-pointer"
        >
          שמור פתק
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-sm
                     rounded-lg transition-colors cursor-pointer"
        >
          ביטול
        </button>
      </div>
    </div>
  )
}

// ─── Single note card ─────────────────────────────────────────────────────────

function NoteCard({ note, onTogglePin, onSaveEdit, onDelete }: {
  note: Note
  onTogglePin: () => void
  onSaveEdit: (text: string) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(note.text)

  function handleSave() {
    if (!editText.trim()) return
    onSaveEdit(editText.trim())
    setEditing(false)
  }

  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-3 transition-colors shadow-sm ${
      note.pinned
        ? 'border-orange-300 bg-orange-50'
        : 'border-zinc-200 bg-white'
    }`}>
      {/* Top row: pin toggle + edit */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onTogglePin}
          title={note.pinned ? 'הסר פין' : 'הצמד למעלה'}
          className={`text-2xl leading-none transition-all cursor-pointer select-none ${
            note.pinned
              ? 'opacity-100 scale-110'
              : 'opacity-20 hover:opacity-50'
          }`}
        >
          📌
        </button>
        {!editing && (
          <button
            onClick={() => { setEditText(note.text); setEditing(true) }}
            className="text-xs text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer"
          >
            ערוך
          </button>
        )}
      </div>

      {/* Content — view or edit */}
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={3}
            autoFocus
            dir="rtl"
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm
                       rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-orange-400"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!editText.trim()}
              className="flex-1 py-1.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-40
                         text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              שמור
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-sm
                         rounded-lg transition-colors cursor-pointer"
            >
              ביטול
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600
                         text-sm rounded-lg transition-colors cursor-pointer border border-red-200"
            >
              מחק
            </button>
          </div>
        </div>
      ) : (
        <p className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
      )}

      {/* Metadata */}
      <div className="border-t border-zinc-100 pt-2 flex flex-col gap-0.5 text-xs text-zinc-400">
        <span>
          נוסף ע״י{' '}
          <span className="text-zinc-600 font-medium">{note.author}</span>
          {' · '}
          {formatDateTime(note.createdAt)}
        </span>
        {note.editedAt && (
          <span className="text-zinc-400">
            נערך לאחרונה: {formatDateTime(note.editedAt)}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Notes tab ────────────────────────────────────────────────────────────────

export default function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([])
  const [adding, setAdding] = useState(false)

  useEffect(() => { setNotes(loadNotes()) }, [])

  function persist(updated: Note[]) {
    setNotes(updated)
    saveNotes(updated)
  }

  function handleAdd(text: string, author: Person) {
    const note: Note = {
      id: Date.now().toString(),
      text,
      author,
      createdAt: new Date().toISOString(),
      pinned: false,
    }
    persist([...notes, note])
    setAdding(false)
  }

  function handleTogglePin(id: string) {
    persist(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  function handleDelete(id: string) {
    persist(notes.filter(n => n.id !== id))
  }

  function handleSaveEdit(id: string, text: string) {
    persist(notes.map(n => n.id === id
      ? { ...n, text, editedAt: new Date().toISOString() }
      : n
    ))
  }

  const sorted = sortNotes(notes)

  return (
    <div className="flex flex-col gap-4">
      {/* Add button or form */}
      {adding ? (
        <AddNoteForm
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-zinc-300 text-zinc-400
                     text-sm font-medium flex items-center justify-center gap-2
                     hover:border-orange-400 hover:text-orange-500 transition-colors cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
          פתק חדש
        </button>
      )}

      {/* Notes list */}
      {sorted.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">
          <p className="text-4xl mb-3">📝</p>
          <p>אין פתקים עדיין</p>
        </div>
      ) : (
        sorted.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onTogglePin={() => handleTogglePin(note.id)}
            onSaveEdit={text => handleSaveEdit(note.id, text)}
            onDelete={() => handleDelete(note.id)}
          />
        ))
      )}
    </div>
  )
}
