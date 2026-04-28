# PROJECT: Landing Omar Álvarez — Marca Personal
**Status:** Operativo · listo para deploy | **Deadline:** TBD

---

## Qué
Landing page de marca personal para vender consultorías de IA aplicada a operación real de pymes LATAM. Calidad world-class — benchmark visual: linear.app, vercel.com, framer.com, attio.com, brittanychiang.com.

## Por qué
- Consolidar marca personal de Omar como operador-consultor (no consultor de PowerPoint).
- Vehículo de captación principal para Q2 2026, en sinergia con [marca-personal-tiktok](../marca-personal-tiktok/).
- Conversión vía WhatsApp (form sin backend → `wa.me/573202569486` con mensaje prellenado).

## Stack
- **Astro 4.16** (islands architecture, JS mínimo) + TypeScript strict
- **Tailwind CSS 3.4** con tokens custom (paleta editorial dark + único acento lima `#E8FF4F`)
- **Motion One** (`motion`) + **Lenis** smooth scroll
- **@lucide/astro** para íconos
- **Geist Variable** (sans + mono) + **Instrument Serif** (italics editoriales)
- Deploy: **Vercel** (auto-deploy en push a `main`)
- Sin backend, sin DB, sin auth — todo estático + WhatsApp como conversión

## Hitos completados

| # | Hito | Status |
|---|------|--------|
| 1 | Setup base — tokens + tipografía + global.css | ✅ |
| 2 | Infraestructura UX — Nav + Loader + Cursor + ScrollProgress + Lenis | ✅ |
| 3 | Hero impecable — split-text + counters + magnetic + grid sutil | ✅ |
| 4 | Marquee + ForWho + Services | ✅ |
| 5 | Method (timeline) + Cases (bento) + About | ✅ |
| 6 | FAQ + ContactForm + Footer + WhatsAppFloat | ✅ |
| 7 | Pulido final — OG image, sitemap, robots, schema.org, README, deploy | ✅ |

## Performance objetivo (no negociable)
- Lighthouse 95+ en Performance, Accessibility, Best Practices, SEO
- LCP < 1.5s, CLS < 0.05, INP < 200ms
- `prefers-reduced-motion` respetado en TODA animación

**Bundle final:**
- HTML + CSS inlined: ~42 KB
- JS (todos los scripts agrupados): 25 KB → **~7.5 KB gzip**

## Datos clave
- WhatsApp CTA: `+57 320 256 9486` → `wa.me/573202569486`
- Email: `omaraalvarezo@gmail.com`
- Métricas hero: $81M cop/mes operados · 2 negocios activos · 1,340 reservas analizadas
- Color de marca: `#E8FF4F` (lima eléctrico, único acento)
- Site URL planeada: `https://omaralvarez.co` (configurada en `astro.config.mjs`, dominio aún por comprar)

## Comandos
```bash
npm install              # instalar deps
npm run dev              # dev server (http://localhost:4321)
npm run dev -- --host    # dev expuesto a la red local (para iPhone)
npm run build            # build producción → dist/
npm run preview          # preview del build
npm run astro -- check   # type check Astro
```

## Deploy a Vercel — Primera vez

```bash
# 1. Inicializa git si no lo está (lo dejé hecho)
git status

# 2. Crea repo en GitHub
gh repo create landing-omar --public --source=. --remote=origin --push

# 3. Importa el repo en Vercel
#    https://vercel.com/new → Import landing-omar
#    Framework preset: Astro (auto-detectado)
#    Build command: npm run build
#    Output dir: dist
#    Click Deploy.

# 4. (Opcional) conecta el dominio omaralvarez.co
#    Vercel → Project Settings → Domains → Add
```

Una vez conectado, **cada `git push` a main hace auto-deploy en producción**. PRs generan preview URLs automáticas.

## Estructura
```
src/
├── pages/index.astro
├── layouts/Layout.astro          ← head + OG + schema.org + skip-link
├── components/
│   ├── Hero.astro                ← 100vh + split-text + counters + magnetic
│   ├── Marquee.astro             ← strip infinito 40s con hover-pause
│   ├── ForWho.astro              ← sección 01 + 3 cards con íconos
│   ├── Services.astro            ← sección 02 + 3 cards asimétricas
│   ├── Method.astro              ← sección 03 + timeline 4 pasos con SVG line draw
│   ├── Cases.astro               ← sección 04 + bento con mockups (WA bot, chart, timeline)
│   ├── About.astro               ← sección 05 + foto duotono + bio + stats
│   ├── FAQ.astro                 ← sección 06 + 6 preguntas en <details>
│   ├── ContactForm.astro         ← sección 07 + form que envía a wa.me
│   ├── Footer.astro              ← 4 cols + bloque dramático "OMAR ÁLVAREZ"
│   ├── Nav.astro                 ← fijo + shrink + mobile overlay
│   ├── Loader.astro              ← 1.2s max + skip si reduced-motion
│   ├── CustomCursor.astro        ← desktop only, dot + ring con lerp
│   ├── ScrollProgress.astro      ← barra lima 2px arriba
│   ├── WhatsAppFloat.astro       ← FAB que aparece tras 25% scroll
│   └── SectionLabel.astro        ← sticky label "0X / TÍTULO" reutilizable
├── scripts/
│   ├── motion-utils.ts           ← prefersReducedMotion + isTouchDevice + lerp
│   ├── lenis.ts                  ← smooth scroll + anchor links
│   ├── cursor.ts                 ← cursor custom logic
│   ├── scrollProgress.ts         ← scroll progress bar
│   ├── loader.ts                 ← loader timing + cap 1.2s
│   ├── splitText.ts              ← word-by-word reveal preservando spans inline
│   ├── counter.ts                ← count-up out-expo con formats
│   └── magnetic.ts               ← magnetic effect en CTAs (lerp 0.18)
├── styles/global.css             ← variables + grain noise + base type + reveal CSS
└── lib/
    ├── contact.ts                ← WHATSAPP_NUMBER + helpers
    └── utils.ts
```

## Cómo cambiar contenido

| Qué | Archivo |
|-----|---------|
| Headline hero | `src/components/Hero.astro` línea 24 |
| Métricas hero | `src/components/Hero.astro` (data-counter) |
| 3 cards "para quién" | `src/components/ForWho.astro` const `CARDS` |
| 3 servicios + bullets + takeaways | `src/components/Services.astro` const `SERVICES` |
| 4 pasos del método | `src/components/Method.astro` const `STEPS` |
| 3 casos | `src/components/Cases.astro` (markup directo) |
| Bio + stats | `src/components/About.astro` const `STATS` + texto |
| 6 FAQ | `src/components/FAQ.astro` const `FAQS` |
| Texto del form | `src/components/ContactForm.astro` |
| Email / redes / WhatsApp | `src/lib/contact.ts` |
| Color de marca | `src/styles/global.css` `--accent` |

## Verificación post-deploy
1. **Lighthouse**: `npx lighthouse https://landing-omar.vercel.app --view` → 95+ en las 4 métricas
2. **OG image**: pegar la URL en https://opengraph.xyz/ o postear en Slack para verificar el preview
3. **Schema.org**: validar en https://validator.schema.org/
4. **Mobile real**: abrir desde iPhone — verificar loader, hamburguesa, smooth scroll, form que abre WhatsApp
5. **Reduced motion**: macOS → Accessibility → Reduce motion → verificar que loader, splits, counters, magnetic se desactivan

## Contexto profundo
Ver `CLAUDE.md` en esta misma carpeta — copys aprobados, decisiones de diseño, sistema completo de motion.
