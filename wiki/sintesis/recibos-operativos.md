---
titulo: "Recibos operativos con fuente"
tipo: sintesis
dominio: [copy, conversion, brand]
tags: [recibos, cifras, enzo, arkhe, sistema-de-enzo, entregas, evidencia]
fuentes:
  - "[[../../../second-brain/projects/cotizador-enzo/README.md]]"
  - "[[../../../second-brain/projects/cotizador-enzo/log.md]]"
  - "[[../../../second-brain/projects/cotizador-enzo/src/constants/taller.js]]"
  - "[[../../../second-brain/projects/cotizador-enzo/supabase/migrations/20260819_tiempos_taller.sql]]"
  - "[[../../../grupo-enzo/enzo-motorsport/log.md]]"
  - "[[../../../second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md]]"
  - "[[../../../second-brain/CLAUDE.md]]"
  - "[[../../../CLAUDE.md]]"
creado: 2026-10-17
actualizado: 2026-10-17
---

# Recibos operativos con fuente

Registro de las cifras que el sitio puede mostrar como "recibos" (spec §6.8). La regla es una sola:
**la cifra sin archivo que la respalde no se publica.** Los datos publicables viven en
`src/data/recibos.json`; este documento explica de dónde sale cada uno.

Cómo se presentan:

- `value` lleva "aprox.": son redondeos de una medición o estimados del propio Omar. **Única
  excepción:** una regla de diseño exacta se marca con `kind: "exacto"` y va sin "aprox.", porque
  ponérselo la falsearía. Hoy solo la usa el recibo 4.
- `origin` es la única línea de origen que se imprime, siempre con mes y año. Dice lo que es la
  cifra: "medido en…" si se midió, "estimado de…" si es un estimado, y "según una revisión del
  sistema de Enzo…" si el total se infiere del denominador de una medición hecha con otro fin.
  Un total inferido nunca dice "contado" ni "medido".
- `source` y `method` son internos y **nunca se imprimen**. Las páginas leen los recibos con
  `publicRecibo(id)` de `src/lib/recibos.ts`, que devuelve solo `value`, `label` y `origin`.
- Ningún recibo trae precios internos, datos de clientes, placas ni datos de empleados.
- Enzo y Arkhē van separados (`negocio`), como pide `CLAUDE.md` §3.2.
- Las rutas son relativas a `proyectos-vibe-coding/`. Los números de línea son los del día de
  creación; si el archivo cambia, se busca la cita textual.

## Cifras publicables

### 1. Espera de recogida · `espera-recogida` · Enzo

- **Valor:** aprox. 8 días esperando al cliente con el carro listo, frente a unos 3 días de trabajo.
- **Cómo se calculó:** el día que se agregaron los tiempos como KPI se midió el promedio de las
  órdenes entregadas en los 30 días anteriores con `taller_dashboard_stats`: recibido → listo =
  2,9 días; listo → entregado = 7,9 días. Redondeado a 3 y 8.
- **Fuente:** `second-brain/projects/cotizador-enzo/README.md#L726-L734` ("Medición real al
  implementarlo: 2,9 días de trabajo vs 7,9 esperando al cliente"); cálculo en
  `second-brain/projects/cotizador-enzo/supabase/migrations/20260819_tiempos_taller.sql`
  (ventana `interval '30 days'`, `avg`).
- **Fecha de la evidencia:** 2026-08-18.
- **Para qué sirve en la página:** respalda la pieza de aviso y seguimiento. El cuello no era el
  trabajo, era que el carro listo se quedaba esperando.

### 2. Entregas registradas · `entregas-con-acta` · Enzo · inferido

- **Valor:** aprox. 80 entregas registradas en el sistema del taller.
- **Cómo se calculó:** **inferido**. Es el denominador de una medición del 2026-09-24 sobre las
  fotos de salida ("las fotos de salida se tomaban en 2 de 78 entregas"). No es un conteo hecho
  para este recibo y el registro no fija la ventana. 78 redondeado a 80.
- **Origen público:** "según una revisión del sistema de Enzo, sep 2026".
- **Fuente:** `second-brain/projects/cotizador-enzo/log.md#L364`.
- **Fecha de la evidencia:** 2026-09-24.
- **Cuidado al redactar:** el registro no dice cuántas de esas 78 tienen acta firmada por el
  cliente; la etiqueta solo dice "registradas".

### 3. Fotos de salida antes del cambio · `fotos-salida-antes` · Enzo

- **Valor:** aprox. 3 % de las entregas tenía fotos de salida antes de que el sistema las pidiera.
- **Cómo se calculó:** 2 de 78 = 2,6 %, redondeado a 3 %. Ese mismo cambio hizo que la entrega
  pida las tomas de salida que tienen foto de ingreso y que saltarlas exija motivo y PIN.
- **Fuente:** `second-brain/projects/cotizador-enzo/log.md#L364`.
- **Fecha de la evidencia:** 2026-09-24.
- **Para qué sirve:** es una cifra del "antes", honesta. Muestra por qué la entrega con fotos tiene
  que estar en el flujo y no depender de la memoria.

### 4. Inspección final de 18 a 5 puntos · `inspeccion-puntos` · Enzo · exacto

- **Valor:** de hasta 18 a 5 puntos (`kind: "exacto"`, sin "aprox.").
- **Cómo se calculó:** regla de diseño, no medición. La lista se armaba por servicio y llegaba a
  18 ítems (un polarizado sacaba 10, dos de ellos no aplicaban). Omar la reemplazó por los mismos
  5 puntos para todo vehículo. El 18 es el máximo que alcanzaba, por eso el valor dice "de hasta".
- **Fuente:** `second-brain/projects/cotizador-enzo/src/constants/taller.js#L502-L505`; también
  `second-brain/projects/cotizador-enzo/README.md#L633`.
- **Fecha de la evidencia:** 2026-08-03 (fecha del comentario; commit `6c66972f` del 2026-08-04).

### 5. Órdenes del taller · `ordenes-taller` · Enzo · inferido

- **Valor:** aprox. 100 órdenes de taller en el sistema de Enzo.
- **Cómo se calculó:** **inferido**. Es el denominador de una auditoría de teléfonos en producción
  del 2026-09-17 ("46 de 106 ordenes del taller"). No es un conteo hecho para este recibo y no dice
  qué estados incluye. 106 redondeado a 100.
- **Origen público:** "según una revisión del sistema de Enzo, sep 2026".
- **Fuente:** `second-brain/projects/cotizador-enzo/log.md#L349`.
- **Fecha de la evidencia:** 2026-09-17.

### 6. Garantías · `garantias-registradas` · Enzo · inferido

- **Valor:** aprox. 500 garantías en el sistema de Enzo.
- **Cómo se calculó:** **inferido**. Es el denominador de una medición de teléfonos sin aplicar del
  2026-09-17 ("garantias 367 de 497"), que pudo contar solo las filas con teléfono. No es un conteo
  hecho para este recibo. Incluye garantías históricas ingresadas a mano; no todas están aprobadas
  ni publicadas en enzomotorsport.co/garantia. 497 redondeado a 500.
- **Origen público:** "según una revisión del sistema de Enzo, sep 2026".
- **Fuente:** `second-brain/projects/cotizador-enzo/log.md#L349`.
- **Fecha de la evidencia:** 2026-09-17.
- **Cuidado al redactar:** no decir "publicadas" ni "por placa". La web solo muestra las aprobadas
  (`README.md#L600`).

Los tres inferidos (2, 5 y 6) no se contaron contra ninguna base para esta tarea. Si Omar quiere
afirmarlos con más fuerza, hace falta un conteo de solo lectura hecho a propósito y fechado aquí.

### 7. Encuesta en 40 segundos · `encuesta-segundos` · Enzo

- **Valor:** aprox. 40 s para responder: 4 preguntas, solo 2 obligatorias.
- **Cómo se calculó:** estimado de diseño escrito al mudar la encuesta NPS al sitio, con el largo
  calibrado por la referencia de Survicate. **No es un tiempo cronometrado a clientes**; el
  `origin` lo dice ("estimado al diseñar la encuesta de Enzo").
- **Fuente:** `grupo-enzo/enzo-motorsport/log.md#L245`.
- **Fecha de la evidencia:** 2026-08-01.

### 8. Cotización de 20 a 2 minutos · `cotizacion-minutos` · Enzo (recibo actual del home)

- **Valor:** aprox. 20 → 2 min para armar una cotización, del Excel al cotizador de Enzo.
- **Cómo se calculó:** número escrito por Omar en el inventario de casos (caso E1): "tiempo de
  cotización de ~20 min → 2 min". Es su estimado de operador; el cotizador no cronometra.
- **Cuidado al redactar:** no decir que el equipo entra al cotizador con su PIN. El inventario es de
  abril de 2026 y desde el 2026-08-12 los PINs del equipo de Enzo ya no abren la app: sirven para el
  kiosco y para firmar (`CLAUDE.md` raíz, §3.2).
- **Fuente:** `second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md#L17`.
- **Fecha de la evidencia:** 2026-04-21 (fecha de actualización del inventario).

### 9. P&L de Arkhē de 1,5 h a 10 min · `pl-arkhe` · Arkhē (recibo actual del home)

- **Valor:** aprox. 1,5 h → 10 min para leer el P&L del mes.
- **Cómo se calculó:** número escrito por Omar en el inventario (caso A2): "El P&L de Arkhē lo leo
  en 10 min con Claude. Antes: 1.5 horas con el contador." Estimado propio, sin medición en sistema.
- **Fuente:** `second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md#L82`.
- **Origen público:** "estimado de Omar sobre el P&L de Arkhē, abr 2026".
- **Fecha de la evidencia:** 2026-04-21.
- **Nota:** el home hoy lo escribe "1.5 h"; en español va "1,5 h".

## Los cuatro recibos actuales del home

| Recibo del home | Negocio | ¿Tiene fuente? | Qué hacer |
|---|---|---|---|
| "20 → 2 minutos" · cotización Enzo | enzo | Sí: inventario `#L17`. Es estimado de Omar, no medición | Se queda, con origen "estimado de Omar…". Ver recibo 8 |
| "10 horas / semana" · reporte Grupo Enzo | grupo | Sí, pero vencida: inventario `#L29` ("2h/día ahorradas → 10h/semana") | **No publicar.** Ver abajo |
| "1.5 h → 10 min" · P&L Arkhē | arkhe | Sí: inventario `#L82`. Estimado de Omar | Se queda como "aprox. 1,5 h → 10 min". Ver recibo 9 |
| "$19,9M al mes" · dependencia/operación | enzo | Sí: `second-brain/CLAUDE.md#L265` (alerta 1) e inventario `#L54` | **No publicar.** Ver abajo |

## Cifras con fuente que no se recomiendan

- **"10 horas / semana" (reporte, grupo).** La cifra existe en
  `07-inventario-casos.md#L29` (caso E2, bot de Telegram del reporte diario), pero ese bot se apagó
  el 2026-07-12 y el copiloto v2 se eliminó el 2026-07-29 (`CLAUDE.md` raíz, §3 legacy,
  `enzo-telegram-report`). Mostrarla en presente describe un sistema que ya no corre. Además es un
  estimado (2 h/día) sin medición. Si se quiere un recibo de reportes, hace falta una medición nueva
  del tablero que lo reemplazó.
- **"$19,9M al mes" (dependencia, enzo).** Tiene fuente (`second-brain/CLAUDE.md#L265`, alerta 1,
  e inventario `#L54`), pero describe a una persona del equipo y su facturación. Choca con "cero
  datos de empleados" y con no mostrar cifras internas. Tampoco trae fecha de medición.
- **Respuestas NPS.** La ventana de julio a septiembre de 2026 dio 11 respuestas
  (`second-brain/projects/cotizador-enzo/log.md#L397`; `README.md#L1131` dice que no llega a 20).
  Es real, pero frente a las aprox. 80 entregas registradas a septiembre deja ver una muestra pequeña y
  una tasa de respuesta baja. No sirve como prueba de que el sistema funciona.
- **37 órdenes con foto del baúl** (`README.md#L720`, 2026-09-10). Real, pero describe un bug
  corregido (la foto no cargaba en el link del cliente), no un resultado.
- **28 entregas históricas marcadas al desplegar la posventa** (`README.md#L576`, 2026-08-23) y
  **89 garantías aprobadas en el backfill** (`README.md#L606`, 2026-08-18). Son conteos de
  migración; los recibos 2 y 6 ya cubren lo mismo con datos más recientes.

## Hechos exactos que no van como recibo

Son ciertos y ya los usa el contenido del producto (Task 8). Son reglas de diseño exactas, no
cifras aproximadas: ponerles "aprox." las falsearía. Si una página los quiere como recibo, entran
con `kind: "exacto"`, como el recibo 4.

- **8 fotos obligatorias en la recepción**, en una sola vuelta al carro:
  `second-brain/projects/cotizador-enzo/src/components/taller/capturaSecuencia.js` y
  `README.md#L704-L716` (sesión 2026-09-10). Antes eran 7; el baúl entró el 2026-08-17.
- **5 puntos de la inspección final:** `src/constants/taller.js#L512-L538` del cotizador.

## Buscadas y sin fuente

- **Tiempo de recepción con fotos (minutos por carro).** Ningún archivo lo mide.
- **Porcentaje de entregas con firma del cliente en pantalla** frente a firma manual. El acta admite
  las dos (`ActaEntregaDocument.jsx`, `firmaUrl = null` → línea de firma manual) y ningún registro
  las cuenta por separado.
- **Consultas a la Garantía Digital por placa** en enzomotorsport.co. No hay conteo en los logs.
- **NPS promedio o puntaje.** No aparece un valor agregado en los archivos revisados.
- **Reseñas en Google conseguidas por el pedido posventa.** Sin dato.
- **Reclamos de garantía evitados o retrabajos.** Existe el registro (`README.md`, "Datos de calidad
  del taller"), pero no un conteo publicado.

Si Omar quiere alguna de estas, se mide primero (consulta de solo lectura o conteo en el tablero) y
se agrega aquí con su fecha antes de que llegue a la página.
