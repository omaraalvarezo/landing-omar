---
checked: 2026-10-16
task: "Gemini sirve para el trabajo que ya vive en la cuenta de Google de tu empresa. La app gratuita genera y edita imágenes, hace investigaciones largas con Deep Research y recibe archivos: documentos, hojas de cálculo, fotos y audio. Según la página de planes, Gemini dentro de Gmail y Docs llega con Google AI Pro. La tarea en una pyme: resumir, comparar y redactar sin sacar la información de Drive."
useCase:
  sector: coworking
  title: Comparar las cotizaciones de tres proveedores de café
  steps:
    - "Sube las tres cotizaciones en PDF a un mismo chat. La ayuda oficial permite hasta 10 archivos por mensaje."
    - "Pide una tabla: precio por kilo, pedido mínimo, plazo de entrega, forma de pago y lo que no incluye cada uno."
    - "Pide que marque los datos que no encontró en el documento en vez de suponerlos."
    - "Revisa cada fila contra el PDF original. La tabla te ahorra leer; no te ahorra verificar."
    - "La decisión la tomas con la tabla y con lo que ya sabes del proveedor, no con la recomendación del chat."
limits:
  - "La ayuda oficial advierte que puede presentar información inexacta como si fuera cierta, y que no se use para consejo médico, legal o financiero."
  - "Algunos chats los revisan personas, y esos se guardan hasta tres años aunque borres tu actividad. No pegues datos sensibles de clientes."
  - "Gemini dentro de Gmail y Docs no está en el plan gratuito y solo funciona en ciertos idiomas, según la página de planes."
  - "Los límites de uso dependen de la función y de lo larga que sea la conversación, y se reinician por ventanas de tiempo."
alternatives:
  - tool: chatgpt
    when: "si no usas Google Workspace y quieres un asistente general."
  - tool: notebooklm
    when: "si quieres preguntarle a tus documentos y que cada respuesta cite la fuente."
  - tool: microsoft-copilot
    when: "si tu empresa trabaja en Outlook, Word y Excel."
beforePaying:
  - "Confirma que tu empresa usa Gmail y Drive de verdad. Si los archivos están regados en WhatsApp, el plan no los encuentra."
  - "Revisa en la página de planes qué trae Google AI Pro y si aplica en Colombia; los beneficios varían por país."
  - "Apaga la actividad si no quieres que tus chats se usen para mejorar el modelo, y usa chats temporales para lo delicado."
  - "Si la cuenta es de empresa, pregúntale al administrador qué permite tu Workspace antes de pagar por tu lado."
sources:
  - name: la página de planes de Gemini
    url: https://gemini.google/subscriptions/
  - name: la ayuda sobre archivos
    url: https://support.google.com/gemini/answer/14903178
  - name: la ayuda sobre privacidad
    url: https://support.google.com/gemini/answer/13594961
---
