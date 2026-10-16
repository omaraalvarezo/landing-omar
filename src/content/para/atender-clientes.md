---
title: IA para atender clientes
description: Atender clientes con IA sirve para las preguntas que ya tienen respuesta escrita. Tidio e Intercom Fin cubren el chat de soporte; Respond.io y ManyChat entran cuando el mensaje llega por WhatsApp u otra red. Alguien del equipo sigue cerrando lo demás.
published: 2026-10-16
tools:
  - tidio
  - intercom-fin
  - respond-io
  - manychat
steps:
  - Saca de los últimos chats las diez preguntas que más se repiten y escríbelas como las diría el cliente.
  - Escribe la respuesta corta que hoy das tú. Si no cabe en un párrafo, todavía no es una respuesta de bot.
  - "Elige un solo canal para la prueba: el chat del sitio o WhatsApp. No los dos a la vez."
  - "Pon una regla de pase a humano: pago, queja, cambio de pedido y cualquier pregunta que no esté en la lista."
  - Lee una vez por semana lo que el bot contestó solo. Borra la respuesta que estuvo floja.
prompt: 'Eres el filtro de soporte de una pyme de servicios. Con esta pregunta del cliente, responde en máximo 60 palabras usando solo los datos que te pego abajo. Si el dato no está, di “esto lo revisa una persona” y no completes el hueco. Datos: """pega horario, precios públicos y política de cambios""". Pregunta: """pega la pregunta""".'
faqs:
  - q: ¿Un agente de soporte reemplaza a quien atiende?
    a: No. En esta lista, Tidio e Intercom Fin ayudan a contestar lo repetido. El reclamo, el cobro y la excepción siguen con una persona que pueda decidir.
  - q: ¿Empiezo por el chat del sitio o por WhatsApp?
    a: Por el canal donde hoy se atasca la respuesta. Si es el sitio, mira Tidio o Intercom Fin. Si es WhatsApp, mira la guía de WhatsApp y las fichas de ManyChat y Respond.io.
  - q: ¿Puedo cargar toda la política de la empresa de una vez?
    a: Puedes, y suele salir peor. Empieza por las diez preguntas reales. Una política larga sin ejemplos hace que el bot invente un tono seguro sobre un caso que no vio.
related:
  - responder-whatsapp
---

## El problema

La atención se rompe cuando la misma respuesta vive en la cabeza de una persona. El cliente pregunta fuera de horario y al día siguiente el dueño reescribe lo que ya dijo ayer.

La herramienta no crea la política. La política tiene que existir antes, en frases cortas, con los casos que se escalan.
