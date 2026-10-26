---
checked: 2026-10-26
task: "Treble es una plataforma de WhatsApp. La portada, abierta el 26 oct 2026, describe flujos de conversación, el pase a una persona, envíos a una audiencia y funciones de IA: responder preguntas frecuentes con una base que tú subes, calificar la intención, redactar con Treble Boost y resumir chats. La pregunta frecuente dice que es un proveedor oficial de la API de WhatsApp, no la app gratis del celular, que el soporte está en español, portugués e inglés, y que integra de forma nativa HubSpot y Salesforce. Para una llantería o un taller la tarea es concreta. Las respuestas que ya escribiste pueden salir solas y el precio, la medida o el reclamo pasan a una persona. No es la app que ya tienes en el teléfono ni un reemplazo de la tarifa de Meta."
useCase:
  sector: taller
  title: El flujo de la llantería con pase a una persona
  steps:
    - "Confirma que el negocio ya usa la API. Si todavía contestas desde la app gratis, esta ficha no es el primer paso."
    - "Carga solo respuestas que ya están escritas: horario, medidas que sí hay y lo que no instalas."
    - "El flujo pide la medida y pasa a una persona si no está en la lista, si hay un precio o si hay un reclamo."
    - "No dejes que el asistente confirme una equivalencia de medidas ni una hora de entrega."
    - "Lee un día de chats antes de ampliar el flujo. Un resumen no autoriza una respuesta que no estaba en la base."
limits:
  - "El 26 oct 2026 la página https://treble.ai/treble-pricing/ respondió que el contenido está protegido por contraseña. No hay en esta ficha un precio del plan de Treble. Quien lo necesite lo pide en esa página, no lo inventa."
  - "Treble dice ser la API, no WhatsApp Business gratis. La tarifa del mensaje de servicio de Meta, desde el 1 oct 2026, sigue aplicando. La nota de WhatsApp de este directorio la resume. Treble no la absorbe."
  - "La pregunta frecuente dice que Instagram todavía no está. No armes el flujo como si el mismo número contestara esa red."
  - "La portada muestra un porcentaje de respuesta en cero, como un contador que no cargó. No es una tasa y no se publica."
  - "Puede contestar con la base que subiste y también, según la pregunta frecuente, llevar conversaciones como asistente. En un taller, una medida o un repuesto que no está escrito no se improvisa. El pase a una persona está en la propia portada."
alternatives:
  - tool: whatsapp-business
    when: "si el volumen todavía cabe en el teléfono y no necesitas la API ni varios agentes al mismo tiempo."
  - tool: manychat
    when: "si el flujo que ya tienes está en ManyChat y solo falta la respuesta escrita, no otra plataforma de WhatsApp."
  - tool: respond-io
    when: "si la bandeja de varios canales ya está en Respond.io y el encargo es no abrir una cuenta nueva esta semana."
beforePaying:
  - "Escribe diez respuestas reales del negocio y pruébalas antes de mirar un plan. Si el flujo inventa una medida, el plan no lo corrige solo."
  - "No anotes un precio de Treble a partir de esta ficha. El 26 oct 2026 la página de precios pedía contraseña."
  - "Suma, aparte, el costo de los mensajes de Meta. Automatizar no lo quita. La nota de este directorio está fechada con la FAQ oficial."
  - "No conectes HubSpot o Salesforce el primer día si el cliente todavía vive en una libreta. La integración nativa que Treble anuncia no ordena un dato que no existe."
sources:
  - name: la portada de Treble
    url: https://treble.ai/
  - name: la página de precios de Treble
    url: https://treble.ai/treble-pricing/
---
