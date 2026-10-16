export const prerender = false;

import type { APIRoute } from 'astro';
import prompts from '../../../data/lead-prompts.json';
import { consumeLeadDownload } from '../../../lib/lead-store';
import { buildPromptsPdf, type PromptPack } from '../../../lib/printable';

function plain(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('t') || '';
  try {
    const allowed = await consumeLeadDownload(token);
    if (!allowed) return plain(404, 'Ese enlace no sirve o ya venció. Vuelve a dejar el correo en la página del PDF.');
  } catch (error) {
    console.error('[lead] no se pudo abrir el PDF', error);
    return plain(503, 'El PDF no está disponible ahora.');
  }

  const pdf = buildPromptsPdf(prompts as PromptPack);
  const body = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="prompts-ia-talleres-detailing-pymes.pdf"',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
