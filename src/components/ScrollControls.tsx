import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/** Reading-progress bar along the top of the page and a back-to-top button. */
export function ScrollControls() {
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0)
      setShowTop(window.scrollY > 420)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" role="progressbar" aria-label="Page scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="h-full bg-accent transition-[width] duration-100 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      </div>
      {showTop && (
        <button
          type="button"
          className="btn btn-icon fixed bottom-6 left-4 z-40 rounded-full border border-line bg-surface text-ink shadow-[var(--shadow)] transition hover:-translate-y-1 hover:border-accent hover:text-accent-text sm:left-6"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      )}
    </>
  )
}
