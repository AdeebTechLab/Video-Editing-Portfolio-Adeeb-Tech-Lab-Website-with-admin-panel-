import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { NAVIGATION } from '../../config/site'
import { useContent } from '../../hooks/useContent'

export function Header({ active }: { active: string }) {
  const { settings } = useContent()
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])

  useEffect(() => {
    if (!menu) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [menu])

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <a href="#home" className="brand" aria-label={`${settings.companyName} home`}>
        <img src={settings.logo} alt={`${settings.companyName} logo`} width="38" height="38" />
        <span>
          {settings.companyName}
          <span className="brand-tagline">Digital Tech Exper</span>
        </span>
      </a>
      <nav className={menu ? 'open' : ''} id="navigation" aria-label="Main navigation">
        {NAVIGATION.map(([label, id]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setMenu(false)}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href="#contact">
        Let’s talk <ArrowUpRight size={16} />
      </a>
      <button
        className="menu-button icon-button"
        onClick={() => setMenu(!menu)}
        aria-label={menu ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menu}
        aria-controls="navigation"
      >
        {menu ? <X /> : <Menu />}
      </button>
    </header>
  )
}
