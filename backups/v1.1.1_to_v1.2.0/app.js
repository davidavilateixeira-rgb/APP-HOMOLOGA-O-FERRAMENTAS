// =========================================================================
// VIEMAR TOOLFLOW v1.1.1 - SISTEMA DE WORKFLOW E HOMOLOGACAO DE FERRAMENTAS
// =========================================================================

// Perfis de Acesso e Papeis de Governanca
const DEVFLOW_ROLES = {
  ADMIN: 'ADMIN',         // Engenharia ADM (Oscar, Jonathan, Ponto Focal) - Acesso Total
  TECNICO: 'TECNICO',     // Tecnicos de Chao de Fabrica (Filipe 1T, Charles 2T) - Acompanhamento e Registro
  SOLICITANTE: 'SOLICITANTE', // Solicitante (Preset, Gerenciador Externo, Fornecedores) - Abertura e Visualizacao
  LEITURA: 'LEITURA'      // Visitante / Apenas Consulta Geral
};
const TOOLFLOW_ROLES = DEVFLOW_ROLES;

// Base de Usuarios Cadastrados (Persistivel no LocalStorage e Firebase Auth)
let devflowUsersStore = [
  { id: 'oscar_adm', name: 'Oscar', email: 'oscar@viemar.com.br', roleTitle: 'Engenharia ADM', role: DEVFLOW_ROLES.ADMIN },
  { id: 'jonathan_adm', name: 'Jonathan', email: 'jonathan@viemar.com.br', roleTitle: 'Engenharia ADM', role: DEVFLOW_ROLES.ADMIN },
  { id: 'ponto_focal', name: 'Ponto Focal', email: 'focal@viemar.com.br', roleTitle: 'Coordenador de Testes', role: DEVFLOW_ROLES.ADMIN },
  { id: 'filipe_1t', name: 'Filipe', email: 'filipe@viemar.com.br', roleTitle: 'Tecnico 1o Turno', role: DEVFLOW_ROLES.TECNICO },
  { id: 'charles_2t', name: 'Charles', email: 'charles@viemar.com.br', roleTitle: 'Tecnico 2o Turno', role: DEVFLOW_ROLES.TECNICO },
  { id: 'preset_op', name: 'Roberto (Preset)', email: 'preset@viemar.com.br', roleTitle: 'Setor de Preset', role: DEVFLOW_ROLES.SOLICITANTE },
  { id: 'gerenciador_ext', name: 'Gerenciador Externo', email: 'gerenciador@ferramentas.com', roleTitle: 'Gestao de Ferramentas', role: DEVFLOW_ROLES.SOLICITANTE },
  { id: 'fornecedor_ext', name: 'Fornecedor Sandvik', email: 'contato@sandvik.com', roleTitle: 'Representante Tecnico', role: DEVFLOW_ROLES.SOLICITANTE },
  { id: 'visitante_leitura', name: 'Visitante / Qualidade', email: 'qualidade@viemar.com.br', roleTitle: 'Consulta Geral', role: DEVFLOW_ROLES.LEITURA }
];

// Definicao das 5 Etapas do Workflow
const WORKFLOW_STAGES = {
  STAGE_1_SOLICITACAO: { id: 1, key: 'STAGE_1_SOLICITACAO', label: '1. Solicitacao (D-2)', badgeClass: 'badge-blue' },
  STAGE_2_ANALISE: { id: 2, key: 'STAGE_2_ANALISE', label: '2. Analise Engenharia', badgeClass: 'badge-orange' },
  STAGE_3_AGENDAMENTO: { id: 3, key: 'STAGE_3_AGENDAMENTO', label: '3. Agendamento Visita', badgeClass: 'badge-amber' },
  STAGE_4_EXECUCAO: { id: 4, key: 'STAGE_4_EXECUCAO', label: '4. Teste em Maquina', badgeClass: 'badge-blue' },
  STAGE_5_VALIDACAO: { id: 5, key: 'STAGE_5_VALIDACAO', label: '5. Validacao & Estoque', badgeClass: 'badge-green' }
};

// Banco de Dados de Testes
let testDataStore = [
  {
    id: 'TESTE-001/2026',
    stage: 'STAGE_4_EXECUCAO',
    statusGeral: 'EM_ANDAMENTO',
    
    solicitacao: {
      dataSolicitacao: '2026-08-01',
      dataPrevistaTeste: '2026-08-06',
      solicitante: 'Roberto (Preset)',
      fornecedor: 'Sandvik Coromant',
      contatoFornecedor: 'Marcelo (51) 99888-7766',
      codigoPeca: 'PC-88420-A',
      descricaoPeca: 'Flange de Acoplamento 120',
      materialPeca: 'Aco 4140 Tratado (32 HRC)',
      maquina: 'Centro Romi D800 (CNC-04)',
      operacao: 'Desbaste Faceamento',
      refrigeracao: 'Oleo Soluvel Convencional',
      
      ferramentaAtual: 'Fresa D50 - Inserto APMT 1604',
      vidaAtual: 80,
      cicloAtual: 145,
      custoAtual: 38.50,
      arestasAtual: 2,
      
      ferramentaTeste: 'Fresa D50 - Inserto ANHX 1607',
      metaVida: 120,
      amostrasBonificadas: 10,
      precoTeste: 32.00,
      arestasTeste: 4,
      leadTimeDias: 15,
      estoqueLocal: 'SIM',
      justificativa: 'Reducao de CPP e ganho prometido de 50% de vida util.'
    },

    analiseEngenharia: {
      dataAnalise: '2026-08-02',
      responsavel: 'Oscar (Engenharia ADM)',
      decisao: 'APROVADO',
      parecerTexto: 'Aprovado para a quinta-feira quinzenal. Lote de 500 pecas confirmado com PCP.',
      tecnicosEscalados: 'Filipe (1o Turno) e Charles (2o Turno)'
    },

    agendamento: {
      dataVisitaConfirmada: '2026-08-06',
      horarioVisita: '08:30',
      tecnicoFornecedorPresente: 'SIM',
      ferramentasEntreguesPreset: 'SIM',
      coneMontadoPreset: 'SIM'
    },

    chaoDeFabrica: {
      dataExecucao: '2026-08-06',
      maquinaReal: 'Centro Romi D800 (CNC-04)',
      cicloRealMedido: 132,
      parametros: { vc: 220, rpm: 1400, fz: 0.18, vf: 1260, ap: 2.5, ae: 40.0, balanco: 85 },
      registrosArestas: [
        { aresta: '#1', turno: '1o Turno', tecnico: 'Filipe', pecas: 65, ra: '1.4 µm', desgaste: 'Desgaste VB normal ~0.15mm' },
        { aresta: '#1 (Cont.)', turno: '2o Turno', tecnico: 'Charles', pecas: 60, ra: '1.5 µm', desgaste: 'Fim de vida VB=0.30mm sem quebras' }
      ],
      totalPecas: 125,
      vidaMediaAresta: 125,
      variacaoVidaPorc: '+56.3%'
    },

    fechamento: {
      dataFechamento: '',
      responsavelFechamento: 'Jonathan (Engenharia ADM)',
      volumeMensalPecas: 5000,
      leadTimeDias: 15,
      estoqueAlmoxAntigo: 45,
      consumoMesAntigo: 30,
      autonomiaDias: 45,
      margemSegurancaDias: 30,
      statusEstoque: 'SEGURO',
      decisaoFinal: 'PENDENTE',
      justificativaFinal: ''
    },

    timeline: [
      { dataHora: '2026-08-01 14:20', usuario: 'Roberto (Preset)', acao: 'Solicitacao Criada (D-2)', detalhe: 'Proposta submetida para analise.' },
      { dataHora: '2026-08-02 10:15', usuario: 'Oscar (Engenharia ADM)', acao: 'Viabilidade Aprovada (GO)', detalhe: 'Liberado para agendamento quinzenal.' },
      { dataHora: '2026-08-03 09:00', usuario: 'Roberto (Preset)', acao: 'Visita Agendada', detalhe: 'Agendado para 06/08 as 08:30 no Preset.' },
      { dataHora: '2026-08-06 08:30', usuario: 'Filipe (Tecnico 1oT)', acao: 'Inicio em Maquina', detalhe: '65 pecas usinadas no 1o turno.' },
      { dataHora: '2026-08-06 17:00', usuario: 'Charles (Tecnico 2oT)', acao: 'Passagem de Turno', detalhe: 'Aresta completou 125 pecas totais.' }
    ],

    comentarios: [
      { dataHora: '2026-08-02 11:00', usuario: 'Oscar', texto: 'Lote de flanges liberado no Romi D800 para a proxima quinta.' },
      { dataHora: '2026-08-06 16:30', usuario: 'Filipe', texto: 'Cavaco quebrando perfeito com refrigeracao soluvel padrao.' }
    ]
  },
  {
    id: 'TESTE-002/2026',
    stage: 'STAGE_5_VALIDACAO',
    statusGeral: 'BLOQUEADO_ESTOQUE',
    
    solicitacao: {
      dataSolicitacao: '2026-07-28',
      dataPrevistaTeste: '2026-07-30',
      solicitante: 'Jonathan (Engenharia)',
      fornecedor: 'Walter Tools',
      contatoFornecedor: 'Carlos (51) 99111-2233',
      codigoPeca: 'EX-3040-B',
      descricaoPeca: 'Eixo de Transmissao 35mm',
      materialPeca: 'Aco 8620 Cementado (58 HRC)',
      maquina: 'Torno Romi G280 (CNC-02)',
      operacao: 'Torneamento Acabamento',
      refrigeracao: 'Alta Pressao Interna',
      
      ferramentaAtual: 'DCMT 11T304-FP WPP10S',
      vidaAtual: 110,
      cicloAtual: 95,
      custoAtual: 42.00,
      arestasAtual: 2,
      
      ferramentaTeste: 'DCMT 11T304-PF WEP20',
      metaVida: 160,
      amostrasBonificadas: 10,
      precoTeste: 36.50,
      arestasTeste: 2,
      leadTimeDias: 45,
      estoqueLocal: 'NAO',
      justificativa: 'Melhoria de acabamento superficial e vida util.'
    },

    analiseEngenharia: {
      dataAnalise: '2026-07-29',
      responsavel: 'Oscar (Engenharia ADM)',
      decisao: 'APROVADO',
      parecerTexto: 'Aprovado para execucao técnica no Romi G280.',
      tecnicosEscalados: 'Filipe (1o Turno)'
    },

    agendamento: {
      dataVisitaConfirmada: '2026-07-30',
      horarioVisita: '13:30',
      tecnicoFornecedorPresente: 'SIM',
      ferramentasEntreguesPreset: 'SIM',
      coneMontadoPreset: 'SIM'
    },

    chaoDeFabrica: {
      dataExecucao: '2026-07-30',
      maquinaReal: 'Torno Romi G280 (CNC-02)',
      cicloRealMedido: 90,
      parametros: { vc: 260, rpm: 2200, fz: 0.12, vf: 264, ap: 0.8, ae: 0.8, balanco: 40 },
      registrosArestas: [
        { aresta: '#1', turno: '1o Turno', tecnico: 'Filipe', pecas: 165, ra: '0.8 µm', desgaste: 'Acabamento espelhado, vida excelente' }
      ],
      totalPecas: 165,
      vidaMediaAresta: 165,
      variacaoVidaPorc: '+50.0%'
    },

    fechamento: {
      dataFechamento: '2026-08-01',
      responsavelFechamento: 'Jonathan (Engenharia ADM)',
      volumeMensalPecas: 3000,
      leadTimeDias: 45,
      estoqueAlmoxAntigo: 15,
      consumoMesAntigo: 40,
      autonomiaDias: 11,
      margemSegurancaDias: -34,
      statusEstoque: 'BLOQUEADO_RUPTURA',
      decisaoFinal: 'BLOQUEADO_ESTOQUE',
      justificativaFinal: 'Aprovado tecnicamente com ganho de 50%, porem bloqueado por suprimentos devido a lead time de 45 dias contra 11 dias de estoque antigo. Virada suspensa ate lote de seguranca.'
    },

    timeline: [
      { dataHora: '2026-07-28 09:00', usuario: 'Jonathan', acao: 'Solicitacao Criada', detalhe: 'Torneamento acabamento eixo 8620.' },
      { dataHora: '2026-07-29 14:00', usuario: 'Oscar', acao: 'Viabilidade Aprovada', detalhe: 'Liberado para teste.' },
      { dataHora: '2026-07-30 16:00', usuario: 'Filipe', acao: 'Execucao Concluida', detalhe: '165 pecas usinadas com Ra 0.8.' },
      { dataHora: '2026-08-01 10:00', usuario: 'Jonathan', acao: 'Bloqueio por Suprimentos', detalhe: 'Lead time de 45 dias gera risco critico de ruptura.' }
    ],

    comentarios: [
      { dataHora: '2026-08-01 10:30', usuario: 'Jonathan', texto: 'Solicitado ao fornecedor remessa aerea de 30 pecas para cobrir o lead time.' }
    ]
  }
];

// Estado Global
let currentUser = devflowUsersStore[0];
let currentSelectedTestId = testDataStore[0].id;
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// Instancias de Graficos
let chartStatusInstance = null;
let chartSavingsInstance = null;

// =========================================================================
// INICIALIZACAO
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  carregarDadosLocais();
  carregarUsuariosLocais();
  configurarUsuario(currentUser.id);
  renderizarDashboard();
  renderizarTabelaPipeline();
  renderizarListaUsuariosGestao();
  iniciarGraficos();
});

// =========================================================================
// GESTAO DE NAVEGACAO E VIEWS (SPA)
// =========================================================================
function navegarPara(viewId, breadcrumbLabel) {
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active-view');
  });

  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.add('active-view');
  }

  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('data-view') === viewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (breadcrumbLabel) {
    document.getElementById('breadcrumbCurrent').textContent = breadcrumbLabel;
  }

  const mainArea = document.querySelector('.app-main');
  if (mainArea) mainArea.scrollTop = 0;
}

// =========================================================================
// AUTENTICACAO & GESTAO DE USUARIOS (LOGIN / SIGN UP / RBAC)
// =========================================================================
function abrirModalAuth(tabInicial = 'login') {
  alternarAbaAuth(tabInicial);
  document.getElementById('modalAuth').style.display = 'flex';
}

function fecharModalAuth() {
  document.getElementById('modalAuth').style.display = 'none';
}

function alternarAbaAuth(tab) {
  const tabLoginBtn = document.getElementById('authTabLoginBtn');
  const tabSignupBtn = document.getElementById('authTabSignupBtn');
  const formLogin = document.getElementById('formAuthLogin');
  const formSignup = document.getElementById('formAuthSignup');

  if (tab === 'login') {
    tabLoginBtn.classList.add('active');
    tabSignupBtn.classList.remove('active');
    formLogin.style.display = 'block';
    formSignup.style.display = 'none';
  } else {
    tabSignupBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    formSignup.style.display = 'block';
    formLogin.style.display = 'none';
  }
}

function realizarLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const user = devflowUsersStore.find(u => u.email.toLowerCase() === email || u.id.toLowerCase() === email);

  if (user) {
    currentUser = user;
    configurarUsuario(user.id);
    fecharModalAuth();
    salvarSessaoUsuario();
    alert(`Bem-vindo, ${user.name} (${user.roleTitle})!`);
    renderizarDashboard();
    renderizarTabelaPipeline();
    if (document.getElementById('viewWorkflow').classList.contains('active-view')) {
      abrirDetalhesWorkflow(currentSelectedTestId);
    }
  } else {
    alert('Usuario nao encontrado. Por favor, crie uma conta na aba "Cadastrar Novo Usuario".');
    alternarAbaAuth('signup');
  }
}

function cadastrarNovoUsuario() {
  const nome = document.getElementById('signupNome').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const roleSelect = document.getElementById('signupRole').value;

  if (!nome || !email) {
    alert('Preencha todos os campos obrigatorios.');
    return;
  }

  // Verificar duplicidade
  if (devflowUsersStore.some(u => u.email.toLowerCase() === email)) {
    alert('Este e-mail ja esta cadastrado no sistema.');
    return;
  }

  let role = DEVFLOW_ROLES.SOLICITANTE;
  let roleTitle = 'Solicitante';

  if (roleSelect === 'ADMIN') { role = DEVFLOW_ROLES.ADMIN; roleTitle = 'Engenharia ADM'; }
  else if (roleSelect === 'TECNICO_1T') { role = DEVFLOW_ROLES.TECNICO; roleTitle = 'Tecnico 1o Turno'; }
  else if (roleSelect === 'TECNICO_2T') { role = DEVFLOW_ROLES.TECNICO; roleTitle = 'Tecnico 2o Turno'; }
  else if (roleSelect === 'PRESET') { role = DEVFLOW_ROLES.SOLICITANTE; roleTitle = 'Setor de Preset'; }
  else if (roleSelect === 'GERENCIADOR') { role = DEVFLOW_ROLES.SOLICITANTE; roleTitle = 'Gerenciador / Fornecedor'; }
  else if (roleSelect === 'LEITURA') { role = DEVFLOW_ROLES.LEITURA; roleTitle = 'Consulta Geral'; }

  const id = `user_${Date.now()}`;
  const novoUsuario = { id, name: nome, email, roleTitle, role };

  devflowUsersStore.push(novoUsuario);
  salvarUsuariosLocais();

  currentUser = novoUsuario;
  configurarUsuario(novoUsuario.id);
  fecharModalAuth();
  salvarSessaoUsuario();

  alert(`Conta criada com sucesso! Conectado como ${nome} (${roleTitle}).`);
  renderizarDashboard();
  renderizarTabelaPipeline();
  renderizarListaUsuariosGestao();
}

function selecionarUsuario(userId) {
  const user = devflowUsersStore.find(u => u.id === userId);
  if (user) {
    currentUser = user;
    configurarUsuario(user.id);
    fecharModalAuth();
    salvarSessaoUsuario();
    renderizarDashboard();
    renderizarTabelaPipeline();
    
    if (document.getElementById('viewWorkflow').classList.contains('active-view')) {
      abrirDetalhesWorkflow(currentSelectedTestId);
    }
  }
}

function configurarUsuario(userId) {
  const user = devflowUsersStore.find(u => u.id === userId) || devflowUsersStore[0];
  document.getElementById('currentUserName').textContent = user.name;
  document.getElementById('currentUserRole').textContent = user.roleTitle;
  document.getElementById('currentUserAvatar').textContent = user.name.charAt(0);
}

function renderizarListaUsuariosGestao() {
  const container = document.getElementById('listaUsuariosGestao');
  if (!container) return;
  container.innerHTML = '';

  devflowUsersStore.forEach(u => {
    let badgeClass = 'badge-blue';
    if (u.role === DEVFLOW_ROLES.ADMIN) badgeClass = 'badge-orange';
    else if (u.role === DEVFLOW_ROLES.TECNICO) badgeClass = 'badge-green';
    else if (u.role === DEVFLOW_ROLES.LEITURA) badgeClass = 'badge-gray';

    const div = document.createElement('div');
    div.style = 'display: flex; justify-content: space-between; align-items: center; padding: 0.65rem; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border-color);';
    div.innerHTML = `
      <div>
        <strong>${u.name}</strong> &nbsp;<span class="badge ${badgeClass}">${u.roleTitle}</span>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${u.email}</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="selecionarUsuario('${u.id}')">Conectar</button>
    `;
    container.appendChild(div);
  });
}

// =========================================================================
// DASHBOARD GERAL & GRAFICOS (CHART.JS)
// =========================================================================
function renderizarDashboard() {
  const total = testDataStore.length;
  const emAnalise = testDataStore.filter(t => t.stage === 'STAGE_1_SOLICITACAO' || t.stage === 'STAGE_2_ANALISE').length;
  const emFabrica = testDataStore.filter(t => t.stage === 'STAGE_3_AGENDAMENTO' || t.stage === 'STAGE_4_EXECUCAO').length;
  const homologados = testDataStore.filter(t => t.statusGeral === 'HOMOLOGADO').length;
  const bloqueados = testDataStore.filter(t => t.statusGeral === 'BLOQUEADO_ESTOQUE').length;

  document.getElementById('dashTotal').textContent = total;
  document.getElementById('dashEmAnalise').textContent = emAnalise;
  document.getElementById('dashEmFabrica').textContent = emFabrica;
  document.getElementById('dashHomologados').textContent = homologados;
  document.getElementById('dashBloqueados').textContent = bloqueados;

  atualizarGraficos();
}

function iniciarGraficos() {
  const ctxStatus = document.getElementById('chartStatus');
  const ctxSavings = document.getElementById('chartSavings');

  if (ctxStatus && typeof Chart !== 'undefined') {
    if (chartStatusInstance) chartStatusInstance.destroy();
    chartStatusInstance = new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: ['Em Analise (D-2)', 'Em Teste Fabrica', 'Homologados', 'Bloqueado Estoque'],
        datasets: [{
          data: [1, 1, 0, 1],
          backgroundColor: ['#2563eb', '#ff6600', '#059669', '#d97706'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } } }
      }
    });
  }

  if (ctxSavings && typeof Chart !== 'undefined') {
    if (chartSavingsInstance) chartSavingsInstance.destroy();
    chartSavingsInstance = new Chart(ctxSavings, {
      type: 'bar',
      data: {
        labels: ['Sandvik (Flange 120)', 'Walter (Eixo 35mm)'],
        datasets: [{
          label: 'Economia Anual Projetada (R$)',
          data: [10620, 18900],
          backgroundColor: '#ff6600',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { font: { family: 'Inter', size: 10 } } },
          x: { ticks: { font: { family: 'Inter', size: 10 } } }
        }
      }
    });
  }
}

function atualizarGraficos() {
  if (!chartStatusInstance || !chartSavingsInstance) return;

  const emAnalise = testDataStore.filter(t => t.stage === 'STAGE_1_SOLICITACAO' || t.stage === 'STAGE_2_ANALISE').length;
  const emFabrica = testDataStore.filter(t => t.stage === 'STAGE_3_AGENDAMENTO' || t.stage === 'STAGE_4_EXECUCAO').length;
  const homologados = testDataStore.filter(t => t.statusGeral === 'HOMOLOGADO').length;
  const bloqueados = testDataStore.filter(t => t.statusGeral === 'BLOQUEADO_ESTOQUE').length;

  chartStatusInstance.data.datasets[0].data = [emAnalise, emFabrica, homologados, bloqueados];
  chartStatusInstance.update();
}

// =========================================================================
// PIPELINE DE TESTES (TABELA FILTRAVEL & PAGINADA)
// =========================================================================
function renderizarTabelaPipeline() {
  const busca = (document.getElementById('inputBuscaTabela')?.value || '').toLowerCase();
  const filtroStatus = document.getElementById('selectFiltroStatus')?.value || 'TODOS';

  let filtrados = testDataStore.filter(teste => {
    const matchBusca = teste.id.toLowerCase().includes(busca) ||
                       teste.solicitacao.descricaoPeca.toLowerCase().includes(busca) ||
                       teste.solicitacao.fornecedor.toLowerCase().includes(busca) ||
                       teste.solicitacao.maquina.toLowerCase().includes(busca);

    const matchStatus = (filtroStatus === 'TODOS') || (teste.stage === filtroStatus) || (teste.statusGeral === filtroStatus);
    return matchBusca && matchStatus;
  });

  const totalFiltrados = filtrados.length;
  const totalPages = Math.ceil(totalFiltrados / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginaItens = filtrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  const tbody = document.querySelector('#tabelaPipeline tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (paginaItens.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Nenhum teste encontrado com os filtros aplicados.</td></tr>`;
    return;
  }

  paginaItens.forEach(teste => {
    const stageInfo = WORKFLOW_STAGES[teste.stage] || WORKFLOW_STAGES.STAGE_1_SOLICITACAO;

    let statusBadge = 'badge-blue';
    let statusLabel = 'Em Andamento';
    if (teste.statusGeral === 'HOMOLOGADO') { statusBadge = 'badge-green'; statusLabel = 'Homologado'; }
    else if (teste.statusGeral === 'BLOQUEADO_ESTOQUE') { statusBadge = 'badge-amber'; statusLabel = 'Bloqueado Estoque'; }
    else if (teste.statusGeral === 'APROVADO_ENGENHARIA') { statusBadge = 'badge-orange'; statusLabel = 'Aprovado Engenharia'; }
    else if (teste.statusGeral === 'REPROVADO_ENGENHARIA') { statusBadge = 'badge-red'; statusLabel = 'Recusado Engenharia'; }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 700; font-family: var(--font-mono); color: var(--viemar-orange);">${teste.id}</td>
      <td><strong>${teste.solicitacao.descricaoPeca}</strong><br><span style="font-size: 0.75rem; color: var(--text-muted);">${teste.solicitacao.codigoPeca}</span></td>
      <td>${teste.solicitacao.fornecedor}</td>
      <td>${teste.solicitacao.maquina}</td>
      <td><span class="badge ${stageInfo.badgeClass}">${stageInfo.label}</span></td>
      <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-secondary btn-sm" onclick="abrirDetalhesWorkflow('${teste.id}')">Acessar Workflow</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const pageIndicator = document.getElementById('pipelinePageIndicator');
  if (pageIndicator) {
    pageIndicator.textContent = `Exibindo ${paginaItens.length} de ${totalFiltrados} testes (Pagina ${currentPage} de ${totalPages})`;
  }
}

function paginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    renderizarTabelaPipeline();
  }
}

function proximaPagina() {
  const busca = (document.getElementById('inputBuscaTabela')?.value || '').toLowerCase();
  const filtroStatus = document.getElementById('selectFiltroStatus')?.value || 'TODOS';
  const filtrados = testDataStore.filter(t => (filtroStatus === 'TODOS' || t.stage === filtroStatus));
  const totalPages = Math.ceil(filtrados.length / ITEMS_PER_PAGE) || 1;

  if (currentPage < totalPages) {
    currentPage++;
    renderizarTabelaPipeline();
  }
}

// =========================================================================
// WORKFLOW COMPLETO (5 ETAPAS + AUDITORIA + COMENTARIOS)
// =========================================================================
function abrirDetalhesWorkflow(testeId) {
  const teste = testDataStore.find(t => t.id === testeId);
  if (!teste) return;

  currentSelectedTestId = testeId;
  document.getElementById('wfIdTeste').textContent = teste.id;
  document.getElementById('wfDescPeca').textContent = `${teste.solicitacao.descricaoPeca} (${teste.solicitacao.codigoPeca})`;
  document.getElementById('wfFornecedor').textContent = teste.solicitacao.fornecedor;

  atualizarStepper(teste);
  preencherAba1(teste);
  preencherAba2(teste);
  preencherAba3(teste);
  preencherAba4(teste);
  preencherAba5(teste);
  renderizarTimeline(teste);
  renderizarComentarios(teste);

  aplicarPermissoes(teste);

  let tab = 1;
  if (teste.stage === 'STAGE_2_ANALISE') tab = 2;
  else if (teste.stage === 'STAGE_3_AGENDAMENTO') tab = 3;
  else if (teste.stage === 'STAGE_4_EXECUCAO') tab = 4;
  else if (teste.stage === 'STAGE_5_VALIDACAO') tab = 5;

  alternarAbaWorkflow(tab);
  navegarPara('viewWorkflow', `Workflow ${teste.id}`);
}

function atualizarStepper(teste) {
  const stageNum = WORKFLOW_STAGES[teste.stage] ? WORKFLOW_STAGES[teste.stage].id : 1;

  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`wfStep_${i}`);
    if (!el) continue;
    el.classList.remove('active', 'completed');
    if (i < stageNum) el.classList.add('completed');
    else if (i === stageNum) el.classList.add('active');
  }
}

function alternarAbaWorkflow(tabIndex) {
  for (let i = 1; i <= 5; i++) {
    const tabEl = document.getElementById(`wfTabContent_${i}`);
    if (tabEl) tabEl.style.display = (i === tabIndex) ? 'block' : 'none';

    const stepEl = document.getElementById(`wfStep_${i}`);
    if (stepEl) {
      stepEl.style.borderColor = (i === tabIndex) ? 'var(--viemar-orange)' : 'var(--border-color)';
    }
  }
}

function aplicarPermissoes(teste) {
  const isRequester = (currentUser.role === DEVFLOW_ROLES.SOLICITANTE);
  const isLeitura = (currentUser.role === DEVFLOW_ROLES.LEITURA);
  const isAdmin = (currentUser.role === DEVFLOW_ROLES.ADMIN);
  const isTecnico = (currentUser.role === DEVFLOW_ROLES.TECNICO);

  const banner = document.getElementById('wfRoleBanner');
  if (isRequester || isLeitura) {
    banner.className = 'role-banner role-banner-readonly';
    banner.innerHTML = `<span>Perfil ${currentUser.roleTitle} (${currentUser.name}): Modo de Visualizacao e Acompanhamento em Tempo Real.</span>`;
  } else if (isAdmin) {
    banner.className = 'role-banner role-banner-editor';
    banner.innerHTML = `<span>Perfil Engenharia ADM (${currentUser.name}): Acesso Total a Avaliacao, Agendamento e Laudos.</span>`;
  } else if (isTecnico) {
    banner.className = 'role-banner role-banner-editor';
    banner.innerHTML = `<span>Perfil Tecnico (${currentUser.name}): Registro de Chao de Fabrica e Passagem de Turno liberados.</span>`;
  }

  const formEng = document.getElementById('formAnaliseEngenharia');
  if (formEng) {
    formEng.querySelectorAll('input, select, textarea, button').forEach(el => {
      if (el.type !== 'button') el.disabled = !isAdmin;
    });
  }

  const formFloor = document.getElementById('formChaoDeFabrica');
  if (formFloor) {
    formFloor.querySelectorAll('input, select, textarea, button').forEach(el => {
      if (el.type !== 'button' || el.id === 'btnSalvarChaoFabrica') {
        el.disabled = (isRequester || isLeitura);
      }
    });
  }

  const formFech = document.getElementById('formFechamentoEstoque');
  if (formFech) {
    formFech.querySelectorAll('input, select, textarea, button').forEach(el => {
      if (el.type !== 'button' || el.id === 'btnSalvarFechamento') {
        el.disabled = !isAdmin;
      }
    });
  }
}

function preencherAba1(teste) {
  const s = teste.solicitacao;
  document.getElementById('wfSolData').value = s.dataSolicitacao;
  document.getElementById('wfSolDataPrev').value = s.dataPrevistaTeste;
  document.getElementById('wfSolNome').value = s.solicitante;
  document.getElementById('wfSolForn').value = s.fornecedor;
  document.getElementById('wfSolContato').value = s.contatoFornecedor;
  document.getElementById('wfSolPeca').value = `${s.descricaoPeca} (${s.codigoPeca})`;
  document.getElementById('wfSolMaterial').value = s.materialPeca;
  document.getElementById('wfSolMaquina').value = s.maquina;
  document.getElementById('wfSolOperacao').value = s.operacao;
  document.getElementById('wfSolRefrig').value = s.refrigeracao;

  document.getElementById('wfSolFerrAtual').value = s.ferramentaAtual;
  document.getElementById('wfSolVidaAtual').value = s.vidaAtual;
  document.getElementById('wfSolCicloAtual').value = s.cicloAtual;
  document.getElementById('wfSolCustoAtual').value = s.custoAtual;

  document.getElementById('wfSolFerrTeste').value = s.ferramentaTeste;
  document.getElementById('wfSolMetaVida').value = s.metaVida;
  document.getElementById('wfSolAmostras').value = s.amostrasBonificadas;
  document.getElementById('wfSolPrecoTeste').value = s.precoTeste;
  document.getElementById('wfSolLeadTime').value = s.leadTimeDias;
  document.getElementById('wfSolEstoqueLocal').value = s.estoqueLocal;

  const ganho = (((s.metaVida - s.vidaAtual) / s.vidaAtual) * 100).toFixed(1);
  document.getElementById('wfSolGanho').textContent = `${ganho >= 0 ? '+' : ''}${ganho}%`;
}

function preencherAba2(teste) {
  const a = teste.analiseEngenharia || {};
  document.getElementById('wfEngData').value = a.dataAnalise || new Date().toISOString().split('T')[0];
  document.getElementById('wfEngResp').value = a.responsavel || currentUser.name;
  document.getElementById('wfEngDecisao').value = a.decisao || 'APROVADO';
  document.getElementById('wfEngParecer').value = a.parecerTexto || '';
  document.getElementById('wfEngTecnicos').value = a.tecnicosEscalados || 'Filipe (1o Turno) e Charles (2o Turno)';
}

function salvarDecisaoEngenharia() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const decisao = document.getElementById('wfEngDecisao').value;
  const parecer = document.getElementById('wfEngParecer').value;

  teste.analiseEngenharia = {
    dataAnalise: new Date().toISOString().split('T')[0],
    responsavel: currentUser.name,
    decisao: decisao,
    parecerTexto: parecer,
    tecnicosEscalados: document.getElementById('wfEngTecnicos').value
  };

  if (decisao === 'APROVADO') {
    teste.stage = 'STAGE_3_AGENDAMENTO';
    teste.statusGeral = 'APROVADO_ENGENHARIA';
    registrarTimeline(teste, `Viabilidade Aprovada (GO) por ${currentUser.name}`, parecer);
    alert('Devolutiva registrada! Teste avancado para Agendamento da Visita.');
  } else {
    teste.statusGeral = 'REPROVADO_ENGENHARIA';
    registrarTimeline(teste, `Viabilidade Recusada por ${currentUser.name}`, parecer);
    alert('Devolutiva de recusa registrada no historico.');
  }

  salvarDadosLocais();
  abrirDetalhesWorkflow(teste.id);
  renderizarDashboard();
}

function preencherAba3(teste) {
  const ag = teste.agendamento || {};
  document.getElementById('wfAgData').value = ag.dataVisitaConfirmada || teste.solicitacao.dataPrevistaTeste;
  document.getElementById('wfAgHora').value = ag.horarioVisita || '08:30';
  document.getElementById('wfAgFornPres').value = ag.tecnicoFornecedorPresente || 'SIM';
  document.getElementById('wfAgPresetEnt').value = ag.ferramentasEntreguesPreset || 'SIM';
  document.getElementById('wfAgConeMont').value = ag.coneMontadoPreset || 'SIM';
}

function confirmarAgendamento() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const data = document.getElementById('wfAgData').value;
  const hora = document.getElementById('wfAgHora').value;

  teste.agendamento = {
    dataVisitaConfirmada: data,
    horarioVisita: hora,
    tecnicoFornecedorPresente: document.getElementById('wfAgFornPres').value,
    ferramentasEntreguesPreset: document.getElementById('wfAgPresetEnt').value,
    coneMontadoPreset: document.getElementById('wfAgConeMont').value
  };

  teste.stage = 'STAGE_4_EXECUCAO';
  teste.statusGeral = 'AGENDADO';
  registrarTimeline(teste, `Visita Confirmada por ${currentUser.name}`, `Agendado para ${data} as ${hora}. Cone montado no Preset.`);

  salvarDadosLocais();
  alert('Visita agendada com sucesso! Liberado para o Chao de Fabrica.');
  abrirDetalhesWorkflow(teste.id);
  renderizarDashboard();
}

function preencherAba4(teste) {
  const cf = teste.chaoDeFabrica || {};
  document.getElementById('wfCfMaquina').value = cf.maquinaReal || teste.solicitacao.maquina;
  document.getElementById('wfCfCiclo').value = cf.cicloRealMedido || teste.solicitacao.cicloAtual;

  const p = cf.parametros || {};
  document.getElementById('wfCfVc').value = p.vc || 220;
  document.getElementById('wfCfRpm').value = p.rpm || 1400;
  document.getElementById('wfCfFz').value = p.fz || 0.18;
  document.getElementById('wfCfVf').value = p.vf || 1260;
  document.getElementById('wfCfAp').value = p.ap || 2.5;
  document.getElementById('wfCfAe').value = p.ae || 40;
  document.getElementById('wfCfBalanco').value = p.balanco || 85;

  const tbody = document.querySelector('#tabelaArestasDevFlow tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const registros = cf.registrosArestas || [
    { aresta: '#1', turno: '1o Turno', tecnico: 'Filipe', pecas: 65, ra: '1.4 µm', desgaste: 'Desgaste VB normal' }
  ];

  registros.forEach(reg => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: bold; text-align: center;">${reg.aresta}</td>
      <td><input type="text" class="cell-input" value="${reg.turno}"></td>
      <td><input type="text" class="cell-input" value="${reg.tecnico}"></td>
      <td><input type="number" class="cell-input input-pecas-devflow" value="${reg.pecas}" oninput="recalcularChaoDeFabrica()"></td>
      <td><input type="text" class="cell-input" value="${reg.ra}"></td>
      <td><input type="text" class="cell-input" value="${reg.desgaste}"></td>
    `;
    tbody.appendChild(tr);
  });

  recalcularChaoDeFabrica();
}

function recalcularChaoDeFabrica() {
  const inputs = document.querySelectorAll('.input-pecas-devflow');
  let total = 0;
  let count = 0;
  inputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
      total += val;
      count++;
    }
  });

  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  const vidaRef = teste ? teste.solicitacao.vidaAtual : 80;

  document.getElementById('wfCfTotalPecas').textContent = total;
  document.getElementById('wfCfVidaMedia').textContent = total > 0 ? (total / Math.max(1, count >= 2 ? (count/2).toFixed(0) : 1)).toFixed(0) : 0;

  const kpiVar = document.getElementById('wfCfVariacao');
  if (vidaRef > 0 && total > 0) {
    const varPct = (((total - vidaRef) / vidaRef) * 100).toFixed(1);
    kpiVar.textContent = `${varPct >= 0 ? '+' : ''}${varPct}%`;
    kpiVar.style.color = varPct >= 0 ? 'var(--status-green-text)' : 'var(--status-red-text)';
  }
}

function adicionarLinhaAresta() {
  const tbody = document.querySelector('#tabelaArestasDevFlow tbody');
  const count = tbody.rows.length + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td style="font-weight: bold; text-align: center;">#${Math.ceil(count/2)}</td>
    <td><input type="text" class="cell-input" value="${count % 2 === 0 ? '2o Turno' : '1o Turno'}"></td>
    <td><input type="text" class="cell-input" value="${count % 2 === 0 ? 'Charles' : 'Filipe'}"></td>
    <td><input type="number" class="cell-input input-pecas-devflow" placeholder="Qtd" oninput="recalcularChaoDeFabrica()"></td>
    <td><input type="text" class="cell-input" placeholder="Ra µm"></td>
    <td><input type="text" class="cell-input" placeholder="Desgaste"></td>
  `;
  tbody.appendChild(tr);
}

function salvarChaoDeFabrica() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const total = parseFloat(document.getElementById('wfCfTotalPecas').textContent) || 0;
  const media = parseFloat(document.getElementById('wfCfVidaMedia').textContent) || 0;

  teste.chaoDeFabrica.totalPecas = total;
  teste.chaoDeFabrica.vidaMediaAresta = media;
  teste.chaoDeFabrica.cicloRealMedido = parseFloat(document.getElementById('wfCfCiclo').value) || teste.solicitacao.cicloAtual;

  teste.stage = 'STAGE_5_VALIDACAO';
  registrarTimeline(teste, `Resultados Salvos por ${currentUser.name}`, `${total} pecas usinadas registradas. Liberado para Laudo de Fechamento.`);

  salvarDadosLocais();
  alert('Resultados de fabrica gravados com sucesso! Avancando para a Validacao Final.');
  abrirDetalhesWorkflow(teste.id);
  renderizarDashboard();
}

function preencherAba5(teste) {
  const s = teste.solicitacao;
  const cf = teste.chaoDeFabrica;
  const f = teste.fechamento || {};

  document.getElementById('wfFechPrecoAtual').value = s.custoAtual;
  document.getElementById('wfFechArestasAtual').value = s.arestasAtual || 2;
  document.getElementById('wfFechVidaAtual').value = s.vidaAtual;

  document.getElementById('wfFechPrecoTeste').value = s.precoTeste;
  document.getElementById('wfFechArestasTeste').value = s.arestasTeste || 4;
  document.getElementById('wfFechVidaTeste').value = cf.vidaMediaAresta || s.metaVida;

  document.getElementById('wfFechVolumeMes').value = f.volumeMensalPecas || 5000;
  document.getElementById('wfFechLeadTime').value = f.leadTimeDias || s.leadTimeDias || 15;
  document.getElementById('wfFechEstoqueAlmox').value = f.estoqueAlmoxAntigo || 45;
  document.getElementById('wfFechConsumoMes').value = f.consumoMesAntigo || 30;

  document.getElementById('wfFechDecisaoFinal').value = f.decisaoFinal || 'HOMOLOGADO';
  document.getElementById('wfFechJustificativa').value = f.justificativaFinal || '';

  recalcularFechamento();
}

function recalcularFechamento() {
  const precoAt = parseFloat(document.getElementById('wfFechPrecoAtual').value) || 0;
  const arestAt = parseFloat(document.getElementById('wfFechArestasAtual').value) || 1;
  const vidaAt = parseFloat(document.getElementById('wfFechVidaAtual').value) || 1;
  const cppAt = (precoAt / (arestAt * vidaAt));
  document.getElementById('wfFechCppAtual').textContent = `R$ ${cppAt.toFixed(3)}`;

  const precoTe = parseFloat(document.getElementById('wfFechPrecoTeste').value) || 0;
  const arestTe = parseFloat(document.getElementById('wfFechArestasTeste').value) || 1;
  const vidaTe = parseFloat(document.getElementById('wfFechVidaTeste').value) || 1;
  const cppTe = (precoTe / (arestTe * vidaTe));
  document.getElementById('wfFechCppNovo').textContent = `R$ ${cppTe.toFixed(3)}`;

  const volume = parseFloat(document.getElementById('wfFechVolumeMes').value) || 0;
  if (volume > 0) {
    const econMes = (cppAt - cppTe) * volume;
    const econAno = econMes * 12;
    document.getElementById('wfFechEconMes').textContent = `R$ ${econMes.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / mes`;
    document.getElementById('wfFechEconAno').textContent = `R$ ${econAno.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / ano`;
  }

  const leadTime = parseFloat(document.getElementById('wfFechLeadTime').value) || 0;
  const estoque = parseFloat(document.getElementById('wfFechEstoqueAlmox').value) || 0;
  const consumoMes = parseFloat(document.getElementById('wfFechConsumoMes').value) || 1;

  const consumoDia = consumoMes / 30;
  const autonomiaDias = Math.floor(estoque / consumoDia);
  const margem = autonomiaDias - leadTime;

  document.getElementById('wfFechAutonomia').textContent = `${autonomiaDias} dias`;
  document.getElementById('wfFechMargem').textContent = `${margem >= 0 ? '+' : ''}${margem} dias`;

  const boxMargem = document.getElementById('wfFechBoxMargem');
  const kpiStatus = document.getElementById('wfFechKpiStatusEstoque');
  const boxStatus = document.getElementById('wfFechBoxStatusEstoque');
  const alerta = document.getElementById('wfFechAlertaRuptura');

  if (margem >= 15) {
    boxMargem.className = 'kpi-box success';
    boxStatus.className = 'kpi-box success';
    kpiStatus.textContent = 'TRANSICAO SEGURA';
    kpiStatus.style.color = 'var(--status-green-text)';
    alerta.style.display = 'none';
  } else if (margem >= 5) {
    boxMargem.className = 'kpi-box warning';
    boxStatus.className = 'kpi-box warning';
    kpiStatus.textContent = 'ATENCAO / ALINHAR';
    kpiStatus.style.color = 'var(--status-amber-text)';
    alerta.style.display = 'none';
  } else {
    boxMargem.className = 'kpi-box danger';
    boxStatus.className = 'kpi-box danger';
    kpiStatus.textContent = 'BLOQUEIO: RISCO RUPTURA';
    kpiStatus.style.color = 'var(--status-red-text)';
    alerta.style.display = 'flex';
  }
}

function emitirLaudoFinal() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const decisao = document.getElementById('wfFechDecisaoFinal').value;
  const just = document.getElementById('wfFechJustificativa').value;

  teste.fechamento = {
    dataFechamento: new Date().toISOString().split('T')[0],
    responsavelFechamento: currentUser.name,
    volumeMensalPecas: parseFloat(document.getElementById('wfFechVolumeMes').value) || 5000,
    leadTimeDias: parseFloat(document.getElementById('wfFechLeadTime').value) || 15,
    estoqueAlmoxAntigo: parseFloat(document.getElementById('wfFechEstoqueAlmox').value) || 45,
    consumoMesAntigo: parseFloat(document.getElementById('wfFechConsumoMes').value) || 30,
    decisaoFinal: decisao,
    justificativaFinal: just
  };

  if (decisao === 'HOMOLOGADO') {
    teste.statusGeral = 'HOMOLOGADO';
    registrarTimeline(teste, `Homologacao Final por ${currentUser.name}`, `Laudo emitido com sucesso. Transicao de estoque autorizada.`);
  } else if (decisao === 'BLOQUEADO_ESTOQUE') {
    teste.statusGeral = 'BLOQUEADO_ESTOQUE';
    registrarTimeline(teste, `Aprovado Tecnico, Bloqueado por Suprimentos`, `Virada suspensa por risco de ruptura.`);
  } else {
    teste.statusGeral = 'REPROVADO_TECNICO';
    registrarTimeline(teste, `Reprovado em Laudo Final`, just);
  }

  salvarDadosLocais();
  alert('Laudo de Fechamento emitido e registrado no historico do teste!');
  abrirDetalhesWorkflow(teste.id);
  renderizarDashboard();
}

// =========================================================================
// TIMELINE DE AUDITORIA & COMENTARIOS EM TEMPO REAL
// =========================================================================
function renderizarTimeline(teste) {
  const container = document.getElementById('wfTimelineList');
  if (!container) return;
  container.innerHTML = '';

  (teste.timeline || []).forEach((item, idx) => {
    const isLast = (idx === teste.timeline.length - 1);
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `
      <div class="timeline-dot ${isLast ? 'green' : ''}"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span><strong>${item.usuario}</strong></span>
          <span>${item.dataHora}</span>
        </div>
        <div class="timeline-title">${item.acao}</div>
        <div class="timeline-body">${item.detalhe}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function registrarTimeline(teste, acao, detalhe) {
  const agora = new Date();
  const dataFormatada = `${agora.toISOString().split('T')[0]} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

  if (!teste.timeline) teste.timeline = [];
  teste.timeline.push({ dataHora: dataFormatada, usuario: currentUser.name, acao: acao, detalhe: detalhe });
}

function renderizarComentarios(teste) {
  const container = document.getElementById('wfCommentsList');
  if (!container) return;
  container.innerHTML = '';

  (teste.comentarios || []).forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment-card';
    div.innerHTML = `
      <div class="comment-header">
        <span><strong>${c.usuario}</strong></span>
        <span>${c.dataHora}</span>
      </div>
      <div style="font-size: 0.825rem; color: var(--text-main);">${c.texto}</div>
    `;
    container.appendChild(div);
  });
}

function adicionarComentario() {
  const input = document.getElementById('inputNovoComentario');
  const texto = input.value.trim();
  if (!texto) return;

  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const agora = new Date();
  const dataFormatada = `${agora.toISOString().split('T')[0]} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

  if (!teste.comentarios) teste.comentarios = [];
  teste.comentarios.push({ dataHora: dataFormatada, usuario: currentUser.name, texto: texto });

  input.value = '';
  salvarDadosLocais();
  renderizarComentarios(teste);
}

// =========================================================================
// MODAL DE NOVA SOLICITACAO (D-2)
// =========================================================================
function abrirModalNovaSolicitacao() {
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('modalDataPrevista').value = hoje;
  document.getElementById('modalNovaSolicitacao').style.display = 'flex';
}

function fecharModalNovaSolicitacao() {
  document.getElementById('modalNovaSolicitacao').style.display = 'none';
}

function submeterModalSolicitacao() {
  const idNovo = `TESTE-00${testDataStore.length + 1}/2026`;
  const hoje = new Date().toISOString().split('T')[0];

  const novoTeste = {
    id: idNovo,
    stage: 'STAGE_1_SOLICITACAO',
    statusGeral: 'PENDENTE_ANALISE',
    solicitacao: {
      dataSolicitacao: hoje,
      dataPrevistaTeste: document.getElementById('modalDataPrevista').value,
      solicitante: currentUser.name,
      fornecedor: document.getElementById('modalFornecedor').value,
      contatoFornecedor: document.getElementById('modalContato').value,
      codigoPeca: document.getElementById('modalCodigoPeca').value,
      descricaoPeca: document.getElementById('modalDescPeca').value,
      materialPeca: document.getElementById('modalMaterial').value,
      maquina: document.getElementById('modalMaquina').value,
      operacao: document.getElementById('modalOperacao').value,
      refrigeracao: document.getElementById('modalRefrigeracao').value,
      
      ferramentaAtual: document.getElementById('modalFerrAtual').value,
      vidaAtual: parseFloat(document.getElementById('modalVidaAtual').value) || 80,
      cicloAtual: parseFloat(document.getElementById('modalCicloAtual').value) || 120,
      custoAtual: parseFloat(document.getElementById('modalCustoAtual').value) || 40,
      arestasAtual: 2,
      
      ferramentaTeste: document.getElementById('modalFerrTeste').value,
      metaVida: parseFloat(document.getElementById('modalMetaVida').value) || 120,
      amostrasBonificadas: parseFloat(document.getElementById('modalAmostras').value) || 10,
      precoTeste: parseFloat(document.getElementById('modalPrecoTeste').value) || 35,
      arestasTeste: 4,
      leadTimeDias: parseFloat(document.getElementById('modalLeadTime').value) || 15,
      estoqueLocal: document.getElementById('modalEstoqueLocal').value,
      justificativa: document.getElementById('modalJustificativa').value
    },
    analiseEngenharia: {},
    agendamento: {},
    chaoDeFabrica: { parametros: {}, registrosArestas: [] },
    fechamento: {},
    timeline: [
      { dataHora: `${hoje} 08:00`, usuario: currentUser.name, acao: 'Solicitacao Criada (D-2)', detalhe: 'Aguardando avaliacao da Engenharia.' }
    ],
    comentarios: []
  };

  testDataStore.unshift(novoTeste);
  salvarDadosLocais();
  fecharModalNovaSolicitacao();
  alert(`Solicitacao ${idNovo} cadastrada com sucesso!`);
  renderizarDashboard();
  renderizarTabelaPipeline();
  abrirDetalhesWorkflow(idNovo);
}

// =========================================================================
// WHATSAPP & EXPORTACAO
// =========================================================================
function copiarWhatsAppWorkflow() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const texto = `[VIEMAR TOOLFLOW - STATUS TESTE ${teste.id}]\n` +
                `* Peca: ${teste.solicitacao.descricaoPeca}\n` +
                `* Maquina: ${teste.solicitacao.maquina}\n` +
                `* Fornecedor: ${teste.solicitacao.fornecedor}\n` +
                `* Ferramenta Proposta: ${teste.solicitacao.ferramentaTeste}\n` +
                `* Etapa Atual: ${WORKFLOW_STAGES[teste.stage].label}\n` +
                `* Status Geral: ${teste.statusGeral}\n` +
                `Acompanhamento no Portal de Testes Viemar.`;

  navigator.clipboard.writeText(texto).then(() => {
    alert('Resumo do workflow copiado com padrao Viemar para a area de transferencia!');
  });
}

// =========================================================================
// PERSISTENCIA LOCAL / USUARIOS / SESSAO
// =========================================================================
function salvarDadosLocais() {
  localStorage.setItem('viemar_toolflow_store_v1', JSON.stringify(testDataStore));
}

function carregarDadosLocais() {
  const salvos = localStorage.getItem('viemar_toolflow_store_v1') || localStorage.getItem('viemar_devflow_store_v1');
  if (salvos) {
    try {
      testDataStore = JSON.parse(salvos);
    } catch (e) {
      console.error(e);
    }
  }
}

function salvarUsuariosLocais() {
  localStorage.setItem('viemar_toolflow_users_v1', JSON.stringify(devflowUsersStore));
}

function carregarUsuariosLocais() {
  const salvos = localStorage.getItem('viemar_toolflow_users_v1') || localStorage.getItem('viemar_devflow_users_v1');
  if (salvos) {
    try {
      devflowUsersStore = JSON.parse(salvos);
    } catch (e) {
      console.error(e);
    }
  }

  const sessao = localStorage.getItem('viemar_toolflow_current_user_id') || localStorage.getItem('viemar_devflow_current_user_id');
  if (sessao) {
    const userSessao = devflowUsersStore.find(u => u.id === sessao);
    if (userSessao) currentUser = userSessao;
  }
}

function salvarSessaoUsuario() {
  localStorage.setItem('viemar_toolflow_current_user_id', currentUser.id);
}
