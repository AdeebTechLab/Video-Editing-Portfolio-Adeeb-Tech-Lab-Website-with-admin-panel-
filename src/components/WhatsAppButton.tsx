import { useWhatsApp } from '../hooks/useWhatsApp'
import { BrandIcon } from './icons/BrandIcon'

/** Floating WhatsApp button shown on every public page. */
export function WhatsAppButton() {
  const wa = useWhatsApp()
  return (
    <a
      href={wa.link()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-4 z-50 flex items-center gap-3 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink opacity-0 shadow-[var(--shadow)] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
        Chat on WhatsApp
      </span>
      <span className="relative grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_-8px_rgba(37,211,102,0.65)] transition-transform duration-200 group-hover:scale-105">
        <span className="wa-ring absolute inset-0 rounded-full bg-whatsapp [animation-iteration-count:4]" aria-hidden="true" />
        <BrandIcon name="whatsapp" className="relative size-7" />
      </span>
    </a>
  )
}
