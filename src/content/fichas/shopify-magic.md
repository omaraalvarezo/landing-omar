---
checked: 2026-10-16
task: "Shopify Magic es el conjunto de funciones de IA dentro de Shopify, y su página hoy lleva a Sidekick, el asistente de comercio. Redacta descripciones de producto, blogs y correos dentro del editor, sugiere respuestas en la bandeja de mensajes, crea bloques del tema desde una instrucción y ayuda con alertas de inventario bajo y campañas. La tarea en una pyme: tener el catálogo descrito y al día sin escribir cada ficha a mano."
useCase:
  sector: taller
  title: Las fichas de los productos de cuidado que vende el taller
  steps:
    - "Carga cada producto con los datos reales: marca, presentación, para qué superficie es y cómo se aplica."
    - "Pide la descripción con el generador del editor y borra cualquier promesa que la ficha del fabricante no haga."
    - "Usa la misma estructura en todas: qué es, para qué sirve, cómo se usa y qué no hacer."
    - "Pide a Sidekick una alerta de inventario bajo para los productos que más se venden."
    - "Revisa cada cambio antes de aprobarlo. Según la ayuda, Sidekick no cambia la tienda sin tu aprobación."
limits:
  - "Solo funciona dentro de Shopify. Si tu tienda está en otra plataforma, no aplica."
  - "Sidekick no habla con tus clientes ni atiende conversaciones de soporte por ti, según la ayuda oficial."
  - "La disponibilidad cambia según el plan, el dispositivo y el idioma, y en el navegador del celular no funciona: hay que usar la app."
  - "La propia ayuda de Shopify dice que los resultados de IA pueden tener errores. Revisa todo lo que cree o cambie."
alternatives:
  - tool: chatgpt
    when: "si tu tienda no está en Shopify y necesitas redactar las descripciones igual."
  - tool: canva
    when: "si lo que falta son las imágenes y piezas de los productos."
  - tool: manychat
    when: "si quieres responder preguntas de productos en Instagram o WhatsApp."
beforePaying:
  - "No hay que pagar Shopify Magic aparte: según Shopify, Sidekick viene incluido en el plan. Lo que pagas es Shopify."
  - "Revisa qué funciones trae tu plan; la página dice que funciones y límites varían por plan."
  - "Confirma que tu equipo usa el admin en computador o en la app, no en el navegador del celular."
  - "Haz cinco fichas con Sidekick y compáralas con las que escribirías tú en el mismo tiempo."
sources:
  - name: la página de Sidekick
    url: https://www.shopify.com/co/sidekick
  - name: la ayuda de IA de Shopify
    url: https://help.shopify.com/en/manual/shopify-admin/productivity-tools/shopify-magic
  - name: la ayuda para configurar Sidekick
    url: https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/set-up
---
