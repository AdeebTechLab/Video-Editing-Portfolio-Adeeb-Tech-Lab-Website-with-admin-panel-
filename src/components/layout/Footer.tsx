import { Link } from 'react-router'
import { Globe, Mail, MapPin } from 'lucide-react'
import { NAVIGATION } from '../../config/site'
import { useContent } from '../../hooks/useContent'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { safeUrl } from '../../lib/utils'
import { BrandIcon, socialIconKey } from '../icons/BrandIcon'
import { SectionLink } from '../ui'
import { Logo } from './Logo'

export function Footer() {
  const { settings, services } = useContent()
  const wa = useWhatsApp()
  const year = new Date().getFullYear()
  const website = safeUrl(settings.website)
  const map = safeUrl(settings.mapUrl)

  return (
    <footer className="site-footer mt-12 border-t border-line bg-page-deep/60">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.3fr]">
        <div className="space-y-4">
          <Logo subtitle="Video Editing" />
          <p className="max-w-sm text-sm text-ink-muted">
            Cinematic video editing, motion graphics and visual storytelling for creators, brands and businesses, from {settings.location || 'Pakistan'}.
          </p>
          {settings.socials.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {settings.socials.map((s) => {
                const href = safeUrl(s.url)
                if (!href) return null
                return (
                  <li key={s.name + s.url}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-9 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-accent hover:text-accent-text"
                      aria-label={s.name}
                      title={s.name}
                    >
                      <BrandIcon name={socialIconKey(s.name)} className="size-4" />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold text-ink">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAVIGATION.map((e) => (
              <li key={e.section}>
                <SectionLink section={e.section} className="text-ink-muted hover:text-accent-text">
                  {e.label}
                </SectionLink>
              </li>
            ))}
            <li>
              <SectionLink section="faq" className="text-ink-muted hover:text-accent-text">
                FAQ
              </SectionLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-ink">Video services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.slice(0, 7).map((s) => (
              <li key={s.id}>
                <SectionLink section="services" className="text-ink-muted hover:text-accent-text">
                  {s.name}
                </SectionLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-ink">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li>
              <a href={wa.link()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-accent-text">
                <BrandIcon name="whatsapp" className="mt-0.5 size-4 shrink-0 text-whatsapp" />
                WhatsApp {wa.display}
              </a>
            </li>
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-3 break-all hover:text-accent-text">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                  {settings.email}
                </a>
              </li>
            )}
            {settings.location && (
              <li>
                {map ? (
                  <a href={map} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-accent-text">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                    {settings.location}
                  </a>
                ) : (
                  <span className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                    {settings.location}
                  </span>
                )}
              </li>
            )}
            {website && (
              <li>
                <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-accent-text">
                  <Globe className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                  Official website
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="pl-12 sm:pl-0">
            {/* The © sign is the hidden link to the admin panel */}
            <Link to="/admin" rel="nofollow" aria-label="Admin panel" className="cursor-text rounded-sm no-underline hover:text-ink-faint focus-visible:text-ink">
              ©
            </Link>{' '}
            {year} {settings.companyName}. All rights reserved.
          </p>
          <p>Video Editing &amp; Creative Production</p>
        </div>
      </div>
    </footer>
  )
}
