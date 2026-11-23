---
title: "IA para electricidad del carro"
description: "En la electricidad del carro, el fallo lo confirma quien midió en el banco, no un audio. Esta guía usa WhatsApp, ChatGPT, Notion, LanguageTool y el perfil de Google. No nombra una pieza que no está en tu lista ni publica un diagnóstico que no hiciste."
published: 2026-11-23
tools:
  - whatsapp-business
  - chatgpt
  - notion
  - languagetool
  - google-business-profile
guides:
  - tool: whatsapp-business
    steps:
      - "Deja tres respuestas: horario, qué revisas y cómo pedir la cita. El precio de la revisión sale de tu lista."
      - "Pide el síntoma con las palabras del cliente y el vehículo. No confirmes una pieza ni un fusible por ese audio."
      - "El aviso de listo lo manda una persona cuando el carro ya se puede retirar. No expliques la falla en ese mensaje."
      - "Si piden un trabajo que no haces, la respuesta es que el local no lo hace. No ofrezcas un repuesto parecido."
  - tool: chatgpt
    steps:
      - "Pega el síntoma que ya anotaste, la medición que hiciste y el precio que tú pusiste. Pide el texto de la revisión y un WhatsApp corto."
      - "Si no escribiste la pieza, el borrador lo deja en blanco. No le pidas que nombre un alternador, una batería o un fusible."
      - "Separa la revisión de la reparación. Si no autorizaron el gasto, el texto no lo da por hecho."
      - "Borra cualquier causa o plazo que no hayas escrito tú."
  - tool: notion
    steps:
      - "Una ficha por carro: cliente, vehículo, síntoma, medición que ya hiciste, pieza si ya la confirmaste, precio y estado."
      - "Los estados caben en recibido, en medición, esperando autorización, esperando pieza y listo. El estado lo cambia quien midió."
      - "La pieza se escribe cuando alguien la confirmó en el banco. Una celda vacía no se completa con un chat."
      - "Antes de decir que quedó, mira el estado y la autorización. Si falta la firma del gasto, el WhatsApp no dice listo."
  - tool: languagetool
    steps:
      - "Pega el mensaje de la revisión, en español, antes de enviarlo. El corrector no interpreta una medición."
      - "Si una sugerencia cambia un número, una pieza o una hora, no la aceptes."
      - "No pases el precio de la reparación por el parafraseo. El monto lo contrastas tú con la lista."
      - "Vuelve a leer el mensaje. Una frase más clara no confirma que la pieza ya esté en el estante."
  - tool: google-business-profile
    steps:
      - "Revisa hoy horario, dirección y teléfono. Un aviso de revisión no corrige un dato viejo."
      - "No subas una foto del tablero con datos del cliente. Si publicas una pieza, que sea la que sí cambiaste y sin la placa completa."
      - "Pide la reseña al entregar, en otro mensaje, con el enlace del perfil. No la redactes tú."
      - "Contesta una reseña con el trabajo que sí hiciste. No expliques una falla de otro carro."
prompts:
  - title: Texto de la revisión
    text: "Eres el asistente de un electricista automotriz. Escribe una nota de revisión de máximo 120 palabras y un WhatsApp de máximo 60. Usa solo el síntoma, la medición y el precio que te pego. Si falta la pieza, déjala entre corchetes. No nombres una causa que yo no haya escrito. Datos: [pegar]."
  - title: Pedido de autorización
    text: "Escribe un mensaje de máximo 50 palabras para pedir autorización del gasto. Usa solo la pieza, el precio y lo que no incluye, si te lo paso. No des la reparación por aceptada. Pide una respuesta de sí o no. Datos: [pegar]."
  - title: Aviso de listo
    text: "Escribe un mensaje de WhatsApp de máximo 40 palabras para avisar que el carro ya se puede retirar. Usa solo nombre y hora si te la paso. No expliques la falla y no pidas reseña en el mismo mensaje. Datos: [pegar]."
  - title: Mensaje sin pieza inventada
    text: "Revisa este borrador de electricidad automotriz. Devuelve solo tres listas: piezas que sí te pegué, piezas que el texto agregó y números que no están en mi dato. No completes la causa. Borrador: [pegar]. Dato: [pegar]."
faqs:
  - q: ¿El chat puede decir si la falla es la batería?
    a: "No. La pieza la confirma quien midió en el banco. ChatGPT solo redacta la medición que tú pegaste. Un síntoma parecido no es un diagnóstico."
  - q: ¿LanguageTool puede aclarar la causa de la falla?
    a: "Puede marcar ortografía del mensaje que ya escribiste. No interpreta un voltaje ni cambia una pieza. Si la sugerencia mueve un número, no se acepta."
  - q: ¿Sirve esta guía para el aire acondicionado?
    a: "El clima del carro está en la guía de aire acondicionado. Aquí el trabajo es la parte eléctrica que alguien midió, con el precio de la revisión aparte del de la reparación."
  - q: ¿Puedo publicar el tablero del cliente en el perfil?
    a: "No, si se leen datos del cliente. El perfil lleva horario, dirección y teléfono revisados hoy. La foto, si sale, es de una pieza que sí cambiaste y sin la placa completa."
related:
  - aire-acondicionado
  - talleres-de-carros
  - venta-de-repuestos
  - llanterias
---

La electricidad se traba en la causa. Si el audio del cliente se vuelve un repuesto, se pide la pieza que no es. Si el precio de la reparación sale en el mismo mensaje que la revisión, el gasto queda autorizado sin que nadie lo haya dicho.

## La medición

WhatsApp pide el síntoma y da el precio de la revisión, el de tu lista. ChatGPT redacta con la medición que ya anotaste. Una pieza que no está no se nombra. La [guía de aire acondicionado](/herramientas-ia/para/aire-acondicionado) es el clima. Esta página es el banco eléctrico.

## El mensaje

[LanguageTool](/herramientas-ia/languagetool) revisa el español del texto que ya escribiste. No lee un multímetro. El 16 nov 2026 la ayuda de suscripciones, fechada el 24 mar 2026, lista el Premium en euros. Esta página no los convierte en pesos.

## La autorización

Notion separa la revisión del gasto. El mensaje de listo sale cuando el estado dice listo y la autorización está escrita. La reseña va en otro mensaje, con el enlace del perfil de Google. El cobro de los mensajes de servicio está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio).

## Lo que no hace esta página

No mide voltaje, no cambia una batería y no autoriza el gasto. Si el trabajo es el motor y no el cable, sigue en la [guía de talleres](/herramientas-ia/para/talleres-de-carros). Si vendes la pieza en el mostrador, sigue en la [guía de repuestos](/herramientas-ia/para/venta-de-repuestos).
