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

// Ejemplo de referencia: negocio FICTICIO, números inventados que cuadran entre sí.
// Margen bruto 55% (sep 56,1%), operacional 15,3% (sep 16,1%), ventas +6%, arriendo y servicios +18%.
// Decisión: gastos fijos +$4.050.000/mes → equilibrio en $7.360.000 de ventas extra al mes.
export const EJEMPLO = {
  negocio: 'Una panadería de barrio en Cúcuta',
  empresa:
    'Panadería de barrio en Cúcuta. Vendemos pan, tortas y desayunos a las familias del sector. Somos 6 personas y llevamos 4 años abiertos.',
  decision:
    'Comprar un horno de $28.000.000 a crédito (cuota de $1.050.000 al mes por 36 meses) para abrir un turno de tarde, de 2 a 7 p. m. Necesito un panadero más: $2.400.000 al mes con prestaciones. Creo que la tarde puede vender $12.000.000 al mes. Lo quiero funcionando en enero.',
  pantalla: 'NO',
  estado: {
    nota: 'Adjunto el estado de resultados de septiembre y octubre de 2026.',
    columnas: ['Septiembre', 'Octubre'],
    filas: [
      { cuenta: 'Ventas', valores: ['$58.500.000', '$62.000.000'] },
      { cuenta: 'Costo de lo vendido', valores: ['$25.700.000', '$27.900.000'] },
      { cuenta: 'Utilidad bruta', valores: ['$32.800.000', '$34.100.000'], total: true },
      { cuenta: 'Nómina', valores: ['$14.800.000', '$14.800.000'] },
      { cuenta: 'Arriendo y servicios', valores: ['$6.100.000', '$7.200.000'] },
      { cuenta: 'Otros gastos', valores: ['$2.500.000', '$2.600.000'] },
      { cuenta: 'Utilidad operacional', valores: ['$9.400.000', '$9.500.000'], total: true },
    ],
  },
  numeros: [
    { campo: 'Cuánto vendí', valor: '$62.000.000' },
    { campo: 'Cuánto me costó lo que vendí', valor: '$27.900.000' },
    { campo: 'Nómina, incluido lo mío', valor: '$14.800.000' },
    { campo: 'Arriendo, servicios y otros gastos fijos', valor: '$9.800.000' },
    { campo: 'Deudas', valor: 'Debo $21.000.000 y pago $1.800.000 al mes' },
  ],
  respuesta: {
    lectura: [
      'Margen bruto de 55%. En septiembre era 56,1%: los insumos subieron más rápido que tus precios.',
      'Margen operacional de 15,3%, contra 16,1% en septiembre.',
      'No cuadra: arriendo y servicios subieron 18% y las ventas solo 6%.',
    ],
    cuentas:
      'El horno y el turno te suben los gastos fijos en $4.050.000 al mes: cuota de $1.050.000, panadero de $2.400.000 y unos $600.000 más de gas y energía. Con margen bruto de 55%, la tarde tiene que vender $7.400.000 al mes solo para no perder.',
    abogado:
      'Los $12.000.000 de la tarde no tienen ni un dato detrás. Si la tarde vende la mitad, pierdes unos $750.000 al mes y quedas pagando 36 cuotas por un horno que no se llena.',
    choque: [
      { quien: 'Operación', texto: 'El horno viejo ya trabaja al 100% en la mañana. Sin otro horno no hay tarde.' },
      { quien: 'Abogado del diablo', texto: 'Entonces prueba la tarde con el horno viejo, horneando a las 2 p. m., antes de firmar 36 cuotas.' },
    ],
    votos: [
      { miembro: 'Presidenta', voto: 'SÍ CON CONDICIÓN', tipo: 'condicion', razon: 'Solo si una prueba demuestra la venta de la tarde.' },
      { miembro: 'Finanzas', voto: 'NO', tipo: 'no', razon: 'Todavía no hay un solo dato de la tarde.' },
      { miembro: 'Operación', voto: 'SÍ', tipo: 'si', razon: 'El horno viejo no da para dos turnos.' },
      { miembro: 'Comercial', voto: 'SÍ CON CONDICIÓN', tipo: 'condicion', razon: 'Primero cuatro semanas de prueba.' },
      { miembro: 'Abogado del diablo', voto: 'NO', tipo: 'no', razon: 'El supuesto de ventas es un deseo.' },
    ],
    resultado: '3 a 2 · Aprobada con condición',
    acta: [
      { campo: 'Decisión', texto: 'Aprobada con condición. Primero, cuatro semanas de prueba de la tarde con el horno actual y un panadero de medio tiempo.' },
      { campo: 'Condición', texto: 'El horno se compra solo si la tarde vende $2.000.000 o más por semana. Cuota máxima: $1.100.000.' },
      { campo: 'Número a vigilar', texto: 'Ventas de la tarde por semana. Alarma: dos semanas seguidas por debajo de $1.500.000.' },
      { campo: 'Revisión', texto: '15 de diciembre.' },
      { campo: 'Se reversa si', texto: 'El margen bruto baja de 53%.' },
    ],
    pregunta: '¿Por qué los servicios subieron 18% si vendiste solo 6% más? ¿No será el horno viejo gastando más gas?',
  },
  seguimiento: {
    campos: [
      { campo: 'El acta anterior', valor: 'La pegó completa (la de arriba).' },
      { campo: 'Los números de ahora', valor: 'La tarde vendió $2.100.000, $2.300.000, $2.400.000 y $2.400.000 en las cuatro semanas. Margen bruto de noviembre: 54,6%.' },
      { campo: 'Qué pasó desde entonces', valor: 'Contraté un panadero de medio tiempo. La última semana ya cayó en diciembre.' },
    ],
    revision: [
      { campo: 'Número vigilado', texto: 'Promedio de $2.300.000 por semana. Nunca sonó la alarma.' },
      { campo: '¿Se cumplió la condición?', texto: 'SÍ: pasó de $2.000.000 por semana las cuatro semanas.' },
      { campo: 'Abogado del diablo', texto: 'Ojo: la última semana ya es diciembre, la mejor temporada del año. Enero va a decir la verdad.' },
    ],
    votos: [
      { miembro: 'Presidenta', voto: 'MANTENER', tipo: 'si', razon: 'Se cumplió lo que pedimos.' },
      { miembro: 'Finanzas', voto: 'AJUSTAR', tipo: 'condicion', razon: 'Comprar, pero con la cuota más baja que dé el banco.' },
      { miembro: 'Operación', voto: 'MANTENER', tipo: 'si', razon: 'El horno viejo ya no aguanta los dos turnos.' },
      { miembro: 'Comercial', voto: 'MANTENER', tipo: 'si', razon: 'La tarde creció las cuatro semanas.' },
      { miembro: 'Abogado del diablo', voto: 'AJUSTAR', tipo: 'condicion', razon: 'Comprar sí, pero mirar enero antes de contratar tiempo completo.' },
    ],
    resultado: '3 a 2 · Se mantiene',
    acta: [
      { campo: 'Qué se hace ahora', texto: 'Se compra el horno con cuota máxima de $1.100.000. El panadero sigue de medio tiempo hasta ver enero.' },
      { campo: 'Número a vigilar', texto: 'Ventas de la tarde en enero. Alarma: por debajo de $1.700.000 por semana.' },
      { campo: 'Próxima revisión', texto: '15 de febrero.' },
    ],
  },
} as const;
