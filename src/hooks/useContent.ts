import { useMemo } from 'react'
import { useSite } from '../store/siteStore'
import { byOrder, sortVideos } from '../lib/utils'

/** Published content for the public website, sorted and with lookup maps. */
export function useContent() {
  const site = useSite()
  return useMemo(() => {
    const categories = [...site.categories].sort(byOrder)
    const categoryById = new Map(categories.map((c) => [c.id, c]))
    /** Published videos in admin order (newest first unless reordered). */
    const videos = site.videos.filter((v) => v.published).sort(byOrder)
    /** Featured first, as in Selected Work. */
    const featuredFirst = sortVideos(videos)
    const services = [...site.services].sort(byOrder)
    const tools = [...site.tools].sort(byOrder).filter((t) => t.showOnSite)
    return { site, settings: site.settings, categories, categoryById, videos, featuredFirst, services, tools }
  }, [site])
}
