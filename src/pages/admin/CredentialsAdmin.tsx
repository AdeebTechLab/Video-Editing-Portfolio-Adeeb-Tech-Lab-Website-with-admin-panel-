import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { ConfirmDialog, PageHeader } from '../../components/admin/ui'
import { currentAdminEmail, changeAdminCredentials } from '../../lib/adminAuth'

export default function CredentialsAdmin() {
  const [email, setEmail] = useState(currentAdminEmail())
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const prepare = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!email.trim()) return setError('Enter an admin email address.')
    if (newPassword.length < 8) return setError('Use a new password with at least 8 characters.')
    if (newPassword !== confirmPassword) return setError('The new passwords do not match.')
    if (!currentPassword) return setError('Enter your current password to confirm this change.')
    setConfirmOpen(true)
  }

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      await changeAdminCredentials(currentPassword, email, newPassword)
      setEmail(currentAdminEmail())
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setConfirmOpen(false)
      setSuccess('Admin login credentials updated in this browser.')
    } catch (cause) {
      setConfirmOpen(false)
      setError(cause instanceof Error ? cause.message : 'Could not update credentials.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Admin credentials" description="Change the email and password used to open this admin panel." />
      <section className="card max-w-2xl p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-text"><KeyRound className="size-5" aria-hidden="true" /></span>
          <div><h2 className="font-bold text-ink">Update login details</h2><p className="text-sm text-ink-muted">You’ll use the new credentials the next time you sign in.</p></div>
        </div>
        <form onSubmit={prepare} className="space-y-5">
          <div><label htmlFor="credential-email" className="field-label">New admin email</label><input id="credential-email" className="input" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <PasswordField id="current-password" label="Current password" value={currentPassword} onChange={setCurrentPassword} visible={showPasswords} autoComplete="current-password" />
          <PasswordField id="new-password" label="New password" value={newPassword} onChange={setNewPassword} visible={showPasswords} autoComplete="new-password" />
          <PasswordField id="confirm-password" label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} visible={showPasswords} autoComplete="new-password" />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowPasswords((value) => !value)} aria-pressed={showPasswords}>
            {showPasswords ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            {showPasswords ? 'Hide passwords' : 'Show passwords'}
          </button>
          {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
          {success && <p role="status" className="rounded-lg bg-success-soft px-3 py-2 text-sm text-success">{success}</p>}
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end"><button type="submit" className="btn btn-primary">Review credential change</button></div>
        </form>
      </section>
      <p className="mt-5 max-w-2xl text-sm text-ink-faint">These credentials are saved in this browser. Since this project is a static website, this login is a convenience gate and does not replace server-side authentication.</p>
      {confirmOpen && <ConfirmDialog title="Change admin login?" message={<>The admin email will become <span className="font-semibold text-ink">{email.trim()}</span>. You’ll need the new password on your next login.</>} confirmLabel="Update credentials" onConfirm={() => void save()} onCancel={() => setConfirmOpen(false)} busy={busy} />}
    </>
  )
}

function PasswordField({ id, label, value, onChange, visible, autoComplete }: { id: string; label: string; value: string; onChange: (value: string) => void; visible: boolean; autoComplete: string }) {
  return <div><label htmlFor={id} className="field-label">{label}</label><input id={id} className="input" type={visible ? 'text' : 'password'} autoComplete={autoComplete} required value={value} onChange={(event) => onChange(event.target.value)} /></div>
}
