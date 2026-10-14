const assert = require('node:assert/strict');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

(async () => {
  const temporary = await fsp.mkdtemp(path.join(os.tmpdir(), 'atl-admin-test-'));
  const modules = new Map();
  function load(file) {
    const absolute = path.resolve(file);
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const mod = { exports: {} }; modules.set(absolute, mod);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const customRequire = name => name === 'server-only' ? {} : name.startsWith('@/') ? load('src/' + name.slice(2) + '.ts') : name.startsWith('.') ? load(path.join(path.dirname(absolute), name + '.ts')) : require(name);
    vm.runInNewContext(code, { require: customRequire, module: mod, exports: mod.exports, process: { ...process, cwd: () => temporary }, Buffer, URL, console }, { filename: absolute });
    return mod.exports;
  }
  try {
    const { youtubeId } = load('src/lib/youtube.ts');
    for (const url of ['https://youtu.be/dQw4w9WgXcQ?t=2', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtube.com/shorts/dQw4w9WgXcQ', 'https://youtube.com/live/dQw4w9WgXcQ']) assert.equal(youtubeId(url), 'dQw4w9WgXcQ');
    for (const url of ['https://evil.com/watch?v=dQw4w9WgXcQ', 'https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ', 'javascript:alert(1)', 'https://youtu.be/invalid']) assert.equal(youtubeId(url), null);
    const store = load('src/lib/project-store.ts');
    assert.equal(await store.getAuth(), null);
    const auth = await store.createAuth('temporary-test-password');
    assert(store.checkPassword(auth, 'temporary-test-password'));
    assert(!store.checkPassword(auth, 'wrong'));
    const token = store.session(auth);
    assert(store.validSession(auth, token));
    assert(!store.validSession(auth, token + 'bad'));
    assert(!store.validSession(auth, '0.' + '0'.repeat(64)));
    assert(!store.validSession(auth));
    const input = { title: 'Test film', description: 'Project description', category: 'YouTube Videos', videoUrl: 'https://youtu.be/dQw4w9WgXcQ' };
    const video = { ...store.validateProject(input), id: 'test' };
    assert.equal(video.thumbnail, 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
    assert.equal(video.videoType, 'youtube');
    assert.throws(() => store.validateProject({ ...input, category: 'All Projects' }));
    assert.throws(() => store.validateProject({ ...input, category: '  all projects  ' }));
    assert.throws(() => store.validateProject({ ...input, category: ' ' }));
    assert.throws(() => store.validateProject({ ...input, category: 'x'.repeat(61) }));
    assert.equal(store.validateProject({ ...input, category: '  Wedding   Films  ' }).category, 'Wedding Films');
    const { activeCategories } = load('src/lib/categories.ts');
    assert.equal(activeCategories([]).length, 0);
    assert.deepEqual(Array.from(activeCategories([{category:'Wedding Films'}, {category:'wedding films'}, {category:'YouTube Videos'}])), ['Wedding Films', 'YouTube Videos']);
    assert.deepEqual(Array.from(activeCategories([{category:'YouTube Videos'}])), ['YouTube Videos']);
    assert.throws(() => store.validateProject({ ...input, videoUrl: 'https://example.com/' }));
    await store.exclusive(() => store.saveProjects([video]));
    assert.equal((await store.getProjects())[0].title, 'Test film');
    await store.exclusive(async () => { const videos = await store.getProjects(); videos[0].title = 'Updated'; await store.saveProjects(videos); });
    assert.equal((await store.getProjects())[0].title, 'Updated');
    await store.exclusive(() => store.saveProjects([]));
    assert.equal((await store.getProjects()).length, 0);
    console.log('Passed: YouTube link validation, password hashing, session tampering/expiry, category validation, persistent add/edit/remove.');
  } finally { await fsp.rm(temporary, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exit(1); });
