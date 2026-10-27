import { useState } from 'react'
import { Film, Play } from 'lucide-react'
import type { Video } from '../lib/types'
import { cn } from '../lib/utils'

/** The poster of a video for admin lists: its thumbnail, or a film icon when there is none. */
export function VideoThumbnail({ video, className, play = false }: { video: Pick<Video, 'title' | 'thumbnail'>; className?: string; play?: boolean }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={cn('relative grid h-full w-full place-items-center overflow-hidden bg-page-deep', className)}>
      {video.thumbnail && !failed ? (
        <img src={video.thumbnail} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <Film className="size-1/3 max-h-8 max-w-8 text-ink-faint" aria-hidden="true" />
      )}
      {play && (
        <span className="absolute bottom-1.5 left-1.5 grid size-6 place-items-center rounded-full bg-black/70 text-white">
          <Play className="size-3" fill="currentColor" aria-hidden="true" />
        </span>
      )}
    </span>
  )
}
