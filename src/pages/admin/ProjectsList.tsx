import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Copy, Link2, Pencil, Play, Plus, Search, Star, Trash } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { reorder, useSave } from '../../hooks/useSave'
import { VIDEO_TYPE_LABELS, type Video } from '../../lib/types'
import { byOrder, cn, copyText, uid } from '../../lib/utils'
import { useSite } from '../../store/siteStore'
import { Badge, ConfirmDialog, OrderButtons, PageHeader } from '../../components/admin/ui'
import { VideoPreview } from '../../components/admin/VideoPreview'
import { VideoThumbnail } from '../../components/VideoThumbnail'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'featured', label: 'Featured' },
] as const

export default function ProjectsList() {
  const site = useSite()
  const save = useSave()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const filter = (params.get('filter') ?? 'all') as (typeof FILTERS)[number]['id']
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(params.get('category') ?? '')
  const [toDelete, setToDelete] = useState<Video | null>(null)
  const [preview, setPreview] = useState<Video | null>(null)

  const ordered = useMemo(() => [...site.videos].sort(byOrder), [site.videos])
  const categoryName = (id: string) => site.categories.find((c) => c.id === id)?.name
  const filtered = !(filter === 'all' && !q.trim() && !cat)

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const name = (id: string) => site.categories.find((c) => c.id === id)?.name ?? ''
    return ordered.filter((v) => {
      if (filter === 'published' && !v.published) return false
      if (filter === 'drafts' && v.published) return false
      if (filter === 'featured' && !v.featured) return false
      if (cat && v.categoryId !== cat) return false
      if (term && !`${v.title} ${v.description} ${name(v.categoryId)}`.toLowerCase().includes(term)) return false
      return true
    })
  }, [ordered, filter, q, cat, site.categories])

  const patch = (v: Video, change: Partial<Video>, message: string) =>
    save((d) => ({ ...d, videos: d.videos.map((x) => (x.id === v.id ? { ...x, ...change, updatedAt: Date.now() } : x)) }), message)

  const move = (from: number, to: number) => save((d) => ({ ...d, videos: reorder([...d.videos].sort(byOrder), from, to) }))

  const duplicate = (v: Video) => {
    const now = Date.now()
    const copy: Video = { ...v, id: uid('v'), title: `${v.title} (copy)`, published: false, featured: false, order: site.videos.length + 1, createdAt: now, updatedAt: now }
    save((d) => ({ ...d, videos: [...d.videos, copy] }), `Copied as a draft: “${copy.title}”.`)
  }

  const copyLink = async (v: Video) => {
    const ok = await copyText(v.videoUrl)
    toast(ok ? 'Video link copied.' : 'Copy failed. Open the video and copy its address.', ok ? 'success' : 'error')
  }

  const remove = () => {
    if (!toDelete) return
    if (save((d) => ({ ...d, videos: d.videos.filter((x) => x.id !== toDelete.id).sort(byOrder).map((x, i) => ({ ...x, order: i + 1 })) }), `Deleted “${toDelete.title}”.`)) setToDelete(null)
  }

  const actions = (v: Video) => (
    <div className="flex items-center justify-end gap-0.5">
      <button
        type="button"
        className={cn('btn btn-ghost btn-icon size-9 min-h-9', v.featured && 'text-accent-text')}
        onClick={() => patch(v, { featured: !v.featured }, v.featured ? 'Removed from featured.' : 'Marked as featured.')}
        aria-label={v.featured ? `Remove ${v.title} from featured` : `Feature ${v.title}`}
        aria-pressed={v.featured}
        title={v.featured ? 'Featured (shown first in its category)' : 'Mark as featured'}
      >
        <Star className="size-4" fill={v.featured ? 'currentColor' : 'none'} />
      </button>
      <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9" onClick={() => setPreview(v)} aria-label={`Play ${v.title}`} title="Play preview">
        <Play className="size-4" />
      </button>
      <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9" onClick={() => copyLink(v)} aria-label={`Copy link to ${v.title}`} title="Copy video link">
        <Link2 className="size-4" />
      </button>
      <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9" onClick={() => duplicate(v)} aria-label={`Duplicate ${v.title}`} title="Duplicate">
        <Copy className="size-4" />
      </button>
      <Link to={`/admin/projects/${v.id}`} className="btn btn-ghost btn-icon size-9 min-h-9" aria-label={`Edit ${v.title}`} title="Edit">
        <Pencil className="size-4" />
      </Link>
      <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9 text-danger" onClick={() => setToDelete(v)} aria-label={`Delete ${v.title}`} title="Delete">
        <Trash className="size-4" />
      </button>
    </div>
  )

  const toggle = (v: Video) => (
    <button
      type="button"
      role="switch"
      aria-checked={v.published}
      aria-label={v.published ? `Unpublish ${v.title}` : `Publish ${v.title}`}
      onClick={() => patch(v, { published: !v.published }, v.published ? 'Moved to drafts.' : 'Published.')}
      className="flex items-center gap-2 text-xs font-semibold text-ink-muted"
    >
      <span className={cn('relative h-6 w-10 rounded-full border transition-colors', v.published ? 'border-accent bg-accent' : 'border-line-strong bg-surface-2')}>
        <span className={cn('absolute left-0 top-0.5 size-[18px] rounded-full bg-white shadow transition-transform', v.published ? 'translate-x-[18px]' : 'translate-x-0.5')} />
      </span>
      {v.published ? 'Published' : 'Draft'}
    </button>
  )

  return (
    <>
      <PageHeader
        title="Video projects"
        description="Add, edit and remove the videos in Selected Work. Use the arrows to change the order; the first video of each category appears under All Projects, and featured videos are shown first in their category."
        actions={
          <Link to="/admin/projects/new" className="btn btn-primary">
            <Plus className="size-4" aria-hidden="true" />
            Add video
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-line p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setParams(f.id === 'all' ? {} : { filter: f.id }, { replace: true })}
              className={cn('shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold', filter === f.id ? 'bg-accent text-on-accent' : 'text-ink-muted hover:text-ink')}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="relative flex-1">
          <span className="sr-only">Search videos</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <input className="input pl-9" type="search" placeholder="Search videos" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select className="input lg:w-60" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {[...site.categories].sort(byOrder).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
          <p className="font-bold text-ink">{site.videos.length === 0 ? 'No videos yet' : 'No videos match these filters'}</p>
          <p className="text-sm text-ink-muted">{site.videos.length === 0 ? 'Add your first video to show it in Selected Work.' : 'Try another filter or clear the search.'}</p>
          <Link to="/admin/projects/new" className="btn btn-primary mt-2">
            Add video
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((v) => {
            const index = ordered.findIndex((x) => x.id === v.id)
            const category = categoryName(v.categoryId)
            return (
              <li key={v.id} className="card flex flex-col gap-3 p-3 sm:p-4 md:flex-row md:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {!filtered && <OrderButtons index={index} count={ordered.length} onMove={move} label={v.title} />}
                  <Link to={`/admin/projects/${v.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="aspect-video w-24 shrink-0 overflow-hidden rounded-lg border border-line">
                      <VideoThumbnail video={v} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink hover:text-accent-text">{v.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
                        {category ? <span className="truncate">{category}</span> : <Badge tone="danger">No category</Badge>}
                        <Badge>{VIDEO_TYPE_LABELS[v.videoType]}</Badge>
                        {v.isDemo && <Badge tone="accent">Original sample</Badge>}
                        {v.featured && <Badge tone="info">Featured</Badge>}
                      </span>
                    </span>
                  </Link>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-line pt-3 md:border-0 md:pt-0">
                  {toggle(v)}
                  {actions(v)}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {filtered && list.length > 0 && <p className="mt-3 text-xs text-ink-faint">Clear the filters to change the order.</p>}

      {toDelete && (
        <ConfirmDialog
          title="Delete this video?"
          message={
            <>
              <span className="font-semibold text-ink">{toDelete.title}</span> will be removed. To hide it instead, move it to drafts.
            </>
          }
          confirmLabel="Delete video"
          onConfirm={remove}
          onCancel={() => setToDelete(null)}
        />
      )}
      {preview && <VideoPreview video={preview} onClose={() => setPreview(null)} />}
    </>
  )
}
