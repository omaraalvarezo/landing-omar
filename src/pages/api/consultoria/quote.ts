export const prerender = false;

import type { APIRoute } from 'astro';
import { getConsultingQuote } from '../../../lib/trm';

export const GET: APIRoute = async () => {
  try {
    const quote = await getConsultingQuote();
    return new Response(JSON.stringify(quote), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[consultoria] no se pudo crear la cotización', error);
    return new Response(JSON.stringify({ error: 'No pudimos calcular la conversión en este momento.' }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
};
