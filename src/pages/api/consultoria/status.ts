export const prerender = false;

import type { APIRoute } from 'astro';
import {
  consultingAccessCookieName,
  isConsultingAccessToken,
  isConsultingOrderId,
} from '../../../lib/consulting-orders';
import {
  resolveConsultingOrder,
  resolveConsultingPayment,
} from '../../../lib/consulting-payment';

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

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  const orderId = url.searchParams.get('order') || '';
  if (id && !ID.test(id)) return json(400, { status: 'INVALID', approved: false });
  if (orderId && !isConsultingOrderId(orderId)) {
    return json(400, { status: 'INVALID', approved: false });
  }
  if (!id && !orderId) return json(400, { status: 'INVALID', approved: false });

  try {
    let result;
    if (orderId) {
      const rawAccessToken = cookies.get(consultingAccessCookieName(orderId))?.value || '';
      const accessToken = isConsultingAccessToken(rawAccessToken) ? rawAccessToken : '';
      result = await resolveConsultingOrder(orderId, accessToken, id);
    } else {
      result = await resolveConsultingPayment(id);
    }
    if (result.kind === 'NOT_FOUND') return json(404, result);
    if (result.kind === 'UNAUTHORIZED') return json(403, result);

    const payload: Record<string, unknown> = {
      status: result.status,
      approved: result.approved,
    };

    if (result.approved) {
      const calLink = String(import.meta.env.CAL_CONSULTING_LINK || '').trim();
      if (calLink) payload.calLink = calLink;
    }

    return json(200, payload);
  } catch (error) {
    console.error('[consultoria] no se pudo verificar la transacción', error);
    return json(503, { status: 'UNKNOWN', approved: false });
  }
};
