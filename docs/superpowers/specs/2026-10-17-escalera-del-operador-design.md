# Spec · omaralvarezo.co vende "El sistema de Enzo"

- **Fecha:** 2026-10-17
- **Estado:** listo para aprobación de Omar (incluye la ronda de aclaración del 17 oct)
- **Fuentes:**
  - la conversación del 16–17 oct 2026;
  - `reports/Monetización autónoma del directorio IA.md`;
  - `CLAUDE.md`;
  - `wiki/decisiones/directorio-herramientas-ia.md`;
  - `wiki/decisiones/rutina-editorial-herramientas-ia.md`;
  - `wiki/decisiones/ofertas-directorio-herramientas-ia.md`.

---

## 1. Intención y por qué

Hoy el home vende una sola cosa, la sesión privada de 2 horas. `/herramientas-ia` es un
directorio aparte que espera que le paguen fabricantes de herramientas.

La investigación del 16 oct concluyó que el caso de Alex Finn vendió patrocinios gracias a ~500.000
seguidores en X, no a la autonomía de su bot. Un directorio nuevo en español no va a vender
patrocinios hasta que tenga una lista de correo con números.

**Tesis (acordada con Omar el 17 oct).** Los primeros que pagan son **dueños de pymes de servicios
en Latinoamérica**. Ven a Omar operar sistemas reales en Enzo y Arkhē y quieren lo mismo, sin tener
que averiguarlo solos. Ningún directorio gringo puede vender esa prueba.

**La restricción que manda: Omar tiene 1 hora a la semana.** La página no puede vender nada que
dependa de su tiempo. Vende lo que el comprador instala solo, y deja en lista de espera lo que
pide a Omar en persona.

En consecuencia:

- **El home vende la forma de operar de Omar.** Desde ahí lleva a los productos.
- **El primer producto es "El sistema de Enzo" para detailing.** Resuelve el dolor que Omar eligió:
  **ordenar las entregas**. Un producto por oficio; detailing va primero porque es el que Omar
  opera y tiene más prueba.
- **El directorio es la vitrina.** Trae visitas de Google y de los chatbots y las convierte en
  correos.
- **Cada video que Omar graba se usa tres veces:** en redes, como nota en la web y en el boletín.

**Éxito a 90 días: 30 ventas de "El sistema de Enzo"**, unos $5.370.000.

Es una meta exigente para un sitio sin tráfico propio. Estimación mía, no de fuente: con una
conversión de 1% a 3% en la página del producto hacen falta entre 1.000 y 3.000 visitas a esa
página en 90 días. Casi todas tienen que venir de TikTok e Instagram. Por eso el pipeline de video
(§10) es la siguiente pieza después de este spec, y no algo que pueda esperar.

Este spec cubre **la página web y el primer producto**. Video, agente, Zernio, envío del boletín y
patrocinios tienen specs propios (§10).

## 2. Objetivos

1. El home muestra cómo opera Omar y desde ahí lleva a una escalera clara:
   **PDF gratis → kit $81.000 → El sistema de Enzo $179.000 → lista de espera**.
2. "El sistema de Enzo" para detailing **se puede comprar en preventa** desde el primer
   lanzamiento. Guía y plantillas se entregan al pagar; los videos llegan después.
3. Quien busca algo que pide tiempo de Omar (instalación o sesión) o un sistema para otro oficio
   se anota en una lista de espera. Así se mide la demanda sin prometer nada.
4. Cada video de TikTok puede mandar a un destino distinto con una dirección fácil de decir.
5. Hay un lugar donde aterriza cada video aprobado (la bitácora) y un boletín semanal al que la
   gente se suscribe.
6. Se puede medir visitas, clics y ventas del producto para el reporte de los lunes.

## 3. No-objetivos

- Edición de video, publicación en redes, agente, crons y Zernio: spec propio.
- Envío del boletín: aquí solo va el formulario y la autorización.
- Cobro recurrente, patrocinio de cupo único y renovaciones: spec propio.
- Productos para otros oficios (coworking, café y demás): se abren después, según la lista de
  espera.
- Activar anuncios de AdSense.
- La sesión de 2 horas: sale del sitio por ahora (§6.2).

## 4. Anti-objetivos y límites de Omar

Estas cosas son fracasos aunque la página funcione. Los cuatro primeros los marcó Omar como
vergonzosos el 17 oct.

- **Lenguaje de gurú:** "hazte rico", "transforma tu negocio", urgencia falsa, contadores,
  escasez inventada.
- **Prometer resultados:** "vas a vender el doble" o cualquier cifra que Omar no pueda garantizar
  al comprador. Las cifras de Omar son de sus negocios, no una promesa para otro.
- **Recomendar herramientas que Omar no usa.** Las comisiones de afiliado son solo de herramientas
  que Omar usa en Enzo o Arkhē (§6.6).
- **Mostrar precios internos:** lo que cobra Enzo o Arkhē por cada servicio. Las plantillas del
  producto llevan precios de ejemplo marcados como ejemplo.
- **Inventar:** un sistema, una métrica, un cliente o un testimonio que no exista.
- **Cargar scripts de terceros** en las páginas: embeds de TikTok o Instagram, widgets, anuncios.
- **Hacer "sopa de cards".** Cada bloque lleva su propia composición, con la dirección de arte
  vigente.
- **Romper lo que ya cobra:** directorio y kit siguen funcionando igual.

## 5. Restricciones

- **Base: `origin/main`**, verificado el 17 oct. Ahí ya están la v3.5 (PR #22), la preparación de
  AdSense (#24) y el pub-ID (#27), sobre Astro 7, Tailwind 4 y adapter de Vercel 11. El `main`
  local y la copia de trabajo están atrasados. Antes de construir: revisar esa diferencia,
  descartarla o rescatarla con Omar, y crear la rama nueva desde `origin/main`.
- **Invariantes del formulario** (`CLAUDE.md`): validación en servidor con `CONTACT_LIMITS`,
  honeypot, rate limit, respaldo `mailto:`, remitente y destino. Cualquier campo nuevo sigue las
  mismas reglas en el navegador y en `/api/contacto`.
- **Dirección de arte "Sistema vivo / taller abierto":**
  - se mantienen la paleta, las tres tipografías, el motion sin scrolljacking y el reduced
    motion;
  - los colores coral, púrpura, cobalto y lima dejan de nombrar las 4C, pero siguen marcando
    estado o capítulo.
- **Trato de tú**, en primera persona de Omar, con la voz de `CLAUDE.md` → *Voz*. Sin voseo.
- **Pesos colombianos primero**, con referencia en dólares para el resto de Latinoamérica
  (`$179.000 · aprox. USD 55`).
- **Reglas de Colombia:**
  - lo pagado o de afiliado se marca en español ("Enlace de afiliado", "Pagado por la
    herramienta"), con `rel="sponsored"`, según la guía SIC y la Ley 1480;
  - el boletín pide autorización expresa (Ley 1581);
  - **nadie del equipo de Enzo o Arkhē aparece** en la página ni en videos hasta firmar la
    autorización de uso de imagen. Ese formato se prepara aparte (§9);
  - placas, caras de clientes, nombres y números en chats van tapados.
- **Sin media cruda en git.** Ni videos en bruto ni los del producto. Los videos del producto se
  alojan fuera del repo (§6.4).
- **Checklist de publicación de `CLAUDE.md`:**
  - sin overflow a 390 px ni a 1440 px;
  - cero errores de consola;
  - el hero termina en su estado final, también con reduced motion;
  - ningún pago real durante el QA automático.

## 6. Qué se construye

### 6.1 La escalera: una sola fuente

Un módulo de datos (por ejemplo `src/lib/ladder.ts`) define cada escalón con estos campos:

- `id`
- nombre
- para quién es
- qué recibe
- precio en pesos o `null`
- referencia en dólares
- tipo de acción
- destino

Home, sistemas, directorio, bitácora y `/tiktok` leen de ahí. Ninguna página escribe un precio a
mano.

| Escalón | Precio | Acción | Estado |
|---|---|---|---|
| PDF de prompts | gratis | dejar el correo | existe, sin cambios salvo la casilla del boletín (§6.7) |
| Kit para talleres | $81.000 | comprar (Wompi) | existe, sin cambios. Es el escalón barato: mensajes, prompts y flujos sueltos |
| **El sistema de Enzo · detailing** | **$179.000** | **comprar en preventa (Wompi)** | **nuevo, escalón principal** |
| Lista de espera | — | anotarse | nueva: instalación, sesión de 2 horas o el sistema para otro oficio |

**Kit y producto conviven** (decisión mía, delegada por Omar). El kit son piezas sueltas. El
sistema es el flujo completo de entregas, con videos. La página del sistema dice en una línea en
qué se diferencian, para que nadie compre el equivocado.

### 6.2 Home

**Qué vende:** la forma de operar de Omar (decisión de Omar). El producto aparece como
consecuencia, no como primer mensaje.

| Sección actual | Qué pasa |
|---|---|
| Hero con animación de las 4C | **Se cambia.** Nueva animación del mismo estilo code-native: el desorden de un negocio de servicios que se ordena en tres pasos, **recibir → hacer → entregar**. Mismas reglas de motion (scroll nativo, sticky, `requestAnimationFrame` solo visible, reduced motion muestra el estado final). Sin precio |
| Taller abierto + recibos | Se queda. Los recibos siguen la regla de cifras (§6.8) |
| Principio | Se queda |
| **Marco 4C** | **Se quita** (decisión de Omar) |
| Rail de sistemas (Enzo, Arkhē, Adjudika, Grupo) | Se queda. El caso Enzo enlaza a `/sistemas/detailing` |
| Sesión, encaje, costo | **Se quitan.** La sesión sale del sitio por ahora |
| — | **Nueva: "El sistema de Enzo".** Qué resuelve (entregas sin olvidos), las cuatro piezas, precio, preventa y botón. Composición propia, no una card |
| — | **Nueva: escalera.** PDF → kit → sistema → lista de espera, como recorrido visual con el sistema resaltado |
| FAQ | Se reescribe para el producto y la lista de espera: qué incluye, qué herramientas pide y cuánto cuestan al mes, cuándo llegan los videos, garantía, pago desde fuera de Colombia, por qué no hay instalación ni sesión ahora |
| Contacto (`#contacto`) | **Se vuelve lista de espera** (§6.5) |

La navegación cambia su CTA final de "reservar 2 horas" a "ver el sistema de Enzo".

En `ConsultingContact.astro` se retiran el brief 4C y el campo `frameworkStage`, con su validación
en servidor.

El JSON-LD del home deja de describir la sesión como servicio ofrecido y agrega el producto.
`src/lib/schema.ts` cambia en consecuencia.

Las redirecciones viejas de `/consultoria/*` pasan a apuntar a `/#lista-de-espera`, o a donde
quede el formulario.

### 6.3 Página del producto: `/sistemas/detailing`

Es la página que vende. Vive en una colección nueva, `src/content/sistemas/`, validada con
esquema. El índice `/sistemas` lista los oficios con sistema y, debajo, "¿Lo quieres para tu
oficio? Anótate", que enlaza a la lista de espera con el oficio preseleccionado.

**Qué tiene la página:**

1. **El problema.** En un negocio de servicios, la entrega es donde se pierden la plata y la
   confianza: no queda constancia de cómo llegó el carro, se olvida un paso, no hay firma, nadie
   hace seguimiento.
2. **Cómo lo resolvió Enzo.** Con pantallas reales y cifras aproximadas (§6.8). La base son los
   sistemas que ya operan:
   - la inspección con firma del cotizador;
   - la Garantía Digital por placa de enzomotorsport.co;
   - la encuesta NPS.
3. **Las cuatro piezas** que trae el producto, en el orden del trabajo:
   1. **Recepción con fotos:** constancia de cómo llegó el vehículo o el trabajo.
   2. **Checklist del trabajo:** pasos que el equipo marca para que nada se olvide.
   3. **Entrega con firma:** acta que el cliente acepta.
   4. **Aviso y seguimiento:** "ya está listo", garantía, posventa y pedido de reseña.
4. **Con qué se monta.** Omar eligió "lo mejor, cueste lo que cueste": el producto usa las mejores
   herramientas para cada pieza, aunque sean pagas. La página muestra, antes de comprar, **cuánto
   cuesta al mes cada herramienta**, con la fecha de consulta. Si una herramienta es la que usa
   Enzo, lo dice; si es una alternativa, también. Cada herramienta tiene que estar en el
   directorio, con su slug validado.
5. **Qué recibes:**
   - **al pagar:** guía paso a paso (PDF) y plantillas (checklist, acta, mensajes, formularios,
     flujos exportables);
   - **en preventa:** videos cortos de Omar, uno por pieza más uno de recorrido.
6. **Precio:** $179.000, aprox. USD 55. Pago único, sin mensualidad con Omar.
7. **Preventa.** La página muestra la fecha límite de entrega de los videos, que fija Omar.
   Antes de esa fecha, el comprador recibe guía y plantillas y luego los videos. Si los videos no
   llegan en la fecha, se le devuelve la plata.
8. **Garantía de 7 días** (decisión mía, delegada por Omar). Si no te sirve, escribes en los 7 días
   siguientes a la compra diciendo qué no te sirvió y se te devuelve la plata. **Omar hace la
   devolución a mano**; el agente nunca devuelve plata. Lo que digan los compradores alimenta la
   siguiente versión.
9. **Preguntas frecuentes** y botón de compra.

**Contenido del producto.** Lo arma el constructor a partir de los sistemas reales de Enzo:

- repos `grupo-enzo/enzo-motorsport/` y `second-brain/projects/cotizador-enzo/`;
- sin datos de clientes, sin llaves y sin precios internos de Enzo;
- adaptado para que lo monte otro negocio con las herramientas elegidas.

Omar lo revisa y graba los videos dentro de su hora semanal. El archivo del producto vive fuera
del repo público o se genera al vuelo, como el PDF y el zip del kit.

**Venta y entrega: se reutiliza la infraestructura del kit.**

- **Referencias:** se generaliza a producto la que hoy está fija en `talleres`, por ejemplo
  `oa-kit-{producto}-q…`. Así Adjudika, que ya reenvía `oa-kit-*`, la sigue reenviando y Omar no
  tiene que configurar nada nuevo en Wompi. El webhook `/api/herramientas/evento` resuelve la
  orden por producto.
- **Lo que no cambia:** órdenes en Upstash, cookie del comprador, código de descarga y aviso a
  Omar por Resend.
- **Videos:**
  - van en un alojamiento privado o no listado (por ejemplo, YouTube no listado o un almacenamiento
    con enlace firmado; lo decide el constructor);
  - se entregan en la página de pedido del comprador cuando existen;
  - el comprador recibe un correo cuando se publican.
- **Precio:** $179.000 no sale de la regla USD × $3.230 que valida `kit.ts`; Omar lo eligió en
  pesos. La validación del monto se ajusta por producto para aceptar un precio fijo en pesos.

**Compradores de fuera de Colombia.** Hay que verificar con Wompi si acepta tarjetas emitidas
fuera de Colombia.

- **Si las acepta,** la FAQ lo dice.
- **Si no las acepta,** la página lo dice sin rodeos y ofrece la lista de espera con el país, para
  medir si vale la pena otro medio de pago. No se integra otra pasarela en este spec.

**Términos.** `/terminos` agrega las condiciones del producto: preventa con fecha y devolución si
no se cumple, y garantía de 7 días. Esa garantía reemplaza, para este producto, la excepción de
retracto por "archivo descargado".

### 6.4 Videos del producto y de la bitácora

Los videos del producto no se versionan. Los de la bitácora tampoco se embeben: la nota enlaza al
video en TikTok o Instagram y, si existe, muestra un póster liviano.

### 6.5 Lista de espera (el formulario del final)

El formulario de contacto se convierte en **lista de espera**. Pide:

- nombre, correo y WhatsApp opcional;
- negocio;
- **qué quieres**, una opción: que te instale el sistema / una sesión privada / el sistema para
  otro oficio / tengo una pregunta del sistema de Enzo;
- **oficio**, de una lista cerrada (§6.5.1);
- **país**;
- un campo libre de máximo 600 caracteres.

Se mantienen los invariantes: servidor valida todo, honeypot, rate limit, Resend, `mailto:` de
respaldo y no se borra lo escrito si falla. Los enlaces `/#lista-de-espera?quiero=instalacion`
llegan con la opción preseleccionada. El copy es honesto: "Hoy no estoy tomando instalaciones ni
sesiones. Si te anotas, te escribo cuando abra cupo. Si es una pregunta del sistema, te respondo
por correo."

#### 6.5.1 Catálogo de oficios y países

`src/data/oficios.json` es la lista cerrada que comparten la lista de espera, `sistemas` y la
bitácora:

- detailing
- taller de carros
- coworking
- café o restaurante
- clínica o consultorio
- inmobiliaria
- peluquería o estética
- otro, con texto libre de máximo 60 caracteres

Los países son los de Latinoamérica más "otro". El servidor valida contra las dos listas. Una nota
de bitácora acepta cualquier oficio del catálogo, tenga o no sistema.

### 6.6 Directorio

- **Listado ($94.000) y Destacado ($159.000) se siguen vendiendo** (mi recomendación, delegada por
  Omar): ya están montados y no le cuestan tiempo. En la ficha y en el listado van marcados
  "Pagado por la herramienta". Una herramienta que pagó no recibe "así lo uso yo" ni aparece como
  recomendada, salvo que Omar de verdad la use.
- **El Patrocinio ($482.000) se pausa** en `/destacar`. Lo que esté vigente corre hasta su fecha y
  el plan vuelve en su propio spec.
- **"Así lo uso yo"** es un campo opcional en `tools.json`: texto corto más enlace al sistema donde
  se usa. Lo aceptan `tool:add` y `tool:check`.
- **Afiliados** son campos opcionales `affiliateUrl` y `affiliateProgram`. Reglas:
  - **solo se permiten si la herramienta tiene "así lo uso yo"**, porque comisión solo de
    herramientas que Omar usa, y `tool:check` lo exige;
  - el enlace usa `rel="sponsored noopener"` y la etiqueta "Enlace de afiliado";
  - la URL es https y su dominio es el de la herramienta o el de una red permitida (PartnerStack,
    Impact y las que se agreguen).
- **Escalera compacta** en el índice y las fichas, con el PDF como entrada y el sistema de Enzo
  como siguiente paso.

### 6.7 Boletín "Bitácora del operador", semanal

- Un mismo formulario en home, directorio, sistemas y bitácora, con casilla de autorización y
  enlace a `/privacidad`.
- **Sin proveedor elegido,** el suscriptor queda en Upstash bajo
  `oa:news:{test|production}:email:{sha256}`, con fecha, página de origen y versión del texto
  de autorización, listo para importar después.
- **El formulario del PDF** gana una casilla opcional y desmarcada: "Quiero recibir la Bitácora
  del operador".
- **Los correos del PDF que ya existen no entran al boletín**, porque autorizaron la descarga y no
  el boletín (Ley 1581). `/privacidad` agrega la finalidad "boletín" a su tabla.
- El envío semanal queda para su propio spec, dentro del horario de la Ley 2300.

### 6.8 De dónde salen las cifras

Omar delegó el cálculo ("sácalas tú aprox") y autorizó mostrar cifras de plata aproximadas.

1. **Fuentes.** Cada cifra sale de evidencia que exista en los repos del grupo:
   - el cotizador;
   - `grupo-enzo/enzo-motorsport/` y `grupo-enzo/arkhe/`;
   - los `log.md` y reportes de cada uno;
   - `second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md`.
2. **Registro.** Cada cifra queda en `wiki/sintesis/recibos-operativos.md`, con frontmatter, con
   su valor, cómo se calculó, la ruta de la fuente y la fecha. Ahí entran también los cuatro
   recibos actuales del home.
3. **Presentación.** En la página va con "aprox." y una línea corta de origen, por ejemplo
   "medido en el cotizador de Enzo, oct 2026". Sin rutas privadas ni datos de clientes. Respeta la
   separación Enzo/Arkhē de `CLAUDE.md` §3.2 y el límite de no mostrar precios internos (§4).
4. **Sin fuente no entra.** Si un recibo del home no encuentra fuente, se cambia por uno que la
   tenga o se quita.
5. **Publicación.** Una página pasa a `draft: false` cuando todas sus cifras están en la síntesis.
   Omar puede corregirlas después.

**Valeria se presenta como lo que es:** atiende el chat de enzomotorsport.co; el WhatsApp sigue
en piloto.

### 6.9 `/tiktok` y direcciones cortas

Omar quiere que cada video mande a un destino distinto.

- **`/tiktok`** es la página que va en la bio. Es corta, rápida en celular y sin scripts de
  terceros. Muestra arriba el destino del momento (al lanzar, el sistema de Enzo) y debajo el PDF,
  el kit y la bitácora.
- **Direcciones cortas**, fáciles de decir en un video. Se definen en un solo archivo de datos y
  cada una redirige con su origen marcado para medir:
  - `omaralvarezo.co/entregas` → sistema de Enzo;
  - `/prompts` → PDF;
  - `/kit` → kit;
  - `/lista` → lista de espera.

Los nombres finales los ajusta el constructor si chocan con rutas existentes.

### 6.10 Bitácora: `/bitacora`

Es una colección nueva, `src/content/bitacora/`, con una nota por video aprobado.

**Campos de cada nota:**

- título y fecha;
- oficio y negocio;
- `description` como primera respuesta;
- transcripción limpia;
- enlace al video;
- póster opcional;
- herramientas mencionadas (slugs validados);
- sistema relacionado;
- dirección corta usada.

**Publicación:**

- Las notas nacen con `draft: true`. Este spec deja colección, plantilla, índice y
  `npm run content:new:bitacora`; el agente las llenará después.
- `content:check` exige transcripción, enlace https y oficio válido.

### 6.11 Medición

El sitio no tiene analítica. Se agrega Vercel Web Analytics, que va por el mismo origen y no cambia
la CSP. Eventos:

- `escalon_click`
- `sistema_checkout_iniciado`
- `sistema_comprado` (desde el webhook o la página de pedido)
- `lista_espera_enviada`, con opción, oficio y país
- `boletin_suscrito`
- `kit_checkout_iniciado`
- `link_corto`, con la dirección usada

Si el plan de Vercel no permite eventos personalizados, quedan solo las visitas, se anota como
pendiente y las ventas se cuentan desde Upstash. El constructor lo verifica primero.

### 6.12 Limpieza y documentación

- AdSense queda como en `main`: solo la meta de verificación, sin script de anuncios ni espacios
  reservados.
- `/recursos` (heredado) no se toca.
- **`CLAUDE.md` del proyecto se reescribe como v4.0:** oferta, recorrido, arquitectura del home e
  invariantes del formulario, sin consultoría. Se actualizan también `index.md` y `log.md`, y se
  agrega `wiki/decisiones/sistema-de-enzo.md`.

## 7. Orden de salida: por partes, lo antes posible

**Salida 1 · se puede vender.**

- home recentrado: sin sesión ni 4C, con la sección del sistema, la escalera, la lista de espera y
  la FAQ nueva;
- `/sistemas/detailing` con preventa;
- checkout del producto sobre la infraestructura del kit;
- guía y plantillas listas para entregar;
- términos actualizados;
- `/tiktok` y direcciones cortas;
- medición.

En esta salida el hero puede quedar con la animación actual, sin nombrar las 4C, si la nueva no
está lista. No bloquea la venta.

**Salida 2.** Animación nueva del hero y recibos con fuente en el home.

**Salida 3.** Directorio: etiquetas de pagado, "así lo uso yo", afiliados, patrocinio en pausa y
escalera compacta.

**Salida 4.** Bitácora y boletín.

Cada salida es un PR propio con checks verdes, preview de Vercel y capturas a 390 px y 1440 px.

## 8. Lo que queda a criterio del constructor

- Nombres de archivos y componentes, dentro de la estructura de `src/`.
- Composición visual de cada sección nueva, dentro de la dirección de arte.
- Dónde se alojan los videos del producto, con dos condiciones: privados o no listados, y fuera
  del repo.
- Las herramientas exactas de cada pieza del producto: las mejores para un detailing, con costo
  mensual visible y fechado.

## 9. Lo que tiene que hacer Omar

| Qué | Cuándo |
|---|---|
| Fijar la fecha límite de entrega de los videos de la preventa | antes de la salida 1 |
| Revisar la guía y las plantillas del producto | antes de la salida 1 |
| Grabar los videos del producto (unos 5 cortos), dentro de su hora semanal | antes de la fecha de preventa |
| Confirmar con Wompi si acepta tarjetas de fuera de Colombia, o autorizar que el constructor lo pruebe en sandbox | antes de la salida 1 |
| Firmar las autorizaciones de imagen del equipo (el formato se prepara aparte) | antes de que alguien del equipo salga en un video |
| Hacer las devoluciones de la garantía, si llegan | cuando pase |
| Elegir proveedor del boletín | puede esperar; mientras tanto se guarda en Upstash |

## 10. Specs que siguen

1. **Pipeline de video en el Mac.** Es el más urgente, porque de él depende la meta de 30 ventas.
   Omar graba casi siempre a cámara y copia al disco externo, en la carpeta `Entrada`. De ahí
   salen transcripción local, corte, subtítulos con la marca, carpeta `Listos` y vista previa en
   Telegram. Omar **aprueba un poco cada día**, 2 o 3 minutos.
2. **Agente operador:** un solo agente en Claude Code con rutinas separadas por permisos.
   Compuertas: dinero (nunca cobra, devuelve ni cambia precios), publicación (todo con aprobación)
   y código (PR + merge humano).
3. **Zernio:** borradores en TikTok y Reels en Instagram, con la dirección corta de cada video.
4. **Boletín semanal:** envío dentro del horario de la Ley 2300 y archivo público.
5. **Autorización de imagen del equipo:** formato legal colombiano para empleados de Enzo y Arkhē.
6. **Patrocinio de cupo único y renovaciones** con fuentes de pago de Wompi.

## 11. Registro de decisiones (17 oct)

| Tema | Decisión | De quién |
|---|---|---|
| Horas por semana | 1 hora | Omar |
| Cliente | cualquier pyme de servicios de Latinoamérica, Colombia primero en precios | Omar |
| Primer paso del visitante | ver cómo opera Omar | Omar |
| Dolor del primer producto | ordenar las entregas | Omar |
| Producto | uno por oficio, detailing primero, se arma ya | Omar |
| Nombre | El sistema de Enzo | Omar |
| Precio | $179.000 | Omar |
| Piezas | recepción con fotos, checklist, entrega con firma, aviso y seguimiento | Omar |
| Herramientas | las mejores, aunque sean pagas | Omar |
| Formato | archivos + videos cortos | Omar |
| Preventa | sí; videos con fecha límite y devolución si no llegan | Omar (detalle mío) |
| Devolución | garantía de 7 días, la hace Omar a mano | mía, delegada |
| Kit | sigue aparte como escalón barato | mía, delegada |
| Sesión de 2 horas | se quita por ahora; queda en la lista de espera | Omar |
| Marco 4C | se quita | Omar |
| Animación del hero | se cambia: recibir → hacer → entregar | Omar |
| Qué vende el home | la forma de operar de Omar | Omar |
| Formulario final | lista de espera | Omar |
| Cara de Omar en videos | casi siempre | Omar |
| Qué se muestra | pantallas, carros y trabajos, equipo y chats, con datos tapados | Omar |
| Equipo en videos | solo después de firmar la autorización | mía, por ley |
| Cifras de plata | sí, aproximadas y con fuente | Omar |
| Límites | sin gurú, sin promesas, sin herramientas que no usa, sin precios internos | Omar |
| Directorio | listado y destacado siguen; patrocinio en pausa | mía, delegada |
| Comisiones | solo de herramientas que Omar usa | Omar |
| Boletín | semanal | Omar |
| Trato | de tú | Omar |
| Link de TikTok | depende del video: `/tiktok` y direcciones cortas | Omar (detalle mío) |
| Aprobaciones | un poco cada día | Omar |
| Fecha | lo antes posible, por partes | Omar |
| Meta a 90 días | 30 ventas del sistema | Omar |
