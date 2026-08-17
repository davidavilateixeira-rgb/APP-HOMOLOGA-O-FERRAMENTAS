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

function rulesBodyOf(functionName) {
  const marker = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{`, 'm');
  const match = marker.exec(rules);
  assert.ok(match, `Funcao de regras ${functionName} nao encontrada`);
  const start = match.index + match[0].length;
  let depth = 1;
  for (let i = start; i < rules.length; i += 1) {
    if (rules[i] === '{') depth += 1;
    else if (rules[i] === '}' && --depth === 0) return rules.slice(start, i);
  }
  assert.fail(`Funcao de regras ${functionName} nao foi encerrada`);
}

function testsRulesMatchBody() {
  const marker = /match\s+\/toolflow_tests\/\{testId\}\s*\{/m;
  const match = marker.exec(rules);
  assert.ok(match, 'Bloco match /toolflow_tests/{testId} nao encontrado');
  const start = match.index + match[0].length;
  let depth = 1;
  for (let i = start; i < rules.length; i += 1) {
    if (rules[i] === '{') depth += 1;
    else if (rules[i] === '}' && --depth === 0) return rules.slice(start, i);
  }
  assert.fail('Bloco match /toolflow_tests/{testId} nao foi encerrado');
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

test('acesso publico de visitante foi removido', () => {
  assert.doesNotMatch(html, /Entrar como visitante|entrarComoVisitante\s*\(/);
  assert.doesNotMatch(app, /function\s+entrarComoVisitante\s*\(/);
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

test('solicitante ativo pode ler, criar e atualizar somente a própria solicitação', () => {
  const requester = rulesBodyOf('isRequester');
  const operators = rulesBodyOf('canOperate');
  const testsMatch = testsRulesMatchBody();

  assert.match(requester, /activeProfile\s*\(\s*\)/);
  assert.match(requester, /roleKey\s*==\s*['"]PRESET_SOLICITANTE['"]/);
  assert.doesNotMatch(operators, /PRESET_SOLICITANTE/);
  assert.match(testsMatch, /allow\s+read\s*:\s*if\s+activeProfile\s*\(\s*\)/);
  assert.match(testsMatch, /allow\s+create\s*:[\s\S]*?isRequester\s*\(\s*\)[\s\S]*?validRequesterSubmission\s*\(\s*\)/);

  const updateRule = testsMatch.match(/allow\s+update\s*:\s*if([\s\S]*?);/);
  assert.ok(updateRule, 'Regra de update de testes nao encontrada');
  assert.match(updateRule[1], /canOperate\s*\(\s*\)/);
  assert.match(updateRule[1], /isRequesterOwner\s*\(\s*\)/);
  assert.match(rules, /affectedKeys\(\)[\s\S]*solicitacao[\s\S]*timeline/);
  assert.match(rules, /solicitante\.upper\(\)/);

  const deleteRule = testsMatch.match(/allow\s+delete\s*:\s*if([\s\S]*?);/);
  assert.ok(deleteRule, 'Regra de delete de testes nao encontrada');
  assert.match(deleteRule[1], /isStoredAdmin\s*\(\s*\)/);
  assert.doesNotMatch(deleteRule[1], /isRequester|canOperate/);
});

test('nova solicitacao nao pode nascer em etapa tecnica nem carregar resultados', () => {
  const submission = rulesBodyOf('validRequesterSubmission');
  assert.match(submission, /validTest\s*\(\s*\)/);
  assert.match(submission, /stage\s*==\s*['"]STAGE_2_ANALISE['"]/);
  assert.match(submission, /statusGeral\s*==\s*['"]AGUARDANDO_ANALISE['"]/);
  for (const technicalMap of ['analiseEngenharia', 'agendamento', 'fechamento']) {
    assert.match(submission, new RegExp(`${technicalMap}\\.size\\(\\)\\s*==\\s*0`));
  }
  assert.match(submission, /chaoDeFabrica\.keys\s*\(\s*\)\.hasOnly/);
  assert.match(submission, /chaoDeFabrica\.parametros\.size\s*\(\s*\)\s*==\s*0/);
  assert.match(submission, /registrosArestas\.size\s*\(\s*\)\s*==\s*0/);
});

test('documento de teste vincula IDs do envelope e payload', () => {
  const validTest = rulesBodyOf('validTest');
  assert.match(validTest, /request\.resource\.data\.payload\.id\s*==\s*request\.resource\.data\.id/);
  assert.match(validTest, /updatedBy\s*==\s*request\.auth\.token\.email/);
  assert.match(validTest, /updatedAt\s*==\s*request\.time/);
});

test('ID de solicitação usa ano dinâmico e entropia, sem depender do tamanho da lista', () => {
  const generate = bodyOf('gerarIdSolicitacao');
  assert.match(generate, /getFullYear\s*\(/);
  assert.match(generate, /getRandomValues|Math\.random/);
  assert.doesNotMatch(generate, /testDataStore|\.length\s*\+\s*1|\/2026/);

  const submit = bodyOf('submeterModalSolicitacao');
  assert.match(submit, /gerarIdSolicitacao\s*\(/);
  assert.doesNotMatch(submit, /testDataStore\.length\s*\+\s*1|\/2026/);
});

test('solicitação valida textos e números obrigatórios sem defaults silenciosos', () => {
  const validate = bodyOf('validarCamposObrigatoriosSolicitacao');
  for (const id of ['modalSolicitanteNome', 'modalFornecedor', 'modalFerrAtual', 'modalFerrTeste', 'modalJustificativa', 'modalVidaAtual', 'modalMetaVida', 'modalAmostras', 'modalLeadTime']) {
    assert.match(validate, new RegExp(id));
  }
  assert.match(validate, /Number\.isFinite/);
  assert.match(validate, /<=\s*0/);

  const submit = bodyOf('submeterModalSolicitacao');
  assert.match(submit, /validarCamposObrigatoriosSolicitacao\s*\(\)/);
  assert.doesNotMatch(submit, /modalVidaAtual[^\n]*\|\||modalMetaVida[^\n]*\|\||modalAmostras[^\n]*\|\||modalLeadTime[^\n]*\|\|/);
});

test('modal é limpo tanto ao abrir quanto ao fechar', () => {
  const clean = bodyOf('limparModalNovaSolicitacao');
  assert.match(clean, /\.reset\s*\(\)/);
  assert.match(bodyOf('abrirModalNovaSolicitacao'), /limparModalNovaSolicitacao\s*\(\)/);
  assert.match(bodyOf('fecharModalNovaSolicitacao'), /limparModalNovaSolicitacao\s*\(\)/);
});

test('nova solicitação agenda persistência somente do documento alterado', () => {
  const submit = bodyOf('submeterModalSolicitacao');
  assert.match(submit, /salvarDadosLocais\s*\(\s*true\s*,\s*novoTeste\s*\)/);
  const schedule = bodyOf('agendarSyncFirebase');
  assert.match(schedule, /salvarTesteFirestore\s*\(\s*testeAlterado\s*\)/);
  const single = bodyOf('salvarTesteFirestore');
  assert.match(single, /\.doc\s*\(\s*sanitizarDocId\s*\(\s*teste\.id\s*\)\s*\)\.set/);
  assert.doesNotMatch(single, /testDataStore\.forEach|batch\s*\(/);
});

test('experiencia do solicitante possui navegacao contextual e filtro por responsavel', () => {
  assert.match(html, /id=["']requesterNav["']/);
  assert.match(html, /onclick=["']abrirMinhasSolicitacoes\(\)["']/);
  assert.match(bodyOf('aplicarPermissoesUI'), /usuarioSolicitante\s*\(\)/);
  assert.match(bodyOf('abrirMinhasSolicitacoes'), /filtroSomenteMinhasSolicitacoes\s*=\s*true/);
  assert.match(bodyOf('renderizarTabelaPipeline'), /solicitacao\.solicitante/);
  const permissions = bodyOf('aplicarPermissoesUI');
  assert.match(permissions, /btnTop\.style\.display\s*=\s*\(isLeitura\s*\|\|\s*isSolicitantePreset\)/);
  assert.match(permissions, /btnPipe\.style\.display\s*=\s*\(isLeitura\s*\|\|\s*isSolicitantePreset\)/);
  assert.match(permissions, /duplicadoSolicitante/);
  assert.match(permissions, /pipelineTitle\.textContent\s*=\s*isSolicitantePreset\s*\?\s*['"]Minhas solicitações['"]/);
});

test('solicitante recebe feedback integrado e nao e enviado ao workflow proibido', () => {
  assert.match(html, /id=["']toastRegion["']/);
  assert.match(bodyOf('mostrarToast'), /textContent\s*=\s*mensagem/);
  const submit = bodyOf('submeterModalSolicitacao');
  assert.match(submit, /mostrarToast\s*\(/);
  assert.match(submit, /if\s*\(usuarioSolicitante\(\)\)\s*abrirMinhasSolicitacoes\(\)/);
  assert.match(submit, /else\s*abrirDetalhesWorkflow\s*\(\s*idNovo\s*\)/);
});

test('formulario de solicitacao usa secoes acessiveis e preserva foco', () => {
  assert.equal((html.match(/<details\b[^>]*class=["'][^"']*request-form-section/g) || []).length, 3);
  assert.match(bodyOf('abrirModalNovaSolicitacao'), /modal-content/);
  assert.match(bodyOf('fecharModalNovaSolicitacao'), /ultimoGatilhoModalSolicitacao\.focus\s*\(\)/);
  assert.match(bodyOf('validarCamposObrigatoriosSolicitacao'), /closest\s*\(\s*['"]details['"]\s*\)/);
});
