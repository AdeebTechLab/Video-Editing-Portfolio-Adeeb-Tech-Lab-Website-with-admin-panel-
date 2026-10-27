import type { VideoType } from './types'
import { safeUrl } from './utils'
import { youtubeId } from './youtube'

export function vimeoId(value: string): string | null {
  try {
    const url = new URL(value.trim())
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null
    const id = url.pathname.split('/').filter(Boolean).pop()
    return id && /^\d+$/.test(id) ? id : null
  } catch {
    return null
  }
}

export function youtubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export type ParsedVideo = { ok: true; type: VideoType; url: string; thumbnail: string } | { ok: false; error: string }

/**
 * Checks a video link and returns the address the player uses.
 * YouTube links (watch, youtu.be, Shorts, live, embed) are stored as normal watch links with an automatic thumbnail.
 */
export function parseVideoLink(value: string): ParsedVideo {
  const raw = value.trim()
  if (!raw) return { ok: false, error: 'Paste a YouTube or Vimeo link, or the path to an MP4 file.' }
  const yt = youtubeId(raw)
  if (yt) return { ok: true, type: 'youtube', url: `https://www.youtube.com/watch?v=${yt}`, thumbnail: youtubeThumbnail(yt) }
  const vm = vimeoId(raw)
  if (vm) return { ok: true, type: 'vimeo', url: `https://vimeo.com/${vm}`, thumbnail: '' }
  const url = safeUrl(raw)
  if (url && /\.mp4(\?.*)?$/i.test(url)) return { ok: true, type: 'mp4', url, thumbnail: '' }
  if (/youtu\.?be/i.test(raw)) return { ok: false, error: 'Use a valid YouTube video, Shorts or share link.' }
  if (/vimeo/i.test(raw)) return { ok: false, error: 'Use a Vimeo link that ends with the video number, for example https://vimeo.com/123456789.' }
  return { ok: false, error: 'Use a YouTube or Vimeo link, or an MP4 file such as /videos/my-film.mp4.' }
}
