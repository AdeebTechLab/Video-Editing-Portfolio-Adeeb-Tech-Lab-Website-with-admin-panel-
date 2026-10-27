import { Link } from 'react-router'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { NAVIGATION, SAMPLE_FILMS } from '../../config/site'
import { useContent } from '../../hooks/useContent'
import { whatsappLink } from '../../lib/utils'

export function Footer() {
  const { settings } = useContent()
  const year = new Date().getFullYear()

  return (
    <footer id="footer">
      <div className="footer-film" aria-hidden="true">
        {SAMPLE_FILMS.map((p) => (
          <img key={p.id} src={p.thumbnail} alt="" loading="lazy" />
        ))}
      </div>
      <div className="footer-main">
        <p className="eyebrow">13 / THE NEXT FRAME IS YOURS</p>
        <a href="#contact" className="footer-headline">
          LET’S MAKE
          <br />
          SOMETHING <em>GREAT.</em>
          <ArrowUpRight />
        </a>
        <div className="footer-links">
          <div>
            <strong>{settings.companyName}</strong>
            <p className="brand-tagline">Digital Tech Exper</p>
          </div>
          <div>
            <a href={`mailto:${settings.email}`}>
              Email <ArrowUpRight size={15} />
            </a>
            <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noreferrer">
              WhatsApp <ArrowUpRight size={15} />
            </a>
            <a href={settings.website} target="_blank" rel="noreferrer">
              Official website <ArrowUpRight size={15} />
            </a>
            {settings.socials.map((s) => (
              <a key={s.name + s.url} href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            ))}
          </div>
          <div>
            {NAVIGATION.slice(1).map(([n, id]) => (
              <a key={id} href={`#${id}`}>
                {n}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            {/* The © sign is the hidden link to the admin panel */}
            <Link to="/admin" rel="nofollow" aria-label="Admin panel" className="footer-admin-link">
              ©
            </Link>{' '}
            {year} {settings.companyName}. All Rights Reserved.
          </span>
          <a href="#home">
            Back to top <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
