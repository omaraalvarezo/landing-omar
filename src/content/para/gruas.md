---
title: IA para grúas y auxilio en carretera
description: "En una grúa, la dirección y la hora las confirma quien va en camino. Esta guía usa WhatsApp, ChatGPT, Notion, el perfil de Google y Jotform. No calcula un tiempo de llegada ni un precio de kilómetro que no escribiste."
published: 2026-11-16
tools:
  - whatsapp-business
  - chatgpt
  - notion
  - google-business-profile
  - jotform
guides:
  - tool: whatsapp-business
    steps:
      - "Deja tres respuestas: zona que sí cubres, qué datos pides y cómo se cobra. El precio de salida sale de tu lista."
      - "Pide ubicación, vehículo y si está en un lugar de riesgo. No prometas minutos."
      - "La hora de llegada la escribe quien despacha, cuando ya sabe qué unidad va. El mensaje automático no la inventa."
      - "Si la zona no está en tu lista, dilo en la primera respuesta. No armes una ruta que no cubres."
  - tool: chatgpt
    steps:
      - "Pega la zona, el tipo de servicio y el precio que tú usas hoy. Pide un mensaje corto para pedir la ubicación."
      - "Si falta la dirección, el borrador pide el punto. No calcules kilómetros ni un tiempo."
      - "Separa el mensaje de salida y el de llegada. El segundo solo sale cuando la unidad ya está allá."
      - "Borra cualquier tarifa por kilómetro que no esté en el dato que pegaste."
  - tool: notion
    steps:
      - "Una ficha por servicio: cliente, punto, vehículo, unidad, precio que tú pusiste y estado."
      - "Los estados caben en pedido, en camino y entregado. El estado lo cambia quien despacha."
      - "La hora prometida se escribe a mano cuando la unidad sale. Una celda vacía no se llena con un promedio."
      - "Al cerrar, anota si el precio cambió y por qué. Esa nota es tuya, no del chat."
  - tool: google-business-profile
    steps:
      - "Revisa hoy teléfono, horario y la zona que atiendes. Un perfil con la ciudad mal puesta manda el servicio al lugar que no es."
      - "No publiques la ubicación en vivo del cliente. El perfil es del negocio, no del auxilio de esa persona."
      - "Pide la reseña cuando el vehículo ya quedó entregado, no mientras está en la plataforma."
      - "Contesta una reseña con el servicio que sí hiciste. No ofrezcas un descuento a cambio de la estrella."
  - tool: jotform
    steps:
      - "Arma un formulario para quien no está en la vía: nombre, vehículo, punto de recogida y punto de entrega."
      - "El precio no se calcula en el formulario. Una persona lo confirma antes de salir."
      - "No pidas la placa completa si con el tipo de vehículo te basta para mandar la unidad."
      - "El PDF del envío es el pedido. No es una orden de salida hasta que alguien lo marca en Notion."
prompts:
  - title: Pedir el punto, sin minutos
    text: "Eres el asistente de una grúa. Escribe un WhatsApp de máximo 50 palabras para pedir la ubicación y el tipo de vehículo. Usa solo esta zona y estos precios. No calcules minutos ni kilómetros. Si el punto no está en la zona, dilo. Zona y precios: [pegar]. Mensaje del cliente: [pegar]."
  - title: Aviso de que ya salió
    text: "Escribe un mensaje de máximo 40 palabras para decir que la unidad ya salió. Usa solo el nombre de la unidad y la hora que te paso. No prometas una hora de llegada distinta. Datos: [pegar]."
  - title: Cierre del servicio
    text: "Escribe un mensaje de máximo 40 palabras para decir que el vehículo ya quedó en el punto de entrega. No pidas reseña en el mismo mensaje y no cambies el precio. Datos: [pegar]."
  - title: Lo que no cubres
    text: "Con esta lista de zonas y servicios, escribe una frase de lo que no haces, solo con lo que marqué. No inventes una tarifa ni un tiempo de respuesta. Lista: [pegar]."
faqs:
  - q: ¿El chat puede calcular en cuántos minutos llega la grúa?
    a: "No. La hora la escribe quien despacha, cuando ya sabe qué unidad va y desde dónde sale. Un borrador que pone minutos sin ese dato se borra antes de enviar."
  - q: ¿Jotform manda la grúa sola?
    a: "No. Junta el punto de recogida y el de entrega. La salida se marca en Notion cuando una persona confirmó el precio y la unidad. Sin esa marca, no hay servicio."
  - q: ¿Puedo publicar en Google la ubicación del cliente?
    a: "No. El perfil muestra los datos del negocio. El punto del auxilio queda en la ficha interna, no en una foto pública ni en una reseña."
  - q: ¿Sirve si el cliente solo manda un audio?
    a: "El audio no reemplaza el punto. La respuesta pide la ubicación por escrito o un pin. Hasta que ese punto está, no hay hora de salida."
related:
  - talleres-de-carros
  - llanterias
  - venta-de-carros-usados
  - talleres-de-motos
---

La grúa se traba cuando cada quien dice una hora distinta. El cliente escucha un audio, el despacho no vio el punto y la unidad sale hacia el lugar que no es.

## El punto

WhatsApp pide la ubicación y el vehículo. ChatGPT redacta con tu zona y tu precio. Si el punto no está en la zona, se dice en la primera respuesta. No hay minutos inventados.

## La salida

Notion guarda la unidad y el estado. La hora se escribe cuando la unidad sale. Jotform sirve para un traslado que no es de emergencia: el PDF no es la orden. El perfil de Google no muestra el punto del cliente.

## Lo que no hace esta página

No despacha, no cotiza por kilómetro y no reemplaza el juicio de quien está en la vía. Si el carro ya está en el taller, sigue en la [guía de talleres](/herramientas-ia/para/talleres-de-carros). Si el trabajo es la llanta y no el remolque, sigue en la [guía de llanterías](/herramientas-ia/para/llanterias).
