# Wiki — Landing Omar

Conocimiento sintetizado del proyecto. Cada archivo `.md` aquí es generado/mantenido por el LLM tras procesar fuentes en `raw/`.

**Reglas:**

1. Todo archivo lleva frontmatter YAML (ver `CLAUDE.md` § "Frontmatter obligatorio").
2. Toda afirmación no obvia cita su fuente: `fuentes: [[raw/...]]` o `[[wiki/...]]`.
3. Nombre de archivo en `kebab-case`, sin fecha (la fecha vive en el frontmatter `creado`/`actualizado`).

**Carpetas:**

- `decisiones/` — Una decisión = un archivo. Diseño, copy, SEO, conversión, infra. Incluir alternativas descartadas y porqué.
- `conceptos/` — Frameworks, principios, métricas. Ej.: "jerarquía editorial 3 familias", "ley de Fitts", "LCP objetivo".
- `sintesis/` — Análisis cruzado entre múltiples fuentes raw. Ej.: "qué patrón comparten Stratechery, Linear y Attio en su hero".
