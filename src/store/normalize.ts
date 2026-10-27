// Turns any stored or imported data into complete, valid SiteData, filling in anything missing.
import type { Category, Comparison, Faq, ProcessStep, Service, SiteData, SiteSettings, SocialLink, Tool, Video, VideoType } from '../lib/types'

type Obj = Record<string, unknown>
const obj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {})
const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d)
const num = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d)
const bool = (v: unknown, d = false) => (typeof v === 'boolean' ? v : d)
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const strList = (v: unknown) => arr(v).filter((x): x is string => typeof x === 'string' && x.trim() !== '')

function id(o: Obj, prefix: string, i: number) {
  return str(o.id) || `${prefix}-${i + 1}`
}

export function normalizeCategory(v: unknown, i = 0): Category {
  const o = obj(v)
  return { id: id(o, 'cat', i), name: str(o.name, 'Untitled category') || 'Untitled category', order: num(o.order, i + 1) }
}

export function normalizeVideo(v: unknown, i = 0): Video {
  const o = obj(v)
  const videoType: VideoType = o.videoType === 'vimeo' || o.videoType === 'mp4' ? o.videoType : 'youtube'
  return {
    id: id(o, 'video', i),
    title: str(o.title, 'Untitled video') || 'Untitled video',
    description: str(o.description),
    categoryId: str(o.categoryId),
    videoUrl: str(o.videoUrl),
    videoType,
    thumbnail: str(o.thumbnail),
    duration: str(o.duration),
    featured: bool(o.featured, false),
    published: bool(o.published, false),
    isDemo: bool(o.isDemo, false),
    order: num(o.order, i + 1),
    createdAt: num(o.createdAt),
    updatedAt: num(o.updatedAt),
  }
}

export function normalizeService(v: unknown, i = 0): Service {
  const o = obj(v)
  return {
    id: id(o, 'svc', i),
    name: str(o.name, 'Untitled service') || 'Untitled service',
    description: str(o.description),
    label: str(o.label),
    icon: str(o.icon, 'film') || 'film',
    image: str(o.image),
    imageAlt: str(o.imageAlt),
    order: num(o.order, i + 1),
  }
}

export function normalizeTool(v: unknown, i = 0): Tool {
  const o = obj(v)
  return {
    id: id(o, 'tool', i),
    name: str(o.name, 'Tool') || 'Tool',
    logo: str(o.logo),
    color: str(o.color, '#ff6a00') || '#ff6a00',
    description: str(o.description),
    order: num(o.order, i + 1),
    showOnSite: bool(o.showOnSite, true),
  }
}

export function normalizeSettings(v: unknown, d: SiteSettings): SiteSettings {
  const o = obj(v)
  const socials = Array.isArray(o.socials)
    ? arr(o.socials)
        .map((x): SocialLink => {
          const s = obj(x)
          return { name: str(s.name), url: str(s.url) }
        })
        .filter((s) => s.url)
    : d.socials
  const process = Array.isArray(o.process)
    ? arr(o.process)
        .map((x): ProcessStep => {
          const p = obj(x)
          return { title: str(p.title), text: str(p.text) }
        })
        .filter((p) => p.title)
    : d.process
  const faqs = Array.isArray(o.faqs)
    ? arr(o.faqs)
        .map((x): Faq => {
          const f = obj(x)
          return { question: str(f.question), answer: str(f.answer) }
        })
        .filter((f) => f.question)
    : d.faqs
  const c = obj(o.comparison)
  const comparison: Comparison = {
    before: str(c.before, d.comparison.before),
    after: str(c.after, d.comparison.after),
    label: str(c.label, d.comparison.label),
  }
  return {
    companyName: str(o.companyName, d.companyName) || d.companyName,
    founderName: str(o.founderName, d.founderName),
    founderRole: str(o.founderRole, d.founderRole),
    founderImage: str(o.founderImage, d.founderImage),
    logo: str(o.logo, d.logo),
    email: str(o.email, d.email),
    whatsappNumber: str(o.whatsappNumber, d.whatsappNumber).replace(/\D/g, '') || d.whatsappNumber,
    whatsappMessage: str(o.whatsappMessage, d.whatsappMessage),
    location: str(o.location, d.location),
    mapUrl: str(o.mapUrl, d.mapUrl),
    website: str(o.website, d.website),
    socials,
    skills: Array.isArray(o.skills) ? strList(o.skills) : d.skills,
    process,
    values: Array.isArray(o.values) ? strList(o.values) : d.values,
    faqs,
    comparison,
  }
}

/** `fallback` supplies settings for anything missing (normally the published data). */
export function normalizeSiteData(v: unknown, fallback?: SiteData): SiteData {
  const o = obj(v)
  const defaults = fallback?.settings ?? EMPTY_SETTINGS
  return {
    app: 'adeebtechlab-video',
    version: 1,
    updatedAt: num(o.updatedAt),
    settings: normalizeSettings(o.settings, defaults),
    categories: arr(o.categories).map(normalizeCategory),
    videos: arr(o.videos).map(normalizeVideo),
    services: arr(o.services).map(normalizeService),
    tools: arr(o.tools).map(normalizeTool),
  }
}

const EMPTY_SETTINGS: SiteSettings = {
  companyName: 'Adeeb Tech Lab',
  founderName: '',
  founderRole: '',
  founderImage: '',
  logo: '',
  email: '',
  whatsappNumber: '923092333121',
  whatsappMessage: '',
  location: '',
  mapUrl: '',
  website: '',
  socials: [],
  skills: [],
  process: [],
  values: [],
  faqs: [],
  comparison: { before: '', after: '', label: '' },
}

export function isSiteData(v: unknown) {
  const o = obj(v)
  return o.app === 'adeebtechlab-video' && Array.isArray(o.videos) && Array.isArray(o.categories)
}
