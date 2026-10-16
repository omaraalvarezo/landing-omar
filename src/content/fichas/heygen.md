---
checked: 2026-10-16
task: "HeyGen sirve para hacer video sin grabarte cada vez. Según su sitio, genera video a partir de un texto, una imagen o un audio con un avatar presentador, traduce y dobla videos con sincronización de labios, y convierte un PowerPoint o un PDF en un video narrado. La tarea útil en una pyme es explicar lo que repites todos los días: cómo funciona un servicio, una política o un proceso."
useCase:
  sector: coworking
  title: La bienvenida que la recepción repite a cada persona nueva
  steps:
    - "Escribe lo que la recepción explica a cada persona que llega por primera vez: horarios, wifi, salas, reglas de ruido y cómo pagar. Máximo 150 palabras."
    - "Si esas reglas ya están en un PDF o una presentación, súbelo y pide el video narrado en vez de empezar de cero."
    - "Elige un avatar de la biblioteca. Si quieres usar tu propia cara, el sitio pide verificación de identidad en cámara de la persona que aparece."
    - "Revisa la pronunciación de nombres, direcciones y precios. Si un dato cambia cada mes, no lo metas en el video."
    - "Manda el enlace por WhatsApp cuando alguien reserva. La recepción resuelve dudas; no repite el discurso."
limits:
  - "No reemplaza a quien recibe al cliente. Explica lo que no cambia; las excepciones las resuelve una persona."
  - "Un avatar no muestra el lugar real. Para el recorrido del espacio, graba con el celular."
  - "El plan gratuito tiene límites de cantidad y duración de videos. El 16 oct 2026 la página de precios y la de traducción no daban la misma cifra: confírmala tú."
  - "Usar la cara o la voz de un empleado exige su consentimiento. Pídelo por escrito antes de crear el avatar."
alternatives:
  - tool: synthesia
    when: "si el video es de formación interna y lo vas a publicar en una plataforma de cursos o como paquete SCORM."
  - tool: capcut
    when: "si prefieres grabar con el celular y solo necesitas editar y subtitular."
  - tool: elevenlabs
    when: "si basta con la voz en off, sin presentador en pantalla."
beforePaying:
  - "Haz un video completo con el plan gratuito y muéstraselo a dos clientes. Si les suena a robot, no pagues todavía."
  - "Revisa si el plan gratuito exporta con marca de agua y si el plan que te interesa la quita."
  - "Confirma en la página de precios del día cuántos videos y minutos de traducción trae el plan cada mes."
  - "Lee qué pasa con tu avatar y tu clon de voz si cancelas la suscripción."
sources:
  - name: heygen.com
    url: https://www.heygen.com
  - name: los precios de HeyGen
    url: https://www.heygen.com/pricing
  - name: la página de traducción
    url: https://www.heygen.com/translate
---
