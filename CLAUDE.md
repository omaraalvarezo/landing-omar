# PROYECTO: omaralvarezo.co — Consultoría 2H v3.3

## Contexto

**Dueño:** Omar Álvarez — fundador y operador de Enzo Motorsport y Arkhē, Cúcuta, Colombia.

**Objetivo:** convertir tráfico de TikTok en una única sesión privada de 120 minutos para dueños o
socios de empresas de servicios. El visitante debe entender primero cómo piensa y qué ha construido
Omar; el precio y el brief aparecen después de la prueba.

**Posicionamiento:** Omar no vende “IA” en abstracto ni se presenta como coach. Opera negocios
físicos, construye sus sistemas y ayuda a otra empresa a decidir qué pieza vale la pena construir
primero.

**Recorrido:** TikTok → sistema vivo → evidencia operativa → Marco 4C → proyectos → sesión → encaje →
FAQ → brief → Wompi → verificación server-side → Cal.com.

No hay llamada gratuita, paquetes, retainer, contacto directo público, descuento inventado,
temporizador ni escasez fabricada.

---

## Oferta vigente

| Campo | Valor |
|---|---|
| Producto | Sesión privada para diseñar un sistema operativo con IA |
| Duración | 120 minutos |
| Precio base | `USD 797` |
| Cobro | COP con tasa operativa diaria |
| Tasa | TRM oficial + 1,65%, redondeada hacia arriba al múltiplo de `$10 COP` |
| Pago | 100% anticipado por Wompi |
| Agenda | Cal.com solo después de un pago `APPROVED` |
| Participantes | Dueño de la decisión + hasta 2 personas del equipo |
| Incluye | Preparación, sesión, mapa del sistema, documento, grabación y 7 días de dudas puntuales |

Si el brief no cabe en dos horas o no existe encaje, la reserva no se aprueba y se devuelve el 100%.
Se puede reprogramar una vez con mínimo 24 horas de aviso.

---

## Marco comercial

El **Marco 4C** ubica el problema dentro del ciclo de una empresa de servicios:

| Etapa | Pregunta | Color |
|---|---|---|
| C1 · Captar | ¿De dónde llega la atención y dónde queda el dato? | Coral `#FF6B45` |
| C2 · Convertir | ¿Quién da criterio y mueve la siguiente acción? | Púrpura `#C79AFF` |
| C3 · Cumplir | ¿Cómo se entrega sin depender de memoria? | Cobalto profundo `#4B5FE3` |
| C4 · Continuar | ¿Qué ocurre después de entregar? | Lima `#C8FF3D` |

La IA es una capa transversal para extraer, clasificar, proponer, redactar y alertar. Las decisiones
sensibles siguen teniendo responsable humano. En 120 minutos se elige una C; no se promete
automatizar toda la empresa.

La definición canónica y la validación del brief viven en `src/lib/framework.ts`.

---

## Dirección de arte vigente — “Sistema vivo / taller abierto”

La v3.3 reemplaza por completo la antigua dirección editorial beige + serif + azul.

### Concepto

La página debe sentirse como los sistemas que Omar construye: algo pasa del caos al control delante
del visitante. La primera escena es precisa, oscura y cinemática; el cuerpo abre un taller humano,
colorido, asimétrico y lleno de evidencia.

No se copia el carro de Enzo ni la identidad de Arkhē. Se traducen sus principios:

- **Enzo:** oscuridad cálida, una transformación visible, movimiento ligado al contenido y precisión.
- **Arkhē:** color con función, geometría, escala tipográfica, juego y composiciones menos perfectas.
- **Omar:** números reales, herramientas reales, voz directa y criterio de operador.

### Paleta

| Token | HEX | Uso |
|---|---|---|
| `--ink` | `#131118` | Base nocturna cálida, texto sobre campos claros |
| `--bone` | `#FFF8EA` | Campo claro, texto sobre ink |
| `--coral` | `#FF6B45` | C1, señal, CTA de avance |
| `--purple` | `#C79AFF` | C2, decisión, bloque de reserva |
| `--cobalt` | `#4B5FE3` | C3, control y ejecución; oscuro para contraste AA con bone |
| `--lime` | `#C8FF3D` | C4, sistema conectado, confirmación y acción principal |
| `--sky` | `#BDD9D8` | Puentes y pausas de lectura |

Reglas:

1. El color representa estado o capítulo; no se usa como confeti.
2. Máximo dos acentos dominantes a la vez salvo en el mapa 4C.
3. Los fondos sólidos y los bordes físicos tienen prioridad sobre gradientes genéricos.
4. Un glow o radial tenue solo puede explicar activación/señal dentro del sistema.
5. No hacer “sopa de cards”. Cada bloque debe tener una composición y un propósito propios.

### Tipografía

| Familia | Rol |
|---|---|
| **Bricolage Grotesque Variable** | Titulares pesados, compactos y expresivos |
| **IBM Plex Sans Variable** | Cuerpo, formularios y lectura larga |
| **IBM Plex Mono** | Estados, tiempos, códigos, etiquetas y telemetría |

- No usar serif en la experiencia de consultoría.
- Mono es interfaz, no cuerpo largo.
- Los títulos pueden usar `font-stretch: 75–84%`, peso `700–800` y tracking negativo.
- El wordmark personal es tipográfico: `omar • álvarez`; no reutiliza el logo corporativo anterior.
- Geist e Instrument Serif permanecen instaladas para páginas heredadas de `/recursos`; no son la
  identidad del home actual.

### Motion

1. Scroll nativo, nunca scrolljacking.
2. El hero usa `215svh` desktop / `175svh` móvil con una escena sticky. El progreso activa cuatro
   fases del SVG 4C mediante `requestAnimationFrame` solo mientras el hero es visible.
3. Animar `transform`, `opacity`, stroke y color. Evitar layout thrashing.
4. Sin loader artificial, cursor reemplazado, audio automático ni navegación-juego.
5. `prefers-reduced-motion: reduce` muestra directamente el mensaje final y elimina la duración
   sticky, pulsos y transformaciones decorativas.
6. Una interacción memorable por capítulo: encendido, stack 4C, rail de proyectos. El resto descansa.

### Voz

**Sí:** “Mira esto”, “La vaina es así”, “Esto ya lo opero”, “No escribas bonito”, “Trae un cuello de
botella”, “Compras una mala ruta menos”.

**No:** “potencia”, “revoluciona”, “transforma tu negocio”, “lleva al siguiente nivel”, “ecosistema de
soluciones”, “desbloquea”, “resultados tangibles”, “implementación estratégica” ni voz de guru.

Datos antes que adjetivos. Primera persona. Frases cortas. No inventar métricas, clientes o urgencia.

---

## Arquitectura visual del home

1. **Hero / el sistema se enciende.** Señales sueltas → venta aislada → operación aislada → 4C
   conectadas. El precio no aparece aquí.
2. **Taller abierto.** Origen operativo de Omar + cuatro recibos con resultados reales.
3. **Principio.** Problema primero, herramienta después.
4. **Marco 4C.** Cuatro escenas sticky a color, no cuatro tarjetas iguales.
5. **Sistemas.** Rail horizontal de Enzo, Arkhē, Adjudika y Grupo Enzo con interfaces code-native.
6. **Sesión.** Ruta continua 00–120 y entregables.
7. **Encaje y costo.** Filtro explícito + costo de construir la pieza equivocada.
8. **FAQ.** Condiciones, TRM, alcance, pago y agenda sin letra pequeña.
9. **Reserva.** Precio, conversión diaria, brief 4C, Wompi y handoff a Cal.com.

La navegación cambia su CTA de “empezar el recorrido” a “reservar 2 horas” después de que el usuario
llega a los sistemas.

---

## Invariantes de pago y agenda

Estas reglas no se modifican por razones visuales:

1. El servidor consulta la TRM oficial cuya vigencia cubre la fecha de Bogotá.
2. Aplica `1,65%` y redondea la tasa operativa hacia arriba al siguiente múltiplo de `$10 COP`.
3. La página muestra precio USD, TRM oficial, tasa aplicada y total exacto antes de pagar.
4. No existe fallback manual entre fechas. Una lectura oficial ya verificada solo puede reutilizarse
   durante la misma fecha de Bogotá; si no hay tasa vigente, el checkout falla cerrado.
5. El servidor recalcula el monto. Nunca confía en un total enviado por el navegador.
6. La referencia codifica monto y fecha; la firma de integridad protege el Checkout Web.
7. Un redirect no prueba el pago. Cal.com solo se revela cuando Wompi confirma `APPROVED`, referencia
   correcta, monto exacto y moneda `COP`.
8. Las referencias heredadas por `$2.400.000 COP` siguen verificándose para no romper pagos emitidos.
9. El brief temporal vive en `sessionStorage`; no se creó otra base de datos.

---

## Archivos vigentes

```text
src/
├── pages/
│   ├── index.astro
│   ├── consultoria/agendar.astro
│   └── api/consultoria/
│       ├── checkout.ts
│       ├── quote.ts
│       └── status.ts
├── layouts/
│   └── Layout.astro
├── components/consulting/
│   ├── ConsultingLanding.astro  ← relato, escenas y motion
│   ├── SystemIgnition.astro     ← mapa SVG 4C code-native
│   ├── CheckoutForm.astro       ← brief + cotización + Wompi
│   └── PaidCalendar.astro       ← verificación + Cal.com
└── lib/
    ├── consulting.ts            ← precio y reglas comerciales
    ├── framework.ts             ← 4C canónicas
    ├── trm.ts                   ← fuente oficial, spread y cotización
    └── wompi-consulting.ts      ← firma y verificación

public/
├── og-image.svg                 ← OG “Sistema vivo” 1200×630
└── resources/
    └── marco-4c-servicios-omar-alvarez.pptx
```

Los componentes históricos fuera de `components/consulting/` siguen alimentando `/recursos` u otras
rutas. No borrarlos durante cambios del home sin revisar sus importaciones.

---

## Base de conocimiento

```text
raw/      → fuentes inmutables; leer, nunca modificar ni borrar.
wiki/     → decisiones y síntesis mantenidas por el agente.
src/      → producto de producción.
CLAUDE.md → contrato vivo del proyecto.
index.md  → catálogo de wiki y raw relevante.
log.md    → bitácora append-only.
```

Todo `.md` dentro de `wiki/` usa frontmatter:

```yaml
---
titulo: "Nombre legible"
tipo: decision | concepto | sintesis
dominio: [diseño, copy, seo, conversion, brand, infra, performance]
tags: [tag1, tag2]
fuentes:
  - "[[ruta/a/fuente]]"
creado: YYYY-MM-DD
actualizado: YYYY-MM-DD
---
```

Fuentes locales clave para decisiones del home:

- Enzo: `../grupo-enzo/enzo-motorsport/site/index.html`
- Arkhē web: `../grupo-enzo/arkhe/components/ArkheSpaceWebsite.jsx`
- Arkhē brandbook: `../sara-wrapped/raw/media/00026246-Brandbook_Arkhé.pdf`
- Voz TikTok: `../second-brain/projects/marca-personal-tiktok/serie-90-dias/01-reglas-de-voz.md`
- Casos reales: `../second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md`

---

## Stack

- Astro 5 + TypeScript strict.
- Adapter de Vercel para rutas server-side.
- Wompi Checkout Web en COP.
- TRM de Superfinanciera vía Datos Abiertos Colombia.
- Cal.com inline después del pago aprobado.
- Bricolage Grotesque Variable + IBM Plex Sans Variable + IBM Plex Mono, self-hosted con Fontsource.
- Sin WebGL, imágenes remotas, loader o dependencia visual externa en el home.

## Comandos

```bash
npm install
npm run dev
npm run astro -- check
npm run build
npm run preview
```

## Checklist antes de publicar

- [ ] `astro check` sin errores nuevos.
- [ ] `npm run build` exitoso.
- [ ] Hero llega a `data-phase="3"` con scroll y muestra el estado final con reduced motion.
- [ ] Sin overflow horizontal a 390 px y 1440 px.
- [ ] C1/C2/C3/C4 conservan coral/púrpura/cobalto/lima en landing, brief y agenda.
- [ ] Precio ausente del hero y presente en reserva.
- [ ] `/api/consultoria/quote` devuelve `priceUsd=797`, `spreadBps=165` y una tasa operativa ≥ TRM.
- [ ] Formulario conserva required, límites y selección 4C.
- [ ] Ningún error de consola en home ni handoff.
- [ ] No se ejecuta un pago real durante QA automático.
- [ ] El archivo temporal `public/resources/~$marco-4c-servicios-omar-alvarez.pptx` es del usuario: no
  borrar, modificar ni versionar.

## Para retomar

1. Leer este archivo completo.
2. Revisar `log.md` y `git status` antes de editar.
3. Leer la decisión `wiki/decisiones/sistema-vivo-control-room.md`.
4. Mantener los invariantes de TRM/Wompi/Cal.com.
5. Validar visualmente desktop, móvil y reduced motion antes de publicar.

## Changelog breve

- **2026.08.20 · v3.3:** reemplazo total de “expediente editorial” por “Sistema vivo / taller
  abierto”; hero 4C code-native, nueva tipografía, paleta funcional, proyectos interactivos, checkout y
  agenda congruentes.
- **2026.08.20 · v3.2:** Marco 4C y tasa operativa diaria con spread explícito de 1,65%.
- **2026.08.19 · v3.1:** precio base `USD 797`, secuencia TikTok y TRM dinámica.
- **2026.08.19 · v3.0:** oferta única de 120 minutos con Wompi y Cal.com.
