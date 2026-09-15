# Arquitetura — Constructor Manager

## Visão geral

Monolito único: um processo Node/Express que, em produção, também serve os arquivos estáticos gerados pelo build do frontend (React + Vite). Não há dois serviços/deploys separados.

O **backend** é organizado em módulos por *bounded context* (DDD). Dentro de cada módulo, **write e read são modelos lógicos, não pastas separadas** — seguem CQRS na forma como o código é escrito (regras e responsabilidades diferentes), mas as pastas do módulo (`application/`, `controller/`, `repository/`, `domain/`, `query/`, `assembler/`) são compartilhadas: um use case de escrita e um de leitura do mesmo contexto convivem, por exemplo, dentro do mesmo `application/`.

```
┌───────────────────────────────────────────────────────────┐
│                    Express (main.ts)                        │
│                                                               │
│                 modules/<bounded-context>/                   │
│                                                               │
│   controller/  →  application/ (use cases: write e read)     │
│                        │                    │                │
│              write ────┘          read ─────┘                │
│                │                            │                │
│         domain/ + repository/         query/ + assembler/    │
│                │                            │                │
│                     PostgreSQL (Drizzle)                     │
└───────────────────────────────────────────────────────────┘
```

## Estrutura de pastas do backend

```
server/
├── src/
│   ├── main.ts                     # entrypoint, monta o Express, registra módulos
│   ├── shared/                     # kernel e infraestrutura cross-cutting
│   │   ├── domain/                 # base classes (DomainError, Id, etc.) — kernel/ ainda não implementado
│   │   ├── infra/
│   │   │   ├── db/                 # client Drizzle, schema, migrations
│   │   │   └── http/               # setup do Express, error handler, middleware de auth (JWT)
│   │   └── config/                 # env.ts (única porta de acesso a process.env)
│   └── modules/
│       └── <bounded-context>/      # ex.: obras, compras (a definir com o usuário)
│           ├── controller/         # rotas write + read, validação/transformação de entrada
│           ├── application/        # use cases write E read, lado a lado
│           ├── repository/         # interface + implementação, orientado a agregado (só write)
│           ├── domain/             # agregados, entidades, value objects, domain services, domain events (só write)
│           ├── query/              # queries reutilizáveis entre use cases de leitura (só read)
│           └── assembler/          # monta/transforma dados para o Output do use case (só read)
└── drizzle.config.ts
```

Cada bounded context é autocontido: um módulo não importa `domain/` ou `repository/` de outro módulo diretamente. Comunicação entre módulos, quando necessária, acontece via `application/` (use case chamando outro use case) ou via domain events — nunca acessando o domínio interno de outro módulo.

A distinção entre write e read dentro de `application/` é **lógica**, não física: dá para saber o "lado" de um use case pelas dependências que ele usa (um use case de escrita usa `repository/` + `domain/`; um use case de leitura usa `query/` + `assembler/` e nada de transação).

## Modelo de escrita (write)

> Lembrete: "write" aqui é um agrupamento lógico dos use cases dentro de `application/`, não uma pasta física. As pastas `repository/` e `domain/` só existem para o lado de escrita.

### `application/` (use cases de escrita)

- Contém os **use cases**. Cada use case é uma classe cujo nome descreve a ação (ex.: `CreateObra`, `RegistrarCompra`, `EncerrarObra`).
- A classe implementa um método `execute(input: Input): Promise<Output>`.
- `Input` e `Output` são tipos definidos no mesmo arquivo do use case (não em um arquivo `dto.ts` separado). Sempre nomeados literalmente `Input` e `Output`.
- O use case:
  - Orquestra a regra de negócio entre `repository/` e `domain/`.
  - Contém **apenas regra de nível de aplicação** (ex.: "carregar agregado, chamar método de domínio, persistir, publicar evento"). Regra de negócio de fato mora no `domain/`.

```ts
// modules/obras/application/CreateObra.ts
type Input = {
  nome: string;
  endereco: string;
};

type Output = {
  id: string;
};

export class CreateObra {
  constructor(private readonly obraRepository: ObraRepository) {}

  async execute(input: Input): Promise<Output> {
    const obra = Obra.create({ nome: input.nome, endereco: input.endereco });

    await this.obraRepository.add(obra);

    return { id: obra.id };
  }
}
```

### `repository/`

- Contém a **interface** do repositório (o contrato usado pelo `application/`) e a **implementação concreta** (usando Drizzle).
- Sempre orientado a **agregado**: um repositório carrega e persiste um agregado completo, nunca uma tabela isolada ou um fragmento de entidade.
- Pode usar libs e o ORM livremente — é a camada de infraestrutura do módulo.
- **Uso exclusivo do lado de escrita**: use cases de leitura **nunca** dependem de `repository/`. O repositório, por sua vez, **nunca** contém nada relacionado ao modelo de leitura (sem método de listagem paginada, sem projeção de DTO, sem shape de tela) — leitura é responsabilidade de `query/` + `assembler/`.
- Métodos do repositório seguem sempre um destes formatos, sem variação de nome:
  - `getBy...`: retorna **um agregado ou `null`** (ex.: `getById`, `getByCnpj`).
  - `has...`: retorna **`boolean`** (ex.: `hasByNome`).
  - `valuesBy...`: retorna **uma lista de agregados** (ex.: `valuesByStatus`).
  - `add` / `update`: **salva** ou **atualiza** um agregado.

```ts
// modules/obras/repository/ObraRepository.ts
export interface ObraRepository {
  getById(id: string): Promise<Obra | null>;
  hasByNome(nome: string): Promise<boolean>;
  valuesByStatus(status: string): Promise<Obra[]>;
  add(obra: Obra): Promise<void>;
  update(obra: Obra): Promise<void>;
}
```

```ts
// modules/obras/repository/DrizzleObraRepository.ts
export class DrizzleObraRepository implements ObraRepository {
  // implementação usando Drizzle
}
```

### `domain/`

- Contém **agregados, entidades, value objects, domain services e domain events**.
- Agregados e entidades são definidos junto com o usuário, de acordo com o negócio de cada contexto — não modelar sem confirmação.
- Regra de negócio de fato vive aqui, usando OOP (entidades/agregados com comportamento) e programação funcional (value objects imutáveis, funções puras de transformação/validação).
- **Domain services** existem para regras que não pertencem naturalmente a uma única entidade. Podem ler de um repositório, mas **nunca podem causar efeito colateral** (nunca chamam método de escrita do repositório, nunca persistem nada). São funções/classes puras do ponto de vista de escrita.

Convenção de entidade/agregado (ver detalhes em `docs/code-style.md`):

```ts
// modules/obras/domain/Obra.ts
type Props = {
  nome: string;
  endereco: string;
  status: "ativa" | "encerrada";
};

export class Obra {
  private readonly _props: Props;

  constructor(props: Props) {
    this._props = props;
  }

  static create(props: Omit<Props, 'status'>): Obra {
    return new Obra({ ...props, status: 'ativa' });
  }

  encerrar(): void {
    if (this._props.status === "encerrada") {
      throw new ObraJaEncerradaError();
    }

    this._props.status = "encerrada";
  }

  get nome(): string {
    return this._props.nome;
  }
}
```

### `controller/`

- Define as rotas Express do módulo, escolhe qual use case chamar, e faz a **validação e transformação da entrada** (payload HTTP → `Input` do use case).
- Fino: não contém regra de negócio nem de aplicação. Só tradução entre HTTP e use case.

## Modelo de leitura (read)

> Assim como o write, "read" é lógico: os use cases de leitura ficam no mesmo `application/` do módulo, ao lado dos de escrita. As pastas `query/` e `assembler/` só existem para o lado de leitura.

O modelo de leitura é intencionalmente mais simples — não existe agregado, não existe transação, não existe regra de negócio a proteger (é só leitura).

### `controller/`

- Mesmo formato do modelo de escrita: define rota, escolhe o use case de leitura, valida entrada (ex.: query params, paginação).

### `application/` (use cases de leitura)

- Use cases de leitura seguem o mesmo formato `execute(input: Input): Promise<Output>`, com `Input`/`Output` definidos no arquivo.
- Diferença chave: o use case de leitura **implementa a query diretamente** (não delega para um repositório de agregado) e **não gerencia transação**, pois nunca escreve no banco.
- **Nunca importa/usa `repository/`**. Repositório é exclusivo do lado de escrita; leitura sempre passa por `query/` + `assembler/`.

```ts
// modules/obras/application/GetObraById.ts
type Input = {
  id: string;
};

type Output = {
  id: string;
  nome: string;
  status: string;
};

export class GetObraById {
  async execute(input: Input): Promise<Output | null> {
    const row = await obraQueries.findById(input.id);

    if (!row) return null;

    return ObraAssembler.toOutput(row);
  }
}
```

### `query/`

- Queries reutilizadas entre múltiplos use cases de leitura do mesmo módulo (evita duplicar a mesma consulta Drizzle/SQL em vários arquivos de `application/`).

### `assembler/`

- Responsável por montar e transformar os dados retornados da query no formato de `Output` do use case (mapeamento de coluna do banco → shape da API, agregações simples, formatação).

## Autenticação

- JWT desde o início. Middleware de auth vive em `shared/infra/http`.
- Toda rota de negócio (write e read) passa pelo middleware de auth, exceto rotas públicas explícitas (`/auth/login`, `/auth/register`).

## Banco de dados

- PostgreSQL via Drizzle ORM.
- **Conexão com o banco**: Utilizar pool de conexões e reutilizar o pool ao longo da aplicação, evitando criar e fechar conexões repetidamente. A conexão deve ser estabelecida uma vez e compartilhada entre as operações.
- Entidades de negócio: modelo definido em `docs/database-model.md` (users, projects, vendors, categories, items, orders, project_members), mas ainda não totalmente implementado no código — apenas `users` está modelado no banco (`shared/infra/db/schema/users.ts`).

## Arquitetura do Frontend (client/)

React + Vite + TypeScript, seguindo **MVC**:

| Camada MVC | Onde vive | Responsabilidade |
|---|---|---|
| **View** | `components/` | Componentes React, organizados por **Atomic Design** (`atoms`, `molecules`, `organisms`, `pages`). Só renderização e composição — sem regra de negócio, sem chamada HTTP direta. |
| **Model** | `features/<feature>/model/` | Entidades, value objects, regras de negócio e funções de transição de estado do domínio no cliente. TypeScript puro — **sem** dependência de React, fetch ou qualquer coisa de infraestrutura. |
| **Controller** | `features/<feature>/controller/` | Use cases (orquestram Model + Gateway) e Gateways (interface + implementação que chama o backend). |

```
┌─────────────────────────────────────────────────────────────┐
│                       React (Vite)                            │
│                                                                 │
│   components/ (View — Atomic Design)                           │
│   atoms → molecules → organisms → pages                        │
│        │  (hook colocado com o componente)                     │
│        ▼                                                       │
│   features/<feature>/controller/ (use case)                    │
│        │              │                                        │
│        ▼              ▼                                        │
│   features/<feature>/model/   Gateway (interface) ← Fetch...Gateway│
│                                            │                    │
│                                            ▼                    │
│                                    Backend (Express/API)        │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de pastas do frontend

```
client/
├── src/
│   ├── components/                     # View — Atomic Design (compartilhado entre features)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── pages/
│   │       └── <PageName>/
│   │           ├── <PageName>.tsx
│   │           └── use<PageName>.ts     # hook que conecta a page ao Controller
│   ├── features/
│   │   └── <feature>/                   # bounded context do frontend (mirror do módulo do backend)
│   │       ├── model/                   # entidades, VOs, regras de negócio, transição de estado
│   │       └── controller/
│   │           ├── <UseCase>.ts         # execute(Input): Output — orquestra Model + Gateway
│   │           ├── <Entity>Gateway.ts   # interface (contrato do gateway)
│   │           └── Fetch<Entity>Gateway.ts  # implementação concreta (fetch nativo)
│   ├── types/                           # tipos compartilhados entre features e components
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

### `components/` (View — Atomic Design)

- `atoms/`: menor unidade de UI, sem lógica (ex.: `Button.tsx`, `Input.tsx`).
- `molecules/`: composição de atoms com pouca lógica local (ex.: `SearchField.tsx`).
- `organisms/`: seções completas de UI, compostas por molecules/atoms (ex.: `ObraCard.tsx`, `ObraTable.tsx`).
- `pages/`: composição final ligada a uma rota. É aqui que a View se conecta ao Controller — **sempre através de um hook** colocado junto da página (`use<PageName>.ts`), nunca chamando use case/gateway diretamente do componente.
- Componentes nunca importam `fetch`, `Gateway` ou `UseCase` diretamente — só através do hook.

```tsx
// components/pages/ObraList/ObraList.tsx
export default function ObraList() {
  const { obras, isLoading } = useObraList();

  if (isLoading) return <Spinner />;

  return <ObraTable obras={obras} />;
}
```

```ts
// components/pages/ObraList/useObraList.ts
export function useObraList() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const useCase = new ListObras(new FetchObraGateway());

    useCase.execute({}).then((output) => {
      setObras(output.obras);
      setIsLoading(false);
    });
  }, []);

  return { obras, isLoading };
}
```

### `features/<feature>/model/` (Model)

- Entidades, value objects, regras de negócio e transições de estado do lado do cliente (ex.: validação de formulário derivada de regra de negócio, cálculo de total, máquina de estados de um fluxo).
- Segue a mesma convenção de agregado do backend quando fizer sentido (propriedade privada `_props`, getters, métodos de negócio nomeados — sem setters genéricos).
- **Nunca** importa React, `fetch`, hooks ou qualquer Gateway. É testável isoladamente, em memória.

### `features/<feature>/controller/` (Controller)

- **Use case**: mesma convenção do backend — classe com método `execute(input: Input): Promise<Output>`, `Input`/`Output` definidos no mesmo arquivo. Orquestra `model/` e o `Gateway`, sem regra de negócio própria.
- **Gateway**: aplica **inversão de dependência**, igual ao par `repository`/`domain` do backend:
  - Uma **interface** (`<Entity>Gateway.ts`) declara o contrato — é isso que o use case recebe no construtor.
  - Uma **implementação concreta** (`Fetch<Entity>Gateway.ts`) usa `fetch` nativo para chamar o backend e implementa a interface.
  - O use case nunca depende da implementação concreta, só da interface — a concreta é instanciada e injetada no ponto de uso (hoje, dentro do próprio hook; se a aplicação crescer, pode migrar para um composition root único).

```ts
// features/obras/controller/ObraGateway.ts
export interface ObraGateway {
  listAll(): Promise<Obra[]>;
  create(input: { nome: string; endereco: string }): Promise<{ id: string }>;
}
```

```ts
// features/obras/controller/FetchObraGateway.ts
export class FetchObraGateway implements ObraGateway {
  async listAll(): Promise<Obra[]> {
    const response = await fetch("/api/obras");

    if (!response.ok) throw new Error("Falha ao buscar obras");

    return response.json();
  }

  async create(input: { nome: string; endereco: string }) {
    // ...
  }
}
```

```ts
// features/obras/controller/ListObras.ts
type Input = Record<string, never>;

type Output = {
  obras: Obra[];
};

export class ListObras {
  constructor(private readonly gateway: ObraGateway) {}

  async execute(_input: Input): Promise<Output> {
    const obras = await this.gateway.listAll();

    return { obras };
  }
}
```

### Estado de servidor no client

- Sem biblioteca de data-fetching (ex.: React Query) por ora. Estado de servidor é tratado com `useState`/`useEffect` dentro do hook colocado com a página/componente, seguindo o exemplo de `useObraList` acima.
- Estado de UI (ex.: modal aberto, aba selecionada) fica no componente, separado do estado de servidor.

## Arquitetura de testes (pirâmide)

Três níveis, todos seguindo o padrão **given / when / then**, focados em descrever regra de negócio (evitar teste que só testa getter/setter ou implementação).

### 1. Testes unitários — base da pirâmide

- Local: `domain/` (ex.: `Obra.test.ts` ao lado de `Obra.ts`).
- Testam regra de negócio da entidade/agregado/value object/domain service isoladamente.
- **Sem** fakes, stubs, mocks ou banco de dados — é lógica pura em memória.
- Maior quantidade de testes do sistema.

### 2. Narrow integration tests — meio da pirâmide

- Local: `application/` (contém tanto use cases de escrita quanto de leitura, lado a lado).
- Testam o use case de ponta a ponta dentro da camada de aplicação.
- Regra:
  - Se o use case é do **modelo de escrita** e não está testando a implementação concreta do repositório: usar um **fake** de repositório (implementação em memória da interface).
  - Se o use case é do **modelo de leitura**, ou o teste é especificamente da **implementação concreta do repositório** (ex.: `DrizzleObraRepository`): usar **PostgreSQL real** (banco de teste).
- Quantidade intermediária de testes.

### 3. Broad integration tests — topo da pirâmide

- Local: `controller/` (bate na rota HTTP via supertest ou equivalente).
- Sempre contra PostgreSQL real.
- Menor quantidade de testes — cobre o caminho feliz e casos críticos de contrato HTTP (status code, shape da resposta, auth).

## Decisões já tomadas

| Decisão | Escolha |
|---|---|
| Gerenciador de pacotes | npm (com workspaces) |
| ORM | Drizzle |
| Banco de dados | PostgreSQL |
| Autenticação | JWT |
| Runtime | Node.js LTS ativo |
| Arquitetura backend | CQRS + DDD, módulos por bounded context; write/read são modelos lógicos dentro do mesmo módulo (não pastas separadas) |
| Padrão de transação (write) | `db.transaction` no controller |
| Estratégia de testes (backend) | Pirâmide: unit (domain) → narrow integration (application) → broad integration (controller) |
| Arquitetura frontend | MVC: View (`components/`, Atomic Design), Model (`features/<feature>/model/`), Controller (`features/<feature>/controller/`: use cases + gateways) |
| Inversão de dependência no client | Use case depende da interface do Gateway, não da implementação concreta (`Fetch...Gateway`) — instanciada/injetada no hook |
| Cliente HTTP no client | `fetch` nativo, encapsulado nos Gateways |
| Estado de servidor no client | Hooks próprios (`useState`/`useEffect`) colocados com a página/componente — sem lib de data-fetching por ora |

## Decisões pendentes

- Modelagem de entidades de negócio (Obra, Compra, Fornecedor, Categoria de gasto etc.) e definição dos bounded contexts do sistema.
- Estratégia de autorização mais granular (ex.: usuário só vê obras às quais tem acesso) — depende da modelagem acima.
- Biblioteca de validação de payload nos controllers: `zod` já está em uso (`ValidateInput`, `UserController`).
- Middleware de auth JWT (`shared/infra/http`): ainda não implementado; rotas públicas (`/auth/login`, `/auth/register`) existem sem auth no momento.
- Mecanismo concreto de domain events (in-process vs. fila) — a definir quando houver o primeiro caso de uso real.
- Estratégia de testes do frontend (`client/`): framework ainda não decidido, e por ora o client não tem testes automatizados.
- Se/quando o `useState`/`useEffect` manual nos hooks do client não for suficiente (cache, revalidação, requisições concorrentes), avaliar migrar para uma lib de data-fetching — decisão em aberto.
