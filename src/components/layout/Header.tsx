import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { NAVIGATION } from '../../config/site'
import { cn } from '../../lib/utils'
import { ThemeToggle } from '../ThemeToggle'
import { SectionLink } from '../ui'
import { Logo } from './Logo'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.key])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={cn(
        'site-header sticky top-0 z-40 border-b transition-colors duration-200',
        scrolled || open ? 'border-line bg-page/85 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          const main = document.getElementById('main')
          main?.setAttribute('tabindex', '-1')
          main?.focus()
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Logo subtitle="Video Editing" />
        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {NAVIGATION.map((item) => (
            <SectionLink key={item.section} section={item.section} className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink">
              {item.label}
            </SectionLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <SectionLink section="contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Start a project
          </SectionLink>
          <button
            type="button"
            className="btn btn-ghost btn-icon border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-page lg:hidden">
          <ul className="container-x grid py-3 sm:grid-cols-2 sm:gap-x-6">
            {NAVIGATION.map((item) => (
              <li key={item.section}>
                <SectionLink section={item.section} className="flex min-h-12 items-center rounded-lg px-2 text-base font-semibold text-ink hover:text-accent-text">
                  {item.label}
                </SectionLink>
              </li>
            ))}
            <li className="pt-2 sm:hidden">
              <SectionLink section="contact" className="btn btn-primary w-full">
                Start a project
              </SectionLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
