---
checked: 2026-10-16
task: "Make sirve para automatizar procesos entre aplicaciones viendo el flujo como un mapa: cada módulo es una app y las líneas muestran por dónde pasa el dato. Su sitio dice que el flujo se arma arrastrando módulos o pidiéndolo con un texto, y que trae agentes de IA y monitoreo de ejecuciones. La tarea en una pyme: un proceso con varias ramas que hoy depende de que alguien se acuerde."
useCase:
  sector: taller
  title: Del carro entregado al recordatorio de mantenimiento
  steps:
    - "Toma la hoja de Google Sheets donde el taller anota cada entrega: placa, trabajo, fecha y teléfono. El disparador es la fila nueva."
    - "Agrega una rama por tipo de trabajo. El plazo de cada recordatorio lo define el taller, no el flujo."
    - "Usa el módulo de WhatsApp Business Cloud para enviar una plantilla aprobada con nombre, placa y trabajo."
    - "Corre el escenario con un carro de prueba y revisa cada módulo en el historial antes de activarlo para todos."
    - "Pon una alerta para cuando el escenario falle. Sin alerta, te enteras cuando el cliente no vuelve."
limits:
  - "Según la página de precios, el plan gratuito trae 1.000 créditos al mes; si se acaban, los escenarios se detienen."
  - "Un mapa visual no arregla un proceso mal definido. Escríbelo primero en una hoja."
  - "Para WhatsApp necesitas una cuenta de WhatsApp Business Cloud y plantillas aprobadas. Make envía el mensaje; no consigue el permiso."
  - "En lo que revisé, la página de precios no detalla cuántos escenarios activos ni qué intervalo trae el gratis. Pregúntalo antes de diseñar."
alternatives:
  - tool: zapier
    when: "si el flujo es simple: un disparador y una acción."
  - tool: n8n
    when: "si quieres alojarlo en tu propio servidor y controlar dónde vive el dato."
beforePaying:
  - "Calcula cuántos créditos gasta una ejecución completa y multiplícalo por las veces que va a correr al mes."
  - "Revisa qué pasa si te quedas sin créditos a mitad de mes y si puedes comprar más."
  - "Confirma que cada app que necesitas tiene módulo verificado por Make."
  - "Deja escrito quién arregla el escenario cuando falle. Si no hay un nombre, no pagues."
sources:
  - name: make.com
    url: https://www.make.com
  - name: los precios de Make
    url: https://www.make.com/en/pricing
  - name: el módulo de Google Sheets
    url: https://www.make.com/en/integrations/google-sheets
  - name: el módulo de WhatsApp Business Cloud
    url: https://www.make.com/en/integrations/whatsapp-business-cloud
---
