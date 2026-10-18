# Salida 1 · "El sistema de Enzo" se puede vender — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar a la venta, en preventa, "El sistema de Enzo · detailing" ($179.000) y recentrar el
home en la forma de operar de Omar, con lista de espera, `/tiktok`, direcciones cortas y medición.

**Architecture:** El producto nuevo reutiliza el cobro del kit (Wompi + Upstash + webhook
`/api/herramientas/evento`), generalizado a un catálogo de productos con referencias
`oa-kit-{producto}-…`. Así Adjudika sigue reenviando sin cambios. La venta vive en una colección
nueva, `sistemas`. El formulario de contacto pasa a ser lista de espera y deja intactos sus
invariantes de servidor. Cada pieza nueva de lógica va en un módulo puro con prueba unitaria.

**Tech Stack:** Astro 7.4 + TypeScript strict, adapter de Vercel 11, Tailwind 4, Upstash Redis,
Resend, Wompi Checkout Web, Vitest (nuevo, solo dev), `vercel/analytics` (nuevo).

**Spec:** `docs/superpowers/specs/2026-10-17-escalera-del-operador-design.md`. Leerlo completo
antes de empezar; §4, §6 y §7 (salida 1) mandan.

## Global Constraints

- **Base:** rama nueva desde `origin/main` (`ed364e2` o posterior), nunca desde el `main` local
  ni desde `feat/contacto-sin-pago`.
- **Repo:** español en todo el copy y los commits. Trato de **tú**, sin voseo. Primera persona de
  Omar. Voz de `CLAUDE.md` → *Voz*. Nada de "transforma", "potencia", "desbloquea" ni urgencia
  falsa.
- **Plata:** pesos con formato `$179.000` (punto de miles, sin decimales), más la referencia
  "aprox. USD 55". Usar `formatCop` de `src/lib/money.ts`.
- **Límites de Omar:**
  - nada de gurú ni de promesas de resultado;
  - solo herramientas que existan en `src/data/tools.json`;
  - **cero precios internos de Enzo o Arkhē**: los precios de ejemplo dicen "ejemplo";
  - cero datos de clientes, placas o empleados.
- **Producto:**
  - id `enzo-detailing`, nombre `El sistema de Enzo · detailing`;
  - `amountCop: 179000`, `usdReference: 55`;
  - 4 piezas, con ids exactos en este orden: `recepcion`, `checklist`, `entrega`, `seguimiento`;
  - garantía de 7 días;
  - preventa con `videosDueDate` que fija Omar. **Sin fecha no se cobra.**
- **Kit actual intacto:**
  - `oa-kit-talleres-…`, $81.000, USD 25 × $3.230;
  - `npm run offers:check` sigue pasando sin tocar sus aserciones.
- **Formulario:** los invariantes de `CLAUDE.md` siguen vigentes:
  - el servidor revalida todo;
  - honeypot `website`;
  - rate limit de 5 por hora por IP con Upstash, sin bloquear si Upstash falla;
  - con 503 o 502 devuelve `fallbackEmail` y la página ofrece `mailto:`;
  - si el envío falla, no se borra lo escrito.
- **Sin scripts de terceros** en las páginas, salvo `vercel/analytics`, que va por el mismo
  origen. Sin embeds de TikTok o Instagram.
- **Sin media en git:** ni videos ni pósters pesados.
- **Copy fijo** (exacto, del spec):
  - lista de espera: "Hoy no estoy tomando instalaciones ni sesiones. Si te anotas, te escribo
    cuando abra cupo. Si es una pregunta del sistema, te respondo por correo.";
  - CTA del nav: "ver el sistema de Enzo".
- **Cada tarea cierra con:** `npm test`, `npm run astro -- check` (0 errores) y `npm run build`
  en verde antes del commit.

## Review Focus

1. **Comprar sin fecha de videos o con la fecha vencida.** Se espera que no se cobre: el checkout
   responde 503 "Abre pronto" y el botón sale deshabilitado. Prueba en Task 2
   (`isProductOnSale`) y en Task 6 (checkout).
2. **Comprador que abre el correo en otro dispositivo, sin cookie.** Se espera que vea la
   descarga y los videos con el enlace del correo. Prueba en Task 7 (`canViewProductOrder` solo
   con `linkToken`).
3. **Evento de Wompi cuyo producto o monto no coincide con la orden.** Se espera `MISMATCH`, sin
   descarga ni correo. Prueba en Task 4.
4. **Wompi reintenta el mismo APPROVED.** Se espera un solo correo al comprador. Prueba en
   Task 5.
5. **Lista de espera con `?quiero=` inválido o con oficio "otro" sin texto.** Se espera que la
   página no se rompa, que el selector quede vacío y que el servidor responda 400 con el campo.
   Prueba en Task 3.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `vitest.config.ts`, `tests/**` | Pruebas unitarias (nuevo) |
| `src/data/sistema-enzo-detailing.json` | Metadatos de venta del producto: precio, preventa, videos, tarjetas extranjeras |
| `src/data/sistema-enzo-detailing-contenido.json` | Contenido entregable: guía, piezas, plantillas y herramientas con costo |
| `src/lib/products.ts` | Catálogo `talleres` + `enzo-detailing`, referencias, monto y regla de venta (puro) |
| `src/lib/kit.ts` | Se conserva para el kit y delega en `products.ts` |
| `src/lib/kit-orders.ts`, `kit-payment.ts`, `kit-mail.ts` | Órdenes, liquidación y correos por producto |
| `src/lib/sistema.ts` | Tipos del contenido del sistema |
| `scripts/notify-sistema-videos.mjs` | Aviso a compradores cuando salen los videos |
| `src/lib/order-access.ts` | Quién puede ver una orden: cookie o enlace del correo (puro) |
| `src/lib/printable.ts` | Se agrega `buildSistemaZip` |
| `src/pages/api/herramientas/kit-checkout.ts`, `kit-archivo.ts` | Aceptan `product` |
| `src/content.config.ts` + `src/content/sistemas/detailing.md` | Colección `sistemas` |
| `src/pages/sistemas/index.astro`, `[slug].astro`, `pedido/[orderId].astro` | Venta y pedido |
| `src/data/recibos.json` + `wiki/sintesis/recibos-operativos.md` | Cifras con fuente |
| `src/data/oficios.json`, `src/data/paises.json`, `src/lib/waitlist.ts` | Lista de espera (puro) |
| `src/lib/ladder.ts` | Escalera (puro) |
| `src/components/home/SistemaEnzo.astro`, `src/components/home/Ladder.astro` | Secciones nuevas del home |
| `src/components/consulting/*`, `src/pages/index.astro`, `src/lib/schema.ts` | Home recentrado |
| `src/data/short-links.json`, `astro.config.mjs`, `src/pages/tiktok.astro` | Bio y direcciones cortas |
| `src/lib/track.ts`, `src/layouts/Layout.astro` | Medición |
| `src/pages/terminos.astro`, `src/pages/privacidad.astro`, `src/lib/legal.ts` | Condiciones |
| `CLAUDE.md`, `log.md`, `index.md`, `wiki/decisiones/sistema-de-enzo.md` | Documentación |

---

### Task 0: Rama limpia desde `origin/main`

**Files:** ninguno.

- [ ] **Step 1:** Comparar la copia de trabajo de `feat/contacto-sin-pago` con `origin/main`:
  `git fetch origin && git diff origin/main --stat`. Mostrarle a Omar la diferencia que quede
  (según la revisión del spec, una clase en `src/layouts/Layout.astro`). No descartar nada sin su
  respuesta.
- [ ] **Step 2:** Crear el worktree y la rama `feat/sistema-de-enzo-salida-1` desde `origin/main`
  con `superpowers:using-git-worktrees`.
- [ ] **Step 3:** Correr `npm ci && npm run astro -- check && npm run build && npm run offers:check`.
  Esperado: todo verde. Es la línea base.

### Task 1: Arnés de pruebas con Vitest

**Files:**
- Create: `vitest.config.ts`, `tests/smoke.test.ts`
- Modify: `package.json` (devDependency `vitest`, script `"test": "vitest run"`)

**Interfaces:**
- Produces: `npm test`, que corre `tests/**/*.test.ts` con la resolución de Vite de Astro
  (importa JSON y `.ts` sin extensión).

- [ ] **Step 1:** Instalar `vitest` con una versión fija que acepte la Vite instalada (6.4.x):
  `npm i -D vitest3.2.4`. Si `npm ls vite` muestra otra mayor, elegir la vitest que la acepte y
  anotarlo en el commit.
- [ ] **Step 2:** `vitest.config.ts` con `getViteConfig` de `astro/config`,
  `test.include: ['tests/**/*.test.ts']` y `test.environment: 'node'`.
- [ ] **Step 3:** Escribir la prueba de humo:

```ts
import { describe, expect, it } from 'vitest';
import { parseKitReference } from '../src/lib/kit';

describe('arnés', () => {
  it('lee una referencia del kit actual', () => {
    expect(parseKitReference('oa-kit-talleres-q8100000-d20261016-t1710000000000-abcdef12'))
      .toMatchObject({ amountInCents: 8_100_000 });
  });
});
```

- [ ] **Step 4:** `npm test`. Esperado: 1 passed.
- [ ] **Step 5:** Commit: `chore(test): agregar vitest con la config de Astro`.

### Task 2: Catálogo de productos y referencias

**Files:**
- Create: `src/data/sistema-enzo-detailing.json`, `src/lib/products.ts`, `tests/products.test.ts`
- Modify: `src/lib/kit.ts` (delegar sin cambiar sus exports)

**Interfaces:**
- Consumes: `bogotaToday(now?: Date): string` de `src/lib/directory.ts`; `src/data/kit.json`.
- Produces:

```ts
export type ProductId = 'talleres' | 'enzo-detailing';
export interface ProductVideo { title: string; url: string }
export interface Product {
  id: ProductId;
  name: string;
  amountCop: number;
  usdReference: number;
  downloadDays: number;        // talleres 14, enzo-detailing 120
  buyerEmail: boolean;         // talleres false, enzo-detailing true
  page: string;                // '/herramientas-ia/kit' | '/sistemas/detailing'
  orderPath: string;           // '/herramientas-ia/kit/pedido' | '/sistemas/pedido'
  archiveName: string;         // 'kit-ia-talleres-detailing.zip' | 'sistema-enzo-detailing.zip'
  guaranteeDays: number | null;            // null | 7
  acceptsForeignCards: boolean | null;     // null = no verificado
  presale: { videosDueDate: string | null; videos: ProductVideo[] } | null; // talleres: null
}
export const PRODUCT_IDS: readonly ProductId[];
export function getProduct(id: unknown): Product | null;
export function productAmountInCents(id: ProductId): number;
export function createProductReference(id: ProductId, now?: Date): string;
export function parseProductReference(reference: unknown): { product: ProductId; amountInCents: number } | null;
export function isProductOnSale(product: Product, today: string): boolean;
```

`kit.ts` conserva `KIT`, `kitAmountInCents()`, `createKitReference()` (=
`createProductReference('talleres')`), `parseKitReference()` (= `parseProductReference`, que
ahora también devuelve `product`), `kitDownloadPath`, `KIT_BUSINESSES` e `isKitBusiness`.

- [ ] **Step 1:** Crear `src/data/sistema-enzo-detailing.json`:

```json
{
  "id": "enzo-detailing",
  "name": "El sistema de Enzo · detailing",
  "amountCop": 179000,
  "usdReference": 55,
  "downloadDays": 120,
  "buyerEmail": true,
  "page": "/sistemas/detailing",
  "orderPath": "/sistemas/pedido",
  "archiveName": "sistema-enzo-detailing.zip",
  "guaranteeDays": 7,
  "acceptsForeignCards": null,
  "presale": { "videosDueDate": null, "videos": [] }
}
```

- [ ] **Step 2:** Escribir `tests/products.test.ts`:

```ts
describe('productos', () => {
  it('kit: $81.000 sigue la regla USD 25 × 3.230', () => {
    expect(getProduct('talleres')).toMatchObject({ amountCop: 81000, usdReference: 25 });
  });
  it('sistema: $179.000 fijo en pesos', () => {
    expect(productAmountInCents('enzo-detailing')).toBe(17_900_000);
  });
  it('referencia ida y vuelta para cada producto', () => {
    for (const id of PRODUCT_IDS) {
      const ref = createProductReference(id, new Date('2026-10-17T15:00:00Z'));
      expect(ref).toMatch(new RegExp(`^oa-kit-${id}-q\\d{7,12}-d20261017-t\\d{13}-[a-f0-9]{8}$`));
      expect(parseProductReference(ref)).toEqual({ product: id, amountInCents: productAmountInCents(id) });
    }
  });
  it('rechaza monto de otro producto', () => {
    expect(parseProductReference('oa-kit-enzo-detailing-q8100000-d20261017-t1710000000000-abcdef12')).toBeNull();
  });
  it('rechaza producto desconocido y prefijos ajenos', () => {
    expect(parseProductReference('oa-kit-cafe-q17900000-d20261017-t1710000000000-abcdef12')).toBeNull();
    expect(parseProductReference('oa-directorio-basico-q9400000-d20261017-t1710000000000-abcdef12')).toBeNull();
    expect(parseProductReference('oa-consultoria-2h-x')).toBeNull();
    expect(parseProductReference(42)).toBeNull();
  });
  it('sin fecha de videos no se vende', () => {
    const p = getProduct('enzo-detailing')!;
    expect(isProductOnSale({ ...p, presale: { videosDueDate: null, videos: [] } }, '2026-10-17')).toBe(false);
  });
  it('con fecha vencida no se vende; con fecha futura sí', () => {
    const p = getProduct('enzo-detailing')!;
    expect(isProductOnSale({ ...p, presale: { videosDueDate: '2026-10-16', videos: [] } }, '2026-10-17')).toBe(false);
    expect(isProductOnSale({ ...p, presale: { videosDueDate: '2026-11-30', videos: [] } }, '2026-10-17')).toBe(true);
  });
  it('el kit siempre está a la venta', () => {
    expect(isProductOnSale(getProduct('talleres')!, '2026-10-17')).toBe(true);
  });
});
```

- [ ] **Step 3:** `npm test -- products`. Esperado: FAIL, el módulo no existe.
- [ ] **Step 4:** Implementar `src/lib/products.ts`. La regex se arma desde `PRODUCT_IDS`. Al
  cargar el módulo valida que `talleres` siga la regla USD × tasa y que `enzo-detailing` tenga
  `amountCop` entero positivo; si no, lanza error. Luego `kit.ts` delega en `products.ts`.
- [ ] **Step 5:** `npm test && npm run offers:check`. Esperado: todo PASS (el kit no cambió).
- [ ] **Step 6:** Commit: `feat(productos): catálogo con el sistema de Enzo y referencias por producto`.

### Task 3: Escalera, oficios, países y validación de la lista de espera

**Files:**
- Create: `src/lib/ladder.ts`, `src/lib/waitlist.ts`, `src/data/oficios.json`,
  `src/data/paises.json`, `tests/waitlist.test.ts`, `tests/ladder.test.ts`
- Modify: `src/lib/consulting.ts` (`CONTACT_LIMITS` agrega `oficioOtro: 60` y `message: 600`;
  `problemMin` y `problemMax` salen cuando nadie los use)

**Interfaces:**
- `oficios.json` es una lista de `{ id, label }`, con ids exactos:
  `detailing`, `taller`, `coworking`, `cafe-restaurante`, `clinica`, `inmobiliaria`,
  `peluqueria`, `otro`.
- `paises.json` es una lista de `{ id, label }` con códigos ISO-2:
  - AR, BO, BR, CL, CO, CR, EC, SV, GT, HN, MX, NI, PA, PY, PE, PR, DO, UY, VE;
  - más `XX` = "Otro".
- Produces:

```ts
export type RungId = 'pdf' | 'kit' | 'sistema-enzo' | 'lista';
export interface Rung { id: RungId; name: string; forWho: string; gets: string;
  priceCop: number | null; usdReference: number | null;
  action: 'correo' | 'compra' | 'preventa' | 'anotarse'; href: string }
export const LADDER: readonly Rung[];       // en ese orden
export const PRIMARY_RUNG: RungId;          // 'sistema-enzo'

export const WAITLIST_WANTS: readonly ['instalacion', 'sesion', 'otro-oficio', 'pregunta-sistema'];
export interface WaitlistInput { name: string; email: string; phone: string; business: string;
  want: (typeof WAITLIST_WANTS)[number]; oficio: string; oficioOtro: string; country: string; message: string }
export function validateWaitlist(body: Record<string, unknown>):
  | { ok: true; value: WaitlistInput }
  | { ok: false; field: keyof WaitlistInput | 'accepted'; error: string };
export function wantFromQuery(value: string | null): WaitlistInput['want'] | null;
```

- Los precios y destinos de `LADDER` salen de `getProduct()`, nunca escritos a mano:
  - `pdf` → `/herramientas-ia/prompts-gratis`;
  - `kit` → `/herramientas-ia/kit`;
  - `sistema-enzo` → `/sistemas/detailing`;
  - `lista` → `/#contacto`.

- [ ] **Step 1:** Escribir las pruebas:
  - **ladder:** el orden de ids es `pdf, kit, sistema-enzo, lista`; el precio del kit es 81000 y
    el del sistema 179000; `PRIMARY_RUNG` es `'sistema-enzo'`.
  - **waitlist, casos válidos:** el caso válido mínimo es `{name, email, want:'instalacion',
    oficio:'detailing', country:'CO', accepted:true}`.
  - **waitlist, campos con error:**
    - `want` inválido → `field:'want'`;
    - `oficio:'otro'` sin `oficioOtro` → `field:'oficioOtro'`;
    - `oficioOtro` de 61 caracteres queda recortado a 60 o da error (elegir error);
    - `country:'US'` → `field:'country'`;
    - `want:'pregunta-sistema'` con `message` de menos de 20 → `field:'message'`;
    - `message` de 601 caracteres → `field:'message'`;
    - teléfono `abc` → `field:'phone'` (reusar `isContactPhone`);
    - sin `accepted` → `field:'accepted'`.
  - **`wantFromQuery`:** `'instalacion'` → `'instalacion'`; `'<x>'` → `null`.
- [ ] **Step 2:** `npm test -- waitlist ladder`. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npm test`. Esperado: PASS.
- [ ] **Step 5:** Commit: `feat(lista): escalera y validación de la lista de espera`.

### Task 4: Órdenes y liquidación por producto

**Files:**
- Modify: `src/lib/kit-orders.ts` (`KitOrder.product: ProductId`;
  `createKitOrder({ …, product })`)
- Modify: `src/lib/kit-payment.ts` (`settleKitPayment(transaction, parsed)`)
- Modify: `src/pages/api/herramientas/evento.ts`
- Test: `tests/kit-payment.test.ts`

**Interfaces:**
- Consumes: `parseProductReference`, `getProduct` (Task 2).
- Produces:
  - `settleKitPayment(transaction: WompiTransaction, parsed: { product: ProductId; amountInCents: number }): Promise<KitSettlement>`;
  - la descarga vence a los `getProduct(order.product).downloadDays`;
  - las órdenes viejas sin `product` válido se tratan como `talleres`.

- [ ] **Step 1:** Escribir las pruebas con `vi.mock('../src/lib/kit-orders')` y
  `vi.mock('../src/lib/kit-mail')`, con una orden en memoria:
  - `MISMATCH` cuando la orden es `talleres` y `parsed.product` es `enzo-detailing`;
  - `MISMATCH` cuando `transaction.amount_in_cents` difiere de `parsed.amountInCents`;
  - una orden `enzo-detailing` APPROVED tiene `downloadExpiresAt` = `approvedAt` + 120 días;
  - una orden `talleres` APPROVED sigue con 14 días.
- [ ] **Step 2:** `npm test -- kit-payment`. Esperado: FAIL.
- [ ] **Step 3:** Implementar. `evento.ts` pasa el objeto que devuelve `parseKitReference`.
  `scripts/list-kit-orders.mjs` (`npm run kit:pending`) imprime también la columna `producto`
  y el país; así se cuentan las ventas si no hay eventos de analítica.
- [ ] **Step 4:** `npm test`. Esperado: PASS.
- [ ] **Step 5:** Commit: `feat(pagos): liquidar órdenes del kit por producto`.

### Task 5: Correo al comprador

**Files:**
- Modify: `src/lib/kit-mail.ts`, `src/lib/kit-payment.ts`
- Test: `tests/kit-mail.test.ts`

**Interfaces:**
- Produces:
  - `sendBuyerReceipt(order: KitOrder, siteUrl: string): Promise<KitMailResult>`;
  - `buyerOrderLink(order: KitOrder, siteUrl: string): string`, que devuelve
    `${siteUrl}${product.orderPath}/${order.id}?t=${order.downloadToken}`.
- Comportamiento:
  - va del remitente `DIRECTORY_NOTIFY_FROM` al `order.email`;
  - `reply_to` es `DIRECTORY_NOTIFY_EMAIL` o `omaraalvarezogmail.com`;
  - asunto: `Tu compra: El sistema de Enzo · detailing`;
  - el texto trae monto, enlace, fecha límite de videos y garantía de 7 días "escribiendo a este
    correo".
- En `settleKitPayment`, tras un APPROVED de un producto con `buyerEmail: true`, se envía una
  sola vez por transacción. La alerta usa la clave `buyer:{transactionId}` en
  `alertedTransactionIds` y el mismo candado `claimKitMailLock`.

- [ ] **Step 1:** Escribir las pruebas:
  - con `fetch` simulado, dos liquidaciones APPROVED de la misma transacción mandan un solo
    correo al comprador;
  - el cuerpo contiene `/sistemas/pedido/{id}?t=`;
  - `talleres` no manda correo al comprador;
  - sin `RESEND_API_KEY` devuelve `'unconfigured'` y no lanza error.
- [ ] **Step 2:** `npm test -- kit-mail`. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npm test`. Esperado: PASS.
- [ ] **Step 5: Aviso de videos.** Crear `scripts/notify-sistema-videos.mjs` y el script
  `"sistema:avisar-videos"` en `package.json`, con el mismo arranque de `list-kit-orders.mjs`
  (`--env-file-if-exists`, Upstash por REST).
  - Recorre las órdenes APPROVED de `enzo-detailing` que no tienen `videosNotifiedAt`.
  - A cada comprador le manda por Resend "Ya están tus videos", con `buyerOrderLink`.
  - Marca `videosNotifiedAt` en la orden.
  - Sin `--send` solo lista; con `--send` envía.
  - Si `presale.videos` está vacío, no hace nada.
  - Lo corre Omar, o el agente con su aprobación.
- [ ] **Step 6:** Commit: `feat(pagos): correo al comprador y aviso de videos`.

### Task 6: Checkout por producto

**Files:**
- Modify: `src/pages/api/herramientas/kit-checkout.ts`
- Modify: `src/lib/products.ts` (agregar `validateCheckoutInput`)
- Test: `tests/checkout-input.test.ts`

**Interfaces:**
- Produces:

```ts
export function validateCheckoutInput(input: Record<string, unknown>):
  | { ok: true; product: ProductId; buyerName: string; email: string; business: string; country: string }
  | { ok: false; error: string };
```

- Reglas:
  - `product` ausente equivale a `talleres`, así el formulario del kit no cambia;
  - en `talleres`, `business` debe pasar `isKitBusiness`;
  - en `enzo-detailing`, `business` es el nombre del negocio, de 2 a 80 caracteres y saneado;
  - `country` es un id de `src/data/paises.json` (Task 3) y solo se exige en `enzo-detailing`.
- El endpoint:
  - responde 503 `{ error: 'Abre pronto. Anótate en la lista y te aviso.' }` si
    `!isProductOnSale(product, bogotaToday())`;
  - el `redirectUrl` es `${product.orderPath}/${orderId}`;
  - guarda `country` en la orden (campo opcional nuevo de `KitOrder`).

- [ ] **Step 1:** Escribir las pruebas de `validateCheckoutInput`:
  - el kit sin `product` es válido como hoy;
  - `enzo-detailing` sin país da error;
  - un producto desconocido da error;
  - un nombre con `<script>` queda saneado sin `<>`.
- [ ] **Step 2:** `npm test -- checkout-input`. Esperado: FAIL.
- [ ] **Step 3:** Implementar la función y el endpoint.
- [ ] **Step 4:** `npm test`. Esperado: PASS. Con `npm run dev`, un
  `curl -X POST localhost:4321/api/herramientas/kit-checkout -H 'content-type: application/json' -d '{"product":"enzo-detailing","buyerName":"Ana","email":"ab.co","business":"Brillo","country":"CO"}'`
  responde 503 "Abre pronto", porque `videosDueDate` es `null`.
- [ ] **Step 5:** Commit: `feat(checkout): vender el sistema de Enzo con preventa cerrada sin fecha`.

### Task 7: Descarga, acceso y página del pedido

**Files:**
- Create: `src/lib/order-access.ts`, `src/pages/sistemas/pedido/[orderId].astro`,
  `tests/order-access.test.ts`
- Modify: `src/pages/api/herramientas/kit-archivo.ts` (archivo según `order.product`),
  `src/lib/printable.ts` (`buildSistemaZip`), `vercel.json` (headers de
  `/sistemas/pedido/(.*)` iguales a los de `/herramientas-ia/kit/pedido/(.*)`)

**Interfaces:**
- Consumes: nada nuevo. Esta tarea **define** `SistemaContent` (abajo). Task 8 lo llena; aquí
  basta un contenido mínimo de prueba en `tests/fixtures/sistema-min.json`.
- Produces (los tipos van en `src/lib/sistema.ts`):

```ts
export interface SistemaTool {
  slug: string; role: string; plan: string;
  monthlyCostUsd: number | null; monthlyCostCop: number | null;
  checkedOn: string; sourceUrl: string; enzoUses: boolean;
}
export interface SistemaPiece {
  id: 'recepcion' | 'checklist' | 'entrega' | 'seguimiento';
  title: string; why: string; steps: string[]; tools: string[];
  templates: { file: string; title: string; body: string }[];
}
export interface SistemaContent { intro: string; setupOrder: string[]; pieces: SistemaPiece[]; tools: SistemaTool[] }
```


```ts
export function canViewProductOrder(
  order: { status: string; downloadToken?: string },
  opts: { cookieMatches: boolean; linkToken: string | null },
): boolean; // cookie válida, o APPROVED + linkToken igual al downloadToken (comparación de tiempo constante)
export function buildSistemaZip(content: SistemaContent): Uint8Array;
```

- La página del pedido muestra:
  - estado del pago;
  - botón de descarga (`kitDownloadPath(order.id, order.downloadToken)`);
  - los videos de `presale.videos` si hay, o si no "Los videos llegan antes del
    {videosDueDate}";
  - garantía de 7 días.

  Va con `noindex` y sin cache.

- [ ] **Step 1:** Escribir las pruebas:
  - `canViewProductOrder` da true solo con cookie;
  - da true solo con `linkToken` correcto y APPROVED;
  - da false con `linkToken` correcto y PENDING;
  - da false con `linkToken` incorrecto;
  - `buildSistemaZip` contiene `leeme.txt`, `guia-sistema-enzo-detailing.pdf` y una carpeta por
    pieza (`1-recepcion/`, `2-checklist/`, `3-entrega/`, `4-seguimiento/`).
- [ ] **Step 2:** `npm test -- order-access`. Esperado: FAIL.
- [ ] **Step 3:** Implementar. `buildSistemaZip` usa `buildPdf` y `zipStore`, que ya existen.
- [ ] **Step 4:** `npm test` y `npm run build`. Esperado: PASS.
- [ ] **Step 5:** Commit: `feat(pedido): página del sistema con enlace del correo y descarga`.

### Task 8: Contenido del producto

**Files:**
- Create: `src/data/sistema-enzo-detailing-contenido.json`, `tests/sistema-contenido.test.ts`
- Modify: `src/data/tools.json` (solo con `npm run tool:add`, si falta una herramienta)

**Interfaces:**
- Consumes: `SistemaContent`, `SistemaPiece` y `SistemaTool` de `src/lib/sistema.ts` (Task 7).

- [ ] **Step 1:** Leer las fuentes reales, sin copiar datos de clientes, llaves ni precios:
  - **Enzo:** `../grupo-enzo/enzo-motorsport/` (Garantía Digital por placa, encuesta NPS,
    `netlify/functions/`);
  - **Cotizador:** `../second-brain/projects/cotizador-enzo/` (inspección, fotos, firmas de
    entrega, kiosco).

  Anotar en un borrador qué hace cada sistema en cada una de las 4 piezas.
- [ ] **Step 2:** Elegir la mejor herramienta para cada pieza en un detailing, aunque sea paga
  (decisión de Omar). Hay que verificar cada plan y precio en la página oficial del proveedor el
  mismo día y anotar `checkedOn` y `sourceUrl`. Si no está en el directorio, se agrega con
  `npm run tool:add` y se corre `npm run tool:check`. `enzoUses: true` solo si Enzo la usa de
  verdad.
- [ ] **Step 3:** Escribir las pruebas:
  - las piezas son exactamente `['recepcion','checklist','entrega','seguimiento']`;
  - cada pieza tiene de 3 a 8 pasos y al menos una plantilla;
  - todo `slug` está en `tools.json`;
  - toda herramienta tiene `checkedOn` en formato ISO y `sourceUrl` https;
  - **ninguna plantilla trae `$` seguido de dígitos en una línea que no diga "ejemplo"**;
  - ninguna plantilla trae algo que parezca una placa colombiana (`/\b[A-Z]{3}\s?\d{3}\b/`);
  - el texto no contiene "transforma", "potencia", "desbloquea" ni "garantizado".
- [ ] **Step 4:** `npm test -- sistema-contenido`. Esperado: FAIL, el archivo no existe.
- [ ] **Step 5:** Escribir el contenido. Tiene que traer:
  - guía de montaje en orden;
  - plantilla de recepción con fotos (qué fotos tomar y en qué orden);
  - checklist de trabajo;
  - acta de entrega para firmar;
  - mensajes de "ya está listo", garantía, posventa y reseña;
  - flujos exportables si la herramienta los permite.

  Todo de tú, con la voz de Omar.
- [ ] **Step 6:** `npm test` y `npm run tool:check`. Esperado: PASS.
- [ ] **Step 7:** **Compuerta: Omar revisa el contenido** (enviárselo como archivo) antes de que
  se fije `videosDueDate`. Commit: `feat(sistema): contenido del sistema de Enzo para detailing`.

### Task 9: Cifras con fuente

**Files:**
- Create: `src/data/recibos.json`, `wiki/sintesis/recibos-operativos.md`, `tests/recibos.test.ts`

**Interfaces:**
- Produces:

```ts
// src/data/recibos.json
type Recibo = {
  id: string; value: string; label: string; origin: string;
  negocio: 'enzo' | 'arkhe' | 'grupo';
  source: string; method: string; date: string;
};
```

- Reglas del spec §6.8:
  - "aprox." en `value`;
  - `origin` es la línea pública ("medido en el cotizador de Enzo, oct 2026");
  - `source` es la ruta interna y **nunca se imprime**;
  - sin precios internos.

- [ ] **Step 1:** Escribir las pruebas:
  - todo recibo tiene `source`, `method` y `date` ISO;
  - `value` incluye "aprox.";
  - los ids son únicos;
  - hay al menos 2 recibos `negocio: 'enzo'`.
- [ ] **Step 2:** `npm test -- recibos`. Esperado: FAIL.
- [ ] **Step 3:** Sacar de los repos (cotizador, enzo-motorsport, `log.md`,
  `../second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md`) al menos
  3 cifras de entregas o tiempos de Enzo que tengan respaldo en un archivo. Documentarlas en la
  síntesis con frontmatter (`titulo, tipo: sintesis, dominio, creado, actualizado, fuentes`). La
  cifra sin archivo que la respalde no entra.
- [ ] **Step 4:** `npm test`. Esperado: PASS.
- [ ] **Step 5:** Commit: `docs(recibos): cifras operativas de Enzo con fuente`.

### Task 10: Colección `sistemas` y página de venta

**Files:**
- Modify: `src/content.config.ts` (colección `sistemas`), `src/pages/sitemap.xml.ts`,
  `src/pages/llms.txt.ts`
- Create: `src/content/sistemas/detailing.md`, `src/pages/sistemas/index.astro`,
  `src/pages/sistemas/[slug].astro`

**Interfaces:**
- Consumes:
  - `getProduct`, `isProductOnSale` (Task 2);
  - `SistemaContent` (Task 8);
  - `recibos.json` (Task 9);
  - `oficios.json` (Task 3);
  - `trackEvent` (Task 15): mientras no exista, se dejan los atributos `data-track`.
- Esquema de `sistemas`:
  - `...base` (title, description, published, updated, draft);
  - `oficio`: id de `oficios.json`;
  - `negocio: 'enzo' | 'arkhe'`;
  - `product`: `ProductId`;
  - `problem`: mínimo 40;
  - `enzoHow`: mínimo 80;
  - `receipts`: ids de `recibos.json`, al menos 2, validados con `refine`;
  - `faqs`: `faq[]`, al menos 5.
- La página `[slug]` arma, en este orden:
  1. problema;
  2. cómo lo resolvió Enzo (recibos con su `origin`);
  3. las 4 piezas;
  4. herramientas con costo mensual y "consultado el {checkedOn}";
  5. qué recibes (al pagar / en preventa);
  6. precio `formatCop(179000)` + "aprox. USD 55";
  7. preventa con la fecha;
  8. garantía;
  9. FAQ;
  10. formulario de compra.
- El formulario hace POST a `/api/herramientas/kit-checkout` con `product: 'enzo-detailing'`.
  Si `!isProductOnSale`, el botón sale deshabilitado con "Abre pronto" y enlaza a
  `/?quiero=pregunta-sistema#contacto`.
- **FAQ obligatorias:**
  - qué incluye;
  - en qué se diferencia del kit de $81.000;
  - cuánto cuestan las herramientas al mes;
  - cuándo llegan los videos;
  - garantía;
  - **pago desde fuera de Colombia.** Su texto depende de `acceptsForeignCards`: `true` → "Sí";
    `false` → "Por ahora no; anótate con tu país"; `null` → "Lo estoy confirmando con Wompi;
    escríbeme antes de pagar".
- JSON-LD: `Product` con `Offer` (precio `179000`, `COP`, `PreOrder` mientras haya preventa),
  `FAQPage` y `BreadcrumbList`.
- `/sistemas` lista los sistemas publicados y debajo dice "¿Lo quieres para tu oficio?
  Anótate", con enlace a `/?quiero=otro-oficio#contacto`.
- Al sitemap y a `llms.txt` entran `/sistemas` y `/sistemas/detailing`. La guía
  `/herramientas-ia/para/detailing` y el sistema se enlazan entre sí.

- [ ] **Step 1:** Escribir el esquema y `detailing.md` con `draft: false` y los ids de recibos.
- [ ] **Step 2:** `npm run astro -- check && npm run build`. Esperado: PASS;
  `dist/client/sistemas/detailing/index.html` (o la ruta que use el adapter) contiene `$179.000`
  y "Abre pronto".
- [ ] **Step 3:** QA en navegador a 390 px y 1440 px: sin overflow, cero errores de consola y el
  botón deshabilitado sin fecha.
- [ ] **Step 4:** Commit: `feat(sistemas): página de venta del sistema de Enzo`.

### Task 11: Formulario y API de la lista de espera

**Files:**
- Modify: `src/components/consulting/ConsultingContact.astro`, `src/pages/api/contacto.ts`

**Interfaces:**
- Consumes: `validateWaitlist`, `wantFromQuery`, `oficios.json`, `paises.json` (Task 3).
- El API reemplaza `frameworkStage` y `SERVICE_SYSTEM_STAGES` por `validateWaitlist`. El correo
  a Omar lleva filas para qué quiere, oficio (o texto de "otro"), país y mensaje. El asunto es
  `Lista de espera · {want} · {business}`. La clave de idempotencia usa los campos nuevos.
  Todo lo demás del endpoint se queda igual.
- El formulario:
  - quita el brief 4C;
  - agrega `want` (radios), `oficio` (select), `oficioOtro` (visible solo con "otro"), `country`
    (select) y `message`;
  - abre con el copy fijo de lista de espera;
  - al cargar, lee `?quiero=` con `wantFromQuery` y lo preselecciona; si no es válido, no
    preselecciona nada;
  - si el envío falla, no borra lo escrito.
- `framework.ts` **no se borra**: lo usa `src/lib/resources.ts`.

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** Verificar con `npm run dev`:
  - POST sin `RESEND_API_KEY` responde 503 con `fallbackEmail`;
  - POST con `country:'US'` responde 400 con `field:'country'`;
  - POST con honeypot `website` lleno responde 200 sin enviar nada;
  - `/?quiero=instalacion#contacto` preselecciona instalación;
  - `/?quiero=<x>#contacto` no rompe la página ni deja errores en consola.
- [ ] **Step 3:** `npm test && npm run astro -- check && npm run build`.
- [ ] **Step 4:** Commit: `feat(contacto): el formulario del home pasa a lista de espera`.

### Task 12: Home recentrado

**Files:**
- Create: `src/components/home/SistemaEnzo.astro`, `src/components/home/Ladder.astro`
- Modify: `src/components/consulting/ConsultingLanding.astro`,
  `src/components/consulting/SystemIgnition.astro`,
  `src/components/consulting/ConversionCTA.astro`, `src/pages/index.astro`, `src/lib/schema.ts`

**Interfaces:**
- Consumes: `LADDER`, `PRIMARY_RUNG` (Task 3); `getProduct`, `isProductOnSale` (Task 2).

- [ ] **Step 1: Quitar.** Salen del home:
  - las secciones `framework` (Marco 4C), `session`, `fit` y `cost`;
  - las constantes `STAGE_ART`, `STAGES` y `AGENDA`, con su CSS y su JS muerto;
  - el placement `'session'` de `ConversionCTA`.
- [ ] **Step 2: Hero, sin 4C.**
  - meta sin "SESIÓN PRIVADA · 120 MIN";
  - cue final `RECIBIR → HACER → ENTREGAR → SEGUIR`;
  - las etiquetas de los nodos del SVG pasan de `C1`–`C4` a `01`–`04`;
  - `data-phase-label` y los textos de las fases describen las 4 piezas;
  - el lead y los botones llevan a `#sistema-enzo` y `#taller`.

  Sin precio en el hero. La animación nueva completa es de la salida 2.
- [ ] **Step 3: Agregar.** Después del rail de sistemas va `<SistemaEnzo />` (`id="sistema-enzo"`):
  - qué resuelve (entregas sin olvidos);
  - las 4 piezas;
  - precio, preventa y botón a `/sistemas/detailing`.

  Después va `<Ladder />`, con el escalón principal resaltado. Ninguna de las dos es una card
  genérica. La paleta funcional va por estado: coral, púrpura, cobalto y lima para las 4 piezas.
- [ ] **Step 4: Navegación, CTA, FAQ y pie.**
  - el CTA del nav dice "ver el sistema de Enzo" y lleva a `/sistemas/detailing`;
  - el `ConversionCTA` del rail apunta a `#sistema-enzo`;
  - el FAQ se reescribe para producto y lista de espera (temas de spec §6.2);
  - la sección `#contacto` cambia su intro a lista de espera.
- [ ] **Step 5: Meta y JSON-LD.**
  - `index.astro` cambia `title` y `description` al sistema y la forma de operar, sin
    "Consultoría 2H";
  - `homeGraph()` deja de ofrecer `ProfessionalService` de consultoría y referencia el `Product`
    `${SITE}/sistemas/detailing#product`.
- [ ] **Step 6: Verificar.**
  - `npm run build`;
  - `grep -ri "120 MIN\|Marco 4C\|Consultoría 2H\|reservar 2 horas" dist/` sin resultados en el
    home;
  - en navegador a 390 px y 1440 px: sin overflow, consola limpia, el hero llega a
    `data-phase="3"`, y con `prefers-reduced-motion: reduce` muestra el estado final.
- [ ] **Step 7:** Commit: `feat(home): recentrar el home en el sistema de Enzo`.

### Task 13: `/tiktok` y direcciones cortas

**Files:**
- Create: `src/data/short-links.json`, `src/pages/tiktok.astro`, `tests/short-links.test.ts`
- Modify: `astro.config.mjs` (`redirects` construidos desde el JSON)

**Interfaces:**
- `short-links.json` es una lista de `{ slug, to, label }`:

```json
[
  { "slug": "entregas", "to": "/sistemas/detailing", "label": "El sistema de Enzo" },
  { "slug": "prompts", "to": "/herramientas-ia/prompts-gratis", "label": "PDF de prompts gratis" },
  { "slug": "kit", "to": "/herramientas-ia/kit", "label": "Kit de $81.000" },
  { "slug": "lista", "to": "/#contacto", "label": "Lista de espera" }
]
```

- Produces:
  - `shortLinkDestination(link): string`, que agrega `ref={slug}` al query string y deja el hash
    al final. Por ejemplo `lista` → `/?ref=lista#contacto`;
  - redirecciones 302 en `astro.config.mjs`.
- `/tiktok`:
  - arriba, el destino de `PRIMARY_RUNG`;
  - debajo, PDF, kit y bitácora (la bitácora solo si la ruta existe);
  - `noindex`, sin scripts de terceros, legible a 390 px.

- [ ] **Step 1:** Escribir las pruebas:
  - los slugs son únicos;
  - ningún slug choca con un archivo o carpeta de `src/pages/`;
  - todo `to` empieza con `/`;
  - `shortLinkDestination` de `entregas` es `/sistemas/detailing?ref=entregas`;
  - el de `lista` es `/?ref=lista#contacto`.
- [ ] **Step 2:** `npm test -- short-links`. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npm test && npm run build`. Con `npm run dev`, `/entregas` redirige a
  `/sistemas/detailing?ref=entregas`.
- [ ] **Step 5:** Commit: `feat(tiktok): página de bio y direcciones cortas`.

### Task 14: Términos y privacidad

**Files:**
- Modify: `src/pages/terminos.astro`, `src/pages/privacidad.astro`, `src/lib/legal.ts`
  (`updated: '2026-10-17'`)

- [ ] **Step 1: Términos, §5.** Agregar el sistema de Enzo:
  - preventa con fecha límite de videos y devolución completa si no llegan;
  - garantía de 7 días calendario desde la compra, escribiendo al correo de Omar y diciendo qué
    no sirvió;
  - **para este producto, la garantía reemplaza la excepción de retracto por archivo
    descargado**;
  - devolución en máximo 30 días calendario.

  Los textos de fecha y precio salen de `getProduct()`.
- [ ] **Step 2: Términos, §6.** "Consultoría" pasa a ser "Sesión privada e instalación": hoy no
  se ofrecen y solo existe la lista de espera, sin compromiso.
- [ ] **Step 3: Privacidad.** Agregar la finalidad "lista de espera" (nombre, correo, WhatsApp,
  negocio, oficio, país, mensaje) con su plazo, el mismo de contacto: 2 años. Agregar "compras
  del sistema" (país y correo del comprador) al plazo de las órdenes: 10 años.
- [ ] **Step 4:** `npm run build`. Leer las dos páginas en el navegador.
- [ ] **Step 5:** Commit: `docs(legal): condiciones del sistema de Enzo y lista de espera`.

### Task 15: Medición

**Files:**
- Create: `src/lib/track.ts`
- Modify: `package.json` (`vercel/analytics`), `src/layouts/Layout.astro`,
  `src/lib/kit-payment.ts` (evento de servidor)

**Interfaces:**
- Produces:

```ts
export type TrackName = 'escalon_click' | 'sistema_checkout_iniciado' | 'sistema_comprado'
  | 'lista_espera_enviada' | 'boletin_suscrito' | 'kit_checkout_iniciado' | 'link_corto';
export function trackEvent(name: TrackName, props?: Record<string, string>): void; // nunca lanza
export function bindTrackedLinks(root?: ParentNode): void; // [data-track] + data-track-* → props
```

- Al cargar cualquier página con `?ref=` en la URL se dispara `link_corto` con `{ ref }`.
- `sistema_comprado` se emite desde el servidor con `track` de `vercel/analytics/server`,
  envuelto en try/catch. Si falla, el pago no falla.

- [ ] **Step 1:** Verificar con el MCP de Vercel (`get_project` / `get_team`) si el plan del
  proyecto permite eventos personalizados.
  - **Si no los permite:** instalar solo `<Analytics />` para las visitas y dejar `trackEvent`
    como no-op con un comentario. Las ventas se cuentan con `npm run kit:pending`.
  - **Si los permite:** implementar todo el bloque.
- [ ] **Step 2:** Instalar con `npm i vercel/analytics` y poner `<Analytics />` de
  `vercel/analytics/astro` en `Layout.astro`. Marcar con `data-track` los CTA de la escalera,
  del sistema, del kit y de `/tiktok`.
- [ ] **Step 3:** `npm run build`. En `npm run dev` la consola sigue limpia y la CSP no se rompe
  (`/_vercel/insights` es del mismo origen).
- [ ] **Step 4:** Commit: `feat(medicion): visitas y eventos de la escalera`.

### Task 16: Documentación, QA final y PR

**Files:**
- Modify: `CLAUDE.md` (v4.0), `log.md`, `index.md`
- Create: `wiki/decisiones/sistema-de-enzo.md`

- [ ] **Step 1: `CLAUDE.md` v4.0.**
  - Reescribir *Objetivo*, *Recorrido*, *Oferta vigente*, *Arquitectura visual del home*,
    *Invariantes del formulario* (lista de espera), *Archivos vigentes* y el checklist.
  - Quitar la consultoría como oferta y dejar el Marco 4C solo como historia.
  - El *Recorrido* queda: TikTok → `/tiktok` o dirección corta → sistema vivo → evidencia →
    sistema de Enzo → compra, o lista de espera.
- [ ] **Step 2: Decisión y bitácora.**
  - `wiki/decisiones/sistema-de-enzo.md` con frontmatter, el registro de decisiones del spec
    §11 y `fuentes: [[docs/superpowers/specs/2026-10-17-escalera-del-operador-design]]`;
  - una entrada en `log.md` y la línea correspondiente en `index.md`.
- [ ] **Step 3: QA completo.**
  - comandos: `npm test`, `npm run astro -- check`, `npm run build`, `npm run offers:check`,
    `npm run content:check`, `npm run tool:check`;
  - navegador a 390 px y 1440 px en `/`, `/sistemas/detailing`, `/sistemas/pedido/<id falso>`
    (404 limpio), `/tiktok` y `/terminos`;
  - reduced motion;
  - consola sin errores.

  **No se hace ningún pago real.**
- [ ] **Step 4: PR.** Abrir un PR contra `main` con resumen, capturas y una lista de lo que Omar
  debe hacer antes de vender (spec §9):
  - fijar `presale.videosDueDate`;
  - aprobar el contenido;
  - confirmar tarjetas extranjeras y poner `acceptsForeignCards`.
