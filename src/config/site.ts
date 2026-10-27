// Fixed settings that are not edited from the admin panel.
// Company details, videos, categories, services, tools, process, FAQs... are edited in the admin panel.

/** Your live website address, used for the canonical link and the sitemap. Set VITE_SITE_URL in .env to add it. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim().replace(/\/$/, '') || ''

export const DEFAULT_TITLE = 'Adeeb Tech Lab | Professional Video Editing & Creative Production'

export const DEFAULT_DESCRIPTION =
  'Explore professional video editing, motion graphics, cinematic storytelling, and creative video production services by Adeeb Tech Lab.'

/** Main navigation: [label, section id] */
export const NAVIGATION: Array<[string, string]> = [
  ['Home', 'home'],
  ['Showreel', 'showreel'],
  ['About', 'about'],
  ['Services', 'services'],
  ['Work', 'work'],
  ['Process', 'process'],
  ['Contact', 'contact'],
]

/** Original motion samples used by the editing timeline demo and the footer film strip. */
export interface SampleFilm {
  id: string
  title: string
  category: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
}

export const SAMPLE_FILMS: SampleFilm[] = [
  {
    id: 'signal',
    title: 'Signal / in motion',
    category: 'Motion Graphics',
    description: 'An original study in light, rhythm and kinetic composition.',
    thumbnail: '/images/signal.jpg',
    videoUrl: '/videos/signal.mp4',
    duration: '0:08',
  },
  {
    id: 'orbit',
    title: 'Orbit / a new perspective',
    category: 'Promotional Videos',
    description: 'An abstract product-film concept with a cinematic visual language.',
    thumbnail: '/images/orbit.jpg',
    videoUrl: '/videos/orbit.mp4',
    duration: '0:08',
  },
  {
    id: 'pulse',
    title: 'Pulse / made to move',
    category: 'Short-Form Content',
    description: 'A short-format motion experiment for fast-moving feeds.',
    thumbnail: '/images/pulse.jpg',
    videoUrl: '/videos/pulse.mp4',
    duration: '0:08',
  },
  {
    id: 'sequence',
    title: 'Sequence / the visual essay',
    category: 'YouTube Videos',
    description: 'A widescreen sequencing concept exploring pace and visual continuity.',
    thumbnail: '/images/sequence.jpg',
    videoUrl: '/videos/sequence.mp4',
    duration: '0:08',
  },
  {
    id: 'spectrum',
    title: 'Spectrum / color stories',
    category: 'Other Editing Work',
    description: 'An original color and texture experiment.',
    thumbnail: '/images/spectrum.jpg',
    videoUrl: '/videos/spectrum.mp4',
    duration: '0:08',
  },
]
