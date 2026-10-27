import { useLayoutEffect } from 'react'

/**
 * Marks <html> as the public portfolio ("site") or the admin panel ("admin") before the page paints.
 * Each area has its own styles (see src/index.css); index.html sets the first value on page load.
 */
export function useArea(area: 'site' | 'admin') {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-area', area)
  }, [area])
}
