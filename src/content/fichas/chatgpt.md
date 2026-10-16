---
checked: 2026-10-16
task: "ChatGPT sirve para el trabajo de escritorio que hoy haces a mano: redactar un borrador, resumir un documento, ordenar los datos de una hoja o pensar en voz alta antes de decidir. La ayuda oficial de OpenAI dice que el plan gratuito busca en la web, analiza datos, recibe imágenes y archivos y crea imágenes. Para una pyme la tarea de entrada es la cotización y el mensaje al cliente: tú pones el dato y ChatGPT pone el orden."
useCase:
  sector: taller
  title: La cotización que sale en cinco minutos y no inventa la falla
  steps:
    - "Pega lo que dijo el cliente, el vehículo y lo que el taller ya revisó. No le pidas un diagnóstico: el chat no vio el carro."
    - "Pide dos textos: la cotización de una página y un mensaje de WhatsApp de menos de 70 palabras. El precio lo escribes tú."
    - "Escribe en el mismo encargo qué no incluye el trabajo. Si no lo dijiste, el borrador no debe agregarlo."
    - "Lee el resultado completo y borra cualquier causa, plazo o repuesto que no hayas confirmado."
    - "Guarda el encargo que funcionó y úsalo como plantilla. Al quinto carro ya no lo piensas."
limits:
  - "Se equivoca con seguridad. Cifras, normas y datos técnicos los confirmas tú antes de mandarlos."
  - "En los planes individuales (gratis, Plus y Pro), OpenAI puede usar tus conversaciones para entrenar sus modelos. Se apaga en los controles de datos de la configuración, y los chats temporales no se usan."
  - "En el plan gratuito, subir archivos, crear imágenes y analizar datos tienen límites de uso aparte del chat, y en algunos países aparecen anuncios, según la ayuda oficial."
  - "No conoce tus precios, tu inventario ni a tus clientes. Lo que no le pegues, lo adivina."
alternatives:
  - tool: claude
    when: "si el trabajo es leer documentos largos o escribir con más cuidado."
  - tool: gemini
    when: "si tu equipo vive en Gmail, Docs y Drive."
  - tool: perplexity
    when: "si necesitas una respuesta con las fuentes enlazadas, no un borrador."
beforePaying:
  - "Usa el plan gratuito dos semanas para una sola tarea. Si no ahorraste tiempo que puedas medir, Plus no lo cambia."
  - "Si vas a pegar datos de clientes, apaga el uso para entrenamiento o mira los planes de empresa, que según OpenAI no entrenan con tus datos por defecto."
  - "Revisa en la página de planes qué límites sube cada uno. La ayuda advierte que el modelo por defecto y los límites cambian con el tiempo."
  - "Si son varias personas, compara un plan de equipo contra cuentas sueltas: con cuentas sueltas cada quien maneja sus datos a su manera."
sources:
  - name: la ayuda sobre el plan gratuito
    url: https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq
  - name: la ayuda sobre uso de datos
    url: https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance
---
