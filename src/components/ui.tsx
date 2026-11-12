import type { ReactNode } from 'react'
import { Link } from 'react-router'

/** Section title with an optional intro line and an optional item on the right (for example a button). */
export function SectionHeading({ title, text, aside }: { title: string; text?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 text-ink-muted">{text}</p>}
      </div>
      {aside}
    </div>
  )
}

/** A link to a section of the home page that also works from other pages (for example the 404 page). */
export function SectionLink({ section, className, children, onClick }: { section: string; className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <Link to="/" state={{ scrollTo: section }} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
