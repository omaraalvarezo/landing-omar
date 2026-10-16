---
title: IA para detailing
description: "En detailing, la cita, la cotización del paquete y la foto de antes y después son el trabajo que el cliente ve. Esta guía usa CapCut, Canva, ChatGPT, ManyChat, Notion y n8n. No inventa reseñas ni publica un antes que no fotografiaste."
published: "2026-10-16"
priority: 1
tools:
  - capcut
  - canva
  - chatgpt
  - manychat
  - notion
  - n8n
guides:
  - tool: capcut
    steps:
      - "Graba el antes y el después del mismo ángulo y con una luz parecida. Si la luz cambia tanto que parece otro carro, no sirve."
      - "Corta entre 15 y 20 segundos: la zona, el trabajo que sí hiciste y el detalle final. Sin un texto largo encima."
      - "No aceleres el corte hasta esconder el estado real de la pintura o del interior."
      - "Guarda el archivo con la fecha y el vehículo. Esa pieza también alimenta el pedido de reseña."
  - tool: canva
    steps:
      - "Arma una pieza con dos fotos lado a lado y el nombre del paquete que sí se vendió."
      - "Poco texto: el trabajo y, si ya está confirmada, la próxima cita. No dejes un precio viejo pegado en la imagen."
      - "Una pieza por trabajo bueno. Un collage de diez carros no se lee."
      - "Exporta el tamaño de la red donde lo vas a publicar. No rediseñes la marca del cliente."
  - tool: chatgpt
    steps:
      - "Ten escritos los paquetes con lo que incluyen y lo que no. Pega esa lista antes de pedir una cotización."
      - "Si el cliente pide algo que no está en la lista, la respuesta es que el taller lo confirma. El chat no arma un paquete nuevo."
      - "Pide por separado el mensaje de WhatsApp, el texto de la pieza y el pedido de reseña."
      - "El precio sale de tu lista. Si no lo pegaste, el borrador tiene que decir que está por definir."
  - tool: manychat
    steps:
      - "El flujo de cita pide vehículo, paquete y día. La hora la confirma una persona si ese día ya tiene carros."
      - "El día anterior sale un recordatorio con la hora y las condiciones que el taller ya exige para recibir el carro."
      - "Al entregar, el mensaje lleva la foto y el pedido de reseña. Una vez. No una cadena de insistencia."
      - "Revisa el volumen del número. El cobro de los mensajes de servicio, desde el 1 oct 2026, está en la nota de WhatsApp del directorio."
  - tool: notion
    steps:
      - "Una ficha por cita: cliente, vehículo, paquete, productos usados y fecha. Ahí queda también dónde está la foto."
      - "Una lista de producto: nombre, unidades y mínimo. Cuando baja del mínimo, se compra. No es un kardex."
      - "Antes de prometer un paquete, mira si el producto está en esa lista."
      - "El plazo del siguiente contacto se anota en la ficha. Sin ese número, no hay recordatorio automático."
  - tool: n8n
    steps:
      - "Al cerrar la cita en Notion, el flujo toma la fecha y el plazo que el taller escribió para ese paquete."
      - "El mensaje recuerda qué se hizo y cómo pedir la siguiente cita. No promete una duración que no esté en la ficha."
      - "Si la persona no contesta, el flujo no insiste más de una vez."
      - "Prueba con una cita vieja del negocio antes de activarlo para todos."
prompts:
  - title: Cotización de un paquete
    text: "Eres el asistente de un negocio de detailing. Escribe una cotización corta usando solo esta lista de paquetes y este pedido del cliente. Di qué incluye, qué no incluye y el precio si está en la lista. Si el pedido no cabe en ningún paquete, dilo y no inventes uno. No prometas duración de un producto. Lista: [pegar]. Pedido: [pegar]."
  - title: Texto de antes y después
    text: "Escribe el texto de una publicación de antes y después para detailing, de máximo 40 palabras. Usa solo estos datos: zona del vehículo, trabajo realizado y fecha. No digas que la pintura quedó nueva, no pongas un precio y no agregues una cifra de brillo. Datos: [pegar]."
  - title: Recordatorio de la cita
    text: "Escribe un recordatorio de cita de detailing para el día anterior, de máximo 50 palabras. Incluye nombre, hora, paquete y las condiciones de recepción que yo te paso. No cambies la hora ni ofrezcas un servicio extra. Datos: [pegar]."
  - title: Pedido de reseña con la foto
    text: "Escribe un mensaje de WhatsApp para pedir una reseña después de entregar un trabajo de detailing. Menciona el paquete en una frase y di que adjunto la foto del después. Deja [enlace] si no te lo pasé. No escribas la reseña por el cliente ni ofrezcas un descuento por opinar. Paquete: [pegar]."
  - title: Aviso de producto bajo
    text: "Con esta lista de productos de detailing (nombre, unidades y mínimo), dime solo cuáles están en el mínimo o por debajo. No recomiendes marcas ni cantidades de compra. No conviertas eso en una orden de compra. Lista: [pegar]."
faqs:
  - q: ¿La foto de antes puede ser de otro carro parecido?
    a: "No. El antes y el después son del mismo vehículo, del mismo ángulo. Si no fotografiaste el antes, esa publicación no sale. Canva y CapCut arman la pieza; no fabrican el estado inicial."
  - q: ¿El bot puede llenar la agenda solo?
    a: "Puede tomar vehículo, paquete y día. La hora la confirma una persona cuando el día ya tiene carros. ManyChat no ve la bahía ni el tiempo real de ese trabajo."
  - q: ¿Puedo prometer cuánto dura una protección?
    a: "Solo si esa duración está escrita en tu ficha y estás dispuesto a sostenerla. El chat y el flujo de n8n no la calculan. Si no está en el dato, no va en el mensaje."
  - q: ¿Por dónde empiezo si hoy todo sale por WhatsApp?
    a: "Por dos piezas: la lista de paquetes en ChatGPT y el flujo de cita en ManyChat. CapCut, Canva, Notion y n8n entran cuando la cita y la cotización ya no se pierden."
  - q: ¿Esto también le sirve a un taller mecánico?
    a: "El seguimiento y la cotización sí. El antes y después pesa más en detailing. La guía de talleres de carros está armada para bahía, repuesto y mantenimiento, no para estética."
related:
  - talleres-de-carros
  - contenido-para-redes
---

El detailing se vende con lo que el cliente puede ver: la hora de la cita, el paquete por escrito y la diferencia entre el antes y el después. Lo demás es adorno. Si el paquete no está definido, el chat inventa uno. Si no hay foto del antes, la pieza miente.

## Agenda

El día se llena de audios. ManyChat puede preguntar vehículo, paquete y día. Alguien del negocio confirma la hora, porque el flujo no sabe cuánto tarda ese carro ni si la bahía ya está tomada.

## Cotización

Los paquetes se escriben antes, con lo que incluyen y lo que no. ChatGPT solo reordena esa lista frente al pedido del cliente. Un precio que no esté en la lista no se publica.

## Seguimiento por WhatsApp

El recordatorio del día anterior y el mensaje de entrega son los dos que más se repiten. Salen del dato de la cita, no de un texto nuevo cada vez. El cobro de los mensajes de servicio está en la [nota de WhatsApp](/herramientas-ia/noticias/whatsapp-mensajes-de-servicio).

## Recordatorio del trabajo hecho

Algunos paquetes piden un contacto después. El plazo lo anotas tú en la ficha. n8n manda un solo mensaje con ese plazo. No promete que una protección dure un tiempo que no escribiste.

## Reseñas

Se piden al entregar, con la foto del después y el enlace. El cliente escribe la reseña. El prompt no la redacta por él ni ofrece un descuento por opinar.

## Antes y después

CapCut para el video corto. Canva para las dos fotos juntas. Mismo carro, mismo ángulo, trabajo nombrado. La [guía de contenido para redes](/herramientas-ia/para/contenido-para-redes) sirve si después quieres el formato de la publicación, no para reemplazar la foto.

## Inventario

La lista es el producto, cuántas unidades hay y el mínimo para comprar. Notion alcanza para no agendar un paquete cuyo producto está en cero. No es el sistema contable del negocio.

## Lo que no hace esta página

No elige química, no mide pintura y no llena la agenda por arte de magia. Si el negocio es un taller mecánico y el cuello de botella es el repuesto o la bahía, sigue en la [guía de talleres de carros](/herramientas-ia/para/talleres-de-carros).
