---
titulo: "Precio psicológico, TRM y recorrido desde TikTok"
tipo: sintesis
dominio: [pricing, conversion, copy, wompi, tiktok]
tags: [precio, sesgos-cognitivos, usd, cop, trm, checkout]
creado: 2026-08-19
actualizado: 2026-08-20
---

# Precio psicológico, TRM y recorrido desde TikTok

## Decisión

La consultoría conserva su posicionamiento premium con precio base **USD 797**. Wompi cobra el
equivalente exacto en COP calculado por el servidor con una tasa operativa diaria: TRM oficial
vigente + 1,65%, redondeada al siguiente múltiplo de `$10 COP`. La página muestra TRM oficial, tasa
aplicada y total antes de abrir el checkout.

El precio no aparece en el hero ni en la navegación. El visitante que llega desde TikTok atraviesa
esta secuencia: continuidad con el contenido → reconocimiento del problema → evidencia construida →
método de 120 minutos → costo de construir lo incorrecto → encaje/no encaje → objeciones → precio y
brief. No se bloquea artificialmente el scroll ni se oculta el total.

## Qué dice la evidencia

- El efecto de dígito izquierdo existe especialmente cuando cambia el primer dígito (`797` frente a
  `800`), no por una supuesta magia universal del 7 o el 9: [Thomas y Morwitz, Journal of Consumer
  Research, 2005](https://academic.oup.com/jcr/article-abstract/32/1/54/1796360).
- Los precios terminados en 99 pueden comunicar descuento y, en marcas de mayor calidad, deteriorar la
  imagen de calidad. Por eso no se usa `799`: [Schindler y Kibarian, Journal of Advertising,
  2001](https://www.tandfonline.com/doi/abs/10.1080/00913367.2001.10673654).
- Los números precisos producen ajustes menores frente al ancla y pueden sugerir cálculo, pero una
  precisión excesiva también puede reducir entrada. `797` es preciso sin fingir una fórmula centavo a
  centavo: [Janiszewski y Uy, Psychological Science, 2008](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2008.02057.x).
- Los precios redondos encajan mejor con decisiones guiadas por emoción; los no redondos, con decisiones
  más cognitivas. Esta compra B2B debe sobrevivir análisis, no impulso: [Wadhwa y Zhang, Journal of
  Consumer Research, 2015](https://doi.org/10.1086/678484).
- En monedas extranjeras las personas ajustan de forma insuficiente por tasa de cambio y se anclan al
  valor nominal. Usar USD reduce la magnitud visual, pero exige mostrar COP y TRM para no convertir ese
  sesgo en engaño: [Raghubir y Srivastava, Journal of Consumer Research,
  2002](https://academic.oup.com/jcr/article-abstract/29/3/335/1800909).
- Dos experimentos preregistrados recientes no encontraron que el final del precio elevara de forma
  confiable la intención de compra. El precio ayuda a enmarcar; la evidencia y el encaje hacen la venta:
  [Frontiers in Behavioral Economics, 2026](https://www.frontiersin.org/journals/behavioral-economics/articles/10.3389/frbhe.2026.1828446/full).

## Regla técnica y de transparencia

Wompi Colombia solo procesa COP y exige que el monto firmado coincida con la transacción:
[documentación oficial de Checkout Web](https://docs.wompi.co/docs/colombia/widget-checkout-web/).
La TRM es calculada y certificada diariamente por la Superintendencia Financiera:
[definición oficial](https://www.superfinanciera.gov.co/publicaciones/60819/). El endpoint usa el
conjunto oficial de Datos Abiertos `32sa-8pi3` y selecciona la vigencia correspondiente a la fecha de
Bogotá. No se usa un fallback manual que pueda cruzar de día: una consulta oficial ya validada se
puede reutilizar únicamente durante esa misma fecha; sin dato oficial vigente, el checkout no abre.

El spread de 1,65% es deliberadamente menor que la [tarifa publicada del plan Avanzado de
Wompi](https://wompi.com/es/co/planes-tarifas/) (`2,65% + $700 + IVA`), por lo que amortigua parte del
costo de recaudo sin convertir la tasa en una segunda fuente material de ingreso. El redondeo replica
el ejemplo de negocio: si la TRM fuera `$3.000`, la tasa aplicada sería `$3.050`. Referencias
internacionales como [Stripe](https://stripe.com/pricing) publican ajustes de conversión de 1% y tasas
de presentación local desde 2%; la regla local se mantiene visible y estable, no oportunista.

No se usan precios tachados inventados, descuentos falsos, cupos falsos, temporizadores ni testimonios
no verificables. La única reducción de riesgo es operativa: si el brief no cabe o Omar no puede aportar,
la reserva no se aprueba y se devuelve el 100%.
