import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { activeCategories } from '@/lib/categories';
import { getAuth, createAuth, checkPassword, session, validSession, exclusive, getProjects, saveProjects, validateProject } from '@/lib/project-store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const attempts = new Map<string, { count: number; until: number }>();
const cookieName = 'atl-admin';
function setupAllowed(request: NextRequest) {
  return ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(request.url).hostname);
}
export async function GET(request: NextRequest) {
  const auth = await getAuth();
  const authenticated = !!auth && validSession(auth, request.cookies.get(cookieName)?.value);
  return NextResponse.json({ configured: !!auth, setupAllowed: setupAllowed(request), authenticated, projects: authenticated ? await getProjects() : [] }, { headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: NextRequest) {
  let sameOrigin = false;
  try {
    const origin = new URL(request.headers.get('origin') || '');
    sameOrigin = origin.host === request.headers.get('host') && origin.protocol === new URL(request.url).protocol;
  } catch {}
  if (!sameOrigin) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (Number(request.headers.get('content-length')) > 16000) return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 16000) throw new Error();
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
  } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  return exclusive(async () => {
    try {
      let auth = await getAuth();
      if (body.action === 'setup' || body.action === 'login') {
        const password = typeof body.password === 'string' ? body.password : '';
        if (password.length > 256) return NextResponse.json({ error: 'Password is too long.' }, { status: 400 });
        if (body.action === 'setup') {
          if (auth || !setupAllowed(request)) return NextResponse.json({ error: 'Setup is only available locally before an admin is configured.' }, { status: 403 });
          if (password.length < 4) return NextResponse.json({ error: 'Use a password with at least 4 characters.' }, { status: 400 });
          auth = await createAuth(password);
        } else {
          const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
          if (attempts.size > 1000) for (const [k,v] of attempts) if (v.until <= Date.now()) attempts.delete(k);
          const attempt = attempts.get(key);
          if (attempt && attempt.until > Date.now() && attempt.count >= 5) return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
          if (!auth || !checkPassword(auth, password)) {
            attempts.set(key, { count: attempt && attempt.until > Date.now() ? attempt.count + 1 : 1, until: attempt && attempt.until > Date.now() ? attempt.until : Date.now() + 900000 });
            return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
          }
          attempts.delete(key);
        }
        const response = NextResponse.json({ ok: true });
        response.cookies.set(cookieName, session(auth), { httpOnly: true, sameSite: 'strict', secure: new URL(request.url).protocol === 'https:', path: '/', maxAge: 28800 });
        return response;
      }
      if (!auth || !validSession(auth, request.cookies.get(cookieName)?.value)) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
      if (body.action === 'logout') {
        const response = NextResponse.json({ ok: true });
        response.cookies.set(cookieName, '', { path: '/', maxAge: 0 });
        return response;
      }
      const videos = await getProjects();
      if (body.action === 'save') {
        const project = validateProject(body);
        const existingCategory = activeCategories(videos).find(category => category.toLowerCase() === project.category.toLowerCase());
        if (existingCategory) project.category = existingCategory;
        if (typeof body.id === 'string' && body.id) {
          const index = videos.findIndex(v => v.id === body.id);
          if (index < 0) return NextResponse.json({ error: 'Video not found.' }, { status: 404 });
          videos[index] = { ...project, id: body.id };
        } else {
          if (videos.some(v => v.videoUrl === project.videoUrl)) return NextResponse.json({ error: 'This YouTube video is already added.' }, { status: 409 });
          videos.unshift({ ...project, id: randomUUID() });
        }
      } else if (body.action === 'delete') {
        const index = videos.findIndex(v => v.id === body.id);
        if (index < 0) return NextResponse.json({ error: 'Video not found.' }, { status: 404 });
        videos.splice(index, 1);
      } else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
      await saveProjects(videos);
      return NextResponse.json({ ok: true, projects: videos });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const validation = /^(Enter|Title|Description|Select) /.test(message);
      return NextResponse.json({ error: validation ? message : 'Could not save changes. Please try again.' }, { status: validation ? 400 : 500 });
    }
  });
}
