import { getItem, removeItem, setItem } from './storage'

const CREDENTIALS_KEY = 'atl_video_admin_credentials_v1'
const SESSION_KEY = 'atl_video_admin_session_v1'
const DEFAULT_EMAIL = 'info@adeebtechlab.com'
const DEFAULT_PASSWORD = 'tech123'
const ITERATIONS = 180_000

type StoredCredentials = { email: string; salt: string; hash: string; iterations: number }

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary)
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
}

async function deriveHash(password: string, salt: Uint8Array, iterations: number) {
  if (!globalThis.crypto?.subtle) throw new Error('Password protection requires a modern browser on HTTPS or localhost.')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new Uint8Array(salt).buffer, iterations, hash: 'SHA-256' }, key, 256)
  return bytesToBase64(new Uint8Array(bits))
}

function readStoredCredentials(): StoredCredentials | null {
  const raw = getItem(CREDENTIALS_KEY)
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as StoredCredentials
    if (value.email && value.salt && value.hash && value.iterations) return value
  } catch {
    /* Invalid saved data falls back to the initial credentials. */
  }
  return null
}

export function currentAdminEmail() {
  return readStoredCredentials()?.email ?? DEFAULT_EMAIL
}

export async function verifyAdminCredentials(email: string, password: string) {
  const stored = readStoredCredentials()
  if (!stored) return normalizeEmail(email) === DEFAULT_EMAIL && password === DEFAULT_PASSWORD
  if (normalizeEmail(email) !== normalizeEmail(stored.email)) return false
  return (await deriveHash(password, base64ToBytes(stored.salt), stored.iterations)) === stored.hash
}

export async function changeAdminCredentials(currentPassword: string, email: string, password: string) {
  const cleanEmail = normalizeEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Enter a valid admin email address.')
  if (password.length < 8) throw new Error('Use a new password with at least 8 characters.')
  if (!(await verifyAdminCredentials(currentAdminEmail(), currentPassword))) throw new Error('Current password is incorrect.')

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const credentials: StoredCredentials = {
    email: cleanEmail,
    salt: bytesToBase64(salt),
    hash: await deriveHash(password, salt, ITERATIONS),
    iterations: ITERATIONS,
  }
  const previous = getItem(CREDENTIALS_KEY)
  if (!setItem(CREDENTIALS_KEY, JSON.stringify(credentials))) {
    if (previous === null) removeItem(CREDENTIALS_KEY)
    else setItem(CREDENTIALS_KEY, previous)
    throw new Error('This browser could not save the updated credentials. Check that site storage is available.')
  }
}

export function startAdminSession() {
  const started = setItem(SESSION_KEY, 'authenticated', 'session')
  if (!started) removeItem(SESSION_KEY, 'session')
  return started
}

export function isAdminAuthenticated() {
  return getItem(SESSION_KEY, 'session') === 'authenticated'
}

export function endAdminSession() {
  removeItem(SESSION_KEY, 'session')
}
