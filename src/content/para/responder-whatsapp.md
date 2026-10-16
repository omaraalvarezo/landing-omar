---
title: IA para responder WhatsApp
description: Responder WhatsApp con IA exige la API de WhatsApp Business y a una persona para lo que el bot no cierra. En este directorio, ManyChat y Respond.io cubren ese canal; Tidio e Intercom Fin entran si el cliente también escribe en la web.
published: 2026-10-16
tools:
  - manychat
  - respond-io
  - tidio
  - intercom-fin
steps:
  - Separa los mensajes que se repiten cada semana de los que cambian un precio, una fecha o un reclamo.
  - Conecta un número de WhatsApp Business por la API. El celular personal no es el canal de la empresa.
  - "Carga solo respuestas que ya hayas aprobado: horario, dirección, qué no vendes y a quién se escala."
  - Deja una salida a una persona cuando el mensaje pide un descuento, un dato de pago o habla de un error.
  - Mide cuántos mensajes de servicio salen al mes antes de automatizar. La tarifa de Meta corre por su lado.
prompt: 'Clasifica este mensaje de WhatsApp de un cliente. Responde solo con una de estas etiquetas: horario, precio, pedido, queja, otro. Si es precio, queja u otro, di que lo debe ver una persona y no inventes la respuesta. Mensaje: """pega aquí el mensaje""".'
faqs:
  - q: ¿El bot puede contestar desde el WhatsApp personal?
    a: No conviene. El canal de la empresa va por WhatsApp Business y, si quieres automatizar a escala, por su API. El número personal se mezcla con la vida privada y no deja el historial en la herramienta.
  - q: ¿Responder dentro de la ventana de 24 horas sigue siendo gratis?
    a: La FAQ oficial de WhatsApp Business, consultada el 16 oct 2026, dice que desde el 1 oct 2026 los mensajes de servicio se cobran por mensaje. Cada número de negocio tiene 1.000 gratis al mes. Del 1.001 en adelante aplica la tarifa publicada. Esta página no copia esa tarifa por país.
  - q: ¿Qué herramienta elijo si también me escriben en Instagram y en la web?
    a: ManyChat está en el directorio para Instagram, WhatsApp y Messenger. Respond.io está como bandeja omnicanal con API de WhatsApp. Tidio es el chat de la web. No hace falta prender las cuatro el mismo día.
related:
  - atender-clientes
  - talleres-de-carros
---

## El problema

El dueño contesta el mismo “¿siguen abiertos?” entre un pedido y una queja. El bot sirve para lo primero. Lo segundo, si sale solo, cobra mal o promete algo que la empresa no da.

WhatsApp no es un chat pegado al sitio. Meta cobra el uso de la plataforma. Antes de elegir herramienta, mira el volumen del número. La [nota del 16 oct](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio) resume el cambio del 1 oct 2026 y enlaza la FAQ oficial.
