# Log — Landing Omar

Bitácora append-only de ingests, decisiones, migraciones y mantenimiento. **No se edita histórico, solo se agrega al final.**

Formato: `## YYYY-MM-DD — Título corto` + cuerpo en 1-3 párrafos o bullets.

---

## 2026-05-18 — Eliminación total de contacto directo + conversión 100% Cal.com

Refactor para descongestionar el WhatsApp personal de Omar (saturado). Cambio de canal de venta: cero contacto directo público (sin WhatsApp ni email visible) → toda conversión por Cal.com (`omaralvarezo/onboarding-20min`).

**Decisión de producto:** "agendar o nada". Email también escondido para evitar canal alternativo a la agenda.

**Cambios:**
- `src/lib/contact.ts`: eliminados `WHATSAPP_NUMBER`, `EMAIL`, `whatsappUrl`, `buildLeadMessage`. Nueva API: `CAL_LINK`, `CAL_NAMESPACE`, `calButtonAttrs({ notes? })`, `calBookUrl()`.
- Nuevo `src/components/CalRuntime.astro`: runtime global Cal.com (init + montaje automático de `[data-cal-inline]`). Montado en `Layout.astro`.
- `src/components/CalEmbed.astro`: agregada variante `accent` (azul brand `#1E5FA8`, filled) para el CTA primario del Hero. Script de init movido a `CalRuntime.astro`.
- `src/components/BookFloat.astro` reemplaza `WhatsAppFloat.astro`: FAB sumi sólido con icono `Calendar`, dispara modal Cal vía `data-cal-link`. Misma lógica de scroll (25% desktop, siempre mobile).
- `Hero.astro`: CTA primaria a `<CalEmbed variant="accent" microcopy="20 min · video · gratuito · sin compromiso" />` + nueva trust-row con "quick win brief 24h · sin venta agresiva · salida en cualquier momento".
- `Nav.astro` (desktop + mobile overlay): `<a>` a WhatsApp → `<button>` Cal "agendar 20 min →".
- `Cases.astro`: icono `MessageCircle` → `LineChart`; clases CSS `.wa*` renombradas a `.report*`; CTA closer "hablar por whatsapp" → "agendar 20 min" como `<button>`. Título descriptivo del caso Enzo ("...por WhatsApp") se conserva — describe la entrega real al cliente, no es canal de contacto.
- `Footer.astro`: columna "contacto" → "agendar"; eliminadas entries `email` y `whatsapp`; CTA `agendar 20 min` en azul como primera entrada; sociales conservadas.
- `AreaIndex.astro` y `recursos.astro`: CTAs WhatsApp → buttons Cal con `notes` pre-rellenadas.
- `Services.astro`: bullet del servicio 04 "WhatsApp asíncrono..." → "Canal asíncrono privado..."; agregado `microcopy="20 min · gratuito · sin compromiso"` a los 4 `<CalEmbed />`.
- `ContactForm.astro` (sección 07): reescritura completa (~430 → ~210 líneas). Eliminado form + validación + selects + JS de submit. Nuevo diseño split editorial 5/7 en desktop: izquierda con headline + lede + timeline 3 pasos (agendas → llamada → brief 24h) + trust badges; derecha con `<div data-cal-inline>` que renderiza el calendario embebido directo (cero click extra al modal). Fallback `<noscript>` a `cal.com/omaralvarezo/onboarding-20min`.
- `FAQ.astro`: P7 ("¿Por qué 20 min?") y P8 ("Quick Win Brief") subidas a posiciones 1 y 2 — las que más reducen fricción para agendar.
- `Layout.astro`: eliminado `"email"` del JSON-LD Schema.org Person. Importa `<BookFloat />` y `<CalRuntime />`.
- README.md + CLAUDE.md actualizados.

**Verificación:**
- `grep -rE "wa\.me|WHATSAPP_NUMBER|whatsappUrl|573202569486|omaraalvarezo@gmail" src/` → 0 matches.
- `npm run build` limpia (sin errores TS, sin imports rotos).
- `grep -rE "573202569486|omaraalvarezo@gmail|wa\.me" dist/ .vercel/output/` → 0 matches en el bundle.
- Únicas menciones "WhatsApp" residuales en código (esperadas, contenido descriptivo): `Cases.astro` línea ~28 (título del caso Enzo) y `src/data/resources.json` (resource `prompt-bot-whatsapp-reportes` — describe lo que Omar construye para clientes).

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


---

## 2026-05-22 · Pivot a consultoría 1:1 por sesión

### Por qué

La oferta anterior (4 servicios escalonados) sonaba a agencia y diluía el
mensaje: el visitante no sabía cuál tomar primero, los precios estaban
escondidos detrás de tiers internos (Esencial/Estándar/Avanzado, Light/Plus),
y el copy decía "operadores" con voz de PowerPoint. Omar quiere posicionarse
como operador-que-también-consulta, con una sola línea de servicio cobrada
por sesión.

### Cambios por sección

| Sección | Archivo | Cambio |
|---|---|---|
| Hero | `Hero.astro` | Badge "AGENDA ABIERTA · SESIONES 1:1", bajo reescrito anclando Enzo + Arkhē, trust-row sin Quick Win |
| 01 Perfil | `Profile.astro` | Headline "Operador de dos negocios. Documento lo que construyo", párrafos en primera persona, foto placeholder comentado se mantiene |
| 02 Para quién | `ForWho.astro` | Título nuevo + 3 perfiles reescritos (incluye ejemplo concreto de Enzo en perfil 02) |
| 03 Servicios | `Services.astro` | REFACTOR MAYOR: 4 → 2 tarjetas (Sesión 1:1 + Pack de 5), `label` y `investment` como campos nuevos, accents indigo/musgo eliminados |
| 04 Método | `Method.astro` | 4 pasos: llamada 20min → preparación 24h → sesión 90min → cierre 48h+7d async |
| 05 Casos | `Cases.astro` | Solo CTA final + notes pre-llenado del modal |
| 06 FAQ | `FAQ.astro` | -3 (Quick Win, diferencia Claude/Mapa, pago 4 esquemas) +5 (decidir entre sesión/pack, pago nuevo, duración pack, garantía, upgrade) +5 reescritas. Total 11. |
| 07 Contacto | `ContactForm.astro` | Headline "Cuéntame qué te tiene pensando", mini formulario opcional (3 campos) que abre modal Cal con name + notes pre-rellenados |
| Meta | `Layout.astro` | Description + schema.org `jobTitle` y `description` alineados |
| Helper | `contact.ts` | Nuevo `combinePrefillNotes(business, notes)` para formatear notas del Cal modal |
| Default | `CalEmbed.astro` | Default text "agendar onboarding" → "agendar llamada" (no usado en práctica, solo limpieza) |
| Docs | `CLAUDE.md`, `README.md` | Changelog 2026.05.22 + estructura corregida (Profile en lugar de About, 2 servicios, 11 FAQ) |

### Sweep limpio

```
[ok] 'Claude a tu medida'        — 0 hits
[ok] 'Mapa de IA'                — 0 hits
[ok] 'Implementación a tu medida'— 0 hits
[ok] 'Acompañamiento mensual'    — 0 hits
[ok] 'Quick Win'                 — 0 hits
[ok] '2 CUPOS' · 'Q2 2026'       — 0 hits
[ok] 'Tres tiers' · 'Tres rangos'— 0 hits
```

(El hit residual de "facturación" estaba en un prompt de /recursos sobre
migración de software contable, no relacionado con la oferta antigua.)

### Build & verificación

- `npm run build` → pasa limpio en cada commit (9 commits total).
- Pendiente verificación visual: probar mini formulario de pre-llenado con
  campos vacíos (debe llevar al inline embed por scroll) y con campos
  llenos (debe abrir modal Cal.com con name + notes pre-rellenados).
- FAQ ahora con 11 items: verificar que el accordion no rompa layout
  cuando varios estén abiertos a la vez (cada `<details>` es independiente).


---

## 2026-05-23 (pm) · Corrección: bots son Telegram, no WhatsApp

- ForWho perfil 02: quitada "sistematizar el WhatsApp"; ahora dice "sistematizar
  los reportes diarios y los recordatorios de la operación".
- Cases caso 1 Enzo: título "por WhatsApp" → "por Telegram".
- Cases caso 4 cotizador: flow sublabel "whatsapp · con branding" → "PDF
  compartible · con branding".
- Recurso `/recursos/marketing/prompt-bot-whatsapp-reportes`: migrado a
  `/recursos/marketing/prompt-bot-telegram-reportes` (slug, título,
  longDescription, fileName + .md renombrado y contenido actualizado:
  formato Telegram, Telegram Bot API).
- Mantenidas las menciones a WhatsApp en Services + Method donde describen
  el canal humano de chat con clientes 1:1 (no es bot, es Omar respondiendo
  desde su número).

**Riesgo:** URL vieja `/recursos/marketing/prompt-bot-whatsapp-reportes` ya
no resuelve. Recurso reciente (2026-04-27), bajo riesgo de backlinks. Sin
redirect; se evalúa caso por caso si aparecen 404.

---

## 2026-08-19 · v3.0 — oferta única de dos horas, Wompi y Cal.com

- Reposicionada la marca: de "consultor de IA" a operador que convierte problemas de empresas de
  servicios en decisiones, arquitectura y primeras piezas viables.
- Única oferta pública: 120 minutos por `$2.400.000 COP`. Eliminados del home la llamada gratuita,
  la sesión de 90 minutos y el pack de cinco.
- Home reconstruido desde cero en `src/components/consulting/ConsultingLanding.astro`, con dirección
  "expediente de trabajo": papel, grafito, azul señal, reglas y tablas editoriales. Sin bento grids,
  gradientes, glows, loader, cursor personalizado ni scroll artificial.
- Checkout en `POST /api/consultoria/checkout`: valida brief, fija precio server-side, genera referencia
  y firma SHA-256 del Checkout Web de Wompi.
- Verificación en `/api/consultoria/status` y `/consultoria/agendar`: la agenda solo se revela cuando
  Wompi confirma `APPROVED` + referencia correcta + monto exacto + COP. `PENDING` hace polling; ningún
  error asume éxito.
- Cal.com recibe nombre, correo, negocio, problema y WhatsApp desde `sessionStorage`; no se agregó una
  base de datos para leads.
- Actualizados OG, schema.org, CSP, `.env.example`, README e índice wiki.
- Saneado el typecheck preexistente: runtime Cal tipado correctamente y HMAC del admin migrado de
  `node:crypto`/`Buffer` a Web Crypto. `astro check`: 0 errores.

## 2026-08-19 · Evento de consultoría configurado en Cal.com

- Creado el evento oculto `omaralvarezo/consultoria-2-horas` con 120 minutos de duración y Cal Video.
- Descripción alineada con la oferta: preparación previa, documento de cierre, grabación y 7 días de
  dudas puntuales.
- Creada y asignada una disponibilidad exclusiva de lunes a viernes, 9:00–17:00 America/Bogota,
  sujeta a conflictos del Google Calendar principal.
- Configurados 48 horas de aviso mínimo y buffers de 30 minutos antes y después de cada sesión.
- Ocultada la opción de añadir invitados en el formulario; nombre, correo y notas siguen disponibles
  para recibir el brief prellenado desde la landing.
- Verificado manualmente el enlace público: el calendario muestra bloques reservables de dos horas.
- Activada la confirmación manual de todas las reservas: un enlace de Cal.com compartido no basta para
  obtener una sesión; la referencia se contrasta con Wompi antes de aprobarla.

## 2026-08-19 · Comercio Wompi personal conectado a producción

- Omar confirmó que el comercio usado por Adjudika es su comercio personal y que liquida a su banco.
- `landing-omar` quedó enlazado con el proyecto Vercel que sirve `omaralvarezo.co`.
- Copiadas a Vercel Production la llave pública y el secreto de integridad como variables sensibles,
  sin escribirlos en Git ni mostrarlos en la salida.
- Configurados `WOMPI_ENVIRONMENT=production`, `PUBLIC_SITE_URL=https://omaralvarezo.co` y
  `CAL_CONSULTING_LINK=omaralvarezo/consultoria-2-horas`.
- Prueba local con credenciales reales, sin cobro: Checkout Web generado para `240000000` centavos,
  `COP`, referencia `oa-consultoria-2h-*`, firma de integridad y retorno a `/consultoria/agendar`.

## 2026-08-19 · v3.0 desplegada en producción

- Despliegue Vercel `dpl_HG5iHjg6KqFWwt4XsKdq95Krspwm` construido correctamente y promovido al
  dominio canónico `https://omaralvarezo.co`.
- Verificado en producción: HTTP 200, cabeceras de seguridad, nueva propuesta única, precio visible y
  cero menciones de la llamada gratuita, sesión de 90 minutos o pack de cinco.
- Endpoint real `/api/consultoria/checkout` probado sin pago: genera Wompi por `$2.400.000 COP`, firma,
  referencia esperada y retorno a `https://omaralvarezo.co/consultoria/agendar`.
- Único paso operativo pendiente: ejecutar una compra real controlada de punta a punta y luego aprobar
  manualmente la reserva de Cal.com.

## 2026-08-19 · v3.1 — pricing conductual, TikTok y TRM dinámica

- Investigados efectos de dígito izquierdo, precisión, redondeo, señal de descuento/calidad y valor
  nominal en moneda extranjera. La evidencia y sus límites quedaron documentados en
  `wiki/sintesis/precio-psicologico-trm-tiktok.md`.
- Precio base cambiado a `USD 797`: queda por debajo del umbral 800 sin usar `799`, preserva el ticket
  premium y evita presentar la consultoría como infoproducto barato.
- Recorrido reordenado para tráfico de TikTok: continuidad con el contenido → problema → evidencia →
  método → costo de equivocarse → encaje → FAQ → precio y formulario. El hero y la barra superior ya
  no muestran precio ni llevan directo al checkout.
- Añadida garantía operativa: si el brief no cabe o no hay encaje, la reserva no se aprueba y se devuelve
  el 100%. Sin descuentos falsos, temporizadores, cupos inventados o anclas tachadas.
- Nuevo `src/lib/trm.ts`: consulta el dataset oficial `32sa-8pi3`, selecciona la vigencia de Bogotá,
  valida rango, cachea 15 minutos por fecha y usa `TRM_FALLBACK_COP` solo si falla la fuente.
- Nuevo `GET /api/consultoria/quote`: expone USD, TRM, equivalente exacto COP, fecha y fuente. La landing
  muestra ambos valores antes de pagar.
- El checkout recalcula server-side, firma el monto COP y lo codifica en la referencia. La verificación
  exige que el pago aprobado coincida con ese monto; las referencias antiguas por `$2.400.000 COP`
  siguen siendo válidas.
- Validación con credenciales reales, sin cobro: `USD 797 × TRM 3.098,79 = COP $2.469.736`; endpoint y
  Wompi coinciden en monto, moneda, referencia y firma.
- QA de producción detectó el beacon de Cloudflare bloqueado por CSP y un script de Vercel Analytics
  en 404 detrás del proxy. CSP ampliada únicamente para Cloudflare Insights y retirada la segunda
  integración rota de Vercel; se conserva una sola fuente de analítica de tráfico.
- Despliegue final `dpl_35ogvHbGtYJSQdB2UyaKw9te2oLp` promovido a `https://omaralvarezo.co`.
  QA posterior en escritorio y móvil: sin desbordamientos, sin errores de consola y con el precio
  ubicado después de evidencia, método, encaje y preguntas frecuentes.
- Verificación final de producción, sin ejecutar pago: cotización oficial por `USD 797`, TRM
  `3.098,79`, total `COP $2.469.736`; el checkout devuelve el mismo monto, una referencia válida y
  una URL firmada de Wompi para ese valor exacto.

## 2026-08-20 · v3.2 — Marco 4C y tasa operativa diaria

- Sintetizado el **Marco 4C para empresas de servicios** a partir de Enzo, Arkhē, Adjudika y el
  cotizador/CRM de Enzo: `Captar → Convertir → Cumplir → Continuar`, con IA como capa transversal y
  responsabilidad humana sobre las decisiones sensibles.
- Reescrita la landing para dueños y socios: problemas de captación, CRM/seguimiento, dependencia del
  dueño, entrega y postventa; el recorrido explica el sistema completo antes de revelar el precio y
  abrir el brief.
- El brief ahora exige escoger una etapa del Marco 4C. Esa selección viaja a las notas prellenadas de
  Cal.com junto con negocio y problema.
- Añadido spread explícito de `1,65%` sobre la TRM oficial, con redondeo hacia arriba al múltiplo de
  `$10 COP`. Ejemplo contractual: TRM `$3.000` → tasa aplicada `$3.050`.
- Eliminado el fallback manual de TRM. Solo se acepta una vigencia oficial que incluya la fecha actual
  de Bogotá; una lectura verificada puede reutilizarse en memoria durante esa misma fecha. Si la fuente
  oficial no responde y no existe esa lectura, el checkout se bloquea.
- Creada la presentación entregable `public/resources/marco-4c-servicios-omar-alvarez.pptx`, con ocho
  láminas, notas de fuentes y revisión visual/overflow completa.
- QA local escritorio/móvil: sin errores de consola ni desbordamiento horizontal. Cotización del día:
  `USD 797 × tasa aplicada $3.110 = COP $2.478.670`, derivada de TRM oficial `$3.053,48` vigente desde
  `2026-08-20`.
- Checkout validado sin pago: monto `247867000` centavos, moneda `COP`, referencia con monto/fecha y
  firma de integridad presentes. `astro check` mantiene cero errores y el build de Astro completa.

## 2026-08-20 · v3.3 — “Sistema vivo / taller abierto”

- Auditadas la landing anterior, la implementación y secuencia de scroll de Enzo Motorsport, el home,
  reservas, Planeador y brandbook original de Arkhē, la voz pública de TikTok y el inventario de casos
  reales. La conclusión: la capa editorial beige/serif convertía a Omar en “consultor de revista” y no
  representaba el lenguaje de sistemas, color, operación y experimentación de sus proyectos.
- Dirección reemplazada por un híbrido propio: hero nocturno “Sistema vivo” + cuerpo colorido “Taller
  abierto”. El protagonista no es un carro, robot u objeto 3D: son señales de TikTok, WhatsApp, CRM,
  operación y postventa que se conectan en las 4C.
- Creado `SystemIgnition.astro`, mapa SVG code-native con cuatro fases ligadas a scroll nativo. Usa
  `requestAnimationFrame` solo mientras el hero está visible, pointer fino opcional y una versión
  estática equivalente para `prefers-reduced-motion`.
- `ConsultingLanding.astro` reconstruida de punta a punta: origen operativo, cuatro métricas reales,
  principio problema→herramienta, stack sticky 4C, rail de Enzo/Arkhē/Adjudika/Grupo Enzo, ruta de la
  sesión, encaje, costo de equivocarse, FAQ y precio únicamente al final.
- Sistema visual nuevo: Bricolage Grotesque Variable + IBM Plex Sans Variable + IBM Plex Mono;
  ink `#131118`, bone `#FFF8EA`, C1 coral `#FF6B45`, C2 púrpura `#C79AFF`, C3 cobalto profundo
  `#4B5FE3` y C4 lima `#C8FF3D`. El cobalto se profundizó para conservar contraste AA con texto bone.
- Checkout y handoff pago→Cal.com rediseñados con la misma semántica 4C. Se conservaron los campos,
  validaciones, cotización diaria, spread, `sessionStorage`, firma Wompi, polling y montaje de Cal.com.
- Nuevo OG 1200×630, meta/título actualizados y `theme-color` oscuro configurable desde `Layout`.
- QA Playwright a 1440×1000 y 390×844: fases de hero, tipografía, orden 4C, rail, formulario completo,
  overflow, consola, reduced motion y handoff inválido. Cotización real sin pago: `USD 797`,
  `spreadBps=165`, tasa operativa mayor o igual a TRM. `astro check` sin errores nuevos y build exitoso.
- Se preservó sin tocar ni versionar el temporal de PowerPoint
  `public/resources/~$marco-4c-servicios-omar-alvarez.pptx`.

## 2026-08-20 · v3.3 publicada y verificada en producción

- Commit principal `fa39629` y pulido móvil `4be5ba3` enviados a `main`.
- Build precompilado promovido al dominio canónico mediante Vercel:
  `dpl_3y5d81ob18mAx6xPRyKLKhfpyBog` → `https://omaralvarezo.co`.
- QA final contra el dominio real en desktop, móvil y reduced motion: HTTP 200, CSP/HSTS/nosniff,
  una sola H1 del producto, Bricolage cargada, cero overflow horizontal y cero errores de consola.
- El hero llega a fase conectada; la navegación se retira al bajar y vuelve al subir; el precio sigue
  ausente del hero y aparece únicamente en la reserva.
- `/api/consultoria/quote` devolvió TRM oficial `$3.053,48`, tasa operativa `$3.110`, total
  `COP $2.478.670` y spread `1,65%` para `USD 797`.
- `POST /api/consultoria/checkout` probado sin efectuar pago: referencia con monto/fecha, firma de
  integridad, moneda COP, retorno canónico a `/consultoria/agendar` y URL de Wompi válidos.
- `/consultoria/agendar` sin referencia permanece bloqueada en verificación; Cal.com no se revela por
  asumir éxito. El pago real controlado sigue siendo la única prueba manual pendiente.

## 2026-08-20 · v3.4 — Recuperación durable de pagos Wompi

- El checkout de Wompi aceptaba monto, firma y métodos correctamente; la falla estaba después del
  pago. El flujo dependía del redirect del navegador y de aproximadamente 30 segundos de polling,
  sin una orden durable ni webhook propio para la consultoría.
- El checkout ahora persiste primero una orden con cotización, brief, referencia y monto exacto en
  el almacén interno de Adjudika. Si la escritura falla, no se devuelve una URL que permita pagar.
- Cada compra recibe un UUID público y una cookie aleatoria `HttpOnly; Secure; SameSite=Lax`; el
  secreto no viaja a Wompi, no aparece en la URL y no se expone a JavaScript.
- El regreso vive en `/consultoria/agenda/<orderId>`. Puede resolver el pago por el `id` devuelto por
  Wompi o por el estado persistido desde el webhook, de modo que cerrar la pestaña o una confirmación
  tardía ya no obliga a pagar otra vez.
- La verificación del navegador se extendió a 150 segundos y recarga el render privado al aprobarse;
  el brief guardado se prellena en Cal.com solo después de autorizar orden y cookie.
- Las rutas privadas llevan `no-store`, `noindex` y `Referrer-Policy: no-referrer`; las rutas antiguas
  por transaction ID siguen disponibles solo para cobros emitidos antes de esta versión.
