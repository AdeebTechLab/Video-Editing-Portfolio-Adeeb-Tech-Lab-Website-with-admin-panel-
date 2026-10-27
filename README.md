# Adeeb Technology Lab — Video Editing Portfolio

Cinematic single-page video editing portfolio for Adeeb Tech Lab, built with **Vite, React, TypeScript and Tailwind CSS**, like the Adeeb Technology Lab web portfolio. It includes an in-browser admin panel and is a front-end-only project for static hosting such as Vercel. There is no server, database or API.

## Features

- One-page portfolio: hero, showreel, about, services, Selected Work, editing timeline, tools and skills, process, before/after comparison, why us, FAQ and contact.
- Selected Work with category filters and an in-page video player for YouTube, Vimeo and MP4 videos.
- Contact form that prepares an email or WhatsApp draft (nothing is sent by the site).
- Mobile navigation, skip link, reduced-motion support, custom cursor on pointer devices.
- Admin panel at `/admin` to manage videos, categories, thumbnails, services, editing tools, skills and site content, with publish and backup tools.

## Admin panel

Open `/admin` or use the small **©** link in the footer. The first login is the same as on the web portfolio:

| Field | Initial value |
| --- | --- |
| Email | `info@adeebtechlab.com` |
| Password | `tech123` |

After signing in, go to **Admin credentials** to change the email and password. A new password must be at least 8 characters. Updated credentials are saved in that browser; clearing the site's browser storage resets them to the initial values.

> **Security note:** This is a static, front-end-only project. The initial login code is included in the public JavaScript, and browser-only checks can be bypassed by someone with technical access. The login is a convenience gate, not secure production authentication. Do not use it to protect confidential information.

### Admin pages

| Page | What it manages |
| --- | --- |
| Dashboard | Counts, recently updated videos, publishing status and browser storage |
| Video projects | Add, edit, duplicate, delete, publish/draft, feature, reorder, preview and copy video links |
| Categories | The Selected Work filters: add, rename, reorder, delete (videos move to another category) |
| Services | The services list, with icon, label, description and preview picture |
| Editing tools & skills | Tool cards (logo, colour, description, show/hide, order) and the skills list |
| Site content | Company and contact details, logo, founder, social links, process, why us, FAQs, before & after pictures |
| Publish & backup | Download the publish file, back up, import or discard browser changes |
| Admin credentials | Change the admin email and password for this browser |

Videos can be YouTube links (watch, Shorts, share or live links — the thumbnail is added automatically), Vimeo links, or MP4 files placed in `public/videos/` (linked as `/videos/file-name.mp4`). Vimeo and MP4 videos need a thumbnail image. The first video of each category is shown under **All Projects**; a category shows all its videos, featured ones first.

Content edits are stored in the current browser. To publish them, use **Publish & backup › Download publish file**, replace `src/data/site-data.json` with the downloaded file, then commit and deploy the change. Uploaded images count toward browser storage (commonly about 5 MB); for larger images use links, or files in `public/images/` (linked as `/images/file-name.jpg`). See `docs/ADMIN-GUIDE.md` for step-by-step help.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. The admin panel is at <http://localhost:5173/admin>.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite with live reload |
| `npm run typecheck` | Run TypeScript checks |
| `npm run build` | Type-check and build the production site in `dist/`; also refresh `public/robots.txt` (and the sitemap when `VITE_SITE_URL` is set) |
| `npm run preview` | Preview the production build locally |

## GitHub and Vercel deployment

1. Push this project folder to GitHub. The `.gitignore` excludes `node_modules`, build output, local environment files and deployment metadata.
2. In Vercel, import the repository. `vercel.json` sets the Vite build, the `dist` output folder and the single-page-app rewrites, so `/admin` works on refresh. (`public/_redirects` does the same on Netlify.)
3. Optionally set `VITE_SITE_URL` to the public address (see `.env.example`) to add the canonical link and `sitemap.xml`. Leave it empty until the final domain is known; the official company website is not assumed to be this portfolio's address.
4. Add the custom domain in Vercel project settings if needed.

The previous Next.js version stored admin data in Upstash Redis through API routes. That backend has been removed: no Redis connection or environment variables are needed any more, and the videos it held are included in `src/data/site-data.json`.

## Project structure

```text
index.html                    Page title, link preview, fonts and the area/theme script
src/main.tsx, src/App.tsx     App entry and routes (/ and /admin/…)
src/data/site-data.json       Published content (videos, categories, services, tools, site content)
src/store/                    Content loading and browser-side admin changes
src/config/site.ts            Fixed settings: navigation, the sample films used by the timeline and footer
src/styles/portfolio.css      The portfolio's design system, responsive layouts and reduced-motion rules
src/index.css                 Tailwind setup and the admin panel theme
src/components/layout/        Public header, footer and layout; admin logo
src/components/sections/      Home page sections, including FAQ and contact
src/components/admin/         Admin form controls, image inputs and video preview
src/pages/                    Home and not-found pages
src/pages/admin/              Admin login and management pages
src/lib/adminAuth.ts          Browser-side admin login and credential handling
scripts/sitemap.ts            robots.txt / sitemap generation during production builds
docs/ADMIN-GUIDE.md           Admin usage guide
```

### How the styles fit together

The public portfolio keeps its original hand-written stylesheet, `src/styles/portfolio.css`; the admin panel uses Tailwind, as on the web portfolio. `index.html` and the layouts mark `<html>` with `data-area="site"` or `data-area="admin"`:

- Element rules in `portfolio.css` (for `body`, `header`, `h2`…) are limited to the public pages with `:where([data-area="site"])`, which adds no specificity, so the portfolio cascade is unchanged.
- The last rule of Tailwind's base layer in `src/index.css` resets Tailwind's base styles on the public pages (`all: revert-layer`), so properties the portfolio does not set keep their browser defaults.

Keep new public styles in `portfolio.css` and new admin styles as Tailwind classes.

## Edit the content

Most content is edited in the admin panel and stored in `src/data/site-data.json`. Editorial copy (section headings, hero and about text) is in `src/components/sections/`. The five original motion samples used by the editing timeline and the footer film strip are in `src/config/site.ts`; their posters are in `public/images/`.

### Sample films and Selected Work

The five sample films are original, silent abstract motion studies, explicitly labelled **Original sample**, not client projects. Selected Work shows the videos managed in the admin panel. Mark a video as **Original sample** in the editor when it is a demonstration rather than client work; the card and player then say so.

The comparison applies two different CSS colour treatments to the **same original graphic**. It is explicitly a sample illustration. Replace both pictures in **Site content › Before & after** with authentic matching before/after stills, remove the illustrative CSS filters in `.comparison .before` and `.comparison .after img`, and update the disclosure text in `src/components/sections/HomeSections.tsx`.

## Contact behavior

The form validates the name, email, format and description, then prepares a draft with all fields. The visitor chooses **Open email draft**, **Open WhatsApp draft**, or **Copy inquiry text**. No request is sent to a backend, no message is automatically sent, and there is no simulated success confirmation. A hidden honeypot rejects basic automated input. Real delivery needs a separate provider integration and credentials.

## Verified content and assets

Research date: October 14, 2026 (Asia/Karachi).

- https://adeebtechlab.com/ confirms the name and links to the company website and founder portfolio.
- https://adeeb-technology-lab-website.vercel.app/ confirms video editing and graphic design offerings, Salman Adeeb as CEO/video editor, `info.AdeebTechLab@gmail.com`, `+92 3092333121`, and Bahawalpur/Islamabad presence.
- https://portfolio-website-single-page-3-d.vercel.app/ confirms Premiere Pro CC, CapCut, Camtasia Studio, Filmora, green screen work, and video/animation experience. No skill percentages, credentials or employment dates were carried into this portfolio.
- Company social links were extracted from the official company site's footer: Instagram, LinkedIn, Facebook, TikTok and YouTube.
- `public/images/logo.png` was downloaded from the Cloudinary logo linked by the official company site.
- No third-party commercial stock footage, customer logos, invented testimonials or project statistics are used.

Video editing is verified as a broad offering. The more specific service formats are marked as proposed scopes to discuss.

## Accessibility and performance

Semantic sections, skip link, labelled inputs, native details accordions and range sliders, visible focus, native video controls, captions for the silent demo, dialog focus containment/Escape close/focus restoration, mobile navigation, and reduced-motion support are included. Only the opened film loads as a video; gallery images are lazy loaded. The admin panel loads only when `/admin` is opened. No autoplay with sound, analytics or visitor-data storage on the public site.

## Before publishing

- Add the link-preview image `public/images/social.jpg` (1200 × 630). `index.html` refers to it, but the file is not in the project yet.
- Replace samples with approved portfolio media, confirm proposed service scopes, and confirm continuing permission to use the supplied company assets.
- Change the initial admin credentials for your browser.
