import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Video } from '../../lib/types'
import VideoModal from '../VideoModal'

const VideoPlayerContext = createContext<(video: Video) => void>(() => {})

/** Opens a film in the video player dialog from anywhere on the page. */
export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const [video, setVideo] = useState<Video | null>(null)
  const close = useCallback(() => setVideo(null), [])
  return (
    <VideoPlayerContext.Provider value={setVideo}>
      {children}
      {video && <VideoModal video={video} onClose={close} />}
    </VideoPlayerContext.Provider>
  )
}

export const usePlayVideo = () => useContext(VideoPlayerContext)
