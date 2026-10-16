---
checked: 2026-10-16
task: "Lovable sirve para construir una app web o un sitio describiéndolo en lenguaje natural. Genera la interfaz, la base de datos, el inicio de sesión y las integraciones sobre código que puedes editar y sincronizar con GitHub, GitLab o Bitbucket. La tarea en una pyme: un prototipo o una herramienta interna pequeña, como un formulario con su tablero, antes de contratar desarrollo."
useCase:
  sector: taller
  title: Un registro de garantías con tablero interno
  steps:
    - "Escribe en un párrafo qué datos entran (placa, servicio, fecha y teléfono) y quién los ve. Sin ese párrafo, la app crece sin forma."
    - "Pide primero solo el formulario y la lista. Pruébalo con cinco carros reales."
    - "Agrega el inicio de sesión para que solo el equipo vea la lista."
    - "Revisa cada cambio de base de datos que propone; con Supabase, el SQL se ejecuta solo después de tu aprobación, según su documentación."
    - "Antes de publicar, pídele a alguien que sepa de seguridad que revise quién puede leer qué."
limits:
  - "Que la app funcione en la vista previa no significa que esté segura. Los permisos de los datos se revisan aparte."
  - "El dominio propio solo está en planes pagos, según su documentación."
  - "Si empiezas con su backend integrado y luego quieres tu propio Supabase, no hay migración automática en ningún sentido."
  - "Los créditos diarios del plan gratuito no se acumulan. Un proyecto grande se come el mes rápido."
alternatives:
  - tool: framer
    when: "si lo que necesitas es un sitio de presentación y no una app con datos."
  - tool: n8n
    when: "si el problema es mover datos entre apps que ya tienes, no construir una nueva."
beforePaying:
  - "Construye la versión mínima con los créditos gratis. Si no la usaste una semana, no pagues por la versión grande."
  - "Decide desde el inicio si los datos van en su backend o en tu propio Supabase; cambiar después cuesta."
  - "Revisa cuántos créditos trae el plan y cuándo vencen."
  - "Confirma que el código se sincroniza con tu repositorio, para que no dependa de una sola plataforma."
sources:
  - name: la documentación de Lovable
    url: https://docs.lovable.dev/introduction
  - name: los precios de Lovable
    url: https://lovable.dev/es/pricing
  - name: la integración con Supabase
    url: https://docs.lovable.dev/integrations/supabase
  - name: la ayuda de dominios
    url: https://docs.lovable.dev/features/custom-domain
---
