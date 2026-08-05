// =========================================================================
// VIEMAR TOOLFLOW v1.5.5 - SISTEMA DE WORKFLOW E HOMOLOGAÇÃO DE FERRAMENTAS
// =========================================================================

// Perfis de Acesso e Papeis de Governanca
const DEVFLOW_ROLES = {
  ADMIN: 'ADMIN',             // Administrador & Engenharia - Acesso Total
  TECNICO: 'TECNICO',         // Tecnicos de Usinagem / Montagem - Registros de Chao de Fabrica
  SOLICITANTE: 'SOLICITANTE', // Preset, Gerenciador, Fornecedor - Abertura e Acompanhamento
  LEITURA: 'LEITURA'          // Visitante - Somente Visualizacao
};
const TOOLFLOW_ROLES = DEVFLOW_ROLES;

// Configuracao de Papeis e Badges Visuais (Padrao Oficial DevFlow / Viemar)
const USER_ROLES_CONFIG = {
  ADMIN: {
    label: 'Administrador',
    role: TOOLFLOW_ROLES.ADMIN,
    badgeStyle: 'background: #fff7ed; color: #ff6600; border: 1px solid #fed7aa;',
    avatarBg: '#ea580c'
  },
  ENG_PROCESSO: {
    label: 'Engenharia de Processos',
    role: TOOLFLOW_ROLES.ADMIN,
    badgeStyle: 'background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;',
    avatarBg: '#7c3aed'
  },
  ENG_PRODUTO: {
    label: 'Engenharia de Produto',
    role: TOOLFLOW_ROLES.ADMIN,
    badgeStyle: 'background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;',
    avatarBg: '#64748b'
  },
  TECNICO_USINAGEM: {
    label: 'Técnico Usinagem',
    role: TOOLFLOW_ROLES.TECNICO,
    badgeStyle: 'background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd;',
    avatarBg: '#64748b'
  },
  TECNICO_MONTAGEM: {
    label: 'Técnico Montagem',
    role: TOOLFLOW_ROLES.TECNICO,
    badgeStyle: 'background: #fffbeb; color: #d97706; border: 1px solid #fde68a;',
    avatarBg: '#64748b'
  },
  PRESET: {
    label: 'Setor Preset',
    role: TOOLFLOW_ROLES.SOLICITANTE,
    badgeStyle: 'background: #f0fdfa; color: #0d9488; border: 1px solid #99f6e4;',
    avatarBg: '#0d9488'
  },
  GERENCIADOR: {
    label: 'Gerenciador de Ferramentas',
    role: TOOLFLOW_ROLES.SOLICITANTE,
    badgeStyle: 'background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe;',
    avatarBg: '#4f46e5'
  },
  FORNECEDOR: {
    label: 'Fornecedor Externo',
    role: TOOLFLOW_ROLES.SOLICITANTE,
    badgeStyle: 'background: #fdf2f8; color: #db2777; border: 1px solid #fbcfe8;',
    avatarBg: '#db2777'
  },
  VISITANTE: {
    label: 'Visitante',
    role: TOOLFLOW_ROLES.LEITURA,
    badgeStyle: 'background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0;',
    avatarBg: '#94a3b8'
  }
};

// Base de Usuarios Cadastrados (Inicia limpa com David como Administrador)
const INITIAL_USERS_STORE = [
  {
    id: 'user_david_admin',
    name: 'David Teixeira',
    email: 'dteixeira@viemar.com.br',
    password: 'admin',
    roleKey: 'ADMIN',
    roleTitle: 'Administrador',
    role: TOOLFLOW_ROLES.ADMIN,
    avatarBg: '#ea580c'
  }
];

let devflowUsersStore = [...INITIAL_USERS_STORE];

// Definicao das 5 Etapas do Workflow
const WORKFLOW_STAGES = {
  STAGE_1_SOLICITACAO: { id: 1, key: 'STAGE_1_SOLICITACAO', label: '1. Solicitação (D-2)', badgeClass: 'badge-blue' },
  STAGE_2_ANALISE: { id: 2, key: 'STAGE_2_ANALISE', label: '2. An\u00E1lise Engenharia', badgeClass: 'badge-orange' },
  STAGE_3_AGENDAMENTO: { id: 3, key: 'STAGE_3_AGENDAMENTO', label: '3. Agendamento Visita', badgeClass: 'badge-amber' },
  STAGE_4_EXECUCAO: { id: 4, key: 'STAGE_4_EXECUCAO', label: '4. Teste em M\u00E1quina', badgeClass: 'badge-blue' },
  STAGE_5_VALIDACAO: { id: 5, key: 'STAGE_5_VALIDACAO', label: '5. Valida\u00E7\u00E3o & Estoque', badgeClass: 'badge-green' }
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
      parecerTexto: 'Aprovado para a quinta-feira quinzenal. Lote de 500 pe\u00E7as confirmado com PCP.',
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
      { dataHora: '2026-08-01 14:20', usuario: 'Roberto (Preset)', acao: 'Solicitação Criada (D-2)', detalhe: 'Proposta submetida para análise.' },
      { dataHora: '2026-08-02 10:15', usuario: 'Oscar (Engenharia ADM)', acao: 'Viabilidade Aprovada (GO)', detalhe: 'Liberado para agendamento quinzenal.' },
      { dataHora: '2026-08-03 09:00', usuario: 'Roberto (Preset)', acao: 'Visita Agendada', detalhe: 'Agendado para 06/08 as 08:30 no Preset.' },
      { dataHora: '2026-08-06 08:30', usuario: 'Filipe (Técnico 1ºT)', acao: 'Início em Máquina', detalhe: '65 peças usinadas no 1º turno.' },
      { dataHora: '2026-08-06 17:40', usuario: 'Charles (T\u00E9cnico 2\u00BAT)', acao: 'Conclus\u00E3o 2\u00BA Turno', detalhe: 'Total de 125 pe\u00E7as conclu\u00EDdo com sucesso.' }
    ],

    comentarios: [
      { dataHora: '2026-08-01 14:25', usuario: 'Roberto (Preset)', texto: 'Fornecedor enviar\u00E1 10 pastilhas e 1 corpo bonificado.' },
      { dataHora: '2026-08-02 10:30', usuario: 'Oscar (Engenharia ADM)', texto: 'Agendamento alinhado para a primeira quinta do m\u00EAs.' },
      { dataHora: '2026-08-06 14:00', usuario: 'Filipe (Técnico 1ºT)', texto: 'Acabamento superficial ficou excelente (Ra 1.4).' }
    ]
  },
  {
    id: 'TESTE-002/2026',
    stage: 'STAGE_2_ANALISE',
    statusGeral: 'AGUARDANDO_ANALISE',
    solicitacao: {
      dataSolicitacao: '2026-08-03',
      dataPrevistaTeste: '2026-08-20',
      solicitante: 'Gerenciador de Ferramentas',
      fornecedor: 'Iscar do Brasil',
      contatoFornecedor: 'Eduardo (51) 98765-4321',
      codigoPeca: 'PC-77310-B',
      descricaoPeca: 'Pino Esferico 45',
      materialPeca: 'Aco 8620 Forjado',
      maquina: 'Torno CNC Mazak QTN-250',
      operacao: 'Torneamento Copiador',
      refrigeracao: 'Alta Pressao Interna',
      ferramentaAtual: 'Inserto VNMG 160408',
      vidaAtual: 110,
      cicloAtual: 45,
      custoAtual: 29.80,
      arestasAtual: 4,
      ferramentaTeste: 'Inserto VCGT 160408 IC907',
      metaVida: 170,
      amostrasBonificadas: 20,
      precoTeste: 28.50,
      arestasTeste: 4,
      leadTimeDias: 30,
      estoqueLocal: 'NAO',
      justificativa: 'Melhoria de rugosidade e vida util em acabamento.'
    },
    analiseEngenharia: {
      dataAnalise: '',
      responsavel: '',
      decisao: 'PENDENTE',
      parecerTexto: '',
      tecnicosEscalados: 'A definir'
    },
    agendamento: {},
    chaoDeFabrica: { parametros: {}, registrosArestas: [] },
    fechamento: {},
    timeline: [
      { dataHora: '2026-08-03 16:40', usuario: 'Gerenciador', acao: 'Solicitação Criada (D-2)', detalhe: 'Aguardando parecer da Engenharia.' }
    ],
    comentarios: []
  },
  {
    id: 'TESTE-003/2026',
    stage: 'STAGE_5_VALIDACAO',
    statusGeral: 'BLOQUEADO_ESTOQUE',
    solicitacao: {
      dataSolicitacao: '2026-07-28',
      dataPrevistaTeste: '2026-07-30',
      solicitante: 'Jonathan (Engenharia ADM)',
      fornecedor: 'Seco Tools',
      contatoFornecedor: 'Carlos (51) 99111-2233',
      codigoPeca: 'PC-99010-C',
      descricaoPeca: 'Eixo de Transmissao 35',
      materialPeca: 'Aco 8620 Cementado',
      maquina: 'Torno ROMI GL 240',
      operacao: 'Torneamento Acabamento',
      refrigeracao: 'Oleo Soluvel',
      ferramentaAtual: 'CNMG 120408',
      vidaAtual: 110,
      cicloAtual: 60,
      custoAtual: 34.00,
      arestasAtual: 4,
      ferramentaTeste: 'WNMG 080408',
      metaVida: 160,
      amostrasBonificadas: 15,
      precoTeste: 30.00,
      arestasTeste: 6,
      leadTimeDias: 45,
      estoqueLocal: 'NAO',
      justificativa: 'Reducao de custo de CPP e aumento de arestas uteis.'
    },
    analiseEngenharia: {
      dataAnalise: '2026-07-29',
      responsavel: 'Oscar (Engenharia ADM)',
      decisao: 'APROVADO',
      parecerTexto: 'Aprovado para lote piloto.',
      tecnicosEscalados: 'Filipe'
    },
    agendamento: {
      dataVisitaConfirmada: '2026-07-30',
      horarioVisita: '09:00',
      tecnicoFornecedorPresente: 'SIM',
      ferramentasEntreguesPreset: 'SIM',
      coneMontadoPreset: 'SIM'
    },
    chaoDeFabrica: {
      dataExecucao: '2026-07-30',
      maquinaReal: 'Torno ROMI GL 240',
      cicloRealMedido: 58,
      parametros: { vc: 260, rpm: 1800, fz: 0.15, vf: 270, ap: 1.0, ae: 1.0, balanco: 50 },
      registrosArestas: [
        { aresta: '#1', turno: '1o Turno', tecnico: 'Filipe', pecas: 165, ra: '0.8 µm', desgaste: 'Excelente' }
      ],
      totalPecas: 165,
      vidaMediaAresta: 165,
      variacaoVidaPorc: '+50.0%'
    },
    fechamento: {
      dataFechamento: '2026-08-01',
      responsavelFechamento: 'Jonathan (Engenharia ADM)',
      volumeMensalPecas: 10000,
      leadTimeDias: 45,
      estoqueAlmoxAntigo: 20,
      consumoMesAntigo: 55,
      autonomiaDias: 11,
      margemSegurancaDias: -34,
      statusEstoque: 'BLOQUEADO_RUPTURA',
      decisaoFinal: 'BLOQUEADO_ESTOQUE',
      justificativaFinal: 'Aprovado tecnicamente com ganho de 50%, por\u00E9m bloqueado por suprimentos devido a lead time de 45 dias contra 11 dias de estoque antigo. Virada suspensa at\u00E9 lote de seguran\u00E7a.'
    },
    timeline: [
      { dataHora: '2026-07-28 09:00', usuario: 'Jonathan', acao: 'Solicitação Criada', detalhe: 'Torneamento acabamento eixo 8620.' },
      { dataHora: '2026-07-29 14:00', usuario: 'Oscar', acao: 'Viabilidade Aprovada', detalhe: 'Liberado para teste.' },
      { dataHora: '2026-07-30 16:00', usuario: 'Filipe', acao: 'Execução Concluída', detalhe: '165 peças usinadas com Ra 0.8.' },
      { dataHora: '2026-08-01 10:00', usuario: 'Jonathan', acao: 'Bloqueio por Suprimentos', detalhe: 'Lead time de 45 dias gera risco cr\u00EDtico de ruptura.' }
    ],
    comentarios: [
      { dataHora: '2026-08-01 10:30', usuario: 'Jonathan', texto: 'Solicitado ao fornecedor remessa a\u00E9rea de 30 pe\u00E7as para cobrir o lead time.' }
    ]
  }
];

// Estado Global
let currentUser = null;
let currentSelectedTestId = testDataStore[0].id;
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// Instancias de Graficos
let chartStatusInstance = null;
let chartSavingsInstance = null;

// =========================================================================
// INICIALIZACAO & CICLO DE VIDA
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  carregarDadosLocais();
  carregarUsuariosLocais();

  // Verificar se ha sessao ativa
  const sessaoId = localStorage.getItem('viemar_toolflow_current_user_id') || localStorage.getItem('viemar_devflow_current_user_id');
  if (sessaoId) {
    if (sessaoId === 'visitante') {
      entrarComoVisitante();
    } else {
      const user = devflowUsersStore.find(u => u.id === sessaoId);
      if (user) {
        entrarNoApp(user);
      } else {
        mostrarTelaLogin();
      }
    }
  } else {
    mostrarTelaLogin();
  }
});

// =========================================================================
// CONTROLADORES DA TELA DE LOGIN DEDICADA
// =========================================================================
function mostrarTelaLogin() {
  document.getElementById('screenLogin').style.display = 'flex';
  document.getElementById('appShell').style.display = 'none';
}

function realizarLoginTela() {
  const emailInput = document.getElementById('loginEmailField').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPasswordField').value;

  if (!emailInput) {
    alert('Por favor, informe seu e-mail corporativo cadastrado.');
    return;
  }

  if (!passwordInput) {
    alert('Por favor, informe sua senha.');
    return;
  }

  // Buscar usuario no banco de dados local/nuvem
  const user = devflowUsersStore.find(u => 
    u.email.toLowerCase() === emailInput || 
    (u.id && u.id.toLowerCase() === emailInput) ||
    (u.name && u.name.toLowerCase() === emailInput)
  );

  if (user) {
    if (user.password !== passwordInput) {
      alert('Senha incorreta. Verifique a senha digitada ou entre em contato com o Administrador.');
      return;
    }

    entrarNoApp(user);
  } else {
    alert('Usuário não encontrado na base. Solicite seu cadastro ao Administrador (David) ou acesse como Visitante.');
  }
}

function entrarComoVisitante() {
  const visitanteUser = {
    id: 'visitante',
    name: 'Visitante',
    email: 'visitante@viemar.com.br',
    roleKey: 'VISITANTE',
    roleTitle: 'Modo Leitura / Consulta',
    role: TOOLFLOW_ROLES.LEITURA,
    avatarBg: '#94a3b8'
  };

  entrarNoApp(visitanteUser);
}

function entrarNoApp(user) {
  currentUser = user;
  localStorage.setItem('viemar_toolflow_current_user_id', user.id);

  // Alternar telas
  document.getElementById('screenLogin').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';

  // Configurar header / avatar
  document.getElementById('currentUserName').textContent = user.name;
  document.getElementById('currentUserRole').textContent = user.roleTitle;
  document.getElementById('currentUserAvatar').textContent = user.name.charAt(0).toUpperCase();

  // Aplicar regras de visualizacao e RBAC
  aplicarPermissoesUI();

  // Renderizar componentes
  renderizarDashboard();
  renderizarTabelaPipeline();
  renderizarListaUsuariosCadastrados();
  iniciarGraficos();
}

function fazerLogout() {
  localStorage.removeItem('viemar_toolflow_current_user_id');
  localStorage.removeItem('viemar_devflow_current_user_id');
  currentUser = null;
  
  document.getElementById('loginEmailField').value = '';
  document.getElementById('loginPasswordField').value = '';
  mostrarTelaLogin();
}

function esqueciSenha() {
  alert('Para redefinir sua senha ou solicitar acesso, entre em contato com o Administrador do ToolFlow (David) ou acesse como Visitante.');
}

// =========================================================================
// GOVERNANCA E REGRAS DE PERMISSOES (RBAC)
// =========================================================================
function aplicarPermissoesUI() {
  const isLeitura = (currentUser.role === TOOLFLOW_ROLES.LEITURA);
  const isAdmin = (currentUser.role === TOOLFLOW_ROLES.ADMIN);
  const isTecnico = (currentUser.role === TOOLFLOW_ROLES.TECNICO);
  const isSolicitante = (currentUser.role === TOOLFLOW_ROLES.SOLICITANTE);

  // Banner Visitante
  const bannerVisitante = document.getElementById('bannerModoVisitante');
  if (bannerVisitante) {
    bannerVisitante.style.display = isLeitura ? 'flex' : 'none';
  }

  // Botoes de Nova Solicitacao
  const btnTop = document.getElementById('btnNovaSolicitacaoTopbar');
  const btnPipe = document.getElementById('btnNovaSolicitacaoPipeline');
  if (btnTop) btnTop.style.display = isLeitura ? 'none' : 'flex';
  if (btnPipe) btnPipe.style.display = isLeitura ? 'none' : 'block';

  // Botoes do Workflow
  const btnAnalise = document.getElementById('btnSalvarAnaliseEng');
  const btnAgend = document.getElementById('btnSalvarAgendamento');
  const btnChao = document.getElementById('btnSalvarChaoFabrica');
  const btnAresta = document.getElementById('btnAdicionarLinhaAresta');
  const btnFech = document.getElementById('btnSalvarFechamento');
  const btnComent = document.getElementById('btnEnviarComentario');

  if (btnAnalise) btnAnalise.style.display = isAdmin ? 'block' : 'none';
  if (btnAgend) btnAgend.style.display = (isAdmin || isSolicitante) ? 'block' : 'none';
  if (btnChao) btnChao.style.display = (isAdmin || isTecnico) ? 'block' : 'none';
  if (btnAresta) btnAresta.style.display = (isAdmin || isTecnico) ? 'inline-block' : 'none';
  if (btnFech) btnFech.style.display = isAdmin ? 'block' : 'none';
  if (btnComent) btnComent.style.display = isLeitura ? 'none' : 'block';

  // Banner descritivo de perfil no Workflow
  const wfBanner = document.getElementById('wfRoleBanner');
  if (wfBanner) {
    if (isLeitura) {
      wfBanner.className = 'role-banner role-banner-viewer no-print';
      wfBanner.innerHTML = '<span>Perfil Visitante / Qualidade: Modo de visualiza\u00E7\u00E3o e consulta (somente leitura).</span>';
    } else if (isAdmin) {
      wfBanner.className = 'role-banner role-banner-editor no-print';
      wfBanner.innerHTML = '<span>Perfil Engenharia ADM: Acesso total a avalia\u00E7\u00F5es, agendamentos, custos e laudos.</span>';
    } else if (isTecnico) {
      wfBanner.className = 'role-banner role-banner-editor no-print';
      wfBanner.innerHTML = '<span>Perfil T\u00E9cnico de F\u00E1brica: Acompanhamento de usinagem e apontamento de arestas/desgastes.</span>';
    } else {
      wfBanner.className = 'role-banner role-banner-editor no-print';
      wfBanner.innerHTML = '<span>Perfil Solicitante / Fornecedor: Abertura de solicitação e consulta do workflow em tempo real.</span>';
    }
  }
}

// =========================================================================
// GESTAO E CADASTRO DINAMICO DE USUARIOS (MOCKUP OFICIAL)
// =========================================================================
function criarNovoUsuarioForm() {
  const nomeInput = document.getElementById('novoUserNome');
  const emailInput = document.getElementById('novoUserEmail');
  const senhaInput = document.getElementById('novoUserSenha');
  const papelSelect = document.getElementById('novoUserPapel');

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const senha = senhaInput.value;
  const papelKey = papelSelect.value;

  if (!nome || !email || !senha) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  if (senha.length < 6) {
    alert('A senha deve possuir no mínimo 6 caracteres.');
    return;
  }

  if (devflowUsersStore.some(u => u.email.toLowerCase() === email)) {
    alert('Este e-mail já está cadastrado no sistema.');
    return;
  }

  const roleConfig = USER_ROLES_CONFIG[papelKey] || USER_ROLES_CONFIG.TECNICO_USINAGEM;

  const novoUsuario = {
    id: `user_${Date.now()}`,
    name: nome,
    email: email,
    password: senha,
    roleKey: papelKey,
    roleTitle: roleConfig.label,
    role: roleConfig.role,
    avatarBg: roleConfig.avatarBg
  };

  devflowUsersStore.push(novoUsuario);
  salvarUsuariosLocais();

  // Limpar formulário
  nomeInput.value = '';
  emailInput.value = '';
  senhaInput.value = '';
  papelSelect.value = 'TECNICO_USINAGEM';

  renderizarListaUsuariosCadastrados();
  alert(`Usuário "${nome}" (${roleConfig.label}) cadastrado com sucesso!`);
}

function renderizarListaUsuariosCadastrados() {
  const container = document.getElementById('listaUsuariosCadastradosContainer');
  const contador = document.getElementById('contagemUsuariosCadastrados');
  if (!container) return;

  if (contador) {
    contador.textContent = devflowUsersStore.length;
  }

  container.innerHTML = '';

  devflowUsersStore.forEach(u => {
    const roleConfig = USER_ROLES_CONFIG[u.roleKey] || USER_ROLES_CONFIG[u.role] || {
      label: u.roleTitle || 'Usuário',
      badgeStyle: 'background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0;',
      avatarBg: u.avatarBg || '#64748b'
    };

    const isCurrent = currentUser && (currentUser.id === u.id || currentUser.email === u.email);
    const initial = (u.name || 'U').charAt(0).toUpperCase();

    const row = document.createElement('div');
    row.className = 'user-item-row';
    row.innerHTML = `
      <div style="display: flex; align-items: center; min-width: 0;">
        <div class="user-avatar-circle" style="background-color: ${u.avatarBg || roleConfig.avatarBg};">
          ${initial}
        </div>
        <div class="user-info-text">
          <div class="user-name-title">
            <span>${u.name}</span>
            ${isCurrent ? '<span class="badge-voce">(você)</span>' : ''}
          </div>
          <div class="user-email-subtitle">${u.email}</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="user-role-badge" style="${roleConfig.badgeStyle}">${roleConfig.label}</span>
        <div class="user-actions-group">
          <button type="button" class="btn-icon-user" title="Editar Usuário" onclick="abrirModalEditarUsuario('${u.id}')">
            <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button type="button" class="btn-icon-user" title="Alterar Senha" onclick="abrirModalAlterarSenha('${u.id}')">
            <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
          </button>
          <button type="button" class="btn-desativar-user" title="Desativar Usuário" onclick="desativarUsuario('${u.id}')">
            Desativar
          </button>
        </div>
      </div>
    `;

    container.appendChild(row);
  });
}

function abrirModalEditarUsuario(userId) {
  const user = devflowUsersStore.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUserNome').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserPapel').value = user.roleKey || 'TECNICO_USINAGEM';

  document.getElementById('modalEditarUsuario').style.display = 'flex';
}

function fecharModalEditarUsuario() {
  document.getElementById('modalEditarUsuario').style.display = 'none';
}

function salvarEdicaoUsuario() {
  const userId = document.getElementById('editUserId').value;
  const nome = document.getElementById('editUserNome').value.trim();
  const email = document.getElementById('editUserEmail').value.trim().toLowerCase();
  const papelKey = document.getElementById('editUserPapel').value;

  const user = devflowUsersStore.find(u => u.id === userId);
  if (!user) return;

  const roleConfig = USER_ROLES_CONFIG[papelKey] || USER_ROLES_CONFIG.TECNICO_USINAGEM;

  user.name = nome;
  user.email = email;
  user.roleKey = papelKey;
  user.roleTitle = roleConfig.label;
  user.role = roleConfig.role;
  user.avatarBg = roleConfig.avatarBg;

  salvarUsuariosLocais();
  fecharModalEditarUsuario();
  renderizarListaUsuariosCadastrados();

  // Se editou o usuario atualmente conectado, atualiza a interface
  if (currentUser && (currentUser.id === user.id || currentUser.email === user.email)) {
    currentUser = user;
    document.getElementById('currentUserName').textContent = user.name;
    document.getElementById('currentUserRole').textContent = user.roleTitle;
    document.getElementById('currentUserAvatar').textContent = user.name.charAt(0).toUpperCase();
  }

  alert(`Usuário "${nome}" atualizado com sucesso!`);
}

function abrirModalAlterarSenha(userId) {
  const user = devflowUsersStore.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('senhaUserId').value = user.id;
  document.getElementById('senhaUserName').textContent = `${user.name} (${user.email})`;
  document.getElementById('novaSenhaInput').value = '';

  document.getElementById('modalAlterarSenhaUsuario').style.display = 'flex';
}

function fecharModalAlterarSenha() {
  document.getElementById('modalAlterarSenhaUsuario').style.display = 'none';
}

function salvarNovaSenhaUsuario() {
  const userId = document.getElementById('senhaUserId').value;
  const novaSenha = document.getElementById('novaSenhaInput').value;

  if (!novaSenha || novaSenha.length < 6) {
    alert('A nova senha deve ter no mínimo 6 caracteres.');
    return;
  }

  const user = devflowUsersStore.find(u => u.id === userId);
  if (!user) return;

  user.password = novaSenha;
  salvarUsuariosLocais();
  fecharModalAlterarSenha();

  alert(`Senha de "${user.name}" atualizada com sucesso!`);
}

function desativarUsuario(userId) {
  const user = devflowUsersStore.find(u => u.id === userId);
  if (!user) return;

  if (currentUser && (currentUser.id === user.id || currentUser.email === user.email)) {
    alert('Você não pode desativar seu próprio usuário em uso.');
    return;
  }

  if (confirm(`Tem certeza que deseja desativar o usuário "${user.name}" (${user.email})?`)) {
    devflowUsersStore = devflowUsersStore.filter(u => u.id !== userId);
    salvarUsuariosLocais();
    renderizarListaUsuariosCadastrados();
    alert(`Usuário "${user.name}" desativado com sucesso.`);
  }
}

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
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }

  if (ctxSavings && typeof Chart !== 'undefined') {
    if (chartSavingsInstance) chartSavingsInstance.destroy();
    chartSavingsInstance = new Chart(ctxSavings, {
      type: 'bar',
      data: {
        labels: ['Sandvik Coromant', 'Iscar do Brasil', 'Seco Tools'],
        datasets: [{
          label: 'Economia Estimada (R$ / Ano)',
          data: [38500, 19200, 42000],
          backgroundColor: '#ff6600',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { font: { size: 10 } } },
          x: { ticks: { font: { size: 10 } } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}

function atualizarGraficos() {
  if (chartStatusInstance) {
    const emAnalise = testDataStore.filter(t => t.stage === 'STAGE_1_SOLICITACAO' || t.stage === 'STAGE_2_ANALISE').length;
    const emFabrica = testDataStore.filter(t => t.stage === 'STAGE_3_AGENDAMENTO' || t.stage === 'STAGE_4_EXECUCAO').length;
    const homologados = testDataStore.filter(t => t.statusGeral === 'HOMOLOGADO').length;
    const bloqueados = testDataStore.filter(t => t.statusGeral === 'BLOQUEADO_ESTOQUE').length;

    chartStatusInstance.data.datasets[0].data = [emAnalise, emFabrica, homologados, bloqueados];
    chartStatusInstance.update();
  }
}

// =========================================================================
// PIPELINE DE TESTES (TABELA FILTRAVEL & PAGINADA)
// =========================================================================
function renderizarTabelaPipeline() {
  const tbody = document.querySelector('#tabelaPipeline tbody');
  if (!tbody) return;

  const termoBusca = (document.getElementById('inputBuscaTabela')?.value || '').toLowerCase();
  const filtroStatus = document.getElementById('selectFiltroStatus')?.value || 'TODOS';

  let filtrados = testDataStore.filter(teste => {
    const matchTexto = teste.id.toLowerCase().includes(termoBusca) ||
                       teste.solicitacao.descricaoPeca.toLowerCase().includes(termoBusca) ||
                       teste.solicitacao.fornecedor.toLowerCase().includes(termoBusca) ||
                       teste.solicitacao.maquina.toLowerCase().includes(termoBusca);

    let matchStatus = true;
    if (filtroStatus === 'HOMOLOGADO') matchStatus = (teste.statusGeral === 'HOMOLOGADO');
    else if (filtroStatus === 'BLOQUEADO_ESTOQUE') matchStatus = (teste.statusGeral === 'BLOQUEADO_ESTOQUE');
    else if (filtroStatus !== 'TODOS') matchStatus = (teste.stage === filtroStatus);

    return matchTexto && matchStatus;
  });

  const total = filtrados.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginaItens = filtrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  tbody.innerHTML = '';

  if (paginaItens.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum teste encontrado para os filtros aplicados.</td></tr>`;
  } else {
    paginaItens.forEach(t => {
      let badgeStatusClass = 'badge-blue';
      if (t.statusGeral === 'HOMOLOGADO') badgeStatusClass = 'badge-green';
      else if (t.statusGeral === 'BLOQUEADO_ESTOQUE') badgeStatusClass = 'badge-amber';
      else if (t.statusGeral === 'REPROVADO') badgeStatusClass = 'badge-red';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.id}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${t.solicitacao.descricaoPeca}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${t.solicitacao.codigoPeca}</div>
        </td>
        <td>${t.solicitacao.fornecedor}</td>
        <td>${t.solicitacao.maquina}</td>
        <td><span class="badge ${WORKFLOW_STAGES[t.stage]?.badgeClass || 'badge-gray'}">${WORKFLOW_STAGES[t.stage]?.label || t.stage}</span></td>
        <td><span class="badge ${badgeStatusClass}">${t.statusGeral}</span></td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="abrirDetalhesWorkflow('${t.id}')">Acessar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const indicator = document.getElementById('pipelinePageIndicator');
  if (indicator) {
    indicator.textContent = `Exibindo ${total === 0 ? 0 : inicio + 1} - ${Math.min(inicio + ITEMS_PER_PAGE, total)} de ${total} testes (Pagina ${currentPage}/${totalPages})`;
  }
}

function paginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    renderizarTabelaPipeline();
  }
}

function proximaPagina() {
  const total = testDataStore.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  if (currentPage < totalPages) {
    currentPage++;
    renderizarTabelaPipeline();
  }
}

// =========================================================================
// WORKFLOW DE 5 ETAPAS (DETALHES E EDICAO)
// =========================================================================
function abrirDetalhesWorkflow(testeId) {
  currentSelectedTestId = testeId;
  const teste = testDataStore.find(t => t.id === testeId);
  if (!teste) return;

  document.getElementById('wfIdTeste').textContent = teste.id;
  document.getElementById('wfDescPeca').textContent = teste.solicitacao.descricaoPeca;
  document.getElementById('wfFornecedor').textContent = teste.solicitacao.fornecedor;

  preencherCamposWorkflow(teste);
  renderizarTimeline(teste);
  renderizarComentarios(teste);

  // Destacar etapa atual
  const stageNum = WORKFLOW_STAGES[teste.stage]?.id || 1;
  alternarAbaWorkflow(stageNum);

  aplicarPermissoesUI();
  navegarPara('viewWorkflow', `Workflow ${teste.id}`);
}

function alternarAbaWorkflow(etapaNum) {
  for (let i = 1; i <= 5; i++) {
    const tab = document.getElementById(`wfTabContent_${i}`);
    const step = document.getElementById(`wfStep_${i}`);
    if (tab) tab.style.display = (i === etapaNum) ? 'block' : 'none';
    if (step) {
      if (i === etapaNum) step.classList.add('active');
      else step.classList.remove('active');
    }
  }
}

function normalizarListaWorkflow(valor) {
  if (Array.isArray(valor)) return valor.filter(Boolean).join(', ');
  return valor || '';
}

function parametroWorkflow(valor, unidade) {
  if (valor === undefined || valor === null || valor === '') return '';
  return unidade ? `${valor} ${unidade}` : `${valor}`;
}
function preencherCamposWorkflow(teste) {
  const s = teste.solicitacao;
  document.getElementById('wfSolData').value = s.dataSolicitacao || '';
  document.getElementById('wfSolDataPrev').value = s.dataPrevistaTeste || '';
  document.getElementById('wfSolNome').value = s.solicitante || '';
  document.getElementById('wfSolForn').value = s.fornecedor || '';
  document.getElementById('wfSolProcessos').value = normalizarListaWorkflow(s.processos || s.processo || s.operacao);
  document.getElementById('wfSolTipos').value = `${normalizarListaWorkflow(s.tiposFerramenta)}${s.tipoFerramentaOutra ? ` | Outra: ${s.tipoFerramentaOutra}` : ''}${s.perfilQuebraCavaco ? ` | Perfil: ${s.perfilQuebraCavaco}` : ''}`;

  const parametrosAtuais = s.parametrosAtuais || {};
  const parametrosRecomendados = s.parametrosRecomendados || {};

  document.getElementById('wfSolFerrAtual').value = s.ferramentaAtual || '';
  document.getElementById('wfSolFerrAtualDesc').value = s.ferramentaAtualDescricao || '';
  document.getElementById('wfSolAtualAvanco').value = parametroWorkflow(parametrosAtuais.avanco, 'mm/rot');
  document.getElementById('wfSolAtualAp').value = parametroWorkflow(parametrosAtuais.ap, 'mm');
  document.getElementById('wfSolAtualVc').value = parametroWorkflow(parametrosAtuais.vc, 'm/min');
  document.getElementById('wfSolAtualRpm').value = parametroWorkflow(parametrosAtuais.rpm, 'rpm');
  document.getElementById('wfSolVidaAtual').value = `${s.vidaAtual} pe\u00E7as`;
  document.getElementById('wfSolCicloAtual').value = `${s.cicloAtual} s`;
  document.getElementById('wfSolCustoAtual').value = `R$ ${parseFloat(s.custoAtual || 0).toFixed(2)}`;

  document.getElementById('wfSolFerrTeste').value = s.ferramentaTeste || '';
  document.getElementById('wfSolClasse').value = s.classeFerramenta || '';
  document.getElementById('wfSolPerfil').value = s.perfilQuebraCavaco || '';
  document.getElementById('wfSolFerrTesteDesc').value = s.ferramentaTesteDescricao || '';
  document.getElementById('wfSolRecAvanco').value = parametroWorkflow(parametrosRecomendados.avanco, 'mm/rot');
  document.getElementById('wfSolRecAp').value = parametroWorkflow(parametrosRecomendados.ap, 'mm');
  document.getElementById('wfSolRecVc').value = parametroWorkflow(parametrosRecomendados.vc, 'm/min');
  document.getElementById('wfSolRecRpm').value = parametroWorkflow(parametrosRecomendados.rpm, 'rpm');
  document.getElementById('wfSolMetaVida').value = `${s.metaVida} pe\u00E7as`;
  document.getElementById('wfSolAmostras').value = `${s.amostrasBonificadas} un`;
  document.getElementById('wfSolPrecoTeste').value = `R$ ${parseFloat(s.precoTeste || 0).toFixed(2)}`;

  const ganho = ((s.metaVida - s.vidaAtual) / s.vidaAtual) * 100;
  document.getElementById('wfSolGanho').textContent = `${ganho >= 0 ? '+' : ''}${ganho.toFixed(1)}%`;
  document.getElementById('wfSolLeadTime').value = `${s.leadTimeDias} dias`;
  document.getElementById('wfSolEstoqueLocal').value = s.estoqueLocal || 'SIM';
  document.getElementById('wfSolJustificativa').value = s.justificativa || '';
  document.getElementById('wfSolRetorno').value = `${s.retornoEsperado || ''}${s.indicadoresAtacados ? `\nIndicadores: ${normalizarListaWorkflow(s.indicadoresAtacados)}` : ''}`.trim();

  // Etapa 2: Analise Engenharia
  const eng = teste.analiseEngenharia || {};
  document.getElementById('wfEngData').value = eng.dataAnalise || new Date().toISOString().split('T')[0];
  document.getElementById('wfEngResp').value = eng.responsavel || currentUser.name;
  document.getElementById('wfEngDecisao').value = eng.decisao || 'APROVADO';
  document.getElementById('wfEngParecer').value = eng.parecerTexto || '';
  document.getElementById('wfEngTecnicos').value = eng.tecnicosEscalados || 'Filipe (1o Turno) e Charles (2o Turno)';

  // Etapa 3: Agendamento
  const ag = teste.agendamento || {};
  document.getElementById('wfAgData').value = ag.dataVisitaConfirmada || s.dataPrevistaTeste || '';
  document.getElementById('wfAgHora').value = ag.horarioVisita || '08:30';
  document.getElementById('wfAgFornPres').value = ag.tecnicoFornecedorPresente || 'SIM';
  document.getElementById('wfAgPresetEnt').value = ag.ferramentasEntreguesPreset || 'SIM';
  document.getElementById('wfAgConeMont').value = ag.coneMontadoPreset || 'SIM';

  // Etapa 4: Chao de Fabrica
  const cf = teste.chaoDeFabrica || {};
  document.getElementById('wfCfMaquina').value = cf.maquinaReal || s.maquina || '';
  document.getElementById('wfCfCiclo').value = cf.cicloRealMedido || s.cicloAtual || 0;
  
  const p = cf.parametros || {};
  document.getElementById('wfCfVc').value = p.vc || 220;
  document.getElementById('wfCfRpm').value = p.rpm || 1400;
  document.getElementById('wfCfFz').value = p.fz || 0.18;
  document.getElementById('wfCfVf').value = p.vf || 1260;
  document.getElementById('wfCfAp').value = p.ap || 2.5;
  document.getElementById('wfCfAe').value = p.ae || 40.0;
  document.getElementById('wfCfBalanco').value = p.balanco || 85;

  renderizarTabelaArestas(cf.registrosArestas || []);
  document.getElementById('wfCfTotalPecas').textContent = cf.totalPecas || 0;
  document.getElementById('wfCfVidaMedia').textContent = cf.vidaMediaAresta || 0;
  document.getElementById('wfCfVariacao').textContent = cf.variacaoVidaPorc || '+0.0%';

  // Etapa 5: Fechamento & Estoque
  const f = teste.fechamento || {};
  document.getElementById('wfFechPrecoAtual').value = s.custoAtual || 38.50;
  document.getElementById('wfFechArestasAtual').value = s.arestasAtual || 2;
  document.getElementById('wfFechVidaAtual').value = s.vidaAtual || 80;

  document.getElementById('wfFechPrecoTeste').value = s.precoTeste || 32.00;
  document.getElementById('wfFechArestasTeste').value = s.arestasTeste || 4;
  document.getElementById('wfFechVidaTeste').value = cf.vidaMediaAresta || s.metaVida || 120;

  document.getElementById('wfFechVolumeMes').value = f.volumeMensalPecas || 5000;
  document.getElementById('wfFechLeadTime').value = f.leadTimeDias || s.leadTimeDias || 15;
  document.getElementById('wfFechEstoqueAlmox').value = f.estoqueAlmoxAntigo || s.quantidadeEstoque || 45;
  document.getElementById('wfFechConsumoMes').value = f.consumoMesAntigo || s.giroMensal || 30;

  document.getElementById('wfFechDecisaoFinal').value = f.decisaoFinal || 'HOMOLOGADO';
  document.getElementById('wfFechJustificativa').value = f.justificativaFinal || '';

  recalcularFechamento();
}

function renderizarTabelaArestas(registros) {
  const tbody = document.querySelector('#tabelaArestasDevFlow tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (registros.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum apontamento de turno registrado ate o momento.</td></tr>`;
    return;
  }

  registros.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${r.aresta}</strong></td>
      <td>${r.turno}</td>
      <td>${r.tecnico}</td>
      <td><strong>${r.pecas} pe\u00E7as</strong></td>
      <td>${r.ra}</td>
      <td>${r.desgaste}</td>
    `;
    tbody.appendChild(tr);
  });
}

function adicionarLinhaAresta() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const pecas = prompt('Informe a quantidade de peças usinadas nesta aresta/turno:', '60');
  if (!pecas) return;

  const ra = prompt('Informe a rugosidade Ra medida (ex: 1.4 µm):', '1.4 µm') || '1.4 µm';
  const desgaste = prompt('Estado de desgaste (VB / Aresta):', 'Desgaste VB normal') || 'OK';

  if (!teste.chaoDeFabrica.registrosArestas) teste.chaoDeFabrica.registrosArestas = [];
  const arestaIndex = teste.chaoDeFabrica.registrosArestas.length + 1;

  teste.chaoDeFabrica.registrosArestas.push({
    aresta: `#${arestaIndex}`,
    turno: currentUser.roleTitle.includes('2o') ? '2o Turno' : '1o Turno',
    tecnico: currentUser.name,
    pecas: parseInt(pecas, 10),
    ra: ra,
    desgaste: desgaste
  });

  const total = teste.chaoDeFabrica.registrosArestas.reduce((acc, curr) => acc + curr.pecas, 0);
  const media = Math.round(total / teste.chaoDeFabrica.registrosArestas.length);
  const variacao = (((media - teste.solicitacao.vidaAtual) / teste.solicitacao.vidaAtual) * 100).toFixed(1);

  teste.chaoDeFabrica.totalPecas = total;
  teste.chaoDeFabrica.vidaMediaAresta = media;
  teste.chaoDeFabrica.variacaoVidaPorc = `${variacao >= 0 ? '+' : ''}${variacao}%`;

  registrarTimeline(teste, 'Apontamento de Usinagem', `${pecas} peças usinadas por ${currentUser.name}.`);
  salvarDadosLocais();
  preencherCamposWorkflow(teste);
}

// =========================================================================
// SALVAMENTOS DE ETAPAS DO WORKFLOW
// =========================================================================
function salvarDecisaoEngenharia() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const decisao = document.getElementById('wfEngDecisao').value;
  teste.analiseEngenharia = {
    dataAnalise: document.getElementById('wfEngData').value,
    responsavel: document.getElementById('wfEngResp').value,
    decisao: decisao,
    parecerTexto: document.getElementById('wfEngParecer').value,
    tecnicosEscalados: document.getElementById('wfEngTecnicos').value
  };

  if (decisao === 'APROVADO') {
    teste.stage = 'STAGE_3_AGENDAMENTO';
    teste.statusGeral = 'AGUARDANDO_VISITA';
    registrarTimeline(teste, 'Viabilidade Aprovada (GO)', `Engenharia autorizou o agendamento quinzenal.`);
  } else if (decisao === 'REPROVADO') {
    teste.stage = 'STAGE_2_ANALISE';
    teste.statusGeral = 'REPROVADO';
    registrarTimeline(teste, 'Viabilidade Recusada (NO-GO)', `Solicitação inviável tecnicamente. Parecer disponível ao solicitante.`);
  } else {
    teste.stage = 'STAGE_2_ANALISE';
    teste.statusGeral = 'EM_REVISAO';
    registrarTimeline(teste, 'Solicitação em Revisão', `Engenharia solicitou complemento de dados ao solicitante.`);
  }

  salvarDadosLocais();
  alert('Parecer da Engenharia registrado com sucesso!');
  renderizarDashboard();
  renderizarTabelaPipeline();
  abrirDetalhesWorkflow(teste.id);
}

function confirmarAgendamento() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  teste.agendamento = {
    dataVisitaConfirmada: document.getElementById('wfAgData').value,
    horarioVisita: document.getElementById('wfAgHora').value,
    tecnicoFornecedorPresente: document.getElementById('wfAgFornPres').value,
    ferramentasEntreguesPreset: document.getElementById('wfAgPresetEnt').value,
    coneMontadoPreset: document.getElementById('wfAgConeMont').value
  };

  teste.stage = 'STAGE_4_EXECUCAO';
  teste.statusGeral = 'EM_TESTE_FABRICA';

  registrarTimeline(teste, 'Agendamento Confirmado', `Visita confirmada para ${teste.agendamento.dataVisitaConfirmada} as ${teste.agendamento.horarioVisita}.`);
  salvarDadosLocais();
  alert('Visita e prepara\u00E7\u00E3o do Preset confirmadas! Teste liberado para a F\u00E1brica.');
  renderizarDashboard();
  renderizarTabelaPipeline();
  abrirDetalhesWorkflow(teste.id);
}

function salvarChaoDeFabrica() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  teste.chaoDeFabrica.maquinaReal = document.getElementById('wfCfMaquina').value;
  teste.chaoDeFabrica.cicloRealMedido = parseFloat(document.getElementById('wfCfCiclo').value) || 0;
  teste.chaoDeFabrica.parametros = {
    vc: parseFloat(document.getElementById('wfCfVc').value) || 0,
    rpm: parseFloat(document.getElementById('wfCfRpm').value) || 0,
    fz: parseFloat(document.getElementById('wfCfFz').value) || 0,
    vf: parseFloat(document.getElementById('wfCfVf').value) || 0,
    ap: parseFloat(document.getElementById('wfCfAp').value) || 0,
    ae: parseFloat(document.getElementById('wfCfAe').value) || 0,
    balanco: parseFloat(document.getElementById('wfCfBalanco').value) || 0
  };

  teste.stage = 'STAGE_5_VALIDACAO';
  teste.statusGeral = 'AGUARDANDO_FECHAMENTO';

  registrarTimeline(teste, 'Testes de F\u00E1brica Conclu\u00EDdos', `Par\u00E2metros CNC e vida \u00FAtil registrados pelos t\u00E9cnicos.`);
  salvarDadosLocais();
  alert('Resultados de usinagem salvos! Avan\u00E7ando para Fechamento e Laudo Final.');
  renderizarDashboard();
  renderizarTabelaPipeline();
  abrirDetalhesWorkflow(teste.id);
}

function recalcularFechamento() {
  const precoAtual = parseFloat(document.getElementById('wfFechPrecoAtual')?.value) || 0;
  const arestasAtual = parseFloat(document.getElementById('wfFechArestasAtual')?.value) || 1;
  const vidaAtual = parseFloat(document.getElementById('wfFechVidaAtual')?.value) || 1;
  const cppAtual = precoAtual / (arestasAtual * vidaAtual);
  const elCppAtual = document.getElementById('wfFechCppAtual');
  if (elCppAtual) elCppAtual.textContent = `R$ ${cppAtual.toFixed(4)}`;

  const precoTeste = parseFloat(document.getElementById('wfFechPrecoTeste')?.value) || 0;
  const arestasTeste = parseFloat(document.getElementById('wfFechArestasTeste')?.value) || 1;
  const vidaTeste = parseFloat(document.getElementById('wfFechVidaTeste')?.value) || 1;
  const cppTeste = precoTeste / (arestasTeste * vidaTeste);
  const elCppNovo = document.getElementById('wfFechCppNovo');
  if (elCppNovo) elCppNovo.textContent = `R$ ${cppTeste.toFixed(4)}`;

  const volMes = parseFloat(document.getElementById('wfFechVolumeMes')?.value) || 0;
  const diffCpp = cppAtual - cppTeste;
  const econMes = diffCpp * volMes;
  const econAno = econMes * 12;

  const elEconMes = document.getElementById('wfFechEconMes');
  const elEconAno = document.getElementById('wfFechEconAno');
  if (elEconMes) elEconMes.textContent = `R$ ${econMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / m\u00EAs`;
  if (elEconAno) elEconAno.textContent = `R$ ${econAno.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ano`;

  const leadTime = parseFloat(document.getElementById('wfFechLeadTime')?.value) || 0;
  const estoqueAlmox = parseFloat(document.getElementById('wfFechEstoqueAlmox')?.value) || 0;
  const consumoMes = parseFloat(document.getElementById('wfFechConsumoMes')?.value) || 1;

  const consumoDia = consumoMes / 30;
  const autonomiaDias = Math.round(estoqueAlmox / (consumoDia || 1));
  const margem = autonomiaDias - leadTime;

  const elAutonomia = document.getElementById('wfFechAutonomia');
  const elMargem = document.getElementById('wfFechMargem');
  const elStatusEstoque = document.getElementById('wfFechKpiStatusEstoque');
  const elAlerta = document.getElementById('wfFechAlertaRuptura');
  const boxMargem = document.getElementById('wfFechBoxMargem');

  if (elAutonomia) elAutonomia.textContent = `${autonomiaDias} dias`;
  if (elMargem) elMargem.textContent = `${margem >= 0 ? '+' : ''}${margem} dias`;

  if (margem < 0) {
    if (elStatusEstoque) elStatusEstoque.textContent = 'RISCO DE RUPTURA';
    if (elAlerta) elAlerta.style.display = 'block';
    if (boxMargem) { boxMargem.className = 'kpi-box danger'; }
  } else {
    if (elStatusEstoque) elStatusEstoque.textContent = 'TRANSI\u00C7\u00C3O SEGURA';
    if (elAlerta) elAlerta.style.display = 'none';
    if (boxMargem) { boxMargem.className = 'kpi-box success'; }
  }
}

function emitirLaudoFinal() {
  const teste = testDataStore.find(t => t.id === currentSelectedTestId);
  if (!teste) return;

  const decisao = document.getElementById('wfFechDecisaoFinal').value;
  const justificativa = document.getElementById('wfFechJustificativa').value;

  teste.fechamento = {
    dataFechamento: new Date().toISOString().split('T')[0],
    responsavelFechamento: currentUser.name,
    volumeMensalPecas: parseFloat(document.getElementById('wfFechVolumeMes').value) || 5000,
    leadTimeDias: parseFloat(document.getElementById('wfFechLeadTime').value) || 15,
    estoqueAlmoxAntigo: parseFloat(document.getElementById('wfFechEstoqueAlmox').value) || 0,
    consumoMesAntigo: parseFloat(document.getElementById('wfFechConsumoMes').value) || 1,
    autonomiaDias: parseInt(document.getElementById('wfFechAutonomia').textContent, 10) || 0,
    margemSegurancaDias: parseInt(document.getElementById('wfFechMargem').textContent, 10) || 0,
    statusEstoque: document.getElementById('wfFechKpiStatusEstoque').textContent,
    decisaoFinal: decisao,
    justificativaFinal: justificativa
  };

  teste.statusGeral = decisao;

  registrarTimeline(teste, `Laudo Emitido: ${decisao}`, justificativa || `Homologação concluída pela Engenharia.`);
  salvarDadosLocais();
  alert(`Laudo Oficial registrado com status: ${decisao}!`);
  renderizarDashboard();
  renderizarTabelaPipeline();
  abrirDetalhesWorkflow(teste.id);
}

// =========================================================================
// TIMELINE E COMENTÁRIOS
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
  teste.timeline.push({ dataHora: dataFormatada, usuario: currentUser ? currentUser.name : 'Sistema', acao: acao, detalhe: detalhe });
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
  teste.comentarios.push({ dataHora: dataFormatada, usuario: currentUser ? currentUser.name : 'Visitante', texto: texto });

  input.value = '';
  salvarDadosLocais();
  renderizarComentarios(teste);
}

// =========================================================================
// MODAL DE NOVA SOLICITAÇÃO (D-2)
// =========================================================================
const TOOLFLOW_QUINZENA_BASE_ISO = '2026-08-06';

function criarDataLocal(iso) {
  const partes = iso.split('-').map(Number);
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

function formatarDataIso(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

function adicionarDias(data, dias) {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);
  return nova;
}

function dataMinimaTesteIso() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return formatarDataIso(adicionarDias(hoje, 2));
}

function diasEntreDatas(isoA, isoB) {
  return Math.round((criarDataLocal(isoA) - criarDataLocal(isoB)) / (24 * 60 * 60 * 1000));
}

function ehQuintaQuinzenalValida(iso) {
  if (!iso || iso < dataMinimaTesteIso()) return false;
  const data = criarDataLocal(iso);
  return data.getDay() === 4 && diasEntreDatas(iso, TOOLFLOW_QUINZENA_BASE_ISO) % 14 === 0;
}

function formatarDataBR(iso) {
  return criarDataLocal(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function gerarQuintasQuinzenais(qtd = 10) {
  const datas = [];
  const minima = dataMinimaTesteIso();
  let cursor = criarDataLocal(TOOLFLOW_QUINZENA_BASE_ISO);
  while (formatarDataIso(cursor) < minima) cursor = adicionarDias(cursor, 14);
  while (datas.length < qtd) {
    datas.push(formatarDataIso(cursor));
    cursor = adicionarDias(cursor, 14);
  }
  return datas;
}

function preencherDatasPrevistasTeste() {
  const select = document.getElementById('modalDataPrevista');
  if (!select) return;
  select.innerHTML = gerarQuintasQuinzenais().map((iso, idx) => `<option value="${iso}">${formatarDataBR(iso)}${idx === 0 ? ' - pr\u00F3xima janela v\u00E1lida' : ''}</option>`).join('');
}

function coletarValoresMarcados(nome) {
  return Array.from(document.querySelectorAll(`input[name="${nome}"]:checked`)).map(input => input.value);
}
function abrirModalNovaSolicitacao() {
  preencherDatasPrevistasTeste();
  const solicitante = document.getElementById('modalSolicitanteNome');
  if (solicitante) solicitante.value = '';
  document.getElementById('modalNovaSolicitacao').style.display = 'flex';
}

function fecharModalNovaSolicitacao() {
  document.getElementById('modalNovaSolicitacao').style.display = 'none';
}

function textoCadastroMaiusculo(id) {
  const elemento = document.getElementById(id);
  if (!elemento) return '';
  const valor = (elemento.value || '').trim().toLocaleUpperCase('pt-BR');
  elemento.value = valor;
  return valor;
}
function submeterModalSolicitacao() {
  const idNovo = `TESTE-00${testDataStore.length + 1}/2026`;
  const hoje = new Date().toISOString().split('T')[0];
  const dataPrevistaTeste = document.getElementById('modalDataPrevista').value;
  const processos = coletarValoresMarcados('modalProcessos');
  const tiposFerramenta = coletarValoresMarcados('modalTiposFerramenta');
  const indicadoresAtacados = coletarValoresMarcados('modalIndicadores');
  const tipoOutra = textoCadastroMaiusculo('modalTipoOutra');

  if (!ehQuintaQuinzenalValida(dataPrevistaTeste)) { alert('Selecione uma quinta-feira quinzenal v\u00E1lida, com pelo menos D+2.'); return; }
  if (processos.length === 0) { alert('Selecione pelo menos um processo.'); return; }
  if (tiposFerramenta.length === 0) { alert('Selecione pelo menos um tipo de ferramenta.'); return; }
  if (tiposFerramenta.includes('Outra') && !tipoOutra) { alert('Informe qual \u00E9 o outro tipo de ferramenta.'); return; }
  if (indicadoresAtacados.length === 0) { alert('Selecione pelo menos um indicador.'); return; }

  const codigoFerramenta = textoCadastroMaiusculo('modalFerrTeste');
  const solicitanteNome = textoCadastroMaiusculo('modalSolicitanteNome') || 'SOLICITANTE';
  const descricaoAplicacao = `Teste de ${codigoFerramenta} em ${processos.join(', ')}`;

  const novoTeste = {
    id: idNovo,
    stage: 'STAGE_2_ANALISE',
    statusGeral: 'AGUARDANDO_ANALISE',
    solicitacao: {
      dataSolicitacao: hoje,
      dataPrevistaTeste: dataPrevistaTeste,
      calendarioTeste: 'QUINTA-FEIRA QUINZENAL, M\u00CDNIMO D+2 DA SOLICITA\u00C7\u00C3O',
      solicitante: solicitanteNome,
      fornecedor: textoCadastroMaiusculo('modalFornecedor'),
      contatoFornecedor: '',
      processos: processos,
      tiposFerramenta: tiposFerramenta,
      tipoFerramentaOutra: tipoOutra,
      codigoPeca: 'N/A',
      descricaoPeca: descricaoAplicacao,
      materialPeca: '',
      maquina: processos.join(', '),
      operacao: processos.join(', '),
      refrigeracao: '',
      
      ferramentaAtual: textoCadastroMaiusculo('modalFerrAtual'),
      ferramentaAtualDescricao: textoCadastroMaiusculo('modalFerrAtualDesc'),
      parametrosAtuais: {
        avanco: parseFloat(document.getElementById('modalAtualAvanco').value) || '',
        ap: parseFloat(document.getElementById('modalAtualAp').value) || '',
        vc: parseFloat(document.getElementById('modalAtualVc').value) || '',
        rpm: parseFloat(document.getElementById('modalAtualRpm').value) || ''
      },
      vidaAtual: parseFloat(document.getElementById('modalVidaAtual').value) || 80,
      cicloAtual: parseFloat(document.getElementById('modalCicloAtual').value) || 120,
      custoAtual: parseFloat(document.getElementById('modalCustoAtual').value) || 40,
      arestasAtual: 2,
      
      ferramentaTeste: codigoFerramenta,
      classeFerramenta: textoCadastroMaiusculo('modalClasseFerramenta'),
      ferramentaTesteDescricao: textoCadastroMaiusculo('modalFerrTesteDesc'),
      perfilQuebraCavaco: textoCadastroMaiusculo('modalPerfilQuebraCavaco'),
      parametrosRecomendados: {
        avanco: parseFloat(document.getElementById('modalRecAvanco').value) || '',
        ap: parseFloat(document.getElementById('modalRecAp').value) || '',
        vc: parseFloat(document.getElementById('modalRecVc').value) || '',
        rpm: parseFloat(document.getElementById('modalRecRpm').value) || ''
      },
      metaVida: parseFloat(document.getElementById('modalMetaVida').value) || 120,
      amostrasBonificadas: parseFloat(document.getElementById('modalAmostras').value) || 10,
      precoTeste: parseFloat(document.getElementById('modalPrecoTeste').value) || 35,
      arestasTeste: 4,
      leadTimeDias: parseFloat(document.getElementById('modalLeadTime').value) || 15,
      estoqueLocal: document.getElementById('modalEstoqueLocal').value,
      quantidadeEstoque: parseFloat(document.getElementById('modalQtdEstoque').value) || 0,
      giroMensal: parseFloat(document.getElementById('modalGiroMensal').value) || 0,
      justificativa: textoCadastroMaiusculo('modalJustificativa'),
      retornoEsperado: textoCadastroMaiusculo('modalRetornoEsperado'),
      indicadoresAtacados: indicadoresAtacados
    },
    analiseEngenharia: {},
    agendamento: {},
    chaoDeFabrica: { parametros: {}, registrosArestas: [] },
    fechamento: {},
    timeline: [
      { dataHora: `${hoje} 08:00`, usuario: solicitanteNome, acao: 'Solicita\u00E7\u00E3o Criada (D-2)', detalhe: 'Aguardando avalia\u00E7\u00E3o da Engenharia.' }
    ],
    comentarios: []
  };

  testDataStore.unshift(novoTeste);
  salvarDadosLocais();
  fecharModalNovaSolicitacao();
  alert(`Solicita\u00E7\u00E3o ${idNovo} cadastrada com sucesso!`);
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
                `* Peça: ${teste.solicitacao.descricaoPeca}\n` +
                `* Máquina: ${teste.solicitacao.maquina}\n` +
                `* Fornecedor: ${teste.solicitacao.fornecedor}\n` +
                `* Ferramenta Proposta: ${teste.solicitacao.ferramentaTeste}\n` +
                `* Etapa Atual: ${WORKFLOW_STAGES[teste.stage].label}\n` +
                `* Status Geral: ${teste.statusGeral}\n` +
                `Acompanhamento no Portal de Testes Viemar.`;

  navigator.clipboard.writeText(texto).then(() => {
    alert('Resumo do workflow copiado com padr\u00E3o Viemar para a \u00E1rea de transfer\u00EAncia!');
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
  localStorage.setItem('viemar_toolflow_users_v3', JSON.stringify(devflowUsersStore));
}

function carregarUsuariosLocais() {
  // Limpar chave antiga v2 para forcar migracao
  localStorage.removeItem('viemar_toolflow_users_v2');

  const salvos = localStorage.getItem('viemar_toolflow_users_v3');
  if (salvos) {
    try {
      devflowUsersStore = JSON.parse(salvos);
    } catch (e) {
      console.error(e);
      devflowUsersStore = [...INITIAL_USERS_STORE];
    }
  } else {
    devflowUsersStore = [...INITIAL_USERS_STORE];
    salvarUsuariosLocais();
  }
}
