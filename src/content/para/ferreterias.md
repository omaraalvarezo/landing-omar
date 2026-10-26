---
title: IA para ferreterías
description: "En una ferretería, la unidad, la foto del producto y el precio de hoy evitan el pedido mal armado. Esta guía usa ChatGPT, Pixelcut, WhatsApp, Notion, Canva y el perfil de Google. No convierte metros en unidades."
published: 2026-10-26
tools:
  - chatgpt
  - pixelcut
  - whatsapp-business
  - notion
  - canva
  - google-business-profile
guides:
  - tool: chatgpt
    steps:
      - "Pega el producto con la unidad en la que lo vendes: pieza, metro o kilo. No pidas que la convierta."
      - "El precio lo escribes tú. Si no está, el borrador dice que está por confirmar."
      - "Si el cliente pide una marca que no está en la lista, la respuesta es que el mostrador lo confirma."
      - "Pide el mensaje de WhatsApp y el texto del aviso por separado. No agregues una ficha técnica que no pegaste."
  - tool: pixelcut
    steps:
      - "Fotografía el producto que sí está en el estante, con la etiqueta si se alcanza a leer."
      - "Revisa la salida antes de exportar. Si la cantidad, el color o la marca cambiaron, no se publica."
      - "No cuentes los créditos del plan como fotos ilimitadas. El número está en la página de precios, leída el 26 oct 2026."
      - "El precio no va quemado en la imagen. Cambia más seguido que la foto."
  - tool: whatsapp-business
    steps:
      - "Tres respuestas rápidas: horario, dirección y cómo pedir un producto con la unidad."
      - "Manda la foto del producto que sí tienes y el precio de la lista de hoy."
      - "No confirmes un domicilio ni un flete que no esté escrito. Eso lo cierra una persona."
      - "El aviso de listo o de llegado sale una vez, cuando el estado ya está marcado."
  - tool: notion
    steps:
      - "Una lista: producto, unidad, existencias, mínimo y precio. En cero no se promete."
      - "Si vendes por metro y por pieza, son dos filas. No dejes que el chat las junte."
      - "El pedido del cliente se anota con la unidad que dijo. Si no la dijo, se pregunta."
      - "Esto no es el inventario contable. Alcanza para no vender lo que no está."
  - tool: canva
    steps:
      - "Una pieza por producto o por grupo que sí hay. Poco texto y el precio de hoy, si cabe."
      - "Usa la foto ya revisada en Pixelcut. No un render de un producto que no tienes."
      - "Si el precio cambió, no reutilices la imagen vieja. Arma otra o deja el precio solo en el texto."
      - "Exporta el tamaño de la red. No rediseñes la marca del proveedor."
  - tool: google-business-profile
    steps:
      - "Revisa horario, dirección y teléfono. El perfil no es el catálogo de la ferretería."
      - "Sube fotos del local y de productos que sí vendes."
      - "Pide la reseña con el enlace. No la escribas tú ni ofrezcas un descuento por la estrella."
      - "Una publicación del perfil lleva lo que hay esta semana, no un listado de cien códigos."
prompts:
  - title: Respuesta con la unidad
    text: "Eres el asistente de una ferretería. Responde en máximo 60 palabras usando solo esta lista de productos, unidades y precios. No conviertas metros en unidades ni kilos en piezas. Si el producto no está, dilo. No inventes existencia. Lista: [pegar]. Pedido: [pegar]."
  - title: Texto del producto
    text: "Escribe el texto de una publicación de máximo 35 palabras para este producto de ferretería. Usa el nombre y la unidad tal cual. No pongas un precio si no está en el dato y no agregues una medida que yo no escribí. Dato: [pegar]."
  - title: Aviso de llegado
    text: "Escribe un mensaje de máximo 40 palabras para avisar que un pedido de ferretería ya se puede retirar. Usa solo nombre, producto y unidad. No ofrezcas un producto sustituto ni cambies la cantidad. Datos: [pegar]."
  - title: Qué está en el mínimo
    text: "Con esta lista de ferretería (producto, unidad, existencias y mínimo), dime solo qué está en el mínimo o por debajo. No recomiendes marcas ni conviertas unidades. No armes una orden de compra. Lista: [pegar]."
faqs:
  - q: ¿El chat puede pasar un rollo de metros a unidades?
    a: "No. La unidad de la ficha es la de la venta. Si el cliente no dijo si quiere metro o pieza, se pregunta. ChatGPT no hace la conversión y Notion no debe juntar las dos filas."
  - q: ¿Pixelcut deja la etiqueta del producto igual?
    a: "Hay que mirarlo. La página de precios, el 26 oct 2026, muestra un plan gratis y créditos en los planes de pago. No promete que un número de la etiqueta sobreviva. Si cambió, esa foto no sale."
  - q: ¿La página de negocio de Gemini hace el cierre de caja?
    a: "No. El anuncio del 20 oct 2026 dice que Gemini puede armar gráficos con hojas y recibos que tú subes, si la página ya te aparece. Alguien compara el gráfico con el archivo. No es el balance."
  - q: ¿El estudio de fin de año aplica fuera de México?
    a: "La nota de Meta del 22 oct 2026 dice que la encuesta de Ipsos incluye, entre otros, Colombia, Perú, Brasil y España, y que las cifras de México son de 942 personas. No las uses como tu pronóstico de ventas en otro país."
related:
  - venta-de-repuestos
  - cobrar
  - contenido-para-redes
  - llanterias
---

La ferretería pierde el pedido cuando la unidad no está dicha y la foto no es del producto del estante. El chat puede redactar. No puede adivinar si el cliente pidió un metro o una pieza.

## La lista

Notion lleva producto, unidad, existencias y precio. ChatGPT responde con esa lista. Una marca que no está no se ofrece como equivalente. El mismo cuidado del código, en un mostrador de carros, está en la [guía de repuestos](/herramientas-ia/para/venta-de-repuestos).

## La foto

Pixelcut sirve para la foto del producto en el teléfono. La etiqueta se compara antes de publicar. Canva arma la pieza con el precio de hoy. Los créditos del plan, leídos el 26 oct 2026, están en la [ficha de Pixelcut](/herramientas-ia/pixelcut). No son fotos infinitas.

## El mensaje

WhatsApp manda lo que hay y cómo pedirlo. Un flete o un domicilio lo cierra una persona. El cobro del mensaje de servicio está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio).

## Fin de año y la caja

La [nota de Meta](/herramientas-ia/noticias/compras-fin-de-ano-en-mexico) asocia la visita a la tienda con fotos del producto. Publica lo que sí tienes. La [nota de Gemini](/herramientas-ia/noticias/gemini-negocios-en-la-app) dice que un gráfico financiero sale de un archivo que tú subes, si la página de negocio ya aparece. Alguien lo contrasta con la hoja. La [guía para cobrar](/herramientas-ia/para/cobrar) sigue siendo el recordatorio de la factura, no el cierre.

## Lo que no hace esta página

No cuenta el inventario contable, no convierte unidades y no arma el pedido del proveedor. Si el negocio es un repuesto de carro y no la ferretería, usa la guía de repuestos.
