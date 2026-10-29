---
title: El prompt de la landing
intro: Este es el prompt que usé en el video. Cópialo completo, cambia lo que está entre corchetes por los datos de tu negocio y pégalo en Claude Code.
published: 2026-10-28
---
# ROL
Actúa como estratega de conversión y desarrollador frontend senior. Vas a investigar referentes del sector veterinario, extraer los patrones que funcionan y construir una landing page local para una veterinaria ficticia.

# CONTEXTO DEL NEGOCIO (ficticio)
- Nombre: [Clínica Veterinaria Huellitas]
- Ciudad: [Cúcuta, Colombia]
- Servicios: consulta general, vacunación, cirugía, peluquería, urgencias [24h / horario extendido]
- Cliente ideal: dueños de perros y gatos de 25–45 años que buscan confianza y rapidez
- Objetivo de la landing: que el visitante agende una cita o escriba por WhatsApp
- Diferencial: [definir, p. ej. "veterinarios que te explican todo y te mandan fotos del proceso"]

# FASE 0 — PREPARAR EL ENTORNO LOCAL (antes de cualquier otra cosa)
1. Detecta mi sistema operativo y crea esta carpeta dentro de mi carpeta Documentos:
   - macOS / Linux: ~/Documents/landing-veterinaria
   - Windows: %USERPROFILE%\Documents\landing-veterinaria
   (En sistemas en español la carpeta se muestra como "Documentos", pero la ruta real sigue siendo "Documents").
2. Dentro de ella crea esta estructura:
   landing-veterinaria/
   ├── investigacion/
   ├── assets/
   └── index.html   (vacío por ahora)
3. Muéstrame la ruta absoluta creada y confirma que existe.
4. Desde aquí, TODO archivo que crees (investigación, plan, código, assets) va dentro de esta carpeta. No crees ni modifiques nada fuera de ella.
5. Todo se ejecuta en local. No despliegues, no subas a GitHub, no uses servicios de hosting ni instales dependencias globales.

# FASE 1 — INVESTIGACIÓN DE REFERENTES
1. Usa búsqueda web para encontrar 10 candidatos de landing pages o sitios de clínicas veterinarias reconocidas. Mezcla mercados maduros (EE.UU., Reino Unido, España) con referentes de Latinoamérica.
2. Abre cada URL con WebFetch y descarta las que:
   - no cargan o redirigen a otro dominio,
   - no tienen un mecanismo de reserva o contacto visible y activo,
   - están desactualizadas (copyright viejo, enlaces rotos, contenido abandonado).
3. Quédate con los 5 mejores y documenta para cada uno, en una tabla:
   - URL verificada
   - Orden exacto de secciones (hero → … → footer)
   - Propuesta de valor del hero (parafraseada, no copiada)
   - CTA principal y secundario, y cuántas veces se repiten
   - Tipo de prueba social (reseñas, años, mascotas atendidas, certificaciones)
   - Cómo presentan servicios, precios y urgencias
   - Qué haría que un dueño de mascota confíe en ellos
4. Regla: si no pudiste verificar algo, escríbelo como "no verificado". No inventes URLs, datos ni reseñas.
5. Guarda todo en investigacion/referentes.md

# FASE 2 — SÍNTESIS Y PLAN
Con base en la investigación, crea investigacion/plan.md con:
- Los 5–7 patrones que se repiten en los mejores referentes y por qué funcionan
- Estructura de secciones propuesta para nuestra landing, en orden, con el objetivo de cada sección
- Dirección de copy: tono, titular principal (3 opciones) y CTAs
- Dirección visual: paleta, tipografía y estilo fotográfico
- Qué NO vamos a hacer y por qué

⛔ DETENTE AQUÍ. Muéstrame el plan y espera mi aprobación antes de escribir código.

# FASE 3 — CONSTRUCCIÓN
Cuando apruebe:
- Trabaja dentro de ~/Documents/landing-veterinaria
- Stack: un solo index.html con Tailwind vía CDN y JS mínimo. Sin frameworks ni build.
- Mobile-first: la mayoría del tráfico llegará desde el celular.
- Botón flotante de WhatsApp con mensaje prellenado.
- Formulario de cita (nombre, mascota, especie, servicio, fecha preferida, teléfono). Solo validación visual; no se envía a ningún lado.
- Sección de urgencias muy visible si el negocio la ofrece.
- SEO local básico: title, meta description, Open Graph y schema.org tipo VeterinaryCare con datos ficticios.
- Imágenes: placeholders de Unsplash con temática de mascotas. No uses imágenes, logos ni textos de los referentes.
- Testimonios: márcalos visiblemente como "testimonio de ejemplo". No los presentes como reales.

# FASE 4 — REVISIÓN
1. Levanta un servidor local desde la carpeta del proyecto (npx serve . o python3 -m http.server) y dime la URL local.
2. Revisa contra este checklist y reporta qué cumple y qué no:
   - ¿Se entiende qué es y qué hago en menos de 5 segundos?
   - ¿El CTA principal está visible sin hacer scroll en el celular?
   - ¿Hay prueba social antes del primer formulario?
   - ¿Funciona bien a 375 px de ancho?
   - ¿Contraste y tamaño de texto legibles?
3. Propón las 3 mejoras de mayor impacto. No las apliques hasta que te lo pida.

# REGLAS GENERALES
- Todo el proyecto vive en ~/Documents/landing-veterinaria y corre solo en local.
- Los referentes son inspiración estructural. Nunca copies textos, diseños exactos ni assets.
- No inventes estadísticas, certificaciones ni datos médicos.
- Responde en español.
