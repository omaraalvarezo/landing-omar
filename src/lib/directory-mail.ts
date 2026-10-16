import { getSecret } from 'astro:env/server';
import { formatCop } from './money';
import {
  addCalendarDays,
  bogotaToday,
  categoryLabel,
  getDirectoryPlan,
  type DirectoryPlanId,
} from './directory';
import type { DirectoryOrder } from './directory-orders';

export type DirectoryMailKind = 'approved' | 'voided' | 'double';
export type DirectoryMailResult = 'sent' | 'unconfigured' | 'failed';

const DEFAULT_NOTIFY_EMAIL = 'omaraalvarezo@gmail.com';

function env(name: keyof ImportMetaEnv): string {
  return String(getSecret(String(name)) || '').trim();
}

function shellArg(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function activationCommands(order: DirectoryOrder): string {
  const plan = getDirectoryPlan(order.plan as DirectoryPlanId);
  const lines = [
    `npm run tool:add -- --nombre ${shellArg(order.toolName)} --url ${shellArg(order.toolUrl)} --categoria ${shellArg(order.category)} --desc ${shellArg(order.description)}`,
  ];
  if (plan.periodDays > 0) {
    const until = addCalendarDays(bogotaToday(), plan.periodDays);
    const sponsor = order.plan === 'patrocinio' ? ' --sponsor' : '';
    lines.push(`npm run tool:feature -- --slug SLUG --until ${until}${sponsor}`);
    lines.push(`La fecha ${until} es inclusiva (30 días desde hoy en Bogotá). Cambia SLUG por el slug real si la herramienta ya estaba en el directorio.`);
  } else {
    lines.push('El listado básico no lleva distintivo ni fecha de vencimiento.');
  }
  return lines.join('\n');
}

function message(order: DirectoryOrder, kind: DirectoryMailKind): { subject: string; text: string } {
  const amount = formatCop(order.amountInCents / 100);
  const plan = getDirectoryPlan(order.plan);
  const subject =
    kind === 'double'
      ? `Directorio IA · doble cobro · ${amount} · ${order.toolName}`
      : kind === 'voided'
        ? `Directorio IA · pago anulado · ${amount} · ${order.toolName}`
        : `Directorio IA · ${amount} · ${order.toolName}`;

  const headline =
    kind === 'double'
      ? 'Llegó un segundo pago APPROVED para una orden que ya estaba aprobada.'
      : kind === 'voided'
        ? 'Wompi anuló la transacción que había quedado aprobada. No publiques este listado.'
        : 'Pago aprobado en el directorio de herramientas.';

  const text = [
    headline,
    '',
    `Plan: ${plan.name} (${plan.cadence})`,
    `Monto: ${amount} COP`,
    `Herramienta: ${order.toolName}`,
    `URL: ${order.toolUrl}`,
    `Categoría: ${categoryLabel(order.category)} (${order.category})`,
    `Correo: ${order.email}`,
    `Descripción: ${order.description}`,
    `Referencia: ${order.reference}`,
    `Transacción: ${order.transactionId || '—'}`,
    `Orden: ${order.id}`,
    '',
    'La publicación no es automática. Para activarla en el repo:',
    activationCommands(order),
    '',
    order.plan === 'patrocinio'
      ? 'El patrocinio también incluye mención en la siguiente nota. Eso se hace a mano: el sitio no tiene envío de newsletter.'
      : 'Cuando venza featuredUntil, el distintivo se apaga solo al volver a construir el sitio.',
  ].join('\n');

  return { subject: subject.slice(0, 180), text };
}

export async function notifyDirectoryPayment(
  order: DirectoryOrder,
  kind: DirectoryMailKind,
): Promise<DirectoryMailResult> {
  const apiKey = env('RESEND_API_KEY');
  const from = env('DIRECTORY_NOTIFY_FROM');
  const to = env('DIRECTORY_NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return 'unconfigured';

  const { subject, text } = message(order, kind);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      console.error('[directorio] Resend rechazó el aviso', response.status);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error('[directorio] no se pudo enviar el aviso', error);
    return 'failed';
  }
}
