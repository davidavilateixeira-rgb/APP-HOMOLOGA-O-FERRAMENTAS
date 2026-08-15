# Implantação segura — Firebase e Vercel

Este procedimento evita publicar uma interface nova com regras antigas, restaurar credenciais locais ou transformar o cache do navegador em fonte oficial de dados.

## Pré-requisitos

- acesso administrativo ao projeto Firebase correto;
- acesso ao projeto Vercel e ao repositório GitHub;
- Node.js 20 ou superior e Firebase CLI autenticada;
- branch protegida e revisão obrigatória para mudanças em `firestore.rules` e autenticação.

Não coloque senha, token de CI, chave de conta de serviço ou arquivo `.env` no repositório. A configuração web pública do Firebase identifica o projeto, mas não substitui regras de segurança. Restrinja a chave aos domínios usados e habilite alertas de uso no Google Cloud.

## Antes de publicar

1. Confirme no Firebase Authentication que o provedor **E-mail/senha** está habilitado.
2. Confirme que cada operador possui uma conta no Authentication e um documento em `toolflow_user_profiles/{uid}` com `ativo: true` e o `roleKey` autorizado.
3. Mantenha apenas o administrador bootstrap necessário. Depois de criar o perfil administrativo, prefira retirar a exceção fixa de e-mail das regras em uma mudança revisada e testada.
4. Revise os domínios autorizados do Authentication. Inclua somente produção, previews realmente necessários e `localhost` para desenvolvimento.
5. Execute localmente:

   ```sh
   npm ci --ignore-scripts
   npm run check
   ```

6. Faça backup/exportação do Firestore antes de alterar regras ou modelo de dados. Registre o local e a data do backup no chamado de implantação.

## Publicar regras do Firestore

Use explicitamente o projeto de homologação ou produção; não dependa do projeto padrão salvo localmente.

```sh
firebase use --add
firebase deploy --only firestore:rules --project ID_DO_PROJETO
```

Depois do deploy, valide com contas reais de teste:

- usuário não autenticado não lê nem grava documentos;
- perfil inativo não lê testes;
- perfil operacional cria/edita teste, mas não exclui;
- administrador gerencia perfis e exclui testes;
- usuário não consegue elevar o próprio papel.

Idealmente, automatize esses cenários com Firebase Emulator Suite antes de cada alteração de regras.

## Publicar a aplicação na Vercel

1. Envie a alteração por pull request e aguarde o workflow **Quality** concluir.
2. Verifique o preview da Vercel sem usar dados sensíveis.
3. Promova o mesmo commit aprovado para produção. Não faça alterações manuais divergentes no painel.
4. Confirme em produção: login, recuperação de senha, carregamento do Firestore, criação/edição por operador, bloqueio de visitante e logout.
5. No DevTools, confirme que não existem erros `permission-denied`, senhas em Local Storage ou gravações após uma falha de sincronização.

## Ordem e rollback

Quando interface e regras dependem uma da outra, publique primeiro regras temporariamente compatíveis com as duas versões, depois a aplicação e, por último, endureça as regras. Nunca abra acesso público como etapa intermediária.

Para rollback da interface, promova na Vercel o último deployment saudável. Para regras, mantenha a versão anterior revisada e reaplique com `firebase deploy --only firestore:rules --project ID_DO_PROJETO`. Um rollback de código não desfaz dados gravados: restaure dados somente a partir de exportação validada e com autorização explícita.

## Pós-implantação

- acompanhe erros do navegador, falhas do Firebase e volume de leituras/gravações;
- revogue imediatamente contas desligadas e marque o perfil como inativo;
- revise trimestralmente administradores, domínios autorizados e restrições da chave;
- não trate `localStorage` como backup ou base oficial.
