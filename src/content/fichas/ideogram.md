---
checked: 2026-11-23
task: "Ideogram genera y edita imágenes, y también ofrece video de otros proveedores dentro de la misma plataforma. La portada, abierta el 23 nov 2026, lo describe como un generador de imagen con texto legible y edición que conserva el detalle. Nombra apps de una sola tarea: edición precisa de una zona, quitar fondo, quitar un objeto, ampliar a 2, 4 u 8 veces y cambiar el tamaño de un anuncio. También nombra vector en SVG. Para un taller o una veterinaria la tarea no es inventar el carro, el asiento o el animal. Sirve, si acaso, para un letrero o un aviso cuyo texto tú lees antes de publicar. El plan gratis existe. Quien entra con Google, Apple o Microsoft recibe créditos semanales, y la portada dice que la cantidad puede variar. Quien se registra con correo y contraseña no recibe esos créditos. En el plan gratis, todo lo generado es público. La página de precios respondió con un bloqueo el 23 nov 2026 y no dejó en el texto leído el monto de Plus, Pro ni Team. Por eso esta ficha no anota esos dólares."
useCase:
  sector: taller
  title: Un letrero del local cuyo texto se lee antes de pegarlo
  steps:
    - "Escribe el texto exacto del aviso: el nombre del negocio y el horario que ya está en el perfil. No pongas un precio si no está en la lista de hoy."
    - "Genera la pieza y lee cada palabra. Si una letra cambió, apareció un precio o el horario no es el de hoy, no la publiques."
    - "No uses el resultado como foto de un trabajo. Si el asiento, el vidrio o el animal existen, fotografía el real."
    - "Confirma el plan. En el gratis, la portada dice que la imagen es pública. No subas ahí un dato de un cliente."
    - "Una persona da el visto bueno antes de WhatsApp o del perfil. El generador no sabe si el material sigue en el estante."
limits:
  - "La portada, el 23 nov 2026, dice que Ideogram no reclama la propiedad de tus entradas ni de tus salidas, y que te cede los derechos que adquiera sobre la salida. También dice que tú respondes de que el contenido no viole la ley, derechos de terceros o los términos. Eso no vuelve cierta una palabra que no revisaste."
  - "En el plan gratis las imágenes son públicas. En pago por uso, Plus, Pro, Team y Enterprise, la portada dice que las imágenes nuevas quedan privadas hasta que tú las publiques. El monto de Plus, Pro y Team no quedó en el texto leído ese día: la página de precios no dejó pasar el contenido."
  - "El video de la portada se cobra por segundo, a la tarifa de lista del proveedor, y la propia página fecha esas tarifas al 23 nov 2026. Seedance 2.5 desde 0,103 dólares por segundo a 480p. Seedance 2.0 desde 0,07 dólares por segundo a 480p. MiniMax Hailuo 3 desde 0,05 dólares por segundo a 480p. Kling 4.0 desde 0,157 dólares por segundo a 720p. Kling 3.0 Standard desde 0,084 dólares por segundo a 1080p. Son tarifas de esa página, no un presupuesto de tu anuncio."
  - "La portada dice que los modelos de video de pago o de más nivel necesitan un plan de pago o créditos comprados. Generar un video de un carro que no trabajaste sigue estando fuera de esta ficha, aunque el segundo tenga precio."
  - "Enterprise, según la portada, puede entrar con SSO de Microsoft o Google, y las entradas de esos clientes no se usan para entrenar los modelos compartidos de Ideogram. Eso no aplica solo por tener la cuenta gratis."
alternatives:
  - tool: recraft
    when: "si la pieza es un vector y ya leíste, el 16 nov 2026, que el plan gratis de Recraft no tiene uso comercial."
  - tool: canva
    when: "si la foto del trabajo ya está bien y solo falta el texto, el horario de hoy y el tamaño de la red."
  - tool: photoroom
    when: "si la foto es real y el encargo es quitar el fondo sin cambiar el color de la pieza."
beforePaying:
  - "Genera un letrero en el plan gratis y léelo. Si el texto sale mal, un plan de pago no vuelve cierta una palabra que no revisaste."
  - "No publiques nada del plan gratis como anuncio del negocio si no aceptas que la imagen quede pública. La portada lo dice así."
  - "No anotes el precio de Plus, Pro o Team a partir de esta ficha. El 23 nov 2026 ese monto no quedó en el texto leído."
  - "No uses una imagen generada como prueba de un tapiz, un vidrio, una alineación o una consulta. La foto del trabajo real sigue siendo la que se publica."
sources:
  - name: la portada de Ideogram
    url: https://ideogram.ai/
---
