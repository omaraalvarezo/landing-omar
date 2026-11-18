---
title: "IA para panaderías: encargos del día"
description: "En una panadería, el encargo y la foto tienen que ser de lo que sí se horneó hoy. WhatsApp, ChatGPT y LanguageTool arman y revisan el mensaje; Photoroom limpia la foto real; Notion guarda la lista y el precio. No inventa una producción, un pan que no salió ni un precio distinto."
published: 2026-11-16
updated: 2026-11-18
tools:
  - whatsapp-business
  - chatgpt
  - languagetool
  - photoroom
  - notion
  - google-business-profile
guides:
  - tool: whatsapp-business
    steps:
      - "Deja tres respuestas: horario, cómo encargar y qué sí hay hoy. El precio sale de la lista del día, no de un mensaje de la semana pasada."
      - "El encargo pide producto, cantidad y hora de recojo. Si falta uno, no se confirma."
      - "Cuando el pedido está listo, el aviso lo manda una persona o un estado ya marcado. No prometas una hora que la producción no dio."
      - "No confirmes un producto que no está en la lista de hoy. Si se acabó, se dice."
  - tool: chatgpt
    steps:
      - "Pega la lista de hoy, con precios. Pide el texto del estado y la respuesta a un encargo."
      - "Si el producto no está en la lista, la respuesta dice que no hay. No ofrezcas uno parecido con otro precio."
      - "El texto de la publicación nombra solo lo que sí salió del horno. No agregues una cantidad."
      - "Borra cualquier descuento o combo que no hayas escrito tú."
  - tool: languagetool
    steps:
      - "Pega el mensaje ya escrito, en español, antes de enviarlo. La portada dice que la versión gratis marca ortografía y puntuación simple."
      - "Lee cada sugerencia. Si cambia un producto, un precio o una hora, no la aceptes."
      - "El parafraseo con IA, que la misma portada ofrece, no reescribe el menú. El menú lo escribes tú."
      - "La ayuda del 24 mar 2026 lista el Premium en euros. No anotes ese monto como si fuera el cobro en pesos de hoy sin volver a abrir la página."
  - tool: photoroom
    steps:
      - "Fotografía el pan o el pastel que sí vas a vender hoy. No generes uno."
      - "Quita el fondo y compara la forma con la foto original. Si se ve otro producto, no publiques esa salida."
      - "No pegues el precio en la imagen. Mañana la lista puede cambiar."
      - "Si se ve el nombre de un cliente en una torta, no publiques la foto sin permiso."
  - tool: notion
    steps:
      - "Una lista del día: producto, cantidad que sí hay y precio. Cuando llega a cero, el estado deja de ser disponible."
      - "Una ficha por encargo: cliente, producto, cantidad, hora y si ya se pagó. El pagado lo marcas tú."
      - "Antes de confirmar por WhatsApp, mira la lista. Si está en cero, no se promete."
      - "La hora de recojo la escribes tú. Sin esa hora, no hay mensaje de listo."
  - tool: google-business-profile
    steps:
      - "Revisa hoy horario, dirección y teléfono. Un festivo con el horario de ayer manda gente a un local cerrado."
      - "Sube fotos de lo que sí hay. No subas una imagen generada de un producto que no vendes."
      - "Pide la reseña al entregar el encargo, con el enlace del perfil."
      - "Contesta una reseña con el producto que sí vendiste. No ofrezcas un producto gratis a cambio de la estrella."
prompts:
  - title: Respuesta a un encargo
    text: "Eres el asistente de una panadería. Responde en máximo 55 palabras usando solo esta lista de hoy, con precios. Si el producto o la cantidad no alcanzan, dilo. No ofrezcas un reemplazo ni un descuento. Pide hora de recojo si falta. Lista: [pegar]. Pedido: [pegar]."
  - title: Texto de lo que sí hay
    text: "Escribe un texto de máximo 30 palabras para publicar lo que sí se horneó hoy. No pongas cantidades ni precios que no estén en el dato. No nombres clientes. Lista: [pegar]."
  - title: Aviso de listo
    text: "Escribe un WhatsApp de máximo 35 palabras para avisar que el encargo ya se puede recoger. Usa solo nombre, producto y hora. No pidas reseña en el mismo mensaje. Datos: [pegar]."
  - title: Lo que se acabó
    text: "Con esta lista de productos y cantidades, dime solo cuáles están en cero. No recomiendes sustitutos ni cambies precios. No armes una producción. Lista: [pegar]."
faqs:
  - q: ¿El chat puede decir que todavía hay de un producto?
    a: "Solo si la lista de hoy, en Notion, dice que hay. Si la cantidad está en cero o no está escrita, la respuesta es que no hay. Un mensaje de ayer no cuenta."
  - q: ¿LanguageTool corrige el precio si está mal escrito?
    a: "No dejes que una sugerencia cambie un número. Sirve para ortografía y puntuación del mensaje que ya escribiste. El precio se contrasta con la lista antes de enviar."
  - q: ¿Puedo publicar una foto generada si el pan se acabó?
    a: "No. La foto es de lo que sí vas a vender. Photoroom limpia el fondo de esa foto. Una imagen generada es otro producto."
  - q: ¿El perfil de Google muestra el menú del día solo?
    a: "No. El horario y las fotos se cargan en el perfil. Lo que hay hoy vive en tu lista y en el mensaje. Si el horario de un festivo cambió, se cambia en el perfil antes de publicar."
related:
  - restaurantes
  - contenido-para-redes
  - cobrar
  - ferreterias
---

La panadería se traba en el «¿todavía hay?» y en la foto de algo que ya no está. Si se confirma un encargo con la lista de ayer, a la hora de recojo no hay producto.

## La lista de hoy

WhatsApp responde con esa lista. ChatGPT redacta el encargo y el aviso. Notion marca el cero. Sin cantidad escrita, no se promete. [LanguageTool](/herramientas-ia/languagetool) revisa el español del mensaje y no toca el precio.

## La foto

Photoroom limpia el fondo de lo que sí salió del horno. El precio no va pegado en la imagen. El nombre de un cliente en una torta no se publica sin permiso. Una imagen generada con [Recraft](/herramientas-ia/recraft) es otro producto: el plan gratis, leído el 16 nov 2026, no tiene uso comercial. La [guía de contenido](/herramientas-ia/para/contenido-para-redes) usa la misma regla para una pieza de redes. Los prompts para no ofrecer lo que no está en la lista están en la [tanda del 16 nov](/herramientas-ia/prompts/roles-2026-11-16).

## El cobro

Un encargo pagado se marca en la ficha. El recordatorio de un saldo usa el monto que tú escribiste. La [guía para cobrar](/herramientas-ia/para/cobrar) no calcula intereses ni ofrece un descuento que no diste.

## Lo que no hace esta página

No hornea, no cuenta la producción y no arma el menú de mañana. Si el negocio es un restaurante con mesa, sigue en la [guía de restaurantes](/herramientas-ia/para/restaurantes). Si vendes abarrotes y no pan del día, sigue en la [guía de ferreterías](/herramientas-ia/para/ferreterias) solo como ejemplo de estante: el precio sigue viviendo en la lista, no en la foto.
