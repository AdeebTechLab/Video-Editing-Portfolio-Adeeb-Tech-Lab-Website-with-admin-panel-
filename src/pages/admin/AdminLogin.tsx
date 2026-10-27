import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { Logo } from '../../components/layout/Logo'
import { useArea } from '../../hooks/useArea'
import { useSeo } from '../../lib/seo'
import { currentAdminEmail, startAdminSession, verifyAdminCredentials } from '../../lib/adminAuth'

export default function AdminLogin() {
  useArea('admin')
  useSeo({ title: 'Admin login', noindex: true })
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(currentAdminEmail())
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (!(await verifyAdminCredentials(email, password))) {
        setError('Email or password is incorrect.')
        return
      }
      if (!startAdminSession()) {
        setError('This browser could not start a secure session. Check that site storage is available.')
        return
      }
      // Return to the admin page that asked for the login
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from.startsWith('/admin') && from !== '/admin/login' ? from : '/admin', { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main id="main" className="container-x grid min-h-screen place-items-center py-10">
      <section className="card w-full max-w-md p-6 sm:p-8" aria-labelledby="login-title">
        <Logo to="/" />
        <div className="mt-8 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-text"><LockKeyhole className="size-5" aria-hidden="true" /></span>
          <div>
            <h1 id="login-title" className="text-2xl font-extrabold text-ink">Admin login</h1>
            <p className="text-sm text-ink-muted">Sign in to manage your video portfolio.</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="admin-email" className="field-label">Email</label>
            <input id="admin-email" className="input" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label htmlFor="admin-password" className="field-label">Password</label>
            <div className="relative">
              <input id="admin-password" className="input pr-12" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-ink-faint hover:text-ink" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-center text-sm"><Link to="/" className="font-semibold text-accent-text hover:underline">Back to website</Link></p>
      </section>
    </main>
  )
}
