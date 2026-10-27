import { Outlet } from 'react-router'
import { MessageCircle } from 'lucide-react'
import '../../styles/portfolio.css'
import { useArea } from '../../hooks/useArea'
import { useSectionObserver } from '../../hooks/useSectionObserver'
import { CinemaCursor } from '../CinemaCursor'
import { Footer } from './Footer'
import { Header } from './Header'
import { VideoPlayerProvider } from './VideoPlayerContext'

export function SiteLayout() {
  useArea('site')
  const active = useSectionObserver()
  return (
    <VideoPlayerProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <CinemaCursor />
      <Header active={active} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <a className="floating-contact" href="#contact" aria-label="Start a project">
        <MessageCircle size={21} />
      </a>
    </VideoPlayerProvider>
  )
}
