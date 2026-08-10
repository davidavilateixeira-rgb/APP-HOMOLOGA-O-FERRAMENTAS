# Changelog - Viemar ToolFlow | Gestao de Testes de Usinagem

Todas as alteracoes e evolucoes deste projeto seguem rigorosamente o versionamento SemVer e a governanca do `.agents/AGENTS.md`.

---

## [v1.8.5] - 2026-08-10

### Corrigido
- Gráfico **Economia Anual Projetada por Homologação** deixa de usar fornecedores e valores fixos de demonstração.
- Economia anual passa a ser calculada somente a partir dos testes reais cadastrados, usando custo atual/proposto, vida atual/proposta e giro mensal.
- Quando não houver testes com dados suficientes, o gráfico exibe estado vazio em vez de valores fictícios.

### Backup
- Backup da versão anterior salvo em `backups/v1.8.4_to_v1.8.5/` antes das alterações.
## [v1.8.4] - 2026-08-10

### Corrigido
- Botões de **Nova Solicitação** passam a ficar ocultos para o perfil Visitante em todas as áreas da tela, incluindo Dashboard, Pipeline, Topbar e navegação mobile.
- Removida a faixa/mensagem de **Modo Visitante (Somente Leitura)** da interface operacional.

### Backup
- Backup da versão anterior salvo em `backups/v1.8.3_to_v1.8.4/` antes das alterações.
## [v1.8.3] - 2026-08-10

### Corrigido
- Entrada como Visitante passa a limpar o cache local de testes e exibir base vazia, evitando reaparecimento dos 3 testes demo/antigos em navegadores com `localStorage` antigo.
- Menu **Configuração & Governança**, incluindo **Usuários** e **Auditoria Global**, passa a ficar visível apenas para perfil Admin/Engenharia.
- Adicionada proteção de navegação para impedir acesso manual às abas de Usuários/Auditoria por perfis não-admin.

### Backup
- Backup da versão anterior salvo em `backups/v1.8.2_to_v1.8.3/` antes das alterações.
## [v1.8.2] - 2026-08-10

### Corrigido
- Corrigida a sincronização Firebase para impedir que perfil Visitante/somente leitura escreva dados no Firestore.
- Removido o auto-seed do Firestore a partir de cache local/demo quando a coleção de testes está vazia, evitando retorno de testes antigos já apagados.
- Endurecidas funções administrativas e de cadastro para validar permissão no código, além de esconder botões na interface.
- Bloqueio de campos somente leitura passa a cobrir também o modal de nova solicitação.

### Investigação
- Causa dos 3 testes reaparecerem: usuário autenticado sem perfil Firestore recebia papel Visitante, mas a rotina de sync checava apenas se o ID era diferente de `visitante`; com isso, cache local podia semear a nuvem.
- Causa do `fgvieira` entrar como Visitante: o usuário foi criado no Firebase Authentication, mas ainda não havia documento de perfil/papel correspondente em `toolflow_user_profiles`.

### Backup
- Backup da versão anterior salvo em `backups/v1.8.1_to_v1.8.2/` antes das alterações.
## [v1.8.1] - 2026-08-10

### Corrigido
- Ajustado o modo Firebase para operar sem Firebase Storage pago/Blaze.
- Anexos de imagem da Etapa 3 passam a ser compactados com limite para armazenamento via Firestore/cache local.
- Removida a dependência prática do SDK de Storage no carregamento da aplicação.

### Alterado
- Atualizada a versão visível do sistema para v1.8.1.
- Firebase permanece usando Authentication + Firestore como fonte principal multi-dispositivo.

### Observação
- Sem Firebase Storage, imagens muito grandes podem ser recusadas para evitar exceder o limite de documento do Firestore. Para fotos em alta resolução e muitos anexos por teste, o ideal futuro continua sendo ativar Storage.

### Backup
- Backup da versão anterior salvo em `backups/v1.8.0_to_v1.8.1/` antes das alterações.
## [v1.8.0] - 2026-08-10

### Adicionado
- Integração real com Firebase usando a configuração do projeto `viemar-tool-flow`.
- Login preferencial via Firebase Authentication com e-mail/senha, mantendo fallback local/offline para compatibilidade.
- Sincronização dos cadastros de teste no Cloud Firestore pela coleção `toolflow_tests`.
- Sincronização de perfis de usuários no Firestore pela coleção `toolflow_user_profiles`, sem publicar senhas no banco.
- Upload de anexos de imagem da Etapa 3 no Firebase Storage quando disponível, mantendo cache local apenas como fallback.
- Exclusão remota do cadastro no Firestore quando Admin apaga um teste no pipeline.

### Alterado
- Atualizada a versão visível do sistema para v1.8.0.
- Atualizado `firebase-config.js` com a configuração real enviada para o projeto Firebase.
- Adicionado carregamento do SDK `firebase-storage-compat.js` no HTML.
- Cadastro de usuários agora salva o perfil na nuvem e orienta criar o usuário correspondente no Firebase Authentication.
- Alteração de senha local agora avisa que a senha multi-dispositivo deve ser atualizada no Firebase Authentication.

### Segurança
- Senhas não são gravadas no Firestore; a autenticação multi-dispositivo passa a depender do Firebase Authentication.
- Perfis Visitante continuam bloqueados para mutações no app e sincronização remota.

### Backup
- Backup da versão anterior salvo em `backups/v1.7.3_to_v1.8.0/` antes das alterações.

## [v1.7.3] - 2026-08-10

### Corrigido
- Login passa a aceitar também o prefixo do e-mail corporativo, por exemplo `fgvieira` para `fgvieira@viemar.com.br`.
- Senhas digitadas, cadastradas ou redefinidas passam a ignorar espaços acidentais no início/fim, evitando falha após salvar valores como `fvmr2026 `.
- Edição de usuário passa a bloquear e-mail duplicado, evitando redefinir senha em um cadastro e tentar login em outro.
- Atualizada a versão visível do sistema para v1.7.3.

### Backup
- Backup da versão anterior salvo em `backups/v1.7.2_to_v1.7.3/` antes das alterações.
## [v1.7.2] - 2026-08-10

### Corrigido
- Ajustada a responsividade final para iPhone e tablet sem sobrescrever o refinamento BPMN/mobile da v1.7.1.
- Corrigido comportamento das tabelas em telas pequenas: apenas a tabela principal do Pipeline é substituída pelos cards mobile, enquanto tabelas internas do Workflow passam a virar cards responsivos.
- Removida navegação mobile duplicada, mantendo a gaveta lateral e a barra inferior já existentes no layout remoto.
- Atualizada a versão visível do sistema para v1.7.2.

### Backup
- Backup da versão anterior salvo em `backups/v1.7.1_to_v1.7.2/` antes das alterações.

## [v1.7.1] - 2026-08-06

### Ajustado & Aprimorado
- **Refinamento Oficial do Motor BPMN 2.0 (ISO/IEC 19510)**:
  - Eliminação completa de sobreposição nas pontas das setas dos Gateways 1 (Engenharia) e 2 (Suprimentos), com cálculo trigonométrico exato dos pontos de conexão nos vértices externos.
  - Correção da rota do fluxo tracejado de feedback (Revisão de Informações -> Análise Técnica), contornando pelo canal superior livre para impedir qualquer cruzamento de linhas ou sobreposição de cards.
  - Desobstrução visual da raia de Suprimentos / Almoxarifado, segmentando as linhas de fluxo para encaixe limpo nas tags de decisão (`[Estoque > 0]` e `[Estoque Consumido]`).
  - Remoção de labels de depuração `(d-2)` e substituição integral de emojis por ícones SVG corporativos de alta fidelidade.
- **Layout & Espaçamento da Janela**:
  - Inserido bloco estrutural físico de respiro (`.view-scroll-footer-space`) calibrado com folga de rolagem perfeita entre a borda do card e o limite inferior da janela.
  - Ajustado padding e margens para equilíbrio visual harmônico no dashboard executivo.

### Backup
- Backup da versão anterior salvo com sucesso em `backups/v1.7.0_to_v1.7.1/` antes do deploy.

---

## [v1.7.0] - 2026-08-06

### Adicionado
- Adicionada seção de evidências fotográficas na Etapa 3 do workflow para anexar imagem do cavaco atual, imagem do cavaco com a nova ferramenta e um anexo extra opcional.
- Incluído preview das imagens anexadas diretamente na tela do teste em máquina.
- As imagens anexadas são compactadas no navegador antes de salvar para reduzir risco de estouro do armazenamento local.
- Eventos de anexo e remoção de evidência passam a ser registrados na linha do tempo do workflow.

### Corrigido
- Reforçado bloqueio de upload/remoção de anexos para perfil Visitante somente leitura.
- Adicionado tratamento de erro quando o navegador recusa salvar dados locais por falta de espaço.

### Backup
- Backup da versão anterior salvo em `backups/v1.6.2_to_v1.7.0/` antes das alterações.

## [v1.6.2] - 2026-08-05

### Corrigido
- Removidos underscores dos status exibidos na interface, trocando valores como `AGUARDANDO_ANALISE` por `AGUARDANDO ANALISE`.
- Aplicada a formatação visual dos status no Pipeline, Kanban e resumo copiado do workflow.

### Backup
- Backup da versão anterior salvo em `backups/v1.6.1_to_v1.6.2/` antes das alterações.

## [v1.6.1] - 2026-08-05

### Corrigido
- Removida sequência literal `` `r`n `` que aparecia visualmente abaixo do Kanban.
- Ajustado layout dos cards do Kanban para impedir estouro horizontal de badges e botões dentro das colunas.
- Melhorada a responsividade do Kanban em telas médias, reduzindo para duas colunas quando necessário.

### Backup
- Backup da versão anterior salvo em `backups/v1.6.0_to_v1.6.1/` antes das alterações.

## [v1.6.0] - 2026-08-05

### Adicionado
- Criada nova aba `Kanban por Etapas` no menu lateral, com colunas por etapa do fluxo de homologação.
- Adicionado recurso de exclusão de cadastro de teste para perfil Administrador no Pipeline e no Kanban, com confirmação antes da remoção.

### Corrigido
- O selo `OK` das etapas do workflow agora fica permanente conforme o estado real salvo do teste, e não apenas conforme a aba navegada.
- Perfil Visitante agora fica efetivamente somente leitura, com campos bloqueados e salvamentos protegidos nas funções de alteração.

### Alterado
- Atualizada versão visível do sistema para `v1.6.0`.
- Atualizados renderizadores de Pipeline/Kanban após alterações, exclusões e mudanças de etapa.

### Backup
- Backup da versão anterior salvo em `backups/v1.5.6_to_v1.6.0/` antes das alterações.

## [v1.5.6] - 2026-08-05

### Alterado
- Removida a tela/aba de Agendamento de Visita do workflow, pois após o aceite da Engenharia o solicitante passa a ser responsável pelo agendamento e conferência.
- Parecer GO da Engenharia agora libera diretamente o teste para a etapa de Teste em Máquina.
- Renumeradas as etapas visíveis do workflow para 4 etapas: Solicitação, Análise Engenharia, Teste em Máquina e Validação & Estoque.
- Adicionada sinalização visual `OK` nos cards das etapas já concluídas.
- Removida a opção `Agendamento Visita` do filtro de status do Pipeline.

### Backup
- Backup da versão anterior salvo em `backups/v1.5.5_to_v1.5.6/` antes das alterações.

## [v1.5.5] - 2026-08-05

### Ajustado
- Corrigida a responsividade da tela de Workflow para evitar conteúdo fora da tela e scroll horizontal.
- Removidos da aba de solicitação campos que não são preenchidos no cadastro, como contato técnico, peça alvo, material/dureza, máquina sugerida, operação e refrigeração.
- Simplificado o botão de nova solicitação para `Nova Solicitação`.
- Ajustados grids e campos internos do Workflow para respeitarem a largura disponível da tela.

### Segurança
- Backup da versão anterior salvo em `backups/v1.5.4_to_v1.5.5/` antes das alterações.

---
## [v1.5.4] - 2026-08-05

### Ajustado
- Fluxograma BPMN reorganizado em grade horizontal proporcional para caber em uma única linha sem quebra e sem scroll.
- Ajustado o espaçamento geral do dashboard para deixar a página mais harmônica e responsiva.
- Adicionado espaço vazio após o card de diretrizes/fluxograma.
- Removidas as numerações dos títulos dos cards e das diretrizes.

### Segurança
- Backup da versão anterior salvo em `backups/v1.5.3_to_v1.5.4/` antes das alterações.

---
## [v1.5.3] - 2026-08-05

### Ajustado
- Mantido o fluxograma BPMN em uma única linha, evitando quebra dos blocos para a linha seguinte.
- Aumentado o espaço branco entre os gráficos do dashboard e o card de diretrizes/fluxograma.
- Ajustadas larguras mínimas dos nós BPMN para preservar o fluxo em linha sem comprimir excessivamente os textos.

### Segurança
- Backup da versão anterior salvo em `backups/v1.5.2_to_v1.5.3/` antes das alterações.

---
## [v1.5.2] - 2026-08-05

### Ajustado
- Reduzida a altura dos gráficos do dashboard para deixar a primeira visão mais compacta.
- Melhorados os espaçamentos internos das diretrizes e do fluxograma BPMN.
- Criadas classes específicas para controlar o layout dos gráficos e do bloco de política sem depender de estilos inline.

### Segurança
- Backup da versão anterior salvo em `backups/v1.5.1_to_v1.5.2/` antes das alterações.

---

## [v1.5.1] - 2026-08-05

### Corrigido
- Polimento final de acentuação em mensagens, alertas e valores visíveis do workflow.
- Ajustados nomes de processos para `USI Copo Pivô` e `USI Pré-Forma` no cadastro.

### Segurança
- Backup da versão anterior salvo em `backups/v1.5.0_to_v1.5.1/` antes das alterações.

---
## [v1.5.0] - 2026-08-05

### Ajustado
- Removido o campo "Contato / telefone" do cadastro de nova solicitação.
- Campo "Solicitante" passou a ser preenchido manualmente, sem preenchimento automático pelo login.
- Campos textuais do cadastro agora são normalizados automaticamente para maiúsculas ao concluir a solicitação.
- Revisada a acentuação de textos visíveis no painel, menu, workflow, usuários, alertas e mensagens do sistema.
- Configurado favicon oficial do app (`favicon.png`) no aplicativo e na página raiz.
- Adicionado fluxograma estilo BPMN abaixo das diretrizes da política de testes.

### Segurança
- Backup da versão anterior salvo em `backups/v1.4.1_to_v1.5.0/` antes das alterações.

---

## [v1.4.1] - 2026-08-05

### Corrigido
- **Ajustes no modal de nova solicitação**:
  - Removidos os campos de peça, material, máquina, operação e refrigeração do cadastro, pois não eram necessários nesta etapa.
  - Incluído campo de solicitante preenchido automaticamente pelo usuário logado.
  - Incluídos campos de quantidade em estoque e giro mensal para análise de abastecimento.
  - Corrigidos rótulos com acentuação em português no formulário.
  - Ajustado layout responsivo para eliminar scroll horizontal no modal.
- Backup de segurança criado em `backups/v1.4.0_to_v1.4.1/`.

---

## [v1.4.0] - 2026-08-04

### Adicionado
- **Cadastro inteligente de solicitacao de teste de ferramenta**:
  - Inclusao de campos para fornecedor, classe de inserto, descricao da ferramenta, perfil/quebra-cavaco e parametros recomendados: avanco, AP, velocidade de corte e RPM.
  - Inclusao dos dados da ferramenta atual para comparacao: codigo, descricao, parametros atuais, vida util, ciclo e custo.
  - Selecao multipla para tipo da ferramenta e processo de aplicacao, incluindo opcao "Outra" com descricao livre.
  - Inclusao de motivo do teste, retorno esperado e indicadores atacados: reducao de custo, padronizacao, melhoria de cavaco, reducao de tempo de ciclo e robustez.
- **Calendario quinzenal inteligente**:
  - Data do teste agora e selecionada a partir das proximas quintas-feiras quinzenais validas, respeitando minimo D+2 da solicitacao.
- **Fluxo de analise tecnica**:
  - Nova solicitacao entra diretamente como `AGUARDANDO_ANALISE` na etapa de Analise Engenharia.
  - Parecer tecnico trata aprovado, reprovado e em revisao com devolutiva rastreavel ao solicitante.
- Backup de seguranca preservado em `backups/v1.3.2_to_v1.4.0/`.

---

## [v1.3.2] - 2026-08-04

### Corrigido
- **Credenciais do Administrador Master**:
  - E-mail alterado de `davidavillateixeira@gmail.com` para `dteixeira@viemar.com.br` (e-mail corporativo correto).
  - Nome atualizado para `David Teixeira`.
  - Migração do armazenamento local para chave `viemar_toolflow_users_v3` para forçar reset em navegadores com dados antigos.
- Backup de segurança criado em `backups/v1.3.1_to_v1.3.2/`.

---

## [v1.3.1] - 2026-08-04

### Segurança & Autenticação
- **Remoção de Atalhos de Login Automático do Administrador**:
  - Removido o link `Primeiro acesso (admin)` da tela inicial de login para evitar acessos não autorizados por terceiros.
  - O campo de `SENHA` agora é estritamente obrigatório (`required`) e a autenticação compara com rigor a senha individual cadastrada de cada usuário.
  - Eliminação de qualquer fallback/senha padrão em código aberto na tela de login.
  - Centralização do link `Esqueci minha senha` com instruções de contato com o Administrador.
- Backup de segurança criado em `backups/v1.3.0_to_v1.3.1/`.

---

## [v1.3.0] - 2026-08-04

### Adicionado
- **Módulo Oficial de Gestão e Cadastro Dinâmico de Usuários (Padrão DevFlow / Viemar)**:
  - Layout dividido em 2 colunas responsivas:
    - **Card Esquerdo**: Formulário *Cadastrar novo usuário* com campos `NOME *`, `E-MAIL *`, `SENHA INICIAL * (MÍN. 6 CARACTERES)`, `PAPEL` (Técnico Usinagem, Técnico Montagem, Engenharia de Processos, Engenharia de Produto, Setor Preset, Gerenciador de Ferramentas, Fornecedor Externo, Administrador, Visitante) e botão *Criar usuário* no laranja Viemar.
    - **Card Direito**: Lista *Usuários cadastrados (N)* com avatares coloridos por perfil, indicador `(você)` para o usuário conectado, tags de papel estilizadas (orange, purple, blue, yellow, teal, pink, gray), botões de ação rápida para edição, alteração de senha e desativação de contas.
  - **Modais Dedicados**:
    - Modal *Editar Usuário* para ajuste de nome, e-mail e cargo.
    - Modal *Alterar Senha do Usuário* com validação de segurança mínima de 6 dígitos.
    - Confirmação de desativação protegida contra exclusão acidental da própria conta em uso.

### Alterado
- **Limpeza da Base Inicial de Usuários**:
  - Remoção de todos os usuários fictícios de teste prévios (Oscar, Jonathan, Filipe, Charles, etc.).
  - Inicialização limpa exclusiva com o usuário Master Admin: **David** (`davidavillateixeira@gmail.com`).
  - Atualização do botão de *Primeiro acesso (admin)* na tela de login para preenchimento com as credenciais do David.
  - Migração segura da persistência local para a chave `viemar_toolflow_users_v2`.
- Backup de segurança criado em `backups/v1.2.0_to_v1.3.0/`.

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
