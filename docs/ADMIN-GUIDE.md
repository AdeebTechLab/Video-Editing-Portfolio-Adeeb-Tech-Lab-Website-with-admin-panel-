# Admin guide

## Open the admin panel

Click the **©** sign at the bottom of the portfolio, or go to `yourwebsite.com/admin`.

On the first login, use:

- **Email:** `info@adeebtechlab.com`
- **Password:** `tech123`

After signing in, open **Admin credentials** to choose a new email and password. The new password must have at least 8 characters. The updated credentials are kept in the current browser; clearing the site's browser storage restores the initial login. The public static site contains the initial login code, so this browser-side gate is not suitable for protecting confidential data.

Changes save automatically **in the browser you're using**. Visitors see them only after you publish (see the last section).

## Add a video

1. **Video projects › Add video.**
2. Paste the **Video link**:
   - YouTube: a normal watch link, a `youtu.be` share link, a Shorts or live link. The thumbnail is added automatically.
   - Vimeo: a link ending with the video number, for example `https://vimeo.com/123456789`.
   - MP4: put the file in the project's `public/videos/` folder and use `/videos/file-name.mp4`.
3. Add the **Title**, **Description** and **Category**. Choose **+ New category…** to create a category while adding the video.
4. Optional: a **Duration** (for example 2:45) and your own **Thumbnail** image. Vimeo and MP4 videos need a thumbnail.
5. Select **Publish**, or **Save draft** to finish later. **Play preview** plays the video as visitors will see it.

Tips:
- YouTube and Vimeo videos must be public or unlisted and allow embedding.
- **Featured** videos are shown first when visitors filter by their category.
- Turn on **Original sample** for demonstration films that are not client work.

## Manage videos

On **Video projects** you can:
- switch **Published / Draft**
- mark as **featured** (star)
- **play** a preview or **copy** the video link
- **duplicate**, **edit** or **delete**
- change the order with the small arrows (clear filters first). New videos are added at the top.

Under **All Projects**, the website shows the first video of each category in this order. Selecting a category shows all of its videos.

## Categories

**Categories** are the filter buttons in Selected Work, in the order listed. A category appears on the website once it has a published video; **All Projects** is always added first. When you delete a category that has videos, choose another category to move them to.

## Services

**Services** lists the editing services in the Services section. Each has a name, a small label (for example “Discuss your brief”), a short description, an icon and a preview picture (about 3:2). Use the arrows to change the order.

## Editing tools & skills

**Editing tools & skills** controls “The tools behind the creativity”: the software cards (logo, accent colour, description, shown or hidden) and the skills list under them. Select **Save skills** after changing the skills.

## Site content

**Site content** edits the company name, email, WhatsApp number and message, location and Google Maps link, website, logo, the founder's photo, name and role, the social links in the footer, the process steps, the “why us” points, the FAQs and the before & after pictures. Select **Save changes** at the bottom.

## Publish your changes

1. **Publish & backup › Download publish file.** You get `site-data.json`.
2. In the project folder, replace `src/data/site-data.json` with that file.
3. Redeploy the website. On Vercel, push to GitHub and it rebuilds automatically.

After that, every visitor sees your changes.

## Backups and other computers

- **Download backup** saves everything, including drafts. Do it before big changes.
- **Import from a file** loads a backup or a publish file into the browser, for example to continue editing on another computer.
- **Discard changes** returns this browser to the published version.

## Images and storage

Uploaded images are resized and saved in the browser, which holds about 5 MB. The storage bar on the dashboard shows how much is used. For many or large images, use **Or paste an image link** instead, with hosted image links or files placed in the project's `public/images/` folder (link them as `/images/file-name.jpg`).
