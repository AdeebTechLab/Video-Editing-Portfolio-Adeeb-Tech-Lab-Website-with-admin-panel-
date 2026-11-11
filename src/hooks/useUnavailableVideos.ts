import { useEffect, useState } from 'react'
import type { Video } from '../lib/types'
import { youtubeThumbnail } from '../lib/video'
import { youtubeId } from '../lib/youtube'

// YouTube answers a deleted or private video's thumbnail with a 120×90 grey placeholder
// (real hqdefault thumbnails are 480×360), so a small image means the video can't be played.
const PLACEHOLDER_WIDTH = 120
const checked = new Map<string, Promise<boolean>>()

function isUnavailable(id: string) {
  let result = checked.get(id)
  if (!result) {
    result = new Promise<boolean>((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img.naturalWidth <= PLACEHOLDER_WIDTH)
      img.onerror = () => resolve(true)
      img.src = youtubeThumbnail(id)
    })
    checked.set(id, result)
  }
  return result
}

/** Ids of YouTube videos that YouTube reports as unavailable (deleted, private or a wrong link). */
export function useUnavailableVideos(videos: Video[]) {
  const [unavailable, setUnavailable] = useState<ReadonlySet<string>>(new Set())
  const key = videos.map((v) => `${v.id}:${v.videoUrl}`).join('|')

  useEffect(() => {
    let active = true
    const youtube = videos.flatMap((v) => {
      const id = v.videoType === 'youtube' ? youtubeId(v.videoUrl) : null
      return id ? [{ video: v.id, id }] : []
    })
    Promise.all(youtube.map(async ({ video, id }) => ((await isUnavailable(id)) ? video : null))).then((ids) => {
      if (active) setUnavailable(new Set(ids.filter((x): x is string => x !== null)))
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return unavailable
}
