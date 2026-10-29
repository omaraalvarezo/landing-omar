// Lista las cuentas conectadas en Zernio. Solo lectura: no publica nada.
// Uso: npm run zernio:accounts
import Zernio from '@zernio/node';

if (!process.env.ZERNIO_API_KEY) {
  console.error('Falta ZERNIO_API_KEY en .env.local');
  process.exit(1);
}

const zernio = new Zernio();
const { data, error } = await zernio.accounts.listAccounts();
if (error) {
  console.error('Zernio respondió con error:', error);
  process.exit(1);
}

const accounts = data?.accounts ?? [];
if (!accounts.length) console.log('Conexión OK, pero no hay cuentas conectadas. Conéctalas en https://zernio.com');
for (const a of accounts) console.log(`${a.platform.padEnd(10)} ${a._id ?? a.id}  ${a.username ?? a.displayName ?? ''}`);
