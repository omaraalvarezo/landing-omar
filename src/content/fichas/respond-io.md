---
checked: 2026-10-16
task: "Respond.io sirve para atender WhatsApp, Instagram, Facebook Messenger, TikTok y correo desde una sola bandeja de equipo, con la API oficial de WhatsApp. Sus agentes de IA responden consultas, califican prospectos, reparten conversaciones y agendan citas, y la plataforma sincroniza los contactos con tu CRM. La tarea en una pyme: que varias personas atiendan el mismo WhatsApp sin pisarse."
useCase:
  sector: taller
  title: Un solo WhatsApp del taller atendido por tres personas
  steps:
    - "Conecta el número a tu cuenta de Meta Business por la API oficial; respond.io es proveedor oficial y explica el registro en su página de WhatsApp."
    - "Crea reglas de reparto: cotizaciones a ventas, estado del carro a recepción y garantías al jefe de taller."
    - "Etiqueta cada conversación con la placa para encontrarla cuando el cliente vuelva."
    - "Al principio, deja que el agente de IA responda solo horarios y ubicación. Lo demás lo atiende una persona."
    - "Mide cuánto tarda la primera respuesta antes y después. Si no bajó, el reparto está mal."
limits:
  - "No tiene plan gratuito permanente; tiene una prueba de siete días sin tarjeta, según la página de precios."
  - "Las tarifas de WhatsApp no están incluidas en ninguna suscripción. Meta las cobra por uso y tú recargas saldo en la plataforma."
  - "Se cobra por contactos activos del mes más usuarios. Un envío masivo sube los contactos activos."
  - "Necesitas una cuenta de Meta Business y pasar por el registro con un proveedor oficial. No se conecta en cinco minutos."
alternatives:
  - tool: manychat
    when: "si el volumen es bajo y la conversación empieza en Instagram o TikTok."
  - tool: tidio
    when: "si las consultas llegan sobre todo por el chat del sitio web."
  - tool: hubspot
    when: "si lo que falta es el seguimiento comercial de cada contacto, no la bandeja."
beforePaying:
  - "Usa la prueba de siete días con el equipo real y un volumen real de mensajes."
  - "Calcula tus contactos activos del mes contando a quien te escribe y a quien le escribes."
  - "Suma al plan lo que cobra Meta por los mensajes de WhatsApp: son dos facturas."
  - "Revisa qué plan incluye los agentes de IA y los envíos masivos; la página de precios los ubica desde Growth."
sources:
  - name: respond.io
    url: https://respond.io
  - name: los precios de respond.io
    url: https://respond.io/pricing
  - name: la página de WhatsApp Business API
    url: https://respond.io/whatsapp-business-api
---
