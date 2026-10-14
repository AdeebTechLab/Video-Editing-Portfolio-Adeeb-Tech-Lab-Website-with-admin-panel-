const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const env = { UPSTASH_REDIS_REST_URL: 'https://redis.test', UPSTASH_REDIS_REST_TOKEN: 'test', VERCEL: '1' };
const values = new Map();
let fail = false;
const mockFetch = async (url, options) => {
  assert.equal(options.headers.Authorization, 'Bearer test');
  if (fail) return { ok: false };
  const [op, key, value, ...args] = JSON.parse(options.body);
  let result = null;
  if (op === 'GET') result = values.get(key) ?? null;
  if (op === 'SET') { if (!args.includes('NX') || !values.has(key)) { values.set(key, value); result = 'OK'; } }
  if (op === 'EVAL') { const lockKey = args[0]; const lockToken = args[1]; if (values.get(lockKey) === lockToken) values.delete(lockKey); result = 1; }
  return { ok: true, json: async () => ({ result }) };
};
const modules = new Map();
function load(file) {
  const absolute = path.resolve(file);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const mod = { exports: {} }; modules.set(absolute, mod);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const customRequire = name => name === 'server-only' ? {} : name.startsWith('@/') ? load('src/' + name.slice(2) + '.ts') : name.startsWith('.') ? load(path.join(path.dirname(absolute), name + '.ts')) : require(name);
  vm.runInNewContext(code, { require: customRequire, module: mod, exports: mod.exports, process: { env, cwd: () => process.cwd() }, Buffer, URL, AbortSignal, fetch: mockFetch });
  return mod.exports;
}
(async () => {
  const store = load('src/lib/project-store.ts');
  assert.equal(await store.getAuth(), null);
  const auth = await store.createAuth('existing-password');
  assert(store.checkPassword(await store.getAuth(), 'existing-password'));
  assert(store.validSession(await store.getAuth(), store.session(auth)));
  const videos = [{ id: 'existing', title: 'Restored film' }];
  await store.exclusive(() => store.saveProjects(videos));
  assert.equal((await store.getProjects())[0].title, 'Restored film');
  assert.equal(values.has('atl:admin-lock'), false);
  await assert.rejects(store.exclusive(async () => { throw new Error('test failure'); }), /test failure/);
  assert.equal(values.has('atl:admin-lock'), false);
  values.set('atl:admin-lock', 'another-instance');
  await assert.rejects(store.exclusive(() => store.saveProjects([])), /Another update/);
  assert.equal((await store.getProjects()).length, 1);
  values.delete('atl:admin-lock');
  await store.exclusive(() => store.saveProjects([]));
  assert.equal((await store.getProjects()).length, 0);
  fail = true;
  await assert.rejects(store.getProjects(), /Could not connect/);
  delete env.UPSTASH_REDIS_REST_URL; delete env.UPSTASH_REDIS_REST_TOKEN;
  assert.equal(await store.getAuth(), null);
  await assert.rejects(store.saveProjects([]), /Connect Upstash/);
  console.log('Passed: Redis auth/session, persisted videos, empty library, shared locking, lock release, storage failure, no Vercel filesystem writes.');
})().catch(error => { console.error(error); process.exitCode = 1; });
