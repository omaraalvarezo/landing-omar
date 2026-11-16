---
title: IA para aire acondicionado de carros
description: "En el aire acondicionado del carro, la falla la confirma el taller, no el chat. Esta guía usa WhatsApp, ChatGPT, Photoroom, Notion y el perfil de Google. No diagnostica una fuga ni inventa un gas."
published: 2026-11-16
tools:
  - whatsapp-business
  - chatgpt
  - photoroom
  - notion
  - google-business-profile
guides:
  - tool: whatsapp-business
    steps:
      - "Deja tres respuestas: horario, qué revisas y cómo pedir la cita. El precio de la revisión sale de tu lista."
      - "Pide el síntoma como lo dijo el cliente y el vehículo. No confirmes la causa."
      - "El presupuesto largo sale después de la revisión, escrito por una persona. El saludo no trae un monto de reparación."
      - "El aviso de listo dice el trabajo que sí se hizo. No agregues un servicio que no está en la orden."
  - tool: chatgpt
    steps:
      - "Pega el síntoma, el vehículo y lo que ya mediste. Pide un texto para explicar la revisión, no un diagnóstico."
      - "El precio de la revisión y el de la reparación los escribes tú, por separado. Si el segundo no está, no aparece."
      - "Incluye lo que la revisión no cubre, si tú lo escribiste. Si no, el borrador no lo agrega."
      - "Borra cualquier tipo de gas, presión o pieza que no hayas confirmado en el taller."
  - tool: photoroom
    steps:
      - "Si vas a mostrar un trabajo, fotografía el carro o la pieza que sí revisaste. No bajes una imagen de un catálogo."
      - "Quita el fondo y compara. Si una etiqueta o un conector se reescribió, no publiques esa salida."
      - "No pegues el precio en la foto. El precio de la reparación cambia con lo que encontraste."
      - "No muestres la placa completa si el cliente no lo autorizó."
  - tool: notion
    steps:
      - "Una ficha por carro: cliente, vehículo, síntoma, lo que mediste, precio de revisión, precio de reparación si ya existe y estado."
      - "Los estados caben en citado, en revisión, esperando autorización y listo. El cliente autoriza el segundo precio antes de seguir."
      - "Si no mediste, la celda queda vacía. No se llena con un texto del chat."
      - "El mensaje de listo sale cuando el estado es listo y el trabajo escrito es el que sí se hizo."
  - tool: google-business-profile
    steps:
      - "Revisa hoy horario, dirección y teléfono. Una reseña no corrige un horario viejo."
      - "Sube fotos del local o de un trabajo con permiso. No publiques una pieza que no es tuya."
      - "Pide la reseña al entregar el carro, con el enlace del perfil."
      - "Contesta con el servicio que sí hiciste. No diagnostiques el carro de otra persona en público."
prompts:
  - title: Explicar la revisión, sin causa
    text: "Eres el asistente de un taller de aire acondicionado automotriz. Escribe un mensaje de máximo 70 palabras para explicar la revisión. Usa solo el síntoma y lo que ya medí. No nombres un gas, una presión ni una pieza que no esté en el dato. No pongas el precio de la reparación si no te lo pasé. Datos: [pegar]."
  - title: Pedir autorización
    text: "Escribe un WhatsApp de máximo 55 palabras para pedir autorización de la reparación. Usa solo el trabajo y el precio que te pego. Di que sin respuesta no se sigue. No ofrezcas un descuento ni un plazo que no esté en el dato. Datos: [pegar]."
  - title: Aviso de listo
    text: "Escribe un mensaje de máximo 40 palabras para avisar que el carro ya se puede retirar. Usa solo nombre y el trabajo que sí se hizo. No pidas reseña en el mismo mensaje. Datos: [pegar]."
  - title: Lo que no incluye la revisión
    text: "Con esta lista de lo que sí incluye la revisión, escribe dos frases de lo que no incluye, solo si yo lo marqué. No agregues fallas ni precios. Lista: [pegar]."
faqs:
  - q: ¿El chat puede decir si hay una fuga?
    a: "No. La fuga, el gas y la presión los confirma quien midió en el taller. El borrador solo puede repetir lo que pegaste. Si la celda de Notion está vacía, el mensaje no inventa la causa."
  - q: ¿El precio de la revisión es el de la reparación?
    a: "No. Van separados. El segundo se escribe después de revisar y se manda a autorización. Sin ese monto escrito, el mensaje no lo trae."
  - q: ¿Puedo publicar una foto del sistema si la etiqueta cambió?
    a: "No. Photoroom limpia el fondo. Si un número de la etiqueta cambió, esa imagen no se publica. La foto sin editar es mejor."
  - q: ¿El perfil de Google explica la falla del cliente?
    a: "No. El perfil lleva horario, dirección y fotos del negocio. La falla de un carro se contesta en privado, con lo que ya mediste, no en una reseña."
related:
  - talleres-de-carros
  - talleres-de-motos
  - venta-de-repuestos
  - pintura-automotriz
---

El aire acondicionado se traba cuando el primer mensaje ya trae la causa. El cliente dijo que no enfría y el chat nombró un gas, una fuga o un compresor que nadie midió.

## La revisión

WhatsApp pide el síntoma y da el precio de la revisión, el de tu lista. ChatGPT explica esa revisión con lo que ya mediste. La reparación es otro precio y otra autorización. Notion no deja pasar a listo si esa autorización no está.

## La foto

Photoroom solo limpia el fondo de una pieza real. Una etiqueta cambiada no se publica. El precio no va en la imagen. La [guía de repuestos](/herramientas-ia/para/venta-de-repuestos) usa la misma regla para el código de una pieza.

## Lo que no hace esta página

No carga gas, no mide presión y no autoriza el gasto. Si el trabajo es el motor y no el clima, sigue en la [guía de talleres](/herramientas-ia/para/talleres-de-carros). Si es la moto, sigue en la [guía de motos](/herramientas-ia/para/talleres-de-motos).
