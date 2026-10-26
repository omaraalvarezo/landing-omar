---
title: IA para vender repuestos
description: "Vender un repuesto por chat se daña cuando la foto no es de esa pieza o la compatibilidad se inventa. Esta guía usa ChatGPT, Photoroom, Notion, WhatsApp Business, Canva y el perfil de Google. El precio y la aplicación los confirma una persona."
published: 2026-10-19
tools:
  - chatgpt
  - photoroom
  - notion
  - whatsapp-business
  - canva
  - google-business-profile
guides:
  - tool: chatgpt
    steps:
      - "Pega la ficha del repuesto que sí tienes: nombre, marca si la conoces, y el vehículo para el que ya lo vendiste. No pidas un catálogo universal."
      - "Si el cliente manda año, motor o una foto, la respuesta dice qué dato falta para confirmar. No afirma que aplica."
      - "El precio lo escribes tú en el mismo encargo. Si no está, el borrador dice que está por confirmar."
      - "Pide un mensaje corto de WhatsApp y, aparte, el texto de la publicación. No juntes una garantía que no das."
  - tool: photoroom
    steps:
      - "Fotografía la pieza real, con la etiqueta si se lee. El editor quita el fondo. No cambia la pieza por otra parecida."
      - "Revisa que el número, el color y la forma sigan siendo los de la foto. Si la IA los altera, no publiques esa salida."
      - "Una imagen por pieza. Un collage de diez códigos no se lee en el chat."
      - "El plan Pro que Photoroom publica, consultado el 19 oct 2026, es de USD 7,50 al mes con cobro anual. No asumas que el editor completo es gratis."
  - tool: notion
    steps:
      - "Una ficha por código: nombre, unidades, precio que tú pusiste y para qué vehículo ya lo confirmaste. Lo que no confirmaste queda en blanco."
      - "Antes de contestar, mira las unidades. Cero unidades no se ofrece como entrega hoy."
      - "Anota la fuente de la compatibilidad: el empaque, el catálogo del fabricante o una venta anterior. El chat no es esa fuente."
      - "Cuando cambie el precio, se cambia la ficha. El mensaje de ayer no es la lista vigente."
  - tool: whatsapp-business
    steps:
      - "La respuesta rápida de horario y dirección no incluye un precio de una pieza que no preguntaron."
      - "La foto que mandas es la de esa unidad o la del empaque, no una imagen generada de un repuesto genérico."
      - "Si hay que encargarlo, el mensaje dice encargado, no disponible. Son estados distintos."
      - "Una persona confirma aplicación y total antes de que el cliente pase a pagar."
  - tool: canva
    steps:
      - "Arma la pieza con la foto ya revisada en Photoroom y el nombre de la pieza. El precio solo si es el de hoy."
      - "No tapes el código con un texto decorativo. El código es el dato."
      - "Si no cabe el vehículo compatible, no lo inventes en chiquito. Mejor sin esa línea."
      - "Exporta para el estado o para la red. No publiques la misma pieza con dos precios."
  - tool: google-business-profile
    steps:
      - "El perfil dice qué vendes en una frase: repuestos, no un diagnóstico. El horario es el del mostrador."
      - "Sube fotos del local y de piezas con el código legible. No subas una foto de catálogo que no tienes en estante."
      - "Pide la reseña después de la entrega, no antes de confirmar que la pieza aplicó."
      - "Una reseña no se contesta con un descuento. Se contesta con el dato del pedido, si hace falta."
prompts:
  - title: ¿Aplica o falta un dato?
    text: "Eres el asistente de un mostrador de repuestos. Con esta ficha y este pedido, di solo tres cosas: qué coincide, qué dato falta para confirmar compatibilidad y el precio si está en la ficha. No afirmes que la pieza aplica. No inventes un equivalente. Ficha: [pegar]. Pedido: [pegar]."
  - title: Mensaje de encargado
    text: "Escribe un WhatsApp de máximo 50 palabras para decir que un repuesto quedó encargado. Usa nombre de la pieza, plazo que yo te doy y el monto si está escrito. No adelantes la entrega ni ofrezcas un sustituto. Datos: [pegar]."
  - title: Texto de la foto
    text: "Escribe el texto de una publicación de máximo 25 palabras para una foto de repuesto. Usa solo el nombre de la pieza. No pongas vehículos compatibles, no pongas precio y no digas que es original si yo no lo escribí. Pieza: [pegar]."
  - title: Lo que no hay
    text: "Con esta lista de existencias, dime únicamente las piezas en cero. No recomiendes sustitutos ni proveedores. No armes una orden de compra. Lista: [pegar]."
faqs:
  - q: ¿El chat puede decir que el repuesto aplica?
    a: "No, si tú no lo confirmaste. ChatGPT ordena la ficha y el pedido. La compatibilidad sale del empaque, del catálogo del fabricante o de una venta ya hecha. Un año y un modelo no alcanzan cuando falta el motor."
  - q: ¿Photoroom puede mejorar una foto borrosa del código?
    a: "Puede limpiar el fondo y la luz. No debe reescribir un código que no se lee. Si el número cambió en la imagen, esa imagen no se manda. La página de precios, consultada el 19 oct 2026, publica el plan Pro a USD 7,50 al mes con cobro anual."
  - q: ¿Esto sirve también para el taller que instala la pieza?
    a: "La ficha y la foto sí. La bahía, la cotización del trabajo y el recordatorio de mantenimiento están en la guía de talleres de carros. Aquí el cuello de botella es el mostrador."
  - q: ¿Puedo publicar una foto de catálogo descargada?
    a: "No desde esta guía. La foto es de la pieza que tienes o del empaque que vas a entregar. Una imagen de otro vendedor no es tu existencia."
related:
  - talleres-de-carros
  - lavaderos-de-carros
  - ferreterias
  - venta-de-carros-usados
---

El mostrador pierde la venta en dos frases: “creo que aplica” y “te mando una foto parecida”. Las dos se pueden escribir con una herramienta. También se pueden prohibir. La ficha manda: código, unidades, precio y para qué vehículo ya está confirmado.

## La foto

Photoroom sirve para que la pieza se vea sobre un fondo limpio. La [nota de Higgsfield](/herramientas-ia/noticias/higgsfield-video-largo) habla de texto generado sobre imágenes en otro producto. Aquí la regla es la misma: si el código se ve distinto, no sale. El precio publicado del plan Pro está en la página de Photoroom consultada el 19 oct 2026: USD 7,50 al mes, cobrado al año. Los otros planes están en esa página; no copiamos un monto que no quedó explícito en la revisión.

## El chat

WhatsApp Business manda la foto de esa unidad y el texto que ChatGPT armó con la ficha. Notion es la ficha. Si las unidades están en cero, el estado es encargado o no hay, nunca “te lo aparto” por costumbre.

## Dónde más aparece

Canva arma la publicación con esa foto ya revisada. El perfil de Google dice qué vendes y a qué hora abre el mostrador. No es un catálogo completo.

## Lo que no hace esta página

No cruza un catálogo mundial de aplicaciones ni reemplaza el programa del taller. Si el trabajo es instalar, diagnosticar y devolver el carro, sigue en la [guía de talleres](/herramientas-ia/para/talleres-de-carros). remove.bg está en el directorio para quitar el fondo de otra foto, con la misma regla del código. Si el mostrador es de ferretería, sigue en la [guía de ferreterías](/herramientas-ia/para/ferreterias). Si vendes el carro y no la pieza, sigue en la [guía de carros usados](/herramientas-ia/para/venta-de-carros-usados).
