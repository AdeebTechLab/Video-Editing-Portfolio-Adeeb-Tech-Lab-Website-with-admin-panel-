import { useRef, useState } from 'react'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import ContactIcon from '../icons/ContactIcon'
import { useContent } from '../../hooks/useContent'
import { whatsappLink } from '../../lib/utils'
import { Heading } from '../ui'
export function ContactSection() {
  const { settings } = useContent()
  const [status, setStatus] = useState('')
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  function prepare(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    if (d.get('website')) {
      setStatus('Please retry your inquiry.')
      return
    }
    setBusy(true)
    const message = `Project inquiry for ${settings.companyName}\n\nName: ${d.get('name')}\nEmail: ${d.get('email')}\nWhatsApp: ${d.get('phone') || 'Not provided'}\nProject type: ${d.get('type')}\nBudget: ${d.get('budget') || 'To discuss'}\n\n${d.get('description')}`
    setDraft(message)
    setStatus('Your inquiry is ready. Choose email or WhatsApp below to review and send it. Nothing has been sent yet.')
    setBusy(false)
  }
  return (
    <section id="contact" className="section contact">
      <div>
        <Heading number="12" kicker="Start a conversation">
          LET’S CREATE
          <br />
          SOMETHING
          <br />
          <em>EXTRAORDINARY.</em>
        </Heading>
        <p className="intro">Have a project in mind? Let’s bring your vision to life.</p>
        <a className="contact-email" href={`mailto:${settings.email}`}>
          <ContactIcon kind="email" />
          <span className="contact-detail">
            <span className="contact-label">Email us</span>
            <span>{settings.email}</span>
          </span>
          <ArrowUpRight className="contact-arrow" size={18} />
        </a>
        <a
          className="contact-meta contact-map muted"
          href={settings.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${settings.location} in Google Maps`}
        >
          <ContactIcon kind="location" />
          <span className="contact-detail">
            <span className="contact-location">{settings.location}</span>
            <span className="contact-label">Open in Google Maps</span>
          </span>
          <ArrowUpRight className="contact-arrow" size={18} />
        </a>
        <div className="contact-links">
          <a href={whatsappLink(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noreferrer">
            <ContactIcon kind="whatsapp" />
            <span className="contact-detail">
              <span>WhatsApp</span>
              <span className="contact-label">Let’s talk about your project</span>
            </span>
            <ArrowUpRight className="contact-arrow" size={16} />
          </a>
          <a href={settings.website} target="_blank" rel="noreferrer">
            <ContactIcon kind="website" />
            <span className="contact-detail">
              <span>Official website</span>
              <span className="contact-label">Explore Adeeb Tech Lab</span>
            </span>
            <ArrowUpRight className="contact-arrow" size={16} />
          </a>
        </div>
      </div>
      <form ref={form} onSubmit={prepare}>
        <p className="eyebrow">Tell us about your next story</p>
        <div className="form-grid">
          <label>
            Full name
            <input name="name" autoComplete="name" required maxLength={100} placeholder="Your name" />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required maxLength={150} placeholder="you@example.com" />
          </label>
          <label>
            WhatsApp number
            <input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="+92…" />
          </label>
          <label>
            Project type
            <select name="type" required defaultValue="">
              <option value="" disabled>
                Select a format
              </option>
              <option>YouTube / long-form</option>
              <option>Reels / short-form</option>
              <option>Motion graphics</option>
              <option>Promotional / cinematic</option>
              <option>Podcast</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <label>
          Project description
          <textarea name="description" required minLength={20} maxLength={4000} rows={4} placeholder="Your idea, footage, intended length and deadline…" />
        </label>
        <label>
          Estimated budget <span className="muted">(optional)</span>
          <input name="budget" maxLength={100} placeholder="Amount and currency, or let’s discuss" />
        </label>
        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? 'Preparing…' : 'Send project inquiry'}
          <ArrowUpRight size={18} />
        </button>
        <p className="form-note">Prepare your brief, then send through email or WhatsApp. This site does not collect or send your message.</p>
        <p role="status">{status}</p>
        {draft && (
          <div className="draft-actions">
            <a
              className="button"
              href={`mailto:${settings.email}?subject=${encodeURIComponent('Video editing project inquiry')}&body=${encodeURIComponent(draft)}`}
            >
              <Mail size={16} /> Open email draft
            </a>
            <a className="button" href={whatsappLink(settings.whatsappNumber, draft)} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> Open WhatsApp draft
            </a>
            <button
              type="button"
              className="text-button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft)
                  setStatus('Inquiry copied. Paste it into your email or WhatsApp to send.')
                } catch {
                  setStatus('Copy unavailable. Use the email or WhatsApp draft link.')
                }
              }}
            >
              Copy inquiry text
            </button>
          </div>
        )}
      </form>
    </section>
  )
}
