---
title: IA para talleres de pintura
description: "En un taller de pintura, el color y el antes y después se traban si salen de memoria. Esta guía usa WhatsApp, ChatGPT, Photoroom, VEED, Notion y el perfil de Google. No iguala un color ni publica un carro que no pintaste."
published: 2026-11-16
tools:
  - whatsapp-business
  - chatgpt
  - photoroom
  - veed
  - notion
  - google-business-profile
guides:
  - tool: whatsapp-business
    steps:
      - "Deja tres respuestas: horario, qué piezas pintas y qué no haces. El precio del trabajo sale de tu lista, no de un chat viejo."
      - "Pide foto del daño y el código de color si el cliente lo tiene. Si no lo tiene, la cita es para leerlo en el local."
      - "El aviso de listo lo manda una persona cuando la pieza ya se puede retirar. No prometas un día si el repuesto o la cabina no están confirmados."
      - "No confirmes un color por el nombre que escribió el cliente. Un nombre parecido es otro tono."
  - tool: chatgpt
    steps:
      - "Pega la pieza, el daño que ya viste y el precio que tú pusiste. Pide el texto de la cotización y un WhatsApp de menos de 70 palabras."
      - "Si no escribiste el código de color, el borrador lo deja en blanco. No le pidas que lo adivine."
      - "Incluye lo que no cubre el trabajo: desmonte, otra pieza o un daño que no revisaste."
      - "Borra cualquier plazo o garantía de años que no hayas escrito tú."
  - tool: photoroom
    steps:
      - "Fotografía el panel que sí vas a entregar, con la misma luz del antes. No bajes una foto de otro taller."
      - "Quita el fondo y compara el color con la foto original. Si el tono cambió, esa salida no se publica."
      - "No pegues el precio en la imagen. El precio vive en la cotización, porque el daño cambia."
      - "Si la placa se lee completa y el cliente no autorizó mostrarla, recórtala antes de exportar."
  - tool: veed
    steps:
      - "Sube un video que tú grabaste, del antes y del después, desde el mismo ángulo. No generes un carro."
      - "Pon subtítulos con lo que se ve: la pieza y el trabajo. Si el texto inventa un color o un precio, se borra."
      - "El 16 nov 2026 la página de precios de VEED deja empezar gratis y no mostró un monto de plan en el texto leído. No anotes una cifra que no viste."
      - "Los subtítulos de un plan de pago tienen, según esa página, un uso justo de 50 horas al mes. No los cuentes como ilimitados."
  - tool: notion
    steps:
      - "Una ficha por trabajo: cliente, vehículo, pieza, código de color si ya lo leíste, precio que tú pusiste y estado."
      - "Los estados caben en recibido, en cabina, esperando y listo. El estado lo cambia quien vio la pieza."
      - "El código de color se escribe cuando alguien lo leyó en el carro o en la ficha. Una celda vacía no se completa con un chat."
      - "Antes de decir que quedó, mira el estado. Si sigue en cabina, el WhatsApp no dice listo."
  - tool: google-business-profile
    steps:
      - "Revisa hoy horario, dirección y teléfono. Una foto nueva no corrige un dato viejo."
      - "Sube el antes y el después con permiso. Sin placa completa si el cliente no la autorizó."
      - "Pide la reseña al entregar, en otro mensaje, con el enlace del perfil. No la redactes tú."
      - "Contesta una reseña con la pieza que sí pintaste. No ofrezcas un descuento a cambio de la estrella."
prompts:
  - title: Cotización sin adivinar el color
    text: "Eres el asistente de un taller de pintura. Escribe una cotización de máximo 120 palabras y un WhatsApp de máximo 60. Usa solo la pieza, el daño y el precio que te pego. Si falta el código de color, déjalo entre corchetes. No prometas un día ni una garantía. Datos: [pegar]."
  - title: Aviso de listo
    text: "Escribe un mensaje de WhatsApp de máximo 40 palabras para avisar que la pieza pintada ya se puede retirar. Usa solo nombre, pieza y hora si te la paso. No pidas reseña en el mismo mensaje y no ofrezcas otro servicio. Datos: [pegar]."
  - title: Texto del video
    text: "Escribe subtítulos de máximo 12 palabras por línea para este video de un trabajo de pintura ya hecho. No menciones placa ni nombre del cliente. No pongas un color ni un precio que no esté en el dato. Dato: [pegar]."
  - title: Qué no cubre
    text: "Con esta lista de lo que sí incluye el trabajo de pintura, escribe tres frases de lo que no está incluido, solo si yo lo marqué. No agregues exclusiones nuevas. No cambies el precio. Lista: [pegar]."
faqs:
  - q: ¿El chat puede decir el código de color?
    a: "No. El código lo lee quien está frente al carro o quien mira la ficha que ya guardaste. ChatGPT solo puede dejar el espacio en blanco si no se lo pegaste. Un nombre de color parecido no alcanza."
  - q: ¿Puedo generar el carro en VEED si no alcancé a grabar?
    a: "No. VEED entra con un video que tú grabaste. Generar un vehículo que no pintaste es otro trabajo. Los subtítulos se leen antes de publicar, porque un texto puede inventar un precio."
  - q: ¿Photoroom sirve si el color se ve distinto al exportar?
    a: "No publiques esa salida. Quitar el fondo no puede cambiar el tono del panel. Si cambió, manda la foto sin editar o vuelve a tomarla con la misma luz del antes."
  - q: ¿El perfil de Google actualiza solo las fotos del trabajo?
    a: "No. El horario, la dirección y el teléfono se revisan en el perfil. La foto entra con permiso y sin la placa completa si el cliente no la autorizó."
related:
  - talleres-de-carros
  - detailing
  - lavaderos-de-carros
  - venta-de-carros-usados
---

La pintura se traba en el color y en la promesa de fecha. Si el código se contesta de memoria, se pide el tono que no es. Si el «ya quedó» sale antes de que la pieza salga de cabina, el cliente llega a un carro que no está.

## El color

WhatsApp pide la foto y, si existe, el código. ChatGPT redacta con el precio que tú pegaste. Un código que no está no se inventa. La [guía de talleres](/herramientas-ia/para/talleres-de-carros) cubre la cotización del trabajo mecánico. Esta página es la pieza que se pinta.

## La foto y el video

Photoroom limpia el fondo de una foto real. Si el tono cambió, no sirve. VEED subtitula un video que grabaste, no un carro generado. Recraft, en este directorio, genera imágenes: en el plan gratis, leído el 16 nov 2026, no tienen uso comercial. No lo uses para mostrar un trabajo que no hiciste.

## El aviso

El mensaje de listo sale cuando Notion dice listo. La reseña va en otro mensaje, con el enlace del perfil de Google. El cobro de los mensajes de servicio está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio).

## Lo que no hace esta página

No mezcla pintura, no mide el espesor y no iguala un color a ojo. Si el cuello de botella es la bahía y no la cabina, sigue en la [guía de talleres](/herramientas-ia/para/talleres-de-carros). Si el trabajo es lavar y proteger, sigue en [detailing](/herramientas-ia/para/detailing).
