---
title: IA para restaurantes pequeños
description: "En un restaurante chico, el menú del día, la reserva y la foto del plato se pierden en el chat. Esta guía usa ChatGPT, Canva, Photoroom, WhatsApp Business, el perfil de Google y Notion. No inventa un plato que no está en la carta."
published: 2026-10-19
tools:
  - chatgpt
  - canva
  - photoroom
  - whatsapp-business
  - google-business-profile
  - notion
guides:
  - tool: chatgpt
    steps:
      - "Pega la carta de hoy, con los platos que sí hay y el precio que decidiste. Lo que se acabó no entra."
      - "Pide el texto del estado y el mensaje de reserva por separado. Los dos usan esa carta, no una de la semana pasada."
      - "Si preguntan por un plato que no está, la respuesta es que no está. No ofrezcas un reemplazo que no escribiste."
      - "No pidas al chat que invente alérgenos. Si no están en la ficha, no van en el mensaje."
  - tool: canva
    steps:
      - "Una pieza del menú del día con los platos y precios de la carta que pegaste. Nada más."
      - "La foto es del plato que salió en tu cocina. Si no la tienes, el texto va solo."
      - "Revisa que el precio de la pieza y el del mensaje de WhatsApp sean el mismo."
      - "No dejes el menú de ayer en la misma plantilla. Duplica y borra."
  - tool: photoroom
    steps:
      - "Quita el fondo de una foto real del plato. No pidas un plato generado que no serviste."
      - "Mira el color y la porción. Si la imagen muestra más comida de la que sale al cliente, no la uses."
      - "Una foto por plato que vas a anunciar. El resto de la carta puede ir en texto."
      - "El plan Pro publicado el 19 oct 2026 cuesta USD 7,50 al mes con cobro anual. No cuentes con exportaciones ilimitadas en ese plan: la página lista 1.000 al mes."
  - tool: whatsapp-business
    steps:
      - "La respuesta rápida del menú se actualiza cuando cambia la carta. Una respuesta vieja es un plato que ya no hay."
      - "La reserva pide nombre, personas y hora. La confirmación la manda una persona si ese turno ya está lleno."
      - "El mensaje de ausencia dice el horario de cocina, no solo el de la puerta."
      - "No mandes el menú a toda la lista cada día si no quieres pagar mensajes de más. El cobro de Meta va por su lado."
  - tool: google-business-profile
    steps:
      - "Horario de cocina, dirección y teléfono. Si el domingo solo hay desayuno, el perfil lo dice."
      - "Las fotos son de tus platos y de tu sala. Una foto de banco de imágenes no es el local."
      - "Pide la reseña al pagar, con el enlace. No la redactes."
      - "Si cambias el cierre por un feriado, cámbialo en el perfil antes de que te busquen."
  - tool: notion
    steps:
      - "Una página de carta vigente: plato, precio y si hay. La pieza y el WhatsApp salen de ahí."
      - "Anota reservas del día con nombre, personas y hora. Es una lista, no un motor de mesas."
      - "Si un plato se acaba a media tarde, se marca en la carta antes de contestar el siguiente chat."
      - "Los alérgenos, si los publicas, viven en esa ficha y los revisa quien cocina. El cuaderno no los investiga."
prompts:
  - title: Menú del día
    text: "Escribe el texto de un estado para un restaurante, de máximo 60 palabras, usando solo esta carta. Lista los platos y el precio tal como están. No agregues platos, no cambies precios y no inventes que un plato es el más pedido. Carta: [pegar]."
  - title: Reserva sin confirmar de más
    text: "Escribe una respuesta de WhatsApp de máximo 45 palabras a un pedido de reserva. Pide nombre, número de personas y hora si falta alguno. Di que la confirmación la da el restaurante. No prometas mesa ni un tiempo de espera. Mensaje del cliente: [pegar]."
  - title: Se acabó el plato
    text: "El cliente pide un plato que ya no está en esta carta. Responde en máximo 35 palabras que hoy no está y ofrece solo los platos que sí aparecen. No inventes un sustituto. Carta: [pegar]. Pedido: [pegar]."
  - title: Pie de la foto del plato
    text: "Escribe un texto de máximo 20 palabras para la foto de un plato. Usa el nombre y, si está en la ficha, el precio. No describas ingredientes que no te pasé. Ficha: [pegar]."
faqs:
  - q: ¿Puedo anunciar un plato con una foto generada?
    a: "No en esta guía. Photoroom limpia la foto del plato que salió de tu cocina. Una imagen de un plato que no serviste es otra carta. Canva no corrige ese dato."
  - q: ¿El bot puede confirmar la mesa?
    a: "Puede tomar nombre, personas y hora. La confirmación la da quien ve el salón. WhatsApp no sabe si esa hora ya tiene una mesa de ocho."
  - q: ¿Qué hago con los alérgenos?
    a: "Solo se publican si están escritos en la ficha y quien cocina los sostiene. Ni ChatGPT ni Notion los deducen de un nombre de plato. Si no están, el mensaje dice que consulten en el local."
  - q: ¿El perfil de Google muestra el menú solo?
    a: "Muestra lo que cargaste: horario, fotos y la ficha del negocio. La carta del día sigue saliendo de tu página de Notion y del mensaje. La nota del 15 oct 2026 explica que el enlace en la búsqueda puede verse más, no que Google arme tu menú."
related:
  - contenido-para-redes
  - atender-clientes
  - barberias
---

El restaurante chico no necesita un agente que invente especialidades. Necesita que la carta de hoy sea la misma en el chat, en la pieza y en la puerta.

## La carta

Notion guarda plato, precio y si hay. ChatGPT solo reordena esa lista para el estado. Si se acabó el pescado, se marca antes de contestar. Una respuesta rápida vieja en WhatsApp Business es un pedido que no vas a poder servir.

## La foto

Photoroom quita el fondo de una foto real. El plan Pro, en la página consultada el 19 oct 2026, cuesta USD 7,50 al mes con cobro anual e incluye 1.000 exportaciones al mes. Canva pone el nombre y el precio al lado. Si la porción de la foto no es la que sale al cliente, esa foto no se publica.

## La reserva

El flujo pide los datos. La mesa la confirma una persona. El perfil de Google lleva el horario de cocina, que no siempre es el de la puerta. Desde el 15 oct 2026, la [nota de búsqueda](/herramientas-ia/noticias/busqueda-google-enlaces) importa porque el enlace a tu ficha puede quedar más arriba: con más razón el horario tiene que estar bien.

## Lo que no hace esta página

No arma recetas, no calcula el costo del plato y no reemplaza el sistema de caja. Si el problema es cobrar una cuenta vencida de un cliente de eventos, sigue en la [guía para cobrar](/herramientas-ia/para/cobrar).
