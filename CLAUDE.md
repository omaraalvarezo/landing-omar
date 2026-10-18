# PROYECTO: omaralvarezo.co — El sistema de Enzo v4.0

## Contexto

**Dueño:** Omar Álvarez — fundador y operador de Enzo Motorsport y Arkhē, Cúcuta, Colombia.

**Objetivo:** el home vende la forma de operar de Omar y desde ahí lleva a una escalera de ofertas
que el comprador usa solo, sin pedirle tiempo a Omar (tiene 1 hora a la semana). El escalón
principal es **"El sistema de Enzo · detailing"** en preventa ($179.000, aprox. USD 55). Lo que pide
a Omar en persona (instalación, sesión o el sistema para otro oficio) va a una **lista de espera**.
Meta a 90 días: 30 ventas del sistema. Spec:
`docs/superpowers/specs/2026-10-17-escalera-del-operador-design.md`.

**Posicionamiento:** Omar no vende “IA” en abstracto ni se presenta como coach. Opera negocios
físicos y construye sus sistemas. Vende el método, los textos y las plantillas con los que opera,
para montarlos con herramientas que ya existen. No promete resultados.

**Recorrido:** TikTok → `/tiktok` o dirección corta (`/entregas`, `/prompts`, `/kit`, `/lista`) →
sistema vivo (hero) → evidencia (taller abierto, recibos, rail de sistemas) → el sistema de Enzo →
compra en `/sistemas/detailing`, o lista de espera (`/#contacto`).

No hay paquetes, retainer, descuento inventado, temporizador ni escasez fabricada. La sesión de
2 horas y el Marco 4C **salieron del sitio** el 2026-10-17: la sesión solo existe como opción de la
lista de espera y el 4C solo sobrevive como historia en `/recursos` (heredado) y en el changelog.

---

## Oferta vigente: la escalera

Una sola fuente: `src/lib/ladder.ts` (lee precios de `getProduct()`; ninguna página escribe un
monto a mano). Home, `/sistemas`, `/tiktok` y el directorio leen de ahí.

| Escalón (`id`) | Precio | Acción | Destino |
|---|---|---|---|
| PDF de prompts (`pdf`) | gratis | dejar el correo | `/herramientas-ia/prompts-gratis` |
| Kit para talleres (`kit`) | $81.000 (USD 25 × $3.230) | comprar (Wompi) | `/herramientas-ia/kit` |
| **El sistema de Enzo · detailing** (`sistema-enzo`) | **$179.000 · aprox. USD 55** | **preventa (Wompi)** | **`/sistemas/detailing`** |
| Lista de espera (`lista`) | — | anotarse | `/#contacto` |

### El producto

Datos en `src/data/sistema-enzo-detailing.json`; catálogo en `src/lib/products.ts`
(`ProductId = 'talleres' | 'enzo-detailing'`).

| Campo | Valor |
|---|---|
| `id` / nombre | `enzo-detailing` / `El sistema de Enzo · detailing` |
| Precio | `amountCop: 179000`, `usdReference: 55`. Fijo en pesos: no sigue la regla USD × tasa del kit |
| Piezas (orden fijo) | `recepcion`, `checklist`, `entrega`, `seguimiento` |
| Al pagar | guía PDF + plantillas (zip `sistema-enzo-detailing.zip`, generado al vuelo desde `src/data/sistema-enzo-detailing-contenido.json`). Descarga por 120 días |
| Preventa | `presale.videosDueDate` (la fija Omar) y `presale.videos` (título + URL, alojados fuera del repo, privados o no listados). Si los videos no llegan en la fecha, se devuelve la plata |
| Garantía | `guaranteeDays: 7`. Omar devuelve a mano; el agente nunca devuelve plata. Reemplaza, para este producto, la excepción de retracto por archivo descargado |
| Tarjetas de fuera | `acceptsForeignCards: null` hasta que Omar lo confirme con Wompi. `null`/`false` → la FAQ lo dice y ofrece la lista de espera con el país |
| Herramientas | solo slugs de `src/data/tools.json`, con costo mensual y fecha de consulta en el contenido |

**Sin fecha de videos (o con la fecha vencida) no se cobra:** `isProductOnSale()` da `false`, el
botón sale "Abre pronto" deshabilitado y `POST /api/herramientas/kit-checkout` responde 503 antes de
gastar rate limit o llamar a Wompi. La página es estática: cambiar la fecha exige un deploy.

La página del producto vive en la colección `src/content/sistemas/` (`detailing.md`, con
`draft`). Si está en borrador, el home esconde la sección del sistema y sus botones bajan a
`#escalera`.

---

## Marco comercial (historia)

El Marco 4C (Captar, Convertir, Cumplir, Continuar) ordenó la consultoría v3.2–v3.5. Desde v4.0 no
aparece en el home, el JSON-LD ni el formulario. `src/lib/framework.ts` y
`public/resources/marco-4c-servicios-omar-alvarez.pptx` siguen porque los usan `/recursos` y
`/sobre-mi`. No borrarlos sin revisar esas importaciones.

---

## Dirección de arte vigente — “Sistema vivo / taller abierto”

La v3.3 reemplaza por completo la antigua dirección editorial beige + serif + azul. v4.0 la
conserva; solo cambia lo que nombran los colores.

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
| `--coral` | `#FF6B45` | Pieza 01 · recepción, señal, CTA de avance |
| `--purple` | `#C79AFF` | Pieza 02 · checklist, decisión, bloque de lista de espera |
| `--cobalt` | `#4B5FE3` | Pieza 03 · entrega, control; oscuro para contraste AA con bone |
| `--lime` | `#C8FF3D` | Pieza 04 · seguimiento, sistema conectado, confirmación y acción principal |
| `--sky` | `#BDD9D8` | Puentes y pausas de lectura |

El color de cada pieza es un estado del trabajo y se define una sola vez en
`src/lib/sistema-copy.ts` → `PIECE_STATE`.

Reglas:

1. El color representa estado o capítulo; no se usa como confeti.
2. Máximo dos acentos dominantes a la vez, salvo donde aparecen las cuatro piezas juntas.
3. Los fondos sólidos y los bordes físicos tienen prioridad sobre gradientes genéricos.
4. Un glow o radial tenue solo puede explicar activación/señal dentro del sistema.
5. No hacer “sopa de cards”. Cada bloque debe tener una composición y un propósito propios.

### Tipografía

| Familia | Rol |
|---|---|
| **Bricolage Grotesque Variable** | Titulares pesados, compactos y expresivos |
| **IBM Plex Sans Variable** | Cuerpo, formularios y lectura larga |
| **IBM Plex Mono** | Estados, tiempos, códigos, etiquetas y telemetría |

- No usar serif en el home, `/sistemas` ni `/tiktok`.
- Mono es interfaz, no cuerpo largo.
- Los títulos pueden usar `font-stretch: 75–84%`, peso `700–800` y tracking negativo.
- El wordmark personal es tipográfico: `omar • álvarez`; no reutiliza el logo corporativo anterior.
- Geist e Instrument Serif permanecen instaladas para páginas heredadas de `/recursos`; no son la
  identidad del home actual.

### Motion

1. Scroll nativo, nunca scrolljacking.
2. El hero usa `320svh` desktop, `330svh` hasta 820 px y `340svh` hasta 560 px, con una escena
   sticky. El progreso activa cuatro fases (trabajo suelto → recepción/checklist →
   entrega/seguimiento → "recibir → hacer → entregar → seguir") del SVG code-native
   (`SystemIgnition.astro`) mediante `requestAnimationFrame` solo mientras el hero es visible.
3. Animar `transform`, `opacity`, stroke y color. Evitar layout thrashing.
4. Sin loader artificial, cursor reemplazado, audio automático ni navegación-juego.
5. `prefers-reduced-motion: reduce` muestra directamente el mensaje final (fase 3), deja el hero en
   `height: auto` y elimina la duración sticky, pulsos y transformaciones decorativas.
6. Una interacción memorable por capítulo: encendido, rail de proyectos, escalera. El resto descansa.

### Voz

**Sí:** “Mira esto”, “La vaina es así”, “Esto ya lo opero”, “No escribas bonito”, “Trae un cuello de
botella”, “Compras una mala ruta menos”.

**No:** “potencia”, “revoluciona”, “transforma tu negocio”, “lleva al siguiente nivel”, “ecosistema de
soluciones”, “desbloquea”, “resultados tangibles”, “implementación estratégica” ni voz de guru.

Datos antes que adjetivos. Primera persona. Trato de **tú**, sin voseo (“Escogí”, no “Elegí”
cuando suene ambiguo). Frases cortas. No inventar métricas, clientes o urgencia.

### Límites de contenido

- Cifras solo con fuente registrada en `wiki/sintesis/recibos-operativos.md` (`src/data/recibos.json`
  → `publicRecibo()`), con "aprox." y una línea de origen. Sin fuente no entra.
- Cero precios internos de Enzo o Arkhē: los precios de las plantillas dicen "ejemplo".
- Cero datos de clientes, placas o empleados. Nadie del equipo aparece sin autorización de imagen.
- Solo herramientas que existan en `tools.json`. Valeria se presenta como lo que es: atiende el chat
  de enzomotorsport.co; el WhatsApp sigue en piloto.

---

## Arquitectura visual del home

`src/pages/index.astro` → `src/components/consulting/ConsultingLanding.astro`.

1. **Hero / el sistema se enciende (`#inicio`).** Cuatro momentos de una entrega sin sistema y el
   cierre "Mis negocios no corren con memoria. Corren con sistemas." Sin precio.
2. **Taller abierto (`#taller`).** Origen operativo de Omar + cuatro recibos con fuente
   (`inspeccion-puntos`, `fotos-salida-antes`, `cotizacion-minutos`, `pl-arkhe`).
3. **Principio.** Problema primero, herramienta después.
4. **Sistemas (`#sistemas`).** Rail horizontal de Enzo, Arkhē, Adjudika y Grupo Enzo con interfaces
   code-native. El caso Enzo enlaza a `/sistemas/detailing` y le sigue un `ConversionCTA`.
5. **El sistema de Enzo (`#sistema-enzo`, `src/components/home/SistemaEnzo.astro`).** Qué resuelve,
   las cuatro piezas, precio, preventa y botón. Solo si la página del producto está publicada.
6. **Escalera (`#escalera`, `src/components/home/Ladder.astro`).** PDF → kit → sistema → lista, con
   el sistema resaltado.
7. **FAQ.** Qué incluye, herramientas y costo mensual, cuándo llegan los videos, garantía, pago desde
   fuera de Colombia y por qué no hay instalación ni sesión. Las respuestas con datos salen de
   `src/lib/sistema-copy.ts`, igual que en la página de venta.
8. **Lista de espera (`#contacto`).** `ConsultingContact.astro`.

La navegación es fija, se condensa al bajar 44 px y su CTA siempre dice “ver el sistema de Enzo”.
El JSON-LD del home (`src/lib/schema.ts`) tiene Persona y WebSite; la persona referencia el producto
por `@id` (`https://omaralvarezo.co/sistemas/detailing#product`), que se describe completo en su
página. Ningún JSON-LD describe la sesión.

---

## Invariantes del formulario de la lista de espera

Formulario `#contacto-consultoria` dentro de `#contacto` → `POST /api/contacto` → Resend → correo de
Omar. Sin base de datos ni pago: el correo es el registro.

1. El servidor valida todo de nuevo con `validateWaitlist()` (`src/lib/waitlist.ts`), la misma
   función que usa el navegador. Límites en `src/lib/consulting.ts` → `CONTACT_LIMITS` (nombre 100,
   correo 254, WhatsApp 24, negocio 120, oficio "otro" 60, mensaje 600). Errores 400 con `field`.
2. Campos: qué quieres (`instalacion`, `sesion`, `otro-oficio`, `pregunta-sistema`), nombre, correo,
   WhatsApp opcional, negocio (obligatorio), oficio de `src/data/oficios.json` (si es `otro`, texto
   obligatorio), país de `src/data/paises.json`, mensaje (mínimo 20 si es una pregunta del sistema) y
   autorización de datos.
3. `?quiero=` preselecciona la opción (por ejemplo `/?quiero=instalacion#contacto`). Un valor
   inválido no rompe nada y deja el selector vacío.
4. Honeypot `website`: si viene lleno se responde OK sin enviar nada.
5. Rate limit de 5 envíos por hora por IP con Upstash; si Upstash falla, no se bloquea el contacto.
6. Sin `RESEND_API_KEY` responde 503; si Resend falla, 502. Los dos con `fallbackEmail` y el navegador
   ofrece un `mailto:` con el mensaje ya escrito. El formulario no borra lo escrito si falla.
7. Remitente: `CONTACT_FROM_EMAIL` → `DIRECTORY_NOTIFY_FROM` → `onboarding@resend.dev`. Destino:
   `CONTACT_TO_EMAIL` o `omaraalvarezo@gmail.com`. `reply_to` es el correo del visitante. Resend
   deduplica reenvíos idénticos 24 h con `Idempotency-Key`.
8. Copy fijo: "Hoy no estoy tomando instalaciones ni sesiones. Si te anotas, te escribo cuando abra
   cupo. Si es una pregunta del sistema, te respondo por correo."
9. Las rutas viejas `/consultoria/agendar` y `/consultoria/agenda/*` redirigen a `/#contacto`
   (`vercel.json`). Los pagos de consultoría emitidos antes de v3.5 se atienden a mano.

---

## Cobros: kit y sistema (Wompi, infraestructura compartida)

- **Referencia:** `oa-kit-{producto}-q{centavos}-d{fecha}-t{ms}-{hex8}` (`createProductReference` /
  `parseProductReference` en `src/lib/products.ts`). El monto de la referencia tiene que ser el del
  producto. Adjudika ya reenvía `oa-kit-*` a `/api/herramientas/evento`: no hay nada nuevo que
  configurar en Wompi.
- **Checkout:** `POST /api/herramientas/kit-checkout`. Sin `product` es el kit (su formulario no
  cambió). Con `product: 'enzo-detailing'` pide nombre, correo, negocio y país; honeypot `company`.
  Orden en Upstash, cookie de acceso HttpOnly del pedido y `redirectUrl` a `{orderPath}/{id}`.
- **Webhook `/api/herramientas/evento`:** verifica la firma, relee la transacción en Wompi y liquida
  con `settleKitPayment()`. Si el producto o el monto no coinciden con la orden → `MISMATCH`, sin
  descarga ni correo. Avisa a Omar (Resend) y, si `buyerEmail`, manda al comprador el recibo con el
  enlace `?t=`; si ese correo falla responde **503** para que Wompi reintente y guarda
  `buyerNotifyStatus`. Cada aviso tiene su clave: un reintento solo reenvía el que falló, y un
  APPROVED repetido da un solo correo.
- **Página de pedido `/sistemas/pedido/[orderId]`:** la ve quien trae la cookie, o quien abre el
  enlace del correo (`?t=`) con el pago APPROVED (`canViewProductOrder`). Pedido inexistente o de
  otro producto → 404; almacén caído → 503 con aviso. Headers `noindex`, `no-store`, `no-referrer`.
- **Descarga:** `/api/herramientas/kit-archivo?pedido=&t=` arma el zip del producto de la orden; 410
  si venció.
- **Videos:** llenar `presale.videos`, desplegar y correr `npm run sistema:avisar-videos` (simulacro)
  y luego `-- --send` (marca `videosNotifiedAt`; se puede repetir).
- **Órdenes pendientes:** `npm run kit:pending` (muestra producto y país).

El directorio `/herramientas-ia` conserva su cobro: prefijo `oa-directorio-*`, precios COP fijos,
Upstash y el cliente compartido `src/lib/wompi.ts` con los formatos de `src/lib/money.ts`. No
escribe en Adjudika ni desbloquea Cal.com. Las guías viven en colecciones Markdown (`src/content/`)
y no cambian el cobro. Contrato en `wiki/decisiones/directorio-herramientas-ia.md`.

---

## `/tiktok` y direcciones cortas

- `/tiktok` (`src/pages/tiktok.astro`): página de la bio. Una pantalla, sin scripts de terceros, sin
  embeds. Arriba el escalón principal; abajo el PDF y el kit.
- Direcciones cortas en `src/data/short-links.json` → `astro.config.mjs` (`redirects`, 302 con
  `?ref={slug}`): `/entregas` → sistema, `/prompts` → PDF, `/kit` → kit, `/lista` → `/#contacto`.
  Lógica en `src/lib/short-links-core.mjs`. Un slug nuevo no puede chocar con una ruta de
  `src/pages` (lo prueba `tests/short-links.test.ts`).

## Medición

Vercel Web Analytics por el mismo origen (`/_vercel/insights`, sin tocar la CSP). `<Analytics />`
en `Layout.astro`, apagado en páginas `privatePage` (pedidos) y en `/admin`. Eventos en
`src/lib/track.ts`: `escalon_click` (`data-track`), `sistema_checkout_iniciado`,
`kit_checkout_iniciado`, `lista_espera_enviada`, `boletin_suscrito` y `link_corto { ref }`.
`sistema_comprado` sale solo del webhook (`trackSistemaSale` en `src/lib/track-server.ts`), una vez
por orden gracias a `purchaseTrackedAt` y un candado, sin cookie, IP ni URL de pedido. Solo props
string, nunca correos, nombres ni texto libre. Si el plan no recoge eventos, las ventas se cuentan
con `npm run kit:pending`.

## Legal

- `/terminos`: compras del directorio, kit y sistema; sección propia del sistema con preventa (fecha
  y devolución si no llegan los videos), garantía de 7 días que reemplaza el retracto por archivo
  descargado, y devolución en máximo 30 días. La sesión y la instalación solo existen como lista de
  espera, sin compromiso. Textos de `sistema-copy.ts` (`presaleTerms`, `guaranteeTerms`).
- `/privacidad`: finalidades de la lista de espera y de la compra del sistema, Vercel Web Analytics
  sin cookies y plazos de conservación.
- OG `public/og-image.png` / `.svg`: sin la sesión de 120 minutos.

---

## Archivos vigentes

```text
src/
├── pages/
│   ├── index.astro
│   ├── tiktok.astro
│   ├── sistemas/index.astro            ← oficios con sistema + "anótate" para el tuyo
│   ├── sistemas/[slug].astro           ← página de venta (colección sistemas)
│   ├── sistemas/pedido/[orderId].astro ← pedido del comprador (cookie o ?t=)
│   ├── terminos.astro · privacidad.astro
│   └── api/
│       ├── contacto.ts                 ← lista de espera → Resend → correo de Omar
│       └── herramientas/
│           ├── kit-checkout.ts         ← checkout del kit y del sistema
│           ├── evento.ts               ← webhook Wompi (directorio, kit y sistema)
│           └── kit-archivo.ts          ← zip del producto de la orden
├── components/
│   ├── consulting/
│   │   ├── ConsultingLanding.astro     ← relato, escenas y motion del home
│   │   ├── SystemIgnition.astro        ← SVG code-native del hero
│   │   ├── ConversionCTA.astro         ← CTA intermedio hacia el sistema
│   │   └── ConsultingContact.astro     ← formulario de la lista de espera
│   ├── home/SistemaEnzo.astro · home/Ladder.astro
│   └── sistemas/SistemaShell.astro
├── content/sistemas/detailing.md
├── data/
│   ├── sistema-enzo-detailing.json           ← producto: precio, preventa, garantía, tarjetas
│   ├── sistema-enzo-detailing-contenido.json ← piezas, plantillas, herramientas (zip y página)
│   ├── recibos.json · oficios.json · paises.json · short-links.json
│   └── kit.json · kit-pack.json · lead-prompts.json · tools.json
└── lib/
    ├── products.ts      ← catálogo, referencias, isProductOnSale, validateCheckoutInput
    ├── ladder.ts        ← escalera
    ├── sistema.ts · sistema-copy.ts ← tipos y textos compartidos home/venta/términos
    ├── waitlist.ts · consulting.ts  ← validación y límites de la lista de espera
    ├── kit.ts · kit-orders.ts · kit-payment.ts · kit-mail.ts · order-access.ts · printable.ts
    ├── recibos.ts · schema.ts · short-links.ts · short-links-core.mjs
    ├── track.ts · track-server.ts
    ├── framework.ts     ← 4C, solo para /recursos y /sobre-mi
    ├── wompi.ts · money.ts

scripts/notify-sistema-videos.mjs · scripts/list-kit-orders.mjs
tests/**/*.test.ts       ← Vitest
public/og-image.png · og-image.svg
```

Los componentes históricos fuera de `components/consulting/` siguen alimentando `/recursos` u otras
rutas. Hay huérfanos con la oferta vieja (FAQ, Method, ContactForm, Hero, Services, Profile,
BookFloat) sin importadores: borrarlos en una limpieza aparte, revisando antes las importaciones.

`/herramientas-ia` vive en `src/pages/herramientas-ia/`, `src/components/directory/` y
`src/data/tools.json`.

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
- Arkhē brandbook: `../sara-wrapped/raw/media/00026246-Brandbook_Arkhé.pdf`
- Voz TikTok: `../second-brain/projects/marca-personal-tiktok/serie-90-dias/01-reglas-de-voz.md`
- Casos reales: `../second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md`
- Cotizador de Enzo (contenido y recibos del sistema): `../second-brain/projects/cotizador-enzo/`

---

## Stack

- Astro 7 + TypeScript strict.
- Adapter de Vercel 11 para rutas server-side.
- Tailwind 4 como plugin de Vite (`@tailwindcss/vite`); el tema sigue en `tailwind.config.mjs` vía `@config`.
- Variables privadas en runtime con `getSecret()` de `astro:env/server`. `import.meta.env` se congela
  en el build desde Astro 6 y solo sirve para las `PUBLIC_*`.
- Resend para la lista de espera, los avisos de pedido a Omar y el recibo del comprador.
- Wompi Checkout Web en COP para el directorio, el kit y el sistema.
- Upstash Redis para órdenes, rate limits y correos del PDF.
- Vercel Web Analytics (`@vercel/analytics@2.0.1`, exacto) por el mismo origen.
- Vitest `4.1.12` (exacto) con `getViteConfig` de Astro (`vitest.config.ts`). Para módulos que
  importan `astro:env/server`: `vi.mock('astro:env/server', () => ({ getSecret: ... }))`.
- Bricolage Grotesque Variable + IBM Plex Sans Variable + IBM Plex Mono, self-hosted con Fontsource.
- Sin WebGL, imágenes remotas, loader o dependencia visual externa en el home.

### Regla del lockfile (npm 10)

CI (`.github/workflows/security.yml`) y Vercel instalan con **npm 10**. Un `npm install` con npm 11
reescribe `package-lock.json` y quita los bloques anidados `node_modules/astro/node_modules/esbuild`
(0.28.2) y `@esbuild/*`, y entonces `npm ci` falla en npm 10. Después de cualquier cambio de
dependencias, verificar en un directorio aparte:

```bash
npx npm@10 ci --ignore-scripts
npx npm@10 audit --audit-level=moderate
```

Los dos tienen que salir con código 0 y los bloques anidados de esbuild tienen que seguir en el lock.

## Comandos

```bash
npm install
npm run dev
npm test                 # Vitest: tests/**/*.test.ts
npm run astro -- check
npm run build
npm run preview
npm run offers:check     # PDF, kit $81.000 y zip
npm run content:check    # guías y fichas del directorio (sistemas se valida en el build)
npm run tool:check       # directorio
npm run kit:pending      # órdenes del kit y del sistema
npm run sistema:avisar-videos [-- --send]
```

## Checklist antes de publicar

- [ ] `npm test` en verde.
- [ ] `astro check` sin errores nuevos.
- [ ] `npm run build` exitoso.
- [ ] `npm run offers:check`, `npm run content:check` y `npm run tool:check` en verde.
- [ ] Si cambió `package-lock.json`: `npx npm@10 ci --ignore-scripts` y `npx npm@10 audit
  --audit-level=moderate` en verde, con los bloques anidados de esbuild.
- [ ] Hero llega a `data-phase="3"` con scroll y muestra el estado final con reduced motion.
- [ ] Sin overflow horizontal a 390 px y 1440 px en `/`, `/sistemas`, `/sistemas/detailing`,
  `/tiktok`, `/terminos` y `/privacidad`.
- [ ] Las cuatro piezas conservan coral/púrpura/cobalto/lima en el home y en la página de venta.
- [ ] Ningún precio escrito a mano: todo sale de `getProduct()`/`LADDER`. Ninguna mención de la sesión
  de 120 minutos ni del 4C en el home, el JSON-LD o la OG.
- [ ] Sin `videosDueDate` vigente el botón dice "Abre pronto" y el checkout responde 503.
- [ ] `/sistemas/pedido/<id falso>` no muestra nada del pedido (404 con almacén; 503 sin él).
- [ ] `POST /api/contacto` sin key local devuelve 503 con `fallbackEmail`; con datos inválidos, 400
  con `field`.
- [ ] Formulario conserva required, límites, honeypot, `?quiero=` y el copy fijo de la lista de espera.
- [ ] Ningún error de consola en el home.
- [ ] No se ejecuta un pago real durante QA automático.
- [ ] El archivo temporal `public/resources/~$marco-4c-servicios-omar-alvarez.pptx` es del usuario: no
  borrar, modificar ni versionar.

## Para retomar

1. Leer este archivo completo.
2. Revisar `log.md` y `git status` antes de editar.
3. Leer `wiki/decisiones/sistema-de-enzo.md` (oferta vigente) y
   `wiki/decisiones/sistema-vivo-control-room.md` (dirección de arte).
4. Mantener los invariantes de la lista de espera, del cobro del sistema y del kit, y del directorio.
5. Validar visualmente desktop, móvil y reduced motion antes de publicar.

## Changelog breve

- **2026.10.17 · v4.0:** el sitio vende "El sistema de Enzo · detailing" en preventa ($179.000,
  aprox. USD 55, garantía de 7 días) sobre la infraestructura del kit (`oa-kit-{producto}-*`). El home
  se recentra en la forma de operar de Omar, con recibos con fuente, la sección del sistema y la
  escalera. Salen la sesión de 2 horas y el Marco 4C; el formulario pasa a lista de espera. Entran
  `/sistemas`, `/tiktok`, direcciones cortas, Vercel Web Analytics y Vitest. Decisión en
  `wiki/decisiones/sistema-de-enzo.md`.
- **2026.10.16 · fichas ampliadas:** colección `src/content/fichas/` con tarea, caso, límites, alternativas y checklist de pago para las 32 herramientas, con fuentes oficiales. No toca `tools.json` ni Wompi.
- **2026.10.16 · dependencias:** Astro 7, adapter de Vercel 11 y Tailwind 4. `npm audit` queda en cero. Las variables privadas pasan a `getSecret()` para no congelarse en el build.
- **2026.10.16 · v3.5:** se elimina el cobro de la consultoría (Wompi, TRM, órdenes en Adjudika y
  Cal.com tras pago). Entra el formulario de contacto que llega al correo de Omar. El directorio y
  el kit conservan su cobro.
- **2026.10.16 · ofertas del directorio:** PDF de prompts con correo en Upstash, kit `oa-kit-*` a $81.000 y calculadoras en `/herramientas-ia/recursos`. El checkout queda cerrado si faltan las variables de pago.
- **2026.10.16 · guías:** colecciones en `/herramientas-ia` para tareas, noticias, prompts, herramienta de la semana, comparativas, alternativas, casos y tendencias. Publicar es agregar un Markdown.
- **2026.10.16 · directorio:** `/herramientas-ia` con 32 herramientas, fichas, categorías, planes en COP y checkout Wompi separado de la consultoría (`oa-directorio-*`).
- **2026.08.20 · v3.3:** reemplazo total de “expediente editorial” por “Sistema vivo / taller
  abierto”; hero 4C code-native, nueva tipografía, paleta funcional, proyectos interactivos, checkout y
  agenda congruentes.
- **2026.08.20 · v3.2:** Marco 4C y tasa operativa diaria con spread explícito de 1,65%.
- **2026.08.19 · v3.1:** precio base `USD 797`, secuencia TikTok y TRM dinámica.
- **2026.08.19 · v3.0:** oferta única de 120 minutos con Wompi y Cal.com.
