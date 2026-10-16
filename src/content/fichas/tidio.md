---
checked: 2026-10-16
task: "Tidio sirve para atender el chat de tu sitio web y juntar en una sola bandeja los mensajes de correo, Instagram, Messenger y WhatsApp. Su agente de IA, Lyro, responde con el contenido de tu sitio y de tu centro de ayuda y, cuando no está seguro, pasa la conversación a tu equipo. La tarea en una pyme: contestar las preguntas repetidas del sitio sin tener a alguien pegado al chat."
useCase:
  sector: coworking
  title: Las preguntas del sitio a las nueve de la noche
  steps:
    - "Escribe una página de preguntas frecuentes real: horarios, planes, cómo reservar, parqueadero y wifi. Lyro solo responde con lo que le das."
    - "Conecta esa página como fuente de Lyro y haz tú las diez preguntas más comunes."
    - "Define qué pasa cuando Lyro no sabe: pide el correo o el WhatsApp y la recepción responde al otro día."
    - "Revisa la bandeja cada mañana y agrega a las preguntas frecuentes lo que Lyro no supo contestar."
    - "No le dejes cerrar reservas ni confirmar precios especiales. Eso lo hace una persona."
limits:
  - "Lyro trabaja solo con el contenido y la guía que tú le das. Si tu sitio está desactualizado, sus respuestas también."
  - "Según la página de precios, el plan gratuito no trae horarios de atención, lista de visitantes en vivo ni la opción de quitar la marca de Tidio."
  - "Las conversaciones gratis de Lyro del plan gratuito son un cupo inicial que no se renueva."
  - "Se cobra por conversaciones atendidas por personas, por conversaciones de Lyro y por visitantes alcanzados con Flows. Son tres medidores distintos."
alternatives:
  - tool: intercom-fin
    when: "si el volumen de soporte es alto y ya usas un helpdesk como Zendesk o HubSpot."
  - tool: manychat
    when: "si las preguntas llegan por comentarios y mensajes de Instagram o TikTok."
  - tool: respond-io
    when: "si WhatsApp es el canal principal y no el chat del sitio."
beforePaying:
  - "Usa la prueba de siete días con tus preguntas reales y cuenta cuántas resolvió Lyro sin ayuda."
  - "Mira cuál de los tres medidores vas a gastar más y cotiza con ese."
  - "Pregunta si conectar WhatsApp tiene costos aparte del plan; la página de precios no lo dice."
  - "Confirma que tu sitio tiene visitas suficientes. Un chat que nadie abre no ahorra nada."
sources:
  - name: tidio.com
    url: https://www.tidio.com
  - name: los precios de Tidio
    url: https://www.tidio.com/pricing/
  - name: la página de Lyro
    url: https://www.tidio.com/lyro/
---
