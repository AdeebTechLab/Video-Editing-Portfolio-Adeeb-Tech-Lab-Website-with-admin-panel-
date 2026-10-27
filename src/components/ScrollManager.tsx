import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/**
 * Scrolls to the top on page change, or to a section when a link passes
 * `state={{ scrollTo: 'section-id' }}` (works with both normal and preview routing).
 */
export function ScrollManager() {
  const location = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (target) {
      let tries = 0
      const attempt = () => {
        const el = document.getElementById(target)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (tries++ < 20) {
          setTimeout(attempt, 50)
        }
      }
      // Wait a moment so layout changes (like the mobile menu closing) settle first
      const t = setTimeout(attempt, 80)
      return () => clearTimeout(t)
    }
    if (navType !== 'POP') window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.key, location.pathname, location.state, navType])

  return null
}
