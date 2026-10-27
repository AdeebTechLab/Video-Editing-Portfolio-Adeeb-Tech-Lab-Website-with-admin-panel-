export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <span className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="size-5 animate-spin rounded-full border-2 border-line-strong border-t-accent" aria-hidden="true" />
        {label}…
      </span>
    </div>
  )
}
