---
title: IA para barberías
description: "En una barbería, la cita, el recordatorio y la foto del corte son lo que el cliente vuelve a pedir. Esta guía usa ManyChat, WhatsApp Business, ChatGPT, Canva, CapCut y el perfil de Google. No publica un rostro sin permiso."
published: 2026-10-19
tools:
  - manychat
  - whatsapp-business
  - chatgpt
  - canva
  - capcut
  - google-business-profile
guides:
  - tool: manychat
    steps:
      - "El flujo pide nombre, servicio y día. La hora la confirma quien ve la silla. El bot no sabe si el barbero ya tiene esa franja."
      - "El recordatorio sale el día anterior con la hora ya confirmada. No ofrece un servicio extra."
      - "Si el cliente cancela, el flujo avisa a la persona. No rellena el hueco solo."
      - "El pedido de reseña sale después de la visita, una vez, con el enlace del perfil."
  - tool: whatsapp-business
    steps:
      - "Las respuestas rápidas cubren horario, dirección y los servicios con el precio que tú escribiste."
      - "El mensaje de ausencia no confirma citas. Dice a qué hora vuelven a contestar."
      - "Una foto de un corte solo se reenvía si ese cliente permitió mostrarla."
      - "El número del negocio no es el chat personal de quien corta."
  - tool: chatgpt
    steps:
      - "Pega la lista de servicios y precios antes de pedir un mensaje. Sin lista, no hay monto."
      - "Pide el recordatorio y la respuesta de un servicio que no está, por separado."
      - "Si piden un look de una foto, el texto puede describir el pedido. No promete que el corte quede igual."
      - "Quita cualquier tiempo de duración que no esté en tu lista."
  - tool: canva
    steps:
      - "Una pieza, un corte, con permiso. El nombre del servicio cabe. El rostro, solo si te lo autorizaron."
      - "No uses una cara generada como si fuera un cliente. La pieza es del trabajo que sí hiciste."
      - "El precio de la pieza es el de la lista de hoy o no va."
      - "Revisa que el texto no tape la zona del corte que quieres mostrar."
  - tool: capcut
    steps:
      - "Un video corto del proceso, de 15 a 20 segundos, si el cliente aceptó que se grabe."
      - "No aceleres hasta esconder cómo quedó el corte. El antes, si lo muestras, es de esa misma visita."
      - "Sin música que no puedas usar y sin un texto largo encima de la cara."
      - "Guarda el archivo con la fecha. Si después piden que lo bajes, sabes cuál es."
  - tool: google-business-profile
    steps:
      - "Horario, dirección y teléfono iguales a los de WhatsApp. Un horario distinto es una cita perdida."
      - "Las fotos del local pueden ir sin clientes. Las de un corte, con permiso."
      - "Pide la reseña al salir, con el enlace. No la escribas tú."
      - "Contesta sin ofrecer un corte gratis a cambio de cambiar la estrella."
prompts:
  - title: Recordatorio de la silla
    text: "Escribe un recordatorio de cita para una barbería, de máximo 45 palabras, para enviarlo el día anterior. Usa nombre, servicio y hora. No cambies la hora, no ofrezcas otro servicio y no pidas seña si yo no la mencioné. Datos: [pegar]."
  - title: Un servicio que no está
    text: "El cliente pide un servicio que no está en esta lista. Responde en máximo 40 palabras que una persona del local lo confirma, y di el horario de respuesta. No calcules un precio ni armes un paquete. Lista: [pegar]. Pedido: [pegar]."
  - title: Texto de la foto del corte
    text: "Escribe un texto de máximo 25 palabras para una foto de un corte ya hecho. Usa solo el nombre del servicio. No describas al cliente, no pongas su nombre y no digas que el resultado es igual a una foto de referencia. Servicio: [pegar]."
  - title: Hueco por cancelación
    text: "Escribe un mensaje interno, no para el cliente, que avise que se liberó una hora. Incluye hora y servicio cancelado. No ofrezcas esa hora a toda la lista de contactos ni armes una promo. Datos: [pegar]."
faqs:
  - q: ¿Puedo publicar el corte sin preguntar?
    a: "No. La cara del cliente no es material de la barbería por defecto. Canva y CapCut arman la pieza después del permiso. Si no lo hubo, se publica el local, las herramientas o un corte sin identificar a la persona."
  - q: ¿El bot puede llenar la agenda de los tres barberos?
    a: "Puede tomar el pedido. La silla la asigna una persona, porque el flujo no ve quién está en descanso ni cuánto tarda ese servicio en ese barbero. ManyChat no es el cuaderno de turnos."
  - q: ¿La foto de referencia obliga a dejar el corte igual?
    a: "No. El mensaje puede decir que recibiste la referencia. Quien corta decide qué se puede hacer con ese cabello. El chat no lo promete."
  - q: ¿Hace falta un programa de citas nuevo?
    a: "No para empezar. WhatsApp, un flujo corto y el perfil de Google cubren el recordatorio y la reseña. Un programa de citas entra cuando el cuaderno ya no alcanza, no antes."
related:
  - responder-whatsapp
  - contenido-para-redes
  - lavaderos-de-carros
---

La barbería se parece al lavadero en una cosa: la hora es el producto. Se diferencia en otra: la foto muestra a una persona. Por eso el permiso va antes que la pieza.

## La cita

ManyChat pregunta servicio y día. Alguien confirma la hora en la silla que sí está libre. WhatsApp Business tiene el horario y el precio por escrito, para no cotizar de memoria en cada chat.

## La foto

Canva y CapCut recortan un trabajo real. No fabrican un cliente. Si el video se alarga y entra un generador, la [nota de Higgsfield](/herramientas-ia/noticias/higgsfield-video-largo) sirve para no prometer una duración que la herramienta no está mostrando.

## La reseña

Se pide al salir, con el enlace del perfil de Google. El cliente la escribe. Un descuento por estrella no entra en el mensaje.

## Lo que no hace esta página

No enseña a cortar ni arma la nómina. Si el negocio es un lavadero de carros, la fila y el aviso de listo están en la [guía de lavaderos](/herramientas-ia/para/lavaderos-de-carros).
