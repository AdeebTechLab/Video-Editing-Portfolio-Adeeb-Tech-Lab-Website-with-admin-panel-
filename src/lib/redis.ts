import 'server-only';
export function redisConfigured() {
  return !!((process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN));
}
export async function redis(command: (string | number)[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('Connect Upstash Redis in Vercel and redeploy.');
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Could not connect to admin storage.');
  const result = await response.json();
  if (result.error) throw new Error('Admin storage command failed.');
  return result.result;
}
