# Log — Landing Omar

Bitácora append-only de ingests, decisiones, migraciones y mantenimiento. **No se edita histórico, solo se agrega al final.**

Formato: `## YYYY-MM-DD — Título corto` + cuerpo en 1-3 párrafos o bullets.

---

## 2026-05-11 — Migración a raíz y adopción del patrón Karpathy LLM Wiki

- Repo movido de `~/proyectos-vibe-coding/second-brain/projects/landing-omar/` a `~/proyectos-vibe-coding/landing-omar/` (nivel raíz, como hermano de `meta-ads-dashboard/` y `enzo-agente-ia/`). Git history preservado (commit `963f7a8` intacto).
- Adoptada la arquitectura de tres capas del gist de Karpathy (https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): `raw/` (fuentes inmutables) + `wiki/` (markdown sintetizado por LLM) + `CLAUDE.md` como schema.
- Creadas carpetas: `raw/{briefs,benchmarks,notas,capturas}`, `wiki/{decisiones,conceptos,sintesis}`.
- `CLAUDE.md` ampliado: secciones nuevas de "Arquitectura tres capas", "Convenciones de nombres", "Frontmatter obligatorio" y "Dominios fijos" insertadas **antes** del Sistema de diseño v2.1 (que se conserva intacto).
- Referencia removida del `INDEX.md` del vault PARA.

---

## 2026-05-11 — Pase frontend-design: tensión editorial + cierre del bento + calificación de leads

Auditoría sección a sección con el skill `frontend-design` (benchmark Stratechery / Generalist / Linear / Brittany Chiang). Hallazgos y cambios:

**Hero (`src/components/Hero.astro`)**
- Headline reescrito: `IA aplicada a la operación real de pymes en LATAM.` → `Tu pyme genera datos. Casi ninguno *decide*.` (palabra protagonista "decide" en `.accent-italic`).
- Subhead reescrito para no duplicar About.
- Badge `DISPONIBLE · COLOMBIA` → `DISPONIBLE · 2 CUPOS · Q2 2026` (anchor concreto, sin urgencia fabricada).
- Métricas: añadida etiqueta `FACT-XX` mono pequeña, labels más explícitos (`cop / mes operados en mis negocios`), border-left que cambia a `--accent` en hover.
- Métrica #3 reemplazada: "negocios activos = 2" (débil) → `−92% tiempo de investigación en importación` (caso O&P real). Añadidos formatters `percent-neg` y `percent` en `src/scripts/counter.ts`.
- Nueva línea de credenciales académicas express debajo del subhead: `EAFIT · UPB MEDELLÍN · LA SALLE BARCELONA` en mono (anchor académico arriba del fold).

**Cases (`src/components/Cases.astro`)**
- Anotación editorial sobre el valle del chart de Arkhē: línea fina + label `−41% ingresos potenciales` en mono accent, posicionada con CSS sobre las barras 5-8.
- Legend del chart afinado: `valle` → `valle 12—4pm`.
- Card O&P: añadida lista de métricas (`−92% tiempo investigación`, `6→4 sem→días`, `1 operador sin equipo`) con variante `--sm`.
- Nuevo strip de cierre al final del bento (linkea a WhatsApp): hook serif `¿Tu negocio es el *cuarto* caso?` + CTA mono `CTA-04 hablar por whatsapp →`. Hover: border `--ink`, bg `--bg-soft`, arrow desplaza.

**ContactForm (`src/components/ContactForm.astro` + `src/lib/contact.ts`)**
- Añadido fieldset `calificación · opcional` con dos `<select>` mono: facturación / mes (4 rangos COP) y plazo (4 opciones). No requeridos.
- `buildLeadMessage()` ahora acepta `facturacion` y `plazo` opcionales y los añade al mensaje pre-rellenado de WhatsApp.
- Copy del submit: `iniciar conversación` → `abrir whatsapp con tu mensaje` (claro sobre lo que pasa al click).
- Añadida línea de salida directa abajo: `o directo: whatsapp / email` con links mono — escape hatch para quien no quiere llenar el form.

**Footer (`src/components/Footer.astro`)**
- Bloque finale (fondo `--ink`) ahora es composición editorial: pretitle mono caps `FIN · COL.III · EDICIÓN {year}` + statement serif `No hay magia. Hay *criterio*, datos y código.` + wordmark grande. Antes era solo wordmark.

**Tipografía (decisión + reconciliación)**
- Detectado drift: el `CLAUDE.md` mandaba "Geist Mono 95%" pero el código (y la memoria del operador) usaba sistema 3-familias. Documentada la decisión en `wiki/decisiones/tipografia-3-familias-landing.md` (justificación: lectura larga vs deck/social; mono sigue presente pero solo en meta-info, números, CTAs, paths, labels).
- Reescrita la sección "Tipografía" del `CLAUDE.md` para reflejar el sistema real serif (15%) + sans (55%) + mono (30%).
- Añadida entrada en `index.md`.

**Build:** limpia tras cada bloque (`npm run build` → 1.4-1.5s, 2 páginas).
**Reglas v2.1 respetadas:** cero gradientes/sombras/glows nuevos, acento azul único en señal, `border-radius: 0` en CTAs primarios, sin `#000`/`#FFF` puros.

---

## 2026-05-11 — Dark mode con toggle persistente + footer minimal + accesibilidad WCAG AA

Implementación del plan `~/.claude/plans/hazle-al-sitio-web-sharded-sedgewick.md`. Pase para que cualquier visitante alterne light/dark a placer, todo texto cumpla contraste WCAG AA mínimo, y eliminar el wordmark gigante del footer que el operador reportó como desproporcionado.

**Paleta dark (verificada vs `--bg`):**
- `--bg #0D0D0D` · `--bg-soft #1A1A1A` · `--ink #F5F5F4` (17.8:1 AAA) · `--ink-soft #D4D4D2` (13.1:1 AAA) · `--mute #8A8A87` (5.1:1 AA) · `--line #2A2A2A` · `--line-hi #3D3D3D` · `--accent #5B9BE0` (5.4:1 AA; subido desde `#1E5FA8` que daba 4.05:1 borderline) · `--accent-soft #102A47` · `--positive #4ADE80` · `--negative #F87171`.
- Sin `#000` ni `#FFF` puros. Acento sigue siendo el mismo azul, solo ajustado para contraste.

**Mecanismo:**
- `data-theme="dark"` en `<html>`. Tokens en `[data-theme='dark']` de `global.css`.
- `color-scheme: light;` (root) → `color-scheme: dark;` (en el bloque dark) para que form controls nativos y scrollbar respondan.
- Persistencia: `localStorage['omar-theme']`. Sin localStorage cae a 'light' (try/catch).
- Estado inicial: respeta `prefers-color-scheme` del SO si no hay valor guardado.
- Sin FOUC: script `is:inline` en `<head>` antes de cualquier CSS, aplica `data-theme` sincronamente.
- Si el visitante nunca tocó el toggle, los cambios del SO en runtime se reflejan en vivo.

**Toggle UI:**
- Botón cuadrado 36×36 en `Nav.astro` dentro de `nav__cta-wrap`, antes del CTA azul. Visible en desktop y mobile.
- `aria-pressed` y `aria-label` dinámicos ('Cambiar a tema oscuro' / 'Cambiar a tema claro').
- Iconos sol/luna inline SVG stroke 1.5 (Lucide-compatible). Cross-fade + rotación sutil (300ms cubic-bezier). `prefers-reduced-motion` neutraliza la transición.
- Visible action pattern: en light muestra luna ("click → dark"); en dark muestra sol. Estilo Linear/Vercel.

**Favicon dual:**
- `public/favicon-dark.svg` nuevo con `#0D0D0D` bg, `#F5F5F4` ink, `#5B9BE0` accent.
- Layout.astro tiene 2 `<link rel="icon">` con `media="(prefers-color-scheme: light|dark)"`. Sigue el SO (limitación conocida: no JS-driven en todos los browsers).

**`<meta name="theme-color">` dinámico:**
- Inicial `#FAFAF9`. El script del toggle lo actualiza a `#0D0D0D` cuando entra dark y back a `#FAFAF9` cuando entra light. Lo lee la barra del browser en mobile y el chrome OS.

**Ajustes por componente para que nada quede escondido en dark:**
- `ForWho.astro`: `.forwho-card__icon` opacity `0.06 → 0.10` en dark (icono decorativo grande detrás de las cards).
- `Cases.astro`: `.chart__bar` opacity `0.18 → 0.30` en dark (barras de fondo del chart); el pico azul mantiene 100% — sigue siendo el ancla visual.
- `ContactForm.astro`: el caret SVG inline del `<select>` tenía `stroke='%23525252'` hardcoded. Añadida override `[data-theme='dark']` con `%238A8A87` (token `--mute` en dark).
- `global.css`: focus-visible ring de CTAs sobre fondo `--accent` ahora usa `--ink` con `outline-offset: 3px` para no fundirse con el botón (`.hero__cta--primary`, `.contact__submit`, `.nav__cta`, `#wa-float`). Light 8.0:1, dark 3.4:1 (AA UI).

**Footer finale rediseñado (cinta editorial vs bloque oscuro):**
- Markup nuevo en `Footer.astro`: pretitle mono `FIN · COL.III · EDICIÓN 2026` + statement serif `No hay magia. Hay criterio, datos y código.` + wordmark mediano `omar.alvarez` 36px + firma mono `© 2026 omar.alvarez · Colombia · build · 2026.05.11`.
- CSS sustituido completo: bloque ya no es `background: var(--ink)` (que en dark se volvía blanco gigante). Ahora `background: var(--bg)` con `border-top: 0.5px solid var(--line)`. Funciona limpio en ambos temas sin tokens especiales.
- Wordmark: `clamp(48px, 14vw, 180px)` → `clamp(28px, 4vw, 40px)`. Reducción ~4.5× en peak. Pasa de monumento a punto editorial.
- Buildstamp calculado en frontmatter: `${year}.${MM}.${DD}`.
- Quitado el prop `inverse` del Logo — el punto azul se ve igual sobre `--bg` claro u oscuro.

**Archivos tocados:**
- `src/styles/global.css` — bloque `[data-theme='dark']` + regla focus-visible CTAs azules
- `src/layouts/Layout.astro` — script anti-FOUC inline en `<head>`, favicon dual, script de toggle al final del body
- `src/components/Nav.astro` — botón toggle + estilos sol/luna en `nav__cta-wrap`
- `src/components/Footer.astro` — finale completo rediseñado (markup + CSS)
- `src/components/ForWho.astro` — opacity icono en dark
- `src/components/Cases.astro` — opacity chart bars en dark
- `src/components/ContactForm.astro` — caret SVG override en dark
- `public/favicon-dark.svg` — nuevo

**Build:** limpia (`npm run build` → 1.41s, 2 páginas, 0 warnings nuevos).

**Verificación recomendada al operador:**
- Hard reload con SO en light y SO en dark: primer paint correcto, sin parpadeo.
- Click toggle: animación de 300ms, persiste tras F5 y entre `/` y `/recursos`.
- Inspeccionar `<button id="theme-toggle">`: `aria-pressed` y `aria-label` cambian.
- Lighthouse Accessibility ≥95 en ambos temas.
- Tab por la nav: focus rings visibles sobre `nav__cta` azul y `theme-toggle` en ambos temas.
- Mobile 375px: toggle visible antes del hamburger, finale del footer respira sin bloque negro.

---

## 2026-05-11 — Fix letras serif cortadas + instalación ui-ux-pro-max + mejoras UX

Operador reportó dos casos de letras serif cortadas en headlines: "la última e de **decide**" en el hero y descenders en "trabajo con operadores que ya tienen tracción y necesitan apalancarse con IA" en ForWho. Bug fix global en el motor de split-reveal + activación de la skill `ui-ux-pro-max` y aplicación de sus guidelines.

### Fix split-reveal clipping (`src/styles/global.css` + `src/scripts/splitText.ts`)

**Diagnóstico:** cada palabra animada se envuelve en `<span class="word"><span class="word__inner">…</span></span>`. `.word` tenía `overflow: hidden` con `padding-bottom: 0.05em` para alojar el `translateY(115% → 0)` del inner. **Pero el overflow:hidden se quedaba permanentemente activo** — descenders, swashes serif (Instrument Serif italic) y el underline accent del `.accent-italic` (con `text-underline-offset: 0.12em`) caen fuera del `line-height: 1.0` y eran clipados.

**Solución (no rompe la animación editorial):**
- `padding-bottom: 0.05em → 0.18em` + `margin-bottom: -0.18em` (compensa para no afectar el flow vertical entre líneas).
- Nueva clase `.word.is-shown { overflow: visible; }` que se aplica **por palabra individual** vía `transitionend` listener en `attachShownListener()` — filtrado por `propertyName === 'transform'`. Esto preserva la cascada de stagger: las palabras que aún están animándose mantienen su clip; las que terminan se liberan.
- Branch `prefers-reduced-motion`: marca todas las `.word` como `.is-shown` inmediatamente (no hay transition que esperar).

**Build:** limpio (`npm run build` → 1.86s, 2 páginas).

### Activación de `ui-ux-pro-max` (NextLevelBuilder v2.5.0)

- Skill ya estaba clonada en `~/.claude/skills/ui-ux-pro-max/` pero sin manifest `SKILL.md` → no era invocable.
- Ejecutado `npx uipro-cli init --ai claude` (desde el proyecto): generó SKILL.md + copia de datasets en `./.claude/skills/ui-ux-pro-max/`.
- Movido el SKILL.md generado a `~/.claude/skills/ui-ux-pro-max/SKILL.md` (scope global) y eliminado `./.claude` del proyecto para no contaminar el repo.
- Verificado: la skill aparece en la lista de "Available skills" del harness automáticamente, sin necesidad de `/reload-plugins`. El operador la puede invocar como `/skill ui-ux-pro-max`.

### Evaluación de la landing con `ui-ux-pro-max` (11 queries Python)

Queries ejecutadas vía `python3 ~/.claude/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`:

| # | Query | Dominio | Hallazgo accionable |
|---|---|---|---|
| 1 | personal portfolio consulting B2B WhatsApp lead conversion | ux | 0 resultados (query muy específica) |
| 2 | form friction | ux | **Submit Feedback** (HIGH): "Show loading then success/error". Form Labels (HIGH): ya cumplido. |
| 3 | contrast | ux | Confirma WCAG 4.5:1 — ya implementado en dark mode |
| 4 | focus | ux | Visible focus rings — ya implementado |
| 5 | accessibility | ux | 8 resultados. Crítico: **Error Messages aria-live** (HIGH); Alt Text, ARIA Labels, Keyboard Nav, Skip Links — todos ya cumplidos |
| 6 | button | ux | Back Button behavior (no aplica a landing estática) |
| 7 | hover | ux | Hover vs Tap (HIGH) — ya con onClick en CTAs primarios |
| 8 | loading | ux | Loading Indicators (HIGH) ya con Loader.astro; Font Loading swap (Medium) verificar |
| 9 | motion | ux | Reduced Motion (HIGH) — ya respetado; Easing out-expo — ya correcto |
| 10 | mobile responsive | ux | Touch Friendly (HIGH) ✓; Viewport meta ✓; Horizontal scroll prevenido ✓ |
| 11 | scroll | ux | **Smooth Scroll** (HIGH): añadir `scroll-behavior: smooth` como fallback nativo |

### Mejoras aplicadas (3 cambios HIGH severity, scope acotado)

1. **`html { scroll-behavior: smooth }` en `global.css`** — fallback nativo si Lenis falla a cargar; ya neutralizado por el bloque `prefers-reduced-motion` existente.

2. **Submit feedback + error handling en `ContactForm.astro`:**
   - Nuevo `<p class="contact__status" role="status" aria-live="polite">` debajo del submit como live region.
   - Estilos `.contact__status` con 3 estados: `loading` (mute), `success` (positive), `error` (negative). `:empty` lo oculta.
   - Script ampliado: validación con `aria-invalid` por campo + autofocus al primero faltante. `setStatus()` actualiza role dinámicamente ('alert' para errores, 'status' para resto). Detecta popup bloqueado (`window.open()` devuelve null) y muestra mensaje claro pidiendo usar el enlace directo del bloque "o directo" abajo.

3. **`autocomplete="organization"` en input de negocio** — mejora UX en navegadores con autofill habilitado.

### Archivos tocados

- `src/styles/global.css` — `[data-split-reveal] .word.is-shown` + `html scroll-behavior: smooth`
- `src/scripts/splitText.ts` — `attachShownListener()` + branch reduced-motion marca palabras shown
- `src/components/ContactForm.astro` — autocomplete, live region status, script validación + error handling
- `~/.claude/skills/ui-ux-pro-max/SKILL.md` (skill activa global)

### Build & verificación

- `npm run build` → 1.46s, 2 páginas, 0 warnings nuevos.
- Operador debe verificar visualmente: "decide" italic con underline accent completo, "ya" italic con underline completo, todos los descenders (j, y, p, g) sin clip en headlines de Hero, ForWho, Services, Method, Cases, About, FAQ, ContactForm.
- Probar form: submit con campos vacíos → mensaje rojo "falta · nombre · negocio · ..." + autofocus. Submit completo → "abriendo whatsapp…" → success o error según pop-up policy.
