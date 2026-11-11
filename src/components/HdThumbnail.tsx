import { useState, type ImgHTMLAttributes } from 'react'
import { youtubeHdThumbnail } from '../lib/video'

// YouTube answers a missing size with a 120×90 grey placeholder instead of an error.
const PLACEHOLDER_WIDTH = 120

/**
 * A video thumbnail shown at the best quality available: automatic YouTube thumbnails load in full HD,
 * falling back to the stored thumbnail when the video has no HD version. Other images are shown as they are.
 */
export function HdThumbnail({ src, ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src: string }) {
  const hd = youtubeHdThumbnail(src)
  const [failed, setFailed] = useState<string | null>(null)
  const useHd = hd !== null && failed !== hd

  return (
    <img
      {...props}
      src={useHd ? hd : src}
      decoding="async"
      onLoad={(e) => {
        if (useHd && e.currentTarget.naturalWidth <= PLACEHOLDER_WIDTH) setFailed(hd)
        props.onLoad?.(e)
      }}
      onError={(e) => {
        if (useHd) setFailed(hd)
        else props.onError?.(e)
      }}
    />
  )
}
