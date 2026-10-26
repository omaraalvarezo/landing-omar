---
checked: 2026-10-26
task: "Pixelcut es un editor de fotos con IA. El título de su sitio, el 26 oct 2026, lo presenta como editor de fotos con IA y la página de precios habla de producto, de exportación por lote y de créditos para modelos avanzados, en especial de terceros. Hay un plan en cero y planes de pago. Para una ferretería, una llantería o un mostrador de repuestos la tarea es la foto del producto que sí está en el estante, tomada con el teléfono, con la etiqueta todavía legible. No es un generador de catálogos que no tienes ni un reemplazo de la lista de precios."
useCase:
  sector: taller
  title: La foto del producto con la etiqueta igual
  steps:
    - "Fotografía la pieza o el producto que sí vas a vender, con la etiqueta si se alcanza a leer. No bajes una imagen de otro vendedor."
    - "Edita en Pixelcut y compara marca, cantidad y color con la foto original antes de exportar."
    - "Si un número de la etiqueta cambió o el producto se ve como otro, descarta esa salida y usa la foto sin editar."
    - "No quemes el precio en la imagen. El precio vive en la lista de Notion o en el mensaje, porque cambia."
    - "Si el plan muestra un tope de créditos o de exportaciones por lote, no lo trates como ilimitado. El número de esa página manda."
limits:
  - "La página de precios, abierta el 26 oct 2026, muestra Free en USD 0 y dice que la exportación gratis no lleva marca de agua. Con un cobro anual que anuncia un ahorro de 20%, muestra USD 8 al mes, con USD 10 tachados, 600 créditos de IA al mes y 1.000 exportaciones por lote."
  - "En la misma vista hay otro monto: USD 24 al mes, con USD 30 tachados, 3.600 créditos de IA al mes y 2.000 exportaciones por lote. La página no dejó, en el texto leído, un nombre de plan inequívoco para ese segundo monto. Aquí no se le inventa uno."
  - "Los créditos, según esa página, se usan al crear o editar con ciertos modelos avanzados, en particular de terceros. No conviertas la lista de modelos de la tabla en un cupo de tu negocio: el emparejamiento con cada precio no quedó claro en esta revisión."
  - "Puede alterar una etiqueta, una cantidad o un color. En ferretería, un metro que pasa a pieza es otro pedido. En un repuesto, un código cambiado es otra pieza."
  - "No confirma existencia, no escribe la garantía y no sabe la unidad en la que vendes. La foto limpia no reemplaza la lista."
alternatives:
  - tool: photoroom
    when: "si la tarea es solo el fondo de una foto de producto y ya tienes el plan de Photoroom anotado con su fecha."
  - tool: remove-bg
    when: "si lo único que necesitas es quitar el fondo y el crédito de remove.bg te alcanza para esa imagen."
  - tool: canva
    when: "si la foto ya está bien y solo falta el texto corto y el precio de hoy, en el tamaño de la red."
beforePaying:
  - "Edita tres fotos reales del mostrador y compara la etiqueta. Si un número cambia, el plan de pago no es el primer arreglo."
  - "Anota el Free en USD 0 y el monto de USD 8 al mes con 600 créditos, leídos el 26 oct 2026 junto al ahorro anual de 20%. Vuelve a abrir la página antes de pagar."
  - "No sumes los créditos del segundo monto, USD 24 al mes y 3.600 créditos, como si fueran del mismo plan de USD 8. En la página salen aparte."
  - "No publiques una imagen generada de un producto que no está en el estante. La página habla de fotografía de producto. El estante lo ves tú."
sources:
  - name: la portada de Pixelcut
    url: https://www.pixelcut.ai/
  - name: la página de precios de Pixelcut
    url: https://www.pixelcut.ai/pricing
---
