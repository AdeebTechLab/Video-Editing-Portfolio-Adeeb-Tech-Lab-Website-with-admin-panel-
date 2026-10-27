// Browser storage that never throws (private mode, blocked storage, previews).
const memory = new Map<string, string>()

function store(kind: 'local' | 'session'): Storage | null {
  try {
    const s = kind === 'local' ? window.localStorage : window.sessionStorage
    const k = '__atl_probe__'
    s.setItem(k, '1')
    s.removeItem(k)
    return s
  } catch {
    return null
  }
}

export function getItem(key: string, kind: 'local' | 'session' = 'local'): string | null {
  const s = store(kind)
  if (s) {
    try {
      return s.getItem(key)
    } catch {
      /* fall through */
    }
  }
  return memory.get(`${kind}:${key}`) ?? null
}

/** Returns false when the value could only be kept in memory (e.g. storage full). */
export function setItem(key: string, value: string, kind: 'local' | 'session' = 'local'): boolean {
  memory.set(`${kind}:${key}`, value)
  const s = store(kind)
  if (!s) return false
  try {
    s.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeItem(key: string, kind: 'local' | 'session' = 'local') {
  memory.delete(`${kind}:${key}`)
  try {
    store(kind)?.removeItem(key)
  } catch {
    /* ignore */
  }
}
