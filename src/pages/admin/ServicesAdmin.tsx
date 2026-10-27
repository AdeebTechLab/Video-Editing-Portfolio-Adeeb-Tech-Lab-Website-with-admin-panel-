import { useMemo, useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash } from 'lucide-react'
import { reorder, useSave } from '../../hooks/useSave'
import type { Service } from '../../lib/types'
import { byOrder, uid } from '../../lib/utils'
import { useSite } from '../../store/siteStore'
import { WideImageInput } from '../../components/admin/ImageInputs'
import { ConfirmDialog, Field, Modal, OrderButtons, PageHeader } from '../../components/admin/ui'
import { SERVICE_ICONS, ServiceIcon } from '../../components/ServiceIcon'

export default function ServicesAdmin() {
  const site = useSite()
  const save = useSave()
  const services = useMemo(() => [...site.services].sort(byOrder), [site.services])
  const [editing, setEditing] = useState<Service | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Service | null>(null)

  const move = (from: number, to: number) => save((d) => ({ ...d, services: reorder([...d.services].sort(byOrder), from, to) }))

  const remove = () => {
    if (!deleting) return
    const ok = save((d) => ({ ...d, services: d.services.filter((s) => s.id !== deleting.id).sort(byOrder).map((s, i) => ({ ...s, order: i + 1 })) }), `Deleted “${deleting.name}”.`)
    if (ok) setDeleting(null)
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="The editing services in the “Your vision. Our editing expertise.” section. Visitors select one to see its picture and description."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
            <Plus className="size-4" aria-hidden="true" />
            Add service
          </button>
        }
      />
      {services.length === 0 ? (
        <div className="card px-6 py-12 text-center text-sm text-ink-muted">No services yet. Add one, such as “Video editing”.</div>
      ) : (
        <ul className="space-y-3">
          {services.map((s, i) => (
            <li key={s.id} className="card flex items-center gap-3 p-3 sm:p-4">
              <OrderButtons index={i} count={services.length} onMove={move} label={s.name} />
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
                <ServiceIcon name={s.icon} className="size-5" />
              </span>
              <span className="hidden aspect-[3/2] w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-page-deep sm:block">
                {s.image ? <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-[10px] text-ink-faint">Illustration</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{s.name}</p>
                <p className="truncate text-xs text-ink-faint">
                  {s.label}
                  <span className="hidden sm:inline">{s.label && s.description ? ', ' : ''}{s.description}</span>
                </p>
              </div>
              <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9" onClick={() => setEditing(s)} aria-label={`Edit ${s.name}`}>
                <Pencil className="size-4" />
              </button>
              <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9 text-danger" onClick={() => setDeleting(s)} aria-label={`Delete ${s.name}`}>
                <Trash className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && <ServiceDialog service={editing === 'new' ? null : editing} nextOrder={services.length + 1} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Delete this service?"
          message={
            <>
              <span className="font-semibold text-ink">{deleting.name}</span> will be removed from the Services section.
            </>
          }
          confirmLabel="Delete service"
          onConfirm={remove}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}

function ServiceDialog({ service, nextOrder, onClose }: { service: Service | null; nextOrder: number; onClose: () => void }) {
  const save = useSave()
  const [name, setName] = useState(service?.name ?? '')
  const [label, setLabel] = useState(service?.label ?? 'Discuss your brief')
  const [description, setDescription] = useState(service?.description ?? '')
  const [icon, setIcon] = useState(service?.icon ?? 'film')
  const [image, setImage] = useState(service?.image ?? '')
  const [imageAlt, setImageAlt] = useState(service?.imageAlt ?? '')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Add a name.')
    if (image && !imageAlt.trim()) return setError('Describe the picture for screen readers and search engines.')
    const item: Service = { id: service?.id ?? uid('svc'), name: name.trim(), label: label.trim(), description: description.trim(), icon, image, imageAlt: image ? imageAlt.trim() : '', order: service?.order ?? nextOrder }
    const ok = save((d) => ({ ...d, services: service ? d.services.map((s) => (s.id === service.id ? item : s)) : [...d.services, item] }), service ? 'Service saved.' : 'Service added.')
    if (ok) onClose()
  }

  return (
    <Modal title={service ? 'Edit service' : 'Add a service'} onClose={onClose}>
      <form onSubmit={submit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1" noValidate>
        <Field label="Name" required htmlFor="s-name">
          <input id="s-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Reels & shorts" />
        </Field>
        <Field label="Label" htmlFor="s-label" hint="Small text above the name in the preview.">
          <input id="s-label" className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Discuss your brief" />
        </Field>
        <Field label="Short description" htmlFor="s-desc" counter={{ value: description.length, max: 160 }}>
          <textarea id="s-desc" className="input min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Icon" required htmlFor="s-icon">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
              <ServiceIcon name={icon} className="size-5" />
            </span>
            <select id="s-icon" className="input" value={icon} onChange={(e) => setIcon(e.target.value)}>
              {Object.entries(SERVICE_ICONS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <Field label="Preview picture" hint="Shown when the service is selected, about 3:2. Without one, an illustrated editing panel is shown.">
          <WideImageInput value={image} onChange={setImage} aspect="aspect-[3/2]" label="picture" />
        </Field>
        {image && (
          <Field label="Describe the picture" required htmlFor="s-alt">
            <input id="s-alt" className="input" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Reels and Shorts video editing" />
          </Field>
        )}
        {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {service ? 'Save changes' : 'Add service'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
