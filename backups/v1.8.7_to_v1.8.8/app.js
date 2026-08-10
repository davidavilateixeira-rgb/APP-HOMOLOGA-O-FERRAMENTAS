// =========================================================================
// VIEMAR TOOLFLOW v1.8.7 - SISTEMA DE WORKFLOW E HOMOLOGAÇÃO DE FERRAMENTAS
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

// Definicao das 4 etapas visiveis do Workflow
const WORKFLOW_STAGES = {
  STAGE_1_SOLICITACAO: { id: 1, key: 'STAGE_1_SOLICITACAO', label: '1. Solicitação de Teste', badgeClass: 'badge-blue' },
  STAGE_2_ANALISE: { id: 2, key: 'STAGE_2_ANALISE', label: '2. Análise Engenharia', badgeClass: 'badge-orange' },
  // Compatibilidade para solicitações antigas: a etapa de agendamento foi removida da interface.
  STAGE_3_AGENDAMENTO: { id: 4, key: 'STAGE_3_AGENDAMENTO', label: '3. Teste em Máquina', badgeClass: 'badge-blue' },
  STAGE_4_EXECUCAO: { id: 4, key: 'STAGE_4_EXECUCAO', label: '3. Teste em Máquina', badgeClass: 'badge-blue' },
  STAGE_5_VALIDACAO: { id: 5, key: 'STAGE_5_VALIDACAO', label: '4. Validação & Estoque', badgeClass: 'badge-green' }
};

const WORKFLOW_VISIBLE_STEPS = [1, 2, 4, 5];

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
      { dataHora: '2026-08-01 14:20', usuario: 'Roberto (Preset)', acao: 'Solicitação Criada', detalhe: 'Proposta submetida para análise.' },
      { dataHora: '2026-08-02 10:15', usuario: 'Oscar (Engenharia ADM)', acao: 'Viabilidade Aprovada (GO)', detalhe: 'Solicitante responsável pelo agendamento/conferência. Teste liberado para fábrica.' },
      { dataHora: '2026-08-03 09:00', usuario: 'Roberto (Preset)', acao: 'Agendamento pelo Solicitante', detalhe: 'Solicitante assumiu agendamento e conferência antes do teste.' },
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
      { dataHora: '2026-08-03 16:40', usuario: 'Gerenciador', acao: 'Solicitação Criada', detalhe: 'Aguardando parecer da Engenharia.' }
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
// FIREBASE CLOUD SYNC (AUTH + FIRESTORE + STORAGE)
// =========================================================================
const FIREBASE_COLLECTIONS = {
  tests: 'toolflow_tests',
  userProfiles: 'toolflow_user_profiles'
};

let dadosLocaisPersistidos = false;
let usuariosLocaisPersistidos = false;
let firebaseSaveTimer = null;
let firebaseSyncEmExecucao = false;
let firebasePrimeiraCargaConcluida = false;
const ANEXO_FIRESTORE_MAX_CHARS = 260000; // ~190 KB por imagem; evita estourar limite de 1 MiB do documento Firestore.

function firebaseDisponivel() {
  return Boolean(window.isFirebaseConnected && window.db);
}

function firebaseAuthDisponivel() {
  return Boolean(window.isFirebaseConnected && window.auth);
}

function firebaseStorageDisponivel() {
  // Storage fica desativado para evitar dependencia do plano pago. Imagens usam Firestore compactado.
  return false;
}

function montarEmailFirebase(login) {
  const valor = String(login || '').trim().toLowerCase();
  if (!valor) return '';
  return valor.includes('@') ? valor : `${valor}@viemar.com.br`;
}

function sanitizarDocId(valor) {
  return String(valor || 'sem-id')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 120) || `doc_${Date.now()}`;
}

function obterRoleConfig(roleKey) {
  return USER_ROLES_CONFIG[roleKey] || USER_ROLES_CONFIG.VISITANTE;
}

function normalizarPerfilUsuario(perfil) {
  const roleKey = perfil.roleKey || perfil.perfil || 'VISITANTE';
  const roleConfig = obterRoleConfig(roleKey);
  return {
    id: perfil.id || perfil.firebaseUid || sanitizarDocId(perfil.email || perfil.name),
    firebaseUid: perfil.firebaseUid || perfil.uid || null,
    name: perfil.name || perfil.nome || perfil.email || 'Usuário',
    email: String(perfil.email || '').trim().toLowerCase(),
    password: perfil.password || '',
    roleKey,
    roleTitle: roleConfig.label,
    role: roleConfig.role,
    avatarBg: perfil.avatarBg || roleConfig.avatarBg,
    ativo: perfil.ativo !== false
  };
}

function perfilUsuarioParaFirebase(user) {
  const perfil = normalizarPerfilUsuario(user);
  return {
    id: perfil.id,
    firebaseUid: perfil.firebaseUid || null,
    name: perfil.name,
    email: perfil.email,
    roleKey: perfil.roleKey,
    roleTitle: perfil.roleTitle,
    role: perfil.role,
    avatarBg: perfil.avatarBg,
    ativo: perfil.ativo !== false,
    updatedAtLocal: new Date().toISOString()
  };
}

function mesclarUsuarioLocal(perfil) {
  const normalizado = normalizarPerfilUsuario(perfil);
  const idx = devflowUsersStore.findIndex(u =>
    (normalizado.firebaseUid && u.firebaseUid === normalizado.firebaseUid) ||
    (normalizado.email && String(u.email || '').toLowerCase() === normalizado.email) ||
    (normalizado.id && u.id === normalizado.id)
  );

  if (idx >= 0) {
    const senhaLocal = devflowUsersStore[idx].password || '';
    devflowUsersStore[idx] = { ...devflowUsersStore[idx], ...normalizado, password: senhaLocal };
    return devflowUsersStore[idx];
  }

  devflowUsersStore.push(normalizado);
  return normalizado;
}

async function aguardarUsuarioFirebaseInicial() {
  if (!firebaseAuthDisponivel()) return null;
  return new Promise(resolve => {
    let resolvido = false;
    const finalizar = user => {
      if (resolvido) return;
      resolvido = true;
      resolve(user || null);
    };

    const timer = setTimeout(() => finalizar(window.auth.currentUser || null), 1800);
    const unsubscribe = window.auth.onAuthStateChanged(user => {
      clearTimeout(timer);
      if (typeof unsubscribe === 'function') unsubscribe();
      finalizar(user);
    }, () => {
      clearTimeout(timer);
      if (typeof unsubscribe === 'function') unsubscribe();
      finalizar(null);
    });
  });
}

async function salvarPerfilUsuarioFirebase(user) {
  if (!firebaseDisponivel() || !user || user.id === 'visitante') return false;
  const perfil = perfilUsuarioParaFirebase(user);
  if (perfil.role === TOOLFLOW_ROLES.LEITURA && (!currentUser || currentUser.role === TOOLFLOW_ROLES.LEITURA)) return false;
  const docId = perfil.firebaseUid || sanitizarDocId(perfil.email || perfil.id);
  try {
    await window.db.collection(FIREBASE_COLLECTIONS.userProfiles).doc(docId).set({
      ...perfil,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[ToolFlow] Falha ao salvar perfil no Firebase:', err);
    return false;
  }
}

async function carregarPerfisUsuariosFirebase() {
  if (!firebaseDisponivel()) return false;
  try {
    const snapshot = await window.db.collection(FIREBASE_COLLECTIONS.userProfiles).get();
    snapshot.forEach(doc => mesclarUsuarioLocal({ id: doc.id, ...doc.data() }));
    if (!snapshot.empty) salvarUsuariosLocais(false);
    return !snapshot.empty;
  } catch (err) {
    console.warn('[ToolFlow] Falha ao carregar perfis do Firebase:', err);
    return false;
  }
}

async function obterPerfilUsuarioFirebase(firebaseUser) {
  if (!firebaseUser) return null;
  const email = String(firebaseUser.email || '').trim().toLowerCase();
  const uid = firebaseUser.uid;

  try {
    const docUid = await window.db.collection(FIREBASE_COLLECTIONS.userProfiles).doc(uid).get();
    if (docUid.exists) {
      return mesclarUsuarioLocal({ id: uid, firebaseUid: uid, ...docUid.data(), email: docUid.data().email || email });
    }

    const queryEmail = await window.db.collection(FIREBASE_COLLECTIONS.userProfiles).where('email', '==', email).limit(1).get();
    if (!queryEmail.empty) {
      const doc = queryEmail.docs[0];
      const perfil = mesclarUsuarioLocal({ id: doc.id, firebaseUid: uid, ...doc.data(), email });
      await salvarPerfilUsuarioFirebase(perfil);
      return perfil;
    }
  } catch (err) {
    console.warn('[ToolFlow] Falha ao consultar perfil Firebase:', err);
  }

  const local = devflowUsersStore.find(u => String(u.email || '').toLowerCase() === email);
  if (local) {
    local.firebaseUid = uid;
    await salvarPerfilUsuarioFirebase(local);
    salvarUsuariosLocais(false);
    return local;
  }

  const perfilLeitura = normalizarPerfilUsuario({
    id: uid,
    firebaseUid: uid,
    name: firebaseUser.displayName || email.split('@')[0] || 'Usuário',
    email,
    roleKey: 'VISITANTE'
  });
  mesclarUsuarioLocal(perfilLeitura);
  salvarUsuariosLocais(false);
  return perfilLeitura;
}

async function tentarLoginFirebase(login, senha) {
  if (!firebaseAuthDisponivel()) return { status: 'skip' };
  const email = montarEmailFirebase(login);
  if (!email) return { status: 'skip' };

  try {
    const cred = await window.auth.signInWithEmailAndPassword(email, senha);
    const perfil = await obterPerfilUsuarioFirebase(cred.user);
    return { status: 'ok', user: perfil };
  } catch (err) {
    const code = err && err.code ? err.code : '';
    const podeFallbackLocal = ['auth/user-not-found', 'auth/invalid-email'].includes(code);
    if (podeFallbackLocal) return { status: 'skip' };
    console.warn('[ToolFlow] Login Firebase recusado:', code || err);
    return { status: 'error', message: 'Login Firebase recusado. Confira e-mail e senha cadastrados no Firebase Authentication.' };
  }
}

function prepararTesteParaFirebase(teste) {
  const clone = JSON.parse(JSON.stringify(teste));
  const anexos = clone?.chaoDeFabrica?.anexosCavaco;
  if (anexos) {
    Object.values(anexos).forEach(anexo => {
      if (anexo && anexo.url) delete anexo.dataUrl;
    });
  }
  return clone;
}

async function salvarDadosFirestore() {
  if (!firebaseDisponivel() || !usuarioPodeEscreverFirebase()) return false;
  if (firebaseSyncEmExecucao) return false;
  firebaseSyncEmExecucao = true;
  try {
    const batch = window.db.batch();
    testDataStore.forEach((teste, index) => {
      const ref = window.db.collection(FIREBASE_COLLECTIONS.tests).doc(sanitizarDocId(teste.id));
      batch.set(ref, {
        id: teste.id,
        ordem: index,
        payload: prepararTesteParaFirebase(teste),
        updatedBy: currentUser.email || currentUser.name || 'sistema',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });
    await batch.commit();
    return true;
  } catch (err) {
    console.warn('[ToolFlow] Falha ao sincronizar testes no Firestore:', err);
    return false;
  } finally {
    firebaseSyncEmExecucao = false;
  }
}

function agendarSyncFirebase() {
  if (!firebaseDisponivel() || !usuarioPodeEscreverFirebase()) return;
  clearTimeout(firebaseSaveTimer);
  firebaseSaveTimer = setTimeout(() => {
    salvarDadosFirestore().catch(err => console.warn('[ToolFlow] Sync Firebase pendente falhou:', err));
  }, 700);
}

async function carregarDadosFirestore() {
  if (!firebaseDisponivel()) return false;
  try {
    const snapshot = await window.db.collection(FIREBASE_COLLECTIONS.tests).get();
    if (snapshot.empty) {
      // Nunca semear automaticamente o Firestore com cache local/demo. Evita visitante regravar testes apagados.
      firebasePrimeiraCargaConcluida = true;
      testDataStore = [];
      currentSelectedTestId = null;
      localStorage.setItem('viemar_toolflow_store_v1', JSON.stringify(testDataStore));
      return true;
    }

    testDataStore = snapshot.docs
      .map(doc => ({ ordem: Number(doc.data().ordem || 0), payload: doc.data().payload }))
      .filter(item => item.payload && item.payload.id)
      .sort((a, b) => a.ordem - b.ordem)
      .map(item => item.payload);

    currentSelectedTestId = testDataStore[0]?.id || null;
    localStorage.setItem('viemar_toolflow_store_v1', JSON.stringify(testDataStore));
    dadosLocaisPersistidos = true;
    firebasePrimeiraCargaConcluida = true;
    return true;
  } catch (err) {
    console.warn('[ToolFlow] Falha ao carregar testes do Firestore:', err);
    return false;
  }
}

async function sincronizarFirebaseAposLogin() {
  if (!firebaseDisponivel() || !currentUser || currentUser.id === 'visitante') return;
  await carregarPerfisUsuariosFirebase();
  await salvarPerfilUsuarioFirebase(currentUser);
  const carregouNuvem = await carregarDadosFirestore();
  if (carregouNuvem) {
    renderizarDashboard();
    renderizarTabelaPipeline();
    renderizarKanban();
    renderizarListaUsuariosCadastrados();
    if (currentSelectedTestId && document.getElementById('viewWorkflow')?.classList.contains('active-view')) {
      abrirDetalhesWorkflow(currentSelectedTestId);
    }
  }
}

async function excluirTesteFirestore(testeId) {
  if (!firebaseDisponivel() || !currentUser || currentUser.id === 'visitante') return;
  try {
    await window.db.collection(FIREBASE_COLLECTIONS.tests).doc(sanitizarDocId(testeId)).delete();
  } catch (err) {
    console.warn('[ToolFlow] Falha ao excluir teste no Firestore:', err);
  }
}

function dataUrlParaBlob(dataUrl) {
  const partes = String(dataUrl || '').split(',');
  const mime = (partes[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
  const binario = atob(partes[1] || '');
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function enviarAnexoFirebaseStorage(testeId, tipo, dataUrl, nomeArquivo) {
  if (!firebaseStorageDisponivel() || !currentUser || currentUser.id === 'visitante') return null;
  try {
    const docId = sanitizarDocId(testeId);
    const nomeSeguro = sanitizarDocId(nomeArquivo || `${tipo}.jpg`);
    const caminho = `toolflow/testes/${docId}/anexos/${Date.now()}_${tipo}_${nomeSeguro}.jpg`;
    const ref = window.storage.ref().child(caminho);
    await ref.put(dataUrlParaBlob(dataUrl), {
      contentType: 'image/jpeg',
      customMetadata: {
        testeId: String(testeId),
        tipo,
        usuario: currentUser.email || currentUser.name || 'sistema'
      }
    });
    const url = await ref.getDownloadURL();
    return { url, storagePath: caminho };
  } catch (err) {
    console.warn('[ToolFlow] Falha ao enviar anexo para Storage. Usando cache local:', err);
    return null;
  }
}

async function removerAnexoFirebaseStorage(storagePath) {
  if (!firebaseStorageDisponivel() || !storagePath) return;
  try {
    await window.storage.ref().child(storagePath).delete();
  } catch (err) {
    console.warn('[ToolFlow] Falha ao remover arquivo do Storage:', err);
  }
}
// =========================================================================
// GERENCIADOR DE TEMA (DARK / LIGHT MODE)
// =========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('viemar_toolflow_theme') || 'light';
  aplicarTema(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  aplicarTema(newTheme);
}

function aplicarTema(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('viemar_toolflow_theme', theme);
  
  // Atualizar graficos com novas cores se já existirem
  if (typeof Chart !== 'undefined' && chartStatusInstance) {
    iniciarGraficos();
  }
}

// =========================================================================
// RESPONSIVIDADE MOBILE & GAVETA LATERAL
// =========================================================================
function toggleMobileSidebar(forceState) {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;

  const isOpen = sidebar.classList.contains('open');
  const shouldOpen = (forceState !== undefined) ? forceState : !isOpen;

  if (shouldOpen) {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
  } else {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  }
}

function atualizarBottomNav(viewId) {
  document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item').forEach(btn => {
    if (btn.getAttribute('data-nav') === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// =========================================================================
// INICIALIZACAO & CICLO DE VIDA
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  inicializarAplicacao();
});

async function inicializarAplicacao() {
  initTheme();
  carregarDadosLocais();
  carregarUsuariosLocais();

  const firebaseUser = await aguardarUsuarioFirebaseInicial();
  if (firebaseUser && firebaseDisponivel()) {
    const perfil = await obterPerfilUsuarioFirebase(firebaseUser);
    if (perfil && perfil.ativo !== false) {
      entrarNoApp(perfil);
      return;
    }
  }

  // Verificar se ha sessao ativa local para fallback/offline
  const sessaoId = localStorage.getItem('viemar_toolflow_current_user_id') || localStorage.getItem('viemar_devflow_current_user_id');
  if (sessaoId) {
    if (sessaoId === 'visitante') {
      entrarComoVisitante();
    } else {
      const user = devflowUsersStore.find(u => u.id === sessaoId || u.firebaseUid === sessaoId);
      if (user) {
        entrarNoApp(user);
      } else {
        mostrarTelaLogin();
      }
    }
  } else {
    mostrarTelaLogin();
  }
}
// =========================================================================
// CONTROLADORES DA TELA DE LOGIN DEDICADA
// =========================================================================
function mostrarTelaLogin() {
  document.getElementById('screenLogin').style.display = 'flex';
  document.getElementById('appShell').style.display = 'none';
}

function normalizarSenhaDigitada(valor) {
  return String(valor || '').trim();
}

function usuarioCorrespondeLogin(user, login) {
  const valor = String(login || '').trim().toLowerCase();
  if (!valor || !user) return false;

  const email = String(user.email || '').trim().toLowerCase();
  const prefixoEmail = email.includes('@') ? email.split('@')[0] : '';

  return email === valor ||
    prefixoEmail === valor ||
    String(user.id || '').trim().toLowerCase() === valor ||
    String(user.name || '').trim().toLowerCase() === valor;
}
async function realizarLoginTela() {
  const emailInput = document.getElementById('loginEmailField').value.trim().toLowerCase();
  const passwordInput = normalizarSenhaDigitada(document.getElementById('loginPasswordField').value);

  if (!emailInput) {
    alert('Por favor, informe seu e-mail corporativo cadastrado.');
    return;
  }

  if (!passwordInput) {
    alert('Por favor, informe sua senha.');
    return;
  }

  const loginFirebase = await tentarLoginFirebase(emailInput, passwordInput);
  if (loginFirebase.status === 'ok' && loginFirebase.user) {
    entrarNoApp(loginFirebase.user);
    return;
  }

  if (loginFirebase.status === 'error') {
    alert(loginFirebase.message || 'Não foi possível autenticar pelo Firebase.');
    return;
  }

  // Fallback local/offline para manter compatibilidade com navegadores antigos
  const user = devflowUsersStore.find(u => usuarioCorrespondeLogin(u, emailInput));

  if (user) {
    if (normalizarSenhaDigitada(user.password) !== passwordInput) {
      alert('Senha incorreta. Verifique a senha digitada ou clique em "Esqueci minha senha" para redefinir.');
      return;
    }

    entrarNoApp(user);
  } else {
    alert('Usuário não encontrado. Confirme se ele foi criado no Firebase Authentication e se o perfil está cadastrado no ToolFlow.');
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

  // Visitante não autentica no Firebase. Para não exibir base demo/cache antiga,
  // sempre inicia em visão limpa e limpa o cache local de testes neste navegador.
  testDataStore = [];
  currentSelectedTestId = null;
  try {
    localStorage.setItem('viemar_toolflow_store_v1', JSON.stringify(testDataStore));
    localStorage.removeItem('viemar_devflow_store_v1');
  } catch (e) {
    console.warn('[ToolFlow] Não foi possível limpar cache local do Visitante:', e);
  }

  entrarNoApp(visitanteUser);
}

function entrarNoApp(user) {
  currentUser = user;
  localStorage.setItem('viemar_toolflow_current_user_id', user.firebaseUid || user.id);

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
  sincronizarFirebaseAposLogin();
}

function fazerLogout() {
  localStorage.removeItem('viemar_toolflow_current_user_id');
  localStorage.removeItem('viemar_devflow_current_user_id');
  if (firebaseAuthDisponivel()) {
    window.auth.signOut().catch(err => console.warn('[ToolFlow] Falha ao encerrar sessão Firebase:', err));
  }
  currentUser = null;
  
  document.getElementById('loginEmailField').value = '';
  document.getElementById('loginPasswordField').value = '';
  mostrarTelaLogin();
}

function esqueciSenha() {
  const email = prompt('Digite seu e-mail cadastrado para redefinir a senha:');
  if (!email) return;

  const user = devflowUsersStore.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    alert('E-mail não encontrado na base de usuários cadastrados.');
    return;
  }

  const novaSenha = prompt(`Olá ${user.name}!\nDigite sua nova senha desejada (mínimo 4 caracteres):`);
  if (!novaSenha) return;
  if (novaSenha.length < 4) {
    alert('A senha deve conter pelo menos 4 caracteres.');
    return;
  }

  user.password = novaSenha;
  salvarUsuariosLocais();
  alert(`Senha redefinida com sucesso para ${user.name}!\nVocê já pode fazer o login com a nova senha.`);
  document.getElementById('loginEmailField').value = user.email;
  document.getElementById('loginPasswordField').value = novaSenha;
}

// =========================================================================
// GOVERNANCA E REGRAS DE PERMISSOES (RBAC)
// =========================================================================
function usuarioSomenteLeitura() {
  return !currentUser || currentUser.role === TOOLFLOW_ROLES.LEITURA;
}

function usuarioAdmin() {
  return currentUser && currentUser.role === TOOLFLOW_ROLES.ADMIN;
}

function usuarioPodeEscreverFirebase() {
  return Boolean(currentUser && currentUser.id !== 'visitante' && currentUser.role !== TOOLFLOW_ROLES.LEITURA);
}

function bloquearMutacaoVisitante() {
  if (!usuarioSomenteLeitura()) return false;
  alert('Perfil Visitante é somente leitura. Faça login com um perfil autorizado para alterar dados.');
  return true;
}

function aplicarBloqueioSomenteLeitura() {
  const isLeitura = usuarioSomenteLeitura();
  document.querySelectorAll('#viewWorkflow input, #viewWorkflow select, #viewWorkflow textarea, #viewUsuarios input, #viewUsuarios select, #viewUsuarios textarea, #modalNovaSolicitacao input, #modalNovaSolicitacao select, #modalNovaSolicitacao textarea').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.readOnly = isLeitura || el.hasAttribute('readonly');
    if (el.tagName === 'SELECT' || el.type === 'file') el.disabled = isLeitura;
    if (isLeitura) el.classList.add('readonly-locked');
    else el.classList.remove('readonly-locked');
  });
}
function aplicarPermissoesUI() {
  const isLeitura = (currentUser.role === TOOLFLOW_ROLES.LEITURA);
  const isAdmin = (currentUser.role === TOOLFLOW_ROLES.ADMIN);
  const isTecnico = (currentUser.role === TOOLFLOW_ROLES.TECNICO);
  const isSolicitante = (currentUser.role === TOOLFLOW_ROLES.SOLICITANTE);

  // Banner Visitante removido da interface operacional.
  const bannerVisitante = document.getElementById('bannerModoVisitante');
  if (bannerVisitante) bannerVisitante.style.display = 'none';

  // Menu de Governança: somente Admin/Engenharia
  document.querySelectorAll('[data-admin-only="true"]').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  if (!isAdmin && document.getElementById('viewUsuarios')?.classList.contains('active-view')) {
    navegarPara('viewDashboard', 'Dashboard & Métricas');
  }
  if (!isAdmin && document.getElementById('viewAuditoria')?.classList.contains('active-view')) {
    navegarPara('viewDashboard', 'Dashboard & Métricas');
  }

  // Botoes de Nova Solicitacao
  const btnTop = document.getElementById('btnNovaSolicitacaoTopbar');
  const btnPipe = document.getElementById('btnNovaSolicitacaoPipeline');
  const btnMobileNovo = document.getElementById('btnMobileNovaSolicitacao');
  if (btnTop) btnTop.style.display = isLeitura ? 'none' : 'flex';
  if (btnPipe) btnPipe.style.display = isLeitura ? 'none' : 'block';
  if (btnMobileNovo) btnMobileNovo.style.display = isLeitura ? 'none' : 'flex';
  document.querySelectorAll('[data-write-only="true"]').forEach(el => {
    el.style.display = isLeitura ? 'none' : '';
  });

  // Botoes do Workflow
  const btnAnalise = document.getElementById('btnSalvarAnaliseEng');
  const btnChao = document.getElementById('btnSalvarChaoFabrica');
  const btnAresta = document.getElementById('btnAdicionarLinhaAresta');
  const btnFech = document.getElementById('btnSalvarFechamento');
  const btnComent = document.getElementById('btnEnviarComentario');

  if (btnAnalise) btnAnalise.style.display = isAdmin ? 'block' : 'none';
  if (btnChao) btnChao.style.display = (isAdmin || isTecnico) ? 'block' : 'none';
  if (btnAresta) btnAresta.style.display = (isAdmin || isTecnico) ? 'inline-block' : 'none';
  if (btnFech) btnFech.style.display = isAdmin ? 'block' : 'none';
  if (btnComent) btnComent.style.display = isLeitura ? 'none' : 'block';

  document.querySelectorAll('.btn-admin-delete').forEach(btn => {
    btn.style.display = isAdmin ? 'inline-flex' : 'none';
  });

  document.querySelectorAll('.btn-remover-anexo').forEach(btn => {
    btn.style.display = isLeitura ? 'none' : 'inline-flex';
  });

  aplicarBloqueioSomenteLeitura();

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
async function criarNovoUsuarioForm() {
  if (bloquearMutacaoVisitante()) return;
  const nomeInput = document.getElementById('novoUserNome');
  const emailInput = document.getElementById('novoUserEmail');
  const senhaInput = document.getElementById('novoUserSenha');
  const papelSelect = document.getElementById('novoUserPapel');

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const senha = normalizarSenhaDigitada(senhaInput.value);
  const papelKey = papelSelect.value;

  if (!nome || !email || !senha) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  if (senha.length < 6) {
    alert('A senha deve possuir no mínimo 6 caracteres.');
    return;
  }

  if (devflowUsersStore.some(u => String(u.email || '').toLowerCase() === email)) {
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
    avatarBg: roleConfig.avatarBg,
    ativo: true
  };

  devflowUsersStore.push(novoUsuario);
  salvarUsuariosLocais();
  const perfilNaNuvem = await salvarPerfilUsuarioFirebase(novoUsuario);

  // Limpar formulário
  nomeInput.value = '';
  emailInput.value = '';
  senhaInput.value = '';
  papelSelect.value = 'TECNICO_USINAGEM';

  renderizarListaUsuariosCadastrados();
  const avisoFirebase = firebaseDisponivel()
    ? (perfilNaNuvem
      ? '\n\nPerfil salvo no Firebase. Para login em outros dispositivos, crie também este e-mail em Firebase Authentication > Users com a senha definida.'
      : '\n\nNão foi possível salvar o perfil no Firebase agora. O cadastro ficou no cache local e poderá ser reenviado depois.')
    : '';
  alert(`Usuário "${nome}" (${roleConfig.label}) cadastrado com sucesso!${avisoFirebase}`);
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
  if (!usuarioAdmin()) { alert('Apenas Administrador pode editar usuários.'); return; }
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
  if (!usuarioAdmin()) { alert('Apenas Administrador pode editar usuários.'); return; }
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
  if (!usuarioAdmin()) { alert('Apenas Administrador pode alterar senhas.'); return; }
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
  if (!usuarioAdmin()) { alert('Apenas Administrador pode alterar senhas.'); return; }
  const userId = document.getElementById('senhaUserId').value;
  const novaSenha = normalizarSenhaDigitada(document.getElementById('novaSenhaInput').value);

  if (!novaSenha || novaSenha.length < 6) {
    alert('A nova senha deve ter no mínimo 6 caracteres.');
    return;
  }

  const user = devflowUsersStore.find(u => u.id === userId || u.firebaseUid === userId);
  if (!user) return;

  user.password = novaSenha;
  salvarUsuariosLocais();
  fecharModalAlterarSenha();

  const msgFirebase = firebaseDisponivel()
    ? '\n\nAtenção: para login em outros dispositivos, atualize a senha desse e-mail também no Firebase Authentication.'
    : '';
  alert(`Senha local de "${user.name}" atualizada com sucesso!${msgFirebase}`);
}
function desativarUsuario(userId) {
  if (!usuarioAdmin()) { alert('Apenas Administrador pode desativar usuários.'); return; }
  const user = devflowUsersStore.find(u => u.id === userId);
  if (!user) return;

  if (currentUser && (currentUser.id === user.id || currentUser.email === user.email)) {
    alert('Você não pode desativar seu próprio usuário em uso.');
    return;
  }

  if (confirm(`Tem certeza que deseja desativar o usuário "${user.name}" (${user.email})?`)) {
    devflowUsersStore = devflowUsersStore.filter(u => u.id !== userId);
    salvarUsuariosLocais();
    salvarPerfilUsuarioFirebase({ ...user, ativo: false });
    renderizarListaUsuariosCadastrados();
    alert(`Usuário "${user.name}" desativado com sucesso.`);
  }
}

// =========================================================================
// GESTAO DE NAVEGACAO E VIEWS (SPA)
// =========================================================================
function navegarPara(viewId, breadcrumbLabel) {
  if ((viewId === 'viewUsuarios' || viewId === 'viewAuditoria') && !usuarioAdmin()) {
    alert('Acesso restrito ao perfil Administrador.');
    viewId = 'viewDashboard';
    breadcrumbLabel = 'Dashboard & Métricas';
  }

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

  // Sincronizar barra mobile inferior e fechar gaveta lateral
  atualizarBottomNav(viewId);
  toggleMobileSidebar(false);

  if (viewId === 'viewKanban') renderizarKanban();
  aplicarPermissoesUI();

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

function calcularEconomiaAnualFornecedor() {
  const economiaPorFornecedor = new Map();

  testDataStore.forEach(teste => {
    const s = teste.solicitacao || {};
    const fornecedor = String(s.fornecedor || 'Fornecedor não informado').trim();
    const custoAtual = Number(s.custoAtual) || 0;
    const custoProposto = Number(s.precoTeste) || 0;
    const vidaAtual = Number(s.vidaAtual) || 0;
    const vidaProposta = Number(s.metaVida) || 0;
    const giroMensal = Number(s.giroMensal) || 0;

    if (!fornecedor || custoAtual <= 0 || custoProposto <= 0 || vidaAtual <= 0 || vidaProposta <= 0 || giroMensal <= 0) return;

    const custoPorPecaAtual = custoAtual / vidaAtual;
    const custoPorPecaProposto = custoProposto / vidaProposta;
    const economiaAnual = Math.max(0, (custoPorPecaAtual - custoPorPecaProposto) * giroMensal * 12);

    if (economiaAnual <= 0) return;
    economiaPorFornecedor.set(fornecedor, (economiaPorFornecedor.get(fornecedor) || 0) + economiaAnual);
  });

  return Array.from(economiaPorFornecedor.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([fornecedor, economia]) => ({ fornecedor, economia: Math.round(economia) }));
}
function iniciarGraficos() {
  const ctxStatus = document.getElementById('chartStatus');
  const ctxSavings = document.getElementById('chartSavings');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const doughnutBorder = isDark ? '#1e293b' : '#ffffff';

  if (ctxStatus && typeof Chart !== 'undefined') {
    if (chartStatusInstance) chartStatusInstance.destroy();
    
    const emAnalise = testDataStore.filter(t => t.stage === 'STAGE_1_SOLICITACAO' || t.stage === 'STAGE_2_ANALISE').length;
    const emFabrica = testDataStore.filter(t => t.stage === 'STAGE_3_AGENDAMENTO' || t.stage === 'STAGE_4_EXECUCAO').length;
    const homologados = testDataStore.filter(t => t.statusGeral === 'HOMOLOGADO').length;
    const bloqueados = testDataStore.filter(t => t.statusGeral === 'BLOQUEADO_ESTOQUE').length;

    chartStatusInstance = new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: ['Em Análise', 'Em Teste Fábrica', 'Homologados', 'Bloqueado Estoque'],
        datasets: [{
          data: [emAnalise, emFabrica, homologados, bloqueados],
          backgroundColor: ['#3b82f6', '#ff6600', '#10b981', '#f59e0b'],
          borderWidth: 2,
          borderColor: doughnutBorder
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom', 
            labels: { 
              boxWidth: 12, 
              color: textColor,
              font: { size: 11, family: 'Inter, sans-serif' } 
            } 
          }
        }
      }
    });
  }

  if (ctxSavings && typeof Chart !== 'undefined') {
    if (chartSavingsInstance) chartSavingsInstance.destroy();
    const economiaFornecedor = calcularEconomiaAnualFornecedor();
    const labelsEconomia = economiaFornecedor.length ? economiaFornecedor.map(item => item.fornecedor) : ['Sem dados'];
    const dadosEconomia = economiaFornecedor.length ? economiaFornecedor.map(item => item.economia) : [0];

    chartSavingsInstance = new Chart(ctxSavings, {
      type: 'bar',
      data: {
        labels: labelsEconomia,
        datasets: [{
          label: 'Economia Estimada (R$ / Ano)',
          data: dadosEconomia,
          backgroundColor: economiaFornecedor.length ? '#ff6600' : 'rgba(148, 163, 184, 0.35)',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: economiaFornecedor.length ? undefined : 1,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 10, family: 'Inter, sans-serif' } }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 10, family: 'Inter, sans-serif' } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: economiaFornecedor.length > 0 }
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
  const mobileCardsContainer = document.getElementById('mobilePipelineCards');
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
  if (mobileCardsContainer) mobileCardsContainer.innerHTML = '';

  if (paginaItens.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum teste encontrado para os filtros aplicados.</td></tr>`;
    if (mobileCardsContainer) {
      mobileCardsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum teste encontrado.</div>`;
    }
  } else {
    paginaItens.forEach(t => {
      let badgeStatusClass = 'badge-blue';
      if (t.statusGeral === 'HOMOLOGADO') badgeStatusClass = 'badge-green';
      else if (t.statusGeral === 'BLOQUEADO_ESTOQUE') badgeStatusClass = 'badge-amber';
      else if (t.statusGeral === 'REPROVADO') badgeStatusClass = 'badge-red';

      // 1. Linha da tabela desktop
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="ID Teste"><strong>${t.id}</strong></td>
        <td data-label="Peça / Código">
          <div style="font-weight: 600; color: var(--text-main);">${t.solicitacao.descricaoPeca}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${t.solicitacao.codigoPeca}</div>
        </td>
        <td data-label="Fornecedor">${t.solicitacao.fornecedor}</td>
        <td data-label="Máquina CNC">${t.solicitacao.maquina}</td>
        <td data-label="Etapa"><span class="badge ${WORKFLOW_STAGES[t.stage]?.badgeClass || 'badge-gray'}">${WORKFLOW_STAGES[t.stage]?.label || t.stage}</span></td>
        <td data-label="Status"><span class="badge ${badgeStatusClass}">${formatarStatusVisual(t.statusGeral)}</span></td>
        <td data-label="Ações" style="text-align: right;">
          <div class="table-action-row">
            <button class="btn btn-secondary btn-sm" onclick="abrirDetalhesWorkflow('${t.id}')">Acessar</button>
            ${usuarioAdmin() ? `<button class="btn btn-danger btn-sm btn-admin-delete" onclick="excluirTeste('${t.id}')">Excluir</button>` : ''}
          </div>
        </td>
      `;
      tbody.appendChild(tr);

      // 2. Card mobile
      if (mobileCardsContainer) {
        const card = document.createElement('div');
        card.className = 'mobile-pipeline-card';
        card.innerHTML = `
          <div class="mobile-card-header">
            <span class="mobile-card-id">${t.id}</span>
            <span class="badge ${badgeStatusClass}">${formatarStatusVisual(t.statusGeral)}</span>
          </div>
          <div class="mobile-card-title">${t.solicitacao.descricaoPeca}</div>
          <div class="mobile-card-detail"><strong>Código:</strong> ${t.solicitacao.codigoPeca || '-'}</div>
          <div class="mobile-card-detail"><strong>Fornecedor:</strong> ${t.solicitacao.fornecedor}</div>
          <div class="mobile-card-detail"><strong>Máquina:</strong> ${t.solicitacao.maquina}</div>
          <div class="mobile-card-detail"><strong>Etapa:</strong> <span class="badge ${WORKFLOW_STAGES[t.stage]?.badgeClass || 'badge-gray'}">${WORKFLOW_STAGES[t.stage]?.label || t.stage}</span></div>
          <div class="mobile-card-actions">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="abrirDetalhesWorkflow('${t.id}')">Acessar Teste</button>
            ${usuarioAdmin() ? `<button class="btn btn-danger btn-sm btn-admin-delete" onclick="excluirTeste('${t.id}')">Excluir</button>` : ''}
          </div>
        `;
        mobileCardsContainer.appendChild(card);
      }
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

function obterColunaKanban(teste) {
  if (teste.stage === 'STAGE_1_SOLICITACAO') return 'kanbanColSolicitacao';
  if (teste.stage === 'STAGE_2_ANALISE') return 'kanbanColAnalise';
  if (teste.stage === 'STAGE_3_AGENDAMENTO' || teste.stage === 'STAGE_4_EXECUCAO') return 'kanbanColFabrica';
  return 'kanbanColValidacao';
}

function criarCardKanban(teste) {
  const stage = WORKFLOW_STAGES[teste.stage] || { label: teste.stage, badgeClass: 'badge-gray' };
  const badgeStatusClass = teste.statusGeral === 'HOMOLOGADO' ? 'badge-green' :
    teste.statusGeral === 'BLOQUEADO_ESTOQUE' ? 'badge-amber' :
    teste.statusGeral === 'REPROVADO' ? 'badge-red' : 'badge-blue';

  return `
    <div class="kanban-card">
      <div class="kanban-card-top">
        <strong>${teste.id}</strong>
        <span class="badge ${stage.badgeClass}">${stage.label}</span>
      </div>
      <div class="kanban-card-title">${teste.solicitacao.descricaoPeca}</div>
      <div class="kanban-card-meta">${teste.solicitacao.codigoPeca || '-'} · ${teste.solicitacao.fornecedor}</div>
      <div class="kanban-card-meta">${teste.solicitacao.maquina || '-'}</div>
      <div class="kanban-card-footer">
        <span class="badge ${badgeStatusClass}">${formatarStatusVisual(teste.statusGeral)}</span>
        <div class="kanban-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="abrirDetalhesWorkflow('${teste.id}')">Acessar</button>
          ${usuarioAdmin() ? `<button class="btn btn-danger btn-sm btn-admin-delete" onclick="excluirTeste('${teste.id}')">Excluir</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderizarKanban() {
  const colunas = {
    kanbanColSolicitacao: [],
    kanbanColAnalise: [],
    kanbanColFabrica: [],
    kanbanColValidacao: []
  };

  testDataStore.forEach(teste => {
    const coluna = obterColunaKanban(teste);
    colunas[coluna].push(teste);
  });

  Object.entries(colunas).forEach(([idColuna, itens]) => {
    const el = document.getElementById(idColuna);
    if (!el) return;
    el.innerHTML = itens.length
      ? itens.map(criarCardKanban).join('')
      : '<div class="kanban-empty">Nenhum teste nesta etapa.</div>';
  });

  const contadores = {
    kanbanCountSolicitacao: colunas.kanbanColSolicitacao.length,
    kanbanCountAnalise: colunas.kanbanColAnalise.length,
    kanbanCountFabrica: colunas.kanbanColFabrica.length,
    kanbanCountValidacao: colunas.kanbanColValidacao.length
  };

  Object.entries(contadores).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  });

  aplicarPermissoesUI();
}

function excluirTeste(testeId) {
  if (!usuarioAdmin()) {
    alert('Apenas Administrador pode apagar cadastros de teste.');
    return;
  }

  const teste = testDataStore.find(t => t.id === testeId);
  if (!teste) return;

  const descricao = `${teste.id} - ${teste.solicitacao.descricaoPeca}`;
  if (!confirm(`Confirmar exclusão definitiva do cadastro de teste?\n\n${descricao}\n\nEssa ação remove o teste do pipeline local deste aplicativo.`)) return;

  testDataStore = testDataStore.filter(t => t.id !== testeId);
  if (currentSelectedTestId === testeId) currentSelectedTestId = null;

  salvarDadosLocais();
  excluirTesteFirestore(testeId);
  renderizarDashboard();
  renderizarTabelaPipeline();
  renderizarKanban();

  if (document.getElementById('viewWorkflow')?.classList.contains('active-view')) {
    navegarPara('viewPipeline', 'Pipeline de Testes');
  }

  alert(`Cadastro ${teste.id} apagado com sucesso.`);
}
// =========================================================================
// WORKFLOW DE 4 ETAPAS (DETALHES E EDICAO)
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

function obterEtapasConcluidasWorkflow(teste) {
  const concluidas = new Set();
  if (!teste) return concluidas;

  if (teste.solicitacao) concluidas.add(1);

  const decisaoEngenharia = teste.analiseEngenharia?.decisao;
  if (decisaoEngenharia === 'APROVADO' || decisaoEngenharia === 'REPROVADO') concluidas.add(2);

  if (teste.stage === 'STAGE_5_VALIDACAO' || ['HOMOLOGADO', 'BLOQUEADO_ESTOQUE'].includes(teste.statusGeral)) {
    concluidas.add(2);
    concluidas.add(4);
  }

  if (['HOMOLOGADO', 'BLOQUEADO_ESTOQUE', 'REPROVADO'].includes(teste.statusGeral) && teste.fechamento?.dataFechamento) {
    concluidas.add(5);
  }

  return concluidas;
}

function normalizarEtapaVisualWorkflow(etapaNum) {
  return etapaNum === 3 ? 4 : etapaNum;
}

function alternarAbaWorkflow(etapaNum) {
  const etapaVisual = normalizarEtapaVisualWorkflow(etapaNum);
  const testeAtual = testDataStore.find(t => t.id === currentSelectedTestId);
  const etapasConcluidas = obterEtapasConcluidasWorkflow(testeAtual);

  for (let i = 1; i <= 5; i++) {
    const tab = document.getElementById(`wfTabContent_${i}`);
    if (tab) tab.style.display = (i === etapaVisual) ? 'block' : 'none';
  }

  WORKFLOW_VISIBLE_STEPS.forEach(stepNum => {
    const step = document.getElementById(`wfStep_${stepNum}`);
    if (!step) return;

    step.classList.toggle('active', stepNum === etapaVisual);
    step.classList.toggle('completed', etapasConcluidas.has(stepNum));
  });

  aplicarBloqueioSomenteLeitura();
}

function formatarStatusVisual(valor) {
  return (valor || '')
    .toString()
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

  // Etapa 3: Chao de Fabrica
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
  renderizarAnexosCavaco(cf.anexosCavaco || {});
  document.getElementById('wfCfTotalPecas').textContent = cf.totalPecas || 0;
  document.getElementById('wfCfVidaMedia').textContent = cf.vidaMediaAresta || 0;
  document.getElementById('wfCfVariacao').textContent = cf.variacaoVidaPorc || '+0.0%';

  // Etapa 4: Fechamento & Estoque
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

const ANEXOS_CAVACO_CONFIG = {
  cavacoAtual: {
    label: 'Foto do cavaco atual',
    inputId: 'wfAnexoCavacoAtual',
    previewId: 'wfPreviewCavacoAtual'
  },
  cavacoNovaFerramenta: {
    label: 'Foto do cavaco com nova ferramenta',
    inputId: 'wfAnexoCavacoNovo',
    previewId: 'wfPreviewCavacoNovo'
  },
  anexoExtra: {
    label: 'Outro anexo de imagem',
    inputId: 'wfAnexoCavacoExtra',
    previewId: 'wfPreviewCavacoExtra'
  }
};

function obterTesteAtualWorkflow() {
  return testDataStore.find(t => t.id === currentSelectedTestId);
}

function obterAnexosCavaco(teste) {
  if (!teste.chaoDeFabrica) teste.chaoDeFabrica = { parametros: {}, registrosArestas: [] };
  if (!teste.chaoDeFabrica.anexosCavaco) teste.chaoDeFabrica.anexosCavaco = {};
  return teste.chaoDeFabrica.anexosCavaco;
}

function limparInputsAnexosCavaco() {
  Object.values(ANEXOS_CAVACO_CONFIG).forEach(cfg => {
    const input = document.getElementById(cfg.inputId);
    if (input) input.value = '';
  });
}

function renderizarAnexosCavaco(anexos = {}) {
  Object.entries(ANEXOS_CAVACO_CONFIG).forEach(([tipo, cfg]) => {
    const preview = document.getElementById(cfg.previewId);
    if (!preview) return;

    const anexo = anexos[tipo];
    const src = anexo?.url || anexo?.dataUrl;
    if (src) {
      preview.classList.add('has-image');
      preview.innerHTML = `
        <img src="${src}" alt="${cfg.label}">
        <div class="chip-preview-meta">
          <strong>${cfg.label}</strong>
          <span>${anexo.nome || 'imagem anexada'} · ${anexo.usuario || 'Sistema'}</span>
        </div>
      `;
    } else {
      preview.classList.remove('has-image');
      preview.innerHTML = '<span>Nenhuma imagem anexada.</span>';
    }
  });

  limparInputsAnexosCavaco();
  aplicarBloqueioSomenteLeitura();
}
function lerArquivoComoDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function carregarImagem(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function compactarImagemAnexo(file) {
  const dataUrlOriginal = await lerArquivoComoDataUrl(file);
  const img = await carregarImagem(dataUrlOriginal);
  let maxWidth = 900;
  let qualidade = 0.68;

  for (let tentativa = 0; tentativa < 7; tentativa++) {
    const scale = Math.min(1, maxWidth / img.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', qualidade);
    if (dataUrl.length <= ANEXO_FIRESTORE_MAX_CHARS) return dataUrl;

    maxWidth = Math.max(520, Math.round(maxWidth * 0.82));
    qualidade = Math.max(0.42, qualidade - 0.06);
  }

  throw new Error('ANEXO_MUITO_GRANDE_FIRESTORE');
}

async function processarAnexoCavaco(tipo, input) {
  if (bloquearMutacaoVisitante()) {
    if (input) input.value = '';
    return;
  }

  const cfg = ANEXOS_CAVACO_CONFIG[tipo];
  const file = input?.files?.[0];
  if (!cfg || !file) return;

  if (!file.type.startsWith('image/')) {
    alert('Anexe apenas arquivos de imagem para as evidências do cavaco.');
    input.value = '';
    return;
  }

  const maxSizeMb = 8;
  if (file.size > maxSizeMb * 1024 * 1024) {
    alert(`Imagem muito grande. Use uma foto de até ${maxSizeMb} MB.`);
    input.value = '';
    return;
  }

  const teste = obterTesteAtualWorkflow();
  if (!teste) return;

  try {
    const dataUrl = await compactarImagemAnexo(file);
    const uploadFirebase = await enviarAnexoFirebaseStorage(teste.id, tipo, dataUrl, file.name);
    const anexos = obterAnexosCavaco(teste);
    anexos[tipo] = {
      nome: file.name,
      tipo: 'image/jpeg',
      tamanhoOriginal: file.size,
      registradoEm: new Date().toISOString(),
      usuario: currentUser ? currentUser.name : 'Sistema',
      dataUrl: uploadFirebase ? null : dataUrl,
      url: uploadFirebase ? uploadFirebase.url : null,
      storagePath: uploadFirebase ? uploadFirebase.storagePath : null
    };

    registrarTimeline(teste, 'Evidência fotográfica anexada', `${cfg.label} registrada por ${currentUser ? currentUser.name : 'Sistema'}.`);
    salvarDadosLocais();
    renderizarAnexosCavaco(anexos);
    renderizarTimeline(teste);
  } catch (e) {
    console.error(e);
    if (e && e.message === 'ANEXO_MUITO_GRANDE_FIRESTORE') {
      alert('A foto ficou grande demais para salvar sem Firebase Storage. Tente cortar a imagem ou enviar uma foto mais simples.');
    } else {
      alert('Não foi possível anexar a imagem. Tente outra foto ou um arquivo menor.');
    }
  }
}

async function removerAnexoCavaco(tipo) {
  if (bloquearMutacaoVisitante()) return;

  const cfg = ANEXOS_CAVACO_CONFIG[tipo];
  const teste = obterTesteAtualWorkflow();
  if (!cfg || !teste) return;

  const anexos = obterAnexosCavaco(teste);
  if (!anexos[tipo]) return;
  if (!confirm(`Remover ${cfg.label.toLowerCase()} deste teste?`)) return;

  const storagePath = anexos[tipo].storagePath;
  delete anexos[tipo];
  await removerAnexoFirebaseStorage(storagePath);
  registrarTimeline(teste, 'Evidência fotográfica removida', `${cfg.label} removida por ${currentUser ? currentUser.name : 'Sistema'}.`);
  salvarDadosLocais();
  renderizarAnexosCavaco(anexos);
  renderizarTimeline(teste);
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
      <td data-label="Aresta"><strong>${r.aresta}</strong></td>
      <td data-label="Turno">${r.turno}</td>
      <td data-label="Técnico">${r.tecnico}</td>
      <td data-label="Peças usinadas"><strong>${r.pecas} pe\u00E7as</strong></td>
      <td data-label="Rugosidade (RA)">${r.ra}</td>
      <td data-label="Desgaste">${r.desgaste}</td>
    `;
    tbody.appendChild(tr);
  });
}

function adicionarLinhaAresta() {
  if (bloquearMutacaoVisitante()) return;
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
  if (bloquearMutacaoVisitante()) return;
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
    teste.stage = 'STAGE_4_EXECUCAO';
    teste.statusGeral = 'EM_TESTE_FABRICA';
    registrarTimeline(teste, 'Viabilidade Aprovada (GO)', `Engenharia deu aceite. Solicitante responsável por agendar/conferir e teste liberado para fábrica.`);
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

function salvarChaoDeFabrica() {
  if (bloquearMutacaoVisitante()) return;
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
  if (bloquearMutacaoVisitante()) return;
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
  if (bloquearMutacaoVisitante()) return;
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
// MODAL DE NOVA SOLICITAÇÃO
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
  if (bloquearMutacaoVisitante()) return;
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
  if (bloquearMutacaoVisitante()) return;
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
      { dataHora: `${hoje} 08:00`, usuario: solicitanteNome, acao: 'Solicita\u00E7\u00E3o Criada', detalhe: 'Aguardando avalia\u00E7\u00E3o da Engenharia.' }
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
                `* Status Geral: ${formatarStatusVisual(teste.statusGeral)}\n` +
                `Acompanhamento no Portal de Testes Viemar.`;

  navigator.clipboard.writeText(texto).then(() => {
    alert('Resumo do workflow copiado com padr\u00E3o Viemar para a \u00E1rea de transfer\u00EAncia!');
  });
}

// =========================================================================
// PERSISTENCIA LOCAL / FIREBASE / USUARIOS / SESSAO
// =========================================================================
function salvarDadosLocais(dispararSync = true) {
  try {
    localStorage.setItem('viemar_toolflow_store_v1', JSON.stringify(testDataStore));
    dadosLocaisPersistidos = true;
    if (dispararSync) agendarSyncFirebase();
  } catch (e) {
    console.error(e);
    alert('Não foi possível salvar os dados locais. Remova anexos muito grandes ou libere espaço do navegador.');
    throw e;
  }
}

function carregarDadosLocais() {
  const salvos = localStorage.getItem('viemar_toolflow_store_v1') || localStorage.getItem('viemar_devflow_store_v1');
  if (salvos) {
    dadosLocaisPersistidos = true;
    try {
      testDataStore = JSON.parse(salvos);
      currentSelectedTestId = testDataStore[0]?.id || null;
    } catch (e) {
      console.error(e);
    }
  }
}

function salvarUsuariosLocais(dispararSync = true) {
  localStorage.setItem('viemar_toolflow_users_v3', JSON.stringify(devflowUsersStore));
  usuariosLocaisPersistidos = true;
  if (dispararSync && firebaseDisponivel() && usuarioPodeEscreverFirebase()) {
    devflowUsersStore.forEach(user => salvarPerfilUsuarioFirebase(user));
  }
}

function carregarUsuariosLocais() {
  // Limpar chave antiga v2 para forcar migracao
  localStorage.removeItem('viemar_toolflow_users_v2');

  const salvos = localStorage.getItem('viemar_toolflow_users_v3');
  if (salvos) {
    usuariosLocaisPersistidos = true;
    try {
      devflowUsersStore = JSON.parse(salvos).map(normalizarPerfilUsuario);
    } catch (e) {
      console.error(e);
      devflowUsersStore = [...INITIAL_USERS_STORE];
    }
  } else {
    devflowUsersStore = [...INITIAL_USERS_STORE];
    salvarUsuariosLocais(false);
  }
}