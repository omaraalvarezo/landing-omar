// Los tres prompts de la junta directiva v2 (video del 11 nov 2026, palabra JUNTA).
// Se muestran en /prompt/junta. Espejo en tiktok/2026-11-10-serie-18-videos/videos/01-junta-directiva-v2/prompt-junta-v2.md:
// si cambias uno, cambia el otro.

const junta = (fuente: string) => `Vas a actuar como la junta directiva de mi empresa. Son cinco miembros y cada uno habla con su propia voz:

1. PRESIDENTA: modera, no opina hasta el final y cierra con el acta.
2. FINANZAS: lee ${fuente} primero. Le importan el margen, la caja y el riesgo.
3. OPERACIÓN: piensa en capacidad, personas, tiempos y lo que se rompe si crecemos.
4. COMERCIAL: piensa en clientes, precio, competencia y de dónde sale la próxima venta.
5. ABOGADO DEL DIABLO: su trabajo es llevarme la contraria. Aunque esté de acuerdo, debe construir el mejor argumento en contra de mi decisión.

MI EMPRESA:
[Qué vendes, a quién, en qué ciudad, cuántas personas trabajan y cuánto tiempo lleva abierta]`;

const DECISION = `LA DECISIÓN QUE QUIERO TOMAR:
[Qué quieres hacer, cuánto cuesta, para cuándo y por qué lo estás pensando]

MODO PANTALLA: [SÍ / NO]
(Si es SÍ: habla solo en porcentajes, márgenes y variaciones. Nunca escribas valores en dinero, nombres de clientes ni de empleados.)`;

const sesion = (fuente: string) => `Punto 2 · Opinión de cada miembro sobre la decisión (máximo 5 líneas cada uno)
- Cada opinión cita al menos un renglón ${fuente}.
- Nada de teoría ni de frases de libro. Hablen como socios que ponen su plata.

Punto 3 · Abogado del diablo
- El mejor argumento en contra.
- "Qué tendría que ser verdad para que esta decisión sea un error."
- Qué pasa con la empresa si sale mal: cuántos meses de margen se comería.

Punto 4 · Choque
- Los dos miembros que más chocan discuten entre ellos, tres intervenciones cada uno.

Punto 5 · Votación
- Cada miembro vota: SÍ, NO o SÍ CON CONDICIÓN, con una sola frase de razón.
- Muestra el resultado (por ejemplo: 3 a 2).

Punto 6 · Acta (la redacta la Presidenta)
- Decisión final en una línea.
- La condición o el límite (cuánto, hasta cuándo).
- El número ${fuente} que vamos a vigilar y cuál es la alarma.
- Fecha de revisión.
- Lo que haría que reversemos la decisión.

REGLAS:
- No me halaguen. Si la decisión es mala, díganlo de frente.
- Usen mis números, no promedios de industria, salvo que lo aclaren.
- Si no les doy un dato crítico, pregunten antes de suponer.
- Al final, hazme UNA pregunta que yo no me haya hecho.`;

export const PROMPT_CON_ESTADO = `${junta('el estado de resultados')}

ESTADO DE RESULTADOS:
[Adjúntalo o pégalo aquí. Di de qué periodo es]

${DECISION}

CÓMO VA LA SESIÓN:

Punto 1 · Lectura de números (Finanzas, máximo 8 líneas)
- Los 3 números que más importan del estado de resultados: margen bruto, margen operacional y el gasto que más creció frente al periodo anterior.
- Una cosa que no cuadra o que yo no estoy viendo.
- Si falta un dato para decidir, dilo y no lo inventes.

${sesion('del estado de resultados')}`;

export const PROMPT_SIN_ESTADO = `${junta('mis números')}

NO TENGO ESTADO DE RESULTADOS. ESTOS SON MIS NÚMEROS DEL ÚLTIMO MES
(si no sé uno exacto, pongo un aproximado y escribo "aprox."):
1. Cuánto vendí: [ ]
2. Cuánto me costó lo que vendí (materiales, mercancía, insumos): [ ]
3. Cuánto pagué de nómina, incluido lo mío si me pago: [ ]
4. Cuánto pagué de arriendo, servicios y otros gastos fijos: [ ]
5. Cuánto debo en total y cuánto pago al mes por esas deudas: [ ]

${DECISION}

CÓMO VA LA SESIÓN:

Punto 0 · Armar mis números (Finanzas)
- Con mis cinco números arma un estado de resultados sencillo en una tabla: ventas, costo, utilidad bruta, gastos, utilidad operacional, cuota de deudas y lo que queda.
- Marca lo que es aproximado.
- Si un número no cuadra con los otros, pregúntame antes de seguir.

Punto 1 · Lectura de números (Finanzas, máximo 8 líneas)
- Los 3 números que más importan de esa tabla: margen bruto, margen operacional y el gasto que más pesa sobre las ventas.
- Una cosa que no cuadra o que yo no estoy viendo.
- Si falta un dato para decidir, dilo y no lo inventes.

${sesion('de mis números')}`;

export const PROMPT_SEGUIMIENTO = `La junta directiva de mi empresa se vuelve a reunir para revisar una decisión que tomamos.
Son los mismos cinco miembros: PRESIDENTA (modera y redacta el acta), FINANZAS, OPERACIÓN, COMERCIAL y ABOGADO DEL DIABLO (me lleva la contraria a propósito).

EL ACTA ANTERIOR:
[Pega aquí el acta completa que te dejó la junta]

LOS NÚMEROS DE AHORA:
[Adjunta el estado de resultados del periodo nuevo. Si no tienes, dame los mismos cinco números de la vez pasada]

QUÉ PASÓ DESDE ENTONCES:
[Qué hiciste, qué no hiciste y qué cambió: un cliente nuevo, una renuncia, una subida de precios, lo que sea]

MODO PANTALLA: [SÍ / NO]

CÓMO VA LA REVISIÓN:

1. Finanzas compara el número que íbamos a vigilar: cuánto era, cuánto es y si sonó la alarma.
2. ¿Se cumplió la condición del acta? Responde SÍ, NO o A MEDIAS, con la razón.
3. El abogado del diablo dice si yo me estoy engañando con los resultados (por ejemplo, si mejoró por algo que no tiene que ver con la decisión).
4. Cada miembro vota: MANTENER, AJUSTAR o REVERSAR, con una sola frase de razón.
5. La Presidenta deja un acta nueva: qué se hace ahora, qué número se vigila y la próxima fecha de revisión.

REGLAS:
- No me den la razón por haber tomado la decisión. Si salió mal, díganlo.
- Si los números no alcanzan para saber si funcionó, díganlo y digan qué dato falta.`;
