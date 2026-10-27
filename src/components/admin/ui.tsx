import { useEffect, useId, useRef, type ReactNode } from 'react'
import { ChevronDown, ChevronUp, TriangleAlert, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'accent' | 'success' | 'info' | 'danger'; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold',
        tone === 'neutral' && 'bg-surface-2 text-ink-muted',
        tone === 'accent' && 'bg-accent-soft text-accent-text',
        tone === 'success' && 'bg-success-soft text-success',
        tone === 'info' && 'bg-info-soft text-info',
        tone === 'danger' && 'bg-danger-soft text-danger',
      )}
    >
      {children}
    </span>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-ink-faint">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors disabled:opacity-50',
          checked ? 'border-accent bg-accent' : 'border-line-strong bg-surface-2',
        )}
      >
        <span
          className={cn(
            'absolute left-0 top-0.5 size-[22px] rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}

export function Panel({ id, title, description, children, aside }: { id?: string; title: string; description?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section id={id} className="card scroll-mt-24 p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-faint">{description}</p>}
        </div>
        {aside}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
  counter,
}: {
  label: string
  hint?: ReactNode
  error?: string
  required?: boolean
  children: ReactNode
  htmlFor?: string
  counter?: { value: number; max: number }
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="field-label">
          {label}
          {required ? <span className="text-accent-text"> *</span> : <span className="font-normal text-ink-faint"> (optional)</span>}
        </label>
        {counter && (
          <span className={cn('text-xs', counter.value > counter.max ? 'text-danger' : 'text-ink-faint')}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {error ? <p className="mt-1.5 text-sm text-danger">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

export function Modal({ title, children, onClose, footer }: { title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const first = ref.current?.querySelector<HTMLElement>('input, select, textarea') ?? ref.current?.querySelector<HTMLElement>('[data-autofocus], button')
    first?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [])
  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-t-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="-m-2 rounded-lg p-2 text-ink-faint hover:text-ink" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-3 text-sm text-ink-muted">{children}</div>
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  busy,
}: {
  title: string
  message: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  busy?: boolean
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
        <div>{message}</div>
      </div>
    </Modal>
  )
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function errorMessage(err: unknown) {
  if (err instanceof Error && err.message) return err.message
  return 'Something went wrong. Try again.'
}

/** Small up/down buttons to change the order of an item in a list. */
export function OrderButtons({ index, count, onMove, label }: { index: number; count: number; onMove: (from: number, to: number) => void; label: string }) {
  return (
    <span className="flex shrink-0 flex-col">
      <button
        type="button"
        className="grid h-5 w-7 place-items-center rounded text-ink-faint hover:bg-surface-2 hover:text-ink disabled:opacity-30"
        onClick={() => onMove(index, index - 1)}
        disabled={index === 0}
        aria-label={`Move ${label} up`}
      >
        <ChevronUp className="size-4" />
      </button>
      <button
        type="button"
        className="grid h-5 w-7 place-items-center rounded text-ink-faint hover:bg-surface-2 hover:text-ink disabled:opacity-30"
        onClick={() => onMove(index, index + 1)}
        disabled={index === count - 1}
        aria-label={`Move ${label} down`}
      >
        <ChevronDown className="size-4" />
      </button>
    </span>
  )
}
