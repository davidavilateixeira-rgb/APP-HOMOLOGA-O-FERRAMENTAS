import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const app = await readFile(new URL('../app/app.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../app/index.html', import.meta.url), 'utf8');
const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8');

function bodyOf(functionName) {
  const marker = new RegExp(`(?:async\\s+)?function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{`, 'm');
  const match = marker.exec(app);
  assert.ok(match, `Função ${functionName} não encontrada`);
  const start = match.index + match[0].length;
  let depth = 1;
  let quote = null;
  let escaped = false;
  for (let i = start; i < app.length; i += 1) {
    const char = app[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') quote = char;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) return app.slice(start, i);
  }
  assert.fail(`Função ${functionName} não foi encerrada`);
}

test('não existe usuário inicial com senha embutida', () => {
  const initialStore = app.match(/const\s+INITIAL_USERS_STORE\s*=\s*\[[\s\S]*?\];/);
  assert.ok(initialStore, 'INITIAL_USERS_STORE não encontrado');
  assert.doesNotMatch(initialStore[0], /password\s*:/i);
  assert.doesNotMatch(initialStore[0], /senha\s*:/i);
});

test('login exige Firebase Auth e não procura credenciais no cache', () => {
  const login = bodyOf('realizarLoginTela');
  assert.match(login, /tentarLoginFirebase\s*\(/);
  assert.doesNotMatch(login, /devflowUsersStore\.(?:find|filter|some)\s*\(/);
  assert.doesNotMatch(login, /localStorage/);

  const firebaseLogin = bodyOf('tentarLoginFirebase');
  assert.match(firebaseLogin, /signInWithEmailAndPassword\s*\(/);
  assert.match(firebaseLogin, /acesso local foi desativado/i);
});

test('sessão inicial nunca é restaurada de localStorage', () => {
  const init = bodyOf('inicializarAplicacao');
  assert.match(init, /aguardarUsuarioFirebaseInicial\s*\(/);
  assert.doesNotMatch(init, /localStorage\.getItem\s*\(/);
  assert.match(init, /mostrarTelaLogin\s*\(/);
});

test('cache de perfis remove password antes de serializar e ao carregar', () => {
  const save = bodyOf('salvarUsuariosLocais');
  assert.match(save, /map\s*\(\s*\(\s*\{\s*password\s*,\s*\.\.\.perfil\s*\}/);
  assert.match(save, /JSON\.stringify\s*\(\s*perfisSemCredenciais\s*\)/);

  const load = bodyOf('carregarUsuariosLocais');
  assert.match(load, /map\s*\(\s*\(\s*\{\s*password\s*,\s*\.\.\.perfil\s*\}/);
  assert.match(load, /removeItem\s*\(\s*['"]viemar_toolflow_users_v2['"]\s*\)/);
});

test('recuperação de senha usa e-mail do Firebase', () => {
  const reset = bodyOf('esqueciSenha');
  assert.match(reset, /sendPasswordResetEmail\s*\(/);
  assert.doesNotMatch(reset, /localStorage|\.password\s*=/);
});

test('falha ao carregar Firestore não semeia a nuvem com cache local', () => {
  const load = bodyOf('carregarDadosFirestore');
  const catchBlock = load.slice(load.lastIndexOf('catch'));
  assert.doesNotMatch(catchBlock, /salvarDadosFirestore|agendarSyncFirebase|batch\.commit/);
  assert.match(catchBlock, /falhaSincronizacaoFirebase\s*=\s*true/);
});

test('HTML não contém credenciais preenchidas por padrão', () => {
  assert.doesNotMatch(html, /type=["']password["'][^>]*\bvalue\s*=\s*["'][^"']+/i);
  assert.doesNotMatch(html, /\b(?:password|senha)\s*[:=]\s*["'][^"']{6,}/i);
});

test('Firestore nega acesso por padrão e exige autenticação', () => {
  assert.match(rules, /function\s+signedIn\s*\(\)/);
  assert.match(rules, /request\.auth\s*!=\s*null/);
  assert.match(rules, /match\s+\/\{document=\*\*\}[\s\S]*?allow\s+read\s*,\s*write\s*:\s*if\s+false/);
  assert.doesNotMatch(rules, /allow\s+(?:read|write|read\s*,\s*write)\s*:\s*if\s+true/);
});
