---
checked: 2026-10-19
task: "Photoroom es un editor de fotos de producto. En la portada, consultada el 19 oct 2026, ofrece quitar el fondo, editar por lote, guardar colores y formatos de marca, y armar video de campaña a partir de una toma. También habla de publicar en Shopify y en otros canales. Para una pyme la tarea es concreta: que la foto del repuesto, del plato o del producto sea la pieza real, con el fondo limpio, y que el código o la porción no cambien en la salida. No es un generador de catálogos que no tienes en el estante."
useCase:
  sector: taller
  title: La foto del repuesto con el código todavía legible
  steps:
    - "Fotografía la pieza que sí vas a entregar, con la etiqueta si se alcanza a leer. No bajes una imagen de otro vendedor."
    - "Quita el fondo en Photoroom y compara el número, el color y la forma con la foto original antes de exportar."
    - "Si el código se reescribió o la pieza se ve como otra, descarta esa salida. Manda la foto sin editar o vuelve a tomarla."
    - "Usa esa imagen en el WhatsApp y, si hace falta, en una pieza de Canva. Un collage de diez códigos no se lee."
    - "Cuando cambie el precio, no lo dejes pegado en una imagen vieja. El precio vive en la ficha, no en el fondo de la foto."
limits:
  - "La página de precios, consultada el 19 oct 2026, publica el plan Pro a USD 7,50 al mes con cobro anual, 8.000 créditos de IA y 1.000 exportaciones. Dice que el cupo puede variar según el país. Los montos de Max y Ultra no quedaron explícitos en esta revisión y no se copian."
  - "Las herramientas de núcleo, como quitar el fondo, van en los planes de pago sin costo de crédito, dentro de un uso justo. Esta revisión no encontró un plan gratuito permanente con ese mismo alcance."
  - "Puede alterar un detalle fino. En un repuesto, un dígito cambiado es otra pieza. En un plato, una porción más grande es otra carta."
  - "La FAQ de esa página dice que el reembolso llega hasta una semana después de la compra y que el IVA ya va incluido. No es una política de este sitio."
  - "No confirma compatibilidad, no escribe la garantía y no sabe cuántas unidades hay en tu estante."
alternatives:
  - tool: canva
    when: "si la foto ya está bien y solo falta el texto, el precio de hoy y el tamaño de la red."
  - tool: adobe-firefly
    when: "si el trabajo es generar una imagen nueva y no limpiar la foto de un producto real."
  - tool: capcut
    when: "si ya pasaste de la foto fija a un corte de video del trabajo, con material que sí grabaste."
beforePaying:
  - "Haz la prueba con tres fotos reales de tu mostrador y compara el código antes y después. Si un número cambia, el plan no lo arregla solo."
  - "Anota el Pro a USD 7,50 al mes con cobro anual, leído el 19 oct 2026, y vuelve a abrir la página: el sitio dice que los créditos pueden cambiar por país."
  - "No cuentes las 1.000 exportaciones del Pro como si fueran ilimitadas. La misma página distingue créditos de IA y exportaciones, y deja la API en un cupo aparte."
  - "Si vendes comida o ropa a escala de catálogo, el texto de Enterprise Guarantee está limitado a contratos anuales de esos rubros. No lo tomes como promesa para un mostrador de repuestos."
sources:
  - name: la portada de Photoroom
    url: https://www.photoroom.com/
  - name: la página de precios de Photoroom
    url: https://www.photoroom.com/pricing
---
