const fs = require('node:fs/promises');
const path = require('node:path');
if (process.loadEnvFile) { try { process.loadEnvFile('.env.local'); } catch (e) { if (e.code !== 'ENOENT') throw e; } }
(async () => {
  let url, token;
  for (const prefix of ['UPSTASH_REDIS', 'KV', 'STORAGE', 'KV_KV', 'STORAGE_KV', 'KV_UPSTASH_REDIS', 'STORAGE_UPSTASH_REDIS']) {
    url = process.env[`${prefix}_REST_URL`] || process.env[`${prefix}_REST_API_URL`];
    token = process.env[`${prefix}_REST_TOKEN`] || process.env[`${prefix}_REST_API_TOKEN`];
    if (url && token) break;
  }
  if (!url || !token) throw new Error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local first.');
  const auth = JSON.parse(await fs.readFile(path.join('data', 'admin.json'), 'utf8'));
  const projects = JSON.parse(await fs.readFile(path.join('data', 'projects.json'), 'utf8'));
  if (!auth.salt || !auth.hash || !auth.secret || !Array.isArray(projects)) throw new Error('Invalid local migration data.');
  const script = "if redis.call('exists', KEYS[1], KEYS[2]) > 0 then return 0 end redis.call('set', KEYS[1], ARGV[1]) redis.call('set', KEYS[2], ARGV[2]) return 1";
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(['EVAL', script, 2, 'atl:admin.json', 'atl:projects.json', JSON.stringify(auth), JSON.stringify(projects)]), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Migration connection failed. Check your Redis credentials.');
  const result = await response.json();
  if (result.error) throw new Error('Migration failed. Redis rejected the import.');
  if (result.result !== 1) throw new Error('Hosted data already exists. Import stopped without overwriting it.');
  console.log(`Migrated existing admin login and ${projects.length} videos. Use your existing password on the hosted admin page.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
