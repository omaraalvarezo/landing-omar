---
titulo: "Tipografía 3-familias en landing (no mono 95%)"
tipo: decision
dominio: [brand, diseño]
tags: [tipografia, geist-mono, geist-sans, instrument-serif, brandbook-v21]
fuentes:
  - "[[../../CLAUDE.md]]"
  - "[[../../src/styles/global.css]]"
creado: 2026-05-11
actualizado: 2026-05-11
---

# Tipografía 3-familias en landing (no mono 95%)

## Decisión

La landing **no aplica** la regla "Geist Mono dominante 95%" del brandbook OAAO v2.1 SKILL puro. En su lugar usa un sistema de **3 familias** con rol fijo:

| Familia | Rol | Aprox. % de la pieza |
|---|---|---|
| **Instrument Serif Regular** | Headlines editoriales (`display-1`, `display-2`, `h2-section`), hooks, palabra protagonista (`accent-italic`), tagline del footer, statement del finale | ~15% |
| **Geist Sans Variable** | Cuerpos largos (`body-lg`, `body`), descripciones de card, titulares H3 de card (`h3-card`), preguntas FAQ | ~55% |
| **Geist Mono Variable** | Toda meta-info: paths, timestamps, etiquetas CAPS, números grandes (`number-display`), CTAs, badges, marquee, footer cols, mocks de WhatsApp, mono-labels, captions de chart, datos del logo | ~30% |

El acento azul (`#1E5FA8`) sigue siendo único y restringido a <8% del viewport.

## Por qué

**Brandbook v2.1 SKILL puro = social/decks.** El SKILL OAAO v2.1 fue diseñado para slide decks y assets de redes sociales donde el mono dominante da personalidad de terminal. En esos contextos funciona porque los cuerpos son cortos (≤2 líneas por slide) y la densidad visual es deseable.

**Landing = lectura larga.** En una landing el body alcanza fácil 50–80 caracteres por línea y 4–6 líneas por bloque. Mono para cuerpos largos:
- Baja la velocidad de lectura ~20–30% (estudios de Nielsen, Bigelow).
- Genera "wall of code" que aleja al lector no-técnico.
- Erosiona el contraste tipográfico que la jerarquía Stratechery / Generalist explotan (serif vs sans vs mono).

**Mantener mono presente y reconocible.** Para que la marca siga leyéndose "operador editorial / builder con alma editorial", mono se usa **agresivamente en todo lo que no es body**: paths, timestamps, etiquetas CAPS, números, CTAs, badges, marquee, footer, FACT-XX labels, etc. Eso preserva la firma sin sacrificar legibilidad.

**Memoria del operador confirma esta lectura.** `~/.claude/.../feedback_brand_landing_vs_social.md`: *"En webs usar 3-familias (serif headlines + sans body + mono meta), no 'mono 95%' del SKILL puro"*.

## Cómo aplicar

1. **Headlines de sección, hooks, statements finales, taglines:** Instrument Serif Regular (400). Nunca italic salvo en `accent-italic` (palabra protagonista subrayada en azul).
2. **Body, descripciones, FAQ questions, card H3:** Geist Sans Variable (400 normal, 500 medium para énfasis sutil). Nunca >500.
3. **Cualquier cosa estructural o de meta-información:** Geist Mono Variable. Esto incluye: pillar labels, paths con `~/omar.alvarez`, timestamps, números grandes (incluyendo en métricas del hero y deltas), CAPS labels, captions del chart, etiquetas FACT-XX, CTAs, badges, marquee, footer cols, copy de mocks de WhatsApp, copy de timeline.
4. **Logo wordmark `omar.alvarez`:** Geist Mono Medium 500, punto en `--accent`. No usar serif ni sans para el wordmark.
5. **Excepción de body en mono:** cuando un bloque es textura ambiente (e.g., mock de chat, código simulado), mono está permitido aunque el cuerpo sea más largo.

## Reglas duras que no cambian

- Cero gradientes/sombras/glows/neón.
- Nunca `#000` ni `#FFF` puros — siempre `--ink` / `--bg`.
- Acento azul `#1E5FA8` **único**. <8% del viewport. Carga señal, nunca decora.
- `border-radius: 0` en CTAs primarios (editorial, no pills).
- Iconos Lucide stroke 1.5.

## Implicaciones para el `CLAUDE.md`

La sección "Tipografía" del `CLAUDE.md` actual dice "Geist Mono manda 95%" y "Cuerpos largos también en Geist Mono". Ambas líneas hay que reescribir para reflejar el sistema 3-familias real de landing. Cambio aplicado en commit junto con esta decisión.

## Cuándo revisar esta decisión

- Si la landing migra a un formato más cercano a deck/longform (e.g., un /manifiesto largo o un /caso individual con copy denso), reconsiderar reintroducir mono dominante.
- Si Omar adopta el brandbook OAAO v2.2+ con una regla diferente, reabrir.
- Si en una auditoría visual los benchmarks Stratechery/Generalist/Linear ya no aplican, reabrir.
