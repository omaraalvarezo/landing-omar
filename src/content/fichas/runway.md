---
checked: 2026-11-23
task: "Runway genera y edita video, imagen y audio en un mismo espacio de trabajo. La portada de runway.com, abierta el 23 nov 2026, llama a ese espacio Runway Creative y dice que se puede probar gratis y cancelar cuando se quiera. La misma portada habla de una plataforma para desarrolladores y de otra de robótica. Para una pyme la tarea de entrada es la primera: un video o una imagen a partir de material que tú tienes, no un carro que no reparaste. La página de precios del mismo día publica planes en dólares. El gratis cuesta 0 dólares al mes y da 125 créditos una sola vez. Standard, cobrado al año, sale a 12 dólares al mes al lado de 15, y la página dice que ahorras 36 dólares al año. Esos montos son de esa página. Esta ficha no los convierte en pesos ni en segundos de un anuncio tuyo, aunque la página traduzca créditos a segundos de sus modelos."
useCase:
  sector: servicios
  title: Una prueba con material que ya tienes, antes de pagar
  steps:
    - "Entra al plan gratis y sube una foto o un video que tú tomaste. No pidas un vehículo, un local o un animal que no existan."
    - "Mira cuántos de los 125 créditos se va en esa prueba. La página dice que esos créditos son de una sola vez, no de cada mes."
    - "Lee cualquier texto que aparezca en la salida. Si hay un precio, una medida o una marca que no pediste, no se publica."
    - "No pases a un plan de pago para «arreglar» una imagen de un trabajo que no hiciste. La foto real sigue siendo la que sale."
    - "Si cancelas, hazlo en la cuenta. La portada dice que se puede cancelar cuando se quiera. Esta ficha no vio el botón del checkout."
limits:
  - "El plan gratis, leído el 23 nov 2026, cuesta 0 dólares al mes e incluye 125 créditos de una sola vez, una selección de modelos para probar y 5 GB de almacenamiento. No es una bolsa que se renueve cada mes."
  - "Standard se muestra cobrado al año: 12 dólares al mes, al lado de 15, con un ahorro de 36 dólares al año. Trae 625 créditos al mes. La página iguala esos créditos a 52 segundos de Gen-4.5, 104 segundos de Gen-4 Turbo o 78 imágenes Gen-4 a 1080p. Es una equivalencia de Runway, no una duración prometida para tu pieza."
  - "Pro se muestra cobrado al año: 28 dólares al mes, al lado de 35, con un ahorro de 84 dólares al año, y 2.250 créditos al mes. La página iguala esos créditos a 187 segundos de Gen-4.5, 375 segundos de Gen-4 Turbo o 281 imágenes Gen-4 a 1080p."
  - "Max se muestra cobrado al año: 76 dólares al mes, al lado de 95, con un ahorro de 228 dólares al año, y 9.500 créditos al mes, con créditos que pasan un mes. La página iguala esos créditos a 791 segundos de Gen-4.5, 791 segundos de Gen-4, 1.900 segundos de Gen-4 Turbo, 1.187 imágenes Gen-4 a 1080p o 475 imágenes Nano Banana Pro a 2K."
  - "En Standard y en Pro, la página anuncia un 25 por ciento de descuento en generaciones de Kling 4.0 hasta el 30 nov 2026. Ese plazo es de la página. Un aviso de la portada dice que las empresas pueden recibir hasta 2 meses de uso gratis si firman antes del 31 dic. No es el plan de una persona y no lo conviertas en un cupo del taller."
alternatives:
  - tool: higgsfield
    when: "si el encargo es un video corto a partir de una imagen y ya leíste la nota de duración, sin prometer un largo que la herramienta no muestra."
  - tool: veed
    when: "si ya grabaste el video y solo faltan subtítulos, no un modelo generativo."
  - tool: capcut
    when: "si el corte cabe en el teléfono y no quieres otra cuenta de créditos."
beforePaying:
  - "Gasta parte de los 125 créditos del plan gratis en una foto que ya tienes. Si el resultado no se puede publicar, el plan de pago no lo vuelve un trabajo hecho."
  - "Abre de nuevo la página de precios antes de anotar los dólares. El 23 nov 2026 Standard estaba en 12 dólares al mes al año, Pro en 28 y Max en 76, cada uno al lado del precio mensual más alto."
  - "No cuentes los segundos de Gen-4.5 como la duración de tu anuncio. La página los da como equivalencia de los créditos, no como un encargo de un local."
  - "No uses el descuento de Kling 4.0 después del 30 nov 2026 sin volver a abrir la página. La fecha está escrita ahí."
sources:
  - name: la portada de Runway
    url: https://runway.com/
  - name: la página de precios de Runway
    url: https://runway.com/pricing
---
