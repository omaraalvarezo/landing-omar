const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 48;

const WIN1252_EXTRA: Record<number, number> = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
};

export interface PromptItem {
  title: string;
  text: string;
}

export interface PromptArea {
  id: string;
  title: string;
  prompts: PromptItem[];
}

export interface PromptPack {
  title: string;
  published: string;
  intro: string;
  areas: PromptArea[];
}

export interface KitMessage {
  id: string;
  title: string;
  text: string;
}

export interface KitFlow {
  tool: string;
  title: string;
  steps: string[];
}

export interface KitPack {
  readme: string;
  messages: KitMessage[];
  flows: KitFlow[];
  csv: string;
}

const TOOL_LABEL: Record<string, string> = {
  chatgpt: 'ChatGPT',
  manychat: 'ManyChat',
  notion: 'Notion',
  n8n: 'n8n',
  capcut: 'CapCut',
};

interface PdfLine {
  text: string;
  font: 'F1' | 'F2';
  size: number;
  gap: number;
}

function encodeWinAnsi(text: string): number[] {
  const bytes: number[] = [];
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0x3f;
    if (code <= 0x7f || (code >= 0xa0 && code <= 0xff)) bytes.push(code);
    else if (WIN1252_EXTRA[code]) bytes.push(WIN1252_EXTRA[code]);
    else bytes.push(0x3f);
  }
  return bytes;
}

function pdfLiteral(text: string): string {
  let out = '(';
  for (const byte of encodeWinAnsi(text)) {
    if (byte === 0x28 || byte === 0x29 || byte === 0x5c) out += `\\${String.fromCharCode(byte)}`;
    else if (byte < 32 || byte > 126) out += `\\${byte.toString(8).padStart(3, '0')}`;
    else out += String.fromCharCode(byte);
  }
  return `${out})`;
}

function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }
    let current = '';
    for (const word of paragraph.split(/\s+/)) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function promptLines(pack: PromptPack): PdfLine[] {
  const lines: PdfLine[] = [
    { text: pack.title, font: 'F2', size: 18, gap: 24 },
    { text: `Publicado ${pack.published} · Omar Álvarez`, font: 'F1', size: 10, gap: 16 },
  ];
  for (const row of wrap(pack.intro, 88)) {
    lines.push({ text: row, font: 'F1', size: 10, gap: 13 });
  }
  lines.push({ text: '', font: 'F1', size: 10, gap: 8 });

  let number = 0;
  for (const area of pack.areas) {
    lines.push({ text: area.title, font: 'F2', size: 13, gap: 18 });
    for (const prompt of area.prompts) {
      number += 1;
      lines.push({ text: `${number}. ${prompt.title}`, font: 'F2', size: 11, gap: 14 });
      for (const row of wrap(prompt.text, 92)) {
        lines.push({ text: row, font: 'F1', size: 10, gap: 13 });
      }
      lines.push({ text: '', font: 'F1', size: 10, gap: 8 });
    }
  }
  return lines;
}

function paginate(lines: PdfLine[]): PdfLine[][] {
  const pages: PdfLine[][] = [];
  let current: PdfLine[] = [];
  let used = 0;
  const limit = PAGE_H - MARGIN - 56;
  for (const line of lines) {
    if (used + line.gap > limit && current.length) {
      pages.push(current);
      current = [];
      used = 0;
    }
    current.push(line);
    used += line.gap;
  }
  if (current.length) pages.push(current);
  return pages.length ? pages : [[{ text: '', font: 'F1', size: 10, gap: 12 }]];
}

function pageStream(lines: PdfLine[], pageNumber: number, total: number): string {
  const commands = [
    'BT',
    '/F1 9 Tf',
    `1 0 0 1 ${MARGIN} ${PAGE_H - 32} Tm`,
    `${pdfLiteral('omaralvarezo.co/herramientas-ia')} Tj`,
    'ET',
  ];
  let y = PAGE_H - MARGIN;
  for (const line of lines) {
    if (line.text) {
      commands.push('BT', `/${line.font} ${line.size} Tf`, `1 0 0 1 ${MARGIN} ${y} Tm`, `${pdfLiteral(line.text)} Tj`, 'ET');
    }
    y -= line.gap;
  }
  commands.push(
    'BT',
    '/F1 9 Tf',
    `1 0 0 1 ${MARGIN} 28 Tm`,
    `${pdfLiteral(`${pageNumber} / ${total}`)} Tj`,
    'ET',
  );
  return commands.join('\n');
}

export function buildPdf(pageStreams: string[]): Uint8Array {
  const count = pageStreams.length;
  const objects: string[] = new Array(4 + count * 2 + 1);
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

  const pageIds: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const contentId = 5 + index * 2;
    const pageId = contentId + 1;
    pageIds.push(pageId);
    const stream = pageStreams[index];
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
  }
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${count} >>`;

  let body = '%PDF-1.4\n';
  const offsets = [0];
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = body.length;
    body += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = body.length;
  body += `xref\n0 ${objects.length}\n`;
  body += '0000000000 65535 f \n';
  for (let id = 1; id < objects.length; id += 1) {
    body += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }
  body += `trailer << /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Uint8Array.from(body, (char) => char.charCodeAt(0));
}

export function buildPromptsPdf(pack: PromptPack): Uint8Array {
  const pages = paginate(promptLines(pack));
  return buildPdf(pages.map((lines, index) => pageStream(lines, index + 1, pages.length)));
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function zipStore(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const crc = crc32(file.data);
    const local = new Uint8Array(30 + name.length + file.data.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(8, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, file.data.length, true);
    view.setUint32(22, file.data.length, true);
    view.setUint16(26, name.length, true);
    local.set(name, 30);
    local.set(file.data, 30 + name.length);
    parts.push(local);

    const entry = new Uint8Array(46 + name.length);
    const centralView = new DataView(entry.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, file.data.length, true);
    centralView.setUint32(24, file.data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, offset, true);
    entry.set(name, 46);
    central.push(entry);
    offset += local.length;
  }

  const centralSize = central.reduce((sum, entry) => sum + entry.length, 0);
  const eocd = new Uint8Array(22);
  const endView = new DataView(eocd.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);

  const out = new Uint8Array(offset + centralSize + eocd.length);
  let cursor = 0;
  for (const part of [...parts, ...central, eocd]) {
    out.set(part, cursor);
    cursor += part.length;
  }
  return out;
}

function textFile(value: string): Uint8Array {
  return new TextEncoder().encode(value.endsWith('\n') ? value : `${value}\n`);
}

export function renderKitMessages(messages: KitMessage[]): string {
  return [
    'Mensajes de WhatsApp',
    'Completa los corchetes. No dejes un precio, una hora o un kilometraje que no hayas escrito tú.',
    '',
    ...messages.flatMap((message, index) => [`${index + 1}. ${message.title}`, message.text, '']),
  ].join('\n');
}

export function renderKitFlows(flows: KitFlow[]): string {
  return [
    'Flujos con herramientas del directorio',
    'Cada herramienta hace una pieza. Ninguna administra el taller sola.',
    '',
    ...flows.flatMap((flow, index) => {
      const label = TOOL_LABEL[flow.tool] || flow.tool;
      return [
        `${index + 1}. ${flow.title}`,
        `Herramienta: ${label} · /herramientas-ia/${flow.tool}`,
        ...flow.steps.map((step, stepIndex) => `${stepIndex + 1}) ${step}`),
        '',
      ];
    }),
  ].join('\n');
}

export function buildKitZip(prompts: PromptPack, kitPack: KitPack): Uint8Array {
  const csv = kitPack.csv.charCodeAt(0) === 0xfeff ? kitPack.csv : `\uFEFF${kitPack.csv}`;
  return zipStore([
    { name: 'leeme.txt', data: textFile(kitPack.readme) },
    { name: 'prompts-ia-talleres-detailing-pymes.pdf', data: buildPromptsPdf(prompts) },
    { name: 'mensajes-whatsapp.txt', data: textFile(renderKitMessages(kitPack.messages)) },
    { name: 'flujos.txt', data: textFile(renderKitFlows(kitPack.flows)) },
    { name: 'seguimiento-clientes.csv', data: textFile(csv) },
  ]);
}

export function promptCount(pack: PromptPack): number {
  return pack.areas.reduce((sum, area) => sum + area.prompts.length, 0);
}
