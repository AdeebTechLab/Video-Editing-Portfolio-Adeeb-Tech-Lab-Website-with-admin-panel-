// Fixed settings that are not edited from the admin panel.
// Company details, videos, categories, services, tools, process, FAQs... are edited in the admin panel.

/** Your live website address, used for the canonical link and the sitemap. Set VITE_SITE_URL in .env to add it. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim().replace(/\/$/, '') || ''

export const DEFAULT_TITLE = 'Adeeb Tech Lab | Professional Video Editing & Creative Production'

export const DEFAULT_DESCRIPTION =
  'Explore professional video editing, motion graphics, cinematic storytelling, and creative video production services by Adeeb Tech Lab.'

/** Main navigation: label and the id of the home page section it scrolls to. */
export const NAVIGATION: Array<{ label: string; section: string }> = [
  { label: 'Services', section: 'services' },
  { label: 'Work', section: 'work' },
  { label: 'Tools', section: 'tools' },
  { label: 'Process', section: 'process' },
  { label: 'About', section: 'about' },
  { label: 'Contact', section: 'contact' },
]

/** Formats typed in the hero: “We edit …” */
export const HERO_WORDS = ['YouTube videos', 'Reels & Shorts', 'Podcasts', 'Motion graphics', 'Promotional films']

/** Original motion stills used by the editing timeline demo. */
export interface SampleFilm {
  id: string
  title: string
  thumbnail: string
}

export const SAMPLE_FILMS: SampleFilm[] = [
  { id: 'signal', title: 'Signal / in motion', thumbnail: '/images/signal.jpg' },
  { id: 'orbit', title: 'Orbit / a new perspective', thumbnail: '/images/orbit.jpg' },
  { id: 'pulse', title: 'Pulse / made to move', thumbnail: '/images/pulse.jpg' },
  { id: 'sequence', title: 'Sequence / the visual essay', thumbnail: '/images/sequence.jpg' },
  { id: 'spectrum', title: 'Spectrum / color stories', thumbnail: '/images/spectrum.jpg' },
]
