const TOKEN = /^[a-f0-9]{64}$/;

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return diff === 0;
}

/**
 * Quién puede ver la página de un pedido: quien trae la cookie de acceso, o quien abre el enlace
 * del correo (`?t=`) cuando el pago ya está aprobado. El enlace nunca abre un pedido sin aprobar.
 */
export function canViewProductOrder(
  order: { status: string; downloadToken?: string },
  opts: { cookieMatches: boolean; linkToken: string | null },
): boolean {
  if (opts.cookieMatches) return true;
  const { linkToken } = opts;
  const expected = order.downloadToken;
  if (order.status !== 'APPROVED' || !linkToken || !expected) return false;
  if (!TOKEN.test(linkToken) || !TOKEN.test(expected)) return false;
  return constantTimeEqual(linkToken, expected);
}
