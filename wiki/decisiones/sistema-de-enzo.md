---
titulo: "El sistema de Enzo: salida 1"
tipo: decision
dominio: [conversion, copy, infra, brand]
tags: [sistema-de-enzo, detailing, preventa, wompi, lista-de-espera, escalera, tiktok, medicion]
fuentes:
  - "[[docs/superpowers/specs/2026-10-17-escalera-del-operador-design]]"
  - "[[docs/superpowers/plans/2026-10-17-salida-1-sistema-de-enzo]]"
  - "[[wiki/sintesis/recibos-operativos]]"
  - "[[wiki/decisiones/ofertas-directorio-herramientas-ia]]"
creado: 2026-10-17
actualizado: 2026-10-17
---

# El sistema de Enzo: salida 1

Desde v4.0 omaralvarezo.co vende "El sistema de Enzo · detailing" y deja de ofrecer la sesión de
2 horas. El home muestra cómo opera Omar y lleva a una escalera: **PDF gratis → kit $81.000 → el
sistema $179.000 → lista de espera**. La restricción que manda es que Omar tiene 1 hora a la semana:
la página solo vende lo que el comprador instala solo.

Fuente: [[docs/superpowers/specs/2026-10-17-escalera-del-operador-design]] (§11). El detalle técnico
vigente está en `CLAUDE.md`.

## Registro de decisiones del spec (17 oct)

| Tema | Decisión | De quién |
|---|---|---|
| Horas por semana | 1 hora | Omar |
| Cliente | cualquier pyme de servicios de Latinoamérica, Colombia primero en precios | Omar |
| Primer paso del visitante | ver cómo opera Omar | Omar |
| Dolor del primer producto | ordenar las entregas | Omar |
| Producto | uno por oficio, detailing primero, se arma ya | Omar |
| Nombre | El sistema de Enzo | Omar |
| Precio | $179.000 | Omar |
| Piezas | recepción con fotos, checklist, entrega con firma, aviso y seguimiento | Omar |
| Herramientas | las mejores, aunque sean pagas | Omar |
| Formato | archivos + videos cortos | Omar |
| Preventa | sí; videos con fecha límite y devolución si no llegan | Omar (detalle de Claude) |
| Devolución | garantía de 7 días, la hace Omar a mano | Claude, delegada |
| Kit | sigue aparte como escalón barato | Claude, delegada |
| Sesión de 2 horas | se quita por ahora; queda en la lista de espera | Omar |
| Marco 4C | se quita | Omar |
| Animación del hero | se cambia: recibir → hacer → entregar | Omar |
| Qué vende el home | la forma de operar de Omar | Omar |
| Formulario final | lista de espera | Omar |
| Cara de Omar en videos | casi siempre | Omar |
| Qué se muestra | pantallas, carros y trabajos, equipo y chats, con datos tapados | Omar |
| Equipo en videos | solo después de firmar la autorización | Claude, por ley |
| Cifras de plata | sí, aproximadas y con fuente | Omar |
| Límites | sin gurú, sin promesas, sin herramientas que no usa, sin precios internos | Omar |
| Directorio | listado y destacado siguen; patrocinio en pausa | Claude, delegada |
| Comisiones | solo de herramientas que Omar usa | Omar |
| Boletín | semanal | Omar |
| Trato | de tú | Omar |
| Link de TikTok | depende del video: `/tiktok` y direcciones cortas | Omar (detalle de Claude) |
| Aprobaciones | un poco cada día | Omar |
| Fecha | lo antes posible, por partes | Omar |
| Meta a 90 días | 30 ventas del sistema | Omar |

## Decisiones de construcción que cambiaron el comportamiento

Tomadas durante la salida 1 (registro del controlador en
`.superpowers/sdd/2026-10-17-salida-1-sistema-de-enzo/progress.md`, fuera de git).

| Tema | Decisión | Por qué |
|---|---|---|
| Pruebas | Vitest `4.1.12` exacto (no 3.2.x) | ninguna 3.x deja `npm audit --audit-level=moderate` en cero; 4.1.12 funciona con `getViteConfig` y Vite 6.4.3 |
| Lockfile | se verifica con `npx npm@10 ci` y `audit`; los bloques anidados de `astro/node_modules/esbuild` se conservan | CI y Vercel usan npm 10; un lock de npm 11 rompe `npm ci` |
| Referencias | `oa-kit-{producto}-q…`; `parseProductReference` en el webhook | Adjudika ya reenvía `oa-kit-*`: nada nuevo que configurar en Wompi |
| Precio del sistema | fijo en pesos, validado por producto | $179.000 no sale de la regla USD × $3.230 del kit |
| Sin fecha de videos | no se cobra: botón "Abre pronto" y checkout 503 antes del rate limit y de Wompi | la preventa sin fecha no tiene promesa que cumplir |
| Correo al comprador | si falla, el webhook responde 503 para que Wompi reintente y la orden guarda `buyerNotifyStatus`; cada aviso con su clave | en preventa el comprador depende de ese enlace; el aviso a Omar no se duplica |
| Acceso al pedido | cookie del checkout o enlace `?t=` del correo, este último solo con pago APPROVED | el comprador suele abrir el correo en otro dispositivo |
| Medición de la venta | `sistema_comprado` solo desde el webhook, una vez por orden con `purchaseTrackedAt` y candado; sin cookie, IP ni URL | el regreso del comprador casi siempre liquida antes que el webhook; las URL de pedido llevan secretos |
| Analítica | Vercel Web Analytics por el mismo origen, implementado aunque no se pudo confirmar el plan del equipo | en Hobby `track()` no rompe nada; si no hay eventos, las ventas salen de `npm run kit:pending` |
| Formulario de compra | nombre, correo, negocio y país (`paises.json`) | el checkout del sistema exige país para medir la demanda de fuera |
| Lista de espera | negocio obligatorio | §6.5 pide negocio |
| JSON-LD | el Product usa `@id ${SITE}/sistemas/detailing#product`; el home lo referencia | el grafo del home y la página quedan enlazados |
| Recibos del home | se reemplazan por recibos con fuente (`publicRecibo`); salen "$19,9M" y "10 h/semana" | el spec prohíbe cifras sin fuente |
| Sesión de 120 min | sale de todo el sitio: home, OG (`og-image.png`/`.svg` regenerada), `DirectoryChrome`, `/sobre-mi` y `llms.txt` | el spec la saca del sitio, no solo del home |
| Herramienta Jotform | entra para recepción, checklist y entrega, dicho como alternativa (Enzo no la usa) y sin afiliado | Omar pidió "lo mejor, cueste lo que cueste"; los enlaces de clonación los arma Omar |
| Contenido provisional | Task 7 dejó un contenido mínimo y Task 8 lo reemplazó por el real | mantener cada tarea en verde |

## Pendiente antes de vender

1. Omar fija `presale.videosDueDate` en `src/data/sistema-enzo-detailing.json` y despliega.
2. Omar revisa la guía, las plantillas y el zip.
3. Omar confirma con Wompi si acepta tarjetas de fuera de Colombia y pone `acceptsForeignCards`.
4. Omar arma en Jotform los tres formularios (Recepción, Inspección y entrega, Encuesta) y manda los
   enlaces de clonación.
5. Tras el deploy, comprobar que `/_vercel/insights/script.js` responda 200 detrás de Cloudflare.

Lo demás pendiente (preguntas a Omar y menores diferidos) está en `log.md` (2026-10-17) y en el PR.
