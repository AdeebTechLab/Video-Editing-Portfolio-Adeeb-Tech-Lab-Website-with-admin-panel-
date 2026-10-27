# Verification

Verified on October 26, 2026 after moving the portfolio to Vite + React + TypeScript + Tailwind CSS and adding the browser-based admin panel.

## Build

- `npm ci` and `npm run build` (TypeScript project check + Vite production build) pass from a clean install. `npm audit` reports 0 vulnerabilities.
- `npm run dev` serves the portfolio and `/admin` without console errors. `vite preview` serves deep links such as `/admin/projects` (single-page-app fallback; `vercel.json` and `public/_redirects` do the same when hosted).

## Design unchanged

The previous Next.js build and the new build were opened side by side in Chromium at 1440 × 900, 820 × 1180 and 390 × 844, with external requests blocked for both and reduced motion on. For each width, these states were compared: page loaded and scrolled through, a category filter selected, a service selected, FAQ opened + comparison slider moved + contact form prepared, mobile menu opened, and the video player opened.

For every element (and its `::before`/`::after`), the tag, attributes, text, position, size and every computed CSS property were compared, plus full-page screenshots.

- All elements, text and computed styles match, except the intended footer change: the © sign is now the hidden admin link (as on the web portfolio) and the separate “Admin” text link is gone.
- Screenshots differ only in that footer line (plus a 1-pixel row at the edge of the blocked YouTube frame in one tablet capture, with identical computed styles).
- The same comparison passes after opening the admin first and then returning to the portfolio without a page reload, and the admin login looks the same whether opened directly or from the footer link.
- Remaining non-visual differences: the order of the `<head>` tags, a `#root` wrapper element, and an equivalent gradient value written differently by the new CSS minifier.

## Admin panel

An automated browser run covered:

- `/admin` pages redirect to the login; a wrong password is refused; `info@adeebtechlab.com` / `tech123` signs in.
- Dashboard counts (19 published videos, 7 categories, 9 services, 3 tools).
- Video list search and preview player; adding a YouTube video with a new category (normalised link, automatic thumbnail, first position); duplicate links refused; Vimeo videos require a thumbnail.
- The public site in another tab updates immediately: new category filter, new video first under All Projects, category hidden when its only video becomes a draft.
- Categories: rename, duplicate names refused, reorder, delete with its videos moved to another category.
- Services edit, tool hide/show, skills, site content (email) reflected on the public site.
- Publish file download (valid `site-data.json` containing the changes), discard changes, import from file.
- Light/dark theme; credential change, sign out and sign in with the new password.
- Mobile (390 px): dashboard, menu, video list and editor without horizontal scrolling.
- Missing video in the admin and unknown public URLs show friendly messages.
- No console errors during the run.

The Adeeb Technology Lab web portfolio, used as the reference, was only read: its archive checksum and all 76 extracted files were unchanged at the end.
