---
title: IA para llanterías
description: "En una llantería, la medida del costado y el aviso de que el trabajo está listo son lo que se repite. Esta guía usa WhatsApp, ChatGPT, Photoroom, Notion, el perfil de Google y Treble. No adivina una medida ni un precio."
published: 2026-10-26
tools:
  - whatsapp-business
  - chatgpt
  - photoroom
  - notion
  - google-business-profile
  - treble
guides:
  - tool: whatsapp-business
    steps:
      - "Deja tres respuestas rápidas: horario, dirección y qué medidas tienes hoy. El precio sale de tu lista, no de un mensaje viejo."
      - "El saludo dice cómo pedir la cita. No promete que el carro salga en un número de minutos."
      - "Cuando el trabajo está listo, el mensaje lo manda una persona o un flujo que lee un estado ya marcado."
      - "No confirmes una medida que el cliente escribió de oído. Pide la foto del costado o que la lea en el local."
  - tool: chatgpt
    steps:
      - "Pega la lista de medidas y servicios que sí haces, con el precio de hoy. Sin esa lista, el borrador no tiene monto."
      - "Si el cliente manda una medida que no está, la respuesta dice que el local lo confirma. El chat no calcula un equivalente."
      - "Pide por separado el mensaje de listo y el pedido de reseña. No juntes un descuento por opinar."
      - "Borra cualquier garantía de kilómetros que no hayas escrito tú en la ficha."
  - tool: photoroom
    steps:
      - "Fotografía la llanta que vas a entregar, con la medida legible. No bajes una imagen de otro vendedor."
      - "Quita el fondo y compara la medida con la foto original antes de exportar. Si un número cambió, no sirve."
      - "No pegues el precio en la imagen. El precio vive en la lista, porque cambia."
      - "Si el código o la marca se reescribieron, manda la foto sin editar."
  - tool: notion
    steps:
      - "Una ficha por cita: cliente, vehículo, medida, servicio y estado. Ahí queda también dónde está la foto."
      - "Una lista de inventario por medida: unidades y mínimo. Cuando baja del mínimo, se compra. No es un kardex."
      - "Antes de decir que hay, mira la lista. Si está en cero, el estado es encargado o no hay."
      - "El plazo del siguiente contacto lo escribes tú. Sin ese número, no hay recordatorio."
  - tool: google-business-profile
    steps:
      - "Revisa hoy horario, dirección y teléfono. Un enlace más visible no corrige un dato viejo."
      - "Sube fotos del local y de un trabajo con permiso. Sin placa completa si el cliente no la autorizó."
      - "Pide la reseña al entregar, con el enlace del perfil. No redactes la reseña por el cliente."
      - "Contesta una reseña con el servicio que sí hiciste. No ofrezcas un descuento a cambio de la estrella."
  - tool: treble
    steps:
      - "Treble es la API de WhatsApp, no la app gratis del celular. Si hoy contestas desde el teléfono, quédate en WhatsApp Business."
      - "Sube solo las respuestas que ya escribiste: medidas que sí hay, horario y lo que no instalas."
      - "El flujo pasa a una persona si hay un precio, un reclamo o una medida que no está en la lista."
      - "El precio del plan de Treble no estaba público el 26 oct 2026. La tarifa del mensaje de Meta no la absorbe la herramienta."
prompts:
  - title: Respuesta con la medida
    text: "Eres el asistente de una llantería. Responde en máximo 60 palabras usando solo esta lista de medidas, servicios y precios. Si la medida que pide el cliente no está, dilo y no inventes un equivalente. No prometas una hora de entrega ni una garantía de kilómetros. Lista: [pegar]. Pedido: [pegar]."
  - title: Aviso de listo
    text: "Escribe un mensaje de WhatsApp de máximo 40 palabras para avisar que el trabajo de llantas ya se puede retirar. Usa solo nombre, servicio y hora si te la paso. No pidas reseña en el mismo mensaje y no ofrezcas un servicio extra. Datos: [pegar]."
  - title: Texto de la foto
    text: "Escribe el texto de una publicación de máximo 30 palabras sobre esta llanta o este servicio ya hecho. No menciones placa ni nombre del cliente. No pongas un precio si no está en el dato y no digas que la medida es equivalente a otra. Dato: [pegar]."
  - title: Qué hay que comprar
    text: "Con esta lista de medidas de llanta (medida, unidades y mínimo), dime solo cuáles están en el mínimo o por debajo. No recomiendes marcas ni cantidades de compra. No armes una orden. Lista: [pegar]."
faqs:
  - q: ¿El chat puede decir que una medida equivale a otra?
    a: "No. La medida la confirma quien lee el costado o la ficha del vehículo. ChatGPT y Treble solo pueden repetir la lista que tú pegaste. Si la medida no está, la respuesta es que el local lo confirma."
  - q: ¿Treble reemplaza la app de WhatsApp Business?
    a: "No. Treble dice ser un proveedor de la API, no la app gratis. Si el volumen todavía cabe en el teléfono, la guía empieza por WhatsApp Business. El cobro del mensaje de servicio sigue en la nota de WhatsApp del directorio."
  - q: ¿Puedo publicar la foto con el fondo limpio si la medida se ve rara?
    a: "No. Photoroom limpia el fondo. Si un número del costado cambió, esa salida no se publica. La foto sin editar es mejor que una medida distinta."
  - q: ¿El perfil de Google actualiza solo el horario?
    a: "No. El horario, la dirección y las fotos se cargan en el perfil. La nota de fin de año de Meta no llena tu ficha ni te dice cuántas llantas vas a vender."
related:
  - talleres-de-carros
  - venta-de-repuestos
  - lavaderos-de-carros
  - venta-de-carros-usados
---

La llantería se traba en la medida y en el «¿ya quedó?». Si la medida se contesta de memoria, se manda la pieza que no es. Si el aviso de listo sale en un audio, cada cliente escucha una hora distinta.

## La medida

WhatsApp Business lleva el horario y la lista corta. ChatGPT redacta con esa lista. Una medida que no está no se convierte en otra. La foto del costado manda más que el audio del cliente.

## La foto

Photoroom quita el fondo de la llanta que sí vas a entregar. El número tiene que seguir leyéndose igual. El precio no va pegado en la imagen. La [guía de repuestos](/herramientas-ia/para/venta-de-repuestos) usa la misma regla para el código de una pieza.

## El aviso

El mensaje de listo sale cuando alguien marcó el estado. Lleva el servicio que sí se hizo. La reseña va en otro mensaje, con el enlace del perfil de Google. El cobro de los mensajes de servicio está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio).

## Si el volumen ya no cabe en el teléfono

Treble entra cuando el negocio usa la API, con respuestas escritas y pase a una persona. El 26 oct 2026 la página de precios de Treble pedía contraseña: aquí no hay un monto de su plan. La [nota de fin de año](/herramientas-ia/noticias/compras-fin-de-ano-en-mexico) habla de mensajes y de fotos de producto. No dice cuántas llantas vas a vender en noviembre.

## Lo que no hace esta página

No alinea, no balancea y no lee un DOT por ti. Si el cuello de botella es la bahía del taller, sigue en la [guía de talleres](/herramientas-ia/para/talleres-de-carros). Si vendes el carro y no la llanta, sigue en la [guía de carros usados](/herramientas-ia/para/venta-de-carros-usados).
