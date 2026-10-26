---
title: IA para talleres de motos
description: "En un taller de motos, la cita, la pieza y el aviso de listo se pierden en el chat. Esta guía usa WhatsApp, ManyChat, ChatGPT, Notion, n8n y el perfil de Google. No calcula un kilometraje ni afirma que una pieza aplica."
published: 2026-10-26
tools:
  - whatsapp-business
  - manychat
  - chatgpt
  - notion
  - n8n
  - google-business-profile
guides:
  - tool: whatsapp-business
    steps:
      - "Deja respuestas de horario, dirección y qué servicios sí haces. El precio sale de tu lista."
      - "El saludo pide marca, año y el síntoma en una frase. No confirma la cita."
      - "El aviso de ausencia no agenda. Quien escribe fuera de hora no queda con hora tomada."
      - "Cuando la moto está lista, el mensaje sale de un estado marcado, con el trabajo que sí se hizo."
  - tool: manychat
    steps:
      - "El flujo pide nombre, moto y día. La hora la confirma quien ve el banco de trabajo."
      - "No ofrezcas un puesto si ese día ya tiene motos. El flujo no mira el taller."
      - "Si piden una pieza, el flujo no dice que aplica. Pasa el dato a una persona."
      - "Cuenta los mensajes de servicio antes de automatizar. La tarifa de Meta no la absorbe la herramienta."
  - tool: chatgpt
    steps:
      - "Pega el servicio y el precio que ya decidiste. Si falta el precio, el borrador dice que está por confirmar."
      - "Si el cliente manda una foto o un código, la respuesta dice qué dato falta. No afirma compatibilidad."
      - "Pide el mensaje de WhatsApp y el texto de la publicación por separado."
      - "No dejes un kilometraje de mantenimiento que el taller no haya escrito para ese caso."
  - tool: notion
    steps:
      - "Una ficha por moto: cliente, marca, año, trabajo, estado y dónde está la foto."
      - "La pieza lleva nombre, unidades y mínimo. En cero no se promete."
      - "El plazo para volver lo anotas tú en esa ficha. No es el mismo número para un aceite y para un freno."
      - "Antes de cotizar de memoria, abre la ficha. El audio no es el registro."
  - tool: n8n
    steps:
      - "Al cerrar la ficha, el flujo toma la fecha y el plazo que el taller escribió."
      - "El mensaje recuerda el trabajo que sí se hizo y cómo pedir la siguiente cita."
      - "Si la persona no contesta, el flujo no insiste más de una vez."
      - "Prueba con una moto vieja del negocio antes de activarlo para todas."
  - tool: google-business-profile
    steps:
      - "Revisa horario, dirección y teléfono hoy. El perfil no se corrige solo."
      - "Sube fotos del taller y de un trabajo con permiso. Sin placa si el cliente no la autorizó."
      - "Si la foto muestra a una persona, hace falta su permiso. No publiques un rostro por costumbre."
      - "Pide la reseña al entregar, con el enlace. No la escribas tú ni ofrezcas un descuento por la estrella."
prompts:
  - title: Cotización sin compatibilidad inventada
    text: "Arma una cotización de máximo 80 palabras para este taller de motos. Usa solo el servicio, el precio y el síntoma que te pego. Si falta un dato para decir que una pieza aplica, déjalo entre corchetes y no afirmes compatibilidad. No ofrezcas descuento ni un plazo que no esté en el dato. Dato: [pegar]."
  - title: Estado de la moto
    text: "Escribe un mensaje de máximo 45 palabras para decir cómo va una moto. Usa solo el estado que te paso: recibida, esperando pieza o lista. No inventes una hora de salida ni un diagnóstico. No pidas reseña. Estado: [pegar]."
  - title: Recordatorio con el plazo del taller
    text: "Escribe un recordatorio de máximo 50 palabras para una moto que ya salió. Menciona el trabajo que sí se hizo y el plazo que el taller escribió. No calcules kilometraje y no uses el mismo plazo para otro servicio. Datos: [pegar]."
  - title: Publicación sin placa
    text: "Escribe el texto de una publicación de máximo 30 palabras sobre este trabajo de moto ya hecho. No menciones placa, nombre del cliente ni un rostro. No digas que quedó como nueva y no pongas un precio si no está en el dato. Trabajo: [pegar]."
faqs:
  - q: ¿Esta guía es la misma que la de talleres de carros?
    a: "No. El seguimiento y la cotización se parecen. Aquí la pieza, la foto y el plazo son de moto. La guía de talleres de carros está armada para bahía y repuesto de carro, no para este banco de trabajo."
  - q: ¿El bot puede decir que un repuesto aplica?
    a: "No. ManyChat y ChatGPT no ven la moto. Si el código o el año no están confirmados en tu ficha, la respuesta es que el taller lo revisa. La guía de repuestos usa la misma regla para el mostrador."
  - q: ¿Puedo publicar la cara del cliente con el casco?
    a: "Solo con permiso. Si no lo tienes, la foto es de la moto o del trabajo, sin rostro y sin placa. El perfil de Google no autoriza esa imagen por ti."
  - q: ¿Una skill o un agente calcula el próximo servicio?
    a: "No. El plazo lo escribes tú en la ficha y n8n solo lo manda. La nota de Agent Skills del 22 oct 2026 explica que una skill es un procedimiento ajeno o tuyo, no un odómetro."
related:
  - talleres-de-carros
  - venta-de-repuestos
  - llanterias
  - responder-whatsapp
---

El taller de motos se llena de audios: cuándo entra, qué pieza es y cuándo queda. Si eso no está escrito, cada respuesta se arma de nuevo. La herramienta redacta. No diagnostica.

## La cita

ManyChat puede pedir la moto y el día. La hora la confirma quien ve el banco. WhatsApp Business tiene el horario y el servicio por escrito, para no cotizar de memoria a las once de la noche.

## La pieza

La ficha de Notion dice qué hay y para qué moto ya está confirmado. ChatGPT no cruza un catálogo. Si el código no coincide, no se promete. El detalle del mostrador está en la [guía de repuestos](/herramientas-ia/para/venta-de-repuestos).

## El aviso y el regreso

El mensaje de listo sale del estado. El recordatorio de después usa el plazo que anotaste, una sola vez. El cobro del mensaje de servicio está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio). Si el tablero vive en Notion, la [nota de créditos del 19 oct](/herramientas-ia/noticias/notion-agentes-24-horas) importa: no dejes un agente toda la noche sobre los clientes. El cambio para quien ya es cliente es el 2 nov 2026.

## La foto

El perfil de Google lleva fotos del trabajo, no de la placa ni de un rostro sin permiso. Una publicación no dice que la moto quedó nueva.

## Lo que no hace esta página

No reemplaza el programa del taller ni el de un carro. Si el negocio es un taller de carros, sigue en esa [guía](/herramientas-ia/para/talleres-de-carros). Si es detailing, el antes y después está en la [guía de detailing](/herramientas-ia/para/detailing). Si el trabajo es la llanta y no la moto completa, sigue en la [guía de llanterías](/herramientas-ia/para/llanterias).
