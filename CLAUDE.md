# PROYECTO: Landing Omar Álvarez — Marca Personal v2.1

## Contexto del proyecto

**Dueño:** Omar Álvarez — CEO de Grupo Empresarial Enzo S.A.S. (Enzo Motorsport + Arkhē Coworking), Cúcuta, Colombia.
**Objetivo:** Landing world-class para vender consultorías de IA aplicada a operación real de pymes LATAM. Conversión vía WhatsApp.
**Brand:** sigue **omar-brand v2.1** (skill `omar-brand-SKILL-v2.1.md` del brand kit OAAO). Toda decisión visual debe consultar primero ese SKILL.

**Benchmark visual obligatorio:** Stratechery, The Generalist, Linear, Vercel docs, Attio, Brittany Chiang. Si no se siente al nivel, no está terminada.

---

## Arquitectura — tres capas (patrón Karpathy LLM Wiki)

```
raw/      → fuentes inmutables. LLM lee, NUNCA modifica ni borra.
wiki/     → conocimiento sintetizado. LLM crea y mantiene. Omar lee.
src/      → código Astro de producción (componentes, layouts, páginas).
CLAUDE.md → este archivo. Schema del proyecto. Co-evoluciona con Omar.
index.md  → catálogo de páginas wiki y fuentes raw relevantes.
log.md    → bitácora append-only (ingests, decisiones, migraciones).
```

**Heurística de delineación:**

| Pregunta | Si SÍ → |
|---|---|
| ¿Es un brief original, screenshot de competencia, mensaje WhatsApp con feedback, captura de Stratechery? | `raw/` |
| ¿Es una decisión de diseño / copy / SEO con su porqué? | `wiki/decisiones/` |
| ¿Es un framework, métrica, principio editorial? | `wiki/conceptos/` |
| ¿Es un análisis cruzado entre fuentes? | `wiki/sintesis/` |
| ¿Es código de producción (componente, layout, página)? | `src/` |

---

## Convenciones de nombres

```
DIRECTORIOS:
  kebab-case, sin tildes, sin mayúsculas, sin espacios.

RAW (fechado siempre):
  raw/{tipo}/YYYY-MM-DD-{descriptor-kebab}.{md|png|jpg|pdf}
  Ejemplos:
    raw/briefs/2026-05-11-objetivo-conversion-whatsapp.md
    raw/benchmarks/2026-05-11-stratechery-hero.png
    raw/capturas/2026-05-11-feedback-cliente.png
    raw/notas/2026-05-11-conversacion-positioning.md

WIKI (sin fecha en nombre, frontmatter lleva las fechas):
  Decisiones: wiki/decisiones/{slug}.md
  Conceptos:  wiki/conceptos/{slug}.md
  Síntesis:   wiki/sintesis/{slug}.md
```

---

## Frontmatter obligatorio (wiki)

Todo archivo `.md` en `wiki/` lleva frontmatter YAML:

```yaml
---
titulo: "Nombre legible de la página"
tipo: decision | concepto | sintesis
dominio: [diseño, copy, seo, conversion, brand, infra, performance]
tags: [tag1, tag2]
fuentes:
  - "[[raw/briefs/2026-05-11-objetivo-conversion-whatsapp]]"
  - "[[wiki/conceptos/jerarquia-editorial]]"
creado: YYYY-MM-DD
actualizado: YYYY-MM-DD
---
```

**Obligatorios:** `titulo, tipo, dominio, creado, actualizado`.
**Opcionales:** `tags, fuentes` (pero `fuentes` debería estar casi siempre).

**Dominios fijos** (no inventar nuevos sin preguntar):
- `diseño` — paleta, tipografía, espaciado, composición visual
- `copy` — hooks, body, microcopy, CTAs, tono editorial
- `seo` — meta tags, OG, sitemap, schema.org, keywords
- `conversion` — flujo WhatsApp, posicionamiento de CTAs, A/B, friction
- `brand` — identidad v2.1, voz, jerarquía 3 familias
- `infra` — Astro, Tailwind, build, deploy, Vercel, dominios
- `performance` — Lighthouse, LCP, fuentes, imágenes, bundle

---

## Sistema de diseño (resumen ejecutivo)

### Concepto

Marca personal **operador editorial**. Terminal de builder con alma de editorial de negocios. No japandi, no startup tech bro, no coach de LinkedIn.

**Tagline:** Negocios reales, código real.

### Paleta — un solo acento, fondo claro

| Token | HEX | Uso |
|-------|-----|-----|
| `--bg` | `#FAFAF9` | Lienzo (frío, no blanco puro) |
| `--bg-soft` | `#F4F4F2` | Cards, secciones, separación sutil |
| `--ink` | `#0A0A0A` | Texto principal, titulares, números |
| `--ink-soft` | `#262626` | Cuerpo largo |
| `--mute` | `#525252` | Metadatos, captions, etiquetas |
| `--line` | `#E5E5E2` | Bordes, divisores |
| `--line-hi` | `#D4D4D0` | Hover borders |
| `--accent` | `#1E5FA8` | **Único acento.** Datos clave, links, CTAs, punto del logo |
| `--accent-soft` | `#E8F0FA` | Tags, highlights, badges |
| `--positive` | `#15803D` | Delta financiero positivo (uso restringido) |
| `--negative` | `#B91C1C` | Delta financiero negativo (uso restringido) |

### Reglas críticas de color

1. **NUNCA `#000000`.** Siempre `--ink` (`#0A0A0A`).
2. **NUNCA `#FFFFFF`.** Siempre `--bg` (`#FAFAF9`).
3. **Un solo acento.** El azul. Si la pieza necesita un segundo color, no lo necesita.
4. **Sin gradientes, sombras, glows, blur, neón.** Plano, plano, plano. (Excepción: `mask-image` con gradient para fade-out funcional, no visible.)
5. **El azul nunca decora.** Solo carga sentido: número clave, link, CTA, palabra que el lector debe recordar, punto del logo.
6. **Acento <8% por viewport.** Excepción: el punto del logo.

### Tipografía — sistema 3-familias (landing)

> La landing **no aplica** la regla "Mono 95%" del SKILL OAAO v2.1 puro (ese aplica a decks y social). Aquí rige el sistema 3-familias documentado en `wiki/decisiones/tipografia-3-familias-landing.md`.

| Familia | Rol | Aprox. % |
|---------|-----|---------|
| **Instrument Serif Regular** | Headlines editoriales (`display-1`, `display-2`, `h2-section`), hooks, palabra protagonista (`accent-italic`), tagline + statement del footer | ~15% |
| **Geist Sans Variable** | Cuerpos largos (`body-lg`, `body`), descripciones de card, H3 de card (`h3-card`), preguntas FAQ | ~55% |
| **Geist Mono Variable** | Toda meta-info: paths, timestamps, etiquetas CAPS, números grandes (`number-display`), CTAs, badges, marquee, footer cols, captions del chart, FACT-XX, copy de mocks, logo wordmark | ~30% |

**Tracking:**
- `-0.04em` en displays de número grande
- `-0.025em` en logo
- `-0.02em` en H2/H3 sans
- `-0.018em` en serif (display-1, display-2, h2-section)
- `-0.005em` body sans
- `+0.18em` en etiquetas CAPS mono, `+0.04em` en path/meta mono

**Reglas:**
- Instrument Serif Regular para headlines y máximo **1 hook por sección** (palabra subrayada en azul via `.accent-italic`).
- Sans para body largo. Mono para body solo cuando es textura ambiente (mocks).
- Nunca bold pesado (>500). Sans 400/500. Mono 400/500.
- Etiquetas CAPS solo en mono.
- Números grandes y deltas siempre en mono.
- Acento azul `#1E5FA8` único, <8% por viewport, carga señal nunca decora.

### Sistema de tamaños

- Display 1 (Instrument Serif): `clamp(48px, 8vw, 112px)` lh 1.0
- Display 2 (Instrument Serif): `clamp(36px, 5vw, 72px)` lh 1.05
- H2 sección (Geist Mono Medium): `clamp(28px, 3.5vw, 56px)` lh 1.05
- Body: 15px lh 1.6
- Caption: 13px lh 1.5
- Mono label: 11px CAPS tracking 0.18em
- Path/meta: 11px tracking 0.04em
- Número grande (mono): `clamp(28px, 4vw, 40px)+` tracking -0.04em

### Spacing

- Container: `max-w 1280px`, padding lateral `clamp(20px, 4vw, 48px)`
- Vertical entre secciones: `clamp(80px, 12vw, 200px)`
- Grid de 12 columnas

### Logo / wordmark

| Variante | Composición | Uso |
|----------|-------------|-----|
| Principal | `omar.alvarez` Geist Mono Medium 500, punto en `--accent` | Header de landing, footer, OG image, firma |
| Avatar | `o.a` mismo tratamiento | Foto de perfil de redes (cuadrado) |
| Favicon | `o.` mismo tratamiento | Tab del navegador, app icon |

**Reglas duras:** nunca rotar, estirar, deformar. Nunca añadir sombra/outline/glow. Nunca cambiar el color del punto. Nunca usar sobre fondo de acento sólido.

Componente: `src/components/Logo.astro` con props `variant` (`horizontal | avatar | mark`), `size`, `inverse`.
SVGs canónicos en `public/brand/`. Favicon en `public/favicon.svg`. OG en `public/og-image.svg`.

### Voz y tono

**Operador documentando.** Presente sobre pasado. Datos antes que adjetivos. Frases cortas. Cero emojis decorativos. Sin urgencia fabricada. Inglés solo en términos técnicos reales (prompt, API, P&L, MRR).

**SÍ:** margen, flujo de caja, P&L, runway, palanca, tracción, criterio, oficio, prompt, flujo, KPI, throughput, CAC, ratio, delta, dependencia, cuello de botella.

**NO:** hackear, mindset, libertad financiera, 10x, sinergia, disrupción, unlock, game-changer, mover la aguja, escalar al infinito.

---

## Sistema de motion

### Reglas globales
- **Easing default:** `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo, premium)
- **Duraciones:** 0.3s micro · 0.6s entrada · 1.2s revelación grande
- **Triggers:** IntersectionObserver siempre. Nunca scroll listeners.
- **`prefers-reduced-motion: reduce`:** desactiva loader, cursor, splits, reveals, marquee, pulse.

### Microinteracciones implementadas

1. **Cursor custom (desktop only):** dot 6px ink + ring 32px border ink. Hover sobre links/botones → ring 48px se llena de azul. Magnetic effect en CTAs (data-magnetic). Sin mix-blend-mode.
2. **Hover en cards/links:** `translateY(-2px)` + cambio de `border-color` `--line` → `--line-hi`. Sin shadows.
3. **Botones primarios:** background `--accent` sólido, hover baja opacity a 0.85. CTAs con `border-radius: 0` (no pills) para look editorial.
4. **Text reveal en scroll:** split por palabras, stagger 40ms, `translateY(115% → 0)` + opacity 0→1. CSS-driven con clase `.is-revealed`.
5. **Marquee infinito:** 40s loop, pause on hover. Separadores en `--line-hi` (no azul). Mask-image lateral para fade.
6. **Counters animados:** count-up out-expo 1.5s al entrar en viewport.
7. **Scroll progress:** barra `--accent` 2px arriba.
8. **Pulse del dot del badge:** scale + opacity, sin box-shadow.
9. **Form border-bottom:** pseudo-elemento `::after` con width 0→100% en focus, sin gradient hack.
10. **Section header recurrente:** `[NN · PILAR]` izq + `~/omar.alvarez · YYYY.MM.DD` der, con border-bottom 0.5px `--line`. Componente `SectionLabel.astro`.

### Animaciones eliminadas (v2.1)

- Background grid del Hero (decorativo).
- Lima glow blob del Hero (gradiente prohibido).
- Box-shadow del pulse del dot.
- Box-shadow del WhatsApp FAB.
- Backdrop-filter blur del Nav.
- Mix-blend-mode difference del cursor.
- Foto duotono lima en About (B&N puro o sin filtro).
- Grain noise SVG sobre `<body>` (era anti-banding de negros, no aplica en claro).
- Italic decorativo en Instrument Serif (brandbook v2.1 manda Regular).

---

## Estructura del proyecto

```
src/
├── pages/
│   ├── index.astro          ← Hero → Footer
│   └── recursos.astro
├── layouts/
│   └── Layout.astro         ← Head, OG, schema.org Person
├── components/
│   ├── Logo.astro           ← Wordmark omar.alvarez (3 variantes)
│   ├── Hero.astro           ← Header + badge + headline serif + CTAs + métricas
│   ├── Marquee.astro        ← Strip infinito 40s
│   ├── ForWho.astro         ← 01 · 3 cards buyer personas
│   ├── Services.astro       ← 02 · 3 servicios asimétricos
│   ├── Method.astro         ← 03 · timeline 4 pasos
│   ├── Cases.astro          ← 04 · bento 3 casos (Enzo + Arkhē + O&P)
│   ├── About.astro          ← 05 · placeholder o.a + bio v2.1
│   ├── FAQ.astro            ← 06 · 6 details
│   ├── ContactForm.astro    ← 07 · form → WhatsApp prellenado
│   ├── Footer.astro         ← 4 cols + cierre con wordmark sobre --ink
│   ├── Nav.astro            ← Sticky logo + links + CTA azul
│   ├── SectionLabel.astro   ← Header recurrente [PILAR] + path/timestamp
│   ├── Loader.astro         ← Preloader 1.2s
│   ├── CustomCursor.astro   ← Dot + ring (desktop only)
│   ├── ScrollProgress.astro ← Barra azul 2px top
│   └── WhatsAppFloat.astro  ← FAB 56px aparece tras 25% scroll
├── scripts/
│   ├── motion-utils.ts
│   ├── lenis.ts
│   ├── cursor.ts
│   ├── scrollProgress.ts
│   ├── loader.ts
│   ├── splitText.ts
│   ├── counter.ts
│   └── magnetic.ts
├── styles/
│   └── global.css           ← Tokens v2.1, typography, reveals
└── lib/
    ├── contact.ts           ← WHATSAPP_NUMBER, EMAIL, helpers
    └── utils.ts

public/
├── favicon.svg              ← favicon-o.svg del brand kit
├── og-image.svg             ← OG card claro con wordmark
├── logo-mark.svg            ← legacy (no usado)
└── brand/                   ← Brand kit oficial OAAO
    ├── favicon-o.svg
    ├── avatar-o-a-claro.svg
    ├── avatar-o-a-oscuro.svg
    ├── logo-omar-alvarez-claro.svg
    └── logo-omar-alvarez-oscuro.svg
```

---

## Datos centralizados
Todo en `src/lib/contact.ts`:
- `WHATSAPP_NUMBER = "573202569486"`
- `EMAIL = "omaraalvarezo@gmail.com"`
- Helpers `whatsappUrl()` y `buildLeadMessage()`

---

## Decisiones de arquitectura

| Decisión | Razón |
|----------|-------|
| Astro 4 (no Next) | Cero JS por defecto, islands, perfect Lighthouse |
| Tailwind 3 (no v4) | v3 estable, ecosistema completo, integración oficial |
| Motion One (no Framer Motion) | Más ligero, web-standards, Animations API nativa |
| Lenis (no Locomotive) | Mantenido, vanilla JS, interopera con anchors nativos |
| Sin backend | Form → WhatsApp directo. Cero latencia, cero costos. |
| Sin Vercel KV/Postgres | Landing 100% estática |
| **Geist Mono única familia mono** (sin Geist Sans) | Brandbook v2.1 manda mono dominante 95% |

---

## Checklist antes de deploy (v2.1)

- ☐ ¿Geist Mono manda 95% / Instrument Serif aparece máx 1 vez por sección?
- ☐ ¿Acento azul ocupa <8% del viewport? (excepción: punto del logo)
- ☐ ¿Logo `omar.alvarez` con punto azul visible en navbar y footer?
- ☐ ¿Header `[NN · PILAR] · ~/omar.alvarez · fecha` en cada sección?
- ☐ ¿Cero gradientes (excepto mask), cero sombras, cero glows?
- ☐ ¿Sin `#000` ni `#FFF` puros en ningún archivo?
- ☐ ¿Iconos Lucide stroke 1.5, sin fill?
- ☐ Build limpia (`npm run build`).
- ☐ Sweep grep de hex/efectos/vocabulario prohibido en 0.

---

## Para retomar después
1. Leer este CLAUDE.md de cabo a rabo.
2. Consultar el SKILL `omar-brand-SKILL-v2.1.md` para cualquier decisión visual.
3. Revisar `src/styles/global.css` para tokens y typography.
4. Revisar `src/lib/contact.ts` para datos operativos.
5. Revisar `public/brand/` para logos canónicos.
6. Continuar desde el último hito del README.md.

## Changelog
- **2026.05.11 (pm)** — Pase frontend-design: reescritura del hero (headline con tensión, badge con cupos, métricas FACT-XX, créditos académicos express), métricas + anotación −41% en Cases, strip de cierre del bento → CTA, selects de calificación opcionales + salida directa WhatsApp/email en ContactForm, statement editorial en footer finale. Decisión tipográfica 3-familias formalizada (`wiki/decisiones/tipografia-3-familias-landing.md`). Reconciliada la sección Tipografía del CLAUDE.md.
- **2026.05** — Migración a omar-brand v2.1: paleta clara `#FAFAF9` + azul señal `#1E5FA8`, sistema 3-familias (serif + sans + mono), wordmark `omar.alvarez` en navbar/footer/OG/favicon, header recurrente con path/timestamp, eliminación de efectos prohibidos (box-shadow, gradientes decorativos, duotono lima, grain noise, backdrop-filter blur).
- **2026.04** — Versión inicial dark + lima `#E8FF4F` (deprecada).
