# Guia de Estilo e Tema — Constructor Manager

## Visão Geral

Sistema de design industrial para gestão de obras. Estética de "chapa de aço rebitada": cantos chanfrados, juntas visíveis, rebites nos vértices, tipografia técnica. Dois temas: **dark** (padrão) e **light**.

---

## Tokens de Design

### Cores (CSS Custom Properties)

```css
/* Paleta base */
--brass-300: #d9bd82;   /* latão claro */
--brass-500: #b08d42;   /* latão principal */
--brass-700: #8a6a2d;   /* latão escuro */
--rust-500:  #a5442b;   /* ferrugem/perigo */
--rust-600:  #813322;   /* ferrugem escuro */
--signal-400:#d9a441;   /* sinalização/aviso */
--ok-500:    #5c7a52;   /* sucesso/ok */

/* Geometria */
--radius-cut: 14px;              /* chanfro padrão */
--ease: cubic-bezier(.4, 0, .2, 1);

/* Tipografia */
--font-display: 'Oswald', sans-serif;     /* títulos, números */
--font-body: 'Barlow', sans-serif;        /* UI, corpo */
--font-mono: 'JetBrains Mono', monospace; /* dados, labels, código */
```

### Tema Escuro (padrão)

```css
[data-theme="dark"] {
  --bg-0: #14181c;      /* fundo página */
  --bg-1: #1c2127;      /* cards, superfícies */
  --bg-2: #242a31;      /* inputs, hover */
  --bg-3: #2d343c;      /* bordas fortes */
  --line: rgba(217,189,130,.18);
  --line-strong: rgba(217,189,130,.38);
  --ink-0: #f2ede0;     /* texto principal */
  --ink-1: #c7c2b6;     /* texto secundário */
  --ink-2: #8d8a80;     /* texto muted */
  --rivet-face: radial-gradient(circle at 34% 30%, #efe3c4 0%, #b08d42 42%, #6b5122 100%);
  --shadow-deep: 0 18px 40px -12px rgba(0,0,0,.6);
  --plate-grad: linear-gradient(160deg, #2d343c 0%, #1c2127 70%);
}
```

### Tema Claro

```css
[data-theme="light"] {
  --bg-0: #e8e1d0;
  --bg-1: #f1ebdc;
  --bg-2: #faf6ec;
  --bg-3: #ffffff;
  --line: rgba(90,65,20,.18);
  --line-strong: rgba(90,65,20,.35);
  --ink-0: #211c14;
  --ink-1: #4a4234;
  --ink-2: #7a7160;
  --rivet-face: radial-gradient(circle at 34% 30%, #fff6df 0%, #b08d42 45%, #7a5c26 100%);
  --shadow-deep: 0 16px 34px -14px rgba(60,45,15,.35);
  --plate-grad: linear-gradient(160deg, #fbf7ee 0%, #ede4cf 70%);
}
```

---

## Motivos Visuais Reutilizáveis

### Rebites (`.riveted`)

```css
.riveted::before,      /* topo-esquerda */
.riveted::after,       /* topo-direita */
.riveted .rv-bl,       /* base-esquerda */
.riveted .rv-br {      /* base-direita */
  content: "";
  position: absolute;
  width: 9px; height: 9px;
  border-radius: 50%;
  background: var(--rivet-face);
  box-shadow: inset 0 -1px 1px rgba(0,0,0,.5), 0 1px 1px rgba(0,0,0,.4);
}
```
Aplicado em: `Card`, `Modal`, `Navbar` (brand mark), `Plate`.

### Divisor Chevron (`.chevron-rule`)

```css
.chevron-rule {
  height: 14px;
  background:
    linear-gradient(135deg, var(--brass-500) 25%, transparent 25%) 0 0/22px 22px,
    linear-gradient(225deg, var(--brass-500) 25%, transparent 25%) 0 0/22px 22px;
  opacity: .55;
  clip-path: inset(0 0 60% 0);
}
```
Uso: separação de seções, transição header/corpo em tabelas.

### Chanfro (clip-path)

```css
/* Botões */
clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);

/* Cards / Plates */
clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);

/* Modals */
clip-path: polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px);
```

---

## Componentes

### Button

**Variantes:** `primary` | `secondary` | `outline` | `danger`
**Tamanhos:** `sm` (36px) | `md` (46px) | `lg` (56px) | `icon` (46px quadrado)

```tsx
<Button variant="primary" size="md">Ação Principal</Button>
<Button variant="outline" size="sm">Secundária</Button>
<Button variant="danger" size="md">Excluir</Button>
<Button variant="secondary" size="icon" aria-label="Config">⚙</Button>
```

**Estados:** `:hover`, `:active` (scale + translateY), `:disabled` (opacity .4 + grayscale).

---

### Card / Plate

```tsx
<Card padding="md" hoverable onClick={handler}>
  <CardTag>OBRA Nº 0142</CardTag>
  <CardTitle>Residencial Alto da Serra</CardTitle>
  <CardText>Descrição da obra...</CardText>
  <Progress value={64} />
  <CardMeta>
    <span>64% concluído</span>
    <Badge variant="ok">No prazo</Badge>
  </CardMeta>
</Card>
```

**Props:**
- `padding`: `'none' | 'sm' | 'md' | 'lg'`
- `hoverable`: elevação + translateY(-2px) no hover
- `onClick`: torna clicável (acessível via teclado)

**Sub-componentes:**
- `CardTag` — label mono dourado
- `CardTitle` — Oswald 19px
- `CardText` — Barlow 14px muted
- `CardMeta` — flex justify-between, border-top dashed
- `Progress` — barra 6px, gradient brass→signal; variants: `warning` (signal→rust), `danger` (rust)
- `Badge` — inline-flex com dot colorido; variants: `ok` | `warn` | `danger` | `neutral`

---

### Input / Select

```tsx
<Input
  label="Nome da etapa"
  placeholder="Ex.: Impermeabilização"
  error="Campo obrigatório"
  helperText="Máximo 100 caracteres"
  fullWidth
/>
<Select
  label="Responsável"
  options={[{ value: 'a', label: 'Equipe A' }, { value: 'b', label: 'Equipe B' }]}
  fullWidth
/>
```

**Estados:** default, `:focus` (border brass-500), `error` (border rust-500), `:disabled`.

---

### Modal

```tsx
<Modal
  isOpen={open}
  onClose={close}
  title="Nova etapa da obra"
  subtitle="RESIDENCIAL ALTO DA SERRA · OBRA Nº 0142"
  size="md"
>
  <form>
    <Input label="Nome" id="nome" />
    <Select label="Responsável" options={...} />
    <Input label="Data" type="date" />
  </form>
</Modal>
```

**Tamanhos:** `sm` (360px) | `md` (460px) | `lg` (560px) | `xl` (720px) | `full` (viewport)
**Features:** focus trap, ESC para fechar, click no overlay, `subtitle` opcional.

---

### Navbar

```tsx
<Navbar
  brand="ESTRUTURA"
  links={[
    { label: 'Obras', href: '/obras' },
    { label: 'Compras', href: '/compras' },
  ]}
  user={{ name: 'João Silva' }}
  onLogout={handleLogout}
/>
```

**Elementos:**
- Brand mark (octógono conic-gradient + letra "E")
- Links com hover bg-2
- **Theme toggle** — rocker switch animado (knob desliza)
- User menu ou auth actions
- Hamburger menu mobile (< 768px)

---

## Páginas / Layout

### Estrutura Base

```tsx
<div className={styles.page}>
  <Navbar ... />
  <main className={styles.main}>
    <section className={styles.intro}>
      <span className={styles.eyebrow}>PAINEL DE CONTROLE</span>
      <h1 className={styles.title}>Título Grande</h1>
      <p className={styles.subtitle}>Descrição...</p>
      <div className={styles.heroActions}>...</div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionNum}>01</span>
        <h2 className={styles.sectionTitle}>Seção</h2>
      </div>
      <p className={styles.sectionDesc}>Descrição opcional</p>
      {/* conteúdo */}
    </section>
  </main>
</div>
```

### Classes de Utilitário (Home.module.css)

| Classe | Uso |
|--------|-----|
| `.intro` | Hero topo da página |
| `.eyebrow` | Placa mono dourada (label de seção) |
| `.section` | Bloco com border-bottom line |
| `.sectionHead` | Número + título |
| `.sectionNum` | Mono brass-500 "01" |
| `.sectionTitle` | Oswald 28px |
| `.sectionDesc` | Max 60ch, ink-2 |
| `.statsSection` | Grid de cards estatísticos |
| `.actionsGrid` | Grid de action cards |

---

## Sistema de Tema

### ThemeContext

```tsx
// Provider em main.tsx
<ThemeProvider>
  <App />
</ThemeProvider>

// Uso em componentes
const { theme, toggleTheme, setTheme } = useTheme();

// theme: 'dark' | 'light'
// toggleTheme(): void
// setTheme('dark' | 'light'): void
```

**Persistência:** `localStorage.setItem('theme', theme)`
**Detecção inicial:** `prefers-color-scheme` se não houver stored.

### Theme Toggle (Navbar)

```css
.rocker / .themeToggle {
  --w: 48px; --h: 28px;
  background: var(--bg-1);
  border: 1px solid var(--line-strong);
  border-radius: 6px;
}

.themeKnob {
  width: 22px; height: 22px;
  background: var(--brass-500);
  transform: translateX(0);           /* dark */
  transition: transform .28s var(--ease);
}

[data-theme="light"] .themeKnob {
  transform: translateX(22px);       /* light */
}
```

---

## Acessibilidade

- `:focus-visible` — outline `signal-400` 2px offset 3px
- `prefers-reduced-motion` — desabilita transições/animações
- ARIA labels em botões icon-only
- Modal: focus trap, `role="dialog"`, `aria-modal="true"`
- Card clicável: `role="button"`, `tabIndex=0`, `Enter` para ativar
- Inputs: `aria-describedby` para error/helper, `aria-invalid`

---

## Breakpoints

```css
@media (max-width: 768px)  { /* tablet / mobile landscape */ }
@media (max-width: 640px)  { /* mobile */ }
@media (max-width: 480px)  { /* mobile pequeno */ }
```

**Navbar:** hamburger menu, links full-width, stack vertical.
**Home:** stats grid → 2 col → 1 col; actions grid → 1 col.
**Buttons:** hero actions stack vertical em < 480px.

---

## Convenções de Código

### Nomenclatura CSS Modules

- PascalCase para componentes: `Button.module.css`, `Card.module.css`
- Classes em camelCase: `.brandMark`, `.cardTitle`, `.statValue`
- Sufixos de variante: `.primary`, `.secondary`, `.outline`, `.danger`
- Sufixos de tamanho: `.sm`, `.md`, `.lg`, `.xl`, `.full`
- Estado: `.open`, `.hoverable`, `.clickable`, `.hasError`

### Imports

```tsx
import styles from './Component.module.css';
// uso: className={styles.className}
```

### Fontes

- **Títulos/números:** `var(--font-display)` (Oswald)
- **UI/texto:** `var(--font-body)` (Barlow)
- **Dados/mono:** `var(--font-mono)` (JetBrains Mono)

---

## Checklist para Novos Componentes

- [ ] Usar tokens CSS (`var(--bg-1)`, `var(--ink-0)`, etc.) — **nunca** valores hardcoded
- [ ] Respeitar `prefers-reduced-motion`
- [ ] Incluir `:focus-visible` visível
- [ ] Suportar ambos temas (testar light/dark)
- [ ] Chanfro consistente com componente similar
- [ ] Rebites se for "plate" ou "card" de superfície
- [ ] Tipografia correta: display para títulos, body para UI, mono para dados
- [ ] Estados: default, hover, active, focus, disabled, error (se input)
- [ ] Acessibilidade: ARIA, teclado, contraste

---

## Referências Rápidas

| Elemento | Token Cor | Token Fonte | Chanfro |
|----------|-----------|-------------|---------|
| Fundo página | `--bg-0` | — | — |
| Superfície card | `--bg-1` | — | 18px |
| Input/hover | `--bg-2` | — | — |
| Borda sutil | `--line` | — | — |
| Borda forte | `--line-strong` | — | — |
| Texto principal | `--ink-0` | `--font-body` | — |
| Texto secundário | `--ink-1` | `--font-body` | — |
| Texto muted | `--ink-2` | `--font-mono` | — |
| Acentos/brand | `--brass-500` | `--font-display` | — |
| Perigo | `--rust-500` | — | — |
| Sucesso | `--ok-500` | — | — |
| Sombra profunda | `--shadow-deep` | — | — |
| Gradiente placa | `--plate-grad` | — | — |