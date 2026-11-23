---
title: "IA para una veterinaria chica"
description: "En una veterinaria chica, la cita y el recordatorio de la vacuna salen de la ficha, no de un chat. Esta guía usa WhatsApp, ChatGPT, Notion, LanguageTool y el perfil de Google. No diagnostica, no receta y no publica la cara de un animal sin permiso."
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
      - "Deja tres respuestas: horario, si atiendes con cita y qué especies ves. El precio de la consulta sale de tu lista."
      - "Pide la especie, el nombre del animal y el motivo con las palabras de quien escribe. No confirmes un diagnóstico por ese mensaje."
      - "El recordatorio de una vacuna sale de la fecha que anotaste en la ficha, una sola vez. No calcules la siguiente dosis."
      - "Si piden un medicamento por el chat, la respuesta es que la consulta la hace una persona. No nombres una dosis."
  - tool: chatgpt
    steps:
      - "Pega el motivo que ya anotaste, el precio de la consulta que tú pusiste y la fecha de la cita si ya la confirmaste. Pide el mensaje de confirmación."
      - "Si no escribiste un diagnóstico, el borrador no lo agrega. No le pidas que nombre una enfermedad ni un medicamento."
      - "El recordatorio usa solo la vacuna y la fecha que tú pegaste. No inventes un intervalo."
      - "Borra cualquier consejo clínico que no hayas escrito tú."
  - tool: notion
    steps:
      - "Una ficha por animal: tutor, especie, nombre del animal, motivo, fecha de cita, vacuna si ya la aplicaste y estado."
      - "Los estados caben en pedido, citado, atendido y recordatorio enviado. El estado lo cambia quien vio al animal."
      - "La vacuna y la fecha se escriben cuando alguien las aplicó o las agendó. Una celda vacía no se completa con un chat."
      - "Antes de mandar el recordatorio, mira la fecha de la ficha. Si no está, el mensaje no sale."
  - tool: languagetool
    steps:
      - "Pega el mensaje de la cita, en español, antes de enviarlo. El corrector no arma la historia clínica."
      - "Si una sugerencia cambia un nombre, una fecha o un precio, no la aceptes."
      - "No pases el nombre del medicamento por el parafraseo. Si no lo escribiste, no debe aparecer."
      - "Vuelve a leer el mensaje. Una frase más clara no es una receta."
  - tool: google-business-profile
    steps:
      - "Revisa hoy horario, dirección y teléfono. Un aviso de vacunación no corrige un dato viejo."
      - "No publiques la cara del animal ni el nombre del tutor si no te autorizaron la foto."
      - "Pide la reseña al salir, en otro mensaje, con el enlace del perfil. No la redactes tú."
      - "Contesta una reseña sin datos clínicos. No menciones el motivo de la consulta de ese tutor."
prompts:
  - title: Confirmación de cita
    text: "Eres el asistente de una veterinaria. Escribe un WhatsApp de máximo 50 palabras para confirmar una cita. Usa solo especie, nombre del animal, fecha, hora y precio de la consulta si te los paso. No nombres una enfermedad ni un medicamento. Datos: [pegar]."
  - title: Recordatorio de vacuna
    text: "Escribe un recordatorio de máximo 40 palabras. Usa solo el nombre del animal, la vacuna y la fecha que te pego. No calcules la siguiente dosis y no ofrezcas otro servicio. Datos: [pegar]."
  - title: Mensaje sin consejo clínico
    text: "Revisa este borrador de una veterinaria. Devuelve solo las frases que diagnostican, recetan o dan una dosis que yo no pegué. No completes el consejo. Borrador: [pegar]. Dato: [pegar]."
  - title: Respuesta de horario
    text: "Escribe una respuesta de máximo 35 palabras con el horario y la dirección que te pego. Si preguntan por un síntoma, di que la consulta es en el local y no des un diagnóstico. Datos: [pegar]. Pregunta: [pegar]."
faqs:
  - q: ¿El chat puede decir qué tiene el animal?
    a: "No. El motivo lo anota quien escribe y el diagnóstico lo da quien atiende. ChatGPT solo confirma la cita con los datos que tú pegaste. Un síntoma no es una receta."
  - q: ¿Puedo calcular la próxima vacuna con el chat?
    a: "No en esta guía. El recordatorio usa la fecha que ya está en la ficha. Si esa fecha no está, el mensaje no sale. El intervalo lo decide quien aplica la vacuna."
  - q: ¿LanguageTool puede suavizar un consejo médico?
    a: "Puede marcar ortografía del mensaje de la cita. No debe agregar un medicamento ni cambiar una fecha. Si la sugerencia mueve un nombre o un precio, no se acepta."
  - q: ¿Puedo subir la foto del animal al perfil de Google?
    a: "Solo con permiso de quien lo trae. Sin esa autorización, el perfil se queda con horario, dirección y teléfono. La reseña no lleva el motivo de la consulta."
related:
  - atender-clientes
  - responder-whatsapp
  - cobrar
  - panaderias
---

Una veterinaria chica se traba en la cita y en el dato clínico. Si el chat nombra una enfermedad, el tutor llega con un diagnóstico que nadie dio. Si el recordatorio calcula la siguiente dosis, se cita una fecha que la ficha no tiene.

## La cita

WhatsApp pide especie, nombre del animal y motivo. ChatGPT confirma con el precio de la consulta que tú pegaste. Un síntoma no se convierte en medicamento. La [guía para atender](/herramientas-ia/para/atender-clientes) cubre las preguntas que ya tienen respuesta. Esta página deja el diagnóstico fuera del borrador.

## El recordatorio

Notion guarda la vacuna y la fecha que alguien anotó. El mensaje sale una vez, con esos dos datos. [LanguageTool](/herramientas-ia/languagetool) revisa el español. No reescribe la historia clínica. Antes de pegar el nombre del tutor en Gemini, mira el control de historial de la [nota del 16 nov](/herramientas-ia/noticias/gemini-historial-sin-entrenar).

## La reseña

Va en otro mensaje, con el enlace del perfil de Google, y sin el motivo de la consulta. El cobro de los mensajes de servicio está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio). Si el mensaje es un cobro de una consulta ya hecha, la [guía para cobrar](/herramientas-ia/para/cobrar) empieza por el monto que tú escribiste.

## Lo que no hace esta página

No diagnostica, no receta y no calcula una dosis. Si el negocio es un local de comida y no una clínica, sigue en la [guía de restaurantes](/herramientas-ia/para/restaurantes) o en la [guía de panaderías](/herramientas-ia/para/panaderias).
