import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { useSeo } from '../lib/seo'
import { Heading } from '../components/ui'

export default function NotFound() {
  useSeo({ title: 'Page not found', noindex: true })
  return (
    <section id="not-found" className="section">
      <Heading number="404" kicker="Page not found">
        THIS PAGE
        <br />
        DOESN’T <em>EXIST.</em>
      </Heading>
      <p className="intro">The link may be old or mistyped.</p>
      <Link className="button primary" to="/">
        Back to the portfolio <ArrowUpRight size={19} />
      </Link>
    </section>
  )
}
