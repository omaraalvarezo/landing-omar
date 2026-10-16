---
checked: 2026-10-16
task: "Perplexity sirve para buscar con respuestas que enlazan sus fuentes. En vez de abrir diez pestañas, haces la pregunta y lees un resumen con las páginas de donde salió, y puedes seguir preguntando en el mismo hilo. Para una pyme la tarea es investigar antes de decidir: un proveedor, una norma, un competidor o un cliente antes de la reunión."
useCase:
  sector: taller
  title: Revisar a un proveedor de insumos antes de hacerle un pedido
  steps:
    - "Pregunta por el proveedor con nombre y ciudad: qué vende, desde cuándo opera y qué se dice de sus entregas."
    - "Abre las fuentes que cita. Si la respuesta sale de un foro o de la página del mismo proveedor, pésala distinto."
    - "Pide la ficha técnica del producto y compárala con la que te mandó el vendedor."
    - "Haz una pregunta de seguimiento con lo que no quedó claro, en el mismo hilo."
    - "Anota en tu hoja de proveedores el enlace de la fuente, no solo la conclusión."
limits:
  - "Que cite una fuente no la vuelve cierta. Su centro de ayuda reconoce respuestas con información desactualizada o equivocada."
  - "El plan gratuito trae búsquedas básicas casi ilimitadas pero muy pocas búsquedas Pro, subidas de archivos limitadas y no genera imágenes, según su centro de ayuda."
  - "En los planes individuales, la retención de datos para mejorar la IA viene activada por defecto. Se apaga en las preferencias y solo cuenta desde ese momento."
  - "No sabe lo que no está publicado: precios negociados, existencias reales o la reputación local que corre de boca en boca."
alternatives:
  - tool: chatgpt
    when: "si lo que necesitas es redactar a partir de lo que ya encontraste."
  - tool: notebooklm
    when: "si ya tienes los documentos y quieres preguntarle solo a ellos."
  - tool: gemini
    when: "si la investigación sale de archivos que tienes en Drive."
beforePaying:
  - "Haz tu búsqueda más frecuente diez veces en el plan gratuito y cuenta cuántas veces se te acabaron las búsquedas Pro."
  - "Revisa en el centro de ayuda qué trae Pro frente al gratis: modelos, subidas de archivos y generación de imágenes."
  - "Apaga la retención de datos si vas a buscar sobre clientes o proveedores con nombre propio."
  - "Si son varias personas, mira Enterprise Pro, que según su política no se usa para entrenar."
sources:
  - name: la ayuda sobre planes
    url: https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you
  - name: la ayuda sobre datos
    url: https://intercom.help/perplexity-ai/en/articles/11564572-data-collection-at-perplexity
  - name: la ayuda sobre respuestas incorrectas
    url: https://www.perplexity.ai/help-center/en/articles/10354902-how-can-i-report-incorrect-or-inaccurate-answers
---
