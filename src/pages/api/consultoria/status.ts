export const prerender = false;

import type { APIRoute } from 'astro';
import { fetchTransaction, isApprovedConsultingPayment } from '../../../lib/wompi-consulting';

const ID = /^[A-Za-z0-9_-]{8,100}$/;

function json(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export const GET: APIRoute = async ({ request }) => {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!ID.test(id)) return json(400, { status: 'INVALID', approved: false });

  try {
    const transaction = await fetchTransaction(id);
    if (!transaction) return json(404, { status: 'NOT_FOUND', approved: false });

    const approved = isApprovedConsultingPayment(transaction);
    const payload: Record<string, unknown> = {
      status: transaction.status,
      approved,
    };

    if (approved) {
      const calLink = String(import.meta.env.CAL_CONSULTING_LINK || '').trim();
      if (calLink) payload.calLink = calLink;
    }

    return json(200, payload);
  } catch (error) {
    console.error('[consultoria] no se pudo verificar la transacción', error);
    return json(503, { status: 'UNKNOWN', approved: false });
  }
};
