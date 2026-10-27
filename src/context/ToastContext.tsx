import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { cn } from '../lib/utils'

type Kind = 'success' | 'error' | 'info'
interface Toast {
  id: number
  kind: Kind
  message: string
}

const ToastContext = createContext<(message: string, kind?: Kind) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const show = useCallback(
    (message: string, kind: Kind = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t.slice(-2), { id, kind, message }])
      setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 3500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => {
          const Icon = t.kind === 'success' ? CircleCheck : t.kind === 'error' ? CircleAlert : Info
          return (
            <div
              key={t.id}
              role={t.kind === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm shadow-[var(--shadow)]',
              )}
            >
              <Icon className={cn('mt-0.5 size-5 shrink-0', t.kind === 'success' && 'text-success', t.kind === 'error' && 'text-danger', t.kind === 'info' && 'text-info')} />
              <p className="flex-1 text-ink">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} className="-m-1 rounded p-1 text-ink-faint hover:text-ink" aria-label="Dismiss">
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
