import { Globe } from 'lucide-react'
import { siFacebook, siGithub, siInstagram, siPinterest, siSnapchat, siThreads, siTiktok, siVimeo, siWhatsapp, siX, siYoutube } from 'simple-icons'

const PATHS: Record<string, string> = {
  whatsapp: siWhatsapp.path,
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  github: siGithub.path,
  youtube: siYoutube.path,
  vimeo: siVimeo.path,
  x: siX.path,
  twitter: siX.path,
  tiktok: siTiktok.path,
  threads: siThreads.path,
  pinterest: siPinterest.path,
  snapchat: siSnapchat.path,
}

/** The icon key for a social link name, for example “LinkedIn” → linkedin. Unknown names show a globe. */
export const socialIconKey = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '')

export function BrandIcon({ name, className = 'size-5', title }: { name: string; className?: string; title?: string }) {
  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
        {title && <title>{title}</title>}
        <circle cx="4.98" cy="4.98" r="2.48" />
        <rect x="2.88" y="8.98" width="4.2" height="12.02" rx="0.3" />
        <path d="M9.58 8.98h4.03v1.76h.06c.56-1.06 1.93-2.06 3.97-2.06 4.25 0 5.03 2.67 5.03 6.14V21h-4.2v-5.59c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V21H9.58z" />
      </svg>
    )
  }
  const path = PATHS[name]
  if (!path) return <Globe className={className} aria-hidden="true" />
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <path d={path} />
    </svg>
  )
}
