import type { Video } from './types'

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function uid(prefix = '') {
  const raw =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
  return prefix ? `${prefix}-${raw}` : raw
}

export function formatDateTime(ms: number) {
  if (!ms) return ''
  return new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function whatsappLink(number: string, message?: string) {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      el.remove()
      return ok
    } catch {
      return false
    }
  }
}

/** Accepts full links, bare domains (adds https://) and site paths like /images/shot.png. */
export function safeUrl(url: string) {
  const u = url.trim()
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  if (/^\/[^/]/.test(u)) return u
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(u)) return `https://${u}`
  return ''
}

/** Accepts #abc or #aabbcc colours. */
export function isHexColor(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}

/** #abc → #aabbcc, lowercase (the website adds transparency to the end of the colour). */
export function normalizeHex(value: string) {
  const v = value.trim().toLowerCase()
  return /^#[0-9a-f]{3}$/.test(v) ? `#${[...v.slice(1)].map((c) => c + c).join('')}` : v
}

export function byOrder<T extends { order: number }>(a: T, b: T) {
  return a.order - b.order
}

/** Featured videos first (as on the website), keeping the admin order otherwise. */
export function sortVideos(list: Video[]) {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.order - b.order
  })
}

/** JSON with sorted keys, so two objects with the same data compare equal. */
export function canonicalJson(value: unknown): string {
  const sort = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sort)
    if (v && typeof v === 'object') {
      return Object.keys(v as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, k) => {
          const val = (v as Record<string, unknown>)[k]
          if (val !== undefined) acc[k] = sort(val)
          return acc
        }, {})
    }
    return v
  }
  return JSON.stringify(sort(value))
}

export function downloadFile(name: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
