"use client";
import { useEffect, useState } from 'react';
import { type Video } from '@/data/portfolio';
import { activeCategories } from '@/lib/categories';
import { youtubeId } from '@/lib/youtube';
import VideoModal from '@/components/VideoModal';
const empty = { id: '', videoUrl: '', title: '', description: '', category: '', featured: false };
export default function AdminPage() {
  const [state, setState] = useState<{ configured: boolean; authenticated: boolean; setupAllowed: boolean; storageReady: boolean; projects: Video[] } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [draft, setDraft] = useState(empty);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Video | null>(null);
  const [remove, setRemove] = useState<string | null>(null);
  async function load() {
    const response = await fetch('/api/admin', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load admin panel. Refresh to retry.');
    setState(await response.json());
  }
  useEffect(() => {
    async function requireLogin() {
      const response = await fetch('/api/admin', { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load admin panel. Refresh to retry.');
      const existing = await response.json();
      if (existing.authenticated) {
        const logout = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout' }),
        });
        if (!logout.ok) throw new Error('Could not lock admin panel. Refresh to retry.');
      }
      await load();
    }
    requireLogin().catch(e => setMessage(e.message));
  }, []);
  async function action(body: Record<string, unknown>) {
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) await load();
        throw new Error(result.error || 'Please try again.');
      }
      await load();
      return true;
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Something went wrong.'); return false; }
    finally { setBusy(false); }
  }
  const id = youtubeId(draft.videoUrl);
  const categoryOptions = activeCategories(state?.projects || []);
  const previewVideo: Video | null = id ? { ...draft, id: draft.id || 'preview', thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, videoUrl: `https://www.youtube.com/watch?v=${id}`, videoType: 'youtube', isDemo: false } : null;
  return (
    <main className="admin-page">
      <div className="admin-top"><a href="/">← Portfolio</a>{state?.authenticated && <button className="button" disabled={busy} onClick={async () => { if (await action({ action: 'logout' })) { setDraft(empty); setPassword(''); } }}>Sign out</button>}</div>
      <p className="eyebrow">ADEEB TECH LAB / ADMIN</p>
      <h1>MANAGE YOUR <em>WORK.</em></h1>
      <p className="muted">Add a YouTube video and publish it directly to Selected Work.</p>
      <p role="status" className="admin-status">{message}</p>
      {!state ? <p>{message ? 'Refresh this page to retry.' : 'Loading admin panel…'}</p> : !state.authenticated ? (
        <form className="admin-login" onSubmit={async e => {
          e.preventDefault();
          if (!state.configured && password !== confirmation) { setMessage('Passwords do not match.'); return; }
          if (await action({ action: state.configured ? 'login' : 'setup', password })) { setPassword(''); setConfirmation(''); }
        }}>
          <h2>{state.configured ? 'Welcome back' : !state.setupAllowed ? 'Restore your admin data' : 'Set up your admin password'}</h2>
          {!state.configured && state.setupAllowed && <p className="muted">Create a password of at least 4 characters. Keep it safe for future logins.</p>}
          {!state.configured && !state.setupAllowed ? <p>{!state.storageReady ? 'Connect Upstash Redis to this Vercel project and redeploy. Then migrate your saved admin data to restore your existing password and videos.' : 'Import your saved admin data using the migration script. Your existing password and published videos will then be available here.'}</p> : <>
            <label>Password<input type="password" required minLength={state.configured ? 1 : 4} maxLength={256} autoComplete={state.configured ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} /></label>
            {!state.configured && <label>Confirm password<input type="password" required autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label>}
            <button className="button primary" disabled={busy}>{busy ? 'Please wait…' : state.configured ? 'Sign in' : 'Create admin password'}</button>
          </>}
        </form>
      ) : <>
        <div className="admin-editor">
          <form className="admin-card" onSubmit={async e => {
            e.preventDefault();
            const editing = !!draft.id;
            if (await action({ action: 'save', ...draft })) { setDraft(empty); setMessage(editing ? 'Video updated in Selected Work.' : 'Video published to Selected Work.'); }
          }}>
            <h2>{draft.id ? 'Edit video' : 'Add a video'}</h2>
            <label>YouTube link<input type="url" required value={draft.videoUrl} onChange={e => setDraft({ ...draft, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" /></label>
            {draft.videoUrl && !id && <p className="admin-error">Use a valid YouTube video, Shorts or share link.</p>}
            <label>Title<input required maxLength={160} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Give your video a title" /></label>
            <label>Description<textarea required maxLength={2000} rows={4} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Tell visitors about this project" /></label>
            <label>Category<input list="portfolio-categories" required maxLength={60} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} placeholder="Choose an existing category or type a new one" /><datalist id="portfolio-categories">{categoryOptions.map(c => <option key={c} value={c} />)}</datalist></label>
            <p className="form-note">Type a new category name to create it when you publish. Categories with no videos disappear automatically.</p>
            <label className="admin-checkbox"><input type="checkbox" checked={draft.featured} onChange={e => setDraft({ ...draft, featured: e.target.checked })} />Feature this video</label>
            <div className="admin-actions"><button className="button primary" disabled={busy || !id}>{busy ? 'Saving…' : draft.id ? 'Save changes' : 'Publish video'}</button>{draft.id && <button type="button" className="button" onClick={() => setDraft(empty)} disabled={busy}>Cancel edit</button>}</div>
          </form>
          <div className="admin-card"><p className="eyebrow">LIVE PREVIEW</p>
            {previewVideo ? <><button className="admin-thumbnail" aria-label="Play video preview" onClick={() => setPreview(previewVideo)}><img src={previewVideo.thumbnail} alt="YouTube video thumbnail" /><span>▶ Play preview</span></button><p className="eyebrow">{draft.category}</p><h2>{draft.title || 'Your video title'}</h2><p className="muted">{draft.description || 'Your description appears here.'}</p><a href={previewVideo.videoUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></> : <div className="admin-placeholder">Paste a YouTube link to see its thumbnail and play preview.</div>}
            <p className="form-note">Videos must be public or unlisted and allow embedding. Some videos may require watching on YouTube.</p>
          </div>
        </div>
        <div className="admin-library"><h2>Published videos <span className="muted">({state.projects.length})</span></h2>
          {!state.projects.length && <p className="muted">Your added videos will appear here and in Selected Work.</p>}
          {state.projects.map(v => <article className="admin-video" key={v.id}>
            <button className="admin-miniature" onClick={() => setPreview(v)} aria-label={`Preview ${v.title}`}><img src={v.thumbnail} alt="" /></button>
            <div><p className="eyebrow">{v.category}{v.featured ? ' / FEATURED' : ''}</p><h3>{v.title}</h3><p className="muted">{v.description}</p></div>
            <div className="admin-actions"><button className="button" disabled={busy} onClick={() => { setDraft({ id: v.id, title: v.title, description: v.description, category: v.category, videoUrl: v.videoUrl, featured: v.featured }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button><button className="text-button" disabled={busy} onClick={() => setRemove(v.id)}>Remove</button></div>
            {remove === v.id && <div className="admin-delete"><span>Remove this video from Selected Work?</span><button className="button" disabled={busy} onClick={async () => { if (await action({ action: 'delete', id: v.id })) { if (draft.id === v.id) setDraft(empty); setRemove(null); setMessage('Video removed.'); } }}>Yes, remove</button><button className="text-button" onClick={() => setRemove(null)}>Cancel</button></div>}
          </article>)}
        </div>
      </>}
      {preview && <VideoModal key={preview.id} video={preview} onClose={() => setPreview(null)} />}
    </main>
  );
}
