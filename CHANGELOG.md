# Changelog - Viemar ToolFlow | Gestao de Testes de Usinagem

Todas as alteracoes e evolucoes deste projeto seguem rigorosamente o versionamento SemVer e a governanca do `.agents/AGENTS.md`.

---

## [v1.2.0] - 2026-08-04

### Adicionado
- **Nova Tela de Login Dedicada no Padrão Viemar Automotive**:
  - Interface limpa e centralizada com logotipo Viemar, identificador ToolFlow, tag de versão e subtítulo *Engenharia de Processos · VMR*.
  - Campos de entrada: `E-MAIL` e `SENHA` estilizados.
  - Botão principal **Entrar** em Laranja Viemar (`#ff6600`).
  - Botão secundário **Entrar como visitante** (acesso instantâneo sem necessidade de login prévio).
  - Links de rodapé: **Esqueci minha senha** e **Primeiro acesso (admin)** para autofill rápido do Administrador.
- **Modo Visitante (Somente Leitura)**:
  - Banner informativo persistente no topo da tela.
  - Bloqueio e ocultação automática de botões de edição, criação de solicitações, pareceres da engenharia e apontamentos de fábrica.
  - Formulários protegidos em modo consulta.
- **Governança de Usuários e Gestão de Logins pelo Admin**:
  - Exclusividade do Administrador (Engenharia ADM) para cadastrar e gerenciar novos logins para a equipe (`Filipe 1ºT`, `Charles 2ºT`, `Preset`, `Fornecedores`).
  - Botão de logout no rodapé da Sidebar para retorno imediato à tela de login.

### Alterado
- Incremento de versão para `v1.2.0` na Sidebar, Topbar, cabeçalho de login e relatórios técnicos.
- Backup de segurança criado em `backups/v1.1.1_to_v1.2.0/`.

---

## [v1.1.1] - 2026-08-04

### Alterado
- **Renomeação Oficial do Sistema para ToolFlow Viemar**:
  - Nova nomenclatura aplicada em toda a interface: **Viemar ToolFlow - Gestão e Governança de Ferramentas**.
  - Atualização do título da página, Sidebar, Topbar de navegação, cabeçalhos de impressão e modais de autenticação.
  - Atualização das chaves de persistência no `localStorage` com retrocompatibilidade (`viemar_toolflow_store_v1` e `viemar_toolflow_users_v1`).
  - Atualização do formato de exportação para compartilhamento WhatsApp (`[VIEMAR TOOLFLOW - STATUS TESTE...]`).
  - Atualização dos arquivos [`index.html`](file:///q:/02%20ENGENHARIA%20DE%20USINAGEM/37%20-%20TESTES%20DE%20FERRAMENTAS/index.html) raiz e [`README.md`](file:///q:/02%20ENGENHARIA%20DE%20USINAGEM/37%20-%20TESTES%20DE%20FERRAMENTAS/README.md).
- **Governanca**:
  - Backup de segurança criado em `backups/v1.1.0_to_v1.1.1/`.
  - Tag de versão `v1.1.1` criada no Git.

---

## [v1.1.0] - 2026-08-04

### Adicionado
- **Configuração de Deploy para a Vercel**:
  - Criação do `vercel.json` para roteamento limpo de Single Page Application.
  - Criação do `index.html` raiz para redirecionamento transparente.
  - Criação do guia completo de deploy em [`README.md`](file:///q:/02%20ENGENHARIA%20DE%20USINAGEM/37%20-%20TESTES%20DE%20FERRAMENTAS/README.md).
- **Módulo Completo de Autenticação e Cadastro Multi-Usuário (Login & Sign Up)**:
  - Aba de **Entrar** (Login por e-mail ou seleção rápida de membros da equipe).
  - Aba de **Cadastrar Novo Usuário** (Permite que colaboradores em diferentes máquinas ou celulares criem seus próprios logins).
  - Seleção de papel/cargo no cadastro (`Engenharia ADM`, `Tecnico 1oT`, `Tecnico 2oT`, `Preset`, `Gerenciador/Fornecedor`, `Leitura`).
  - Persistência sincronizada de novos usuários e controle de sessão ativa.
- **Refinamento de Layout & Eliminação de Sobreposições**:
  - Stepper de 5 etapas com grid responsivo e quebra fluida para evitar achatamento.
  - Correção de proporções nos gráficos Chart.js com contêineres dimensionados e `destroy()` preventivo ao redesenhar.
  - Ajuste de margens, paddings e rolagem interna no conteúdo principal (`app-main`) para garantir visualização perfeita em qualquer resolução de tela.

### Alterado
- Incremento de versão para `v1.1.0` visível na Sidebar e cabeçalhos de relatórios.
- Backup completo da versão anterior criado em `backups/v1.0.0_to_v1.1.0/`.

---

## [v1.0.0] - 2026-08-04

### Adicionado
- **Arquitetura DevFlow**: Estrutura SPA completa com HTML5, Vanilla JS modular, TailwindCSS via CDN e Chart.js.
- **Identidade Visual Viemar**: Layout limpo, sidebar lateral com logotipo oficial da Viemar e badge de versao `v1.0.0`, cores corporativas (tons de cinza e laranja Viemar `#ff6600`), com zero emojis.
- **Sistema de Controle de Acesso (RBAC)**:
  - `Admin`: Engenharia ADM (Oscar, Jonathan, Ponto Focal) - Acesso total a avaliacoes, laudos, custos e travas de estoque.
  - `Tecnico`: Chao de Fabrica (Filipe 1oT, Charles 2oT) - Registro de parametros CNC, arestas, rugosidade e desgaste.
  - `Solicitante`: Preset, Gerenciador Externo, Fornecedores - Abertura D-2 e visualizacao em tempo real (modo somente leitura).
  - `Leitura`: Visitante / Consulta geral.
- **Workflow Linear de 5 Etapas**:
  - `1. Solicitacao (D-2)`: Abertura formal com calculo de ganho de vida util e lead time.
  - `2. Analise Engenharia`: Avaliacao de viabilidade GO / NO-GO com devolutiva registrada.
  - `3. Agendamento Visita`: Confirmacao da quinta-feira quinzenal e preparacao do Preset.
  - `4. Teste em Maquina`: Acompanhamento de turnos, pecas usinadas, $Ra$ e $VB$.
  - `5. Validacao & Estoque`: Calculo de CPP, economia anual e Trava Obrigatoria de Abastecimento (Lead Time vs Estoque Antigo).
- **Dashboard com Graficos (Chart.js)**:
  - Grafico de distribuicao de status dos testes.
  - Grafico de economia projetada por fornecedor.
- **Recursos Interativos**:
  - Tabela filtrável com busca dinamica e paginacao.
  - Linha do tempo / Historico de auditoria em tempo real para cada teste.
  - Aba de comentarios e anotacoes tecnicas por teste.
  - Exportacao para impressao e PDF oficial em folha A4 com cabecalho Viemar.
  - Integracao preparada com Google Firebase (Auth & Firestore) com fallback seguro para cache local.
