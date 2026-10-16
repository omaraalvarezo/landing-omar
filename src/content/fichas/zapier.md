---
checked: 2026-10-16
task: "Zapier sirve para conectar aplicaciones que no se hablan entre sí. Cuando pasa algo en una (llega un formulario, entra un correo, aparece una fila nueva), hace una acción en otra. Su sitio dice que conecta más de 9.000 apps y que también arma agentes de IA. La tarea en una pyme: que un dato capturado una vez no se tenga que volver a escribir a mano."
useCase:
  sector: coworking
  title: La reserva del formulario que llega sola a la hoja del equipo
  steps:
    - "Elige un solo disparador: un formulario de reserva lleno. No empieces con diez flujos."
    - "La acción es una fila nueva en Google Sheets con nombre, fecha, puesto y teléfono. Esa hoja es la que mira la recepción."
    - "Prueba con una reserva tuya y confirma que la fila llegó completa."
    - "Si quieres avisar por WhatsApp Business, ojo: la página de esa integración dice que el mensaje libre solo sale dentro de las 24 horas siguientes al último mensaje del cliente. Fuera de esa ventana va con plantilla."
    - "Revisa cada semana el historial de ejecuciones. Un flujo que falla en silencio es peor que no tenerlo."
limits:
  - "Según la página de precios, en el plan gratuito los flujos son de dos pasos, un disparador y una acción, y hay un tope de tareas al mes; al llegar al tope se detienen."
  - "No decide nada por ti. Si el dato entra mal en el formulario, sale mal en la hoja."
  - "Que un envío salga bien no garantiza que el mensaje llegue. La misma página de WhatsApp lo advierte."
  - "Cada acción cuenta en el consumo. Un flujo mal pensado se come el plan en una semana."
alternatives:
  - tool: make
    when: "si el flujo tiene varias ramas y prefieres verlo como un mapa visual."
  - tool: n8n
    when: "si quieres alojarlo tú y controlar dónde corre cada flujo."
beforePaying:
  - "Arma el primer flujo en el plan gratuito y déjalo correr dos semanas. Si nadie extraña el trabajo manual, ese no era el cuello de botella."
  - "Cuenta cuántas tareas consumiste en la prueba y compáralo con el plan que vas a pagar."
  - "Revisa si las apps que necesitas son premium. En el plan gratuito no entran."
  - "Si el flujo toca WhatsApp, confirma con tu proveedor de WhatsApp Business cuánto cuestan las plantillas, aparte de Zapier."
sources:
  - name: zapier.com
    url: https://zapier.com
  - name: los precios de Zapier
    url: https://zapier.com/pricing
  - name: la integración con WhatsApp Business
    url: https://zapier.com/apps/whatsapp-business/integrations
  - name: la integración con Google Sheets
    url: https://zapier.com/apps/google-sheets/integrations
---
