import { useEffect, useState } from 'react'

/** Small label that follows the pointer over elements with a `data-cursor` attribute (for example VIEW or DRAG). */
export function CinemaCursor() {
  const [cursor, setCursor] = useState({ x: 0, y: 0, label: '' })

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]')
      setCursor({
        x: e.clientX,
        y: e.clientY,
        label: el?.getAttribute('data-cursor') || '',
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <div className={`cinema-cursor ${cursor.label ? 'shown' : ''}`} style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }}>
      {cursor.label}
    </div>
  )
}
