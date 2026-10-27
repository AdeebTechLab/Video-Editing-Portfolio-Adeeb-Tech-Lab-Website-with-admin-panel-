import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * Reveals `.reveal` elements as they scroll into view and returns the id of the section on screen
 * (used to highlight the navigation link).
 */
export function useSectionObserver() {
  const [active, setActive] = useState('home')
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            if (e.target.id) setActive(e.target.id)
          }
        }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal, section[id]').forEach((e) => observer.observe(e))
    return () => observer.disconnect()
  }, [pathname])

  return active
}
