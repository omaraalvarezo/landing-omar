---
titulo: "Rutina editorial del directorio de IA"
tipo: decision
dominio: [seo, copy, conversion]
tags: [directorio, contenido, newsletter, seo]
fuentes:
  - "[[wiki/decisiones/directorio-herramientas-ia]]"
creado: 2026-10-16
actualizado: 2026-11-25
---

# Rutina editorial del directorio de IA

Las guías de `/herramientas-ia` se publican agregando un Markdown en `src/content/`. El build
las vuelve índice, ficha, sitemap, RSS y `llms.txt`. No hay panel y no se toca Wompi.

## Qué publica el agente

| Día | Pieza | Carpeta | Comando |
|---|---|---|---|
| Lunes | Edición de noticias, cerca de cinco notas | `src/content/noticias/` | `npm run content:new:noticias` |
| Miércoles | Herramienta de la semana, con patrocinador solo si hay datos | `src/content/semana/` | `npm run content:new:semana` |
| En la semana | Un paquete de prompts o una comparativa y su página de alternativas | `prompts/`, `comparar/`, `alternativas/` | `content:new:prompts`, `content:new:comparar`, `content:new:alternativas` |
| En la semana | De tres a cinco páginas “IA para una tarea”, solo si el texto trae datos propios | `src/content/para/` | `npm run content:new:para` |
| Al cierre del mes | Tendencias, sin conteos de redes que nadie midió | `src/content/tendencias/` | `npm run content:new:tendencias` |
| Cuando haya una fuente | Un caso real | `src/content/casos/` | `npm run content:new:casos` |

El archivo nace con `draft: true`. No entra al sitio. Se publica al quitar `draft`, completar
el cuerpo y pasar `npm run content:check`.

## Cómo se escribe

- El primer párrafo visible es la respuesta. En estas plantillas ese párrafo es `description`. Si pasa de 155 caracteres, la meta description usa las primeras frases completas que quepan; el párrafo de la página no se recorta.
- Cada pieza lleva `published`. Si hay un anuncio, `sourceDate` es el día de la fuente, no el día en que el agente la leyó.
- Una cifra solo entra si está en la página enlazada. Al lado va de quién es. No se convierte en una promesa para otra empresa.
- Se resume con palabras propias. Una cita corta alcanza. No se copian imágenes ni párrafos.
- Las herramientas que se nombran tienen que existir en `src/data/tools.json`. El enlace interno usa el slug.
- Una noticia enlaza la guía “para” que le corresponde. La ficha de la herramienta muestra esas notas al revés.
- Precios de un tercero se fechan. Si la fuente no trae el precio, el campo dice que no está publicado.
- No se publica en TikTok, Instagram, X ni LinkedIn de Omar sin un pedido explícito de esa pieza.

## Fuentes de la edición del 23 nov 2026

Esas notas están en el repositorio. La siguiente edición vuelve a abrir la página, no el resumen:

- Google, 16 nov 2026: `https://blog.google/innovation-and-ai/products/gemini-app/updated-controls/`
- OpenAI, notas de lanzamiento abiertas el 23 nov 2026, entradas del 18 y del 20 nov: `https://help.openai.com/en/articles/6825453-chatgpt-release-notes`
- Google, 18 nov 2026: `https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/`
- Google, 19 nov 2026: `https://blog.google/innovation-and-ai/products/gemini-app/computer-use-mac/`
- Anthropic, 20 nov 2026, abierto y no usado como nota de pyme porque no cambia el chat: `https://www.anthropic.com/news/ipo-close`
- Anthropic, 9 nov 2026, reabierto para la comparativa: `https://www.anthropic.com/claude-fable-and-mythos-5-2`
- Claude, ayuda de idioma con fecha 23 oct 2026, abierta el 23 nov 2026: `https://support.claude.com/en/articles/10769299-how-to-use-claude-in-your-preferred-language`
- Ideogram, portada abierta el 23 nov 2026: `https://ideogram.ai/`
- OpusClip, portada y precios abiertos el 23 nov 2026: `https://www.opus.pro/` y `https://www.opus.pro/pricing`
- Runway, portada y precios abiertos el 23 nov 2026: `https://runway.com/` y `https://runway.com/pricing`

`https://ideogram.ai/pricing` respondió 403 a un cliente automático (bloqueo de bot). No se publicó el monto de Plus, Pro ni Team. Las tarifas de video por segundo salen de la portada, que las fecha al 23 nov 2026. `https://klingai.com/pricing` respondió 200, pero el texto visible no dejó un plan de suscripción claro: no se agregó Kling. `https://runwayml.com/pricing` redirige a `https://runway.com/pricing`.

Enlaces que seguían respondiendo y quedaron en la URL de destino: la ayuda de idioma de Claude, Lyro de Tidio (`/ai-agent/`), Copilot para personas, el alojamiento de n8n, el español de ElevenLabs (`/languages` caía en la página general) y las dos ayudas de Sidekick. La ayuda de Sidekick del 23 nov 2026 ya incluye el navegador del celular. Los 403 de Canva, Adobe, Gamma, ManyChat, Midjourney, Perplexity, Make, Claude.ai y centros de ayuda similares se trataron como bloqueo de bot, no como enlace roto. `https://business.google.com` sigue abriendo el perfil.

## Fuentes de la edición del 16 nov 2026

Esas notas están en el repositorio. La siguiente edición vuelve a abrir la página, no el resumen:

- OpenAI, 10 nov 2026: `https://openai.com/index/introducing-businesses-chatgpt`
- OpenAI, ayuda de Business Hub, abierta el 16 nov 2026: `https://help.openai.com/en/articles/20001635-setting-up-your-business-on-chatgpt`
- OpenAI, 13 nov 2026: `https://openai.com/index/introducing-chatgpt-wallet`
- Google, 12 nov 2026: `https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/`
- Google, 10 nov 2026: `https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/`
- Anthropic, 9 nov 2026: `https://www.anthropic.com/claude-fable-and-mythos-5-2`
- LanguageTool, portada y premium abiertas el 16 nov 2026: `https://languagetool.org/` y `https://languagetool.org/premium`
- LanguageTool, ayuda de suscripciones con fecha 24 mar 2026: `https://help.languagetool.org/hc/en-us/articles/39254510973335-What-subscriptions-does-LanguageTool-offer`
- VEED, portada y precios abiertos el 16 nov 2026: `https://www.veed.io/` y `https://www.veed.io/pricing`
- Recraft, portada y precios abiertos el 16 nov 2026: `https://www.recraft.ai/` y `https://www.recraft.ai/pricing`

La ayuda de datos de Perplexity ya no vive en `intercom.help`. El mismo artículo responde en `https://www.perplexity.ai/help-center/en/articles/11564572-data-collection-at-perplexity`. Esa URL devolvió 403 a un cliente automático (bloqueo de bot). La de Intercom respondió 404. `https://gemini.google.com` responde 200. Los 403 de Canva, Adobe, Gamma, ManyChat, Midjourney, Perplexity, Make y centros de ayuda similares se trataron como bloqueo de bot, no como enlace roto.

La página de precios de VEED no dejó un monto de plan en el texto leído ese día. La de Recraft tampoco dejó el precio en dólares; sí dijo que los precios mostrados van sin IVA. Los euros de LanguageTool salen de la ayuda del 24 mar 2026, no del checkout.

## Fuentes de la edición del 26 oct 2026

Esas notas están en el repositorio. La siguiente edición vuelve a abrir la página, no el resumen:

- Google, 20 oct 2026: `https://blog.google/innovation-and-ai/products/gemini-app/new-tools-small-business-owners/`
- Notion, 19 oct 2026: `https://www.notion.com/blog/notion-ai-more-for-less`
- OpenAI, 22 oct 2026: `https://openai.com/index/decisions-api/`
- Anthropic, 22 oct 2026: `https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation`
- Meta, 22 oct 2026: `https://about.fb.com/ltam/news/2026/10/estudio-muestra-como-la-ia-puede-impulsar-las-ventas-de-las-pymes-mexicanas-en-temporada-de-fin-de-ano/`
- OpenAI, caso Uber, 22 oct 2026: `https://openai.com/index/uber-chatgpt-work-rollout`
- remove.bg, precios consultados el 26 oct 2026: `https://www.remove.bg/pricing`
- Fathom, precios consultados el 26 oct 2026: `https://www.fathom.ai/pricing`
- Pixelcut, precios consultados el 26 oct 2026: `https://www.pixelcut.ai/pricing`
- Treble, portada consultada el 26 oct 2026: `https://treble.ai/`

La página de precios de Treble (`https://treble.ai/treble-pricing/`) pidió contraseña ese día. No se publicó un monto del plan. Microsoft Copilot en el directorio apunta a `https://copilot.com`. `https://copilot.microsoft.com` redirige ahí y agrega parámetros de sesión. Notion apunta a `https://www.notion.com`. `https://www.notion.so` redirige a esa URL.

## Fuentes de la edición del 19 oct 2026

Esas notas están en el repositorio. La siguiente edición vuelve a abrir la página, no el resumen:

- Google, 15 oct 2026: `https://blog.google/products-and-platforms/products/search/updates-ai-mode-overviews-explore-web/`
- Notion, 16 oct 2026: `https://www.notion.com/blog/how-we-connected-notion-ai-to-160-new-apps-in-three-weeks`
- Google, 13 oct 2026: `https://blog.google/innovation-and-ai/products/gemini-app/gemini-4-argon-availability/`
- Google, 16 oct 2026: `https://blog.google/innovation-and-ai/products/gemini-notebook/three-tips-study-gemini-notebook/`
- OpenAI, 13 oct 2026: `https://openai.com/index/higgsfield-longer-videos-voice`
- OpenAI, 16 oct 2026: `https://openai.com/index/itau-generative-ai`
- HubSpot, Agent Hub, consultada el 19 oct 2026: `https://www.hubspot.com/products/artificial-intelligence`
- Photoroom, precios consultados el 19 oct 2026: `https://www.photoroom.com/pricing`
- Higgsfield, portada consultada el 19 oct 2026: `https://higgsfield.ai/`

Gemini Notebook en el directorio apunta a `https://notebook.google.com`. `https://notebook.google` responde sin título de producto y no es la URL canónica.

## Fuentes de la edición del 16 oct 2026

Esas notas ya están en el repositorio. La siguiente edición vuelve a abrir la página, no el resumen:

- OpenAI, 7 oct 2026: `https://openai.com/index/gpt-6-for-everyone/`
- Anthropic, 7 oct 2026: `https://www.anthropic.com/claude-haiku-5-5`
- Google, 13 oct 2026: `https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/`
- WhatsApp Business, FAQ consultada el 16 oct 2026: `https://whatsappbusiness.com/resources/faq/`
- Notion, 13 oct 2026: `https://www.notion.com/releases/2026-10-13`
- Caso Darla’s Downtown, Shopify, 22 abr 2025: `https://www.shopify.com/news/journey-to-first-sale`

Para noticias nuevas, la fuente primaria es el blog de OpenAI, Anthropic, Google o Meta. Un recuento
de otro sitio no reemplaza esa página.

Las dos guías prioritarias del 16 oct 2026 son `talleres-de-carros` y `detailing`. Usan herramientas
que ya estaban en el directorio. No se agregó un software de taller: no había uno verificado en esta
lista, y Notion queda descrito como tablero, no como inventario contable.

## Lista de correo

El formulario de las guías no guarda direcciones. Queda desactivado hasta que existan las dos
variables:

```bash
NEWSLETTER_PROVIDER=beehiiv
NEWSLETTER_ACTION_URL=https://....beehiiv.com/...
```

`buttondown` vale igual, con un `action` en `buttondown.com` o `buttondown.email`. Si el
proveedor y el dominio no coinciden, el formulario sigue apagado. El aviso semanal, cuando exista,
lleva la noticia, la herramienta de la semana y un prompt. El patrocinio de 30 días puede ocupar
el espacio de la ficha semanal; si `sponsorName` y `sponsorUrl` están vacíos, se ve el cupo libre.

## Después de agregar archivos

```bash
npm run content:check
npm run astro -- check
npm run build
```

`llms.txt`, el sitemap y `/herramientas-ia/rss.xml` salen solos de las piezas con `draft` ausente
o falso. Una guía delgada, sin herramienta del directorio o sin fuente cuando hay una cifra, no
se publica.
