import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const secrets: Record<string, string | undefined> = {};
vi.mock('astro:env/server', () => ({ getSecret: (key: string) => secrets[key] }));

const { POST } = await import('../src/pages/api/contacto');

const valid = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  business: 'Detailing Ana',
  want: 'instalacion',
  oficio: 'detailing',
  country: 'CO',
  accepted: true,
};

const call = (body: unknown) =>
  POST({
    request: new Request('http://localhost/api/contacto', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
    clientAddress: '127.0.0.1',
  } as never);

describe('POST /api/contacto (lista de espera)', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    for (const key of Object.keys(secrets)) delete secrets[key];
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('sin RESEND_API_KEY responde 503 con el correo de respaldo', async () => {
    const response = await call(valid);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ fallbackEmail: 'omaraalvarezo@gmail.com' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('responde 400 con el campo cuando algo no valida', async () => {
    const response = await call({ ...valid, country: 'US' });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ field: 'country' });
  });

  it('con el honeypot lleno responde 200 y no envía nada', async () => {
    secrets.RESEND_API_KEY = 're_test';
    const response = await call({ ...valid, website: 'spam' });
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('envía el correo a Omar con asunto, filas y reply_to', async () => {
    secrets.RESEND_API_KEY = 're_test';
    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));
    const response = await call({
      ...valid,
      oficio: 'otro',
      oficioOtro: 'Lavado de tapetes',
      phone: '+57 300 123 4567',
      message: 'Hola\nquiero saber más & más',
    });
    expect(response.status).toBe(200);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.resend.com/emails');
    const sent = JSON.parse(init.body);
    expect(sent.subject).toBe('Lista de espera · Instalación · Detailing Ana');
    expect(sent.reply_to).toBe('ana@example.com');
    expect(sent.to).toEqual(['omaraalvarezo@gmail.com']);
    expect(sent.text).toContain('Qué quiere: Instalación');
    expect(sent.text).toContain('Oficio: Otro: Lavado de tapetes');
    expect(sent.text).toContain('País: Colombia');
    expect(sent.text).toContain('Negocio: Detailing Ana');
    expect(sent.text).toContain('WhatsApp: +57 300 123 4567');
    expect(sent.html).toContain('quiero saber más &amp; más');
    expect(init.headers['Idempotency-Key']).toMatch(/^contacto-[0-9a-f]{64}$/);
  });

  it('el mismo mensaje da la misma llave y otro oficio da otra', async () => {
    secrets.RESEND_API_KEY = 're_test';
    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));
    await call(valid);
    await call(valid);
    await call({ ...valid, want: 'sesion' });
    const keys = fetchMock.mock.calls.map(([, init]) => init.headers['Idempotency-Key']);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[2]).not.toBe(keys[0]);
  });

  it('si Resend falla responde 502 con fallbackEmail', async () => {
    secrets.RESEND_API_KEY = 're_test';
    fetchMock.mockResolvedValue(new Response('{}', { status: 500 }));
    const response = await call(valid);
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ fallbackEmail: 'omaraalvarezo@gmail.com' });
  });
});
