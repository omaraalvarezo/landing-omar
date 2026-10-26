---
checked: 2026-10-26
task: "remove.bg quita el fondo de una foto. La portada, abierta el 26 oct 2026, dice que se puede dejar el fondo en blanco para una ficha de comercio, un aviso de carro o un retrato, o exportar un PNG transparente. También dice que hay un uso gratis. En la página de precios de ese día el dato fino es otro: aparece el texto de un crédito gratis, las previsualizaciones no consumen crédito y una imagen final pide un crédito. Para una pyme la tarea es concreta. La foto del carro, de la llanta o del producto tiene que seguir siendo esa, con la forma y los números iguales, y el fondo limpio no puede inventar otro vehículo. No es un generador de avisos de carros que no están en el lote."
useCase:
  sector: taller
  title: El aviso de un usado con el mismo carro
  steps:
    - "Fotografía el carro que sí vas a vender, del ángulo que vas a publicar. No bajes el aviso de otro vendedor."
    - "Quita el fondo en remove.bg y compara color, forma y detalles con la foto original antes de descargar la imagen final."
    - "Si la placa no va en el aviso, no la reconstruyas con un parche sobre otro carro. Recorta la foto de este."
    - "Si el resultado parece otro vehículo, descártalo. Publica la foto sin el fondo editado o vuelve a tomarla."
    - "El precio y el kilometraje viven en la ficha, no en el fondo. Si cambian, no dejes el número viejo pegado en la imagen."
limits:
  - "La página de precios, leída el 26 oct 2026, muestra el plan Personal a USD 9 al mes con 40 créditos, y a USD 8,10 al mes si se paga el año, que en ese dato suma USD 97,20. Ese plan está marcado para uso comercial. Un crédito es una imagen. La previsualización no gasta crédito y el texto de la página habla de un crédito gratis."
  - "El plan Professional de ese mismo dato empieza en USD 39 al mes por 200 créditos, o USD 35,10 al mes en el cobro anual. Hay escalones más altos. No los copies de memoria: vuelve a abrir la página el día que pagues."
  - "Los créditos de la suscripción no pasan al mes siguiente. La pregunta frecuente de esa página dice que valen durante el periodo de la suscripción. El pago suelto que aparece en el dato incluye, entre otros, 3 créditos por USD 3 y 10 por USD 9."
  - "Puede alterar un borde, una placa o un color. En un usado, un carro que se ve distinto es otro aviso. En un repuesto, un dígito cambiado es otra pieza."
  - "No confirma el kilometraje, no escribe el contrato y no sabe si el carro sigue en el lote. La portada ofrece el uso. No promete que la descarga en alta quede cubierta por el crédito gratis."
alternatives:
  - tool: photoroom
    when: "si además del fondo necesitas un formato de marca y ya comparaste el código de la pieza con la foto original."
  - tool: pixelcut
    when: "si la foto sale del teléfono y el plan que estás mirando es el de Pixelcut, con sus créditos, no el de remove.bg."
  - tool: canva
    when: "si el fondo ya está bien y solo falta el texto corto y el precio de hoy."
beforePaying:
  - "Prueba con tres fotos reales del lote o del mostrador y compara el vehículo o la etiqueta antes y después. Si algo cambia, el plan no lo arregla solo."
  - "Anota el Personal a USD 9 al mes, o USD 8,10 al mes en el año, con 40 créditos, leído el 26 oct 2026. Un aviso no es una previsualización: la imagen final pide crédito."
  - "No cuentes los créditos como si se acumularan. La misma página dice que los de la suscripción valen en ese periodo."
  - "Si el negocio es un catálogo grande, mira el Professional desde USD 39 al mes por 200 créditos en esa lectura y vuelve a abrir la página. No uses esta ficha como cotización."
sources:
  - name: la portada de remove.bg
    url: https://www.remove.bg/
  - name: la página de precios de remove.bg
    url: https://www.remove.bg/pricing
---
