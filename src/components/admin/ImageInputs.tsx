import { useId, useRef, useState, type DragEvent } from 'react'
import { ImagePlus, Link2, LoaderCircle, Trash } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { dataUrlBytes, imageToData, validateImage } from '../../lib/upload'
import { cn, formatBytes, safeUrl } from '../../lib/utils'

/** Drop zone + file picker + "paste a link". */
function Uploader({ onAdd, compact, maxSide }: { onAdd: (url: string) => void; compact?: boolean; maxSide?: number }) {
  const toast = useToast()
  const input = useRef<HTMLInputElement>(null)
  const linkId = useId()
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [link, setLink] = useState('')

  const handle = async (files: FileList | File[]) => {
    const file = Array.from(files)[0]
    if (!file) return
    const problem = validateImage(file)
    if (problem) {
      toast(problem, 'error')
      return
    }
    setBusy(true)
    try {
      onAdd(await imageToData(file, maxSide))
    } catch (err) {
      toast(err instanceof Error ? err.message : 'That image could not be added.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setOver(false)
    if (e.dataTransfer.files?.length) void handle(e.dataTransfer.files)
  }

  const addLink = () => {
    const url = safeUrl(link)
    if (!url) {
      toast('Paste a full image link starting with https://, or a site path like /images/photo.jpg', 'error')
      return
    }
    onAdd(url)
    setLink('')
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 text-center transition-colors',
          compact ? 'py-5' : 'py-8',
          over ? 'border-accent bg-accent-soft' : 'border-line-strong',
        )}
      >
        {busy ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <LoaderCircle className="size-4 animate-spin text-accent-text" aria-hidden="true" />
            Adding image…
          </p>
        ) : (
          <>
            <ImagePlus className="size-6 text-accent-text" aria-hidden="true" />
            <p className="text-sm text-ink-muted">
              Drag an image here or{' '}
              <button type="button" className="font-semibold text-accent-text underline-offset-2 hover:underline" onClick={() => input.current?.click()}>
                choose a file
              </button>
            </p>
            <p className="text-xs text-ink-faint">JPG, PNG, WebP, GIF or SVG. Images are resized and saved in this browser.</p>
          </>
        )}
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files?.length) void handle(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
      {linkOpen ? (
        <div className="flex gap-2">
          <label className="sr-only" htmlFor={linkId}>
            Image link
          </label>
          <input
            id={linkId}
            className="input"
            placeholder="https://… or /images/file.jpg"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addLink()
              }
            }}
          />
          <button type="button" className="btn btn-outline" onClick={addLink}>
            Add
          </button>
        </div>
      ) : (
        <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink" onClick={() => setLinkOpen(true)}>
          <Link2 className="size-3.5" aria-hidden="true" />
          Or paste an image link (saves browser space)
        </button>
      )}
    </div>
  )
}

function SizeNote({ url }: { url: string }) {
  const bytes = dataUrlBytes(url)
  if (!bytes) return <span className="break-all text-xs text-ink-faint">{url}</span>
  return <span className="text-xs text-ink-faint">Saved in this browser, {formatBytes(bytes)}</span>
}

/** A wide picture such as a video thumbnail (16:9) or a service preview (3:2). */
export function WideImageInput({
  value,
  onChange,
  aspect = 'aspect-video',
  maxSide = 1600,
  label = 'image',
  onReset,
  resetLabel,
}: {
  value: string
  onChange: (v: string) => void
  /** Tailwind aspect class for the preview */
  aspect?: string
  maxSide?: number
  label?: string
  /** Optional extra action, for example “Use the YouTube thumbnail” */
  onReset?: () => void
  resetLabel?: string
}) {
  if (!value) return <Uploader maxSide={maxSide} onAdd={onChange} />
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className={cn('w-full overflow-hidden rounded-xl border border-line bg-page-deep sm:w-64', aspect)}>
        <img src={value} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <SizeNote url={value} />
        <div className="flex flex-wrap items-center gap-2">
          {onReset && (
            <button type="button" className="btn btn-outline btn-sm" onClick={onReset}>
              {resetLabel ?? 'Reset'}
            </button>
          )}
          <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => onChange('')}>
            <Trash className="size-4" aria-hidden="true" />
            Remove {label}
          </button>
        </div>
      </div>
    </div>
  )
}

/** A single image such as a logo or a photo, shown round. */
export function RoundImageInput({ value, onChange, label = 'image', photo }: { value: string; onChange: (v: string) => void; label?: string; photo?: boolean }) {
  if (!value) return <Uploader compact maxSide={photo ? 900 : 400} onAdd={onChange} />
  return (
    <div className="flex items-center gap-4">
      <span className={cn('grid size-20 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-accent', photo ? 'bg-page-deep' : 'bg-white p-2')}>
        <img src={value} alt="" className={cn('h-full w-full', photo ? 'object-cover' : 'object-contain')} />
      </span>
      <div className="flex min-w-0 flex-col items-start gap-1">
        <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => onChange('')}>
          <Trash className="size-4" aria-hidden="true" />
          Remove {label}
        </button>
        <SizeNote url={value} />
      </div>
    </div>
  )
}
