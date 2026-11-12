import { Link } from 'react-router'
import { useSeo } from '../lib/seo'
import { SectionLink } from '../components/ui'

export default function NotFound() {
  useSeo({ title: 'Page not found', noindex: true })
  return (
    <section className="container-x grid min-h-[55vh] place-items-center py-16 text-center">
      <div className="max-w-lg">
        <p className="text-6xl font-extrabold text-accent-text">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-ink">This page doesn’t exist</h1>
        <p className="mt-3 text-ink-muted">The link may be old or mistyped. Head back to the homepage or watch our work.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <SectionLink section="work" className="btn btn-primary">
            Watch our work
          </SectionLink>
          <Link to="/" className="btn btn-outline">
            Go to homepage
          </Link>
        </div>
      </div>
    </section>
  )
}
