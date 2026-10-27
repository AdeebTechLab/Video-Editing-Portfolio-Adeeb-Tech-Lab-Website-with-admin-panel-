import { useCallback } from 'react'
import { useToast } from '../context/ToastContext'
import type { SiteData } from '../lib/types'
import { updateSite } from '../store/siteStore'

/** Saves a change and shows a message. Returns true when it was saved. */
export function useSave() {
  const toast = useToast()
  return useCallback(
    (change: (d: SiteData) => SiteData, message?: string) => {
      const result = updateSite(change)
      if (!result.ok) {
        toast(result.error, 'error')
        return false
      }
      if (message) toast(message)
      return true
    },
    [toast],
  )
}

/** Moves an item in a list and renumbers `order` from 1. */
export function reorder<T extends { order: number }>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item!)
  return next.map((x, i) => ({ ...x, order: i + 1 }))
}
