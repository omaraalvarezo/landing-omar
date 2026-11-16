---
checked: 2026-11-16
task: "Recraft genera imágenes y vectores. La portada, abierta el 16 nov 2026, habla de gráficos vectoriales editables, de tipografía y de estilos consistentes sin entrenar un modelo propio. Para una pyme la tarea no es inventar el producto del estante. Sirve, si acaso, para una pieza gráfica cuyo texto tú revisas, nunca para mostrar un carro, un pan o un repuesto que no existe. El plan gratis, en la página de precios de ese día, deja las imágenes públicas y sin uso comercial. El plan de pago es el que Recraft asocia con propiedad y uso comercial. No es una foto del trabajo hecho."
useCase:
  sector: servicios
  title: Una pieza gráfica cuyo texto se lee antes de publicar
  steps:
    - "Escribe el texto exacto que debe verse: el nombre del negocio y nada de precios si no están en la lista de hoy."
    - "Genera la pieza y lee cada palabra. Si una letra cambió o apareció un precio, no la publiques."
    - "No uses el resultado como foto de un producto. Si vendes ese producto, fotografía el real."
    - "Confirma en qué plan estás. En el gratis, la página de precios dice que la imagen es pública y no tiene uso comercial."
    - "Si la pieza va a WhatsApp o al perfil, una persona da el visto bueno. El generador no sabe el horario ni la existencia."
limits:
  - "El plan gratis, leído el 16 nov 2026, es de uso personal: 3 generaciones por estilo al día, 3 cargas de imagen al día, hasta 2 imágenes por generación, herramientas básicas, biblioteca de estilos, imágenes públicas, sin uso comercial, sin generación en paralelo y solo con modelos de Recraft. La página dice que esas imágenes son de Recraft, se ven en la galería y no están licenciadas para uso comercial."
  - "Basic agrega, según esa página, derechos comerciales, generaciones privadas, cargas sin tope, herramientas avanzadas, hasta 20 imágenes por generación y hasta 5 generaciones en paralelo. Nombra otros modelos de imagen, entre ellos Flux y GPT Image. No copies un precio: en el texto abierto no quedó el monto en dólares."
  - "La página muestra 2.000 créditos al mes en el tramo que sigue a Basic y agrega video, y 2.000 créditos al mes por asiento en Teams. Teams suma espacio compartido, estilos compartidos, facturación central y acceso único. No asigno los 2.000 del primer tramo a un nombre de plan que el texto no rotuló con claridad."
  - "Los precios que se muestran van sin IVA, dice la página. Los créditos de la suscripción se reinician con el ciclo y no se acumulan. Los créditos de recarga no vencen y se usan cuando se acaban los del mes. En Teams, la recarga se comparte entre asientos."
  - "En un plan de pago, Recraft dice que conservas la propiedad y el uso comercial de lo generado mientras estabas suscrito, también si cancelas. Cancelar deja el plan activo hasta el fin del periodo. El reembolso es discrecional: el pago más reciente tiene que ser de los últimos 30 días y, o no usaste créditos desde ese pago, o la cuenta usó menos de 30 créditos en total desde que se creó. Se pide a help@recraft.ai. No hay reembolso si la cuenta ya se borró."
alternatives:
  - tool: canva
    when: "si la foto del producto ya está bien y solo falta el texto, el precio de hoy y el tamaño de la red."
  - tool: midjourney
    when: "si el encargo es explorar una imagen y no un vector editable ni una ficha de producto."
  - tool: adobe-firefly
    when: "si el equipo ya trabaja en Adobe y la pieza nueva no tiene que salir de una foto del mostrador."
beforePaying:
  - "Genera una pieza en el plan gratis y léela. Si el texto sale mal, el plan de pago no vuelve cierta una palabra que no revisaste."
  - "No publiques nada del plan gratis como anuncio del negocio. La página dice que no tiene uso comercial y que la imagen es pública."
  - "No anotes un precio en dólares a partir de esta ficha. El 16 nov 2026 el monto del plan no quedó en el texto leído. La página sí dice que los precios mostrados van sin IVA."
  - "No uses una imagen generada como prueba de un trabajo de pintura, de un pan o de un repuesto. La foto del objeto real sigue siendo la que se publica."
sources:
  - name: la portada de Recraft
    url: https://www.recraft.ai/
  - name: la página de precios de Recraft
    url: https://www.recraft.ai/pricing
---
