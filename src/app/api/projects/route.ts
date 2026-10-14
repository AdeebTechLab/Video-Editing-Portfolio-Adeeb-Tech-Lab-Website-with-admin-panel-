import { getProjects } from '@/lib/project-store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  return Response.json({ projects: await getProjects() }, { headers: { 'Cache-Control': 'no-store' } });
}
