---
checked: 2026-10-16
task: "Gemini Notebook, que se llamaba NotebookLM hasta el 16 jul 2026, sirve para preguntarle a tus propios documentos. Subes PDF, páginas web, videos de YouTube, audio o archivos de Google Docs y Slides, y las respuestas citan el pasaje de tu fuente. También arma resúmenes, guías de estudio y resúmenes en audio. La tarea en una pyme: que el equipo consulte el manual sin llamarte a ti."
useCase:
  sector: coworking
  title: El reglamento del espacio que cualquiera del equipo puede consultar
  steps:
    - "Sube a un mismo cuaderno el reglamento, la lista de precios vigente y las preguntas frecuentes del espacio."
    - "Haz las diez preguntas que más te hace el equipo: cancelaciones, invitados, horarios y facturación."
    - "Abre cada cita y confirma que la respuesta sale del documento correcto y de la versión vigente."
    - "Comparte el cuaderno con la recepción. Si una respuesta sale mal, se corrige el documento, no el chat."
    - "Cuando cambie un precio, reemplaza la fuente vieja. Dos versiones en el cuaderno son dos respuestas."
limits:
  - "Su ayuda oficial dice que puede cometer errores y que puede no responder si la información no está en tus fuentes."
  - "De una página web solo importa el texto: no imágenes, videos incrustados ni páginas con muro de pago. De YouTube solo entra la transcripción."
  - "Las cuentas gratuitas tienen un tope de fuentes por cuaderno, según la ayuda oficial."
  - "Si la cuenta es de una organización, puede que el administrador tenga que activarlo primero."
alternatives:
  - tool: claude
    when: "si quieres redactar algo nuevo a partir de los documentos, no solo consultarlos."
  - tool: gemini
    when: "si prefieres un asistente general que además lea tus archivos."
  - tool: notion
    when: "si lo que falta es tener el manual escrito y ordenado en un solo lugar."
beforePaying:
  - "Arma un cuaderno con tus documentos reales en la versión gratuita antes de mirar planes."
  - "Revisa cuántas fuentes y qué funciones trae tu plan; algunas funciones nuevas llegan primero a Google AI Pro y Ultra."
  - "Según su ayuda, tus datos no se usan para entrenar salvo que envíes comentarios. Tenlo presente antes de calificar respuestas que tengan datos de clientes."
  - "Busca el producto como Gemini Notebook cuando leas precios y ayuda; los artículos viejos usan el nombre anterior."
sources:
  - name: la ayuda de Gemini Notebook
    url: https://support.google.com/gemininotebook/answer/16164461
  - name: la ayuda sobre fuentes
    url: https://support.google.com/gemininotebook/answer/16215270
  - name: el anuncio del cambio de nombre
    url: https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/
---
