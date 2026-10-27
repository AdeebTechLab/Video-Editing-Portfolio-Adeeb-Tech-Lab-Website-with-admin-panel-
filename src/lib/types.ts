export type VideoType = 'youtube' | 'vimeo' | 'mp4'

/** A film in the Selected Work section. */
export interface Video {
  id: string
  title: string
  description: string
  /** Category id from `categories` */
  categoryId: string
  videoUrl: string
  videoType: VideoType
  /** Poster image. YouTube videos get theirs automatically. */
  thumbnail: string
  /** Shown on the card, for example 2:45. Optional. */
  duration: string
  featured: boolean
  published: boolean
  /** Original demonstration film rather than client work. */
  isDemo: boolean
  order: number
  createdAt: number
  updatedAt: number
}

/** A Selected Work filter. Categories without published videos are hidden on the website. */
export interface Category {
  id: string
  name: string
  order: number
}

/** A row in the Services section. */
export interface Service {
  id: string
  name: string
  description: string
  /** Small label above the title in the preview, for example “Discuss your brief”. */
  label: string
  /** Icon key from src/components/ServiceIcon.tsx */
  icon: string
  /** Preview image. Without one, an illustrated editing panel is shown. */
  image: string
  imageAlt: string
  order: number
}

/** A card in “The tools behind the creativity”. */
export interface Tool {
  id: string
  name: string
  logo: string
  /** Accent colour for the logo border, for example #9b5cff */
  color: string
  description: string
  order: number
  showOnSite: boolean
}

export interface ProcessStep {
  title: string
  text: string
}

export interface Faq {
  question: string
  answer: string
}

export interface SocialLink {
  name: string
  url: string
}

export interface Comparison {
  before: string
  after: string
  label: string
}

export interface SiteSettings {
  companyName: string
  founderName: string
  founderRole: string
  founderImage: string
  logo: string
  email: string
  /** Digits only, with country code */
  whatsappNumber: string
  whatsappMessage: string
  location: string
  mapUrl: string
  website: string
  socials: SocialLink[]
  skills: string[]
  process: ProcessStep[]
  values: string[]
  faqs: Faq[]
  comparison: Comparison
}

export interface SiteData {
  app: 'adeebtechlab-video'
  version: 1
  updatedAt: number
  settings: SiteSettings
  categories: Category[]
  videos: Video[]
  services: Service[]
  tools: Tool[]
}

export const VIDEO_TYPE_LABELS: Record<VideoType, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  mp4: 'MP4 file',
}
