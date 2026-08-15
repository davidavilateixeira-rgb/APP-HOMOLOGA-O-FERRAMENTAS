import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('configurações de deploy são JSON válido', async () => {
  for (const filename of ['firebase.json', 'vercel.json']) {
    const source = await readFile(new URL(`../${filename}`, import.meta.url), 'utf8');
    assert.doesNotThrow(() => JSON.parse(source), `${filename} inválido`);
  }
});

test('firebase.json referencia regras existentes', async () => {
  const config = JSON.parse(await readFile(new URL('../firebase.json', import.meta.url), 'utf8'));
  assert.equal(config?.firestore?.rules, 'firestore.rules');
  await access(new URL(`../${config.firestore.rules}`, import.meta.url));
});

test('Vercel encaminha rotas para a aplicação', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.rewrites?.some(({ destination }) => destination.startsWith('/app/')));
});

test('versão da aplicação está consistente nos manifests e na interface', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const packageLock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  const html = await readFile(new URL('../app/index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../app/app.js', import.meta.url), 'utf8');
  const firebaseConfig = await readFile(new URL('../app/firebase-config.js', import.meta.url), 'utf8');

  assert.equal(packageJson.version, '1.10.0');
  assert.equal(packageLock.version, packageJson.version);
  assert.equal(packageLock.packages[''].version, packageJson.version);
  assert.match(html, /v1\.10\.0/);
  assert.match(app, /TOOLFLOW v1\.10\.0/);
  assert.match(firebaseConfig, /TOOLFLOW v1\.10\.0/);
});
