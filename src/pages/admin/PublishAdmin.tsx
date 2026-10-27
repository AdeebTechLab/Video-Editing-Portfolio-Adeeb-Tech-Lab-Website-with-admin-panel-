import { useRef, useState } from 'react'
import { CircleCheck, Download, RotateCcw, TriangleAlert, Upload } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import type { SiteData } from '../../lib/types'
import { downloadFile } from '../../lib/utils'
import { normalizeSiteData, isSiteData } from '../../store/normalize'
import { differsFromPublished, discardLocalChanges, getPublished, isStoragePersistent, publishData, publishedIsNewer, replaceSite, useHasLocalChanges, useSite } from '../../store/siteStore'
import { ConfirmDialog, PageHeader, Switch } from '../../components/admin/ui'
import { StorageMeter } from './Dashboard'

export default function PublishAdmin() {
  const site = useSite()
  const hasLocal = useHasLocalChanges()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [includeDrafts, setIncludeDrafts] = useState(true)
  const [pending, setPending] = useState<SiteData | null>(null)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const unpublished = hasLocal && differsFromPublished(site)
  const newer = publishedIsNewer()
  const drafts = site.videos.filter((v) => !v.published).length

  const downloadPublish = () => {
    downloadFile('site-data.json', JSON.stringify(publishData(includeDrafts), null, 2) + '\n')
    toast('Downloaded site-data.json. Now replace the file in your project (step 2).')
  }

  const downloadBackup = () => {
    downloadFile(`adeebtechlab-video-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(publishData(true), null, 2) + '\n')
    toast('Backup downloaded. Keep it somewhere safe.')
  }

  const readFile = async (file: File) => {
    try {
      const raw: unknown = JSON.parse(await file.text())
      if (!isSiteData(raw)) throw new Error('This file isn’t a website data file. Choose a site-data.json or backup file downloaded from this page.')
      setPending(normalizeSiteData(raw, getPublished()))
    } catch (err) {
      toast(err instanceof SyntaxError ? 'This file couldn’t be read. Choose a .json file.' : err instanceof Error ? err.message : 'Import failed.', 'error')
    }
  }

  const restore = () => {
    if (!pending) return
    const result = replaceSite(pending)
    if (result.ok) {
      toast(`Imported ${pending.videos.length} videos. Publish to show them to visitors.`)
      setPending(null)
    } else toast(result.error, 'error')
  }

  return (
    <>
      <PageHeader title="Publish & backup" description="Your admin changes are saved in this browser. Publishing puts them on the live website for everyone." />

      <div className={unpublished ? 'card mb-6 border-accent/60 p-5' : 'card mb-6 p-5'}>
        <p className="flex items-start gap-3 text-sm">
          {unpublished ? (
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden="true" />
          ) : (
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          )}
          <span className="text-ink">
            {unpublished ? (
              <>
                <span className="font-semibold">You have unpublished changes.</span> They show in this browser only. Follow the 3 steps below to put them live.
              </>
            ) : (
              <>
                <span className="font-semibold">Everything is published.</span> This browser shows the same content as the live website.
              </>
            )}
          </span>
        </p>
        {newer && (
          <p className="mt-3 rounded-lg bg-info-soft px-3 py-2 text-sm text-ink">
            A newer version was published after you started editing here. To work from it, select “Discard changes in this browser” below (download a backup first if you need your changes).
          </p>
        )}
        {!isStoragePersistent() && (
          <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">This browser is blocking storage (for example a private window). Changes will be lost when you close the tab, so download a backup now.</p>
        )}
      </div>

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">Publish your changes</h2>
        <ol className="mt-5 space-y-6">
          <li className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-on-accent">1</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-ink">Download the publish file</h3>
              <p className="mt-1 text-sm text-ink-muted">A file named site-data.json with all your videos, categories, services, editing tools and site content.</p>
              {drafts > 0 && (
                <div className="mt-3 max-w-md">
                  <Switch checked={includeDrafts} onChange={setIncludeDrafts} label={`Include ${drafts} draft video${drafts === 1 ? '' : 's'}`} description="Drafts stay hidden on the website either way." />
                </div>
              )}
              <button type="button" className="btn btn-primary mt-4" onClick={downloadPublish}>
                <Download className="size-4" aria-hidden="true" />
                Download publish file
              </button>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-on-accent">2</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-ink">Replace the file in the project</h3>
              <p className="mt-1 text-sm text-ink-muted">
                In the project folder, open <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.8rem] text-accent-text">src/data</code> and replace{' '}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.8rem] text-accent-text">site-data.json</code> with the file you downloaded.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-on-accent">3</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-ink">Redeploy the website</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Push the change to GitHub (Vercel rebuilds automatically), or run <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.8rem] text-accent-text">npm run build</code> and upload the dist folder. After that, every visitor sees your changes.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="card flex flex-col p-5 sm:p-6">
          <Download className="size-6 text-accent-text" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-ink">Download backup</h2>
          <p className="mt-1 flex-1 text-sm text-ink-muted">Saves everything, including drafts, to a dated file. Do it before big changes and keep it safe.</p>
          <button type="button" className="btn btn-outline mt-5 self-start" onClick={downloadBackup}>
            Download backup
          </button>
        </section>
        <section className="card flex flex-col p-5 sm:p-6">
          <Upload className="size-6 text-accent-text" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-ink">Import from a file</h2>
          <p className="mt-1 flex-1 text-sm text-ink-muted">Load a backup or a site-data.json file into this browser, for example to continue editing on another computer.</p>
          <button type="button" className="btn btn-outline mt-5 self-start" onClick={() => fileRef.current?.click()}>
            Choose file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void readFile(f)
              e.target.value = ''
            }}
          />
        </section>
        <section className="card p-5 sm:p-6">
          <StorageMeter />
        </section>
        <section className="card flex flex-col p-5 sm:p-6">
          <RotateCcw className="size-6 text-accent-text" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-ink">Discard changes in this browser</h2>
          <p className="mt-1 flex-1 text-sm text-ink-muted">Go back to the published version. Changes you haven’t published will be lost.</p>
          <button type="button" className="btn btn-outline mt-5 self-start text-danger" onClick={() => setConfirmDiscard(true)} disabled={!hasLocal}>
            Discard changes
          </button>
        </section>
      </div>

      {pending && (
        <ConfirmDialog
          title="Replace the content in this browser?"
          message={<>The file has {pending.videos.length} videos, {pending.categories.length} categories, {pending.services.length} services and {pending.tools.length} editing tools. It will replace what this browser has now.</>}
          confirmLabel="Import file"
          onConfirm={restore}
          onCancel={() => setPending(null)}
        />
      )}
      {confirmDiscard && (
        <ConfirmDialog
          title="Discard your changes?"
          message="This browser will go back to the published version. Download a backup first if you might need your changes."
          confirmLabel="Discard changes"
          onConfirm={() => {
            discardLocalChanges()
            setConfirmDiscard(false)
            toast('Back to the published version.')
          }}
          onCancel={() => setConfirmDiscard(false)}
        />
      )}
    </>
  )
}
