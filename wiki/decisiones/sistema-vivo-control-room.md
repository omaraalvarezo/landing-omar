---
titulo: "Sistema vivo y taller abierto para la landing personal"
tipo: decision
dominio: [diseño, brand, copy, conversion, performance]
tags: [sistema-vivo, marco-4c, enzo, arkhe, tiktok, motion]
fuentes:
  - "[[../../CLAUDE.md]]"
  - "[[../sintesis/framework-4c-empresas-servicios]]"
  - "[[../sintesis/posicionamiento-consultoria-dos-horas]]"
  - "[[../../../grupo-enzo/enzo-motorsport/site/index.html]]"
  - "[[../../../grupo-enzo/arkhe/components/ArkheSpaceWebsite.jsx]]"
  - "[[../../../second-brain/projects/marca-personal-tiktok/serie-90-dias/01-reglas-de-voz.md]]"
  - "[[../../../second-brain/projects/marca-personal-tiktok/serie-90-dias/07-inventario-casos.md]]"
creado: 2026-08-20
actualizado: 2026-08-20
---

# Sistema vivo y taller abierto

## Decisión

La landing personal deja de usar la dirección “expediente editorial” —papel beige, serif dominante,
azul único, tablas y rejillas uniformes— y adopta un híbrido propio:

1. **Sistema vivo:** hero nocturno donde señales sueltas se conectan al hacer scroll en Captar,
   Convertir, Cumplir y Continuar.
2. **Taller abierto:** cuerpo claro, multicolor y asimétrico donde métricas y proyectos se sienten como
   piezas de trabajo, no como casos de agencia.

## Por qué

La estética anterior convertía a Omar en un “consultor de revista”. Sus proyectos reales hacen lo
contrario: muestran sistemas que cobran vida, estados que cambian y herramientas que se pueden tocar.

Enzo aporta la satisfacción de ver pasar algo de oscuridad a control. Arkhē aporta color, geometría y
curiosidad. La voz pública de TikTok aporta una prueba todavía más importante: Omar habla como un
empresario que se cansó de un problema y construyó una salida, no como una agencia ni un guru de IA.

## Traducción, no copia

- No se usan los frames del carro de Enzo. El objeto memorable es el flujo del negocio.
- No se copia el home coral + Playfair de Arkhē. Se recupera la paleta amplia y juguetona del
  brandbook, con un color fijo por cada C.
- No se usa una esfera, robot, chat flotante o gradiente arcoíris como cliché de IA.
- Los proyectos se representan mediante interfaces code-native con datos reales; no mediante cuatro
  tarjetas de logo y párrafo.

## Sistema visual

- Base `#131118` y `#FFF8EA`.
- C1 coral `#FF6B45`, C2 púrpura `#C79AFF`, C3 cobalto profundo `#4B5FE3`, C4 lima `#C8FF3D`.
- Bricolage Grotesque para display, IBM Plex Sans para lectura e IBM Plex Mono para telemetría.
- Titulares compactos y frontales; nada de serif editorial.
- Composiciones sólidas, bordes y desplazamientos físicos. Glass solo en la navegación funcional.

## Narrativa de conversión

El precio no aparece en el hero. El visitante recorre origen operativo, resultados, Marco 4C,
proyectos, dinámica de la sesión, encaje y preguntas antes de ver `USD 797` y el equivalente del día.
La página no bloquea ni manipula el scroll; convence mediante evidencia y criterio.

## Motion y accesibilidad

- Scroll nativo con `requestAnimationFrame` acotado al hero visible.
- SVG, CSS y DOM; sin WebGL o video pesado.
- `prefers-reduced-motion` muestra una versión estática equivalente con la fase final conectada.
- El cobalto de fondo se profundizó a `#4B5FE3` para mantener contraste AA con texto bone.

## Decisiones superadas

Esta decisión reemplaza `[[tipografia-3-familias-landing]]` para el home de consultoría. Geist e
Instrument Serif pueden seguir viviendo en rutas heredadas, pero ya no definen `omaralvarezo.co/`.
