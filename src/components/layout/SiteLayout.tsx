import { Outlet } from 'react-router'
import { ScrollControls } from '../ScrollControls'
import { WhatsAppButton } from '../WhatsAppButton'
import { Footer } from './Footer'
import { Header } from './Header'
import { VideoPlayerProvider } from './VideoPlayerContext'

export function SiteLayout() {
  return (
    <VideoPlayerProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
      <ScrollControls />
    </VideoPlayerProvider>
  )
}
