# Guia Definitivo: Ativação da API Oficial do Google Drive

Para dar vida ao Motor de Assets e sair dos "Mocks Visuais" para a leitura real das artes da agência e integração com o Canvas, precisamos gerar as chaves de acesso na nuvem do Google.

## Passo 1: Google Cloud Console
1. Acesse o **[Google Cloud Console](https://console.cloud.google.com/)**.
2. No topo superior esquerdo, clique em **Selecionar um projeto** > **Novo Projeto**.
3. Deixe o nome ("Marketing OS") e clique em **Criar**.

## Passo 2: Ativar as APIs Necessárias
Com seu novo projeto selecionado, você precisa liberar o acesso às gavetas do Google para ele:
1. Vá no menu lateral > **APIs e Serviços** > **Biblioteca**.
2. Na barra de pesquisa, procure `Google Drive API` e clique em **Ativar**.
3. Repita o processo pesquisando e ativando a `Google Picker API`.

## Passo 3: Criar a Fechadura (Tela de Permissão OAuth)
Antes do Google entregar as chaves, ele pede que você configure a telinha que o usuário verá ao fazer Login para acessar o Drive:
1. Em **APIs e Serviços**, vá para **Tela de permissão OAuth**.
2. Escolha **Externo** (se seu Workspace não for restrito) e aperte **Criar**.
3. Preencha apenas os obrigatórios (Nome do app: Marketing OS, E-mail suportar, E-mail Dev). Pode pular os "Escopos" avançados.
4. Na parte de "Usuários de Teste", adicione o seu e-mail do Gmail ou Workspace (para não bater no painel de bloqueio do google durante a fase Dev).

## Passo 4: Coletar Suas 2 Senhas Finais
Essa é a chave mestre que o app usará!
1. Vá em **APIs e Serviços** > **Credenciais**.
2. Clique no "+ Criar Credenciais" topo > **Chave de API**. O Google vai cuspir uma sopa de letras imensa. Essa é a sua `GOOGLE_API_KEY`. (Copie-a).
3. Clique em "+ Criar Credenciais" de novo > **ID do Cliente OAuth**.
4. Selecione o tipo **Aplicativo da Web**.
5. Em **Origens JavaScript autorizadas**, coloque a sua URL atual de Dev: `http://localhost:3000`.
6. Em **URIs de redirecionamento autorizados**, coloque apenas `http://localhost:3000`.
7. Clique em criar. O painel te dará um `ID do cliente`. Ele começa com um monte de números e termina com `apps.googleusercontent.com`. Essa é sua `GOOGLE_CLIENT_ID`. (Copie-a).

## Passo 5: Como Atualizar no Código Real
Assim que nós colocarmos essas variáveis com sucesso no seu cofre escudado arquivo `.env.local` abaixo, nós liberaremos o Componente React Especial da Netlify para que o `/asset` puxe todos os seus diretórios reais.

```text
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=sua_chave_aqui
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id_aqui
NEXT_PUBLIC_GOOGLE_APP_ID=seu_numero_de_projeto_aqui
```
