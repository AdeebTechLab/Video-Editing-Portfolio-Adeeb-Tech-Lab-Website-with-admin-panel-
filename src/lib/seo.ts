import { useEffect } from 'react'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from '../config/site'
import { getSite } from '../store/siteStore'

interface SeoOptions {
  title?: string
  description?: string
  path?: string
  noindex?: boolean
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Sets the page title, description and robots tag, and the canonical link when VITE_SITE_URL is set.
 * The link-preview tags in index.html are left as they are.
 */
export function useSeo({ title, description, path, noindex }: SeoOptions) {
  useEffect(() => {
    const company = getSite().settings.companyName
    document.title = title ? `${title} | ${company}` : DEFAULT_TITLE
    setMeta('name', 'description', (description || DEFAULT_DESCRIPTION).slice(0, 300))
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    if (SITE_URL && path !== undefined) setCanonical(`${SITE_URL}${path}`)
  }, [title, description, path, noindex])
}
