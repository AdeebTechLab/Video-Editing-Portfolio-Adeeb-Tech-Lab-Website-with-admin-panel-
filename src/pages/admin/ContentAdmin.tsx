import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash } from 'lucide-react'
import { useSave } from '../../hooks/useSave'
import type { SiteSettings } from '../../lib/types'
import { canonicalJson, safeUrl } from '../../lib/utils'
import { useSite } from '../../store/siteStore'
import { RoundImageInput, WideImageInput } from '../../components/admin/ImageInputs'
import { Field, PageHeader, Panel } from '../../components/admin/ui'

const SECTIONS = [
  { id: 'company', label: 'Company & contact' },
  { id: 'founder', label: 'Founder' },
  { id: 'socials', label: 'Social links' },
  { id: 'process', label: 'Process' },
  { id: 'values', label: 'Why us' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'comparison', label: 'Before & after' },
]

function moveItem<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [x] = next.splice(from, 1)
  next.splice(to, 0, x!)
  return next
}

/** Up, down and remove buttons for one row of a list. */
function RowButtons({ index, count, label, onMove, onRemove }: { index: number; count: number; label: string; onMove: (to: number) => void; onRemove: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      <button type="button" className="btn btn-ghost btn-icon size-8 min-h-8" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label={`Move ${label} up`}>
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className="btn btn-ghost btn-icon size-8 min-h-8" onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label={`Move ${label} down`}>
        <ArrowDown className="size-4" />
      </button>
      <button type="button" className="btn btn-ghost btn-icon size-8 min-h-8 text-danger" onClick={onRemove} aria-label={`Remove ${label}`}>
        <Trash className="size-4" />
      </button>
    </div>
  )
}

function NumberedRow({ n, children, buttons }: { n: number; children: ReactNode; buttons: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-xl border border-line p-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-accent text-xs font-extrabold text-accent-text">{n}</span>
      <div className="min-w-0 flex-1 space-y-2">{children}</div>
      {buttons}
    </li>
  )
}

export default function ContentAdmin() {
  const site = useSite()
  const save = useSave()
  const [form, setForm] = useState<SiteSettings>(site.settings)
  const [error, setError] = useState('')
  const savedRef = useRef(canonicalJson(site.settings))
  const dirty = useMemo(() => canonicalJson(form) !== savedRef.current, [form])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setForm((f) => ({ ...f, [k]: v }))
  const setComparison = <K extends keyof SiteSettings['comparison']>(k: K, v: SiteSettings['comparison'][K]) => setForm((f) => ({ ...f, comparison: { ...f.comparison, [k]: v } }))

  const submit = () => {
    setError('')
    const number = form.whatsappNumber.replace(/\D/g, '')
    if (!form.companyName.trim()) return setError('Add the company name.')
    if (number.length < 10) return setError('Enter the WhatsApp number with country code, for example 923092333121.')
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Enter a valid email address.')
    if (form.socials.some((s) => s.url.trim() && !s.name.trim())) return setError('Give every social link a name.')
    if (!form.comparison.before || !form.comparison.after) return setError('Add both before & after pictures.')
    const clean: SiteSettings = {
      ...form,
      companyName: form.companyName.trim(),
      whatsappNumber: number,
      email: form.email.trim(),
      website: safeUrl(form.website) || form.website.trim(),
      mapUrl: safeUrl(form.mapUrl) || form.mapUrl.trim(),
      socials: form.socials.filter((s) => s.url.trim()).map((s) => ({ name: s.name.trim(), url: safeUrl(s.url) || s.url.trim() })),
      process: form.process.filter((p) => p.title.trim()).map((p) => ({ title: p.title.trim(), text: p.text.trim() })),
      values: form.values.map((v) => v.trim()).filter(Boolean),
      faqs: form.faqs.filter((f) => f.question.trim()).map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })),
    }
    if (save((d) => ({ ...d, settings: clean }), 'Site content saved.')) {
      savedRef.current = canonicalJson(clean)
      setForm(clean)
    }
  }

  return (
    <>
      <PageHeader title="Site content" description="Edit the company details, founder, social links, process steps, FAQs and before & after pictures shown on the portfolio." />
      <nav aria-label="Sections" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => document.getElementById(`c-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="chip shrink-0 py-1.5 hover:border-accent hover:text-ink"
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="space-y-6">
        <Panel id="c-company" title="Company & contact" description="Used in the header, contact section, WhatsApp buttons and footer.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company name" required htmlFor="g-name">
              <input id="g-name" className="input" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
            </Field>
            <Field label="Email" htmlFor="g-email">
              <input id="g-email" type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field label="WhatsApp number" required htmlFor="g-whatsapp" hint="Digits only, with country code, for example 923092333121.">
              <input id="g-whatsapp" className="input" inputMode="numeric" value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} />
            </Field>
            <Field label="Official website" htmlFor="g-website">
              <input id="g-website" className="input" inputMode="url" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
            </Field>
          </div>
          <Field label="WhatsApp message" htmlFor="g-message" hint="Filled in when visitors select WhatsApp in the contact section.">
            <input id="g-message" className="input" value={form.whatsappMessage} onChange={(e) => set('whatsappMessage', e.target.value)} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Location" htmlFor="g-location">
              <input id="g-location" className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Bahawalpur, Pakistan" />
            </Field>
            <Field label="Google Maps link" htmlFor="g-map">
              <input id="g-map" className="input" inputMode="url" value={form.mapUrl} onChange={(e) => set('mapUrl', e.target.value)} placeholder="https://maps.app.goo.gl/…" />
            </Field>
          </div>
          <Field label="Logo" hint="Shown in the header and the admin panel.">
            <RoundImageInput value={form.logo} onChange={(v) => set('logo', v)} label="logo" />
          </Field>
        </Panel>

        <Panel id="c-founder" title="Founder" description="The photo and name label in the About section.">
          <Field label="Photo">
            <RoundImageInput value={form.founderImage} onChange={(v) => set('founderImage', v)} label="photo" photo />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="f-name">
              <input id="f-name" className="input" value={form.founderName} onChange={(e) => set('founderName', e.target.value)} />
            </Field>
            <Field label="Role" htmlFor="f-role">
              <input id="f-role" className="input" value={form.founderRole} onChange={(e) => set('founderRole', e.target.value)} placeholder="Founder / CEO" />
            </Field>
          </div>
        </Panel>

        <Panel id="c-socials" title="Social links" description="Shown as text links in the footer.">
          <ol className="space-y-2">
            {form.socials.map((s, i) => (
              <li key={i} className="flex gap-2 rounded-xl border border-line p-3">
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[160px_1fr]">
                  <input className="input" aria-label={`Name for link ${i + 1}`} placeholder="Instagram" value={s.name} onChange={(e) => set('socials', form.socials.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} />
                  <input className="input" aria-label={`Address for link ${i + 1}`} placeholder="https://" inputMode="url" value={s.url} onChange={(e) => set('socials', form.socials.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)))} />
                </div>
                <RowButtons index={i} count={form.socials.length} label={`link ${i + 1}`} onMove={(to) => set('socials', moveItem(form.socials, i, to))} onRemove={() => set('socials', form.socials.filter((_, k) => k !== i))} />
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => set('socials', [...form.socials, { name: '', url: '' }])}>
            <Plus className="size-4" aria-hidden="true" />
            Add link
          </button>
        </Panel>

        <Panel id="c-process" title="Process" description="The steps in “From raw footage to final masterpiece”.">
          <ol className="space-y-3">
            {form.process.map((p, i) => (
              <NumberedRow
                key={i}
                n={i + 1}
                buttons={<RowButtons index={i} count={form.process.length} label={`step ${i + 1}`} onMove={(to) => set('process', moveItem(form.process, i, to))} onRemove={() => set('process', form.process.filter((_, k) => k !== i))} />}
              >
                <input className="input" aria-label={`Step ${i + 1} title`} placeholder="Step title" value={p.title} onChange={(e) => set('process', form.process.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} />
                <textarea className="input min-h-16" aria-label={`Step ${i + 1} description`} placeholder="What happens in this step" value={p.text} onChange={(e) => set('process', form.process.map((x, k) => (k === i ? { ...x, text: e.target.value } : x)))} />
              </NumberedRow>
            ))}
          </ol>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => set('process', [...form.process, { title: '', text: '' }])}>
            <Plus className="size-4" aria-hidden="true" />
            Add step
          </button>
        </Panel>

        <Panel id="c-values" title="Why us" description="The points in “Built for stories that stand out”.">
          <ol className="space-y-2">
            {form.values.map((v, i) => (
              <NumberedRow
                key={i}
                n={i + 1}
                buttons={<RowButtons index={i} count={form.values.length} label={`point ${i + 1}`} onMove={(to) => set('values', moveItem(form.values, i, to))} onRemove={() => set('values', form.values.filter((_, k) => k !== i))} />}
              >
                <input className="input" aria-label={`Point ${i + 1}`} placeholder="Creative thinking" value={v} onChange={(e) => set('values', form.values.map((x, k) => (k === i ? e.target.value : x)))} />
              </NumberedRow>
            ))}
          </ol>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => set('values', [...form.values, ''])}>
            <Plus className="size-4" aria-hidden="true" />
            Add point
          </button>
        </Panel>

        <Panel id="c-faqs" title="FAQs" description="The questions in “Good questions”.">
          <ol className="space-y-3">
            {form.faqs.map((f, i) => (
              <NumberedRow
                key={i}
                n={i + 1}
                buttons={<RowButtons index={i} count={form.faqs.length} label={`question ${i + 1}`} onMove={(to) => set('faqs', moveItem(form.faqs, i, to))} onRemove={() => set('faqs', form.faqs.filter((_, k) => k !== i))} />}
              >
                <input className="input" aria-label={`Question ${i + 1}`} placeholder="Question" value={f.question} onChange={(e) => set('faqs', form.faqs.map((x, k) => (k === i ? { ...x, question: e.target.value } : x)))} />
                <textarea className="input min-h-20" aria-label={`Answer ${i + 1}`} placeholder="Answer" value={f.answer} onChange={(e) => set('faqs', form.faqs.map((x, k) => (k === i ? { ...x, answer: e.target.value } : x)))} />
              </NumberedRow>
            ))}
          </ol>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => set('faqs', [...form.faqs, { question: '', answer: '' }])}>
            <Plus className="size-4" aria-hidden="true" />
            Add question
          </button>
        </Panel>

        <Panel id="c-comparison" title="Before & after" description="The pictures in “See the transformation”. Use two matching stills of the same shot, before and after color grading.">
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Before (original)">
              <WideImageInput value={form.comparison.before} onChange={(v) => setComparison('before', v)} label="picture" />
            </Field>
            <Field label="After (finished)">
              <WideImageInput value={form.comparison.after} onChange={(v) => setComparison('after', v)} label="picture" />
            </Field>
          </div>
          <Field label="Caption" htmlFor="cmp-label">
            <input id="cmp-label" className="input" value={form.comparison.label} onChange={(e) => setComparison('label', e.target.value)} />
          </Field>
        </Panel>
      </div>

      <div className="sticky bottom-0 z-30 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-line bg-page/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <p className="min-w-0 text-sm text-ink-muted" aria-live="polite">
          {error ? <span className="text-danger">{error}</span> : dirty ? 'You have unsaved changes.' : 'All changes saved.'}
        </p>
        <div className="flex shrink-0 gap-2">
          {dirty && (
            <button type="button" className="btn btn-ghost" onClick={() => setForm(site.settings)}>
              Undo
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={submit} disabled={!dirty}>
            Save changes
          </button>
        </div>
      </div>
    </>
  )
}
