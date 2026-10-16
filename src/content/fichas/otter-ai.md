---
checked: 2026-10-16
task: "Otter.ai sirve para grabar y transcribir reuniones, distinguir quién habló y sacar un resumen con decisiones y tareas. Se conecta a Zoom, Google Meet y Microsoft Teams, y también transcribe archivos de audio o video. Su ayuda oficial dice que transcribe inglés, español, francés, alemán, japonés y chino simplificado. La tarea en una pyme: que la reunión con el cliente termine con un acta y no con un «¿qué fue lo que quedamos?»."
useCase:
  sector: servicios
  title: El acta de la reunión con el cliente, el mismo día
  steps:
    - "Avisa al inicio que la reunión se graba y pide permiso. Si el cliente no acepta, no se graba."
    - "Conecta Otter a la reunión de Zoom, Meet o Teams desde tu calendario."
    - "Al terminar, revisa el resumen: decisiones, tareas y responsables. Corrige nombres y cifras."
    - "Manda el acta corregida al cliente el mismo día, con tareas y fechas."
    - "Guarda la transcripción en la carpeta o la ficha del cliente, no perdida en el correo."
limits:
  - "En el plan gratuito cada conversación tiene un límite de duración y hay un tope de minutos al mes. Revisa la cifra del día en su página de precios."
  - "En el plan gratuito la exportación es más limitada; PDF y Word aparecen desde los planes pagos, según la página de precios."
  - "Transcribe en español, pero confirma en su ayuda cómo se elige el idioma antes de grabar."
  - "Una transcripción no reemplaza la confirmación por escrito de lo acordado. El acta la envía y la firma alguien."
alternatives:
  - tool: fireflies-ai
    when: "si quieres buscar en todas tus reuniones y conectar más herramientas de trabajo."
  - tool: notebooklm
    when: "si quieres preguntarle a varias reuniones grabadas como si fueran documentos."
  - tool: descript
    when: "si la grabación se va a editar para publicarla."
beforePaying:
  - "Graba tres reuniones reales en español y cuenta los errores de la transcripción."
  - "Compara la duración de tus reuniones con el límite por conversación del plan gratuito."
  - "Revisa en qué plan está el formato de exportación que necesitas."
  - "Pregunta dónde se guardan las grabaciones y quién puede verlas antes de grabar a un cliente."
sources:
  - name: otter.ai
    url: https://otter.ai
  - name: los precios de Otter
    url: https://otter.ai/pricing
  - name: la ayuda de idiomas
    url: https://help.otter.ai/hc/en-us/articles/360047247414-Supported-languages
---
