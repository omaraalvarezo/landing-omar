---
checked: 2026-10-16
task: "n8n sirve para automatizar procesos entre aplicaciones con flujos visuales y agentes de IA, y escribir código en JavaScript o Python cuando hace falta. Se usa en su nube o alojado en tu propio servidor; según su documentación, sin llave de licencia corre como la edición Community gratuita. La tarea en una pyme: los avisos y las tareas repetidas que hoy dependen de que alguien se acuerde."
useCase:
  sector: taller
  title: El aviso de carro listo sin que nadie lo escriba
  steps:
    - "Define el disparador en tu sistema: el carro pasa a estado listo. Si ese estado no existe en ningún lado, empieza por ahí."
    - "La app o la hoja redacta el mensaje con placa, trabajo y hora de entrega, y n8n solo lo entrega. En mi taller esa es la regla: la app decide y redacta; n8n entrega."
    - "Usa el nodo de WhatsApp Business Cloud para enviar una plantilla aprobada."
    - "Revisa las ejecuciones en el panel antes de soltarlo para todos los carros."
    - "Para lo sensible, como un cobro, pon una aprobación humana dentro del flujo."
limits:
  - "En la nube no hay plan gratuito, solo prueba. La edición Community es gratis, pero el servidor, las actualizaciones y los respaldos corren por tu cuenta."
  - "Cada plan de nube tiene tope de ejecuciones al mes, de ejecuciones simultáneas y de duración, y pueden aplicar cargos por exceso."
  - "Pide más criterio técnico que Zapier o Make. Si nadie en el equipo lo puede mantener, el flujo se cae y nadie se entera."
  - "Las funciones de Business y Enterprise en un servidor propio requieren llave de licencia."
alternatives:
  - tool: zapier
    when: "si quieres algo listo, sin servidor y con flujos simples."
  - tool: make
    when: "si prefieres un mapa visual alojado por ellos."
beforePaying:
  - "Usa la prueba de la nube para medir cuántas ejecuciones consume tu flujo real al mes; ahí se cobra por ejecución, no por usuario."
  - "Si piensas alojarlo tú, decide quién responde por el servidor y los respaldos antes de instalar."
  - "Lee la página de licencia si vas a usar la edición Community en algo comercial."
  - "Confirma que tu cuenta de WhatsApp Business Cloud y tus plantillas están aprobadas antes de construir el flujo."
sources:
  - name: n8n.io
    url: https://n8n.io
  - name: los precios de n8n
    url: https://n8n.io/pricing/
  - name: la documentación de alojamiento
    url: https://docs.n8n.io/hosting/
  - name: el nodo de WhatsApp Business Cloud
    url: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.whatsapp/
---
