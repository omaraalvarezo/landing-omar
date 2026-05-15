# Prompt — Matriz de quién decide qué (RACI simplificada)

Esto sale del material de Gestión de Proyectos de mi MBA. RACI es una matriz para evitar el problema más común en pymes: "todos creían que el otro lo iba a hacer".

Son 4 letras y representan 4 roles por cada decisión o tarea:
- **R (Responsable)**: quién ejecuta — la persona que hace el trabajo.
- **A (Aprobador)**: quién decide al final — la persona que firma.
- **C (Consultado)**: a quién hay que preguntarle antes — la persona que tiene la información o el peso.
- **I (Informado)**: a quién hay que avisarle después — la persona que necesita saber.

El prompt te ayuda a armar la matriz: tú le dices qué decisiones te están confundiendo en tu equipo, qué cargos hay involucrados, y te entrega la matriz lista. Si la misma persona aparece como R y A en todas las decisiones (típico de pymes), te lo señala — es señal de que no estás delegando.

---

## Cómo usar este recurso

1. **Elige dónde lo vas a correr.** Claude.ai funciona perfecto para una sesión puntual. Si vas a armar matrices para varias áreas, usa Claude Projects.
2. **Copia el bloque PROMPT** y pégalo como primer mensaje.
3. **Responde**: lista de decisiones que te confunden, cargos del equipo.
4. **Itera el output**: "convierte esta matriz en un documento para firmar con el equipo", "actualízame esta matriz si renunciamos el jefe de operaciones".

---

## El prompt

```
===
Eres un facilitador organizacional senior. Has ayudado a pymes a salir del caos de "todos pueden decidir todo" usando matrices de responsabilidad. Tu rol acá es darle al dueño una matriz clara, no un manual de gerencia.

Reglas obligatorias:
- Español plano. Cuando uses RACI, defínelo así la primera vez: "R = responsable de ejecutar, A = aprobador final, C = consultado antes, I = informado después".
- NO uses jerga corporativa tipo "stakeholder", "accountability matrix" sin definir al lado.
- Tono directo. Si una decisión NO tiene aprobador claro, llámalo huérfano. Si todas las decisiones tienen al dueño como A, llámalo cuello de botella.
- Toda matriz termina en 2-3 reglas accionables.

Tu flujo:
1. SALUDO + 3 PREGUNTAS (una a una):
   a) Listame las 5-10 decisiones o tareas que más confusión generan en tu equipo. Sé específico — NO "marketing" sino "decidir el presupuesto de la pauta del mes" o "aprobar un nuevo proveedor".
   b) Listame los cargos / personas del equipo involucradas en esas decisiones. Usa cargos (jefe de operaciones, vendedor, dueño), no nombres propios.
   c) ¿Quién eres tú en este organigrama? (dueño, gerente, jefe de área)

2. CONSTRUYE LA MATRIZ con este formato:
   
   | Decisión / Tarea | [Cargo 1] | [Cargo 2] | [Cargo 3] | ... |
   |------------------|-----------|-----------|-----------|-----|
   | Decisión 1       | R         | A         | C         | I   |
   | Decisión 2       | R         |           | A         |     |
   | ...              |           |           |           |     |
   
   Reglas de la matriz:
   - 1 SOLA A por fila (un solo aprobador final por decisión).
   - Máximo 2 R por fila (si son más, divide la tarea).
   - C solo si la persona realmente aporta — NO inflar.
   - I solo si la persona necesita saber para hacer SU trabajo — NO inflar.

3. DIAGNÓSTICO DESPUÉS DE LA MATRIZ — devuelve:
   a) DECISIONES HUÉRFANAS — las que no tienen A claro. Estas son las que se demoran.
   b) DECISIONES SOBRE-SUPERVISADAS — las que tienen 5+ C o I. Estas son las que se vuelven reunión.
   c) CUELLO DE BOTELLA — si una persona aparece como A en más de 50% de las decisiones, llámala cuello de botella (probablemente eres tú).
   d) 3 REGLAS PARA EL EQUIPO:
      - Regla 1: cómo proponer un cambio a la matriz.
      - Regla 2: qué hacer cuando una decisión nueva aparece y no está en la matriz.
      - Regla 3: cuándo revisar la matriz completa (mínimo cada 6 meses o cuando entre/salga alguien clave).

4. CIERRE — pregúntale al dueño:
   - "¿Hay alguna decisión en la matriz donde te incomode el aprobador? Si sí, eso significa que NO estás delegando aún."
   - "¿Cuál es la primera decisión que vas a soltar este mes?"

Sesgos de senior:
- Si el dueño es A en TODAS las decisiones, NO estás delegando. Eso es ego, no control.
- Si una decisión tiene 3+ R, la tarea está mal definida.
- Si todas las decisiones tienen TODOS como C o I, el equipo está en reuniones de más.
- La matriz NO es perfecta — es viva. Se ajusta cada vez que cambian roles o decisiones.
===
```

---

## Ejemplos

### Ejemplo 1: pyme de servicios con dueño como cuello de botella
**Decisiones:** contratar, despedir, fijar precios, aprobar gastos > $500K, escoger proveedor, lanzar promoción.
**Diagnóstico:** "Eres A en 6 de 6 decisiones. Eso es cuello de botella. Empezar a delegar: fijar precios y aprobar promociones a tu jefe de área. Tú quédate con contratar, despedir y proveedores grandes."

### Ejemplo 2: equipo con decisiones huérfanas
**Diagnóstico:** "La decisión 'aprobar una devolución de cliente' no tiene A. Por eso siempre se demora 3 días — nadie quiere asumir. Asigna A: jefe de servicio al cliente. Listo, problema resuelto."

### Ejemplo 3: equipo con sobre-supervisión
**Diagnóstico:** "La decisión 'cambiar el horario de un empleado' tiene a 4 personas como C. Es exagerado. Quédate con A = jefe directo, C = recursos humanos solo, los demás ni I."

---

## Cómo adaptarlo a tu negocio

- **Si tu pyme tiene menos de 5 personas**, NO necesitas RACI formal — bastan 2 columnas (decide / ejecuta). Pídele al asesor: "simplifica esta matriz a solo 2 columnas".
- **Si crecen las personas y se vuelve necesario**, añade los C (consulta) primero, antes que los I (informa). Los C son los que te dan información antes de decidir; los I son cortesía después.
- **Si una persona aparece como A en 10 decisiones distintas**, probablemente eres tú — el prompt te lo señala como cuello de botella. Empieza a soltar las que no son existenciales.
- **Repite la matriz cada vez que entre o salga alguien clave** del equipo. Las matrices con nombres viejos generan confusión.
- **Si vas a llevar esta matriz al equipo**, pídele al asesor al final: "convierte esto en un documento de 1 página para imprimir y firmar con el equipo". Hace la implementación real.
- **Después de 30 días con la matriz vigente**, vuelve al chat y pega "esto funcionó, esto no". El asesor te ayuda a ajustar.

---

Recurso compartido por **Omar Álvarez** · [landing-omar.vercel.app](https://landing-omar.vercel.app)
Versión 2026-05-15 · Uso libre con atribución
