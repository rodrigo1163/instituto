# Como Rodar o Projeto

Este é um projeto monorepo que utiliza **Turbo** e **pnpm** para gerenciar múltiplas aplicações. O projeto contém:

- **Frontend** (`apps/web`): Aplicação React com TanStack Router e Vite
- **Backend** (`apps/server`): API Fastify com Better Auth
- **Banco de Dados**: PostgreSQL via Docker Compose

## Pré-requisitos

- **Node.js** >= 18
- **pnpm** >= 10.0.0 (gerenciador de pacotes)
- **Docker** e **Docker Compose** (para o banco de dados PostgreSQL)

## Instalação

1. Clone o repositório (se ainda não tiver feito):

```bash
git clone <url-do-repositorio>
cd tanstack-route-exemple
```

2. Instale o pnpm globalmente (se ainda não tiver):

```bash
npm install -g pnpm
```

3. Instale as dependências do projeto:

```bash
pnpm install
```

4. Configure as variáveis de ambiente:

**Backend (`apps/server/.env`):**

Crie um arquivo `.env` na pasta `apps/server` com as seguintes variáveis:

```env
PORT=3333
BETTER_AUTH_SECRET=sua-chave-secreta-aqui
DATABASE_URL=postgresql://docker:docker@localhost:5432/tanstack
CLIENT_ORIGIN=http://localhost:3000
```

**Frontend (`apps/web/.env`):**

Crie um arquivo `.env` na pasta `apps/web` com as seguintes variáveis:

```env
API_URL=http://localhost:3333
CLIENT_URL=http://localhost:3000
```

> **⚠️ Importante:** Substitua `sua-chave-secreta-aqui` por uma chave secreta segura para o Better Auth. Você pode gerar uma chave aleatória usando qualquer gerador de strings aleatórias.

## Como Rodar o Projeto

### 1. Iniciar o Banco de Dados

Primeiro, inicie o PostgreSQL usando Docker Compose:

```bash
docker-compose up -d
```

Isso irá iniciar um container PostgreSQL na porta `5432` com as seguintes credenciais:

- **Usuário**: `docker`
- **Senha**: `docker`
- **Database**: `tanstack`

### 2. Rodar as Aplicações em Modo Desenvolvimento

Para rodar tanto o frontend quanto o backend simultaneamente:

```bash
pnpm dev
```

Este comando irá:

- Iniciar o servidor backend (`apps/server`) na porta configurada
- Iniciar o frontend (`apps/web`) na porta `3000`

### Rodar Aplicações Individualmente

Se preferir rodar cada aplicação separadamente:

**Frontend apenas:**

```bash
cd apps/web
pnpm dev
```

**Backend apenas:**

```bash
cd apps/server
pnpm dev
```

## Acessar a Aplicação

Após iniciar o projeto, acesse:

- **Frontend**: http://localhost:3000
- **Backend**: Verifique a porta configurada no arquivo `.env` do servidor
