# Adeeb Technology Lab — cinematic video portfolio

A complete, single-page Next.js / React / TypeScript website. Local-only delivery; nothing has been published.

## Run

Use Node.js 20.9 or newer. In the project directory:

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. Run `npm run typecheck` and `npm run build` for verification. After building, `npm run start` runs the included local production preview server, with byte-range support for video seeking. The production build exports the static site to `out/`; upload that directory to a static hosting provider. On Vercel, import the source directory using the Next.js preset. No secrets or backend are required.

Set `NEXT_PUBLIC_SITE_URL=https://your-final-domain.example` before building to enable the canonical URL and absolute Open Graph URLs. Leave it unset during local development; the official company website is not assumed to be the deployment URL of this portfolio. A local 1200 × 630 JPEG social preview is already included at `/images/social.jpg`.

## Edit the content

`src/data/portfolio.ts` centralizes company contacts, founder image, logo, project data, categories, proposed services, tools, skills, process stages, FAQs, social links, and comparison images. `src/components/Portfolio.tsx` contains the page composition and editorial copy; `Contact.tsx`, `Timeline.tsx`, `VideoModal.tsx`, and `ui.tsx` separate the main reusable interactions. `src/app/globals.css` contains the design system, responsive layouts, and reduced-motion rules. SEO is in `src/app/layout.tsx`.

### Replace demo films

All five current films are original, silent abstract motion studies generated for this website. They are explicitly labeled **Original sample**, not client projects or a genuine company showreel. The hero and featured showreel currently use the first project. Replace that first entry with an approved company reel when available.

Each project supports `id`, `title`, `category`, `description`, `thumbnail`, `videoUrl`, `videoType`, `duration`, `featured`, and `isDemo`. Add or remove entries in `projects`; gallery filters are generated from `categories`.

- MP4: put an approved H.264 MP4 in `public/videos/`, use `/videos/filename.mp4`, and set `videoType: 'mp4'`.
- YouTube: use a normal watch URL, `youtu.be` URL, or embed URL; set `videoType: 'youtube'`.
- Vimeo: use a numeric Vimeo video URL; set `videoType: 'vimeo'`. Private/restricted videos may need public embed permission.
- Store poster assets in `public/images/` and use their `/images/...` path. Use consistent aspect ratios and optimized WebP/JPEG files.
- Set `isDemo: false` only for genuine approved company work. Change all sample disclosure copy in the component when the collection becomes authentic. Change the source of the captions track for clips containing speech.
- Duration is editable and never inferred. The current samples are eight seconds each.

The comparison currently applies two different CSS color treatments to the **same original graphic**. It is explicitly a sample illustration. Replace both `comparison` paths with authentic matching before/after stills, remove the illustrative CSS filters in `.comparison .before` and `.comparison .after img`, and update the disclosure. Matching video comparison is not included because no authentic paired clips were available.

## Contact behavior

The form validates the name, email, format and description, then prepares a draft with all fields. The visitor chooses **Open email draft**, **Open WhatsApp draft**, or **Copy inquiry text**. No request is sent to a backend, no message is automatically sent, and there is no simulated success confirmation. A hidden honeypot rejects basic automated input. Native field validation reports invalid/missing inputs. The brief's loading state is represented while the local draft is prepared; there is no network submission to wait for. Real delivery needs a separate server/provider integration and credentials.

## Verified content and assets

Research date: October 14, 2026 (Asia/Karachi).

- https://adeebtechlab.com/ confirms the name and links to the company website and founder portfolio.
- https://adeeb-technology-lab-website.vercel.app/ confirms video editing and graphic design offerings, Salman Adeeb as CEO/video editor, `info.AdeebTechLab@gmail.com`, `+92 3092333121`, and Bahawalpur/Islamabad presence. The selected inquiry number is listed as Islamabad in the contact section and as the main number in the footer. Bahawalpur is a verified company location; this site does not label the selected number a Bahawalpur branch number.
- https://portfolio-website-single-page-3-d.vercel.app/ confirms Premiere Pro CC, CapCut, Camtasia Studio, Filmora, green screen work, and video/animation experience. No skill percentages, credentials or employment dates were carried into this portfolio.
- CEO is verified; the founder wording comes from the supplied user brief, not a separate explicit founder statement found in these pages.
- Company social links were extracted from the official company site's footer: Instagram, LinkedIn, Facebook, TikTok and YouTube. Account content and platform verification badges are not independently certified.
- `public/images/logo.png` was downloaded from the Cloudinary logo linked by the official company site: https://res.cloudinary.com/adeeb-tech-lab/image/upload/v1757196590/Company%20Logo/512_exyyiy.png
- `public/images/founder.png` was downloaded from the founder portfolio's own image: https://portfolio-website-single-page-3-d.vercel.app/assets/salman2.png
- Original SVG art and generated MP4s are supplied with this project. No third-party commercial stock footage, customer logos, invented testimonials or project statistics are used. The official sites contain educational video links, but these were not represented as an editing showreel or completed client work.

Video editing is verified as a broad offering. The more specific service formats are marked as proposed scopes to discuss. Additional software such as After Effects and DaVinci Resolve was not claimed as a verified skill.

## Accessibility and performance

Semantic sections, skip link, labeled inputs, native details accordions and range sliders, visible focus, native video controls, captions for the silent demo, dialog focus containment/Escape close/focus restoration, mobile navigation, and reduced-motion support are included. Only the opened film loads as a video; gallery images are lazy loaded. Custom cursor is a nonblocking supplementary indicator on pointer devices and is disabled on touch/reduced motion. Google Fonts has a system-font fallback. No autoplay with sound, analytics or visitor-data storage.

Before production: replace samples with approved portfolio media, confirm proposed service scopes, choose a canonical domain, and confirm continuing permission to use the supplied company assets.

## Admin panel

Open `/admin` to manage YouTube portfolio videos. Add a link, title, description and category; preview before publishing. Added videos appear in Selected Work, can be edited or removed, and are saved in `data/projects.json`. YouTube videos must permit embedding; the player also provides a YouTube link.

The admin password is stored as a salted hash in `data/admin.json`. Keep the `data` folder private and backed up. Initial password setup is available only through localhost. The folder is excluded from Git.

This portfolio now requires a running Node.js server (`npm run build`, then `npm start`) and writable persistent storage for `data`. A static-only upload does not support the admin panel. Multiple server instances require shared storage and authentication.
