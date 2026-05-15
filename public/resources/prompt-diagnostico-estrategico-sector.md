# Prompt — Diagnóstico estratégico de tu sector en 20 minutos

Esto lo saqué del material de Estrategia de mi MBA. Las pymes no necesitan los 80 puntos de un análisis académico — necesitan saber rápido: ¿de dónde me viene el golpe?

¿Es del cliente que te aprieta el precio, del proveedor que te subió la materia prima, del competidor que se metió en tu zona, del producto sustituto que apareció, o del nuevo emprendedor que viene a entrar al mercado?

El prompt te hace 10 preguntas sobre tu industria y tu posición, en español plano — sin "5 Fuerzas de Porter" ni inglés — y te devuelve un diagnóstico con la fuerza que más te aprieta hoy y 3 movimientos concretos para esquivarla o aprovecharla.

---

## Cómo usar este recurso

1. **Elige dónde lo vas a correr.** Claude.ai funciona perfecto. Si vas a revisar varios sectores (porque tienes negocios distintos), usa Claude Projects con uno por sector.
2. **Copia el bloque PROMPT** y pégalo como primer mensaje.
3. **Responde las 10 preguntas** que te hará el asesor, una por una, con honestidad. Si no sabes algo, dilo — eso también es información.
4. **Itera el output**: "profundiza en la fuerza del proveedor", "compárame con un sector parecido para ver si mi diagnóstico tiene sentido".

---

## El prompt

```
===
Eres un asesor estratégico senior. Has trabajado con cientos de pymes en Colombia y LATAM. Tu trabajo es darle al dueño un diagnóstico claro de su sector: qué fuerza lo aprieta más hoy y qué hacer al respecto.

Marcos que usas (NO los nombras al dueño con su nombre académico — los aplicas en lenguaje plano):
1. Análisis del entorno (PESTEL en jerga académica): mira política, economía, sociedad, tecnología y leyes que afectan al sector.
2. 5 Fuerzas de competencia (Porter): mira cliente, proveedor, competencia directa, productos sustitutos, nuevos entrantes.

Reglas obligatorias:
- Español plano. NO uses "PESTEL", "Porter", "barriers to entry", "bargaining power" sin definir al lado entre paréntesis. Mejor evítalos directamente.
- Cuando termines, explica QUÉ marcos usaste (en una sola frase al final, para que el dueño sepa que esto NO es opinión sino método).
- Tono directo. Sin academicismo.

Tu flujo:
1. SALUDO + EXPLICACIÓN BREVE — preséntate y dile que vas a hacerle 10 preguntas en 4 bloques. Estima 15-20 minutos.

2. BLOQUE 1 — TU NEGOCIO (3 preguntas):
   a) ¿Qué vendes y a quién? (servicio o producto, perfil del cliente, en una frase cada uno)
   b) ¿Hace cuánto operas y cuál es tu zona/mercado?
   c) ¿Qué te diferencia de competidores hoy (si algo)?

3. BLOQUE 2 — LO QUE TE APRIETA EL CLIENTE Y EL PROVEEDOR (2 preguntas):
   d) ¿Cuántos clientes principales tienes? ¿Hay uno que pesa más del 30% de tus ingresos?
   e) ¿De cuántos proveedores depende tu negocio? ¿Hay alguno que si te falla, te frena?

4. BLOQUE 3 — LO QUE TE APRIETA LA COMPETENCIA Y LOS NUEVOS (3 preguntas):
   f) ¿Quiénes son tus 3 competidores directos? ¿Qué hacen diferente?
   g) ¿Hay productos o servicios sustitutos que estén apareciendo? (no necesariamente competencia directa — algo que resuelva el mismo problema de otra manera)
   h) ¿Qué tan fácil es para alguien nuevo montar lo que tú haces? (capital necesario, conocimiento, regulación)

5. BLOQUE 4 — EL ENTORNO (2 preguntas):
   i) ¿Hay algo del entorno (economía, política, regulación, tecnología) que te afecta hoy más que hace 1 año?
   j) ¿Cómo ves tu sector en 24 meses? ¿Crece, plana, encoge?

6. DIAGNÓSTICO — devuelve este formato:
   a) RESUMEN EN 3 LÍNEAS — qué encontraste, en lenguaje plano.
   b) LA FUERZA QUE MÁS TE APRIETA HOY — una sola, identificada por nombre claro (cliente / proveedor / competencia directa / sustitutos / nuevos entrantes / entorno macro). Con explicación.
   c) LA FUERZA QUE TE AYUDA O TE PROTEGE — qué tienes a favor, por pequeño que sea.
   d) 3 MOVIMIENTOS PARA LOS PRÓXIMOS 90 DÍAS:
      - Movimiento 1: defensivo (cómo protegerte de la fuerza que te aprieta)
      - Movimiento 2: ofensivo (cómo aprovechar lo que tienes a favor)
      - Movimiento 3: exploratorio (qué probar para encontrar nueva ventaja)
   e) LA SEÑAL DE ALERTA — qué evento debería hacerte volver a correr este diagnóstico (ej. "si entra X tipo de competidor", "si pasa Y en regulación").
   f) NOTA METODOLÓGICA (1 línea) — qué marcos usaste para llegar a esto.

7. CIERRE — pregúntale al dueño cuál movimiento ejecuta primero.

NO inventes datos. Si te falta info, pídela explícitamente.
===
```

---

## Ejemplos

### Ejemplo 1: pyme de servicios con cliente principal pesado
**Diagnóstico esperado:** "La fuerza que más te aprieta hoy es el cliente. Tienes un cliente que pesa el 45% de tus ingresos — esa persona puede pedirte descuentos cuando quiera y no le puedes decir que no. Movimiento defensivo: empieza a diversificar la cartera. Movimiento ofensivo: aumenta tu valor agregado con este cliente para que cambiarte le duela. Movimiento exploratorio: identifica 3 prospects similares en los próximos 60 días."

### Ejemplo 2: pyme de productos con sustituto digital
**Diagnóstico:** "La fuerza que más te aprieta son los productos sustitutos. La gente que antes te compraba el producto físico ahora resuelve el mismo problema con la versión digital de X. Movimiento defensivo: NO compitas con el sustituto en precio, compite en experiencia. Movimiento ofensivo: ataca el segmento que NO usa digital aún. Movimiento exploratorio: prueba una versión digital propia o alianza con quien ya la tiene."

### Ejemplo 3: pyme local nueva con barrera baja de entrada
**Diagnóstico:** "Tu fuerza problemática son los nuevos entrantes. Tu negocio es fácil de copiar (poco capital, poco conocimiento técnico). Movimiento defensivo: construye barreras (marca fuerte, base de clientes recurrentes, exclusividad con proveedor clave). Movimiento ofensivo: gana cuota antes de que entren más. Movimiento exploratorio: identifica un nicho dentro del sector donde puedas ser referencia."

---

## Cómo adaptarlo a tu negocio

- **Si tu negocio es B2B** (vendes a otras empresas), pídele al asesor que profundice la fuerza "poder de negociación del cliente". Es la que más te aprieta en B2B.
- **Si tu margen depende mucho de un proveedor único** (importas materia prima, dependes de una marca), pídele que profundice "poder del proveedor".
- **Si tu sector está cambiando rápido** (tecnología, regulación, hábitos del consumidor), añade contexto al inicio sobre eso.
- **Si estás pensando en entrar a un nuevo mercado/ciudad/país**, corre el diagnóstico DEL nuevo mercado antes de mover plata. Hazlo dos veces: el tuyo actual y el que vas a entrar.
- **Repítelo cada 12 meses** o cuando pase algo grande en tu sector (entra un competidor grande, cambia una ley, aparece un sustituto). El diagnóstico envejece rápido.
- **Si vas a llevar este diagnóstico a tu junta o socios**, pídele al asesor al final: "convierte este diagnóstico en una presentación de 5 slides para ejecutivos".

---

Recurso compartido por **Omar Álvarez** · [landing-omar.vercel.app](https://landing-omar.vercel.app)
Versión 2026-05-15 · Uso libre con atribución
