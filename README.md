# Viemar DevFlow | Gestao e Homologacao de Testes de Usinagem

Sistema integrado para gestao, acompanhamento e governanca de testes de ferramentas de corte na fabrica da Viemar.

## 🚀 Como Publicar na Vercel (Deploy Online)

O projeto ja esta 100% configurado para a Vercel atraves do arquivo `vercel.json`.

### Opcao 1: Via GitHub (Recomendado)
1. Suba este repositorio para o seu GitHub (ou GitLab / Bitbucket).
2. Acesse [vercel.com](https://vercel.com) e faca login.
3. Clique em **"Add New..."** > **"Project"**.
4. Importe o repositorio `37 - TESTES DE FERRAMENTAS`.
5. Clique em **"Deploy"**.
6. Pronto! A Vercel vai gerar um link como `https://viemar-devflow.vercel.app` para todos na fabrica acessarem do computador ou celular.

### Opcao 2: Via Vercel CLI (Direto do Terminal)
1. No terminal do projeto, execute:
   ```bash
   npm i -g vercel
   vercel
   ```
2. Siga as instrucoes no terminal para publicar diretamente.

---

## 👥 Perfis de Acesso (RBAC)
- **Admin (Engenharia ADM):** Avaliacao de viabilidade (GO/NO-GO), agendamento quinzenal, fechamento com calculo de CPP e trava obrigatoria de abastecimento.
- **Tecnico (Chao de Fabrica):** Registro de parametros CNC, arestas usinadas, rugosidade ($Ra$) e desgaste ($VB$) em tempo real (1o Turno e 2o Turno).
- **Solicitante (Preset / Gerenciador / Fornecedor):** Abertura formal da solicitacao com 2 dias de antecedencia (D-2) e acompanhamento em modo leitura.
- **Leitura (Qualidade / Visitante):** Consulta a relatorios e dashboards.

---

## 🔒 Governanca e Versionamento
Este projeto adota SemVer rigoroso conforme `.agents/AGENTS.md`. Todos os backups anteriores sao preservados na pasta `backups/`.
