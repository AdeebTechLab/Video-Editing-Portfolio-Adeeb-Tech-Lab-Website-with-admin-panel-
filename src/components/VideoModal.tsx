import { useEffect, useRef, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import type { Video } from '../lib/types'
import { youtubeId } from '../lib/youtube'

export default function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const box = useRef<HTMLDialogElement>(null)
  const [status, setStatus] = useState('Loading video…')
  useEffect(() => {
    const old = document.activeElement as HTMLElement
    box.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      old?.focus()
    }
  }, [])
  let embed = ''
  try {
    const u = new URL(video.videoUrl)
    if (video.videoType === 'youtube') {
      const id = youtubeId(video.videoUrl)
      if (id && /^[\w-]{11}$/.test(id)) embed = `https://www.youtube-nocookie.com/embed/${id}`
    }
    if (video.videoType === 'vimeo') {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) embed = `https://player.vimeo.com/video/${id}`
    }
  } catch {}
  return (
    <dialog
      ref={box}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl border border-line bg-page p-0 text-ink shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-labelledby="video-title"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-accent-text">{video.isDemo ? 'Original motion sample' : 'Portfolio video'}</p>
            <h3 id="video-title" className="mt-1 text-lg font-bold text-ink sm:text-xl">
              {video.title}
            </h3>
          </div>
          <button type="button" className="btn btn-ghost btn-icon shrink-0 border border-line" onClick={onClose} aria-label="Close video">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-black">
          {video.videoType === 'mp4' ? (
            <video
              key={video.id}
              controls
              playsInline
              preload="metadata"
              poster={video.thumbnail || undefined}
              className="h-full w-full"
              onLoadedData={() => setStatus('')}
              onLoadedMetadata={() => setStatus('')}
              onError={() => setStatus('This video could not load. Please contact the studio or try again.')}
            >
              <source src={video.videoUrl} type="video/mp4" />
              <track kind="captions" src="/videos/samples.vtt" srcLang="en" label="English" default />
            </video>
          ) : embed ? (
            <iframe
              src={embed}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={() => setStatus('')}
            />
          ) : (
            <p className="grid h-full place-items-center p-6 text-center text-sm text-white/70">Invalid video link. Please update the portfolio data.</p>
          )}
        </div>
        {status && (
          <p role="status" className="mt-3 text-sm text-ink-faint">
            {status}
          </p>
        )}
        {(video.description || video.isDemo) && (
          <p className="mt-3 text-sm text-ink-muted">
            {video.description}
            {video.isDemo ? ' This is an original website demonstration, not client work.' : ''}
          </p>
        )}
        {video.videoType === 'youtube' && embed && (
          <a className="btn btn-outline btn-sm mt-4" href={video.videoUrl} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </dialog>
  )
}
