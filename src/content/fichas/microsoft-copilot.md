---
checked: 2026-10-16
task: "Microsoft Copilot sirve para usar IA donde ya trabajas si tu empresa está en Office. La versión gratuita, con una cuenta Microsoft, responde, resume, busca en la web, redacta y crea imágenes en web, escritorio y móvil. Con Microsoft 365, según su página, entra a Word, Excel, PowerPoint y Outlook: primer borrador, análisis de datos, presentaciones desde una instrucción y resumen de la bandeja de entrada."
useCase:
  sector: servicios
  title: El informe mensual del cliente desde la hoja de Excel
  steps:
    - "Guarda la hoja del mes en OneDrive con el autoguardado activo; la página de Microsoft lo pide para usar Copilot en Excel."
    - "Pide los tres cambios grandes frente al mes anterior y una tabla con los números que los explican."
    - "Revisa cada cifra contra la hoja. Si un número no cuadra, corrígelo en la hoja, no en el informe."
    - "Pasa a Word y pide el borrador del informe de una página con esa tabla."
    - "Agrega tú la recomendación. El borrador describe; la opinión es de quien firma."
limits:
  - "Las funciones cambian según el dispositivo, el idioma y la plataforma, según su página."
  - "En el plan Family las funciones de IA son solo del titular de la suscripción; no se comparten con el resto."
  - "Todos los planes tienen límites de uso, incluido el gratuito."
  - "Si tu equipo no trabaja en Office, pagar Microsoft 365 solo por Copilot no tiene sentido."
alternatives:
  - tool: gemini
    when: "si la empresa vive en Gmail, Docs y Drive."
  - tool: chatgpt
    when: "si quieres un asistente general sin depender de Office."
  - tool: claude
    when: "si el trabajo es leer documentos largos y escribir con cuidado."
beforePaying:
  - "Prueba primero la versión gratuita con una tarea real de la semana."
  - "Confirma que tus archivos están en OneDrive; sin eso, Copilot en Excel no arranca."
  - "Revisa qué plan de Microsoft 365 incluye Copilot en las apps y si cubre a una persona o a varias."
  - "Si la cuenta es de empresa, pregunta qué licencia ya pagas antes de comprar otra."
sources:
  - name: copilot.com
    url: https://copilot.com/
  - name: la página de Copilot para personas
    url: https://www.microsoft.com/en-us/microsoft-copilot/for-individuals
---
