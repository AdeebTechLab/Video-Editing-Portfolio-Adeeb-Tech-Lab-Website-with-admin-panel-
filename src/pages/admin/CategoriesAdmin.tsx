import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Pencil, Plus, Trash } from 'lucide-react'
import { reorder, useSave } from '../../hooks/useSave'
import type { Category } from '../../lib/types'
import { byOrder, uid } from '../../lib/utils'
import { useSite } from '../../store/siteStore'
import { Field, Modal, OrderButtons, PageHeader } from '../../components/admin/ui'

export default function CategoriesAdmin() {
  const site = useSite()
  const save = useSave()
  const categories = useMemo(() => [...site.categories].sort(byOrder), [site.categories])
  const [editing, setEditing] = useState<Category | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const count = (id: string) => site.videos.filter((v) => v.categoryId === id).length
  const published = (id: string) => site.videos.filter((v) => v.categoryId === id && v.published).length

  const move = (from: number, to: number) => save((d) => ({ ...d, categories: reorder([...d.categories].sort(byOrder), from, to) }))

  return (
    <>
      <PageHeader
        title="Categories"
        description="The filters in Selected Work, in this order. A category appears on the website once it has a published video; All Projects is added automatically."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
            <Plus className="size-4" aria-hidden="true" />
            Add category
          </button>
        }
      />
      {categories.length === 0 ? (
        <div className="card px-6 py-12 text-center text-sm text-ink-muted">No categories yet. Add one, such as “YouTube Videos” or “Short-Form Content”.</div>
      ) : (
        <ul className="space-y-3">
          {categories.map((c, i) => {
            const n = count(c.id)
            const live = published(c.id)
            return (
              <li key={c.id} className="card flex items-center gap-3 p-3 sm:p-4">
                <OrderButtons index={i} count={categories.length} onMove={move} label={c.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{c.name}</p>
                  <p className="truncate text-xs text-ink-faint">
                    <Link to={`/admin/projects?category=${c.id}`} className="hover:text-accent-text hover:underline">
                      {n} {n === 1 ? 'video' : 'videos'}
                    </Link>
                    {live === 0 && ', hidden on the website until a video is published'}
                  </p>
                </div>
                <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9" onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`}>
                  <Pencil className="size-4" />
                </button>
                <button type="button" className="btn btn-ghost btn-icon size-9 min-h-9 text-danger" onClick={() => setDeleting(c)} aria-label={`Delete ${c.name}`}>
                  <Trash className="size-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {editing && <CategoryDialog category={editing === 'new' ? null : editing} others={categories.filter((c) => editing === 'new' || c.id !== editing.id)} onClose={() => setEditing(null)} />}
      {deleting && <DeleteCategoryDialog category={deleting} videos={count(deleting.id)} others={categories.filter((c) => c.id !== deleting.id)} onClose={() => setDeleting(null)} />}
    </>
  )
}

function CategoryDialog({ category, others, onClose }: { category: Category | null; others: Category[]; onClose: () => void }) {
  const save = useSave()
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const clean = name.trim().replace(/\s+/g, ' ')
    if (!clean) return setError('Add a name.')
    if (clean.length > 60) return setError('Keep the name under 60 characters.')
    if (clean.toLowerCase() === 'all projects') return setError('“All Projects” is reserved for the filter that shows everything.')
    if (others.some((c) => c.name.trim().toLowerCase() === clean.toLowerCase())) return setError('Another category already has this name.')
    const item: Category = { id: category?.id ?? uid('cat'), name: clean, order: category?.order ?? others.length + 1 }
    const ok = save((d) => ({ ...d, categories: category ? d.categories.map((c) => (c.id === category.id ? item : c)) : [...d.categories, item] }), category ? 'Category saved.' : 'Category added.')
    if (ok) onClose()
  }

  return (
    <Modal title={category ? 'Edit category' : 'Add a category'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Name" required htmlFor="c-name" counter={{ value: name.length, max: 60 }} hint="Shown as a filter button in Selected Work.">
          <input id="c-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Short-Form Content" />
        </Field>
        {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {category ? 'Save changes' : 'Add category'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function DeleteCategoryDialog({ category, videos, others, onClose }: { category: Category; videos: number; others: Category[]; onClose: () => void }) {
  const save = useSave()
  const [target, setTarget] = useState(others[0]?.id ?? '')
  const blocked = videos > 0 && others.length === 0

  const remove = () => {
    if (blocked) return
    const ok = save(
      (d) => ({
        ...d,
        categories: d.categories.filter((c) => c.id !== category.id).sort(byOrder).map((c, i) => ({ ...c, order: i + 1 })),
        videos: videos ? d.videos.map((v) => (v.categoryId === category.id ? { ...v, categoryId: target, updatedAt: Date.now() } : v)) : d.videos,
      }),
      `Deleted “${category.name}”.`,
    )
    if (ok) onClose()
  }

  return (
    <Modal
      title="Delete this category?"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={remove} disabled={blocked}>
            Delete category
          </button>
        </>
      }
    >
      {videos === 0 ? (
        <p>
          <span className="font-semibold text-ink">{category.name}</span> will be deleted.
        </p>
      ) : blocked ? (
        <p>
          <span className="font-semibold text-ink">{category.name}</span> has {videos} {videos === 1 ? 'video' : 'videos'}. Add another category first so they can be moved there.
        </p>
      ) : (
        <div className="space-y-3">
          <p>
            <span className="font-semibold text-ink">{category.name}</span> has {videos} {videos === 1 ? 'video' : 'videos'}. Choose where to move {videos === 1 ? 'it' : 'them'}.
          </p>
          <label className="block">
            <span className="field-label">Move videos to</span>
            <select className="input" value={target} onChange={(e) => setTarget(e.target.value)}>
              {others.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </Modal>
  )
}
