import { useMemo, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Pencil, Plus, Trash } from 'lucide-react'
import { reorder, useSave } from '../../hooks/useSave'
import type { Tool } from '../../lib/types'
import { byOrder, canonicalJson, isHexColor, normalizeHex, uid } from '../../lib/utils'
import { useSite } from '../../store/siteStore'
import { RoundImageInput } from '../../components/admin/ImageInputs'
import { TagInput } from '../../components/admin/TagInput'
import { ConfirmDialog, Field, Modal, OrderButtons, PageHeader, Panel, Switch } from '../../components/admin/ui'

export default function ToolsAdmin() {
  const site = useSite()
  const save = useSave()
  const tools = useMemo(() => [...site.tools].sort(byOrder), [site.tools])
  const [editing, setEditing] = useState<Tool | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Tool | null>(null)
  const [skills, setSkills] = useState(site.settings.skills)
  const skillsDirty = canonicalJson(skills) !== canonicalJson(site.settings.skills)

  const move = (from: number, to: number) => save((d) => ({ ...d, tools: reorder([...d.tools].sort(byOrder), from, to) }))
  const toggle = (t: Tool) => save((d) => ({ ...d, tools: d.tools.map((x) => (x.id === t.id ? { ...x, showOnSite: !x.showOnSite } : x)) }))

  const remove = () => {
    if (!deleting) return
    if (save((d) => ({ ...d, tools: d.tools.filter((t) => t.id !== deleting.id).sort(byOrder).map((t, i) => ({ ...t, order: i + 1 })) }), `Deleted “${deleting.name}”.`)) setDeleting(null)
  }

  return (
    <>
      <PageHeader
        title="Editing tools & skills"
        description="The software cards and the skills list in “The tools behind the creativity”."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
            <Plus className="size-4" aria-hidden="true" />
            Add tool
          </button>
        }
      />
      <div className="space-y-6">
        <section className="card p-4 sm:p-5">
          <h2 className="mb-3 font-bold text-ink">Editing tools</h2>
          {tools.length === 0 ? (
            <p className="text-sm text-ink-faint">No tools yet. Add your editing software, such as Premiere Pro.</p>
          ) : (
            <ul className="divide-y divide-line">
              {tools.map((t, i) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <OrderButtons index={i} count={tools.length} onMove={move} label={t.name} />
                  <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border-2 bg-page-deep" style={{ borderColor: `${t.color}66` }}>
                    {t.logo ? <img src={t.logo} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" /> : <span className="text-xs font-bold text-ink-faint">{t.name.slice(0, 2).toUpperCase()}</span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">
                      {t.name}
                      {!t.showOnSite && <span className="ml-2 text-xs font-normal text-ink-faint">Hidden</span>}
                    </span>
                    <span className="block truncate text-xs text-ink-faint">{t.description}</span>
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon size-9 min-h-9"
                    onClick={() => toggle(t)}
                    aria-label={t.showOnSite ? `Hide ${t.name}` : `Show ${t.name}`}
                    title={t.showOnSite ? 'Shown on the website' : 'Hidden from the website'}
                  >
                    {t.showOnSite ? <Eye className="size-4 text-success" /> : <EyeOff className="size-4" />}
                  </button>
                  <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9" onClick={() => setEditing(t)} aria-label={`Edit ${t.name}`}>
                    <Pencil className="size-4" />
                  </button>
                  <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9 text-danger" onClick={() => setDeleting(t)} aria-label={`Delete ${t.name}`}>
                    <Trash className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Panel
          title="Skills"
          description="The skill tags under the tool cards, in this order."
          aside={
            <button type="button" className="btn btn-primary btn-sm shrink-0" disabled={!skillsDirty} onClick={() => save((d) => ({ ...d, settings: { ...d.settings, skills } }), 'Skills saved.')}>
              Save skills
            </button>
          }
        >
          <Field label="Skills" htmlFor="t-skills" hint="Press Enter or comma after each skill. Backspace removes the last one.">
            <TagInput id="t-skills" value={skills} onChange={setSkills} placeholder="Color correction" />
          </Field>
        </Panel>
      </div>

      {editing && <ToolDialog tool={editing === 'new' ? null : editing} nextOrder={tools.length + 1} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog title="Delete this tool?" message={<><span className="font-semibold text-ink">{deleting.name}</span> will be removed from the toolkit section.</>} confirmLabel="Delete" onConfirm={remove} onCancel={() => setDeleting(null)} />
      )}
    </>
  )
}

function ToolDialog({ tool, nextOrder, onClose }: { tool: Tool | null; nextOrder: number; onClose: () => void }) {
  const save = useSave()
  const [name, setName] = useState(tool?.name ?? '')
  const [description, setDescription] = useState(tool?.description ?? '')
  const [logo, setLogo] = useState(tool?.logo ?? '')
  const [color, setColor] = useState(tool?.color ?? '#ff6a00')
  const [show, setShow] = useState(tool?.showOnSite ?? true)
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Add a name.')
    if (!logo) return setError('Add a logo image.')
    if (!isHexColor(color)) return setError('Use a colour such as #9b5cff.')
    const item: Tool = { id: tool?.id ?? uid('tool'), name: name.trim(), description: description.trim(), logo, color: normalizeHex(color), showOnSite: show, order: tool?.order ?? nextOrder }
    const ok = save((d) => ({ ...d, tools: tool ? d.tools.map((t) => (t.id === tool.id ? item : t)) : [...d.tools, item] }), tool ? 'Saved.' : 'Tool added.')
    if (ok) onClose()
  }

  return (
    <Modal title={tool ? 'Edit tool' : 'Add a tool'} onClose={onClose}>
      <form onSubmit={submit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1" noValidate>
        <Field label="Name" required htmlFor="t-name">
          <input id="t-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="After Effects" />
        </Field>
        <Field label="Short description" htmlFor="t-desc" counter={{ value: description.length, max: 120 }}>
          <textarea id="t-desc" className="input min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Motion graphics and compositing." />
        </Field>
        <Field label="Logo" required hint="A square image works best.">
          <RoundImageInput value={logo} onChange={setLogo} label="logo" />
        </Field>
        <Field label="Accent colour" required htmlFor="t-color" hint="Used for the border around the logo.">
          <div className="flex items-center gap-3">
            <input type="color" className="input h-11 w-14 shrink-0" aria-label="Pick a colour" value={isHexColor(color) && color.length === 7 ? color : '#ff6a00'} onChange={(e) => setColor(e.target.value)} />
            <input id="t-color" className="input" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#9b5cff" />
          </div>
        </Field>
        <Switch checked={show} onChange={setShow} label="Show on the website" />
        {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {tool ? 'Save changes' : 'Add tool'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
