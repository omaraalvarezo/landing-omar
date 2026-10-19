---
title: IA para cobrar
description: "Cobrar una factura vencida es un mensaje con el monto que ya está escrito, no un descuento inventado. Esta guía usa ChatGPT, Notion, WhatsApp Business, n8n, HubSpot y Jotform. No calcula intereses ni promete un plazo que no diste."
published: 2026-10-19
tools:
  - chatgpt
  - notion
  - whatsapp-business
  - n8n
  - hubspot
  - jotform
guides:
  - tool: chatgpt
    steps:
      - "Pega número de factura, monto, fecha de vencimiento y qué incluye. El borrador no puede traer otro número."
      - "Pide un mensaje corto, sin amenaza y sin un descuento. El tono lo revisas tú."
      - "Si el cliente dice que ya pagó, el texto pide el comprobante. No da la factura por saldada."
      - "No le pidas al chat que calcule intereses, retenciones ni un plazo nuevo."
  - tool: notion
    steps:
      - "Una fila por factura: cliente, número, monto, vencimiento y estado. Los estados caben en por vencer, vencida, comprobante recibido y pagada."
      - "El mensaje de cobro solo sale si el estado es vencida y el monto está escrito."
      - "Cuando llega el comprobante, el estado pasa a comprobante recibido. Pagada la marca una persona después de ver el dinero."
      - "No guardes ahí la clave de la pasarela ni el número completo de una tarjeta."
  - tool: whatsapp-business
    steps:
      - "El recordatorio nombra la factura y el monto. No manda un audio genérico de “me debes”."
      - "Una respuesta rápida cubre los medios de pago que ya usas. No agrega uno nuevo en el chat."
      - "Si contestan fuera de hora, el mensaje de ausencia no confirma que el pago entró."
      - "No reenvíes el mismo cobro todos los días. Define un solo seguimiento y cúmplelo."
  - tool: n8n
    steps:
      - "El flujo lee la fecha de vencimiento que está en Notion. No inventa una regla de días."
      - "Manda un solo mensaje al día siguiente del vencimiento, con número y monto."
      - "Si el estado ya es comprobante recibido o pagada, el flujo no escribe."
      - "Prueba con una factura vieja y un número tuyo antes de activarlo para los clientes."
  - tool: hubspot
    steps:
      - "Úsalo si el cliente ya vive en el CRM. Si no, no abras HubSpot solo para tres facturas: Notion alcanza."
      - "El recordatorio sale del negocio o del ticket que ya tiene el monto, no de un agente que adivina la deuda."
      - "La página de Agent Hub, consultada el 19 oct 2026, dice que está incluido en Starter, Professional y Enterprise, y que los agentes a medida consumen créditos. No publica un precio en dólares."
      - "Una persona revisa el mensaje antes de que un agente lo envíe a un cliente."
  - tool: jotform
    steps:
      - "El formulario pide el número de factura y una foto del comprobante. No pide la clave del banco."
      - "El PDF del envío queda junto a la fila de Notion. Alguien lo abre antes de marcar pagada."
      - "No uses el formulario para cobrar la tarjeta. Solo recibe el aviso de que el cliente dice haber pagado."
      - "Revisa que el enlace del formulario sea el de tu cuenta, no una copia vieja con otro monto fijo."
prompts:
  - title: Primer recordatorio
    text: "Escribe un mensaje de cobro de máximo 60 palabras. Usa solo estos datos: nombre, número de factura, monto y fecha de vencimiento. Pide confirmar el pago o avisar si hay un error. No calcules intereses, no ofrezcas descuento y no amenaces. Datos: [pegar]."
  - title: Dice que ya pagó
    text: "El cliente dice que ya pagó esta factura. Escribe una respuesta de máximo 45 palabras que pida el comprobante y el número de factura. No confirmes que el pago entró y no cierres la cuenta. Mensaje: [pegar]. Factura: [pegar]."
  - title: Lo que no se cobra todavía
    text: "Con esta lista de facturas (número, vencimiento y estado), dime solo cuáles están vencidas y no tienen estado de comprobante recibido ni pagada. No sumes montos y no propongas un descuento. Lista: [pegar]."
  - title: Nota interna del comprobante
    text: "Resume este comprobante en cuatro líneas: fecha, monto, referencia y qué no se lee. No des la factura por pagada y no completes un número que no esté en el texto. Comprobante: [pegar]."
faqs:
  - q: ¿El mensaje puede incluir intereses de mora?
    a: "Solo si ese cálculo ya lo hizo quien lleva las cuentas y te lo pasó por escrito. ChatGPT y n8n no liquidan intereses ni retenciones. Si el monto no está en la fila, no va en el WhatsApp."
  - q: ¿n8n puede marcar la factura como pagada?
    a: "No en esta guía. Puede dejar de escribir cuando el estado ya cambió. Pasar a pagada lo hace una persona después de ver el dinero, no al recibir la foto del comprobante."
  - q: ¿Hace falta HubSpot para cobrar?
    a: "No. HubSpot entra si el cliente ya está en ese CRM. Agent Hub, según su página del 19 oct 2026, viene en Starter, Professional y Enterprise, y los agentes a medida gastan créditos. Para una lista corta, Notion y un flujo de n8n bastan."
  - q: ¿Esto reemplaza al contador?
    a: "No. La guía arma el recordatorio y ordena el comprobante. No presenta impuestos, no emite la factura electrónica y no decide una conciliación. Quien lleva las cuentas sigue cerrando el mes."
related:
  - armar-una-propuesta
  - responder-whatsapp
  - talleres-de-carros
---

Cobrar se vuelve incómodo cuando el mensaje no tiene el número de la factura. La herramienta no lo recuerda por ti. Lo copia de una fila.

## El dato

Notion guarda cliente, número, monto, vencimiento y estado. ChatGPT redacta con eso. Si falta el monto, no hay mensaje. Un descuento, si existe, lo escribes tú en un mensaje distinto, no en el recordatorio automático.

## El envío

n8n manda un solo aviso al día siguiente del vencimiento y se calla si ya hay comprobante o si está pagada. WhatsApp Business lleva el texto. El costo del mensaje de servicio, si aplica, está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio): la herramienta no lo absorbe.

## El comprobante

Jotform recibe la foto y el número. Una persona mira el PDF antes de marcar pagada. El caso de Itaú, en la [nota del banco](/herramientas-ia/casos/itau-chat-con-personas), insiste en lo mismo a otra escala: el chat no cierra solo lo que una persona tiene que ver.

## Lo que no hace esta página

No calcula mora, no reemplaza la factura electrónica y no enciende los agentes de HubSpot el primer día. Si todavía no hay una propuesta escrita, empieza por la [guía para armar una propuesta](/herramientas-ia/para/armar-una-propuesta).
