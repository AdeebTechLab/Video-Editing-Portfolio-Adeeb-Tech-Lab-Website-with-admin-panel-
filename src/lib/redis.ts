import 'server-only';
export function redisCredentials() {
  for (const prefix of ['UPSTASH_REDIS', 'KV', 'STORAGE', 'KV_KV', 'STORAGE_KV', 'KV_UPSTASH_REDIS', 'STORAGE_UPSTASH_REDIS']) {
    const url = process.env[`${prefix}_REST_URL`] || process.env[`${prefix}_REST_API_URL`];
    const token = process.env[`${prefix}_REST_TOKEN`] || process.env[`${prefix}_REST_API_TOKEN`];
    if (url && token) return { url, token };
  }
  return null;
}
export function redisConfigured() { return !!redisCredentials(); }
export async function redis(command: (string | number)[]): Promise<unknown> {
  const credentials = redisCredentials();
  if (!credentials) throw new Error('Connect Upstash Redis in Vercel and redeploy.');
  const response = await fetch(credentials.url, { method: 'POST', headers: { Authorization: `Bearer ${credentials.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Could not connect to admin storage.');
  const result = await response.json();
  if (result.error) throw new Error('Admin storage command failed.');
  return result.result;
}
