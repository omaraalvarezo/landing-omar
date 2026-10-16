---
titulo: "Rutina editorial del directorio de IA"
tipo: decision
dominio: [seo, copy, conversion]
tags: [directorio, contenido, newsletter, seo]
fuentes:
  - "[[wiki/decisiones/directorio-herramientas-ia]]"
creado: 2026-10-16
actualizado: 2026-10-16
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

- El primer párrafo es la respuesta. En estas plantillas ese párrafo es `description`.
- Cada pieza lleva `published`. Si hay un anuncio, `sourceDate` es el día de la fuente, no el día en que el agente la leyó.
- Una cifra solo entra si está en la página enlazada. Al lado va de quién es. No se convierte en una promesa para otra empresa.
- Se resume con palabras propias. Una cita corta alcanza. No se copian imágenes ni párrafos.
- Las herramientas que se nombran tienen que existir en `src/data/tools.json`. El enlace interno usa el slug.
- Una noticia enlaza la guía “para” que le corresponde. La ficha de la herramienta muestra esas notas al revés.
- Precios de un tercero se fechan. Si la fuente no trae el precio, el campo dice que no está publicado.
- No se publica en TikTok, Instagram, X ni LinkedIn de Omar sin un pedido explícito de esa pieza.

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
