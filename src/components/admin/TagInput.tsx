import { useState } from 'react'
import { X } from 'lucide-react'

/** Type a value and press Enter or comma to add it. */
export function TagInput({
  id,
  value,
  onChange,
  placeholder,
  suggestions = [],
}: {
  id: string
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  suggestions?: string[]
}) {
  const [text, setText] = useState('')

  const add = (raw: string) => {
    const items = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (!items.length) return
    const next = [...value]
    items.forEach((i) => {
      if (!next.some((x) => x.toLowerCase() === i.toLowerCase())) next.push(i)
    })
    onChange(next)
    setText('')
  }

  return (
    <div className="input flex min-h-11 flex-wrap items-center gap-1.5 py-1.5 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--accent-soft)]">
      {value.map((t) => (
        <span key={t} className="chip gap-1 py-1 pr-1.5">
          {t}
          <button type="button" className="rounded-full p-0.5 hover:bg-line hover:text-ink" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        list={suggestions.length ? `${id}-list` : undefined}
        className="min-w-32 flex-1 bg-transparent py-1 text-[0.95rem] text-ink outline-none placeholder:text-ink-faint"
        value={text}
        placeholder={value.length ? '' : placeholder}
        onChange={(e) => {
          const v = e.target.value
          if (v.includes(',')) add(v)
          else setText(v)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add(text)
          } else if (e.key === 'Backspace' && !text && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={() => add(text)}
      />
      {suggestions.length > 0 && (
        <datalist id={`${id}-list`}>
          {suggestions
            .filter((sug) => !value.some((v) => v.toLowerCase() === sug.toLowerCase()))
            .map((sug) => (
              <option key={sug} value={sug} />
            ))}
        </datalist>
      )}
    </div>
  )
}
