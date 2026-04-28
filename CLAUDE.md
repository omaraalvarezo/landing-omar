# PROYECTO: Landing Omar Álvarez — Marca Personal

## Contexto del proyecto

**Dueño:** Omar Álvarez — CEO de Grupo Empresarial Enzo S.A.S. (Enzo Motorsport + Arkhē Coworking), Cúcuta, Colombia.
**Objetivo:** Landing world-class para vender consultorías de IA aplicada a operación real de pymes LATAM. Conversión vía WhatsApp.

**Benchmark visual obligatorio:** linear.app, vercel.com, framer.com, attio.com, brittanychiang.com, raycast.com. Si no se siente al nivel, no está terminada.

---

## Sistema de diseño (resumen ejecutivo)

### Paleta — editorial dark, premium
| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#0A0A0A` | Negro real (no slate) |
| `--bg-elev` | `#111111` | Cards, secciones alternas |
| `--bg-soft` | `#1A1A1A` | Hover states |
| `--border` | `rgba(245,245,245,0.08)` | Bordes default |
| `--border-hi` | `rgba(245,245,245,0.16)` | Hover borders |
| `--text` | `#F5F5F5` | Texto principal |
| `--text-mute` | `rgba(245,245,245,0.55)` | Secundario |
| `--text-dim` | `rgba(245,245,245,0.35)` | Terciario / marquee |
| `--accent` | `#E8FF4F` | **Único acento de marca** |
| `--accent-dim` | `#A8B838` | Hover sobre lima |

**Regla absoluta:** un solo color de acento. Todo lo demás es escala de grises. Eso da el look premium.

### Tipografía
- **Sans:** Geist Variable (400 / 500 — nunca 600+)
- **Serif italic editorial:** Instrument Serif italic. **Solo** en italics dentro de headlines para palabras clave (truco Vercel/Linear).
- **Mono:** Geist Mono Variable. Etiquetas de sección, métricas, código.
- Tracking: `-0.04em` en headlines >48px, `-0.02em` en medianos, `0` en body.

### Sistema de tamaños
- Display 1: `clamp(48px, 8vw, 112px)` line-height 0.95
- Display 2: `clamp(36px, 5vw, 72px)` line-height 1
- H2 sección: `clamp(28px, 3.5vw, 56px)` line-height 1.05
- Body: 16px line-height 1.6
- Caption: 13px line-height 1.5
- Mono label: 12px uppercase tracking 0.1em

### Spacing
- Container: `max-w 1280px`, padding lateral `clamp(20px, 4vw, 48px)`
- Vertical entre secciones: `clamp(80px, 12vw, 200px)`
- Grid de 12 columnas

### Texturas
- Grain SVG noise sutil en `<body>` (opacity 0.04) para evitar banding en negros planos.

---

## Sistema de motion (CRÍTICO)

### Reglas globales
- **Easing default:** `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo, premium)
- **Duraciones:** 0.3s micro · 0.6s entrada · 1.2s revelación grande
- **Triggers:** IntersectionObserver siempre. Nunca scroll listeners.
- **`prefers-reduced-motion`:** desactiva loader, cursor, splits, reveals, marquee.

### Microinteracciones obligatorias (10)
1. **Cursor custom (desktop only):** dot 8px blanco lerp 0.15 + círculo 32px border-only lerp 0.08. Hover sobre links → crece a 56px y se llena de lima. Magnetic effect en CTAs (2-3px).
2. **Hover en cards/links:** `translateY(-2px)` + cambio de border-color en 0.3s. **Sin shadows** — todo con borders.
3. **Botones:** background fill izquierda → derecha al hover (clip-path o pseudo-elemento). Texto cambia color en sync.
4. **Text reveal en scroll:** split por palabras, stagger 0.04s, translateY 24→0 + opacity 0→1.
5. **Marquee infinito** (40s/loop, pausa al hover, CSS puro).
6. **Counters animados** (count-up al entrar en viewport, 1.5s out-expo).
7. **Scroll progress** — barra lima 2px arriba de todo.
8. **Image/case reveal** — clip-path inset 100% → 0% en 0.8s.
9. **Sticky section labels** — `01 / SERVICIOS` lateral izquierdo durante la sección.
10. **Form interactions** — border-bottom que se llena izq → der al focus. Solo border-bottom, estilo editorial.

---

## Copys aprobados

### Hero
- **Pill superior:** "disponible · cúcuta, co" (con dot lima animado)
- **Headline (3-4 líneas):**
  ```
  ia aplicada
  a la operación
  real de pymes
  en latam.
  ```
  Palabra "*pymes*" en serif italic lima. Resto en sans.
- **Subheadline:** "Operador de dos negocios reales en Cúcuta. Te ayudo a integrar IA en tu operación sin humo — con métricas, casos y handoff a tu equipo."
- **CTAs:** primario "agendar por whatsapp →" (lima) + secundario "ver casos" (ghost)
- **Métricas:** `$81M` cop/mes operados · `2` negocios activos · `1,340` reservas analizadas
- **Scroll indicator inferior derecho:** línea vertical 40px que se contrae/expande + texto mono "scroll"

### Marquee de prueba social
`ENZO MOTORSPORT — ARKHĒ COWORKING — UNIVERSIDAD EAFIT — UPB MEDELLÍN — LA SALLE BARCELONA — O&P INGENIERÍA —` (32px, mono o sans medium, color `--text-dim`, separadores asteriscos o slashes lima).

### Para quién (01)
**Headline:** "Trabajo con operadores que *ya* tienen tracción y necesitan apalancarse con IA."
**3 cards:**
1. **Dueño de pyme con datos sin usar** — Excel + POS + calendario sin uso. Decisiones por intuición.
2. **CEO que delega mal** — Negocio depende de él. Necesita sistemas, no más empleados.
3. **Emprendedor con MBA-mind** — Sabe WACC y NPS pero no implementa IA por complicación o costo.

Cada card: número grande mono (`01`, `02`, `03`) + ícono Lucide al fondo (Database, Workflow, Brain) opacity 0.06.

### Servicios (02) — 3 cards full-width asimétricas
1. **Diagnóstico Express** — `2h · desde $500K COP`. PDF de hallazgos + mapa de oportunidades + priorización.
2. **Implementación 1:1** — `4 semanas · cotizar`. Build + handoff.
3. **Mentoría mensual** — `recurrente · cotizar`.

### Método (03) — Timeline horizontal (desktop) / vertical (mobile)
1. **Diagnóstico** — auditoría operación
2. **Mapeo** — identificación de cuellos
3. **Build** — Claude + automatizaciones + dashboards
4. **Handoff** — entrenamiento equipo + medición

Línea horizontal animada con `stroke-dashoffset` al entrar en viewport.

### Casos (04) — Grid bento estilo Linear
- **Caso 1 (2 cols):** Enzo Motorsport — dashboard financiero + bot WhatsApp. Mockup card del bot + métricas.
- **Caso 2 (1 col):** Arkhē — análisis 1,340 reservas. Mini chart de barras del valle de ocupación.
- **Caso 3 (1 col):** Importación O&P — sourcing China end-to-end. Timeline de hitos.

### Sobre (05) — Layout 2 cols
- **Foto B&N** con tratamiento duotono lima al hover (placeholder por ahora)
- **Stats:**
  - `MBA · EAFIT (Medellín, intercambio La Salle Barcelona)`
  - `Ing. Electrónico · UPB Medellín`
  - `CEO · Enzo Motorsport + Arkhē Coworking`
  - `Base · Cúcuta, Colombia`
- **Bio:** "No soy consultor de PowerPoint. Opero dos negocios reales todos los días — vendo servicios automotrices premium en Enzo y gestiono un coworking de 240m² en Arkhē. Lo que te enseño lo uso primero conmigo mismo."

### FAQ (06) — Acordeón 6 preguntas
1. ¿Funciona si no tengo equipo técnico?
2. ¿En cuánto tiempo veo resultados?
3. ¿Trabajas con negocios pequeños?
4. ¿Atiendes fuera de Colombia?
5. ¿Qué necesito tener antes?
6. ¿Cómo es el pago?

### Contacto (07) — Lo que más vende
**Headline:** "¿Listo para integrar IA en tu operación?"
**Sub:** "Cuéntame de tu negocio. Te respondo en menos de 24h."
**Form (sin card, border-bottom only):**
- Input "tu nombre" — placeholder grande (24px)
- Input "tu negocio o sector"
- Textarea "qué quieres resolver" — 3 rows
- **Submit:** construye `wa.me/573202569486?text=...` con mensaje prellenado y `target="_blank"`.

**Mensaje prellenado:**
```
Hola Omar, soy {nombre} de {negocio}.
Quiero resolver: {problema}.
Vi tu landing y quiero agendar una consultoría.
```

**Micro-texto:** "respuesta promedio: 4 horas · zona horaria GMT-5"

### Footer
4 cols: logo+tagline+© | nav | contacto | "construido con astro · vercel · diseño propio"
+ Bloque dramático Display 1 "OMAR ÁLVAREZ" con palabra en lima (cierre estilo Awwwards).

### WhatsApp float
Bottom-right, 56px, fondo lima, ícono Lucide negro. Aparece tras 30% scroll. Mobile siempre visible. Hover: scale 1.05 + tooltip "hablemos →".

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
| Geist (no Inter) | Diferenciación visual, soporte variable axes |

## Para retomar después
1. Leer este CLAUDE.md de cabo a rabo
2. Revisar `src/styles/global.css` para tokens y typography
3. Revisar `src/lib/contact.ts` para datos operativos
4. Continuar desde el último hito en estado "⏳" del README.md
