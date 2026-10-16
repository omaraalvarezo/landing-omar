# Landing Omar Álvarez — Consultoría 2H

Landing de conversión para una sola oferta: **Sesión de arquitectura operativa con IA**,
120 minutos, `USD 797`, pagada por anticipado en COP con una tasa operativa diaria derivada de la
TRM oficial vigente.

La experiencia visual vigente es **“Sistema vivo / taller abierto”**: un hero code-native conecta
señales de venta, operación y postventa en las 4C; después abre métricas y sistemas reales con un
lenguaje colorido, directo y sin clichés visuales de IA.

La oferta usa el **Marco 4C para empresas de servicios**:

1. Captar demanda.
2. Convertirla mediante criterio comercial, CRM y seguimiento.
3. Cumplir el servicio con una operación menos dependiente del dueño.
4. Continuar la relación mediante postventa, garantías, NPS y reactivación.

## Flujo de conversión

```text
TikTok / referido
      ↓
landing con evidencia y filtro
      ↓
brief corto
      ↓
Wompi Checkout Web
      ↓
verificación server-side del pago
      ↓
Cal.com desbloqueado
```

La agenda nunca se muestra por asumir que el redirect significa éxito. La página consulta la
transacción directamente en Wompi y exige simultáneamente:

- estado `APPROVED`;
- referencia con prefijo `oa-consultoria-2h`;
- monto exacto codificado en la referencia de la cotización diaria;
- moneda `COP`.

## Stack

- Astro 5 + TypeScript strict.
- Vercel adapter para los endpoints serverless.
- Wompi Checkout Web para cobro en COP.
- TRM diaria suministrada por Superfinanciera mediante Datos Abiertos Colombia.
- Tasa operativa = TRM oficial + 1,65%, redondeada al siguiente múltiplo de `$10 COP`.
- Sin fallback manual: si no existe TRM oficial vigente ni una lectura oficial verificada ese mismo
  día, Wompi no se abre.
- Cal.com inline, visible solo después del pago aprobado.
- Bricolage Grotesque Variable + IBM Plex Sans Variable + IBM Plex Mono, self-hosted.
- Hero SVG/CSS sin WebGL, video remoto ni loader; alternativa completa para reduced motion.
- Sin base de datos nueva: el brief temporal queda en `sessionStorage` y se prellena en Cal.com.

## Archivos principales

```text
src/
├── pages/
│   ├── index.astro
│   ├── consultoria/agendar.astro
│   └── api/consultoria/
│       ├── checkout.ts
│       ├── quote.ts
│       └── status.ts
├── components/consulting/
│   ├── ConsultingLanding.astro
│   ├── SystemIgnition.astro
│   ├── CheckoutForm.astro
│   └── PaidCalendar.astro
└── lib/
    ├── consulting.ts
    ├── framework.ts
    ├── trm.ts
    └── wompi-consulting.ts
```

Los componentes antiguos de la landing v2 permanecen temporalmente en `src/components/` para no
destruir cambios locales previos, pero `src/pages/index.astro` ya no los importa ni los publica.

## Variables de entorno

Copiar `.env.example` a `.env.local`. En local se usa `WOMPI_ENVIRONMENT=test`.

```text
PUBLIC_SITE_URL=https://omaralvarezo.co
CAL_CONSULTING_LINK=omaralvarezo/consultoria-2-horas
WOMPI_ENVIRONMENT=test|production
WOMPI_PUBLIC_KEY=
WOMPI_INTEGRITY_SECRET=
WOMPI_TEST_PUBLIC_KEY=
WOMPI_TEST_INTEGRITY_SECRET=
WOMPI_EVENTS_SECRET=
WOMPI_TEST_EVENTS_SECRET=
DIRECTORY_NOTIFY_EMAIL=omaraalvarezo@gmail.com
DIRECTORY_NOTIFY_FROM=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Las variables nuevas son solo del directorio `/herramientas-ia`. La consultoría no las usa.
El detalle de eventos, correo y activación está en `wiki/decisiones/directorio-herramientas-ia.md`.

## Directorio de herramientas

`/herramientas-ia` lista las herramientas de `src/data/tools.json`. Un agente las agrega o destaca
sin tocar el checkout de la consultoría:

```bash
npm run tool:list
npm run tool:add -- --nombre "Acme" --url "https://acme.com" --categoria asistentes --desc "Qué hace."
npm run tool:feature -- --slug acme --until 2026-11-16
npm run tool:feature -- --slug acme --until 2026-11-16 --sponsor
npm run tool:pending
```

`featuredUntil` y `sponsorUntil` son fechas inclusivas `YYYY-MM-DD`. Cuando vencen, el distintivo
se apaga en el siguiente build. El pago no edita ese archivo.

La llave privada de Wompi no es necesaria para este flujo. La consulta individual de una
transacción se autentica con la llave pública, según la API de Wompi.

## Comandos

```bash
npm install
npm run dev
npm run astro -- check
npm run build
npm run preview
```

## Checklist de salida

1. ✅ Evento oculto de 120 minutos creado en Cal.com: `omaralvarezo/consultoria-2-horas`.
2. ✅ Agenda exclusiva asignada, con 48 horas de aviso y buffers de 30 minutos.
3. ✅ Comercio personal de Wompi —el mismo de Adjudika— configurado como secreto en Vercel Production.
4. ✅ Checkout real validado sin cobro: `USD 797` convertido a COP, firma, referencia y retorno correctos.
5. ✅ Despliegue de producción activo en `https://omaralvarezo.co`.
6. Realizar un pago real controlado y verificar pago → redirect → calendario.
7. Confirmar que el correo de Cal.com contiene el brief prellenado y aprobar la reserva manualmente.

**Producción:** `https://omaralvarezo.co`
