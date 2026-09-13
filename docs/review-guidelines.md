# Code Review Guidelines — Constructor Manager

> Checklist obrigatório para **todo PR**. Se qualquer item falhar → **Request Changes**.

---

## 1. Arquitetura (CQRS + DDD)

### Modelo de Escrita (Write)
- [ ] Use case em `application/` usa `UnitOfWork` (`unitOfWork.run(...)`)
- [ ] Use case **só orquestra**: carrega agregado → chama método de domínio → persiste → retorna `Output`
- [ ] Regra de negócio **está no `domain/`** (métodos no agregado/entidade), não no use case
- [ ] Repository **só tem**: `getBy...`, `has...`, `valuesBy...`, `add`, `update`
- [ ] Repository **não tem** listagem paginada, DTOs de tela, projeções

### Modelo de Leitura (Read)
- [ ] Use case de leitura **não importa `repository/`**
- [ ] Use case de leitura **não usa `UnitOfWork`**
- [ ] Query SQL/Drizzle está em `query/` (reutilizável)
- [ ] Mapeamento coluna → `Output` está em `assembler/`

### Isolamento de Módulo
- [ ] **Zero imports** de `domain/` ou `repository/` de outro módulo
- [ ] Comunicação entre módulos só via `application/` (use case chamando use case) ou domain events

---

## 2. TypeScript & Code Style

- [ ] `strict: true` — sem `any` (ou com comentário justificando)
- [ ] Imports: normais primeiro (alfabéticos), depois `type` (alfabéticos)
- [ ] Exports: 1 export = `default`; 2+ exports = todos nomeados
- [ ] Arquivos: `PascalCase.ts` / `PascalCase.tsx` (testes: `Arquivo.test.ts`)
- [ ] Early return preferido a `if/else` aninhado
- [ ] `Input` / `Output` definidos **no arquivo do use case** (nomes literais)

---

## 3. Autenticação & Config

- [ ] Rotas de negócio usam middleware JWT (`shared/infra/http`) — sem verificação manual de token
- [ ] `process.env` **só em `shared/config/env.ts`** — validado no boot
- [ ] Error handler central — controllers **não fazem `try/catch`** para montar resposta de erro

---

## 4. Testes (Pirâmide)

| Camada | Onde | O que testar |
|--------|------|--------------|
| Unit | `domain/*.test.ts` | Regras de negócio puras (sem mocks, sem DB) |
| Narrow Integration | `application/*.test.ts` | Use case ponta-a-ponta: **fake repo** (write) ou **DB real** (read / repo impl) |
| Broad Integration | `controller/*.test.ts` | HTTP feliz + auth + status codes (sempre DB real) |

- [ ] Nomes dos testes descrevem **regra de negócio** (`"não permite encerrar obra já encerrada"`)
- [ ] Padrão **given / when / then** visível no teste

---

## 5. Commits & PR

- [ ] Commits atômicos, mensagem convencional (`feat:`, `fix:`, `refactor:`)
- [ ] PR tem descrição do **porquê** (não só o quê)
- [ ] `npm run lint && npm run typecheck && npm run test` passam localmente

---

## Quick Reference — Onde cada coisa vive

```
modules/<context>/
├── controller/     # Rotas write + read (mesma pasta)
├── application/    # Use cases write E read (lado a lado)
├── repository/     # Interface + impl Drizzle (SÓ write)
├── domain/         # Agregados, VOs, domain services (SÓ write)
├── query/          # Queries reutilizáveis (SÓ read)
└── assembler/      # Row → Output (SÓ read)
```

---

## Frases de bloqueio prontas (copie/cole no review)

> ❌ "Use case de leitura importa `repository/` — leitura deve usar `query/` + `assembler/` (arquitetura.md §Modelo de leitura)"

> ❌ "Regra de negócio no use case — mova para método do agregado em `domain/` (arquitetura.md §domain/)"

> ❌ "Repository tem método `findPaginated` — repository só expõe `getBy|has|valuesBy|add|update` (arquitetura.md §repository/)"

> ❌ "Módulo `compras` importa `domain/Obra` de `obras` — módulos não compartilham domain/repository (arquitetura.md §Estrutura de pastas)"

> ❌ "Controller faz `try/catch` para formatar erro — use error handler central (code-style.md §Regras transversais)"

---

## Como usar no dia a dia

1. **Reviewer**: abre o PR → roda o checklist mentalmente → comenta com frases acima se falhar
2. **Autor**: antes de abrir PR, roda `npm run lint && npm run typecheck && npm run test` e passa pelo checklist
3. **CI**: já bloqueia merge se lint/typecheck/test falharem (não substitui review humano)