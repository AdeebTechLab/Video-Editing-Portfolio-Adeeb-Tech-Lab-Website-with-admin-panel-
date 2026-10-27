import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Clapperboard, ExternalLink, FileText, LayoutDashboard, Layers, LogOut, Menu, Settings, Tags, UploadCloud, Wrench, X } from 'lucide-react'
import { useArea } from '../../hooks/useArea'
import { useSeo } from '../../lib/seo'
import { cn } from '../../lib/utils'
import { differsFromPublished, useHasLocalChanges, useSite } from '../../store/siteStore'
import { Logo } from '../../components/layout/Logo'
import { ThemeToggle } from '../../components/ThemeToggle'
import { endAdminSession, isAdminAuthenticated } from '../../lib/adminAuth'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Video projects', icon: Clapperboard },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/services', label: 'Services', icon: Layers },
  { to: '/admin/tools', label: 'Editing tools & skills', icon: Wrench },
  { to: '/admin/content', label: 'Site content', icon: FileText },
  { to: '/admin/publish', label: 'Publish & backup', icon: UploadCloud },
  { to: '/admin/settings', label: 'Admin credentials', icon: Settings },
]

export default function AdminLayout() {
  useArea('admin')
  useSeo({ title: 'Admin', noindex: true })
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated)
  const navigate = useNavigate()
  const site = useSite()
  const hasLocal = useHasLocalChanges()
  const unpublished = hasLocal && differsFromPublished(site)

  useEffect(() => setOpen(false), [location.pathname])

  const logout = () => {
    endAdminSession()
    setAuthenticated(false)
    navigate('/admin/login', { replace: true })
  }

  if (!authenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors',
              isActive ? 'bg-accent-soft text-accent-text' : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
            )
          }
        >
          <Icon className="size-[18px]" aria-hidden="true" />
          <span className="flex-1">{label}</span>
          {to === '/admin/publish' && unpublished && <span className="size-2 rounded-full bg-accent" aria-label="Unpublished changes" />}
        </NavLink>
      ))}
      <Link to="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink-muted hover:bg-surface-2 hover:text-ink">
        <ExternalLink className="size-[18px]" aria-hidden="true" />
        View website
      </Link>
    </nav>
  )

  const footer = (
    <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
      <ThemeToggle />
      <p className="min-w-0 flex-1 text-xs text-ink-faint">Changes save automatically in this browser.</p>
      <button type="button" className="btn btn-ghost btn-sm w-full" onClick={logout}>
        <LogOut className="size-4" aria-hidden="true" /> Sign out
      </button>
    </div>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col justify-between border-r border-line bg-page-deep/60 p-5 lg:flex">
        <div className="space-y-8">
          <Logo to="/admin" subtitle="Admin panel" small />
          {nav}
        </div>
        {footer}
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-line bg-page/90 px-4 backdrop-blur lg:hidden">
        <Logo to="/admin" subtitle="Admin panel" />
        <button type="button" className="btn btn-ghost btn-icon shrink-0 border border-line" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <Menu className="size-5" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(86vw,320px)] flex-col justify-between overflow-y-auto bg-page p-5 shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-end">
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              {nav}
            </div>
            {footer}
          </div>
        </div>
      )}

      <div className="min-w-0">
        {unpublished && location.pathname !== '/admin/publish' && (
          <div className="border-b border-accent/40 bg-accent-soft px-4 py-2.5 text-sm text-ink sm:px-8">
            <span className="font-semibold">Changes saved in this browser only.</span> Visitors will see them after you publish.{' '}
            <Link to="/admin/publish" className="font-semibold text-accent-text underline underline-offset-2">
              How to publish
            </Link>
          </div>
        )}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
