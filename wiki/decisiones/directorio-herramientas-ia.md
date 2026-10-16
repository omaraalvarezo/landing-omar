---
titulo: "Directorio de herramientas de IA"
tipo: decision
dominio: [diseño, copy, seo, conversion, infra]
tags: [directorio, wompi, herramientas, pymes]
fuentes:
  - "[[CLAUDE.md]]"
creado: 2026-10-16
actualizado: 2026-10-16
---

# Directorio de herramientas de IA

`/herramientas-ia` es un directorio en español para pymes. Un agente lo opera editando
`src/data/tools.json`. El pago no publica solo.

## Precios

Quedaron fijos en COP el 16 oct 2026. La TRM oficial de ese día fue `$3.170,46`. Con el mismo
margen de la consultoría (1,65% y múltiplo de `$10`) la tasa operativa fue `$3.230`. Cada precio
en dólares se multiplicó por esa tasa y se redondeó al millar superior:

| Plan | USD | COP | Vigencia |
|---|---|---|---|
| Listado básico | 29 | $94.000 | pago único, sin distintivo |
| Destacado | 49 | $159.000 | 30 días |
| Patrocinio | 149 | $482.000 | 30 días, portada y mención en la siguiente nota |

No usan la cotización diaria de la sesión de `$797`. El servidor firma el monto del plan; ignora
cualquier total que mande el navegador. El cobro de Wompi es un pago, no una suscripción: el
siguiente mes se vuelve a pagar.

## Qué no se toca

La consultoría sigue en `oa-consultoria-2h-*`, Adjudika y Cal.com. El directorio usa
`oa-directorio-{plan}-q{centavos}-d{fecha}-t{timestamp}-{id}`. Adjudika solo procesa el prefijo de
la consultoría, así que un evento del directorio no abre agenda ni cambia una sesión.

## Flujo de pago

1. El formulario de `/herramientas-ia/destacar` pide nombre, URL https, correo, categoría y descripción.
2. `POST /api/herramientas/checkout` valida, guarda la orden en Upstash y solo entonces devuelve la URL firmada de Wompi.
3. La cookie `HttpOnly` deja ver el comprobante en `/herramientas-ia/pedido/<orderId>` al navegador que pagó.
4. Wompi confirma con un evento firmado. El endpoint `POST /api/herramientas/evento` recalcula el checksum (valores de `signature.properties` + `timestamp` + secreto de eventos), reconsulta la transacción y exige `APPROVED`, el monto del plan y moneda `COP`.
5. Si el aviso por correo está configurado, Omar recibe monto, herramienta, URL, categoría, descripción y los comandos para publicarla. Un segundo `APPROVED` o una anulación de esa misma transacción también avisan. Si el correo falla, Wompi puede reintentar. Si falta la configuración, la orden queda guardada con `notifyStatus=unconfigured`.

## Qué tiene que configurar Omar

La cuenta personal de Wompi ya tiene **una** URL de eventos, en Adjudika. No hay que reemplazarla:
la consultoría depende de ese endpoint.

En Adjudika, reenviar el cuerpo JSON **sin modificarlo** cuando la referencia empiece por
`oa-directorio-` hacia:

`POST https://omaralvarezo.co/api/herramientas/evento`

El checksum se calcula con el secreto de eventos. Si el JSON cambia en el camino, la firma no cuadra
y el endpoint responde 401.

Variables en Vercel, también documentadas en `.env.example`:

- `WOMPI_EVENTS_SECRET` en producción y `WOMPI_TEST_EVENTS_SECRET` en el sandbox. Están en el dashboard de Wompi, junto al secreto de integridad. No van al navegador.
- `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`. Ya existen para `/admin`. Sin ellas el checkout del directorio falla cerrado. Las órdenes viven en claves `oa:dir:test:*` o `oa:dir:production:*`.
- `RESEND_API_KEY` y `DIRECTORY_NOTIFY_FROM` (un remitente verificado, por ejemplo `Directorio <avisos@omaralvarezo.co>`).
- `DIRECTORY_NOTIFY_EMAIL`. Si queda vacío, el servidor escribe a `omaraalvarezo@gmail.com`.

Ese correo no se muestra en la página. La consultoría sigue sin canal de contacto público.

No hay newsletter automático. El patrocinio avisa para que la mención se escriba a mano en la siguiente nota.

## Activación

El operador —persona o agente— publica editando datos y haciendo deploy. El build decide qué está vigente con la fecha de Bogotá:

- `featured: true` y `featuredUntil` vigente: distintivo y va primero.
- `sponsor: true` y `sponsorUntil` vigente: portada. El script también prende el destacado.
- Fecha vencida o flag en false: vuelve al listado normal. No hace falta borrar la ficha.
- `featuredUntil: null` con `featured: true` queda prendido hasta que alguien lo edite. Los pagos usan fecha.

```bash
npm run tool:list
npm run tool:add -- --nombre "Acme" --url "https://acme.com" --categoria asistentes --desc "Qué hace, en una frase."
npm run tool:feature -- --slug acme --until 2026-11-16
npm run tool:feature -- --slug acme --until 2026-11-16 --sponsor
npm run tool:feature -- --slug acme --clear
npm run tool:pending
```

`tool:pending` lista las órdenes de Upstash. Sirve cuando el correo no está configurado o hay que
reconstruir qué se pagó. No escribe `tools.json`.

Categorías nuevas: una línea en `src/data/tool-categories.json` y, si hace falta, el slug en la herramienta.
Slugs reservados: `destacar`, `categoria`, `pedido`, `api`.
