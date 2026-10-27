import { useEffect, useRef } from 'react'
import { ExternalLink, X } from 'lucide-react'
import type { Video } from '../../lib/types'
import { VIDEO_TYPE_LABELS } from '../../lib/types'
import { vimeoId } from '../../lib/video'
import { youtubeId } from '../../lib/youtube'

/** Plays a video inside the admin panel, the way visitors will see it. */
export function VideoPreview({ video, onClose }: { video: Pick<Video, 'title' | 'videoUrl' | 'videoType' | 'thumbnail'>; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      prev?.focus()
    }
  }, [])

  let embed = ''
  if (video.videoType === 'youtube') {
    const id = youtubeId(video.videoUrl)
    if (id) embed = `https://www.youtube-nocookie.com/embed/${id}`
  } else if (video.videoType === 'vimeo') {
    const id = vimeoId(video.videoUrl)
    if (id) embed = `https://player.vimeo.com/video/${id}`
  }

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Preview: ${video.title}`}
        className="w-full max-w-3xl rounded-t-2xl border border-line bg-surface p-4 shadow-[var(--shadow)] sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-text">{VIDEO_TYPE_LABELS[video.videoType]} preview</p>
            <h2 className="truncate text-lg font-bold text-ink">{video.title || 'Untitled video'}</h2>
          </div>
          <button type="button" onClick={onClose} className="-m-2 rounded-lg p-2 text-ink-faint hover:text-ink" aria-label="Close preview">
            <X className="size-5" />
          </button>
        </div>
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          {video.videoType === 'mp4' ? (
            <video src={video.videoUrl} poster={video.thumbnail || undefined} controls playsInline preload="metadata" className="h-full w-full" />
          ) : embed ? (
            <iframe
              src={embed}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <p className="grid h-full place-items-center p-6 text-center text-sm text-white/80">This link can’t be played. Check the video link.</p>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>Videos must be public or unlisted and allow embedding.</p>
          {video.videoType !== 'mp4' && (
            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-accent-text hover:underline">
              Open on {VIDEO_TYPE_LABELS[video.videoType]} <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
