---
title: IA para talleres de carros
description: "Un taller deja de depender de la memoria cuando la cotización, el WhatsApp y el recordatorio salen de un dato escrito. Esta guía usa ChatGPT, ManyChat, Notion, n8n, CapCut y HubSpot. No diagnostica el carro ni reemplaza un programa de taller."
published: "2026-10-16"
priority: 2
tools:
  - chatgpt
  - manychat
  - notion
  - n8n
  - capcut
  - hubspot
guides:
  - tool: chatgpt
    steps:
      - "Pega la falla como la dijo el cliente, el vehículo y lo que ya revisaste en el taller. No pidas un diagnóstico."
      - "Pide dos textos: uno de una página para la cotización y otro de menos de 70 palabras para WhatsApp. El precio lo escribes tú."
      - "Incluye en el encargo lo que no cubre el trabajo. Si no lo escribiste, el borrador no debe agregarlo."
      - "Borra cualquier causa que no hayas confirmado. El chat no escuchó el motor ni midió una pieza."
  - tool: manychat
    steps:
      - "Deja tres mensajes que una persona pueda disparar: recibido, esperando repuesto y listo para recoger. Llevan placa y nombre, no un texto genérico."
      - "La cita y la bahía las confirma alguien del taller. El flujo avisa; no llena el día solo."
      - "El día de la entrega sale el pedido de reseña. Pedirlo a la semana es pedirlo tarde."
      - "Cuenta los mensajes de servicio del número. Desde el 1 oct 2026 la FAQ oficial cobra a partir del mensaje 1.001 de cada mes."
  - tool: notion
    steps:
      - "Abre una base de carros: placa, trabajo, estado, precio que tú pusiste y fecha prometida. Los estados caben en recibido, esperando repuesto y listo."
      - "Abre otra lista corta de repuestos: nombre, cantidad y mínimo. Es un tablero, no el inventario del contador."
      - "Cada mañana mira primero los que están en esperando repuesto, antes de contestar el WhatsApp."
      - "Si la cantidad está en cero, ese repuesto no entra en la cotización como si ya estuviera en el estante."
  - tool: n8n
    steps:
      - "Cuando el carro pasa a entregado en Notion, guarda la fecha y el tipo de trabajo. Ese es el dato del recordatorio."
      - "El plazo lo escribe el taller para ese trabajo. El flujo no inventa kilometraje ni un intervalo universal."
      - "El mensaje lo redactas tú: qué se hizo, qué toca revisar y cómo pedir la cita. Sale por el canal que el cliente ya usa."
      - "Prueba el flujo con un carro del taller antes de prenderlo para toda la lista."
  - tool: capcut
    steps:
      - "Graba el antes y el después desde el mismo ángulo. Si no hay antes, esa pieza no se publica."
      - "Corta a menos de 20 segundos: qué se veía, qué se cambió, carro listo. El dato se tiene que oír sin leer un párrafo."
      - "No muestres la placa completa ni el rostro del cliente si no te lo autorizó."
      - "El texto en pantalla nombra el trabajo de ese carro. No uses el resultado de otro."
  - tool: hubspot
    steps:
      - "Cada carro es un trato. El título lleva la placa y el trabajo, no solo el nombre de la persona."
      - "El directorio anota que HubSpot tiene plan gratuito. Úsalo para no perder el seguimiento, no para armar un CRM de empresa grande el primer día."
      - "Si pediste un repuesto, el trato lleva fecha. Cotizado sin fecha es un carro quieto."
      - "Una vez por semana abre los tratos que no se movieron. Esa lista es el seguimiento."
prompts:
  - title: Cotización sin inventar la falla
    text: "Eres el asistente de redacción de un taller mecánico. Con estos datos, escribe una cotización en español claro: vehículo, lo que dijo el cliente, lo que el taller ya revisó, el trabajo propuesto, el repuesto si lo nombré, el precio y lo que no incluye. No agregues causas, plazos ni repuestos que no estén en los datos. Si falta el precio, escribe “precio por definir”. Datos: [pegar]."
  - title: Cómo va tu carro
    text: "Escribe un mensaje de WhatsApp de máximo 50 palabras para decir cómo va un carro en el taller. Usa solo estos datos: nombre, placa, estado (recibido, esperando repuesto o listo) y la fecha que yo te doy. No prometas una hora que no esté escrita. No expliques la falla. Datos: [pegar]."
  - title: Pedido de reseña al entregar
    text: "Escribe un mensaje corto para pedir una reseña el día en que el cliente recoge el carro. Menciona el trabajo que sí se hizo, sin adjetivos de campaña y sin un descuento. Incluye un espacio para el enlace de la reseña. Si no te paso el enlace, deja [enlace]. Trabajo: [pegar]."
  - title: Recordatorio de mantenimiento
    text: "Escribe un recordatorio de mantenimiento para un cliente de taller. Usa solo el trabajo que se hizo, la fecha y el plazo que yo defino. No calcules kilometraje ni digas que el carro está en riesgo. Cierra con una pregunta para pedir la cita. Datos: [pegar]."
faqs:
  - q: ¿Esta guía le dice al técnico qué tiene el carro?
    a: "No. ChatGPT ordena lo que el taller ya escribió. No escucha el motor, no mide una pieza y no reemplaza la revisión. Si una causa no está confirmada, no sale en la cotización."
  - q: ¿Notion reemplaza el programa de taller?
    a: "No. En este directorio no hay un software de orden de trabajo con inventario contable. Notion sirve como tablero de carros y como lista simple de repuestos. La factura sigue en el sistema que el taller ya usa."
  - q: ¿El recordatorio sabe cuándo toca el próximo servicio?
    a: "Solo si el taller escribió el plazo. n8n manda el mensaje en esa fecha. No adivina kilometraje ni usa un intervalo único para todos los carros."
  - q: ¿Responder por WhatsApp sigue siendo gratis?
    a: "La FAQ oficial de WhatsApp Business, consultada el 16 oct 2026, cobra los mensajes de servicio desde el 1 oct 2026. Cada número tiene 1.000 gratis al mes. La nota del directorio enlaza esa FAQ y no publica la tarifa por país."
  - q: ¿Puedo publicar el antes y después con la placa?
    a: "Mejor no. CapCut sirve para el corte, no para decidir el permiso. Si el cliente no autorizó la pieza, no publiques la placa completa ni su rostro."
related:
  - detailing
  - lavaderos-de-carros
  - venta-de-repuestos
  - talleres-de-motos
  - llanterias
---

Un taller se atasca en lo mismo todos los días. La cita vive en un chat. La cotización sale en un audio. El cliente pregunta cómo va el carro y hay que reconstruir la respuesta. El repuesto se promete de memoria. El carro sale y nadie escribe cuando toca volver. La reseña se pide tarde. La foto del trabajo se queda en el teléfono.

## Agenda

La bahía no cabe en la cabeza de una persona cuando hay más de un carro. ManyChat puede recibir el pedido de cita. La hora y el puesto los confirma alguien que ve el día. El bot no sabe si esa bahía ya está ocupada.

## Cotización

El cliente compara con otro taller en el mismo chat. Necesita un texto corto: qué se haría, qué no, y el precio que el taller decidió. ChatGPT redacta ese texto a partir de lo que ya revisaste. No examina el carro.

## Seguimiento por WhatsApp

“¿Cómo va?” es el mensaje que más se repite. La respuesta sale de un estado escrito: recibido, esperando repuesto o listo. Si el estado no está en Notion o en HubSpot, el mensaje vuelve a ser un audio improvisado.

Desde el 1 oct 2026, la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio) resume el cobro del mensaje de servicio. Automatizar no quita esa tarifa.

## Recordatorio de mantenimiento

El recordatorio útil nombra el trabajo que sí se hizo y el plazo que el taller definió para ese caso. n8n lo envía. No calcula un kilometraje ni usa la misma cifra para un cambio de aceite y para un freno.

## Reseñas

Se piden el día de la entrega, con el trabajo mencionado en una frase. ManyChat dispara el mensaje. La reseña la escribe el cliente, en el sitio donde el taller ya pide reseñas. Nadie de esta guía inventa el texto de una reseña publicada.

## Antes y después

Sirve cuando el trabajo se ve: un freno, una suspensión, una pieza al lado de la vieja. Sin el antes, no hay pieza. CapCut corta. No autoriza publicar la placa.

## Inventario

La lista mínima es el repuesto, cuántos hay y a partir de qué número se compra. Notion alcanza para no prometer lo que está en cero. No reemplaza el kardex ni la factura.

## Lo que no está en el directorio

No hay aquí un programa de taller que una la orden, el repuesto y la factura. Si el taller ya tiene uno, estas herramientas no lo botan: cubren el texto, el WhatsApp, el tablero y el recordatorio. El detalle de un negocio de estética está en la [guía de detailing](/herramientas-ia/para/detailing). Si el negocio es un lavadero, sigue en la [guía de lavaderos](/herramientas-ia/para/lavaderos-de-carros). Si vendes la pieza en el mostrador, sigue en la [guía de repuestos](/herramientas-ia/para/venta-de-repuestos). Si el banco es de motos, sigue en la [guía de talleres de motos](/herramientas-ia/para/talleres-de-motos). Si el trabajo es la llanta, sigue en la [guía de llanterías](/herramientas-ia/para/llanterias).
