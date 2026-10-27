import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeSitemap } from './scripts/sitemap'

/** Writes sitemap.xml and robots.txt at the start of every production build. */
function sitemap(mode: string): Plugin {
  return {
    name: 'atl-sitemap',
    apply: 'build',
    buildStart() {
      const env = loadEnv(mode, process.cwd(), 'VITE_')
      writeSitemap(env.VITE_SITE_URL || '')
    },
  }
}

// `npm run build` → production build for static hosting (Vercel, Netlify, Firebase Hosting).
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), sitemap(mode)],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 900,
  },
}))
