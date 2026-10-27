// All website content lives here.
//
// - The published content is src/data/site-data.json. It is built into the site, so every visitor sees it.
// - The admin panel saves changes in this browser (localStorage). Those changes show only in this browser
//   until you download the publish file, replace src/data/site-data.json with it, and redeploy.
import { useSyncExternalStore } from 'react'
import publishedJson from '../data/site-data.json'
import type { SiteData } from '../lib/types'
import { canonicalJson } from '../lib/utils'
import { normalizeSiteData } from './normalize'

const KEY = 'atl-video-data-v1'
/** The published file's date when this browser started editing, to spot newer published versions. */
const BASE_KEY = 'atl-video-data-base'
/** Typical browser limit for localStorage on one site. */
export const STORAGE_LIMIT = 5 * 1024 * 1024

const PUBLISHED: SiteData = normalizeSiteData(publishedJson)

function readLocal(): SiteData | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    return normalizeSiteData(JSON.parse(raw), PUBLISHED)
  } catch {
    return null
  }
}

function readBase() {
  try {
    return Number(window.localStorage.getItem(BASE_KEY) || 0)
  } catch {
    return 0
  }
}

function strip(d: SiteData) {
  return { ...d, updatedAt: 0 }
}

/** True when the content is different from the published file. */
export function differsFromPublished(data: SiteData) {
  return canonicalJson(strip(data)) !== canonicalJson(strip(PUBLISHED))
}

let state: SiteData = readLocal() ?? PUBLISHED
// After you publish and redeploy, this browser's copy matches the file, so it is no longer needed.
if (state !== PUBLISHED && !differsFromPublished(state)) {
  try {
    window.localStorage.removeItem(KEY)
    window.localStorage.removeItem(BASE_KEY)
  } catch {
    /* ignore */
  }
  state = PUBLISHED
}
let hasLocal = state !== PUBLISHED
let storageWorks = true
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

// Keep other open tabs (for example the website preview) in sync with the admin panel.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return
    const next = readLocal()
    state = next ?? PUBLISHED
    hasLocal = !!next
    emit()
  })
}

export function useSite(): SiteData {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

export function useHasLocalChanges(): boolean {
  return useSyncExternalStore(subscribe, () => hasLocal, () => hasLocal)
}

export function getSite() {
  return state
}

export function getPublished() {
  return PUBLISHED
}

export function isStoragePersistent() {
  return storageWorks
}

export type SaveResult = { ok: true } | { ok: false; error: string }

function write(next: SiteData): SaveResult {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
    if (!hasLocal) window.localStorage.setItem(BASE_KEY, String(PUBLISHED.updatedAt))
    storageWorks = true
  } catch (err) {
    const quota = err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)
    if (quota) {
      return {
        ok: false,
        error: 'Browser storage is full, so this change was not saved. Remove some uploaded images, or use image links instead of uploads.',
      }
    }
    // Storage blocked (for example private browsing): keep the change for this visit only.
    storageWorks = false
  }
  state = next
  hasLocal = true
  emit()
  return { ok: true }
}

/** Apply a change to the content and save it in this browser. */
export function updateSite(change: (current: SiteData) => SiteData): SaveResult {
  const next = change(state)
  return write({ ...next, updatedAt: Date.now() })
}

/** Replace everything (used by import / restore). */
export function replaceSite(data: SiteData): SaveResult {
  return write({ ...data, updatedAt: Date.now() })
}

/** Throw away this browser's changes and go back to the published content. */
export function discardLocalChanges() {
  try {
    window.localStorage.removeItem(KEY)
    window.localStorage.removeItem(BASE_KEY)
  } catch {
    /* ignore */
  }
  state = PUBLISHED
  hasLocal = false
  emit()
}

/** True when a newer publish file was deployed after this browser started editing. */
export function publishedIsNewer() {
  return hasLocal && PUBLISHED.updatedAt > readBase()
}

/** The content prepared for publishing (optionally without draft videos). */
export function publishData(includeDrafts: boolean): SiteData {
  const data = { ...state, updatedAt: Date.now() }
  return includeDrafts ? data : { ...data, videos: data.videos.filter((v) => v.published) }
}

export function storageUsed(data: SiteData = state) {
  // localStorage keeps text as UTF-16, about 2 bytes per character
  return (JSON.stringify(data).length + KEY.length) * 2
}
