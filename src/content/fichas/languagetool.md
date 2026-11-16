---
checked: 2026-11-16
task: "LanguageTool es un corrector con IA. La portada, abierta el 16 nov 2026, lo describe como un revisor de gramática, ortografía, puntuación y estilo, y nombra el español entre sus idiomas principales, junto con inglés, alemán, francés, neerlandés y portugués. Dice que cubre más de 30 idiomas. La pregunta frecuente de esa página separa dos versiones: la gratis corrige ortografía, puntuación simple y algunos errores de estilo; el Premium muestra todos los errores. También hay un parafraseo con IA para reescribir una frase de forma más formal, más corta o más simple, y un complemento de navegador que, según la portada, no guarda el texto. Para una panadería o un taller la tarea es concreta. El mensaje de WhatsApp ya escrito se revisa en español antes de enviarlo. Una sugerencia no puede cambiar el precio, el producto ni la hora. No es un redactor del menú ni un traductor de una norma."
useCase:
  sector: servicios
  title: El WhatsApp de la panadería, revisado sin tocar el precio
  steps:
    - "Escribe tú el mensaje con la lista del día: producto, cantidad y precio. LanguageTool no arma esa lista."
    - "Pega el mensaje en el corrector, en español, y lee cada marca. Si una sugerencia cambia un número, no la aceptes."
    - "No uses el parafraseo para reescribir el menú. La portada lo ofrece para una frase, no para inventar un producto."
    - "Vuelve a leer el mensaje completo antes de enviarlo por WhatsApp. La ortografía corregida no confirma que todavía haya de ese pan."
    - "Si el texto va a una publicación, contrasta la foto con el producto real. El corrector no vio el horno."
limits:
  - "La ayuda de LanguageTool, con fecha 24 mar 2026, publica el Premium individual así: 19,90 euros al mes; 39,90 euros el trimestre (13,30 euros al mes); 59,89 euros al año (4,90 euros al mes); 99,90 euros por dos años (4,16 euros al mes). Estudiantes, docentes y profesores pueden recibir hasta un 20 por ciento de descuento si califican. El equipo, hasta 20 usuarios, cuesta 56,90 euros al año por usuario. Esos montos son de esa ayuda. Esta ficha no los convierte en pesos ni dice que sigan iguales sin volver a abrir la página."
  - "La página de premium carga el cobro en el checkout. En el texto estático de esa página, el 16 nov 2026, no se leyeron estos euros. Por eso la cifra vive en la ayuda, no en un pantallazo del pago."
  - "La versión gratis, según la pregunta frecuente de la portada, no muestra todos los errores. Pagar no enseña el precio de tu pan ni la existencia del día."
  - "El complemento del navegador dice que no guarda el texto. El editor con cuenta, en la misma portada, dice que los textos se guardan de forma segura. No son la misma promesa. No pegues datos de clientes en el editor si no aceptas ese guardado."
  - "Puede proponer un sinónimo o un parafraseo que cambie el sentido. En un mensaje de encargo, un producto distinto es otro pedido. La persona acepta o rechaza la marca."
alternatives:
  - tool: grammarly
    when: "si el texto que vas a publicar está en inglés y no en el español del mostrador."
  - tool: deepl
    when: "si el trabajo es traducir un texto que ya escribiste, no corregir el mensaje en español."
  - tool: chatgpt
    when: "si todavía no hay mensaje y necesitas un borrador a partir de una lista que tú pegas, para luego pasarlo por el corrector."
beforePaying:
  - "Pega tres mensajes reales del negocio en la versión gratis y mira si las marcas que aceptas cambian un número. Si ninguna lo hace, anota para qué sí pagarías."
  - "Abre de nuevo la ayuda antes de anotar los euros. La página que los lista está fechada el 24 mar 2026. El checkout puede mostrar otro monto."
  - "No cuentes el descuento de educación como automático. La ayuda dice que aplica si calificas, para estudiantes, docentes y profesores."
  - "No pases por el parafraseo un precio, una hora o un nombre de producto. Esa función reescribe la frase. El dato lo contrastas tú con la lista."
sources:
  - name: la portada de LanguageTool
    url: https://languagetool.org/
  - name: la página Premium de LanguageTool
    url: https://languagetool.org/premium
  - name: la ayuda sobre suscripciones de LanguageTool
    url: https://help.languagetool.org/hc/en-us/articles/39254510973335-What-subscriptions-does-LanguageTool-offer
---
