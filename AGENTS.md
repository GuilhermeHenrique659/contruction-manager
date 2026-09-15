# AGENTS.md — Constructor Manager

Guia de referência para agentes de IA (e devs) trabalhando neste repositório. Leia antes de implementar qualquer coisa.

## Visão do produto

Sistema de gerenciamento de obras, com foco principal em **controle de gastos e compras** dentro de uma obra (construção civil). Não é um ERP completo — o escopo inicial é: cadastrar obras, registrar compras/gastos vinculados a elas, e ter visibilidade de custos.

Entidades de negócio (obras, compras, fornecedores, categorias etc.) ainda **não estão modeladas** — serão definidas em conjunto com o usuário antes de implementar. Não assuma um modelo de dados de negócio sem confirmar.

## Stack e arquitetura

- **Padrão**: monolito. Um único deploy: o Express serve os arquivos estáticos gerados pelo build do Vite em produção (não há dois servidores separados em produção).
- **Backend**: TypeScript + Express.
- **Frontend**: React + Vite + TypeScript.
- **Banco de dados**: PostgreSQL.
- **ORM**: Drizzle ORM (não usar Prisma, TypeORM ou query builders alternativos).
- **Autenticação**: JWT, desde o início. Toda rota de negócio deve considerar o usuário autenticado (exceto rotas públicas explícitas como `/auth/login` e `/auth/register`).
- **Gerenciador de pacotes**: npm (com npm workspaces). Não usar yarn ou pnpm.
- **Runtime**: Node.js na última versão LTS ativa (verificar `node --version` no ambiente; hoje LTS = Node 24.x). Sempre manter `engines` no `package.json` alinhado.
- **Arquitetura backend**: CQRS + DDD. Módulos por *bounded context*. Write e read são modelos **lógicos** dentro do mesmo módulo (não pastas separadas): `application/` e `controller/` são compartilhados entre escrita e leitura; `repository/` e `domain/` só existem para escrita (com Unit of Work); `query/` e `assembler/` só existem para leitura (sem transação). Detalhe completo em `docs/architecture.md`.
- **Arquitetura frontend**: MVC. **View** = componentes React em `components/`, organizados por Atomic Design (`atoms`, `molecules`, `organisms`, `pages`). **Model** = `features/<feature>/model/`, regras de negócio e transição de estado no cliente (TS puro, sem React). **Controller** = `features/<feature>/controller/`, use cases + gateways que chamam o backend; gateway usa inversão de dependência (interface + implementação com `fetch` nativo). Componentes nunca chamam use case/gateway direto — só via hook colocado com o componente. Detalhe completo em `docs/architecture.md`.

## Documentación detallada

Antes de implementar, consulte también:

- [`docs/architecture.md`](docs/architecture.md) — arquitetura em detalhe (camadas do backend, fluxo de requisição, auth, banco de dados, build/deploy, decisões tomadas e pendentes).
- [`docs/code-style.md`](docs/code-style.md) — convenções de código, nomenclatura de arquivos, padrões de backend e frontend, testes.
- [`docs/review-guidelines.md`](docs/review-guidelines.md) — checklist obrigatório para code review e diretrizes para enforçar arquitetura determinística.

Este `AGENTS.md` é o resumo executivo; os documentos em `docs/` têm a versão completa e devem ser mantidos atualizados junto com o código.

## Estrutura do monorepo

```
/
├── AGENTS.md
├── docs/                 # arquitetura e code style em detalhe
│   ├── architecture.md
│   └── code-style.md
├── package.json          # raiz, define workspaces ["server", "client"] e scripts orquestradores
├── server/               # Express + TS + Drizzle
│   ├── src/
│   │   ├── main.ts       # entrypoint
│   │   ├── shared/       # kernel (UnitOfWork, base classes), infra (db, http, auth), config (env)
│   │   └── modules/      # um diretório por bounded context
│   │       └── <bounded-context>/
│   │           ├── controller/     # rotas write + read
│   │           ├── application/    # use cases write e read, lado a lado
│   │           ├── repository/     # interface + implementação (só write)
│   │           ├── domain/         # agregados/entidades/VOs/domain services (só write)
│   │           ├── query/          # queries reutilizáveis (só read)
│   │           └── assembler/      # monta o Output (só read)
│   ├── drizzle.config.ts
│   └── package.json
├── client/               # React + Vite + TS
│   ├── src/
│   │   ├── components/     # View — Atomic Design (atoms, molecules, organisms, pages)
│   │   ├── features/       # <feature>/model (regras de negócio) + <feature>/controller (use cases + gateways)
│   │   └── types/          # tipos compartilhados
│   └── package.json
└── docker-compose.yml    # PostgreSQL local (quando criado)
```

## Convenções de código

- TypeScript estrito (`strict: true`) em ambos os pacotes. Não usar `any` sem justificativa.
- Arquitetura CQRS por módulo: **write** (`application` orquestra `repository` + `domain`, com Unit of Work) e **read** (`application` executa query diretamente, sem transação, usando `query`/`assembler`). Write e read são modelos lógicos dentro do mesmo módulo — não pastas separadas. Não misturar as duas responsabilidades no mesmo use case.
- `repository/` é exclusivo do lado de escrita: use case de leitura nunca usa `repository/`, e `repository/` nunca contém nada do modelo de leitura. Métodos do repositório só podem ser `getBy...` (agregado ou `null`), `has...` (`boolean`), `valuesBy...` (lista de agregados), `add`/`update` (salva/atualiza agregado).
- Regra de negócio vive em `domain/` (agregados, entidades, value objects, domain services). `application/` só orquestra. `controller/` só valida/traduz HTTP.
- Domain services nunca têm efeito colateral — podem ler repositório, nunca escrever.
- Toda rota que precisa de usuário autenticado passa pelo middleware de auth JWT (`shared/infra/http`) — não duplicar lógica de verificação de token em controllers.
- Schema do banco vive em `server/src/shared/infra/db/` (schema, client Drizzle, migrations). Migrations geradas via `drizzle-kit`, nunca editadas manualmente após aplicadas.
- Variáveis de ambiente centralizadas em `server/src/shared/config/env.ts`, validadas na inicialização. Nunca ler `process.env` diretamente fora desse arquivo.
- Nomes de arquivos: `PascalCase` (backend e componentes React). Detalhe completo, incluindo ordem de imports, regra de export default vs. nomeado e convenção de `_props`/`Input`/`Output`, em `docs/code-style.md`.
- Testes seguem pirâmide (unit em `domain/`, narrow integration em `application/`, broad integration em `controller/`), padrão given/when/then. Detalhe em `docs/architecture.md`.
- Respostas de erro da API devem seguir um formato consistente (error handler central, não respostas ad-hoc por rota/controller).

## Scripts (raiz)

- `npm run dev` — sobe backend e frontend em modo desenvolvimento (proxy do Vite para a API).
- `npm run build` — builda `client` e depois `server` (build do client precisa terminar antes do server copiar/servir os estáticos).
- `npm start` — roda o server em modo produção servindo o build do client.
- `npm run db:generate` / `npm run db:migrate` — geração e aplicação de migrations do Drizzle.

(Ajustar esta lista conforme os scripts reais forem criados nos `package.json`.)

## O que evitar

- Não introduzir outro ORM, framework de frontend, ou gerenciador de pacotes diferente do definido acima sem alinhar com o usuário.
- Não modelar entidades de negócio (Obra, Compra, Fornecedor, etc.) sem confirmação — isso ainda será definido.
- Não colocar lógica de negócio em rotas/controllers.
- Não misturar Unit of Work/transação em use case de leitura, e não pular Unit of Work em use case de escrita.
- Não fazer um módulo importar `domain/` ou `repository/` de outro módulo diretamente.
- Não commitar `.env`, `node_modules`, builds (`dist/`, `client/dist`) ou credenciais.
- Não quebrar o padrão de monolito (ex.: não criar um segundo serviço/deploy separado para o frontend).

- Skill ativa para fluxo de implementação: `.skills/feature-flow.md` (esqueleto → testes → roda → implementação → roda → lint/build).

## Status atual

Projeto em fase de scaffolding inicial. Estrutura de pastas criada; dependências, configuração do Drizzle, auth JWT e build integrado ainda em implementação.
