---
checked: 2026-10-26
task: "Fathom toma notas de una reunión. La portada, abierta el 26 oct 2026, dice que resume la llamada para que la persona atienda la conversación, que hay una opción sin bot y otra con bot, y que el dato de la reunión puede verse dentro de ChatGPT o de Claude. Nombra Google Meet, Gmail, Slack y Microsoft Teams, y dice que las notas pueden sincronizarse con Slack, Salesforce, HubSpot, Notion y Asana. Para una pyme la tarea no es grabar todo. Es dejar un acta de una reunión que las dos partes saben que se graba: un proveedor, un arrendador o una visita larga. No es el WhatsApp del mostrador ni un cierre de caja."
useCase:
  sector: servicios
  title: El acta de una reunión con un proveedor
  steps:
    - "Avisa a la otra persona que la llamada se graba y se resume. Si no está de acuerdo, no entres a la reunión con el notetaker."
    - "Usa Google Meet o Microsoft Teams, que son los lugares que la portada nombra. No grabes un mostrador de oído."
    - "Al terminar, lee el resumen y borra cualquier precio, plazo o existencia que no se haya dicho en la llamada."
    - "Pasa a la ficha del negocio solo lo que quedó confirmado. El acta no es una orden de compra."
    - "Si el plan que tienes no sincroniza el CRM, copia a mano. No des por hecho que HubSpot o Notion se llenan solos en el plan gratis."
limits:
  - "La página de precios, abierta el 26 oct 2026, anuncia un plan gratis para siempre, con grabaciones y transcripciones sin tope publicado en ese bloque, resúmenes, clips y búsqueda. La captura sin bot está marcada en beta y, en la tabla, para Mac. También hay captura con bot."
  - "El título de esa página dice planes desde USD 15 al mes. Junto a un selector anual que habla de un ahorro de 25% o más, el bloque Team muestra USD 19 y USD 15 al mes por usuario, con mínimo de dos. Business muestra USD 34 y USD 25. No separo cuál de cada par es el mes y cuál es el año, porque salen juntos."
  - "El bloque Business es el que nombra la sincronización de campos del CRM. No atribuyo esa función al plan gratis. La portada sí lista integraciones. La página de precios es la que distingue el plan."
  - "La portada afirma que el usuario promedio ahorra 38 minutos por reunión, que el 95% dice mantenerse presente y que un equipo ahorra más de 6 horas a la semana. Son cifras de Fathom. Este sitio no las auditó y no las ofrece como resultado de otro negocio."
  - "No contesta el WhatsApp, no ve el inventario y no reemplaza el permiso de grabar. Una reunión con un cliente del taller no se graba por costumbre."
alternatives:
  - tool: otter-ai
    when: "si ya transcribes con Otter y solo quieres el acta de la misma llamada, sin abrir otra cuenta esta semana."
  - tool: fireflies-ai
    when: "si la reunión ya entra por Fireflies y el resumen te alcanza. No sumes dos notetakers a la misma cita."
  - tool: notion
    when: "si no hubo llamada y lo que falta es escribir la ficha a mano en el tablero, no un resumen automático."
beforePaying:
  - "Haz una llamada de prueba con alguien del negocio y lee el resumen antes de mirar el plan de pago. Si inventa un precio, el plan no lo corrige solo."
  - "Anota el plan gratis y el título de USD 15 al mes, leídos el 26 oct 2026, y vuelve a abrir la página. Los pares 19 y 15, y 34 y 25, hay que leerlos ese día junto al selector anual."
  - "No cuentes la sincronización con el CRM como parte del plan gratis. En esa lectura está descrita en Business."
  - "Pregunta a la otra persona antes de grabar. El aviso de la herramienta no reemplaza ese permiso, y la garantía de 90 días que la página muestra es de Fathom, no de este sitio."
sources:
  - name: la portada de Fathom
    url: https://www.fathom.ai/
  - name: la página de precios de Fathom
    url: https://www.fathom.ai/pricing
---
