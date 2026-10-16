---
titulo: "PDF, kit y calculadoras del directorio"
tipo: decision
dominio: [seo, conversion, infra]
tags: [directorio, prompts, kit, wompi, upstash]
fuentes:
  - "[[wiki/decisiones/directorio-herramientas-ia]]"
creado: 2026-10-16
actualizado: 2026-10-16
---

# PDF, kit y calculadoras del directorio

Tres piezas encima de `/herramientas-ia`. No cambian la consultoría ni los planes del directorio.

## PDF gratis

`/herramientas-ia/prompts-gratis` entrega "Prompts de IA para talleres, detailing y pymes": 40 prompts en 10 áreas. El texto completo vive en `src/data/lead-prompts.json` y sale en un PDF al vuelo. No hay archivo en `public/`.

El formulario pide el correo. Mientras no haya `NEWSLETTER_PROVIDER` y `NEWSLETTER_ACTION_URL`, el correo se guarda en Upstash con la clave `oa:lead:{test|production}:email:{sha256}`. El enlace de descarga dura 24 horas y sirve cinco veces. Sin `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` la respuesta es 503 y la página sigue en pie.

`npm run lead:list` imprime los correos. No imprime enlaces.

El CTA está en las guías de talleres, detailing y prompts.

## Kit

`/herramientas-ia/kit` vende el zip: el mismo PDF, cinco mensajes de WhatsApp (cita, cotización, mantenimiento, reseña, posventa), cinco flujos con herramientas que ya están en el directorio y un CSV de seguimiento sin clientes.

Precio fijo: USD 25 × tasa operativa del 16 oct 2026 (`$3.230`) = `$80.750`, millar superior `$81.000`. Misma regla que los planes. No usa la TRM del día.

Referencia: `oa-kit-talleres-q{centavos}-d{fecha}-t{timestamp}-{id}`. No coincide con `oa-consultoria-2h-*` ni con `oa-directorio-*`.

Adjudika ya reenvía `oa-directorio-`. Tiene que reenviar también, sin modificar el JSON, lo que empiece por `oa-kit-` a `POST https://omaralvarezo.co/api/herramientas/evento`.

Al quedar `APPROVED`, la orden guarda un código de descarga por 14 días. La página de regreso, con la cookie de quien pagó, muestra el enlace. El aviso a Omar usa Resend con `DIRECTORY_NOTIFY_FROM` y `DIRECTORY_NOTIFY_EMAIL`, igual que los planes. Si el pago se anula, el enlace se borra.

Sin Upstash o sin llaves de Wompi el checkout responde 503. No abre una sesión de pago.

`npm run kit:pending` lista órdenes. `--link` imprime el enlace para reenviarlo.

## Calculadoras

`/herramientas-ia/recursos` tiene tres páginas estáticas. Los números los escribe el visitante. No hay promedios, tarifas ni una clave de modelo: el proyecto no tiene una API de reseñas, así que el generador es una plantilla en el navegador.

- `/herramientas-ia/recursos/ahorro`
- `/herramientas-ia/recursos/resenas`
- `/herramientas-ia/recursos/cotizador-detailing`

Están en el sitemap, en `llms.txt` y enlazadas desde el índice, las guías y las páginas de taller y detailing.
