import { useState, type FormEvent } from 'react'
import { Globe, Mail, MapPin } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { safeUrl } from '../../lib/utils'
import { BrandIcon } from '../icons/BrandIcon'
import { SectionHeading } from '../ui'

type Form = { name: string; phone: string; email: string; service: string; message: string; budget: string }
const EMPTY: Form = { name: '', phone: '', email: '', service: '', message: '', budget: '' }

export function ContactSection() {
  const { settings, services } = useContent()
  const wa = useWhatsApp()
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [sent, setSent] = useState<'whatsapp' | 'email' | null>(null)
  const website = safeUrl(settings.website)
  const map = safeUrl(settings.mapUrl)

  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const compose = () =>
    [
      `Hi ${settings.companyName}, my name is ${form.name.trim()}.`,
      form.service ? `I'm interested in: ${form.service}.` : '',
      '',
      form.message.trim(),
      '',
      form.budget.trim() ? `Budget: ${form.budget.trim()}` : '',
      form.phone.trim() ? `Phone / WhatsApp: ${form.phone.trim()}` : '',
      form.email.trim() ? `Email: ${form.email.trim()}` : '',
    ]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

  const validate = () => {
    const e: Partial<Record<keyof Form, string>> = {}
    if (!form.name.trim()) e.name = 'Enter your name.'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address, or leave it empty.'
    if (form.message.trim().length < 10) e.message = 'Tell us a little about your video (at least 10 characters).'
    setErrors(e)
    if (Object.keys(e).length) document.getElementById(`c-${Object.keys(e)[0]}`)?.focus()
    return Object.keys(e).length === 0
  }

  const sendWhatsApp = (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    window.open(wa.link(compose()), '_blank', 'noopener,noreferrer')
    setSent('whatsapp')
  }

  const sendEmail = () => {
    if (!validate()) return
    const subject = `Video editing enquiry from ${form.name.trim()}`
    window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose())}`
    setSent('email')
  }

  const err = (k: keyof Form) =>
    errors[k] ? (
      <p id={`c-${k}-err`} role="alert" className="mt-1.5 text-sm text-danger">
        {errors[k]}
      </p>
    ) : null

  return (
    <section id="contact" className="scroll-mt-20 py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          title="Let’s create something great"
          text="Tell us about your video. The form opens WhatsApp with your message ready to send, or you can email us instead."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <form onSubmit={sendWhatsApp} noValidate className="card space-y-5 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="field-label">
                  Your name
                </label>
                <input id="c-name" className="input" value={form.name} onChange={set('name')} autoComplete="name" maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-err' : undefined} />
                {err('name')}
              </div>
              <div>
                <label htmlFor="c-phone" className="field-label">
                  Phone or WhatsApp <span className="font-normal text-ink-faint">(optional)</span>
                </label>
                <input id="c-phone" className="input" type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" maxLength={30} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-email" className="field-label">
                  Email <span className="font-normal text-ink-faint">(optional)</span>
                </label>
                <input id="c-email" className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" maxLength={150} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-err' : undefined} />
                {err('email')}
              </div>
              <div>
                <label htmlFor="c-service" className="field-label">
                  What do you need?
                </label>
                <select id="c-service" className="input" value={form.service} onChange={set('service')}>
                  <option value="">Not sure yet</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="c-message" className="field-label">
                About your video
              </label>
              <textarea
                id="c-message"
                className="input"
                rows={5}
                maxLength={4000}
                value={form.message}
                onChange={set('message')}
                placeholder="Your idea, the footage you have, the platform, intended length and deadline."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'c-message-err' : undefined}
              />
              {err('message')}
            </div>
            <div>
              <label htmlFor="c-budget" className="field-label">
                Estimated budget <span className="font-normal text-ink-faint">(optional)</span>
              </label>
              <input id="c-budget" className="input" value={form.budget} onChange={set('budget')} maxLength={100} placeholder="Amount and currency, or let’s discuss" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="btn btn-whatsapp">
                <BrandIcon name="whatsapp" className="size-[18px]" />
                Send on WhatsApp
              </button>
              {settings.email && (
                <button type="button" className="btn btn-outline" onClick={sendEmail}>
                  <Mail className="size-4" aria-hidden="true" />
                  Send by email
                </button>
              )}
            </div>
            <p className="text-xs text-ink-faint" role="status" aria-live="polite">
              {sent === 'whatsapp'
                ? 'WhatsApp opened with your message. Press send in WhatsApp to reach us.'
                : sent === 'email'
                  ? 'Your email app opened with your message. Press send to reach us.'
                  : 'Nothing is stored on this site. Your message goes straight to WhatsApp or your email app. Please don’t send private footage through this form.'}
            </p>
          </form>

          <div className="space-y-4">
            <a href={wa.link()} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-colors hover:border-whatsapp">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                <BrandIcon name="whatsapp" className="size-6" />
              </span>
              <span>
                <span className="block font-bold text-ink">WhatsApp</span>
                <span className="text-sm text-ink-muted">{wa.display}</span>
              </span>
            </a>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="card flex items-center gap-4 p-5 transition-colors hover:border-accent">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-ink">Email</span>
                  <span className="block truncate text-sm text-ink-muted">{settings.email}</span>
                </span>
              </a>
            )}
            {settings.location && (
              <a
                href={map || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-4 p-5 transition-colors hover:border-accent"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-ink">{settings.location}</span>
                  <span className="block text-sm text-ink-muted">Open in Google Maps</span>
                </span>
              </a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-colors hover:border-accent">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">
                  <Globe className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-ink">Official website</span>
                  <span className="block truncate text-sm text-ink-muted">Explore {settings.companyName}</span>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
