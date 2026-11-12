import { useEffect, useState } from 'react'

/** Types and deletes a list of words, like the tagline on adeebtechlab.com. */
export function TypedWords({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced || words.length === 0) return
    const word = words[index % words.length]!
    let delay = deleting ? 40 : 85
    if (!deleting && text === word) delay = 1600
    if (deleting && text === '') delay = 250

    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, words, reduced])

  if (reduced) return <span className={className}>{words.join(', ')}</span>

  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">
        {text}
        <span className="type-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-current" />
      </span>
    </span>
  )
}
