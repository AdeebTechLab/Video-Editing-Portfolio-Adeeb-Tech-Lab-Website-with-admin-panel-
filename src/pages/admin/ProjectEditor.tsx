import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ArrowUpRight, Play, Trash } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { useSave } from '../../hooks/useSave'
import { VIDEO_TYPE_LABELS, type Category, type Video } from '../../lib/types'
import { byOrder, canonicalJson, uid } from '../../lib/utils'
import { parseVideoLink, youtubeThumbnail } from '../../lib/video'
import { youtubeId } from '../../lib/youtube'
import { useSite } from '../../store/siteStore'
import { WideImageInput } from '../../components/admin/ImageInputs'
import { ConfirmDialog, Field, Panel, Switch } from '../../components/admin/ui'
import { VideoPreview } from '../../components/admin/VideoPreview'
import { VideoThumbnail } from '../../components/VideoThumbnail'

type Draft = Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'order'>

const NEW_CATEGORY = '__new'

const EMPTY: Draft = {
  title: '',
  description: '',
  categoryId: '',
  videoUrl: '',
  videoType: 'youtube',
  thumbnail: '',
  duration: '',
  featured: false,
  published: false,
  isDemo: false,
}

function toDraft(v: Video): Draft {
  const copy: Partial<Video> = { ...v }
  delete copy.id
  delete copy.createdAt
  delete copy.updatedAt
  delete copy.order
  return copy as Draft
}

type Errors = Partial<Record<'videoUrl' | 'title' | 'description' | 'category' | 'thumbnail' | 'duration', string>>

export default function ProjectEditor() {
  const { id } = useParams()
  const site = useSite()
  const video = id ? site.videos.find((v) => v.id === id) : null
  if (id && !video) {
    return (
      <div className="card mx-auto max-w-lg px-6 py-12 text-center">
        <h1 className="text-2xl font-extrabold text-ink">Video not found</h1>
        <p className="mt-2 text-sm text-ink-muted">It may have been deleted. Go back to the video list.</p>
        <Link to="/admin/projects" className="btn btn-primary mt-6">
          Video projects
        </Link>
      </div>
    )
  }
  return <Editor key={id ?? 'new'} video={video ?? null} />
}

function Editor({ video }: { video: Video | null }) {
  const site = useSite()
  const save = useSave()
  const toast = useToast()
  const navigate = useNavigate()
  const categories = useMemo(() => [...site.categories].sort(byOrder), [site.categories])

  const initial = useMemo(() => (video ? toDraft(video) : { ...EMPTY }), [video])
  const [form, setForm] = useState<Draft>(initial)
  const [newCategory, setNewCategory] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [preview, setPreview] = useState(false)
  const saved = useRef(canonicalJson(initial))

  const dirty = canonicalJson(form) !== saved.current || (form.categoryId === NEW_CATEGORY && !!newCategory.trim())

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  /** Clears a field's error as soon as it is edited. */
  const clearError = (key: keyof Errors) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    clearError(key === 'categoryId' ? 'category' : (key as keyof Errors))
    setForm((f) => ({ ...f, [key]: value }))
  }

  const link = parseVideoLink(form.videoUrl)
  const ytId = youtubeId(form.videoUrl)
  const autoThumb = ytId ? youtubeThumbnail(ytId) : ''
  /** The poster visitors will see: your own image, or YouTube's when there is none. */
  const shownThumbnail = form.thumbnail || autoThumb

  // A YouTube thumbnail that belonged to the previous link follows the new link.
  const onLink = (value: string) => {
    clearError('videoUrl')
    clearError('thumbnail')
    setForm((f) => {
      const before = youtubeId(f.videoUrl)
      const after = youtubeId(value)
      const followed = before && f.thumbnail === youtubeThumbnail(before)
      return { ...f, videoUrl: value, thumbnail: followed ? (after ? youtubeThumbnail(after) : '') : f.thumbnail }
    })
  }

  const existingCategory = (name: string) => categories.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase())

  const validate = (d: Draft): Errors => {
    const e: Errors = {}
    const parsed = parseVideoLink(d.videoUrl)
    if (!parsed.ok) e.videoUrl = parsed.error
    else if (site.videos.some((v) => v.id !== video?.id && v.videoUrl === parsed.url)) e.videoUrl = 'This video is already in your portfolio.'
    if (!d.title.trim()) e.title = 'Add a title.'
    else if (d.title.trim().length > 160) e.title = 'Keep the title under 160 characters.'
    if (!d.description.trim()) e.description = 'Add a short description. It appears on the video card and in the player.'
    else if (d.description.trim().length > 2000) e.description = 'Keep the description under 2000 characters.'
    if (d.categoryId === NEW_CATEGORY) {
      const name = newCategory.trim().replace(/\s+/g, ' ')
      if (!name) e.category = 'Name the new category.'
      else if (name.length > 60) e.category = 'Keep the category name under 60 characters.'
      else if (name.toLowerCase() === 'all projects') e.category = '“All Projects” is reserved for the filter that shows everything.'
    } else if (!categories.some((c) => c.id === d.categoryId)) e.category = 'Choose a category.'
    if (parsed.ok && parsed.type !== 'youtube' && !d.thumbnail) e.thumbnail = 'Add a thumbnail image. Only YouTube videos get one automatically.'
    if (d.duration.trim().length > 12) e.duration = 'Use a short duration such as 2:45.'
    return e
  }

  const submit = (overrides: Partial<Draft> = {}, message = 'Changes saved.'): Video | null => {
    const data: Draft = { ...form, ...overrides }
    const e = validate(data)
    setErrors(e)
    if (Object.keys(e).length) {
      toast('Some fields need attention before saving.', 'error')
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus()
      return null
    }
    const parsed = parseVideoLink(data.videoUrl)
    if (!parsed.ok) return null

    // A new category is created together with the video (or an existing one with the same name is used).
    let category: Category | null = null
    let categoryId = data.categoryId
    if (categoryId === NEW_CATEGORY) {
      const name = newCategory.trim().replace(/\s+/g, ' ')
      const match = existingCategory(name)
      if (match) categoryId = match.id
      else {
        category = { id: uid('cat'), name, order: site.categories.length + 1 }
        categoryId = category.id
      }
    }

    const clean: Draft = {
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
      categoryId,
      videoUrl: parsed.url,
      videoType: parsed.type,
      thumbnail: data.thumbnail || parsed.thumbnail,
      duration: data.duration.trim(),
    }
    const now = Date.now()
    const result: Video = video ? { ...video, ...clean, updatedAt: now } : { ...clean, id: uid('v'), order: 0, createdAt: now, updatedAt: now }
    const ok = save(
      (d) => ({
        ...d,
        categories: category ? [...d.categories, category] : d.categories,
        // New videos go first, so they become the latest video of their category.
        videos: video ? d.videos.map((v) => (v.id === video.id ? result : v)) : [result, ...[...d.videos].sort(byOrder)].map((v, i) => ({ ...v, order: i + 1 })),
      }),
      message,
    )
    if (!ok) return null
    saved.current = canonicalJson(toDraft(result))
    setForm(toDraft(result))
    setNewCategory('')
    if (!video) navigate(`/admin/projects/${result.id}`, { replace: true })
    return result
  }

  const remove = () => {
    if (!video) return
    saved.current = canonicalJson(form)
    if (save((d) => ({ ...d, videos: d.videos.filter((v) => v.id !== video.id).sort(byOrder).map((v, i) => ({ ...v, order: i + 1 })) }), `Deleted “${video.title}”.`)) {
      navigate('/admin/projects', { replace: true })
    }
  }

  const categoryName = form.categoryId === NEW_CATEGORY ? newCategory.trim() || 'New category' : categories.find((c) => c.id === form.categoryId)?.name ?? 'Category'

  const actionButtons = (
    <>
      {form.published ? (
        <>
          <button type="button" className="btn btn-primary w-full" onClick={() => submit()}>
            Save changes
          </button>
          <button type="button" className="btn btn-outline w-full" onClick={() => submit({ published: false }, 'Moved to drafts.')}>
            Move to drafts
          </button>
        </>
      ) : (
        <>
          <button type="button" className="btn btn-primary w-full" onClick={() => submit({ published: true }, 'Published. Visitors will see it after you publish the site.')}>
            Publish
          </button>
          <button type="button" className="btn btn-outline w-full" onClick={() => submit({ published: false }, 'Draft saved.')}>
            Save draft
          </button>
        </>
      )}
      <button
        type="button"
        className="btn btn-ghost w-full max-sm:border max-sm:border-line"
        onClick={() => (link.ok ? setPreview(true) : toast('Add a valid video link to play the preview.', 'info'))}
        title="Play preview"
      >
        <Play className="size-4" aria-hidden="true" />
        <span className="max-sm:sr-only">Play preview</span>
      </button>
    </>
  )

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link to="/admin/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Video projects
          </Link>
          <h1 className="mt-2 break-words text-2xl font-extrabold text-ink sm:text-3xl">{video ? `Edit: ${video.title}` : 'Add a video'}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Fields marked <span className="text-accent-text">*</span> are required. Everything else is optional.
          </p>
        </div>
        {dirty && <span className="self-start rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-text sm:self-center">Unsaved changes</span>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <Panel title="Video" description="Paste a YouTube link (watch, Shorts or share link), a Vimeo link, or the path to an MP4 file in public/videos.">
            <Field
              label="Video link"
              required
              htmlFor="f-videoUrl"
              error={errors.videoUrl}
              hint={
                form.videoUrl.trim() ? (
                  link.ok ? (
                    <span className="text-success">{VIDEO_TYPE_LABELS[link.type]} video recognised.</span>
                  ) : (
                    <span className="text-danger">{link.error}</span>
                  )
                ) : (
                  'YouTube and Vimeo videos must be public or unlisted and allow embedding.'
                )
              }
            >
              <input id="f-videoUrl" className="input" inputMode="url" value={form.videoUrl} onChange={(e) => onLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
            </Field>
          </Panel>

          <Panel title="Details">
            <Field label="Title" required htmlFor="f-title" error={errors.title} counter={{ value: form.title.length, max: 160 }}>
              <input id="f-title" className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Give your video a title" />
            </Field>
            <Field label="Description" required htmlFor="f-description" error={errors.description} counter={{ value: form.description.length, max: 2000 }} hint="Shown on the video card and under the player.">
              <textarea id="f-description" className="input min-h-28" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Tell visitors about this project" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Category"
                required
                htmlFor="f-category"
                error={errors.category}
                hint={
                  <>
                    Categories are the filters in Selected Work. Manage them under{' '}
                    <Link to="/admin/categories" className="font-semibold text-accent-text">
                      Categories
                    </Link>
                    .
                  </>
                }
              >
                <select id="f-category" className="input" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                  <option value="">Choose a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value={NEW_CATEGORY}>+ New category…</option>
                </select>
              </Field>
              <Field label="Duration" htmlFor="f-duration" error={errors.duration} hint="Shown on the thumbnail, for example 2:45.">
                <input id="f-duration" className="input" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="2:45" />
              </Field>
            </div>
            {form.categoryId === NEW_CATEGORY && (
              <Field label="New category name" required htmlFor="f-newCategory" hint="It is created when you save this video.">
                <input id="f-newCategory" className="input" value={newCategory} onChange={(e) => { setNewCategory(e.target.value); clearError('category') }} placeholder="Wedding films" autoFocus />
              </Field>
            )}
          </Panel>

          <Panel title="Thumbnail" description="YouTube videos use their own thumbnail automatically. Upload or link an image to use your own; a 16:9 picture works best.">
            <Field label="Thumbnail image" htmlFor="f-thumbnail" error={errors.thumbnail}>
              {form.thumbnail ? (
                <WideImageInput
                  value={form.thumbnail}
                  onChange={(v) => set('thumbnail', v)}
                  label="thumbnail"
                  onReset={autoThumb && form.thumbnail !== autoThumb ? () => set('thumbnail', autoThumb) : undefined}
                  resetLabel="Use the YouTube thumbnail"
                />
              ) : (
                <div className="space-y-3" id="f-thumbnail" tabIndex={-1}>
                  {autoThumb && (
                    <div className="flex items-center gap-4 rounded-xl border border-line bg-page-deep p-3">
                      <span className="aspect-video w-32 shrink-0 overflow-hidden rounded-lg">
                        <VideoThumbnail video={{ title: form.title, thumbnail: autoThumb }} />
                      </span>
                      <p className="text-sm text-ink-muted">Using the YouTube thumbnail. Add an image below to replace it.</p>
                    </div>
                  )}
                  <WideImageInput value="" onChange={(v) => set('thumbnail', v)} label="thumbnail" />
                </div>
              )}
            </Field>
          </Panel>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Panel title="Publishing">
            <div className="rounded-xl border border-line bg-page-deep px-4 py-3 text-sm text-ink">
              {form.published ? (
                <p>
                  <span className="font-semibold text-success">Published.</span> Shown in Selected Work.
                </p>
              ) : (
                <p>
                  <span className="font-semibold">Draft.</span> Hidden from visitors.
                </p>
              )}
            </div>
            <Switch checked={form.featured} onChange={(v) => set('featured', v)} label="Featured" description="Shown first when visitors filter by its category." />
            <Switch checked={form.isDemo} onChange={(v) => set('isDemo', v)} label="Original sample" description="Labels the video as an original sample instead of client work." />
            <div className="hidden flex-col gap-2 xl:flex">{actionButtons}</div>
          </Panel>
          <div className="hidden xl:block">
            <p className="mb-2 text-xs font-semibold text-ink-faint">Card preview</p>
            <div className="overflow-hidden rounded-2xl border border-line bg-[#08090d] text-white">
              <div className="relative aspect-video">
                <VideoThumbnail video={{ title: form.title, thumbnail: shownThumbnail }} />
                <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[9px] font-semibold tracking-widest">
                  {form.isDemo ? 'ORIGINAL SAMPLE' : `${link.ok ? VIDEO_TYPE_LABELS[link.type].toUpperCase().replace('MP4 FILE', 'MP4') : 'YOUTUBE'} VIDEO`}
                </span>
                <span className="absolute bottom-3 left-3 grid size-10 place-items-center rounded-full bg-[#ff6a00] text-black">
                  <Play className="size-4" fill="currentColor" aria-hidden="true" />
                </span>
                {form.duration.trim() && <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-[10px]">{form.duration.trim()}</span>}
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-[#ff6a00]">{categoryName}</p>
                  <h3 className="mt-1 line-clamp-2 font-semibold">{form.title || 'Your video title'}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-white/60">{form.description || 'Your description appears here.'}</p>
                </div>
                <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>
          {video && (
            <button type="button" className="btn btn-ghost w-full text-danger" onClick={() => setConfirmDelete(true)}>
              <Trash className="size-4" aria-hidden="true" />
              Delete this video
            </button>
          )}
        </aside>
      </div>

      <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-line bg-page/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 xl:hidden">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:grid-cols-3 [&_.btn]:px-3 [&_.btn]:text-sm">{actionButtons}</div>
      </div>

      {confirmDelete && video && (
        <ConfirmDialog
          title="Delete this video?"
          message={
            <>
              <span className="font-semibold text-ink">{video.title}</span> will be removed.
            </>
          }
          confirmLabel="Delete video"
          onConfirm={remove}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {preview && link.ok && <VideoPreview video={{ title: form.title, videoUrl: link.url, videoType: link.type, thumbnail: shownThumbnail }} onClose={() => setPreview(false)} />}
    </>
  )
}
