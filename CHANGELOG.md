# Changelog - Viemar DevFlow | Gestao de Testes de Usinagem

Todas as alteracoes e evolucoes deste projeto seguem rigorosamente o versionamento SemVer e a governanca do `.agents/AGENTS.md`.

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
  - Grafico de ganho percentual de vida util por operacao.
- **Recursos Interativos**:
  - Tabela filtrável com busca dinamica e paginacao.
  - Linha do tempo / Historico de auditoria em tempo real para cada teste.
  - Aba de comentarios e anotacoes tecnicas por teste.
  - Exportacao para impressao e PDF oficial em folha A4 com cabecalho Viemar.
  - Integracao preparada com Google Firebase (Auth & Firestore) com fallback seguro para cache local.
- **Governanca e Backups**:
  - Criacao da pasta de backups (`backups/v1.0.0_initial/`).
  - Repositorio Git inicializado com commit inicial e tag `v1.0.0`.
