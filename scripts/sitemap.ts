// Writes public/robots.txt (and public/sitemap.xml when the live address is known) at the start of every
// production build. The portfolio is a single page, so the sitemap lists the home page only.
// Set VITE_SITE_URL (see .env.example) to include the sitemap.
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'

export function writeSitemap(siteUrl: string) {
  const site = siteUrl.trim().replace(/\/$/, '')
  mkdirSync('public', { recursive: true })

  if (!site) {
    if (existsSync('public/sitemap.xml')) rmSync('public/sitemap.xml')
    writeFileSync('public/robots.txt', 'User-agent: *\nAllow: /\nDisallow: /admin\n')
    console.log('[sitemap] VITE_SITE_URL is not set: wrote public/robots.txt without a sitemap.')
    return
  }

  const today = new Date().toISOString().slice(0, 10)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
</urlset>
`
  const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${site}/sitemap.xml
`
  writeFileSync('public/sitemap.xml', xml)
  writeFileSync('public/robots.txt', robots)
  console.log('[sitemap] Wrote public/sitemap.xml and public/robots.txt')
}
