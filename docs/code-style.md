# Code Style — Constructor Manager

Convenções de código para backend (`server/`) e frontend (`client/`). O objetivo é consistência, não burocracia — siga o padrão já existente no código antes de inventar um novo.

## Geral (ambos os pacotes)

- TypeScript estrito (`"strict": true`). Evitar `any`; se for inevitável, comentar o motivo.
- Preferir `const`; usar `let` só quando a variável realmente for reatribuída. Nunca `var`.
- **Preferir early return** sempre que possível — evitar `if/else` encadeado quando um retorno antecipado deixa o fluxo mais legível.
- **Limite de linhas por arquivo**: Evitar arquivos com mais de 500 linhas de código. Se um arquivo estiver se aproximando desse limite, considere refatorá-lo em módulos menores e mais focados.

```ts
// evitar
function encerrar(obra: Obra) {
        if (obra.status === "ativa") {
            obra.status = "encerrada";
        } else {
            throw new ObraJaEncerradaError();
        }
}

// preferir
function encerrar(obra: Obra) {
        if (obra.status !== "ativa") {
            throw new ObraJaEncerradaError();
        }

        obra.status = "encerrada";
}
```

- **Ordem dos imports**: alfabética, mas primeiro todos os imports normais (sem `type`), depois todos os imports `type`, cada grupo também em ordem alfabética.

```ts
import { ObraRepository } from "./ObraRepository";

import type { Obra } from "./Obra";
import type { DomainEvent } from "../../../shared/kernel/DomainEvent";
```

- **Exports**: se um arquivo tem mais de 2 exports, todos devem ser nomeados (sem `default`). Se o arquivo tem apenas 1 export, usar `export default`.

```ts
// arquivo com 1 export → default
export default class CreateObra { ... }

// arquivo com 3 exports → todos nomeados
export class Obra { ... }
export type Props = { ... };
export class ObraJaEncerradaError extends Error { ... }
```

## Nomenclatura de arquivos

- **PascalCase** para todos os arquivos de código (backend e componentes de frontend): `CreateObra.ts`, `ObraRepository.ts`, `Obra.ts`, `ObraController.ts`, `GetObraById.ts`, `ObraAssembler.ts`, `ObraCard.tsx`.
- Arquivo de teste: mesmo nome do arquivo testado + `.test.ts` (ex.: `Obra.test.ts`, `CreateObra.test.ts`).
- Hooks React seguem convenção do React (`useAuth.ts`, camelCase, prefixo `use`) — exceção justificada pela convenção do ecossistema.

## Backend (server/)

> Dentro de um módulo, write e read são modelos **lógicos** — não pastas separadas. `application/` e `controller/` são compartilhados entre os dois lados; `repository/` e `domain/` só existem para escrita; `query/` e `assembler/` só existem para leitura.

### Camadas do módulo — lado de escrita

- `application/`: um use case por arquivo. A classe do use case tem nome que descreve a ação (ex.: `CreateObra`) e método `execute(input: Input): Promise<Output>`. Os tipos `Input` e `Output` são definidos **no mesmo arquivo**, sempre com esse nome literal (não `CreateObraInput`, não `Dto`).
                - Orquestra `repository/` e `domain/`. Não contém regra de negócio — só orquestração.
- `repository/`: interface (contrato) + implementação concreta (Drizzle). Sempre orientado a agregado — um método carrega/salva o agregado completo, nunca uma linha de tabela isolada. Nunca contém nada do modelo de leitura (sem listagem paginada, sem DTO de tela). Nomes de método seguem sempre um destes formatos:
                - `getBy...` → agregado ou `null`.
                - `has...` → `boolean`.
                - `valuesBy...` → lista de agregados.
                - `add` / `update` → salva / atualiza agregado.
- `domain/`: agregados, entidades, value objects, domain services, domain events.
                - Entidades/agregados: propriedade privada `_props` contendo um objeto com todas as propriedades. O `type` desse objeto (ex.: `Props`) é definido **no início do mesmo arquivo** do agregado.
                - Acesso aos dados via getters; mutação só através de métodos de negócio nomeados (nunca setters genéricos).
                - Domain services: **sem efeito colateral**. Podem ler de um repositório, mas nunca chamam operação de escrita nele.
- `controller/`: define rota, valida/transforma o payload HTTP em `Input`, chama o use case, formata a resposta. Sem regra de negócio nem de aplicação.

### Camadas do módulo — lado de leitura

- `controller/`: mesmo formato do lado de escrita (é a mesma pasta do módulo).
                - `application/`: use case com `execute(input: Input): Promise<Output>` (fica junto dos use cases de escrita, na mesma pasta), mas **executa a query diretamente** (sem repositório de agregado) e **não gerencia transação** (não escreve no banco). Nunca importa `repository/`.
- `query/`: queries reaproveitadas entre use cases de leitura do mesmo módulo.
- `assembler/`: transforma o resultado da query no shape de `Output`. Toda formatação/mapeamento de dado de leitura fica aqui, não dentro do use case.

### Regras transversais

- Toda variável de ambiente é lida em `shared/config/env.ts` e validada na inicialização. Nunca `process.env.X` direto em outro arquivo.
- Validação de payload: `zod` em uso (`ValidateInput` no `shared/infra/http`).
- Toda rota autenticada usa o middleware de auth JWT (`shared/infra/http`) — ainda não implementado; rotas públicas (`/auth/login`, `/auth/register`) existem sem auth no momento.
- Erros de domínio são classes de erro específicas (ex.: `ObraJaEncerradaError`), lançadas pelo `domain/` e tratadas no error handler central — controllers não fazem `try/catch` genérico para montar resposta de erro.
- Um módulo nunca importa `domain/` ou `repository/` de outro módulo diretamente.

## Frontend (client/)

> Arquitetura MVC (detalhe completo em `docs/architecture.md`): View = `components/` (Atomic Design), Model = `features/<feature>/model/`, Controller = `features/<feature>/controller/` (use cases + gateways).

### View (`components/`)

- Componentes funcionais com hooks. Sem class components.
- Um componente por arquivo, nome do arquivo em `PascalCase.tsx` igual ao nome do componente.
- Organizados por Atomic Design: `atoms/`, `molecules/`, `organisms/`, `pages/`. Cada nível só pode compor os níveis abaixo dele (ex.: `organism` compõe `molecules`/`atoms`, nunca o contrário).
- Componente nunca chama `fetch`, `Gateway` ou `UseCase` diretamente. A ponte com o Controller é sempre um hook colocado junto do componente (`use<Componente>.ts`), seguindo a convenção do React (camelCase, prefixo `use`).
- Estado de servidor (dados da API) e estado de UI (ex.: modal aberto/fechado) tratados separadamente — hoje sem lib de data-fetching, com `useState`/`useEffect` dentro do hook.

### Model (`features/<feature>/model/`)

- Entidades, value objects e funções de transição de estado do domínio no cliente. TypeScript puro — **nunca** importa React, hooks, `fetch` ou Gateway.
- Segue a mesma convenção de agregado do backend quando aplicável: propriedade privada `_props`, `type Props` no início do arquivo, getters, mutação só via métodos de negócio nomeados (sem setters genéricos).

### Controller (`features/<feature>/controller/`)

- **Use case**: mesma convenção do backend — classe com `execute(input: Input): Promise<Output>`, `Input`/`Output` definidos no mesmo arquivo com esse nome literal. Orquestra `model/` + `Gateway`, sem regra de negócio própria.
- **Gateway**: interface (`<Entity>Gateway.ts`) + implementação concreta (`Fetch<Entity>Gateway.ts` usando `fetch` nativo). Use case depende só da interface (inversão de dependência) — a implementação concreta é instanciada e injetada no hook que consome o use case.
- Nenhuma chamada HTTP direta fora de um `Fetch...Gateway`.

### Tipos compartilhados

- Tipos usados entre `features/` e `components/` ficam em `src/types/`.

## Testes

- Padrão **given / when / then** em todos os níveis (unitário, narrow integration, broad integration — ver `docs/architecture.md`).
- Nome de teste descreve a regra de negócio, não a implementação (ex.: `"não permite encerrar uma obra já encerrada"`, não `"lança erro quando chama encerrar duas vezes"`).
- Framework de teste ainda não decidido formalmente (candidato natural: Vitest).

## Formatação e lint

- Formatação e lint devem ser automatizados (ESLint + Prettier, configuração a ser adicionada ao projeto). Até lá, seguir a formatação já presente no código.
- Rodar lint/format antes de considerar uma tarefa concluída, quando os scripts existirem no `package.json`.
