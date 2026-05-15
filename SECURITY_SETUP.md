# Setup de seguridad — pasos manuales

> Acompaña al commit `feat(security): capa de proteccion Tier 1+2`.
> Sin estos pasos, el admin no funcionará (no podrás hacer login).

## 🔴 URGENTE — Vercel env vars (5 min)

El admin server-side necesita estas 4 env vars para funcionar. **Sin ellas, /api/admin-auth devuelve 500 y no puedes loguear.**

Ir a **https://vercel.com/omar-as-projects-c9c4ed5d/landing-omar/settings/environment-variables**

Agregar las siguientes (todas para los 3 environments: Production, Preview, Development):

| Variable | Valor | Fuente |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | `$2b$12$UGbLPbaE10EhI5bMlkrNFeIKSgNHKpTQYNIiF.wX2gigjmLosDrY.` | Hash bcrypt del nuevo password |
| `SESSION_SECRET` | `a2e9130c9c9dcb412c9de2b7ea76b67fd59b10f8f204e9c6eb38debb9c5ee252` | 32 bytes random hex |
| `UPSTASH_REDIS_REST_URL` | (ver paso 2) | URL del Redis de Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | (ver paso 2) | Token del Redis de Upstash |

**Nueva password admin** (cópiala a tu password manager / Bitwarden ahora si no lo hiciste):
```
Npqg069+l7zcNk9yRrRZxWUDDWbRJJ0N
```
Esta password reemplaza la anterior `1909omar` (que queda permanentemente revocada).

Después de pegar las env vars en Vercel, **redeploy** para que tomen efecto: Deployments → último deploy → click "..." → Redeploy.

## 🟠 Upstash Redis Free (5 min)

Necesario para el rate limit del admin (5 intentos / 15 min).

1. Ir a **https://upstash.com/** → Sign up con tu Google account
2. Click "Create Database"
3. Configurar:
   - Name: `landing-omar-ratelimit`
   - Type: **Regional** (free tier)
   - Region: **US East (N. Virginia)** (el más cercano a Vercel default)
   - Eviction: enable (default)
4. Crear → en el dashboard del DB, sección "REST API":
   - Copia `UPSTASH_REDIS_REST_URL`
   - Copia `UPSTASH_REDIS_REST_TOKEN`
5. Pega ambas en Vercel env vars (paso anterior)

Plan free: 10.000 commands/día. El admin usa ~10 commands por intento de login. Margen amplio.

## 🟡 GitHub Security (5 min)

Ir a **https://github.com/omaraalvarezo/landing-omar/settings/security_analysis**

Activar todo:
- ✅ **Dependency graph** (probablemente ya activo)
- ✅ **Dependabot alerts**
- ✅ **Dependabot security updates** (auto-PRs cuando salgan parches)
- ✅ **Secret scanning** (gratis en repos públicos)
- ✅ **Push protection** (bloquea push de secrets en tiempo real)
- ✅ **CodeQL analysis** — click "Set up" → "Default" (config automática)

El workflow `.github/workflows/security.yml` que ya está en el repo correrá automáticamente en cada push + lunes 6am UTC.

## 🟡 Namecheap DNS hardening (5 min)

Ir a **https://ap.www.namecheap.com/Domains/DomainControlPanel/omaralvarezo.co/advancedns**

### 1. Activar DNSSEC

Bajo "DNSSEC" section → toggle **ON**.

Namecheap te muestra registros DS. NO tienes que hacer nada con ellos — DNSSEC funciona automático con Namecheap BasicDNS.

⚠️ Si después cambias a Cloudflare nameservers (Tier 3.1), tendrás que **DESACTIVAR DNSSEC primero** en Namecheap, hacer el cambio NS, y reactivar DNSSEC desde Cloudflare. Si no haces esto, el dominio queda "bogus" hasta 48h.

### 2. CAA Records

En "Host Records", click **Add New Record** y crea:

| Type | Host | Value | TTL |
|---|---|---|---|
| CAA Record | `@` | `0 issue "letsencrypt.org"` | Automatic |
| CAA Record | `@` | `0 issuewild ";"` | Automatic |
| CAA Record | `@` | `0 iodef "mailto:omar@omaralvarezo.co"` | Automatic |

⚠️ Namecheap puede mostrar la interfaz de CAA records distinto: campo "Flags" (0), "Tag" (issue/issuewild/iodef), "Value" (lo entre comillas). Si la UI tiene esos 3 campos separados, completa así.

## 🟢 Vercel Firewall custom rules (10 min)

Ir a **https://vercel.com/omar-as-projects-c9c4ed5d/landing-omar/firewall**

Crear estas 3 custom rules:

### Rule 1: Block paths de exploits comunes
- **Name**: `Block common exploit paths`
- **If**: Request Path matches `^/(\.env|\.git|\.aws|wp-admin|wp-login|phpmyadmin|xmlrpc\.php).*`
- **Then**: **Block**

### Rule 2: Block requests sin User-Agent
- **Name**: `Block missing User-Agent`
- **If**: Request Header `User-Agent` is empty
- **Then**: **Block**

### Rule 3: Challenge scrapers conocidos
- **Name**: `Challenge known scrapers`
- **If**: Request Header `User-Agent` matches `(?i)(curl|wget|python-requests|scrapy|nikto|sqlmap|nmap|masscan|gobuster|ffuf|httpx)`
- **Then**: **Challenge** (CAPTCHA)

⚠️ Si tu CI/CD usa curl (poco probable) ajusta la Rule 3 a whitelist Vercel User-Agent.

## 🟢 Cloudflare Free como proxy (30 min activación + propagación hasta 24h)

### Paso 1: Cuenta + add site
1. Crear cuenta en **https://dash.cloudflare.com/sign-up**
2. Dashboard → **Add a Site** → escribir `omaralvarezo.co` → **Continue**
3. Plan **Free** ($0/mes) → **Continue**
4. Cloudflare escanea tus DNS y los importa automático. **Verifica** que estén:
   - `A` `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
   - `TXT` `_vercel` (si Vercel agregó algún record de verificación)
   - Cualquier otro que tengas (CAA si ya los pusiste, MX si tienes email)
5. Habilita el **proxy** (icono 🧡 nube naranja) en `@` y `www` records. Los demás (MX, TXT) déjalos sin proxy (DNS-only, nube gris).
6. **Next** → Cloudflare te muestra los 2 nameservers a configurar en Namecheap.

### Paso 2: Cambiar Nameservers en Namecheap
1. **PRIMERO desactiva DNSSEC** en Namecheap (si lo activaste antes).
2. Ir a **https://ap.www.namecheap.com/Domains/DomainList/** → omaralvarezo.co → **Manage** → **Domain** → sección **Nameservers**:
   - Cambiar de **"Namecheap BasicDNS"** a **"Custom DNS"**
   - Pegar los 2 nameservers que te dio Cloudflare (ej. `axel.ns.cloudflare.com` y `kate.ns.cloudflare.com`)
   - ✓ Save
3. Cloudflare verifica el cambio cada 5 min. Te llega email cuando esté **"Active"** (entre 5 min y 4 horas típicamente).

### Paso 3: Configurar Cloudflare (después de "Active")

En **SSL/TLS** → Overview:
- Encryption mode: **Full (strict)** ← crítico para que respete el cert de Vercel

En **SSL/TLS** → Edge Certificates:
- Always Use HTTPS: **ON**
- HSTS: **ON** con `max-age: 2 years`, `Include subdomains`, `Preload`
- Min TLS Version: **1.2** (1.3 si quieres ultra strict, puede afectar clientes muy viejos)
- TLS 1.3: **ON**

En **Security** → WAF → Managed Rules:
- Activar **Cloudflare Managed Ruleset** (gratis en Free)

En **Security** → Bots:
- **Bot Fight Mode**: **ON** (gratis)
- **Verified Bot access**: ON (deja pasar Googlebot, Bingbot)

En **Security** → DDoS:
- Ya está auto-on. Confirmar.

En **Security** → Settings:
- Security Level: **Medium**
- Challenge Passage: **30 minutes** (default)
- Browser Integrity Check: **ON**

En **Rules** → Page Rules (crear nueva):
- URL: `omaralvarezo.co/admin*`
- Setting: **Cache Level: Bypass**, **Security Level: High**, **Browser Integrity Check: ON**

En **DNS** → DNSSEC:
- **Enable DNSSEC** (Cloudflare lo gestiona ahora que es tu DNS).

## 🟢 Submit HSTS preload (después de validar headers)

Ir a **https://hstspreload.org/** → escribir `omaralvarezo.co` → **Check status and eligibility**.

Si el sitio pasa todas las validaciones (HSTS header con max-age ≥ 1 year, includeSubDomains, preload), aparece un botón para **Submit**. Click → confirmar.

Los browsers (Chrome, Firefox, Safari, Edge) descargarán la lista de dominios preload en próximas releases. A partir de ahí, **nadie podrá conectar a omaralvarezo.co vía HTTP** desde browsers modernos — siempre HTTPS forzado.

⚠️ Es un commitment: si quieres salir de la lista, tarda ~3-6 meses. Solo submitea cuando estés seguro de no querer servir HTTP nunca.

## 🟢 Monitoring (10 min)

### Vercel Speed Insights + Web Analytics

Ya están activados en `astro.config.mjs` (`webAnalytics: { enabled: true }`). Verificar en:
**https://vercel.com/omar-as-projects-c9c4ed5d/landing-omar/analytics**

### Uptime externo gratis

Cuenta en **https://betterstack.com/uptime** o **https://uptimerobot.com**:
- Monitor cada 5 min de `https://omaralvarezo.co/`
- Alerta por email + opcional SMS si cae

## ✅ Verificación final

Después de tener TODO lo anterior, validar con scanners externos:

```bash
# Headers HTTP (desde tu terminal)
curl -sI https://omaralvarezo.co | grep -iE "strict-transport|content-security|x-frame|permissions-policy|referrer-policy"
```

Scanners online:
1. https://securityheaders.com/?q=omaralvarezo.co → debe dar **A+**
2. https://observatory.mozilla.org/analyze/omaralvarezo.co → score ≥ **85**
3. https://www.ssllabs.com/ssltest/analyze.html?d=omaralvarezo.co → grade **A+**
4. https://dnssec-analyzer.verisignlabs.com/omaralvarezo.co → DNSSEC válido
5. https://csp-evaluator.withgoogle.com/ → CSP sin `'unsafe-eval'`

Probar el admin:
1. Ir a https://omaralvarezo.co/admin → deberías ver "404 + form de password" (no el dashboard)
2. Pegar la nueva password → si OK, ves el dashboard
3. Click "cerrar sesión" → vuelves al form
4. Intentar password incorrecta 6 veces → al 6º intento debes ver "Demasiados intentos. Esperá 15 minutos." (esto valida que Upstash rate limit funciona)

## 🔄 Rotación de secretos (proceso recurrente)

Agendar en Google Calendar cada **90 días**:
- Generar nueva password admin: `openssl rand -base64 24`
- Nuevo bcrypt hash: `node -e "console.log(require('bcryptjs').hashSync('PASS', 12))"`
- Nuevo SESSION_SECRET: `openssl rand -hex 32`
- Reemplazar env vars en Vercel
- Redeploy

## ⚠️ Si algo se rompe

- Admin pidiendo password pero ninguno funciona → confirmar que `ADMIN_PASSWORD_HASH` está en Vercel env vars Y que hiciste **Redeploy**.
- Sitio entero da 500 → mirar logs en `vercel logs landing-omar --follow` o en Dashboard. Probable culpable: env var faltante.
- Headers no aparecen en producción → confirmar que el deploy más reciente tiene `vercel.json` (mira el commit en Vercel Deployments).
- DNSSEC roto tras cambio a Cloudflare → desactivar en Namecheap, esperar 1h, reactivar en Cloudflare.

---

**Resumen orden de ejecución:**

1. ✅ HOY (5 min): Vercel env vars + Upstash (sin esto el admin no funciona)
2. ✅ HOY (5 min): GitHub security settings
3. ✅ HOY (5 min): Namecheap DNSSEC + CAA records
4. ✅ Esta semana (10 min): Vercel Firewall custom rules
5. ✅ Próxima semana (30 min + 24h): Cloudflare proxy
6. ✅ Después de Cloudflare: HSTS preload submit
7. ✅ Continuo: monitoring + rotación 90 días
