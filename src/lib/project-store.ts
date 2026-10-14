import 'server-only';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'node:crypto';
import { type Video } from '@/data/portfolio';
import { cleanCategory } from './categories';
import { youtubeId } from './youtube';

const directory = path.join(process.cwd(), 'data');
let queue: Promise<unknown> = Promise.resolve();
export function exclusive<T>(work: () => Promise<T>): Promise<T> {
  const result = queue.then(work, work);
  queue = result.catch(() => {});
  return result;
}
async function read<T>(name: string, fallback: T): Promise<T> {
  try { return JSON.parse(await readFile(path.join(directory, name), 'utf8')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fallback; throw error; }
}
async function write(name: string, value: unknown) {
  await mkdir(directory, { recursive: true });
  const temporary = path.join(directory, `${name}.${randomBytes(8).toString('hex')}.tmp`);
  await writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 });
  await rename(temporary, path.join(directory, name));
}
type Auth = { salt: string; hash: string; secret: string };
export const getAuth = () => read<Auth | null>('admin.json', null);
export const getProjects = () => read<Video[]>('projects.json', []);
export const saveProjects = (videos: Video[]) => write('projects.json', videos);
export async function createAuth(password: string) {
  const salt = randomBytes(16).toString('hex');
  const auth = { salt, hash: scryptSync(password, salt, 64).toString('hex'), secret: randomBytes(32).toString('hex') };
  await write('admin.json', auth);
  return auth;
}
export function checkPassword(auth: Auth, password: string) {
  return timingSafeEqual(Buffer.from(auth.hash, 'hex'), scryptSync(password, auth.salt, 64));
}
export function session(auth: Auth) {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expires}.${createHmac('sha256', auth.secret).update(expires).digest('hex')}`;
}
export function validSession(auth: Auth, token?: string) {
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!/^\d+$/.test(expires) || Number(expires) <= Date.now() || !/^[a-f0-9]{64}$/.test(signature || '')) return false;
  const expected = createHmac('sha256', auth.secret).update(expires).digest();
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}
export function validateProject(body: Record<string, unknown>): Omit<Video, 'id'> {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const category = typeof body.category === 'string' ? cleanCategory(body.category) : '';
  const id = typeof body.videoUrl === 'string' ? youtubeId(body.videoUrl) : null;
  if (!id) throw new Error('Enter a valid YouTube video, Shorts or share link.');
  if (!title || title.length > 160) throw new Error('Title must contain 1–160 characters.');
  if (!description || description.length > 2000) throw new Error('Description must contain 1–2000 characters.');
  if (!category || category.length > 60 || category.toLowerCase() === 'all projects' || /[\x00-\x1f\x7f]/.test(category)) throw new Error('Select or type a category with 1–60 characters. All Projects is reserved.');
  return { title, description, category, videoUrl: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, videoType: 'youtube', isDemo: false, featured: body.featured === true };
}
