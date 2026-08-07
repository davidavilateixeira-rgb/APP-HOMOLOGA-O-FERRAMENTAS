// =========================================================================
// VIEMAR AUTOMOTIVE - SISTEMA DE WORKFLOW E GESTAO DE TESTES DE FERRAMENTAS
// =========================================================================

// Perfis de Acesso e Papeis na Viemar
const VIEMAR_ROLES = {
  ADMIN: 'ADMIN',         // Engenharia ADM (Oscar, Jonathan, Ponto Focal) - Acesso Total
  FLOOR_TECH: 'FLOOR_TECH', // Tecnicos de Chao de Fabrica (Filipe 1T, Charles 2T) - Acompanhamento e Registro
  REQUESTER: 'REQUESTER'   // Solicitante (Preset, Gerenciador Externo, Fornecedor) - Abertura e Visualizacao
};

const VIEMAR_USERS = [
  { id: 'oscar_adm', name: 'Oscar', roleTitle: 'Engenharia ADM', role: VIEMAR_ROLES.ADMIN },
  { id: 'jonathan_adm', name: 'Jonathan', roleTitle: 'Engenharia ADM', role: VIEMAR_ROLES.ADMIN },
  { id: 'ponto_focal', name: 'Ponto Focal', roleTitle: 'Coordenador de Testes', role: VIEMAR_ROLES.ADMIN },
  { id: 'filipe_1t', name: 'Filipe', roleTitle: 'Tecnico 1o Turno', role: VIEMAR_ROLES.FLOOR_TECH },
  { id: 'charles_2t', name: 'Charles', roleTitle: 'Tecnico 2o Turno', role: VIEMAR_ROLES.FLOOR_TECH },
  { id: 'preset_op', name: 'Roberto (Preset)', roleTitle: 'Setor de Preset', role: VIEMAR_ROLES.REQUESTER },
  { id: 'gerenciador_ext', name: 'Gerenciador Externo', roleTitle: 'Gestao de Ferramentas', role: VIEMAR_ROLES.REQUESTER },
  { id: 'fornecedor_ext', name: 'Fornecedor Externo', roleTitle: 'Representante Tecnico', role: VIEMAR_ROLES.REQUESTER }
];

// Definicao das Etapas do Workflow
const WORKFLOW_STAGES = {
  STAGE_1_SOLICITACAO: { id: 1, key: 'STAGE_1_SOLICITACAO', label: '1. Solicitacao (D-2)', badgeClass: 'badge-blue' },
  STAGE_2_ANALISE: { id: 2, key: 'STAGE_2_ANALISE', label: '2. Analise Engenharia', badgeClass: 'badge-orange' },
  STAGE_3_AGENDAMENTO: { id: 3, key: 'STAGE_3_AGENDAMENTO', label: '3. Agendamento Visita', badgeClass: 'badge-amber' },
  STAGE_4_EXECUCAO: { id: 4, key: 'STAGE_4_EXECUCAO', label: '4. Teste em Maquina', badgeClass: 'badge-blue' },
  STAGE_5_VALIDACAO: { id: 5, key: 'STAGE_5_VALIDACAO', label: '5. Validacao & Estoque', badgeClass: 'badge-green' }
};

// Banco de Dados Local com Historico de Workflow
let testDataStore = [
  {
    id: 'TESTE-001/2026',
    stage: 'STAGE_4_EXECUCAO',
    statusGeral: 'EM_ANDAMENTO', // PENDENTE_ANALISE, APROVADO_ENGENHARIA, REPROVADO_ENGENHARIA, AGENDADO, EM_ANDAMENTO, HOMOLOGADO, BLOQUEADO_ESTOQUE, REPROVADO_TECNICO
    
    // Etapa 1: Solicitacao
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
      justificativa: 'Reducao de Custo por Peca (CPP) e ganho de vida util.'
    },

    // Etapa 2: Analise da Engenharia (Devolutiva)
    analiseEngenharia: {
      dataAnalise: '2026-08-02',
      responsavel: 'Oscar (Engenharia ADM)',
      decisao: 'APROVADO', // APROVADO, REPROVADO, REVISAO
      parecerTexto: 'Aprovado para a quinta-feira quinzenal. A ferramenta apresenta potencial de ganho de 50% em vida util e custo por aresta competitivo. Lote de 500 flanges confirmado com PCP no Centro Romi D800.',
      tecnicosEscalados: 'Filipe (1o Turno) e Charles (2o Turno)'
    },

    // Etapa 3: Agendamento da Visita
    agendamento: {
      dataVisitaConfirmada: '2026-08-06',
      horarioVisita: '08:30',
      tecnicoFornecedorPresente: 'SIM',
      ferramentasEntreguesPreset: 'SIM',
      coneMontadoPreset: 'SIM'
    },

    // Etapa 4: Acompanhamento de Chao de Fabrica
    chaoDeFabrica: {
      dataExecucao: '2026-08-06',
      maquinaReal: 'Centro Romi D800 (CNC-04)',
      cicloRealMedido: 132,
      parametros: {
        vc: 220,
        rpm: 1400,
        fz: 0.18,
        vf: 1260,
        ap: 2.5,
        ae: 40.0,
        balanco: 85
      },
      registrosArestas: [
        { aresta: '#1', turno: '1o Turno', tecnico: 'Filipe', pecas: 65, ra: '1.4 µm', desgaste: 'Desgaste de flanco leve VB~0.15mm' },
        { aresta: '#1 (Cont.)', turno: '2o Turno', tecnico: 'Charles', pecas: 60, ra: '1.5 µm', desgaste: 'Fim de vida VB=0.30mm, sem quebras' }
      ],
      totalPecas: 125,
      vidaMediaAresta: 125,
      variacaoVidaPorc: '+56.3%'
    },

    // Etapa 5: Fechamento & Trava de Estoque
    fechamento: {
      dataFechamento: '',
      responsavelFechamento: 'Jonathan (Engenharia ADM)',
      cppAtual: 0.241,
      cppNovo: 0.064,
      volumeMensalPecas: 5000,
      economiaMensal: 885.00,
      economiaAnual: 10620.00,
      
      leadTimeDias: 15,
      estoqueAlmoxAntigo: 45,
      consumoMesAntigo: 30,
      autonomiaDias: 45,
      margemSegurancaDias: 30,
      statusEstoque: 'SEGURO', // SEGURO, MODERADO, BLOQUEADO_RUPTURA
      
      decisaoFinal: 'PENDENTE', // HOMOLOGADO, BLOQUEADO_ESTOQUE, REPROVADO
      justificativaFinal: ''
    },

    // Linha do Tempo Auditavel
    timeline: [
      {
        dataHora: '2026-08-01 14:20',
        usuario: 'Roberto (Preset)',
        acao: 'Solicitacao Criada (D-2)',
        detalhe: 'Nova proposta de fresamento de face enviada para avaliacao da Engenharia.'
      },
      {
        dataHora: '2026-08-02 10:15',
        usuario: 'Oscar (Engenharia ADM)',
        acao: 'Viabilidade Aprovada (GO)',
        detalhe: 'Parecer favoravel emitido. Teste liberado para agendamento na quinta-feira quinzenal.'
      },
      {
        dataHora: '2026-08-03 09:00',
        usuario: 'Roberto (Preset)',
        acao: 'Visita Agendada',
        detalhe: 'Visita confirmada para 06/08 as 08:30. Ferramentas entregues no Preset.'
      },
      {
        dataHora: '2026-08-06 08:30',
        usuario: 'Filipe (Tecnico 1o Turno)',
        acao: 'Inicio de Usinagem em Maquina',
        detalhe: 'Parametros conferidos no CNC. Aresta #1 iniciada com 65 pecas usinadas.'
      },
      {
        dataHora: '2026-08-06 17:00',
        usuario: 'Charles (Tecnico 2o Turno)',
        acao: 'Passagem de Turno Realizada',
        detalhe: 'Aresta #1 atingiu 125 pecas totais com desgaste uniforme. Aguardando laudo de fechamento.'
      }
    ]
  }
];

// Usuario Logado Atual
let currentUser = VIEMAR_USERS[0]; // Oscar (Engenharia ADM)
let currentSelectedTestId = testDataStore[0].id;
let currentActiveWorkflowTab = 1;

// Inicializacao
document.addEventListener('DOMContentLoaded', () => {
  carregarDadosLocais();
  configurarUsuario(currentUser.id);
  renderizarDashboard();
  iniciarDatas();
});

// Troca de Perfil de Usuario
function trocarUsuarioModal() {
  document.getElementById('modalUsuarios').style.display = 'flex';
}

function fecharModalUsuario() {
  document.getElementById('modalUsuarios').style.display = 'none';
}

function selecionarUsuario(userId) {
  const user = VIEMAR_USERS.find(u => u.id === userId);
  if (user) {
    currentUser = user;
    configurarUsuario(user.id);
    fecharModalUsuario();
    renderizarDashboard();
    
    // Se estiver na tela de detalhes, re-renderizar com as novas permissoes
    if (document.getElementById('viewDetalhesTeste').classList.contains('active-view')) {
      abrirDetalhesTeste(currentSelectedTestId);
    }
  }
}

function configurarUsuario(userId) {
  const user = VIEMAR_USERS.find(u => u.id === userId) || VIEMAR_USERS[0];
  document.getElementById('currentUserName').textContent = user.name;
  document.getElementById('currentUserRole').textContent = user.roleTitle;
  document.getElementById('currentUserAvatar').textContent = user.name.charAt(0);
}

// Navegacao entre Telas (SPA)
function navegarPara(viewId) {
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active-view');
  });

  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.add('active-view');
  }

  document.querySelectorAll('.nav-item').forEach(link => {
    if (link.getAttribute('data-view') === viewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================================
// DASHBOARD & LISTAGEM GERAL
// =========================================================================
function renderizarDashboard() {
  const total = testDataStore.length;
  const etapa1 = testDataStore.filter(t => t.stage === 'STAGE_1_SOLICITACAO').length;
  const etapa2 = testDataStore.filter(t => t.stage === 'STAGE_2_ANALISE').length;
  const etapa3e4 = testDataStore.filter(t => t.stage === 'STAGE_3_AGENDAMENTO' || t.stage === 'STAGE_4_EXECUCAO').length;
  const etapa5 = testDataStore.filter(t => t.stage === 'STAGE_5_VALIDACAO' || t.statusGeral === 'HOMOLOGADO').length;

  document.getElementById('countTotal').textContent = total;
  document.getElementById('countEtapa1').textContent = etapa1;
  document.getElementById('countEtapa2').textContent = etapa2;
  document.getElementById('countEtapa3e4').textContent = etapa3e4;
  document.getElementById('countEtapa5').textContent = etapa5;

  const container = document.getElementById('dashboardTestList');
  container.innerHTML = '';

  if (testDataStore.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted); padding: 2rem;">Nenhum teste em andamento.</div>`;
    return;
  }

  testDataStore.forEach(teste => {
    const stageInfo = WORKFLOW_STAGES[teste.stage] || WORKFLOW_STAGES.STAGE_1_SOLICITACAO;
    
    let statusText = 'Em Andamento';
    let badgeStatus = 'badge-blue';
    if (teste.statusGeral === 'APROVADO_ENGENHARIA') {
      statusText = 'Aprovado Engenharia (GO)';
      badgeStatus = 'badge-orange';
    } else if (teste.statusGeral === 'REPROVADO_ENGENHARIA') {
      statusText = 'Recusado Engenharia (NO-GO)';
      badgeStatus = 'badge-red';
    } else if (teste.statusGeral === 'HOMOLOGADO') {
      statusText = 'Homologado Definitivo';
      badgeStatus = 'badge-green';
    } else if (teste.statusGeral === 'BLOQUEADO_ESTOQUE') {
      statusText = 'Bloqueado por Estoque';
      badgeStatus = 'badge-amber';
    }

    const card = document.createElement('div');
    card.className = 'test-list-card';
    card.innerHTML = `
      <div style="display: flex; gap: 1.25rem; align-items: center;">
        <div style="width: 42px; height: 42px; border-radius: var(--radius-sm); background: var(--viemar-orange-light); border: 1px solid var(--viemar-orange-border); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--viemar-orange); font-size: 0.85rem;">
          ${teste.id.split('/')[0].replace('TESTE-', '#')}
        </div>
        <div>
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
            <strong style="font-size: 0.95rem; color: var(--text-main);">${teste.id}</strong>
            <span class="badge ${stageInfo.badgeClass}">${stageInfo.label}</span>
            <span class="badge ${badgeStatus}">${statusText}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            <strong>Peca:</strong> ${teste.solicitacao.descricaoPeca} &nbsp;|&nbsp; <strong>Maquina:</strong> ${teste.solicitacao.maquina}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
            <strong>Fornecedor:</strong> ${teste.solicitacao.fornecedor} &nbsp;|&nbsp; <strong>Ferramenta:</strong> ${teste.solicitacao.ferramentaTeste}
          </div>
        </div>
      </div>
      <div>
        <button class="btn btn-primary btn-sm" onclick="abrirDetalhesTeste('${teste.id}')">Acessar Workflow</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// =========================================================================
// WORKFLOW DETALHADO & GESTAO DE ETAPAS
// =========================================================================
function abrirDetalhesTeste(testeId) {
  const teste = testDataStore.find(t => t.id === testeId);
  if (!teste) return;

  currentSelectedTestId = testeId;
  document.getElementById('detalheIdTeste').textContent = teste.id;
  document.getElementById('detalhePeca').textContent = `${teste.solicitacao.descricaoPeca} (${teste.solicitacao.codigoPeca})`;
  document.getElementById('detalheFornecedor').textContent = teste.solicitacao.fornecedor;

  // Atualizar Stepper Visual
  atualizarStepperVisual(teste);

  // Preencher os dados em cada aba do workflow
  preencherAba1Solicitacao(teste);
  preencherAba2AnaliseEngenharia(teste);
  preencherAba3Agendamento(teste);
  preencherAba4ChaoDeFabrica(teste);
  preencherAba5Fechamento(teste);
  renderizarTimeline(teste);

  // Aplicar Permissoes de Edicao vs Somente Leitura por Perfil
  aplicarPermissoesPorPerfil(teste);

  // Determinar aba ativa
  let tabId = 1;
  if (teste.stage === 'STAGE_2_ANALISE') tabId = 2;
  else if (teste.stage === 'STAGE_3_AGENDAMENTO') tabId = 3;
  else if (teste.stage === 'STAGE_4_EXECUCAO') tabId = 4;
  else if (teste.stage === 'STAGE_5_VALIDACAO') tabId = 5;

  alternarAbaWorkflow(tabId);
  navegarPara('viewDetalhesTeste');
}

function atualizarStepperVisual(teste) {
  const stageNum = WORKFLOW_STAGES[teste.stage] ? WORKFLOW_STAGES[teste.stage].id : 1;

  for (let i = 1; i <= 5; i++) {
    const stepEl = document.getElementById(`stepCard_${i}`);
    if (!stepEl) continue;

    stepEl.classList.remove('active', 'completed');
    if (i < stageNum) {
      stepEl.classList.add('completed');
    } else if (i === stageNum) {
      stepEl.classList.add('active');
    }
  }
}

function alternarAbaWorkflow(tabIndex) {
  currentActiveWorkflowTab = tabIndex;
  
  for (let i = 1; i <= 5; i++) {
    const content = document.getElementById(`workflowTabContent_${i}`);
    if (content) {
      content.style.display = (i === tabIndex) ? 'block' : 'none';
    }
  }

  // Atualizar visual do stepper
  for (let i = 1; i <= 5; i++) {
    const stepEl = document.getElementById(`stepCard_${i}`);
    if (stepEl) {
      if (i === tabIndex) {
        stepEl.style.borderColor = 'var(--viemar-orange)';
      } else {
        stepEl.style.borderColor = 'var(--border-color)';
      }
    }
  }
}

// Aplicar Regra de Permissao (Solicitante apenas visualiza chão de fábrica e fechamento)
function aplicarPermissoesPorPerfil(teste) {
  const isRequester = (currentUser.role === VIEMAR_ROLES.REQUESTER);
  const isAdmin = (currentUser.role === VIEMAR_ROLES.ADMIN);
  const isFloorTech = (currentUser.role === VIEMAR_ROLES.FLOOR_TECH);

  // Banner informativo de papel
  const banner = document.getElementById('rolePermissionBanner');
  if (isRequester) {
    banner.className = 'role-banner role-banner-readonly';
    banner.innerHTML = `<span>Perfil Solicitante (${currentUser.name}): Modo de Visualizacao e Acompanhamento em Tempo Real.</span>`;
  } else if (isAdmin) {
    banner.className = 'role-banner role-banner-editor';
    banner.innerHTML = `<span>Perfil Engenharia (${currentUser.name}): Acesso Total a Avaliacao, Agendamento e Fechamento.</span>`;
  } else if (isFloorTech) {
    banner.className = 'role-banner role-banner-editor';
    banner.innerHTML = `<span>Perfil Tecnico (${currentUser.name}): Edicao e Registro de Chao de Fabrica liberados.</span>`;
  }

  // Bloqueio de inputs na Etapa 2 (Analise da Engenharia)
  const formEng = document.getElementById('formAnaliseEngenharia');
  if (formEng) {
    const inputs = formEng.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
      if (input.type !== 'button') input.disabled = !isAdmin;
    });
  }

  // Bloqueio de inputs na Etapa 4 (Chao de Fabrica)
  const formFloor = document.getElementById('formChaoDeFabrica');
  if (formFloor) {
    const inputs = formFloor.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
      if (input.type !== 'button' || input.id === 'btnSalvarChaoFabrica') {
        input.disabled = isRequester; // Solicitante NUNCA edita chao de fabrica
      }
    });
  }

  // Bloqueio de inputs na Etapa 5 (Fechamento)
  const formFech = document.getElementById('formFechamentoEstoque');
  if (formFech) {
    const inputs = formFech.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
      if (input.type !== 'button' || input.id === 'btnSalvarFechamento') {
        input.disabled = !isAdmin; // Apenas Engenharia valida e fecha
      }
    });
  }
}

// =========================================================================
// PREENCHIMENTO E ACOES DE CADA ETAPA
// =========================================================================

// --- ETAPA 1: SOLICITACAO ---
function preencherAba1Solicitacao(teste) {
  const s = teste.solicitacao;
  document.getElementById('solData').value = s.dataSolicitacao;
  document.getElementById('solDataTeste').value = s.dataPrevistaTeste;
  document.getElementById('solNome').value = s.solicitante;
  document.getElementById('solFornecedor').value = s.fornecedor;
  document.getElementById('solContato').value = s.contatoFornecedor;
  document.getElementById('solPeca').value = `${s.descricaoPeca} (${s.codigoPeca})`;
  document.getElementById('solMaterial').value = s.materialPeca;
  document.getElementById('solMaquina').value = s.maquina;
  document.getElementById('solOperacao').value = s.operacao;
  document.getElementById('solRefrigeracao').value = s.refrigeracao;

  document.getElementById('solFerrAtual').value = s.ferramentaAtual;
  document.getElementById('solVidaAtual').value = s.vidaAtual;
  document.getElementById('solCicloAtual').value = s.cicloAtual;
  document.getElementById('solCustoAtual').value = s.custoAtual;

  document.getElementById('solFerrTeste').value = s.ferramentaTeste;
  document.getElementById('solMetaVida').value = s.metaVida;
  document.getElementById('solAmostras').value = s.amostrasBonificadas;
  document.getElementById('solPrecoTeste').value = s.precoTeste;
  document.getElementById('solLeadTime').value = s.leadTimeDias;
  document.getElementById('solEstoqueLocal').value = s.estoqueLocal;

  // Calculo de Ganho Prometido
  const ganho = (((s.metaVida - s.vidaAtual) / s.vidaAtual) * 100).toFixed(1);
  document.getElementById('solKpiGanho').textContent = `${ganho >= 0 ? '+' : ''}${ganho}%`;
}

// --- ETAPA 2: ANALISE ENGENHARIA (DEVOLUTIVA) ---
function preencherAba2AnaliseEngenharia(teste) {
  const a = teste.analiseEngenharia;
  document.getElementById('engDataAnalise').value = a.dataAnalise || new Date().toISOString().split('T')[0];
  document.getElementById('engResponsavel').value = a.responsavel || currentUser.name;
  document.getElementById('engDecisao').value = a.decisao || 'APROVADO';
  document.getElementById('engParecer').value = a.parecerTexto || '';
  document.getElementById('engTecnicos').value = a.tecnicosEscalados || 'Filipe (1o Turno) e Charles (2o Turno)';
}

function salvarDecisaoEngenharia() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const decisao = document.getElementById('engDecisao').value;
  const parecer = document.getElementById('engParecer').value;
  const dataHoje = new Date().toISOString().split('T')[0];

  teste.analiseEngenharia = {
    dataAnalise: dataHoje,
    responsavel: currentUser.name,
    decisao: decisao,
    parecerTexto: parecer,
    tecnicosEscalados: document.getElementById('engTecnicos').value
  };

  if (decisao === 'APROVADO') {
    teste.stage = 'STAGE_3_AGENDAMENTO';
    teste.statusGeral = 'APROVADO_ENGENHARIA';
    registrarTimeline(teste, `Viabilidade Aprovada (GO) por ${currentUser.name}`, `Parecer: ${parecer}`);
    alert('Devolutiva registrada com sucesso! Teste avancado para a Etapa 3 (Agendamento da Visita).');
  } else if (decisao === 'REPROVADO') {
    teste.statusGeral = 'REPROVADO_ENGENHARIA';
    registrarTimeline(teste, `Viabilidade Recusada (NO-GO) por ${currentUser.name}`, `Motivo: ${parecer}`);
    alert('Devolutiva de recusa registrada. Solicitante notificado no historico.');
  }

  salvarDadosLocais();
  abrirDetalhesTeste(teste.id);
  renderizarDashboard();
}

// --- ETAPA 3: AGENDAMENTO VISITA ---
function preencherAba3Agendamento(teste) {
  const ag = teste.agendamento || {};
  document.getElementById('agDataVisita').value = ag.dataVisitaConfirmada || teste.solicitacao.dataPrevistaTeste;
  document.getElementById('agHorario').value = ag.horarioVisita || '08:30';
  document.getElementById('agTecnicoForn').value = ag.tecnicoFornecedorPresente || 'SIM';
  document.getElementById('agPresetEntregue').value = ag.ferramentasEntreguesPreset || 'SIM';
  document.getElementById('agConeMontado').value = ag.coneMontadoPreset || 'SIM';
}

function confirmarAgendamentoVisita() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const dataVisita = document.getElementById('agDataVisita').value;
  const horario = document.getElementById('agHorario').value;

  teste.agendamento = {
    dataVisitaConfirmada: dataVisita,
    horarioVisita: horario,
    tecnicoFornecedorPresente: document.getElementById('agTecnicoForn').value,
    ferramentasEntreguesPreset: document.getElementById('agPresetEntregue').value,
    coneMontadoPreset: document.getElementById('agConeMontado').value
  };

  teste.stage = 'STAGE_4_EXECUCAO';
  teste.statusGeral = 'AGENDADO';
  registrarTimeline(teste, `Visita Confirmada por ${currentUser.name}`, `Agendado para ${dataVisita} as ${horario}. Preparacao no Preset concluida.`);

  salvarDadosLocais();
  alert('Visita agendada com sucesso! Teste liberado para execucao em maquina no Chao de Fabrica.');
  abrirDetalhesTeste(teste.id);
  renderizarDashboard();
}

// --- ETAPA 4: CHAO DE FABRICA (1oT e 2oT) ---
function preencherAba4ChaoDeFabrica(teste) {
  const cf = teste.chaoDeFabrica || {};
  document.getElementById('cfMaquina').value = cf.maquinaReal || teste.solicitacao.maquina;
  document.getElementById('cfCiclo').value = cf.cicloRealMedido || teste.solicitacao.cicloAtual;
  
  const p = cf.parametros || {};
  document.getElementById('cfVc').value = p.vc || 220;
  document.getElementById('cfRpm').value = p.rpm || 1400;
  document.getElementById('cfFz').value = p.fz || 0.18;
  document.getElementById('cfVf').value = p.vf || 1260;
  document.getElementById('cfAp').value = p.ap || 2.5;
  document.getElementById('cfAe').value = p.ae || 40;
  document.getElementById('cfBalanco').value = p.balanco || 85;

  // Renderizar Tabela de Arestas
  const tbody = document.querySelector('#tabelaArestasWorkflow tbody');
  tbody.innerHTML = '';
  const registros = cf.registrosArestas || [
    { aresta: '#1', turno: '1o Turno', tecnico: 'Filipe', pecas: 65, ra: '1.4 µm', desgaste: 'Desgaste normal' }
  ];

  registros.forEach(reg => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: bold; text-align: center;">${reg.aresta}</td>
      <td><input type="text" class="cell-input" value="${reg.turno}"></td>
      <td><input type="text" class="cell-input" value="${reg.tecnico}"></td>
      <td><input type="number" class="cell-input input-pecas-workflow" value="${reg.pecas}" oninput="recalcularChaoDeFabrica()"></td>
      <td><input type="text" class="cell-input" value="${reg.ra}"></td>
      <td><input type="text" class="cell-input" value="${reg.desgaste}"></td>
    `;
    tbody.appendChild(tr);
  });

  recalcularChaoDeFabrica();
}

function recalcularChaoDeFabrica() {
  const inputs = document.querySelectorAll('.input-pecas-workflow');
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

  document.getElementById('cfTotalPecas').textContent = total;
  document.getElementById('cfVidaMedia').textContent = total > 0 ? (total / Math.max(1, count >= 2 ? (count/2).toFixed(0) : 1)).toFixed(0) : 0;

  const kpiVar = document.getElementById('cfVariacao');
  if (vidaRef > 0 && total > 0) {
    const varPct = (((total - vidaRef) / vidaRef) * 100).toFixed(1);
    kpiVar.textContent = `${varPct >= 0 ? '+' : ''}${varPct}%`;
    kpiVar.style.color = varPct >= 0 ? 'var(--status-green-text)' : 'var(--status-red-text)';
  }
}

function adicionarLinhaChaoFabrica() {
  const tbody = document.querySelector('#tabelaArestasWorkflow tbody');
  const count = tbody.rows.length + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td style="font-weight: bold; text-align: center;">#${Math.ceil(count/2)}</td>
    <td><input type="text" class="cell-input" value="${count % 2 === 0 ? '2o Turno' : '1o Turno'}"></td>
    <td><input type="text" class="cell-input" value="${count % 2 === 0 ? 'Charles' : 'Filipe'}"></td>
    <td><input type="number" class="cell-input input-pecas-workflow" placeholder="Qtd" oninput="recalcularChaoDeFabrica()"></td>
    <td><input type="text" class="cell-input" placeholder="Ra µm"></td>
    <td><input type="text" class="cell-input" placeholder="Desgaste"></td>
  `;
  tbody.appendChild(tr);
}

function salvarChaoDeFabricaEAvancar() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const total = parseFloat(document.getElementById('cfTotalPecas').textContent) || 0;
  const media = parseFloat(document.getElementById('cfVidaMedia').textContent) || 0;

  teste.chaoDeFabrica.totalPecas = total;
  teste.chaoDeFabrica.vidaMediaAresta = media;
  teste.chaoDeFabrica.cicloRealMedido = parseFloat(document.getElementById('cfCiclo').value) || teste.solicitacao.cicloAtual;

  teste.stage = 'STAGE_5_VALIDACAO';
  registrarTimeline(teste, `Teste em Maquina Finalizado por ${currentUser.name}`, `Total de ${total} pecas usinadas registradas. Avancado para Laudo de Fechamento.`);

  salvarDadosLocais();
  alert('Resultados de chao de fabrica registrados com sucesso! Avancando para a Validacao Final & Trava de Estoque.');
  abrirDetalhesTeste(teste.id);
  renderizarDashboard();
}

// --- ETAPA 5: FECHAMENTO & TRAVA DE ESTOQUE ---
function preencherAba5Fechamento(teste) {
  const s = teste.solicitacao;
  const cf = teste.chaoDeFabrica;
  const f = teste.fechamento || {};

  document.getElementById('fechPrecoAtual').value = s.custoAtual;
  document.getElementById('fechArestasAtual').value = s.arestasAtual || 2;
  document.getElementById('fechVidaAtual').value = s.vidaAtual;

  document.getElementById('fechPrecoTeste').value = s.precoTeste;
  document.getElementById('fechArestasTeste').value = s.arestasTeste || 4;
  document.getElementById('fechVidaTeste').value = cf.vidaMediaAresta || s.metaVida;

  document.getElementById('fechVolumeMes').value = f.volumeMensalPecas || 5000;
  document.getElementById('fechLeadTime').value = f.leadTimeDias || s.leadTimeDias || 15;
  document.getElementById('fechEstoqueAlmox').value = f.estoqueAlmoxAntigo || 45;
  document.getElementById('fechConsumoMes').value = f.consumoMesAntigo || 30;

  document.getElementById('fechDecisaoFinal').value = f.decisaoFinal || 'HOMOLOGADO';
  document.getElementById('fechJustificativa').value = f.justificativaFinal || '';

  recalcularFechamento();
}

function recalcularFechamento() {
  const precoAt = parseFloat(document.getElementById('fechPrecoAtual').value) || 0;
  const arestAt = parseFloat(document.getElementById('fechArestasAtual').value) || 1;
  const vidaAt = parseFloat(document.getElementById('fechVidaAtual').value) || 1;
  const cppAt = (precoAt / (arestAt * vidaAt));
  document.getElementById('fechCppAtualDisplay').textContent = `R$ ${cppAt.toFixed(3)}`;

  const precoTe = parseFloat(document.getElementById('fechPrecoTeste').value) || 0;
  const arestTe = parseFloat(document.getElementById('fechArestasTeste').value) || 1;
  const vidaTe = parseFloat(document.getElementById('fechVidaTeste').value) || 1;
  const cppTe = (precoTe / (arestTe * vidaTe));
  document.getElementById('fechCppNovoDisplay').textContent = `R$ ${cppTe.toFixed(3)}`;

  const volume = parseFloat(document.getElementById('fechVolumeMes').value) || 0;
  if (volume > 0) {
    const econMes = (cppAt - cppTe) * volume;
    const econAno = econMes * 12;
    document.getElementById('fechEconMesDisplay').textContent = `R$ ${econMes.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / mes`;
    document.getElementById('fechEconAnoDisplay').textContent = `R$ ${econAno.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / ano`;
  }

  // Trava de Estoque
  const leadTime = parseFloat(document.getElementById('fechLeadTime').value) || 0;
  const estoque = parseFloat(document.getElementById('fechEstoqueAlmox').value) || 0;
  const consumoMes = parseFloat(document.getElementById('fechConsumoMes').value) || 1;

  const consumoDia = consumoMes / 30;
  const autonomiaDias = Math.floor(estoque / consumoDia);
  const margem = autonomiaDias - leadTime;

  document.getElementById('fechAutonomia').textContent = `${autonomiaDias} dias`;
  document.getElementById('fechMargem').textContent = `${margem >= 0 ? '+' : ''}${margem} dias`;

  const boxMargem = document.getElementById('fechBoxMargem');
  const kpiStatus = document.getElementById('fechKpiStatusEstoque');
  const boxStatus = document.getElementById('fechBoxStatusEstoque');
  const alerta = document.getElementById('fechAlertaRuptura');

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

function emitirLaudoFinalFechamento() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const decisao = document.getElementById('fechDecisaoFinal').value;
  const just = document.getElementById('fechJustificativa').value;

  teste.fechamento = {
    dataFechamento: new Date().toISOString().split('T')[0],
    responsavelFechamento: currentUser.name,
    volumeMensalPecas: parseFloat(document.getElementById('fechVolumeMes').value) || 5000,
    leadTimeDias: parseFloat(document.getElementById('fechLeadTime').value) || 15,
    estoqueAlmoxAntigo: parseFloat(document.getElementById('fechEstoqueAlmox').value) || 45,
    consumoMesAntigo: parseFloat(document.getElementById('fechConsumoMes').value) || 30,
    decisaoFinal: decisao,
    justificativaFinal: just
  };

  if (decisao === 'HOMOLOGADO') {
    teste.statusGeral = 'HOMOLOGADO';
    registrarTimeline(teste, `Homologacao Definitiva por ${currentUser.name}`, `Laudo emitido com sucesso. Transicao de estoque e cadastro autorizados.`);
  } else if (decisao === 'BLOQUEADO_ESTOQUE') {
    teste.statusGeral = 'BLOQUEADO_ESTOQUE';
    registrarTimeline(teste, `Aprovado Tecnico, Bloqueado por Suprimentos`, `Virada suspensa ate confirmacao de lote emergencial do fornecedor.`);
  } else {
    teste.statusGeral = 'REPROVADO_TECNICO';
    registrarTimeline(teste, `Reprovado em Laudo Final`, `Nao atingiu os parametros necessarios.`);
  }

  salvarDadosLocais();
  alert('Laudo de Fechamento emitido e registrado no historico do teste!');
  abrirDetalhesTeste(teste.id);
  renderizarDashboard();
}

// =========================================================================
// LINHA DO TEMPO AUDITAVEL (TIMELINE)
// =========================================================================
function renderizarTimeline(teste) {
  const container = document.getElementById('workflowTimelineList');
  container.innerHTML = '';

  const lista = teste.timeline || [];
  lista.forEach((item, index) => {
    const isLast = (index === lista.length - 1);
    const itemEl = document.createElement('div');
    itemEl.className = 'timeline-item';
    itemEl.innerHTML = `
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
    container.appendChild(itemEl);
  });
}

function registrarTimeline(teste, acao, detalhe) {
  const agora = new Date();
  const dataFormatada = `${agora.toISOString().split('T')[0]} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

  if (!teste.timeline) teste.timeline = [];
  teste.timeline.push({
    dataHora: dataFormatada,
    usuario: currentUser.name,
    acao: acao,
    detalhe: detalhe
  });
}

// =========================================================================
// NOVA SOLICITACAO (ETAPA 1)
// =========================================================================
function submeterNovaSolicitacao() {
  const idNovo = `TESTE-00${testDataStore.length + 1}/2026`;
  const hoje = new Date().toISOString().split('T')[0];

  const novoTeste = {
    id: idNovo,
    stage: 'STAGE_1_SOLICITACAO',
    statusGeral: 'PENDENTE_ANALISE',
    solicitacao: {
      dataSolicitacao: hoje,
      dataPrevistaTeste: document.getElementById('novaDataPrevista').value,
      solicitante: currentUser.name,
      fornecedor: document.getElementById('novoFornecedor').value,
      contatoFornecedor: document.getElementById('novoContato').value,
      codigoPeca: document.getElementById('novoCodigoPeca').value,
      descricaoPeca: document.getElementById('novaDescPeca').value,
      materialPeca: document.getElementById('novoMaterial').value,
      maquina: document.getElementById('novaMaquina').value,
      operacao: document.getElementById('novaOperacao').value,
      refrigeracao: document.getElementById('novaRefrigeracao').value,
      
      ferramentaAtual: document.getElementById('novaFerrAtual').value,
      vidaAtual: parseFloat(document.getElementById('novaVidaAtual').value) || 80,
      cicloAtual: parseFloat(document.getElementById('novoCicloAtual').value) || 120,
      custoAtual: parseFloat(document.getElementById('novoCustoAtual').value) || 40,
      arestasAtual: 2,
      
      ferramentaTeste: document.getElementById('novaFerrTeste').value,
      metaVida: parseFloat(document.getElementById('novaMetaVida').value) || 120,
      amostrasBonificadas: parseFloat(document.getElementById('novasAmostras').value) || 10,
      precoTeste: parseFloat(document.getElementById('novoPrecoTeste').value) || 35,
      arestasTeste: 4,
      leadTimeDias: parseFloat(document.getElementById('novoLeadTime').value) || 15,
      estoqueLocal: document.getElementById('novoEstoqueLocal').value,
      justificativa: document.getElementById('novaJustificativa').value
    },
    analiseEngenharia: {},
    agendamento: {},
    chaoDeFabrica: { parametros: {}, registrosArestas: [] },
    fechamento: {},
    timeline: [
      {
        dataHora: `${hoje} 08:00`,
        usuario: currentUser.name,
        acao: 'Solicitacao Criada (D-2)',
        detalhe: 'Aguardando analise de viabilidade da Engenharia de Usinagem.'
      }
    ]
  };

  testDataStore.unshift(novoTeste);
  salvarDadosLocais();
  alert(`Solicitacao cadastrada com sucesso sob o codigo ${idNovo}!`);
  renderizarDashboard();
  abrirDetalhesTeste(idNovo);
}

// Iniciar Datas Padrao
function iniciarDatas() {
  const hoje = new Date().toISOString().split('T')[0];
  const el = document.getElementById('novaDataPrevista');
  if (el) el.value = hoje;
}

// =========================================================================
// GERADORES DE TEXTO PARA WHATSAPP (SEM EMOJIS)
// =========================================================================
function copiarWhatsAppWorkflow() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const texto = `[VIEMAR - STATUS DE TESTE ${teste.id}]\n` +
                `* Peca: ${teste.solicitacao.descricaoPeca}\n` +
                `* Maquina: ${teste.solicitacao.maquina}\n` +
                `* Fornecedor: ${teste.solicitacao.fornecedor}\n` +
                `* Ferramenta Proposta: ${teste.solicitacao.ferramentaTeste}\n` +
                `* Etapa Atual: ${WORKFLOW_STAGES[teste.stage].label}\n` +
                `* Status Geral: ${teste.statusGeral}\n` +
                `Acompanhamento disponivel no Portal de Testes Viemar.`;

  navigator.clipboard.writeText(texto).then(() => {
    alert('Resumo do teste copiado com padrao Viemar para a area de transferencia!');
  });
}

// Persistencia Local
function salvarDadosLocais() {
  localStorage.setItem('viemar_workflow_store', JSON.stringify(testDataStore));
}

function carregarDadosLocais() {
  const salvos = localStorage.getItem('viemar_workflow_store');
  if (salvos) {
    try {
      testDataStore = JSON.parse(salvos);
    } catch (e) {
      console.error(e);
    }
  }
}
