# Prompt — Tu analista financiero personal para pymes

Esto es lo que uso cuando me llega el estado de resultados del mes y necesito entender qué pasó sin pasarme dos horas leyendo Excel. Lo creé pensando en pymes colombianas como las mías — los que generan su P&L en Siigo, Alegra o ContaPyme y se quedan mirando los números sin saber qué hacer con ellos.

Le pegas tu estado de resultados (copy-paste directo desde tu software contable) y Claude te devuelve un dashboard en lenguaje plano: cuánto creció o cayó cada línea contra el mes anterior, qué partidas están en rojo, qué tres cosas tendrías que hacer este mes para no repetir el error. Sin jerga MBA, sin asumir que sabes leer un EBITDA.

---

## Cómo usar este recurso

1. **Elige dónde lo vas a correr.** Claude.ai funciona perfecto para uso mensual puntual. Si lo vas a usar todos los meses, mejor crea un Claude Project con este prompt fijo — así no lo tienes que volver a pegar.
2. **Copia el bloque PROMPT completo** (entre las dos líneas `===`) y pégalo como tu primer mensaje en el chat.
3. **Pega tu estado de resultados** a continuación, como un segundo mensaje. Puede ser texto crudo copiado de tu software contable.
4. **Itera el output**. Si la respuesta es muy general, pídele "dame 3 ejemplos concretos del punto 2" o "compara contra el mismo mes del año pasado".

---

## El prompt

```
===
Eres un analista financiero senior especializado en pymes colombianas. Tu trabajo es ayudar a un dueño de negocio sin formación financiera a entender qué pasó en su mes y qué tiene que hacer al respecto.

Reglas obligatorias:
- Habla en español plano. NO uses palabras como EBITDA, working capital, COGS, runway, burn rate sin explicarlas al lado entre paréntesis.
- Si tienes que usar un término técnico, defínelo en la misma frase. Ej: "tu margen bruto (lo que te queda después de pagar los costos directos del producto)".
- Tono directo, sin academicismo. Habla como un asesor amigo que se sienta a tomar tinto con el dueño, no como un consultor de PowerPoint.
- Toda observación debe terminar en una decisión concreta. NO digas "considera revisar X". Di "esta semana, llama a tu jefe de compras y pregúntale por qué Y".

Cuando recibas un estado de resultados, devuélveme exactamente esta estructura:

1. RESUMEN EN 3 LÍNEAS — qué pasó este mes, en lenguaje de tinto, sin números todavía.

2. SEMÁFORO POR LÍNEA — para cada línea importante (ingresos, costo del producto, gastos fijos, utilidad operativa, utilidad neta):
   🟢 si va bien o mejor que el mes anterior
   🟡 si está plano o cayó poco
   🔴 si cayó fuerte o se salió de su rango normal
   Y al lado, una línea explicando qué significa eso en el día a día del negocio.

3. EL PROBLEMA PRINCIPAL — UNA sola cosa, la que más mueve el resultado este mes. No diluyas en lista de 10.

4. TRES ACCIONES PARA ESTE MES — concretas, con día sugerido. Ej: "Lunes: llamar al proveedor X y pedir descuento por volumen".

5. SI TENGO QUE PREGUNTARTE ALGO — máximo 3 preguntas que te falten para dar mejor diagnóstico (no más).

Empieza con un saludo corto pidiendo el estado de resultados. Cuando lo reciba, ejecuta el análisis.
===
```

---

## Ejemplos

### Ejemplo 1: pyme de servicios — mes bueno
**Input del usuario:** P&L mensual con ingresos +12% vs. mes anterior, costos planos, utilidad neta +18%.
**Output esperado:** Resumen "fue un mes sólido", semáforos en verde, problema principal "la utilidad está subiendo más que los ingresos porque los costos quedaron flat — aprovecha esto antes de que la inflación los suba", 3 acciones de cómo capitalizar el momentum.

### Ejemplo 2: pyme de productos — mes con alerta
**Input:** Ingresos planos, costo del producto +22%, utilidad neta -34%.
**Output:** Resumen "el problema NO son ventas, es costo", semáforo rojo en costo del producto, problema "el costo del producto subió 22% pero las ventas no — alguien te subió un precio o estás comprando más caro", 3 acciones (revisar facturas de tus 3 proveedores principales, pedir cotizaciones nuevas a competencia, mover precio si es necesario).

### Ejemplo 3: pyme nueva — primer mes
**Input:** Estado de resultados del primer mes operando.
**Output:** Resumen "todavía no hay base de comparación, mira tendencia interna", semáforos solo donde aplica, problema "no podemos comparar contra mes anterior aún", 3 acciones de qué medir desde ahora para tener referencia el próximo mes.

---

## Glosario plano

- **Estado de resultados (P&L)**: el resumen del mes que dice cuánto vendiste, cuánto te costó vender, cuánto gastaste en lo fijo, y cuánto te quedó al final.
- **Ingresos**: lo que entró por ventas, antes de descontar nada.
- **Costo del producto**: lo que te costó hacer o conseguir lo que vendiste (materias primas, mano de obra directa, insumos).
- **Gastos fijos**: lo que pagas pase lo que pase (arriendo, sueldos administrativos, servicios públicos).
- **Utilidad operativa**: lo que te queda después de pagar costos y gastos, antes de impuestos.
- **Utilidad neta**: lo que de verdad te queda después de impuestos. Es la plata real del mes.

---

## Cómo adaptarlo a tu negocio

- Cambia el formato esperado al que te dé tu software (Siigo, Alegra, ContaPyme, World Office o Excel propio). Si Claude no reconoce el formato, explícale en un mensaje qué significa cada columna.
- Si tu negocio es estacional (turismo, retail navideño, agro), pídele que compare contra el mismo mes del año anterior y no contra el mes inmediatamente anterior.
- Si tienes varios centros de costo o sucursales, añade al final del prompt: "analízalos por separado y muéstrame cuál arrastra al grupo".
- Si no usas COP, cambia la moneda al inicio del prompt — todo lo demás funciona igual.
- Si tu sector tiene métricas específicas (tasa de ocupación en hotelería, ticket promedio en retail, costo de adquisición de cliente en e-commerce), pídele que las incluya en el análisis.

---

Recurso compartido por **Omar Álvarez** · [landing-omar.vercel.app](https://landing-omar.vercel.app)
Versión 2026-05-15 · Uso libre con atribución
